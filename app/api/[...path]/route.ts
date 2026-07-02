import { cookies } from 'next/headers'
import { NextResponse, type NextRequest } from 'next/server'
import { ACCESS_TOKEN_MAX_AGE, AUTH_ERROR, cookieOptions, refreshTokens, unauthorizedResponse } from '@/src/shared/lib/auth'

export { handler as GET, handler as POST, handler as PUT, handler as PATCH, handler as DELETE }

/**
 * 모든 HTTP 메서드(GET/POST/PUT/PATCH/DELETE)의 공통 진입점이다.
 * 비동기 `params`를 풀어 실제 프록시 처리(`handleProxy`)로 위임한다.
 * @param req 들어온 요청
 * @param ctx `params`로 비동기 전달되는 라우트 컨텍스트
 */
const handler = (req: NextRequest, { params }: { params: Promise<{ path: string[] }> }) => params.then((p) => handleProxy(req, p))

/**
 * 들어온 요청을 원본 API 서버로 프록시하는 함수이다.
 * `access_token` 쿠키로 1차 요청하고, 인증 실패(REST 401 / GraphQL 200+errors)면 `refresh_token`으로 갱신해 재요청한다.
 * 갱신마저 실패하면 토큰 쿠키를 비우고 401을 반환한다.
 * @param req 들어온 요청
 * @param params `[...path]`로 매칭된 경로 세그먼트 배열
 * @returns 원본 응답 `NextResponse`
 */
const handleProxy = async (req: NextRequest, { path: pathSegments }: { path: string[] }) => {
  const path = pathSegments?.join('/') ?? ''
  const target = `${process.env.API_URL}/api/${path}${req.nextUrl.search}`
  const isGraphql = path === 'graphql'

  const hasBody = !['GET', 'HEAD'].includes(req.method)
  const body = hasBody ? await req.arrayBuffer() : undefined

  const cookieStore = await cookies()
  const cacheOptions = resolveCache(req)

  const send = (accessToken?: string) =>
    fetch(target, {
      method: req.method,
      headers: buildHeaders(req, accessToken),
      body,
      ...cacheOptions
    })

  try {
    let response = await send(cookieStore.get('access_token')?.value)
    let text = await response.text()

    // 인증 실패(REST 401 / GraphQL 200+errors)면 refresh_token으로 갱신 후 한 번 재요청한다.
    if (isAuthFailure(response, text, isGraphql)) {
      const refreshToken = cookieStore.get('refresh_token')?.value
      const newTokens = refreshToken ? await refreshTokens(refreshToken) : null
      if (!newTokens) return unauthorizedResponse(cookieStore)
      cookieStore.set('access_token', newTokens.accessToken, cookieOptions(ACCESS_TOKEN_MAX_AGE))
      response = await send(newTokens.accessToken)
      text = await response.text()
    }

    return buildResponse(response, text)
  } catch (error) {
    console.error('BFF Error:', error)
    return NextResponse.json({ ok: false, error: { code: AUTH_ERROR.INTERNAL } }, { status: 500 })
  }
}

/**
 * 토큰 갱신이 필요한 인증 실패인지 판별하는 함수이다.
 * REST는 HTTP 401, GraphQL은 200 + errors[].extensions.code(`token_expired`/`invalid_auth_token`)로 온다.
 */
const GRAPHQL_AUTH_ERROR_CODES = new Set<string>([AUTH_ERROR.TOKEN_EXPIRED, 'invalid_auth_token'])
const isAuthFailure = (response: Response, body: string, isGraphql: boolean): boolean => {
  if (!isGraphql || !response.ok) return false // GraphQL이 아니거나 200이 아닌 경우는 인증 실패 아님

  if (response.status === 401) return true // REST 인증 실패인 경우

  // GraphQL 인증 실패: 200 + errors[].extensions.code(`token_expired`/`invalid_auth_token`)
  try {
    const { errors }: { errors?: Array<{ extensions?: { code?: string } }> } = JSON.parse(body)
    return (
      errors?.some((error) => {
        const code = error.extensions?.code
        return code !== undefined && GRAPHQL_AUTH_ERROR_CODES.has(code)
      }) ?? false
    )
  } catch {
    return false
  }
}

/**
 * 요청 헤더(`x-proxy-revalidate`, `x-proxy-tags`)를 읽어 원본 fetch에 적용할 캐시 옵션을 만드는 함수이다.
 * GET이 아니거나 캐시 지시가 없으면 `no-store`, 있으면 `next.revalidate`/`next.tags`로 변환한다.
 * @param req 들어온 요청
 * @returns fetch에 spread할 캐시 옵션
 * @example
 * ```ts
 * // x-proxy-revalidate: '60' 헤더가 있으면
 * resolveCache(req); // { next: { revalidate: 60 } }
 * ```
 */
const resolveCache = (req: NextRequest): RequestInit => {
  if (req.method !== 'GET') return { cache: 'no-store' }

  const revalidate = req.headers.get('x-proxy-revalidate')
  const tags = req.headers.get('x-proxy-tags')
  if (revalidate === null && !tags) return { cache: 'no-store' }

  return {
    next: {
      ...(revalidate !== null ? { revalidate: revalidate === 'false' ? false : Number(revalidate) } : {}),
      ...(tags ? { tags: tags.split(',') } : {})
    }
  }
}

/**
 * 원본 서버로 보낼 요청 헤더를 구성하는 함수이다.
 * `content-type`을 전달하고 `Accept`를 지정하며, `accessToken`이 있으면 `Authorization: Bearer`를 붙인다.
 * @param req 들어온 요청
 * @param accessToken Bearer로 첨부할 액세스 토큰(없으면 미첨부)
 * @returns 구성된 `Headers`
 */
const buildHeaders = (req: NextRequest, accessToken?: string) => {
  const headers = new Headers()
  const contentType = req.headers.get('content-type')
  if (contentType) headers.set('content-type', contentType)
  headers.set('Accept', 'application/json')
  if (accessToken) headers.set('Authorization', `Bearer ${accessToken}`)
  return headers
}

/**
 * 원본 응답과 미리 읽어둔 body 문자열로 클라이언트 응답을 만드는 함수이다.
 * `content-type`·`Set-Cookie`를 보존하며, 204/304 같은 null-body 상태는 body 없이 재구성한다
 * (`new NextResponse('', { status: 204 })`는 예외를 던지므로).
 * @param res 원본 서버 응답(헤더 참조용)
 * @param body 이미 읽어둔 응답 본문 문자열
 * @returns 클라이언트로 반환할 `NextResponse`
 */
const buildResponse = (res: Response, body: string) => {
  const headers = new Headers({ 'content-type': res.headers.get('content-type') ?? 'application/json' })
  const setCookie = res.headers.getSetCookie?.() ?? []
  setCookie.forEach((c) => headers.append('set-cookie', c))
  const isNullBody = res.status === 204 || res.status === 304
  return new NextResponse(isNullBody ? null : body, { status: res.status, headers })
}

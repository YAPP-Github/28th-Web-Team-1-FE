import { cookies } from 'next/headers'
import { NextResponse, type NextRequest } from 'next/server'
import { ACCESS_TOKEN_MAX_AGE, AUTH_ERROR, cookieOptions, refreshTokens, unauthorizedResponse } from '@/src/shared/lib/auth'

export { handler as GET, handler as POST, handler as PUT, handler as PATCH, handler as DELETE }

const API_URL = process.env.API_URL

/**
 * 모든 HTTP 메서드(GET/POST/PUT/PATCH/DELETE)의 공통 진입점이다.
 * 비동기 `params`를 풀어 실제 프록시 처리(`handleProxy`)로 위임한다.
 * @param req 들어온 요청
 * @param ctx `params`로 비동기 전달되는 라우트 컨텍스트
 */
const handler = (req: NextRequest, { params }: { params: Promise<{ path: string[] }> }) => params.then((p) => handleProxy(req, p))

/**
 * 들어온 요청을 원본 API 서버로 프록시하는 함수이다.
 * `access_token` 쿠키로 1차 요청하고, 401이면 `refresh_token`으로 토큰을 갱신해 재요청한다.
 * 갱신마저 실패하면 토큰 쿠키를 비우고 401을 반환한다.
 * @param req 들어온 요청
 * @param params `[...path]`로 매칭된 경로 세그먼트 배열
 * @returns 원본 응답 `NextResponse`
 */
const handleProxy = async (req: NextRequest, { path: pathSegments }: { path: string[] }) => {
  const path = pathSegments?.join('/') ?? ''
  const target = `${API_URL}/api/${path}${req.nextUrl.search}`

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

    if (response.status === 401) {
      const refreshToken = cookieStore.get('refresh_token')?.value
      const newTokens = refreshToken ? await refreshTokens(refreshToken) : null
      if (!newTokens) return unauthorizedResponse(cookieStore)
      cookieStore.set('access_token', newTokens.accessToken, cookieOptions(ACCESS_TOKEN_MAX_AGE))
      response = await send(newTokens.accessToken)
    }

    return passthrough(response)
  } catch (error) {
    console.error('BFF Error:', error)
    return NextResponse.json({ ok: false, error: { code: AUTH_ERROR.INTERNAL } }, { status: 500 })
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
 * 원본 서버 응답을 클라이언트로 그대로 중계하는 함수이다.
 * `content-type`과 `Set-Cookie` 헤더를 보존해 새 `NextResponse`를 만든다.
 * @param res 원본 서버 응답
 * @returns 클라이언트로 반환할 `NextResponse`
 */
const passthrough = async (res: Response) => {
  if (res.status === 204) return new NextResponse(null, { status: 204 })
  const body = await res.text()
  const headers = new Headers({ 'content-type': res.headers.get('content-type') ?? 'application/json' })
  const setCookie = res.headers.getSetCookie?.() ?? []
  setCookie.forEach((c) => headers.append('set-cookie', c))
  return new NextResponse(body, { status: res.status, headers })
}

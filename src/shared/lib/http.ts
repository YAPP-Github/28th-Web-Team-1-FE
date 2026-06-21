/**
 * BFF 라우트(`/api/[...path]`)를 거쳐 API를 호출하는 HTTP 클라이언트이다.
 * 각 메서드는 경로와 옵션을 받아 응답 본문의 `result`를 반환한다.
 * @example
 * ```ts
 * const user = await http.get<User>('/api/v1/users/me'); // 캐시 없이 조회
 * const posts = await http.get<Post[]>('/api/v1/posts', { revalidate: 60 }); // 60초 캐시
 * await http.post('/api/v1/posts', { body: { title: '제목' } }); // body는 자동 직렬화
 * ```
 */
export const http = {
  get: <T>(path: string, opts?: RequestOptions) => request<T>(path, { ...opts, method: 'GET' }),
  post: <T>(path: string, opts?: RequestOptions) => request<T>(path, { ...opts, method: 'POST' }),
  put: <T>(path: string, opts?: RequestOptions) => request<T>(path, { ...opts, method: 'PUT' }),
  patch: <T>(path: string, opts?: RequestOptions) => request<T>(path, { ...opts, method: 'PATCH' }),
  delete: <T>(path: string, opts?: RequestOptions) => request<T>(path, { ...opts, method: 'DELETE' })
}

const isServer = typeof window === 'undefined'

export interface ApiErrorDetail {
  field: string
  reason: string
}

export interface RequestOptions extends Omit<RequestInit, 'body'> {
  body?: unknown
  revalidate?: number | false
  tags?: string[]
}

export class ApiError extends Error {
  status: number
  code: string
  details?: ApiErrorDetail[]

  constructor(status: number, code: string, details?: ApiErrorDetail[]) {
    super(code)
    this.name = 'ApiError'
    this.status = status
    this.code = code
    this.details = details
  }
}

/**
 * 요청 body를 fetch에 넘길 형태로 직렬화하는 함수이다.
 * `FormData`는 그대로 두고, 나머지 값은 JSON 문자열로 변환한다.
 * @param body 직렬화할 요청 본문
 * @returns fetch의 body로 사용할 값(본문이 없으면 `undefined`)
 * @example
 * ```ts
 * serializeBody({ id: 1 }); // '{"id":1}'
 * serializeBody(formData); // formData (그대로 반환)
 * ```
 */
const serializeBody = (body: unknown): BodyInit | undefined => {
  if (body === undefined) return undefined
  if (body instanceof FormData) return body
  return JSON.stringify(body)
}

/**
 * 서버 환경에서 현재 요청의 `baseUrl`과 Cookie 헤더 문자열을 구성하는 함수이다.
 * 같은 출처의 BFF 라우트를 절대 URL로 호출하고 쿠키를 전달하기 위해 사용한다.
 * @returns `baseUrl`(프로토콜+호스트)과 직렬화된 `cookie` 문자열
 * @example
 * ```ts
 * await getServerContext(); // { baseUrl: 'https://example.com', cookie: 'access_token=...' }
 * ```
 */
const getServerContext = async (): Promise<{ baseUrl: string; cookie: string }> => {
  const { headers, cookies } = await import('next/headers')
  const [headerStore, cookieStore] = await Promise.all([headers(), cookies()])
  const host = headerStore.get('x-forwarded-host') ?? headerStore.get('host')
  const protocol = headerStore.get('x-forwarded-proto') ?? 'http'
  return { baseUrl: `${protocol}://${host}`, cookie: cookieStore.toString() }
}

/**
 * 모든 API 요청의 공통 처리기이다. 같은 출처의 BFF 라우트(`/api/[...path]`)를 거쳐 원본 서버로 프록시된다.
 * 서버에서는 절대 URL과 쿠키를, 클라이언트에서는 `credentials`를 붙이고, `revalidate`/`tags`는 캐시 제어 헤더로 전달한다.
 * 응답이 실패하면 `ApiError`를 던지고, 성공하면 본문의 `result`를 반환한다.
 * @param path 호출할 API 경로
 * @param options 요청 옵션(`body`, `headers`, `revalidate`, `tags` 등)
 * @returns 응답 본문의 `result`
 * @example
 * ```ts
 * const user = await request<User>('/api/v1/users/me', { method: 'GET' });
 * ```
 */
const request = async <T = unknown>(path: string, options: RequestOptions = {}): Promise<T> => {
  const { body, headers, revalidate, tags, ...rest } = options
  const isFormData = body instanceof FormData

  const server = isServer ? await getServerContext() : null

  const response = await fetch(`${server?.baseUrl ?? ''}${path}`, {
    ...rest,
    ...(!isServer && { credentials: 'include' }),
    headers: {
      ...(!isFormData && { 'Content-Type': 'application/json' }),
      ...(server?.cookie ? { Cookie: server.cookie } : {}),
      ...(revalidate !== undefined ? { 'x-proxy-revalidate': String(revalidate) } : {}),
      ...(tags?.length ? { 'x-proxy-tags': tags.join(',') } : {}),
      ...headers
    },
    body: serializeBody(body)
  })

  const data = await response.json().catch(() => null)

  if (!response.ok || data?.ok === false) {
    const code = data?.ok === false ? data.error.code : 'internal_error'
    const details = data?.ok === false ? data.error.details : undefined
    throw new ApiError(response.status, code, details)
  }

  return data?.result
}

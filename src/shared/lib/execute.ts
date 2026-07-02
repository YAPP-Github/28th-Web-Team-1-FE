import type { TypedDocumentString } from './gql/graphql'
import { AUTH_ERROR } from './auth'
import { ApiError, getServerContext, type ApiErrorDetail } from './http'

const isServer = typeof window === 'undefined'

interface GraphQLResponse<T> {
  data?: T | null
  error?: { code: string; details?: ApiErrorDetail[] }
  errors?: Array<{ extensions?: { code?: string; details?: ApiErrorDetail[] } }>
}

/**
 * GraphQL 요청을 실행하는 클라이언트이다.
 * BFF 라우트(`/api/[...path]`)를 거쳐 API를 호출하며,
 * 오류가 있으면 `ApiError`를 던지고, 없으면 `data`를 반환한다.
 * @param query codegen `graphql(...)`으로 만든 타입 있는 문서
 * @param variables 쿼리 변수(변수가 없는 쿼리는 생략)
 * @returns 응답 본문의 `data`
 * @example
 * ```ts
 * const data = await execute(myUserDocument); // { me: { ... } }
 * const list = await execute(experiencesDocument, { workspaceId, size: 20 });
 * ```
 */
export const execute = async <TResult, TVariables>(query: TypedDocumentString<TResult, TVariables>, variables?: TVariables): Promise<TResult> => {
  const server = isServer ? await getServerContext() : null

  const response = await fetch(`${server?.baseUrl ?? ''}/api/graphql`, {
    method: 'POST',
    ...(!isServer && { credentials: 'include' }),
    headers: { 'Content-Type': 'application/json', ...(server?.cookie ? { Cookie: server.cookie } : {}) },
    body: JSON.stringify({ query, variables })
  })

  const body: GraphQLResponse<TResult> | null = await response.json().catch(() => null)

  // 프록시 REST 봉투(`error`, 세션 만료 401) 또는 GraphQL(`errors`)이 있으면 오류로 처리한다.
  if (!response.ok || body?.error || body?.errors?.length) {
    const error = body?.error ?? body?.errors?.[0]?.extensions
    throw new ApiError(response.status, error?.code ?? AUTH_ERROR.INTERNAL, error?.details)
  }

  return body?.data as TResult
}

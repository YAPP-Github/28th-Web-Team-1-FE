import type { TypedDocumentString } from './gql/graphql'
import { AUTH_ERROR } from './auth'
import { ApiError, getServerContext, type ApiErrorDetail } from './http'

const isServer = typeof window === 'undefined'

/** GraphQL 오류 항목의 `extensions`. 애플리케이션 에러 코드와 필드별 상세를 담는다. */
interface GraphQLErrorExtensions {
  code?: string
  details?: ApiErrorDetail[]
}

/** GraphQL 응답의 `errors[]` 한 항목. */
interface GraphQLResponseError {
  message: string
  path?: string[]
  extensions?: GraphQLErrorExtensions
}

/** GraphQL 응답 봉투. 성공 시 `data`, 오류 시 `errors`가 채워진다. */
interface GraphQLResponse<T> {
  data?: T | null
  errors?: GraphQLResponseError[]
}

/**
 * BFF 프록시(`app/api/[...path]/route.ts`)가 실패 시 반환하는 REST 봉투.
 * 세션 만료 후 토큰 갱신까지 실패하면 프록시가 GraphQL `{ errors }`가 아니라 이 모양(HTTP 401)으로 응답한다.
 * `http.ts`의 `request()`가 읽는 것과 동일한 형태이다.
 */
interface ProxyErrorEnvelope {
  ok?: false
  error?: { code: string; details?: ApiErrorDetail[] }
}

/**
 * GraphQL 요청을 실행하는 클라이언트이다.
 * `errors`가 있으면 `extensions.code`를 담아 `ApiError`를 던지고, 없으면 `data`를 반환한다.
 * @param query codegen `graphql(...)`으로 만든 타입 있는 문서
 * @param variables 쿼리 변수(변수가 없는 쿼리는 생략)
 * @returns 응답 본문의 `data`
 * @example
 * ```ts
 * const data = await execute(MyUserDocument); // { myUser: { ... } }
 * const list = await execute(ExperiencesDocument, { workspaceId, size: 20 });
 * ```
 */
export const execute = async <TResult, TVariables>(query: TypedDocumentString<TResult, TVariables>, variables?: TVariables): Promise<TResult> => {
  const server = isServer ? await getServerContext() : null

  const response = await fetch(`${server?.baseUrl ?? ''}/api/graphql`, {
    method: 'POST',
    ...(!isServer && { credentials: 'include' }),
    headers: {
      'Content-Type': 'application/json',
      ...(server?.cookie ? { Cookie: server.cookie } : {})
    },
    body: JSON.stringify({ query: query, variables })
  })

  const body: (GraphQLResponse<TResult> & ProxyErrorEnvelope) | null = await response.json().catch(() => null)

  if (!response.ok) {
    // 프록시가 인증 실패 시 주는 REST 봉투(`{ ok:false, error }`)를 먼저 읽고, 없으면 GraphQL `errors[]`로 폴백한다.
    const gqlExtensions = body?.errors?.[0]?.extensions
    throw new ApiError(response.status, body?.error?.code ?? gqlExtensions?.code ?? AUTH_ERROR.INTERNAL, body?.error?.details ?? gqlExtensions?.details)
  }

  if (body?.errors?.length) {
    const [error] = body.errors
    throw new ApiError(response.status, error.extensions?.code ?? AUTH_ERROR.INTERNAL, error.extensions?.details)
  }

  return body?.data as TResult
}

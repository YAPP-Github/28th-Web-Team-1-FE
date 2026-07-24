import type { TypedDocumentString } from './gql/graphql'
import { AUTH_ERROR } from './auth-error'
import { ApiError, getServerContext, type ApiErrorDetail } from './http'
import { GraphQLError, type GraphQLErrorObject } from './graphql-error'

const isServer = typeof window === 'undefined'

interface GraphQLResponse<T> {
  data?: T | null
  // BFF 자체 실패(500/401 폴백) 형태
  error?: { code: string; message?: string; details?: ApiErrorDetail[] }
  // 원본 서버의 GraphQL 에러(그대로)
  errors?: GraphQLErrorObject[]
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

  const body: GraphQLResponse<TResult> = await response.json().catch(() => ({}))

  // GraphQL 에러는 서버 객체를 그대로 담아 던지고, BFF 자체 에러(폴백)는 ApiError로 던진다.
  if (body.errors?.length) {
    throw new GraphQLError(response.status, body.errors)
  }
  if (!response.ok || body.error) {
    throw new ApiError(response.status, body.error?.code ?? AUTH_ERROR.INTERNAL, { details: body.error?.details, message: body.error?.message })
  }

  return body.data as TResult
}

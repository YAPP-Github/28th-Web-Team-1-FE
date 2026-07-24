import { AUTH_ERROR } from './auth-error'
import { ApiError, type ApiErrorDetail } from './http'

/**
 * GraphQL 에러의 `extensions`. 서버가 `code`/`details` 외 커스텀 필드를 줄 수 있어 인덱스 시그니처를 둔다.
 */
export interface GraphQLErrorExtensions {
  code?: string
  details?: ApiErrorDetail[]
  [key: string]: unknown
}

/**
 * 서버가 내려주는 GraphQL 에러 객체(그대로).
 * @example
 * ```json
 * { "message": "입력한 내용을 다시 확인해 주세요.", "path": ["experiences"],
 *   "extensions": { "code": "invalid_arguments", "details": [{ "field": "size", "reason": "1 이상이어야 합니다." }] } }
 * ```
 */
export interface GraphQLErrorObject {
  message: string
  path?: Array<string | number>
  extensions?: GraphQLErrorExtensions
}

/**
 * GraphQL 응답의 `errors`를 그대로 담는 에러다. 서버가 준 `message`/`path`/`extensions`에
 * 클라이언트에서 바로 접근할 수 있고, 기존 `ApiError`(status/code/details)와 호환되도록 상속한다.
 * 첫 번째 에러를 대표값(`message`/`code`/`details`/`path`/`extensions`)으로 노출하고, 전체 배열은 `errors`에 보존한다.
 * @example
 * ```ts
 * onError: (error) => {
 *   if (error instanceof GraphQLError) {
 *     toast(error.message)                 // 서버 메시지 그대로
 *     if (error.code === 'invalid_arguments') highlightFields(error.details)
 *   }
 * }
 * ```
 */
export class GraphQLError extends ApiError {
  readonly path?: Array<string | number>
  readonly extensions?: GraphQLErrorExtensions
  readonly errors: GraphQLErrorObject[]

  constructor(status: number, errors: GraphQLErrorObject[]) {
    const [first] = errors
    super(status, first?.extensions?.code ?? AUTH_ERROR.INTERNAL, { details: first?.extensions?.details, message: first?.message })
    this.name = 'GraphQLError'
    this.path = first?.path
    this.extensions = first?.extensions
    this.errors = errors
  }
}

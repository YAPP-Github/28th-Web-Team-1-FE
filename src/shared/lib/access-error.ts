import { GraphQLError } from './graphql-error'

// TODO : GraphQL 서버에서 내려주는 에러 코드가 바뀌면 이 목록도 바꿔야 한다. (서버와 클라이언트가 의존하는 부분)
const ACCESS_DENIED_CODES = [
  'workspace_access_denied', // 워크스페이스 자체에 접근 권한이 없는 경우
  'experience_project_not_found' // 워크스페이스엔 접근 가능하지만 그 안에 요청한 프로젝트/경험이 없는 경우
]

/**
 * 권한이 없는지 확인하는 헬퍼 함수 (권한 에러는 ACCESS_DENIED_CODES에 정의된 코드로 내려온다)
 * @param error `execute`가 던진 에러(주로 `ErrorBoundary`의 fallback에서 받는 값)
 * @example
 * ```tsx
 * <ErrorBoundary fallback={({ error }) => (isAccessDeniedError(error) ? <AccessDeniedFallback /> : <ErrorFallback title="..." />)}>
 * ```
 */
export const isAccessDeniedError = (error: unknown): error is GraphQLError => error instanceof GraphQLError && ACCESS_DENIED_CODES.includes(error.code)

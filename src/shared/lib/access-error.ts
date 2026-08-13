import { GraphQLError } from './graphql-error'

// TODO : GraphQL API Reference(공통 에러 코드 문서)가 바뀌면 이 맵도 맞춰서 바꿔야 한다. (서버와 클라이언트가 의존하는 부분)
const ACCESS_DENIED_MESSAGES: Record<string, string> = {
  workspace_access_denied: '이 워크스페이스에 접근할 권한이 없어요.',
  experience_project_not_found: '존재하지 않는 프로젝트에요.',
  resume_not_found: '존재하지 않는 이력서에요.'
}

/**
 * 권한이 없는지 확인하는 헬퍼 함수 (권한 에러는 ACCESS_DENIED_MESSAGES에 정의된 코드로 내려온다)
 * @param error `execute`가 던진 에러(주로 `ErrorBoundary`의 fallback에서 받는 값)
 * @example
 * ```tsx
 * <ErrorBoundary fallback={({ error }) => (isAccessDeniedError(error) ? <AccessDeniedFallback error={error} /> : <ErrorFallback title="..." />)}>
 * ```
 */
export const isAccessDeniedError = (error: unknown): error is GraphQLError => error instanceof GraphQLError && error.code in ACCESS_DENIED_MESSAGES

/**
 * 접근 거부 에러 코드에 대응하는 사용자 메시지를 돌려준다. 페이지마다 문구를 따로 들지 않도록 코드로 고정한다.
 * @param error `isAccessDeniedError`로 걸러진 `GraphQLError`
 */
export const getAccessDeniedMessage = (error: GraphQLError): string => ACCESS_DENIED_MESSAGES[error.code]

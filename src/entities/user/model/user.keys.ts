/** user 도메인 TanStack Query 키 팩토리. 키 문자열이 흩어지지 않게 한 곳에서 관리한다. */
export const userKeys = {
  all: ['user'] as const,
  me: () => [...userKeys.all, 'me'] as const
}

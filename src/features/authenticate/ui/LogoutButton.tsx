import { logout } from '../lib/logout'

/**
 * 로그아웃 버튼 컴포넌트이다.
 * 클릭하면 로그아웃 서버 액션을 실행해 토큰 쿠키를 비우고 홈으로 이동한다.
 */
export const LogoutButton = () => {
  return (
    <form action={logout}>
      {/* TODO: 버튼 스타일링은 추후 디자인 시스템에 맞춰 수정한다. */}
      <button type="submit" className="rounded-md border border-gray-300 bg-white px-6 py-3 font-medium text-gray-700 shadow-sm transition hover:bg-gray-50">
        로그아웃
      </button>
    </form>
  )
}

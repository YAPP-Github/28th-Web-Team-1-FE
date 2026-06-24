import { userAPI } from '@/src/entities'
import { GoogleLoginButton, LogoutButton } from '@/src/features/authenticate'

export const HomePage = async () => {
  const data = await userAPI.getUserInfo()

  return (
    <div className="flex h-screen flex-col items-center justify-center">
      <h1 className="mb-4 text-4xl font-bold">Welcome to the Home Page</h1>
      <p className="mb-8 text-lg text-gray-600">This is the main landing page of our application.</p>
      {data ? (
        <div className="flex flex-col items-center gap-3">
          <div className="flex items-center">
            <span>{data.name}</span>
            <img src={data.profileImageUrl} alt="Profile" className="ml-2 h-8 w-8 rounded-full" />
          </div>
          <LogoutButton />
        </div>
      ) : (
        <div className="flex space-x-4">
          <div className="flex flex-col items-center">
            <span>홈으로 돌아오는 로그인 버튼</span>
            <GoogleLoginButton />
          </div>
          <div className="flex flex-col items-center">
            <span>특정 URL로 이동하는 로그인 버튼</span>
            <GoogleLoginButton redirectTo="/jdurl" />
          </div>
        </div>
      )}
    </div>
  )
}

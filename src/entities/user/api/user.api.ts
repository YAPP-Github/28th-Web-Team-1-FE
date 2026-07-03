import { execute, graphql, http } from '@shared/lib'
import type { UserInfo } from '../model/user.types'

const myUserDocument = graphql(`
  query Me {
    me {
      userId
      name
      profileImageUrl
      email
      workspaces {
        workspaceId
      }
    }
  }
`)
export const userAPI = {
  // 두 개는 같은 데이터를 가져옵니다.
  getUserInfo: () => http.get<UserInfo>('/api/v1/users/me').catch(() => null),
  getMe: () => execute(myUserDocument).catch(() => null)
}

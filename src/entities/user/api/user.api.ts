import { execute, graphql, http } from '@/src/shared/lib'
import type { UserInfo } from '../model/user.types'

const myUserDocument = graphql(`
  query Me {
    me {
      userId
      name
      profileImageUrl
    }
  }
`)

export const userAPI = {
  getUserInfo: () => http.get<UserInfo>('/api/v1/users/me').catch(() => null),
  getMe: () => execute(myUserDocument)
}

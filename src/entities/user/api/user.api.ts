import { graphql } from '@/src/shared/api'
import { execute, http } from '@/src/shared/lib'
import type { UserInfo } from '../model/user.types'

/** 로그인한 사용자 정보를 조회하는 GraphQL 문서. 타입은 codegen이 생성한다. */
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

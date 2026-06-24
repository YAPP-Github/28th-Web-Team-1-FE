import { http } from '@/src/shared/lib'
import type { UserInfo } from '../model/user.types'

export const userAPI = {
  getUserInfo: () => http.get<UserInfo>('/api/v1/users/me').catch(() => null)
}

'use client'

import { useRouter } from 'next/navigation'
import { useQueryClient } from '@tanstack/react-query'
import * as amplitude from '@amplitude/unified'
import { userKeys } from '@entities/user'
import { logout } from '../lib/logout'

type UseLogoutOptions = {
  redirectTo?: string
}

export const useLogout = ({ redirectTo = '/' }: UseLogoutOptions = {}) => {
  const { replace } = useRouter()
  const queryClient = useQueryClient()

  const handleLogout = async () => {
    await logout()
    queryClient.removeQueries({ queryKey: userKeys.all })
    amplitude.reset()
    replace(redirectTo)
  }

  return { handleLogout }
}

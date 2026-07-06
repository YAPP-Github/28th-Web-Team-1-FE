'use client'

import { useRouter } from 'next/navigation'
import { useQueryClient } from '@tanstack/react-query'
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
    replace(redirectTo)
  }

  return { handleLogout }
}

'use client'
import { useState } from 'react'
import { useGoogleLoginRedirect } from '@features/authenticate'

const MOBILE_QUERY = '(max-width: 767px)'

/** 로그인 CTA 클릭 처리. 모바일이면 차단 다이얼로그를 띄우고, 아니면 바로 구글 로그인으로 보낸다. */
export const useLoginCta = () => {
  const [isOpen, setIsOpen] = useState(false)
  const startLogin = useGoogleLoginRedirect()

  const handleClick = () => {
    if (window.matchMedia(MOBILE_QUERY).matches) setIsOpen(true)
    else startLogin()
  }

  return { isOpen, setIsOpen, handleClick }
}

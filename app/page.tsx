'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

// Todo: 랜딩 페이지 자리 Test를 위해서 바로 /home으로 이동하도록 설정. 추후 랜딩 페이지 제작 시 제거 필요
const Page = () => {
  const { push } = useRouter()

  useEffect(() => {
    push('/home')
  }, [push])

  return <h1>Hello, Next.js!</h1>
}

export default Page

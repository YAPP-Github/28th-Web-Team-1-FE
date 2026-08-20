'use client'
import { useEffect } from 'react'
import * as amplitude from '@amplitude/unified'
import { useMeQuery } from '@entities/user'

/** 로그인한 유저의 userId를 Amplitude User ID로 등록한다. 기기가 바뀌어도 Amplitude에서 같은 유저로 묶이게 하기 위함.*/
export const AmplitudeIdentify = () => {
  const { data } = useMeQuery()

  useEffect(() => {
    if (data?.me.userId) amplitude.setUserId(data.me.userId)
  }, [data?.me.userId])

  return null
}

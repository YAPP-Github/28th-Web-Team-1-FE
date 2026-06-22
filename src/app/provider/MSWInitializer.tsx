'use client'

import { useEffect } from 'react'
import { initBrowserMSW } from '@shared/mocks'

export const MSWInitializer = () => {
  useEffect(() => {
    void initBrowserMSW()
  }, [])

  return null
}

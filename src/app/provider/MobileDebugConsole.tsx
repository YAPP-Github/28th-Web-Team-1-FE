'use client'
import Script from 'next/script'

declare global {
  interface Window {
    eruda?: { init: () => void }
  }
}

/** URL에 `?debug=1`이 붙으면 화면 위에 콘솔/네트워크/엘리먼트를 볼 수 있는 플로팅 패널(eruda)을 띄운다. 컴퓨터 없이 실기기에서 바로 디버깅하기 위한 용도. */
export const MobileDebugConsole = () => {
  const isEnabled = typeof window !== 'undefined' && new URLSearchParams(window.location.search).get('debug') === '1'

  if (!isEnabled) return null

  return (
    <Script
      src="https://cdn.jsdelivr.net/npm/eruda@3/eruda.min.js"
      integrity="sha384-F7xQBvh3l6dG/mMD6QPIeVmXtzWT4Ce3ZDu8ysPuzMWMx9bFOIMGnRPUhLuQipss"
      crossOrigin="anonymous"
      strategy="afterInteractive"
      onLoad={() => window.eruda?.init()}
    />
  )
}

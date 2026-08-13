'use client'
import Script from 'next/script'

const KAKAO_JS_KEY = process.env.NEXT_PUBLIC_KAKAO_JS_KEY

/** 카카오톡 공유(나에게 보내기) 기능을 위해 Kakao JS SDK를 로드하고 초기화한다. 키가 없으면 아무 것도 하지 않는다. */
export const KakaoSdkInitializer = () => {
  if (!KAKAO_JS_KEY) return null

  return (
    <Script
      src="https://t1.kakaocdn.net/kakao_js_sdk/2.7.6/kakao.min.js"
      integrity="sha384-WAtVcQYcmTO/N+C1N+1m6Gp8qxh+3NlnP7X1U7qP6P5dQY/MsRBNTh+e1ahJrkEm"
      crossOrigin="anonymous"
      strategy="afterInteractive"
      onLoad={() => {
        if (!window.Kakao?.isInitialized()) window.Kakao?.init(KAKAO_JS_KEY)
      }}
    />
  )
}

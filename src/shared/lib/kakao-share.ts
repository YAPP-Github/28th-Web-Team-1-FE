declare global {
  interface Window {
    Kakao?: {
      init: (key: string) => void
      isInitialized: () => boolean
      Share: {
        sendCustom: (settings: { templateId: number; templateArgs?: Record<string, string> }) => void
      }
    }
  }
}

const KAKAO_SEND_TO_ME_TEMPLATE_ID = process.env.NEXT_PUBLIC_KAKAO_SEND_TO_ME_TEMPLATE_ID

/**
 * 카카오톡 '나에게 보내기'로 링크를 보낸다. SDK는 `KakaoSdkInitializer`(app/provider)가 로드·초기화하며, 준비 전이면 아무것도 하지 않는다.
 *
 * @param url 메시지 템플릿의 `URL` 인자로 넘길 링크
 * @example
 * sendKakaoMessageToMe(window.location.href)
 */
export const sendKakaoMessageToMe = (url: string) => {
  if (!KAKAO_SEND_TO_ME_TEMPLATE_ID || !window.Kakao?.isInitialized()) return

  window.Kakao.Share.sendCustom({
    templateId: Number(KAKAO_SEND_TO_ME_TEMPLATE_ID),
    templateArgs: { URL: url }
  })
}

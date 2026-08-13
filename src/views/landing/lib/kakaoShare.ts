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

export const sendKakaoMessageToMe = () => {
  if (!KAKAO_SEND_TO_ME_TEMPLATE_ID || !window.Kakao?.isInitialized()) return

  window.Kakao.Share.sendCustom({
    templateId: Number(KAKAO_SEND_TO_ME_TEMPLATE_ID),
    templateArgs: { URL: window.location.origin }
  })
}

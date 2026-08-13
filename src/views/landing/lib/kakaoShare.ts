declare global {
  interface Window {
    Kakao?: {
      init: (key: string) => void
      isInitialized: () => boolean
      Share: {
        sendDefault: (settings: {
          objectType: 'feed'
          content: {
            title: string
            description: string
            imageUrl: string
            link: { mobileWebUrl: string; webUrl: string }
          }
          buttons: Array<{ title: string; link: { mobileWebUrl: string; webUrl: string } }>
        }) => void
      }
    }
  }
}

export const sendKakaoMessageToMe = () => {
  if (!window.Kakao?.isInitialized()) return

  const url = window.location.origin

  window.Kakao.Share.sendDefault({
    objectType: 'feed',
    content: {
      title: 'SCOOP - 떠먹여 주는 이력서',
      description: '카카오톡으로 받은 링크를 PC에서 열어 이어서 진행해 보세요.',
      imageUrl: `${url}/ogImage.png`,
      link: { mobileWebUrl: url, webUrl: url }
    },
    buttons: [{ title: 'PC에서 이어하기', link: { mobileWebUrl: url, webUrl: url } }]
  })
}

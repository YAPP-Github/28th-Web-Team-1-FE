import { Font } from '@react-pdf/renderer'

/**
 * react-pdf는 자체 렌더러라 앱의 웹폰트(next/font)를 공유하지 않는다.
 * 게다가 `public/font`의 Pretendard는 UI 글자만 담은 subset woff2라
 * (react-pdf가 woff2 미지원이자 임의 한글이 깨짐) PDF에는 전체 TTF를 별도로 등록한다.
 *
 * 폰트 패밀리 이름은 `Pretendard`로 고정하고, 웹과 동일하게 400/600/700 세 굵기를 매핑한다.
 */
const FONT_FAMILY = 'Pretendard'

let hasRegistered = false

/** Font.register는 전역 상태를 건드리므로 한 번만 실행되도록 가드한다. */
export const registerPdfFonts = () => {
  if (hasRegistered) return
  hasRegistered = true

  Font.register({
    family: FONT_FAMILY,
    fonts: [
      { src: '/font/Pretendard-Regular.ttf', fontWeight: 400 },
      { src: '/font/Pretendard-SemiBold.ttf', fontWeight: 600 },
      { src: '/font/Pretendard-Bold.ttf', fontWeight: 700 }
    ]
  })

  // 한글은 CJK라 단어 사이 공백이 드물어 긴 내용이 페이지 밖으로 넘칠 수 있다.
  // 글자 단위 줄바꿈을 허용해 잘림을 막는다.
  Font.registerHyphenationCallback((word) => [word])
}

export { FONT_FAMILY }

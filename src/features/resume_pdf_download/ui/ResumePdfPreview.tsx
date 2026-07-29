'use client'
import dynamic from 'next/dynamic'
import { Flex } from '@radix-ui/themes'
import { Text } from '@shared/ui'

/**
 * `ResumePdfViewer`(react-pdf 기반, 무거움)를 감싼 지연 로드 래퍼.
 *
 * react-pdf가 초기 번들·SSR에 포함되지 않도록 `next/dynamic` + `ssr:false` 동적 경계로만 로드한다.
 * (배럴이 이 래퍼만 정적으로 export 하므로, 실체 뷰어와 react-pdf는 동적 청크에만 들어간다.)
 */
// dynamic()이 반환한 컴포넌트라 린터가 React 컴포넌트(PascalCase)로 인식하지 못해 이 줄만 예외 처리한다.
// eslint-disable-next-line @typescript-eslint/naming-convention
export const ResumePdfPreview = dynamic(() => import('./ResumePdfViewer').then((module) => module.ResumePdfViewer), {
  ssr: false,
  loading: () => (
    <Flex align={'center'} justify={'center'} className={'bg-bg-gray-subtler flex-1'}>
      <Text variant={'label1'} color={'text-subtle'}>
        미리보기를 불러오는 중...
      </Text>
    </Flex>
  )
})

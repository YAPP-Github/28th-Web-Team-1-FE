'use client'
import { useMemo } from 'react'
import { PDFViewer } from '@react-pdf/renderer'
import type { ResumeBasicInfoFieldsFragment } from '@shared/lib/gql/graphql'
import type { ResumeSectionData } from '@entities/resume'
import { ResumePdfDocument } from './ResumePdfDocument'
import { registerPdfFonts } from '../lib/registerPdfFonts'

// 이 모듈은 ssr:false 동적 경계 뒤에서 클라이언트에서만 로드된다(브라우저 전용 Font.register 안전).
registerPdfFonts()

interface ResumePdfViewerProps {
  basicInfo: ResumeBasicInfoFieldsFragment | null
  sections: ResumeSectionData[]
}

/**
 * 다운로드와 100% 동일한 결과를 보여주기 위해, 미리보기를 DOM으로 다시 그리지 않고
 * 실제 PDF 문서(`ResumePdfDocument`)를 react-pdf `<PDFViewer>`(iframe)로 렌더한다.
 * 페이지 분할·폰트·여백이 다운로드본과 그대로 일치하며, 스크롤도 뷰어 내부에서 처리된다.
 */
export const ResumePdfViewer = ({ basicInfo, sections }: ResumePdfViewerProps) => {
  // PDFViewer는 children 엘리먼트가 바뀔 때마다 PDF를 재생성하므로 문서 엘리먼트를 메모이즈한다.
  const document = useMemo(() => <ResumePdfDocument basicInfo={basicInfo} sections={sections} />, [basicInfo, sections])

  return (
    <PDFViewer showToolbar={false} className={'h-full w-full border-0'}>
      {document}
    </PDFViewer>
  )
}

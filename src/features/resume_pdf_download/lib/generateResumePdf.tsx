import { pdf } from '@react-pdf/renderer'
import { ResumePdfDocument, type ResumePdfDocumentProps } from '../ui/ResumePdfDocument'
import { registerPdfFonts } from './registerPdfFonts'

interface GenerateResumePdfParams extends ResumePdfDocumentProps {
  companyName?: string | null
  positionTitle?: string | null
}

/** 다운로드 파일명 `{기업명}_{직무명}_이력서.pdf`. 비어 있는 부분은 건너뛰고, 둘 다 없으면 `이력서.pdf`. OS 금지 문자는 제거한다. */
const buildFileName = (companyName?: string | null, positionTitle?: string | null): string => {
  const sanitize = (value?: string | null) => value?.trim().replace(/[\\/:*?"<>|]/g, '') ?? ''
  const parts = [sanitize(companyName), sanitize(positionTitle)].filter(Boolean)
  return `${[...parts, '이력서'].join('_')}.pdf`
}

/**
 * 이력서 데이터를 PDF Blob으로 렌더한 뒤 브라우저 다운로드를 트리거한다.
 * `@react-pdf/renderer`는 브라우저 전용이라 이 모듈은 클라이언트에서 동적 import로만 불러야 한다.
 */
export const generateResumePdf = async ({ basicInfo, sections, companyName, positionTitle }: GenerateResumePdfParams): Promise<void> => {
  registerPdfFonts()

  const blob = await pdf(<ResumePdfDocument basicInfo={basicInfo} sections={sections} />).toBlob()

  const url = URL.createObjectURL(blob)
  try {
    const anchor = document.createElement('a')
    anchor.href = url
    anchor.download = buildFileName(companyName, positionTitle)
    document.body.appendChild(anchor)
    anchor.click()
    anchor.remove()
  } finally {
    // 다운로드 시작 후 objectURL 해제 (즉시 revoke하면 일부 브라우저에서 다운로드가 취소됨)
    setTimeout(() => URL.revokeObjectURL(url), 1000)
  }
}

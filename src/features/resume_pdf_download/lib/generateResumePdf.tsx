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

// File System Access API의 showSaveFilePicker는 아직 표준 lib.dom 타입에 포함되지 않아 최소한으로 선언한다.
interface SaveFilePickerOptions {
  suggestedName?: string
  types?: Array<{ description?: string; accept: Record<string, string[]> }>
}
type ShowSaveFilePicker = (options?: SaveFilePickerOptions) => Promise<FileSystemFileHandle>

const getSaveFilePicker = (): ShowSaveFilePicker | null => {
  if (typeof window === 'undefined') return null
  const picker = (window as unknown as { showSaveFilePicker?: ShowSaveFilePicker }).showSaveFilePicker
  return typeof picker === 'function' ? picker : null
}

/**
 * 이력서 데이터를 PDF Blob으로 렌더한 뒤 저장한다.
 *
 * File System Access API를 지원하는 브라우저(Chrome·Edge 등)에서는 사용자가 저장 폴더와 파일명을
 * 직접 고르는 '다른 이름으로 저장' 대화상자를 띄우고, 미지원 브라우저(Safari·Firefox·모바일 등)에서는
 * 기존처럼 기본 다운로드 폴더로 내려받는다.
 *
 * `@react-pdf/renderer`는 브라우저 전용이라 이 모듈은 클라이언트에서 동적 import로만 불러야 한다.
 *
 * @returns 저장을 마치면 true, 사용자가 저장 위치 대화상자를 취소하면 false
 */
export const generateResumePdf = async ({ basicInfo, sections, companyName, positionTitle }: GenerateResumePdfParams): Promise<boolean> => {
  registerPdfFonts()

  const blob = await pdf(<ResumePdfDocument basicInfo={basicInfo} sections={sections} />).toBlob()
  const fileName = buildFileName(companyName, positionTitle)

  const showSaveFilePicker = getSaveFilePicker()
  if (showSaveFilePicker) {
    let handle: FileSystemFileHandle
    try {
      handle = await showSaveFilePicker({
        suggestedName: fileName,
        types: [{ description: 'PDF 문서', accept: { 'application/pdf': ['.pdf'] } }]
      })
    } catch (error) {
      // 사용자가 저장 위치 대화상자를 닫으면 AbortError가 발생한다. 실패가 아니므로 조용히 종료한다.
      if (error instanceof DOMException && error.name === 'AbortError') return false
      throw error
    }

    const writable = await handle.createWritable()
    await writable.write(blob)
    await writable.close()
    return true
  }

  // File System Access API 미지원 브라우저: 기본 다운로드 폴더로 저장한다.
  const url = URL.createObjectURL(blob)
  try {
    const anchor = document.createElement('a')
    anchor.href = url
    anchor.download = fileName
    document.body.appendChild(anchor)
    anchor.click()
    anchor.remove()
  } finally {
    // 다운로드 시작 후 objectURL 해제 (즉시 revoke하면 일부 브라우저에서 다운로드가 취소됨)
    setTimeout(() => URL.revokeObjectURL(url), 1000)
  }
  return true
}

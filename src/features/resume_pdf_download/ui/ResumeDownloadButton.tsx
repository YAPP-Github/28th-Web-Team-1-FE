'use client'
import { useState } from 'react'
import { toast } from 'sonner'
import { Download, Loader2 } from 'lucide-react'
import { Button } from '@shared/ui'
import type { ResumeBasicInfoFieldsFragment } from '@shared/lib/gql/graphql'
import type { ResumeSectionData } from '@entities/resume'

interface ResumeDownloadButtonProps {
  basicInfo: ResumeBasicInfoFieldsFragment | null
  sections: ResumeSectionData[]
  // 다운로드 파일명 `{기업명}_{직무명}_이력서.pdf`에 사용
  companyName?: string | null
  positionTitle?: string | null
}

/**
 * 이력서를 PDF로 내려받는 버튼. 상세(resume_detail) 툴바에서 사용한다.
 *
 * `@react-pdf/renderer`는 브라우저 전용이자 번들이 무거워, 초기 로드에 포함하지 않고
 * 클릭 시점에 생성 로직을 동적 import 한다(코드 스플리팅 + SSR 회피).
 */
export const ResumeDownloadButton = ({ basicInfo, sections, companyName, positionTitle }: ResumeDownloadButtonProps) => {
  const [isGenerating, setIsGenerating] = useState(false)

  const handleDownload = async () => {
    if (isGenerating) return
    setIsGenerating(true)
    try {
      const { generateResumePdf } = await import('../lib/generateResumePdf')
      await generateResumePdf({ basicInfo, sections, companyName, positionTitle })
      toast.success('이력서 다운로드가 완료되었습니다.')
    } catch (error) {
      console.error('이력서 PDF 생성 실패', error)
      toast.error('PDF를 만드는 중 문제가 발생했어요. 잠시 후 다시 시도해 주세요.')
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <Button variant="primary" size="md" className="leading-0" onClick={handleDownload} disabled={isGenerating}>
      {isGenerating ? <Loader2 size={18} className="inline-block animate-spin" data-icon="inline-start" /> : <Download size={18} className="inline-block" data-icon="inline-start" />}
      {isGenerating ? '생성 중...' : '다운로드'}
    </Button>
  )
}

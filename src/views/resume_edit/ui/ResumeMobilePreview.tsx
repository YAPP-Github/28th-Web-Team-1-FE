'use client'
import { useCallback, useEffect, useRef, useState, type Ref } from 'react'
import { useAnimate, useReducedMotion } from 'motion/react'
import { Flex } from '@radix-ui/themes'
import { FileCheckCorner, Plus, XIcon } from 'lucide-react'
import { toast } from 'sonner'
import { Button, Divider, Spacing, Text } from '@shared/ui'
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@shared/ui/dialog'
import { sendKakaoMessageToMe } from '@shared/lib'
import { AMPLITUDE_EVENTS } from '@shared/config'
import type { ResumeBasicInfoFieldsFragment, ResumeQuery } from '@shared/lib/gql/graphql'
import { toPreviewSections, useResumeDetail, useUpdateResume, type ResumeSectionData } from '@entities/resume'
import { useGenerateCoreCompetency } from '@entities/profile'
import { useWorkspaceId } from '@entities/user'
import { ResumeBasicInfoHeader, ResumeSectionView } from '@widgets/resume_preview'
import { useResumeDraftViewedTracking } from '../hooks/useResumeDraftViewedTracking'
import { createFormItem, nextDisplayOrder, type ResumeFormValues } from '../model/resume-form.types'
import { needsCoreCompetency } from '../model/coreCompetency'
import { resumeToFormValues } from '../model/resumeToFormValues'
import { formToSaveInput } from '../model/formToSaveInput'
import { CoreSkillPreviewSection } from './CoreSkillPreviewSection'

import * as amplitude from '@amplitude/unified'

/**
 * 모바일 폭 전용 이력서 편집 화면. 편집은 막고 서버 이력서를 읽기 전용 미리보기로만 보여준다.
 * 미리보기·바텀시트·'이력서 완료'를 건드리면 PC에서 이어 하도록 카카오톡 나에게 보내기 다이얼로그를 띄운다.
 * @example
 * ```tsx
 * <ResumeMobilePreview resumeId={resumeId} />
 * ```
 */
export const ResumeMobilePreview = ({ resumeId }: { resumeId: string }) => {
  const workspaceId = useWorkspaceId()
  const { resume } = useResumeDetail(workspaceId, resumeId)
  useResumeDraftViewedTracking(resume)
  useGenerateCoreCompetencyOnEntry(workspaceId, resumeId, resume)

  const { basicInfoSection, bodySections } = toPreviewSections(resume.sections)
  const { isOpen, onOpenChange, sheetRef, openWithSheetPeek } = useContinueOnPcDialog()

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <ContinueOnPcDialogContent />
      <Flex direction={'column'} className={'bg-bg-gray-subtler h-full flex-1 overflow-hidden'}>
        <header className={'bg-bg-white border-btn-outline-border flex items-center justify-between border-b px-5 py-3'}>
          <Flex direction={'column'} className={'gap-0.5'}>
            <Text variant={'heading2'}>{resume.targetJd?.companyName ?? '이력서'}</Text>
            <Text variant={'body2'} color={'text-subtle'}>
              {resume.targetJd?.positionTitle ?? '포지션'}
            </Text>
          </Flex>
          <DialogTrigger asChild>
            <Button variant={'primary'} size={'sm'}>
              <FileCheckCorner data-icon="inline-start" />
              이력서 완료
            </Button>
          </DialogTrigger>
        </header>

        <ScaledResumePage basicInfo={basicInfoSection?.items[0]?.payload.basicInfo ?? null} sections={bodySections} onClick={openWithSheetPeek} />
        <SectionBottomSheet ref={sheetRef} sections={basicInfoSection ? [basicInfoSection, ...bodySections] : bodySections} onClick={openWithSheetPeek} />
      </Flex>
    </Dialog>
  )
}

interface ScaledResumePageProps {
  basicInfo: ResumeBasicInfoFieldsFragment | null
  sections: ResumeSectionData[]
  onClick: () => void
}
// PC 편집 화면 미리보기와 같은 이력서 페이지를 화면 폭에 맞게 축소해 세로 스크롤로 보여준다.
const ScaledResumePage = ({ basicInfo, sections, onClick }: ScaledResumePageProps) => {
  const [zoom, setZoom] = useState(1)
  const fitRef = useCallback((el: HTMLDivElement | null) => {
    if (!el) return
    const observer = new ResizeObserver(([entry]) => setZoom(entry.contentRect.width / 596)) // 596px는 이력서 페이지의 고정 폭
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return (
    <div ref={fitRef} className={'min-h-0 flex-1 overflow-y-auto px-5 py-5 contain-[inline-size]'}>
      <div onClick={onClick} style={{ zoom }} className={'bg-bg-white flex min-h-210.75 w-149 cursor-pointer flex-col p-7'}>
        <ResumeBasicInfoHeader basicInfo={basicInfo} />
        <Spacing size={12} />
        <Divider color={'gray-10'} />
        <Spacing size={12} />
        <Flex direction={'column'} gap="5">
          {sections.map((section) => (section.type === 'CORE_SKILL' ? <CoreSkillPreviewSection key={section.type} section={section} /> : <ResumeSectionView key={section.type} section={section} />))}
        </Flex>
      </div>
    </div>
  )
}

interface SectionBottomSheetProp {
  sections: Array<Pick<ResumeSectionData, 'type' | 'displayText'>>
  onClick: () => void
  ref: Ref<HTMLDivElement>
}
// 하단 섹션 바텀시트. 별도의 액션은 없다
const SectionBottomSheet = ({ sections, onClick, ref }: SectionBottomSheetProp) => (
  <div ref={ref} aria-hidden onPointerDown={onClick} className={'after:bg-bg-white relative cursor-pointer after:absolute after:inset-x-0 after:top-full after:h-28'}>
    <Flex direction={'column'} align={'center'} className={'bg-bg-white gap-4 rounded-t-md px-5 pt-2 pb-8 shadow-[0_-4px_6px_rgba(0,0,0,0.05)]'}>
      <div className={'bg-border-subtle h-0.75 w-12.5 rounded-full'} />
      <div className={'flex w-full flex-wrap gap-x-2 gap-y-2.5'}>
        {sections.map((section, index) => (
          <Button key={section.type} asChild variant={index === 0 ? 'secondary' : 'tertiary'} size={'xs'} className={index === 0 ? undefined : 'text-text-basic'}>
            <span>{section.displayText}</span>
          </Button>
        ))}
        <Button asChild variant={'tertiary'} size={'icon-xs'} className={'text-text-basic'}>
          <span>
            <Plus />
          </span>
        </Button>
      </div>
    </Flex>
  </div>
)

/** PC에서 이어 하도록 카카오톡 나에게 보내기로 현재 링크를 보내게 안내하는 다이얼로그 본문. */
const ContinueOnPcDialogContent = () => {
  const handleKakaoClick = () => {
    amplitude.track(AMPLITUDE_EVENTS.KAKAO_CLICKED, { trigger_source: 'resume_edit' })
    sendKakaoMessageToMe('https://scoop.me.kr/')
  }

  return (
    <DialogContent showCloseButton={false} className="max-w-[min(361px,calc(100%-2rem))] gap-1 p-5 text-center">
      <div className="flex justify-end">
        <DialogClose aria-label="닫기">
          <XIcon size={18} className="text-icon-gray-lighter" />
        </DialogClose>
      </div>
      <div className="flex flex-col gap-6">
        <DialogHeader className="gap-2">
          <DialogTitle className="text-heading2 text-text-basic font-semibold">이력서 편집은 PC에서 진행돼요</DialogTitle>
          <DialogDescription className="text-label1 text-text-subtler whitespace-pre-line">{'카카오톡 나에게 보내기한 뒤,\nPC에서 링크를 열어 이어가보세요'}</DialogDescription>
        </DialogHeader>
        <Button type="button" variant="text" size="lg" fullWidth className="text-text-basic rounded-lg border-none bg-[#FEE500] py-3 hover:bg-[#FEE500]/90" onClick={handleKakaoClick}>
          카카오톡 나에게 보내기
        </Button>
      </div>
    </DialogContent>
  )
}

// PC에서 이어 하기 다이얼로그의 열림 상태와 바텀시트 애니메이션을 관리한다.
const useContinueOnPcDialog = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [sheetRef, animate] = useAnimate<HTMLDivElement>()
  const shouldReduceMotion = useReducedMotion()

  const onOpenChange = (nextOpen: boolean) => {
    if (nextOpen) amplitude.track(AMPLITUDE_EVENTS.MOBILE_MODAL_VIEWED, { trigger_source: 'resume_edit' })
    setIsOpen(nextOpen)
  }

  const openWithSheetPeek = () => {
    onOpenChange(true)
    if (!shouldReduceMotion) animate(sheetRef.current, { y: [null, -60, 0] }, { duration: 0.8, ease: 'easeInOut' })
  }

  return { isOpen, onOpenChange, sheetRef, openWithSheetPeek }
}

// 핵심역량이 생성 전(isInitialItem)이면 진입 시 1회 생성해 바로 저장한다
const useGenerateCoreCompetencyOnEntry = (workspaceId: string, resumeId: string, resume: ResumeQuery['resume']) => {
  const { mutateAsync: generateCoreCompetency } = useGenerateCoreCompetency()
  const { mutateAsync: updateResume } = useUpdateResume(workspaceId, resumeId)
  const hasRunRef = useRef(false)

  useEffect(() => {
    if (hasRunRef.current) return
    hasRunRef.current = true

    const values = resumeToFormValues(resume)
    const jdId = resume.targetJd?.jdId
    if (!jdId || !needsCoreCompetency(values.sections)) return

    generateCoreCompetency({ workspaceId, jdId })
      .then(({ coreCompetency }) => updateResume(formToSaveInput(withCoreCompetency(values, coreCompetency), { status: resume.status, template: resume.template, targetJdId: jdId })))
      .catch(() => toast.error('핵심역량 생성에 실패했어요. 잠시 후 다시 시도해주세요.'))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
}

// 생성한 핵심역량을 CORE_SKILL 첫 항목에 넣은 폼 값을 돌려준다(PC applyCoreCompetencyToForm의 폼 없는 버전). 항목이 없으면 새로 만든다.
const withCoreCompetency = (values: ResumeFormValues, content: string): ResumeFormValues => ({
  sections: values.sections.map((section) => {
    if (section.type !== 'CORE_SKILL') return section
    const [first, ...rest] = section.items
    const coreSkill = { content, isInitialItem: false }
    const head = first ? { ...first, payload: { ...first.payload, coreSkill } } : createFormItem({ coreSkill }, nextDisplayOrder(section.items))
    return { ...section, items: [head, ...rest] }
  })
})

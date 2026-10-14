'use client'
import { useCallback, useState } from 'react'
import { Flex } from '@radix-ui/themes'
import { FileCheckCorner, XIcon } from 'lucide-react'
import { Button, Divider, Spacing, Text } from '@shared/ui'
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@shared/ui/dialog'
import { sendKakaoMessageToMe } from '@shared/lib'
import { AMPLITUDE_EVENTS } from '@shared/config'
import { toPreviewSections, useResumeDetail } from '@entities/resume'
import { useWorkspaceId } from '@entities/user'
import { ResumeBasicInfoHeader, ResumeSectionView } from '@widgets/resume_preview'
import { useResumeDraftViewedTracking } from '../hooks/useResumeDraftViewedTracking'

import * as amplitude from '@amplitude/unified'

/**
 * 모바일 폭 전용 이력서 편집 화면. 편집은 막고 서버 이력서를 읽기 전용 미리보기로만 보여준다.
 *
 * @example
 * ```tsx
 * <ResumeMobilePreview resumeId={resumeId} />
 * ```
 */
export const ResumeMobilePreview = ({ resumeId }: { resumeId: string }) => {
  const workspaceId = useWorkspaceId()
  const { resume } = useResumeDetail(workspaceId, resumeId)
  useResumeDraftViewedTracking(resume)

  const { basicInfoSection, bodySections } = toPreviewSections(resume.sections)
  const { ref: fitPageRef, zoom } = useFitPageZoom()

  return (
    <Dialog onOpenChange={(open) => open && amplitude.track(AMPLITUDE_EVENTS.MOBILE_MODAL_VIEWED, { trigger_source: 'resume_edit' })}>
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

        {/* inline-size containment: 축소 전(596px) 페이지가 부모 flex의 min-content를 밀어 올려 화면이 가로로 넘치면,
            모바일 브라우저가 페이지 전체를 축소해 헤더까지 작아진다. 폭을 부모 기준으로만 정하게 끊어 준다. */}
        <div ref={fitPageRef} className={'min-h-0 flex-1 overflow-y-auto px-5 py-5 contain-[inline-size]'}>
          <DialogTrigger asChild>
            <div role="button" tabIndex={0} style={{ zoom }} className={'bg-bg-white flex min-h-[843px] w-149 cursor-pointer flex-col p-7'}>
              <ResumeBasicInfoHeader basicInfo={basicInfoSection?.items[0]?.payload.basicInfo ?? null} />
              <Spacing size={12} />
              <Divider color={'gray-10'} />
              <Spacing size={12} />
              <Flex direction={'column'} gap="5">
                {bodySections.map((section) => (
                  <ResumeSectionView key={section.sectionId} section={section} />
                ))}
              </Flex>
            </div>
          </DialogTrigger>
        </div>
      </Flex>

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
          <Button
            type="button"
            variant="text"
            size="lg"
            fullWidth
            className="text-text-basic rounded-lg border-none bg-[#FEE500] py-3 hover:bg-[#FEE500]/90"
            onClick={() => {
              amplitude.track(AMPLITUDE_EVENTS.KAKAO_CLICKED, { trigger_source: 'resume_edit' })
              sendKakaoMessageToMe(window.location.href)
            }}
          >
            카카오톡 나에게 보내기
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

/** PC 미리보기 페이지 폭(`w-149`). 모바일에서는 이 폭으로 그린 뒤 컨테이너 폭에 맞춰 축소한다. */
const PAGE_WIDTH = 596

/**
 * 컨테이너 콘텐츠 폭에 PC 미리보기 페이지가 꼭 맞도록 CSS `zoom` 배율을 계산한다.
 * `transform: scale`과 달리 `zoom`은 레이아웃 크기도 함께 줄어 스크롤 높이가 실제 보이는 크기와 맞는다.
 */
const useFitPageZoom = () => {
  const [zoom, setZoom] = useState(1)
  const ref = useCallback((el: HTMLDivElement | null) => {
    if (!el) return
    const observer = new ResizeObserver(([entry]) => setZoom(entry.contentRect.width / PAGE_WIDTH))
    observer.observe(el)
    return () => observer.disconnect()
  }, [])
  return { ref, zoom }
}

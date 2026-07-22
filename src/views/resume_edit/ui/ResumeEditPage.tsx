'use client'
import { Suspense, useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import { Flex } from '@radix-ui/themes'
import { ErrorBoundary } from '@sentry/nextjs'
import { FormProvider, useForm, useFormContext, useWatch } from 'react-hook-form'
import { toast } from 'sonner'
import { FileCheckCorner, RefreshCcw } from 'lucide-react'
import { Button, Divider, Spacing, Text } from '@shared/ui'
import { formatDate } from '@shared/lib'
import { useIntervalAutosave } from '@shared/hooks/useIntervalAutosave'
import type { ResumeBasicInfoFieldsFragment, ResumeQuery, ResumeStatusType } from '@shared/lib/gql/graphql'
import { useResumeDetail, useUpdateResume } from '@entities/resume'
import { useWorkspaceId } from '@entities/user'
import type { ResumeSectionData } from '../model/section'
import type { ResumeFormValues } from '../model/resume-form.types'
import { resumeToFormValues } from '../model/resumeToFormValues'
import { formToSaveInput } from '../model/formToSaveInput'
import { ResumeIndex } from './ResumeIndex'
import { ResumeSectionView } from './preview/ResumeSectionView'
import { ResumeSectionEdit } from './edit/ResumeSectionEdit'

export const ResumeEditPage = ({ resumeId }: { resumeId: string }) => {
  return (
    <Flex direction="column" className="h-full flex-1 overflow-hidden">
      <ErrorBoundary fallback={<ResumeFallback>이력서를 불러오는 데 실패했습니다.</ResumeFallback>}>
        <Suspense fallback={<ResumeFallback>불러오는 중...</ResumeFallback>}>
          <ResumeWorkspace resumeId={resumeId} />
        </Suspense>
      </ErrorBoundary>
    </Flex>
  )
}

// Todo: 로딩 스피너 교체
const ResumeFallback = ({ children }: { children: ReactNode }) => (
  <Flex align="center" justify="center" className="flex-1">
    <Text variant={'label1'} color={'text-subtle'}>
      {children}
    </Text>
  </Flex>
)

/**
 * 이력서 상세를 폼 초기값으로 삼아 편집 화면 전체를 하나의 react-hook-form으로 묶는다.
 * 미리보기·목차·편집이 모두 같은 폼 상태를 공유하므로, 편집이 폼 값에 반영되는 즉시 미리보기가 갱신된다.
 * 저장 액션은 폼 값을 전체 스냅샷(`SaveResumeInput`)으로 변환해 `updateResume`로 보낸다.
 */
const AUTOSAVE_INTERVAL_MS = 30_000

const ResumeWorkspace = ({ resumeId }: { resumeId: string }) => {
  const workspaceId = useWorkspaceId()
  const { resume } = useResumeDetail(workspaceId, resumeId)

  const defaultValues = useMemo(() => resumeToFormValues(resume), [resume])
  const form = useForm<ResumeFormValues>({ defaultValues })
  const { mutate: updateResume, mutateAsync: updateResumeAsync, isPending } = useUpdateResume(workspaceId, resumeId)

  // 마지막으로 저장에 성공한 시각(서버가 200 OK로 응답한 시점의 클라 시간). 수동·자동 저장 모두 갱신하며 툴바에 표시한다.
  const [lastSavedAt, setLastSavedAt] = useState<Date | null>(null)

  // 활성 섹션은 uid로 추적한다. 기존 섹션은 uid === sectionId라 초기값은 sectionId로 잡아도 된다.
  const [activeSectionUid, setActiveSectionUid] = useState<string | null>(() => {
    return resume.sections.find((s) => s.type === 'EXPERIENCE')?.sectionId ?? null
  })

  // 수동 저장은 '완료'(COMPLETED), 30초 자동저장은 '임시저장'(DRAFT)으로 상태를 구분해 보낸다.
  const buildSaveInput = useCallback(
    (values: ResumeFormValues, status: ResumeStatusType) => formToSaveInput(values, { status, template: resume.template, targetJdId: resume.targetJd?.jdId ?? null }),
    [resume.template, resume.targetJd?.jdId]
  )

  const handleSave = form.handleSubmit((values) => {
    updateResume(buildSaveInput(values, 'COMPLETED'), {
      onSuccess: () => {
        setLastSavedAt(new Date())
        toast.success('이력서가 저장되었습니다.', { position: 'top-center' })
        // TODO: 저장 완료 후 페이지 이동 추가 (예: router.push('/home'))
      },
      onError: (error) => toast.error(error.message, { position: 'top-center' })
    })
  })

  // 30초(AUTOSAVE_INTERVAL_MS)마다 변경분이 있으면 조용히 저장하고 저장 성공 시점의 시간으로 갱신한다(실패 시 다음 주기에 재시도).
  const markDirty = useIntervalAutosave(() => updateResumeAsync(buildSaveInput(form.getValues(), 'DRAFT')).then(() => setLastSavedAt(new Date())), {
    intervalMs: AUTOSAVE_INTERVAL_MS
  })

  // 폼 값이 바뀌면 '저장할 변경분 있음'으로 표시한다. 마운트 시에는 호출되지 않으므로 초기 저장은 발생하지 않는다.
  useEffect(() => form.subscribe({ formState: { values: true }, callback: () => markDirty() }), [form, markDirty])

  return (
    <FormProvider {...form}>
      <ResumeToolbar targetJd={resume.targetJd} onSave={() => void handleSave()} isSaving={isPending} lastSavedAt={lastSavedAt} />
      <main className="flex min-h-0 flex-1">
        <ResumeBoard activeSectionUid={activeSectionUid} onSelectSection={setActiveSectionUid} targetJdId={resume.targetJd?.jdId ?? null} />
      </main>
    </FormProvider>
  )
}

/**
 * 폼 값(`sections`)을 구독해 미리보기·목차·편집 영역에 실시간으로 흘려보낸다.
 * `BASIC_INFO`는 미리보기 헤더 전용이라 본문 섹션(`bodySections`)에서 분리한다.
 */
const ResumeBoard = ({ activeSectionUid, onSelectSection, targetJdId }: { activeSectionUid: string | null; onSelectSection: (sectionUid: string | null) => void; targetJdId: string | null }) => {
  const { control } = useFormContext<ResumeFormValues>()
  const sections = useWatch({ control, name: 'sections' }) ?? []

  const basicInfoSection = sections.find((section) => section.type === 'BASIC_INFO') ?? null
  const bodySections = sections.filter((section) => section.visible && section.type !== 'BASIC_INFO')

  // 활성 섹션은 '노출된' 섹션 중에서만 찾는다. 카테고리 삭제(숨김/제거)로 사라지면 활성에서 빠진다.
  const activeSectionIndex = sections.findIndex((section) => section.uid === activeSectionUid && section.visible)
  const activeSection = activeSectionIndex >= 0 ? sections[activeSectionIndex] : null

  // 미리보기 섹션 DOM을 uid로 등록해 두고, 선택 시 해당 섹션으로 스크롤한다.
  const sectionRefs = useRef(new Map<string, HTMLElement>())
  const registerSectionRef = useCallback((uid: string, el: HTMLElement | null) => {
    if (el) sectionRefs.current.set(uid, el)
    else sectionRefs.current.delete(uid)
  }, [])

  // 미리보기·미니맵에서 섹션을 선택하면 활성 상태를 바꾸고 해당 미리보기 섹션을 화면 안으로 스크롤한다.
  const selectSection = useCallback(
    (sectionUid: string) => {
      onSelectSection(sectionUid)
      sectionRefs.current.get(sectionUid)?.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
    },
    [onSelectSection]
  )

  // 포커스 중이던 카테고리가 삭제되면 남은 첫 노출 섹션으로 포커스를 옮긴다(없으면 해제).
  useEffect(() => {
    if (activeSectionUid !== null && activeSectionIndex < 0) {
      onSelectSection(bodySections[0]?.uid ?? null)
    }
  }, [activeSectionUid, activeSectionIndex, bodySections, onSelectSection])

  return (
    <>
      <ResumePreview basicInfoSection={basicInfoSection} sections={bodySections} activeSectionUid={activeSectionUid} onSelectSection={selectSection} registerSectionRef={registerSectionRef} />
      <ResumeIndex activeSectionUid={activeSectionUid} onSelectSection={selectSection} />
      <ResumeEdit section={activeSection} sectionIndex={activeSectionIndex} targetJdId={targetJdId} />
    </>
  )
}

interface ResumeToolbarProps {
  targetJd: ResumeQuery['resume']['targetJd']
  onSave: () => void
  isSaving: boolean
  lastSavedAt: Date | null
}

/** 편집 화면 상단 도구바. 이력서가 맞춤 대상으로 삼은 채용공고(targetJd)의 회사명·포지션과 저장 상태·액션을 보여준다. */
const ResumeToolbar = ({ targetJd, onSave, isSaving, lastSavedAt }: ResumeToolbarProps) => {
  return (
    <header className={'flex justify-between px-8 py-5'}>
      <Flex direction="column" justify="center" className={'gap-0.5'}>
        <Text variant="heading2">{targetJd?.companyName ?? '이력서'}</Text>
        {targetJd?.positionTitle && (
          <Text variant="body2" color="text-subtle">
            {targetJd.positionTitle}
          </Text>
        )}
      </Flex>

      <Flex align={'center'} gap="4">
        <Text variant="label2" color="text-subtler">
          <RefreshCcw className="mr-2.5 inline-block" size={16} />
          {lastSavedAt ? `${formatDate(lastSavedAt, 'HH:mm:ss')} 저장되었습니다.` : '변경 사항은 자동으로 저장됩니다.'}
        </Text>

        <Button variant="primary" size={'md'} className={'leading-0'} onClick={onSave} disabled={isSaving}>
          <FileCheckCorner size={18} className="inline-block" />
          이력서 저장
        </Button>
      </Flex>
    </header>
  )
}

interface ResumePreviewProps {
  basicInfoSection: ResumeSectionData | null
  sections: ResumeSectionData[]
  activeSectionUid: string | null
  onSelectSection: (sectionUid: string) => void
  registerSectionRef: (uid: string, el: HTMLElement | null) => void
}

const ResumePreview = ({ basicInfoSection, sections, activeSectionUid, onSelectSection, registerSectionRef }: ResumePreviewProps) => {
  const basicInfo = basicInfoSection?.items[0]?.payload.basicInfo ?? null

  return (
    <Flex align={'center'} className={'bg-bg-gray-subtler flex-1'}>
      <Flex direction={'column'} className={'bg-bg-white mx-auto h-[calc(100%-2rem)] w-149 min-w-149 overflow-y-auto p-7'}>
        {basicInfoSection ? (
          <SelectableArea sectionUid={basicInfoSection.uid} activeSectionUid={activeSectionUid} onSelect={onSelectSection} registerRef={registerSectionRef}>
            <ResumeBasicInfoHeader basicInfo={basicInfo} />
          </SelectableArea>
        ) : (
          <ResumeBasicInfoHeader basicInfo={basicInfo} />
        )}

        <Spacing size={12} />
        <Divider color={'gray-10'} />
        <Spacing size={12} />

        <Flex direction={'column'} gap="5">
          {sections.map((section) => (
            <SelectableArea key={section.uid} sectionUid={section.uid} activeSectionUid={activeSectionUid} onSelect={onSelectSection} registerRef={registerSectionRef}>
              <ResumeSectionView section={section} />
            </SelectableArea>
          ))}
        </Flex>
      </Flex>
    </Flex>
  )
}

interface SelectableAreaProps {
  sectionUid: string
  activeSectionUid: string | null
  onSelect: (sectionUid: string) => void
  registerRef: (uid: string, el: HTMLElement | null) => void
  children: ReactNode
}

/** 미리보기에서 클릭·키보드로 활성 섹션을 선택할 수 있게 감싸는 래퍼. `data-active`를 자식(Section)의 group-data 스타일이 읽는다. 미니맵 스크롤 이동을 위해 자기 DOM을 uid로 등록한다. */
const SelectableArea = ({ sectionUid, activeSectionUid, onSelect, registerRef, children }: SelectableAreaProps) => {
  const select = () => onSelect(sectionUid)

  return (
    <div
      ref={(el) => registerRef(sectionUid, el)}
      role="button"
      tabIndex={0}
      data-active={activeSectionUid === sectionUid}
      onClick={select}
      onKeyDown={(event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault()
          select()
        }
      }}
      className={'group cursor-pointer rounded-sm outline-none'}
    >
      {children}
    </div>
  )
}

const ResumeBasicInfoHeader = ({ basicInfo }: { basicInfo: ResumeBasicInfoFieldsFragment | null }) => {
  return (
    <section className={'group-data-[active=true]:bg-primary-5/50 group-data-[active=false]:hover:bg-gray-5/50 flex w-full justify-between rounded-sm p-3 transition-colors'}>
      <Text variant={'title1'}>{basicInfo?.name}</Text>

      {/* 연락처 숨김(hideContact) 시 전화·이메일 미표시. 값 자체는 폼에 보존된다. */}
      {!basicInfo?.hideContact && (
        <Flex direction="column" gap="2">
          {basicInfo?.phone && (
            <Text size={'1'} color={'gray-40'}>
              {basicInfo.phone}
            </Text>
          )}
          {basicInfo?.email && (
            <Text size={'1'} color={'gray-40'}>
              {basicInfo.email}
            </Text>
          )}
        </Flex>
      )}
    </section>
  )
}

const ResumeEdit = ({ section, sectionIndex, targetJdId }: { section: ResumeSectionData | null; sectionIndex: number; targetJdId: string | null }) => {
  return <Flex className={'bg-bg-white mx-auto w-160'}>{section ? <ResumeSectionEdit section={section} sectionIndex={sectionIndex} targetJdId={targetJdId} /> : null}</Flex>
}

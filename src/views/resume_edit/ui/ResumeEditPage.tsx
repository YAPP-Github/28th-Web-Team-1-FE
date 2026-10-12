'use client'
import { Suspense, useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import { Flex } from '@radix-ui/themes'
import { ErrorBoundary } from '@sentry/nextjs'
import { FormProvider, useFieldArray, useForm, useFormContext, useWatch, type UseFormReturn } from 'react-hook-form'
import { toast } from 'sonner'
import { FileCheckCorner, FileClock, RefreshCcw } from 'lucide-react'
import { Button, Text } from '@shared/ui'
import { formatDate, isAccessDeniedError, type GraphQLError } from '@shared/lib'
import { AMPLITUDE_EVENTS } from '@shared/config'
import { useIntervalAutosave } from '@shared/hooks/useIntervalAutosave'
import { useAccessDeniedRedirect } from '@shared/hooks/useAccessDeniedRedirect'
import type { ResumeQuery, ResumeStatusType } from '@shared/lib/gql/graphql'
import { useResumeDetail, useUpdateResume } from '@entities/resume'
import { useGenerateCoreCompetency } from '@entities/profile'
import { useWorkspaceId } from '@entities/user'
import { emptyItemPayload, nextDisplayOrder, type ResumeFormItem, type ResumeFormSection, type ResumeFormValues } from '../model/resume-form.types'
import { resumeToFormValues } from '../model/resumeToFormValues'
import { formToSaveInput } from '../model/formToSaveInput'
import { SetCategoryModal } from './SetCategoryModal'
import { ResumeSectionEdit } from './edit/ResumeSectionEdit'
import { ExperienceEditProvider, useExperienceEditState } from '../model/experienceEditContext'
import { TargetJdProvider } from '../model/targetJdContext'
import { useResumeDraftViewedTracking } from '../hooks/useResumeDraftViewedTracking'
import { useRouter } from 'next/navigation'
import { ResumePreview } from './preview/ResumePreview'

import * as amplitude from '@amplitude/unified'

/** `useWatch`가 아직 갱신 전(undefined)일 때 대체할 빈 배열. 매 렌더 새 배열을 만들면 하위 useEffect 의존성이 계속 뒤집힌다. */
const EMPTY_SECTIONS: ResumeFormSection[] = []

export const ResumeEditPage = ({ resumeId }: { resumeId: string }) => {
  return (
    <Flex direction="column" className="h-full flex-1 overflow-hidden">
      <ErrorBoundary fallback={({ error }) => (isAccessDeniedError(error) ? <ResumeAccessDeniedFallback error={error} /> : <ResumeFallback>Failed to load resume.</ResumeFallback>)}>
        <Suspense fallback={<ResumeFallback>불러오는 중...</ResumeFallback>}>
          <ResumeWorkspace resumeId={resumeId} />
        </Suspense>
      </ErrorBoundary>
    </Flex>
  )
}

// 다른 사람의 이력서 URL로 접근했을 때(존재하지 않는 이력서로 응답) 목록으로 돌려보낸다.
const ResumeAccessDeniedFallback = ({ error }: { error: GraphQLError }) => {
  useAccessDeniedRedirect(error, '/resumes')
  return null
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

/**
 * AI로 생성한 핵심역량 문단을 폼의 CORE_SKILL 섹션 첫 항목 content에 반영한다.
 * `setValue`가 dirty를 유발해 이후 자동저장/저장에 함께 반영된다.
 * - 항목이 없으면 빈 핵심역량 항목을 하나 추가해 채운다.
 * - CORE_SKILL 섹션 자체가 없으면(사용자가 제거) 아무것도 하지 않는다.
 */
const applyCoreCompetencyToForm = (form: UseFormReturn<ResumeFormValues>, coreCompetency: string) => {
  const sections = form.getValues('sections')
  const sectionIndex = sections.findIndex((section) => section.type === 'CORE_SKILL')
  if (sectionIndex < 0) return

  const items = sections[sectionIndex].items
  if (items.length === 0) {
    const newItem: ResumeFormItem = {
      uid: crypto.randomUUID(),
      itemId: null,
      displayOrder: nextDisplayOrder(items),
      visible: true,
      payload: { ...emptyItemPayload, coreSkill: { content: coreCompetency, isInitialItem: false } }
    }
    form.setValue(`sections.${sectionIndex}.items`, [newItem], { shouldDirty: true, shouldValidate: true })
    return
  }

  form.setValue(`sections.${sectionIndex}.items.0.payload.coreSkill.content`, coreCompetency, { shouldDirty: true, shouldValidate: true })
}

/**
 * CORE_SKILL 섹션에 '이력서 최초 생성 과정에서 만들어진' 아이템(isInitialItem)이 아직 남아 있으면
 * AI 핵심역량이 채워지지 않은 상태라 자동 생성이 필요하다.
 * 한번 생성하면 서버가 아이템을 비-초기로 기록하므로, 이후 진입에서는 사용자가 편집한 내용을 덮어쓰지 않는다.
 */
const needsCoreCompetency = (resume: ResumeQuery['resume']) => resume.sections.some((section) => section.type === 'CORE_SKILL' && section.items.some((item) => item.payload.coreSkill?.isInitialItem))

const ResumeWorkspace = ({ resumeId }: { resumeId: string }) => {
  const router = useRouter()
  const workspaceId = useWorkspaceId()
  const { resume } = useResumeDetail(workspaceId, resumeId)

  // 페이지 진입 시 Amplitude 이벤트 전송
  useResumeDraftViewedTracking(resume)

  const defaultValues = useMemo(() => resumeToFormValues(resume), [resume])
  const form = useForm<ResumeFormValues>({ defaultValues })
  const { mutate: updateResume, mutateAsync: updateResumeAsync, isPending } = useUpdateResume(workspaceId, resumeId)
  const { mutateAsync: generateCoreCompetency } = useGenerateCoreCompetency()

  const hasGeneratedRef = useRef(false)
  useEffect(() => {
    if (hasGeneratedRef.current) return
    hasGeneratedRef.current = true

    // 최초 생성 아이템(isInitialItem)이 아직 남아 있을 때만 생성한다. 이미 채워진(사용자 편집) 경우 재생성하지 않는다.
    // jdId는 서버에서 필수라 대상 JD가 없는 이력서는 생성하지 않는다.
    const jdId = resume.targetJd?.jdId
    if (!needsCoreCompetency(resume) || !jdId) return

    void generateCoreCompetency({ workspaceId, jdId })
      .then(({ coreCompetency }) => applyCoreCompetencyToForm(form, coreCompetency))
      .catch(() => toast.error('핵심역량 생성에 실패했어요. 잠시 후 다시 시도해주세요.'))
    // 페이지 진입 시 1회만 실행한다.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

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
    amplitude.track(AMPLITUDE_EVENTS.RESUME_COMPLETION_CLICKED, { jd_id: resume.targetJd?.jdId })
    updateResume(buildSaveInput(values, 'COMPLETED'), {
      onSuccess: () => {
        setLastSavedAt(new Date())
        toast.success('이력서가 저장되었습니다.', { position: 'top-center' })
        router.replace(`/resumes/${resumeId}`)
      },
      onError: (error) => toast.error(error.message, { position: 'top-center' })
    })
  })

  const saveDraft = () => updateResumeAsync(buildSaveInput(form.getValues(), 'DRAFT')).then(() => setLastSavedAt(new Date()))

  // 자동(30초 주기)·수동 임시저장이 같은 실행 경로를 쓰도록 통합한다. 두 요청이 겹치지 않고 직렬화된다.
  const { markDirty, saveNow } = useIntervalAutosave(saveDraft, { intervalMs: AUTOSAVE_INTERVAL_MS })

  // 수동 임시저장: 자동저장과 동일한 상태 머신(saveNow)을 거치고 성공/실패 토스트만 덧붙인다.
  const handleDraftSave = () => {
    void saveNow()
      .then(() => toast.success('이력서가 임시저장되었습니다.', { position: 'top-center' }))
      .catch((error: unknown) => toast.error(error instanceof Error ? error.message : '임시저장에 실패했어요.', { position: 'top-center' }))
  }

  // 폼 값이 바뀌면 '저장할 변경분 있음'으로 표시한다. 마운트 시에는 호출되지 않으므로 초기 저장은 발생하지 않는다.
  useEffect(() => form.subscribe({ formState: { values: true }, callback: () => markDirty() }), [form, markDirty])

  return (
    <FormProvider {...form}>
      <ResumeToolbar targetJd={resume.targetJd} onSave={handleSave} onDraftSave={handleDraftSave} isSaving={isPending} lastSavedAt={lastSavedAt} />
      <main className="flex min-h-0 flex-1">
        <TargetJdProvider targetJdId={resume.targetJd?.jdId ?? null}>
          <ResumeBoard activeSectionUid={activeSectionUid} onSelectSection={setActiveSectionUid} />
        </TargetJdProvider>
      </main>
    </FormProvider>
  )
}

/**
 * 폼 값(`sections`)을 구독해 미리보기와 편집 영역에 실시간으로 흘려보낸다.
 */
const ResumeBoard = ({ activeSectionUid, onSelectSection }: { activeSectionUid: string | null; onSelectSection: (sectionUid: string | null) => void }) => {
  const { control, getValues } = useFormContext<ResumeFormValues>()
  const { move: moveSection, replace: replaceSections } = useFieldArray({ control, name: 'sections' })
  const sections = useWatch({ control, name: 'sections' }) ?? EMPTY_SECTIONS

  /**
   * 활성 섹션 인덱스는 `useWatch` 스냅샷이 아니라 `getValues`로 계산한다.
   * reorder 직후 `useWatch`는 한 커밋 늦은 옛 배열을 돌려주는데, 그 창에서 옛 `sectionIndex`로 렌더된
   * 편집 컴포넌트의 `Controller`가 옛 경로(`sections.7.items.1|2.payload.experience.*`)를 `register`한다.
   * `_fields`는 이미 새 순서로 이동해 그 경로가 없어서, RHF가 `_defaultValues`에서 값을 복사해
   * `{ payload: ... }` 골격 아이템을 `_formValues`에 만들어 버리고, 그 자리는 다른 섹션이라
   * `visible`이 `undefined` → GraphQL null이 된다. `getValues`는 `move()`가 이미 반영한 현재 값을
   * 동기적으로 읽으므로 이 창이 생기지 않는다. 미리보기/목차 렌더는 계속 `useWatch`를 쓴다.
   */
  const liveSections = getValues('sections')
  const activeSectionIndex = liveSections.findIndex((section) => section.uid === activeSectionUid && section.visible)
  const activeSection = liveSections[activeSectionIndex] ?? null

  // 미리보기 섹션 DOM을 uid로 등록해 두고, 선택 시 해당 섹션으로 스크롤한다.
  const sectionRefs = useRef(new Map<string, HTMLElement>())
  const registerSectionRef = useCallback((uid: string, el: HTMLElement | null) => {
    if (el) sectionRefs.current.set(uid, el)
    else sectionRefs.current.delete(uid)
  }, [])

  // EXPERIENCE 편집 상태. 세부 규칙은 `useExperienceEditState`가 캡슐화하고, 여기서는 provider에 넘길 값만 쥔다.
  const { value: experienceEditValue, openManual } = useExperienceEditState()

  // 미리보기·미니맵에서 섹션을 선택하면 활성 상태를 바꾸고 해당 미리보기 섹션을 화면 안으로 스크롤한다.
  // EXPERIENCE를 클릭하면 '직접 작성' 뷰로 전환하고, item 래퍼를 클릭한 경우 그 item의 uid까지 담아 해당 item으로 이동시킨다.
  const selectSection = useCallback(
    (sectionUid: string, itemUid?: string) => {
      onSelectSection(sectionUid)
      sectionRefs.current.get(sectionUid)?.scrollIntoView({ behavior: 'smooth', block: 'nearest' })

      const section = getValues('sections').find((candidate) => candidate.uid === sectionUid)
      if (section?.type === 'EXPERIENCE') openManual(itemUid)
    },
    [onSelectSection, getValues, openManual]
  )

  /**
   * 미리보기에서 섹션 드래그가 끝나면 폼의 `sections` 배열 순서를 바꾼다.
   * 출발·도착은 sortable 인덱스가 아니라 섹션 `uid`로 받는다. uid는 순서가 바뀌어도 안정적인 정체성이므로
   * 렌더 순번 인덱스를 배열 인덱스로 변환하는 좌표계 변환이 필요 없다.
   * 저장 시 `displayOrder`는 배열 순서로 정규화되므로(`formToSaveInput`) 여기서는 순서만 옮기면 된다.
   */
  const handleSectionMove = useCallback(
    (fromUid: string, toUid: string) => {
      const current = getValues('sections')
      const from = current.findIndex((section) => section.uid === fromUid)
      const to = current.findIndex((section) => section.uid === toUid)

      if (from === -1 || to === -1 || from === to) return
      moveSection(from, to)
    },
    [getValues, moveSection]
  )

  // 포커스 중이던 카테고리가 삭제되면 남은 첫 노출 섹션으로 포커스를 옮긴다(없으면 해제).
  useEffect(() => {
    if (activeSectionUid !== null && activeSectionIndex < 0) {
      onSelectSection(getValues('sections').find((section) => section.visible && section.type !== 'BASIC_INFO')?.uid ?? null)
    }
  }, [activeSectionUid, activeSectionIndex, getValues, onSelectSection])

  return (
    <ExperienceEditProvider value={experienceEditValue}>
      <ResumePreview sections={sections} activeSectionUid={activeSectionUid} onSelectSection={selectSection} onSectionMove={handleSectionMove} registerSectionRef={registerSectionRef} />
      <Flex align={'end'} className={'bg-bg-gray-subtler p-4'}>
        <SetCategoryModal onReplaceSections={replaceSections} />
      </Flex>
      <ResumeEdit section={activeSection} sectionIndex={activeSectionIndex} />
    </ExperienceEditProvider>
  )
}

interface ResumeToolbarProps {
  targetJd: ResumeQuery['resume']['targetJd']
  onSave: () => void
  onDraftSave: () => void
  isSaving: boolean
  lastSavedAt: Date | null
}

/** 편집 화면 상단 도구바. 이력서가 맞춤 대상으로 삼은 채용공고(targetJd)의 회사명·포지션과 저장 상태·액션을 보여준다. */
const ResumeToolbar = ({ targetJd, onSave, onDraftSave, isSaving, lastSavedAt }: ResumeToolbarProps) => {
  return (
    <header className={'flex justify-between px-8 py-5'}>
      <Flex direction="column" justify="center" className={'gap-0.5'}>
        <Text variant="heading2">{targetJd?.companyName ?? '이력서'}</Text>
        <Text variant="body2" color="text-subtle">
          {targetJd?.positionTitle ?? '포지션'}
        </Text>
      </Flex>

      <Flex align={'center'} gap="4">
        <Text variant="label2" color="text-subtler">
          <RefreshCcw className="mr-2.5 inline-block" size={16} />
          {lastSavedAt ? `${formatDate(lastSavedAt, 'HH:mm:ss')} 저장되었습니다.` : '변경 사항은 자동으로 저장됩니다.'}
        </Text>

        <Flex gap="2">
          <Button variant="secondary" size={'md'} className={'leading-0'} onClick={onDraftSave} disabled={isSaving}>
            <FileClock size={18} className="inline-block" data-icon="inline-start" />
            임시저장
          </Button>

          <Button variant="primary" size={'md'} className={'leading-0'} onClick={onSave} disabled={isSaving}>
            <FileCheckCorner size={18} className="inline-block" data-icon="inline-start" />
            완료
          </Button>
        </Flex>
      </Flex>
    </header>
  )
}

const ResumeEdit = ({ section, sectionIndex }: { section: ResumeFormSection | null; sectionIndex: number }) => {
  return <Flex className={'bg-bg-white mx-auto w-160'}>{section ? <ResumeSectionEdit section={section} sectionIndex={sectionIndex} /> : null}</Flex>
}

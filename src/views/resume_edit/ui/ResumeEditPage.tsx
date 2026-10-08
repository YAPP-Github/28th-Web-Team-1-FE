'use client'
import { Suspense, useCallback, useEffect, useMemo, useRef, useState, type KeyboardEvent, type ReactNode } from 'react'
import { Flex } from '@radix-ui/themes'
import { ErrorBoundary } from '@sentry/nextjs'
import { FormProvider, useFieldArray, useForm, useFormContext, useWatch, type UseFormReturn } from 'react-hook-form'
import { toast } from 'sonner'
import { FileCheckCorner, FileClock, RefreshCcw } from 'lucide-react'
import { Button, Divider, Spacing, Text } from '@shared/ui'
import { formatDate, isAccessDeniedError, type GraphQLError } from '@shared/lib'
import { AMPLITUDE_EVENTS } from '@shared/config'
import { useIntervalAutosave } from '@shared/hooks/useIntervalAutosave'
import { useAccessDeniedRedirect } from '@shared/hooks/useAccessDeniedRedirect'
import type { ResumeQuery, ResumeStatusType } from '@shared/lib/gql/graphql'
import { useResumeDetail, useUpdateResume, visibleItems } from '@entities/resume'
import { useGenerateCoreCompetency } from '@entities/profile'
import { useWorkspaceId } from '@entities/user'
import { ResumeBasicInfoHeader, ResumeSectionView } from '@widgets/resume_preview'
import { emptyItemPayload, nextDisplayOrder, type ResumeFormItem, type ResumeFormSection, type ResumeFormValues } from '../model/resume-form.types'
import { resumeToFormValues } from '../model/resumeToFormValues'
import { formToSaveInput } from '../model/formToSaveInput'
import { SetCategoryModal } from './SetCategoryModal'
import { CoreSkillPreviewSection } from './CoreSkillPreviewSection'
import { ResumeSectionEdit } from './edit/ResumeSectionEdit'
import { useResumeDraftViewedTracking } from '../hooks/useResumeDraftViewedTracking'
import { useRouter } from 'next/navigation'
import { DragDropProvider, PointerSensor } from '@dnd-kit/react'
import { PointerActivationConstraints, type Draggable } from '@dnd-kit/dom'
import { isSortable, useSortable } from '@dnd-kit/react/sortable'
import { useItemMoveRegistry, type UseItemMoveRegistry } from '../hooks/useItemMoveRegistry'
import { isInSortableGroup } from '../model/sortable'
import { useSortableSectionItems } from './preview/useSortableSectionItems'

import * as amplitude from '@amplitude/unified'

/**
 * 미리보기 섹션은 클릭하면 활성 섹션 이동도 함께 일어나므로, 포인터가 이 거리 이상 움직여야 드래그로 잡는다.
 * 거리가 없으면 단순 클릭이 드래그 시작으로 잡혀 클릭이 씹힌다.
 */
const PREVIEW_DRAG_ACTIVATION_DISTANCE = 8

/** `useWatch`가 아직 갱신 전(undefined)일 때 대체할 빈 배열. 매 렌더 새 배열을 만들면 하위 useEffect 의존성이 계속 뒤집힌다. */
const EMPTY_SECTIONS: ResumeFormSection[] = []

/**
 * 아이템 위에서 시작한 포인터는 섹션 드래그로 잡지 않는다.
 *
 * 섹션 래퍼는 아이템을 감싸고 있어 두 sortable의 요소가 겹친다. 포인터 이벤트는 조상으로 새므로
 * 아이템 sortable만 반응해야 하는데, 이 판단이 없으면 섹션 sortable도 함께 잡혀 섹션 전체가 끌려간다.
 *
 * 아이템 sortable(`group`이 섹션 uid인 것)은 통과시키고, 섹션 sortable만 차단한다.
 * 아이템 요소에 심은 `data-preview-item` 표시로 판정하므로 sortable 등록 상태를 따로 들여다볼 필요가 없다.
 */
const preventActivation = (event: PointerEvent, source: Draggable) => {
  // sortable 그룹에 속하지 않는(섹션) draggable만 검사 대상이다. 아이템 sortable은 통과시켜야 한다.
  if (!isInSortableGroup(source, undefined)) return false
  return event.target instanceof Element && event.target.closest('[data-preview-item]') !== null
}

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
    if (!needsCoreCompetency(resume)) return

    void generateCoreCompetency({ workspaceId, resumeId, jdId: resume.targetJd?.jdId ?? null })
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
        <ResumeBoard activeSectionUid={activeSectionUid} onSelectSection={setActiveSectionUid} targetJdId={resume.targetJd?.jdId ?? null} />
      </main>
    </FormProvider>
  )
}

/**
 * 폼 값(`sections`)을 구독해 미리보기·목차·편집 영역에 실시간으로 흘려보낸다.
 * `BASIC_INFO`는 미리보기 헤더 전용이라 본문 섹션(`bodyEntries`)에서 분리한다.
 */
const ResumeBoard = ({ activeSectionUid, onSelectSection, targetJdId }: { activeSectionUid: string | null; onSelectSection: (sectionUid: string | null) => void; targetJdId: string | null }) => {
  const { control, getValues } = useFormContext<ResumeFormValues>()
  const { move: moveSection, replace: replaceSections } = useFieldArray({ control, name: 'sections' })
  const sections = useWatch({ control, name: 'sections' }) ?? EMPTY_SECTIONS

  const basicInfoSection = sections.find((section) => section.type === 'BASIC_INFO') ?? null

  /**
   * 미리보기 본문 섹션과 **폼 인덱스**의 쌍. `ResumeIndex`의 목차가 만드는 `bodyEntries`와 같은 방식이다.
   *
   * 미리보기에 노출할 섹션만 거르려면 `visible`·`BASIC_INFO` 필터가 필요한데, 필터한 뒤의 순번은
   * 폼 `sections` 배열 인덱스와 어긋난다(숨김 섹션이 하나라도 있으면). 아이템 정렬의 field array 경로
   * `sections.${formIndex}.items`가 이 값에 의존하므로, **필터하기 전에** 폼 인덱스를 붙여 둔다.
   */
  const bodyEntries = useMemo(() => sections.map((section, formIndex) => ({ section, formIndex })).filter(({ section }) => section.visible && section.type !== 'BASIC_INFO'), [sections])

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

  // 미리보기·미니맵에서 섹션을 선택하면 활성 상태를 바꾸고 해당 미리보기 섹션을 화면 안으로 스크롤한다.
  const selectSection = useCallback(
    (sectionUid: string) => {
      onSelectSection(sectionUid)
      sectionRefs.current.get(sectionUid)?.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
    },
    [onSelectSection]
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
      onSelectSection(bodyEntries[0]?.section.uid ?? null)
    }
  }, [activeSectionUid, activeSectionIndex, bodyEntries, onSelectSection])

  return (
    <>
      <ResumePreview
        basicInfoSection={basicInfoSection}
        bodyEntries={bodyEntries}
        activeSectionUid={activeSectionUid}
        onSelectSection={selectSection}
        onSectionMove={handleSectionMove}
        registerSectionRef={registerSectionRef}
      />
      <Flex align={'end'} className={'bg-bg-gray-subtler p-4'}>
        <SetCategoryModal onReplaceSections={replaceSections} />
      </Flex>
      <ResumeEdit section={activeSection} sectionIndex={activeSectionIndex} targetJdId={targetJdId} />
    </>
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

interface ResumePreviewProps {
  basicInfoSection: ResumeFormSection | null
  /** 미리보기 본문 섹션과 폼 `sections` 배열 인덱스의 쌍. */
  bodyEntries: Array<{ section: ResumeFormSection; formIndex: number }>
  activeSectionUid: string | null
  onSelectSection: (sectionUid: string) => void
  /** 미리보기 섹션 드래그가 끝나면 폼 순서를 바꿔주는 핸들러. 출발·도착 섹션의 `uid`를 받는다. */
  onSectionMove: (fromUid: string, toUid: string) => void
  registerSectionRef: (uid: string, el: HTMLElement | null) => void
}

const ResumePreview = ({ basicInfoSection, bodyEntries, activeSectionUid, onSelectSection, onSectionMove, registerSectionRef }: ResumePreviewProps) => {
  const basicInfo = basicInfoSection?.items[0]?.payload.basicInfo ?? null
  const itemMoveRegistry = useItemMoveRegistry()

  return (
    <Flex align={'center'} className={'bg-bg-gray-subtler relative flex-1'}>
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

        <DragDropProvider
          sensors={[PointerSensor.configure({ activationConstraints: [new PointerActivationConstraints.Distance({ value: PREVIEW_DRAG_ACTIVATION_DISTANCE })], preventActivation })]}
          onDragEnd={({ operation, canceled }) => {
            if (canceled) return

            // Optimistic Sorting 때문에 source와 target은 항상 같은 엘리먼트를 가리킨다.
            // 이동 여부는 sortable이 관리하는 인덱스 변화로만 판별할 수 있다.
            const { source } = operation
            if (!isSortable(source)) return

            const { id, initialIndex, index, group } = source
            if (initialIndex === index) return

            // 아이템 드래그(group = 섹션 uid)는 그 섹션이 등록한 핸들러에 위임한다.
            if (typeof group === 'string') {
              const entry = bodyEntries.find((candidate) => candidate.section.uid === group)
              if (!entry) return

              const targetItem = visibleItems(entry.section)[index]
              if (!targetItem?.uid) return

              // `accept`가 같은 그룹만 받도록 막아 두었지만, 방어적으로 도착 아이템의 소속을 한 번 더 확인한다.
              // 다른 섹션의 아이템으로 잘못 옮기면 섹션 밖에서 순서가 뒤바뀐 채 저장된다.
              if (targetItem.uid === id) return
              itemMoveRegistry.getItemMover(group)?.(String(id), targetItem.uid)
              return
            }

            // 섹션 드래그: 도착 인덱스 위치에 있는 섹션의 uid를 넘긴다(인덱스 좌표계 변환을 상위에 맡기지 않는다).
            const targetSection = bodyEntries[index]?.section
            if (!targetSection) return
            onSectionMove(String(id), targetSection.uid)
          }}
        >
          <Flex direction={'column'} gap="5">
            {bodyEntries.map(({ section, formIndex }, index) => (
              <SortablePreviewSection
                key={section.uid}
                section={section}
                index={index}
                sectionIndex={formIndex}
                activeSectionUid={activeSectionUid}
                onSelect={onSelectSection}
                registerRef={registerSectionRef}
                itemMoveRegistry={itemMoveRegistry}
              />
            ))}
          </Flex>
        </DragDropProvider>
      </Flex>
    </Flex>
  )
}

interface SortablePreviewSectionProps {
  section: ResumeFormSection
  /** 드래그 가능한 미리보기 본문에서의 순번. Optimistic Sorting의 위치 계산에 쓴다. */
  index: number
  /** 폼 `sections` 배열에서의 인덱스. 아이템 field array 경로(`sections.${sectionIndex}.items`)에 쓰인다. */
  sectionIndex: number
  activeSectionUid: string | null
  onSelect: (sectionUid: string) => void
  /** 미니맵 스크롤용 DOM 등록 ref. */
  registerRef: (uid: string, el: HTMLElement | null) => void
  itemMoveRegistry: UseItemMoveRegistry
}

/**
 * 미리보기 본문 섹션 하나. 섹션 순서 DnD와 아이템 순서 DnD를 함께 담당한다.
 *
 * 아이템 정렬 래퍼는 `useSortableSectionItems`가 이 섹션의 폼 경로(`sections.${sectionIndex}.items`)에 묶어 만든다.
 * 경로가 동적이라 섹션마다 훅 인스턴스가 하나씩 필요하다.
 *
 * `index`(미리보기 순번)와 `sectionIndex`(폼 순번)는 다르다. 미리보기는 `visible`이거나 `BASIC_INFO`가 아닌
 * 섹션만 노출하므로, 숨김 섹션이 하나라도 있으면 둘이 어긋난다. 아이템 field array 경로에는 반드시
 * `sectionIndex`를 써야 다른 섹션의 items를 건드리지 않는다.
 *
 * `CORE_SKILL`은 아이템 순서 변경이 불필요해 DnD를 지원하지 않는다. 핵심역량 단락은 나열 순서가 의미를 갖지 않고,
 * AI가 만든 단락을 임의로 옮기는 것이 오히려 거슬리므로 위젯에 래퍼를 넘기지 않아 원래 마크업으로 렌더한다.
 * (섹션 자체의 순서 변경은 다른 섹션과 동일하게 지원한다.)
 */
const SortablePreviewSection = ({ section, index, sectionIndex, activeSectionUid, onSelect, registerRef, itemMoveRegistry }: SortablePreviewSectionProps) => {
  const itemWrapper = useSortableSectionItems({ sectionUid: section.uid, sectionIndex, registry: itemMoveRegistry })

  return (
    <SortableSelectableArea sectionUid={section.uid} index={index} activeSectionUid={activeSectionUid} onSelect={onSelect} registerRef={registerRef}>
      {section.type === 'CORE_SKILL' ? <CoreSkillPreviewSection section={section} /> : <ResumeSectionView section={section} ItemWrapper={itemWrapper} />}
    </SortableSelectableArea>
  )
}

interface SelectableAreaProps {
  sectionUid: string
  activeSectionUid: string | null
  onSelect: (sectionUid: string) => void
  registerRef: (uid: string, el: HTMLElement | null) => void
  children: ReactNode
}

/** Enter/Space로 활성 섹션을 선택하는 공통 키보드 핸들러. */
const selectOnKeyDown = (select: () => void) => (event: KeyboardEvent<HTMLDivElement>) => {
  if (event.key !== 'Enter' && event.key !== ' ') return
  event.preventDefault()
  select()
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
      onKeyDown={selectOnKeyDown(select)}
      className={'group cursor-pointer rounded-sm outline-none'}
    >
      {children}
    </div>
  )
}

interface SortableSelectableAreaProps extends SelectableAreaProps {
  /**
   * 정렬 그룹(드래그 가능한 미리보기 본문) 안에서의 순번. 0부터 시작한다.
   * 서버 `displayOrder`와 무관하게 **현재 렌더 순서**를 써야 OptimisticSorting의 위치 계산이 맞는다.
   */
  index: number
}

/**
 * 드래그로 순서를 바꿀 수 있는 미리보기 섹션 래퍼. 선택·하이라이트 동작은 {@link SelectableArea}와 같고,
 * sortable 등록과 DOM 등록(ref 병합)만 추가된다. 기본정보 헤더처럼 순서를 바꿀 수 없는 영역은 `SelectableArea`를 쓴다.
 *
 * `accept`로 **섹션 sortable만** 드롭 타깃으로 받는다. 이 래퍼는 하위 아이템을 감싸고 있어, 지정하지 않으면
 * 아이템을 드래그할 때 그 섹션이 타깃으로 잡혀 섹션과 아이템이 서로 자리를 바꾸게 된다.
 */
const SortableSelectableArea = ({ sectionUid, index, activeSectionUid, onSelect, registerRef, children }: SortableSelectableAreaProps) => {
  const select = () => onSelect(sectionUid)
  const { ref } = useSortable({ id: sectionUid, index, accept: (source) => isInSortableGroup(source, undefined) })

  // sortable 등록 ref와 미니맵 스크롤용 DOM 등록 ref를 하나의 ref로 병합한다.
  const setRef = useCallback(
    (el: HTMLElement | null) => {
      ref(el)
      registerRef(sectionUid, el)
    },
    [ref, registerRef, sectionUid]
  )

  return (
    <div
      ref={setRef}
      role="button"
      tabIndex={0}
      data-active={activeSectionUid === sectionUid}
      onClick={select}
      onKeyDown={selectOnKeyDown(select)}
      className={'group cursor-pointer rounded-sm outline-none'}
    >
      {children}
    </div>
  )
}

const ResumeEdit = ({ section, sectionIndex, targetJdId }: { section: ResumeFormSection | null; sectionIndex: number; targetJdId: string | null }) => {
  return <Flex className={'bg-bg-white mx-auto w-160'}>{section ? <ResumeSectionEdit section={section} sectionIndex={sectionIndex} targetJdId={targetJdId} /> : null}</Flex>
}

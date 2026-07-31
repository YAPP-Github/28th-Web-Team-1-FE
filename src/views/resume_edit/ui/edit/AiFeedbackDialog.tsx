'use client'
import { Suspense, useRef, useState } from 'react'
import { ErrorBoundary } from '@sentry/nextjs'
import { useFormContext, type FieldPath } from 'react-hook-form'
import { Flex, Skeleton } from '@radix-ui/themes'
import { ArrowRight, PencilSparkles } from 'lucide-react'
import { Button, Divider, Spacing, Text } from '@shared/ui'
import { Dialog, DialogContent, DialogTrigger } from '@shared/ui/dialog'
import { SelectedControl, SelectedControlItem } from '@shared/ui/selected_control'
import { HelpTooltip } from '@shared/ui/tooltip'
import { Input } from '@shared/ui/input'
import { Textarea } from '@shared/ui/textarea'
import { usePolishProfileText } from '@entities/profile'
import { useJdInsight } from '@entities/jd'
import { useWorkspaceId } from '@entities/user'
import type { PolishProfileTextRequest, PolishStructure, ProfilePolishKind } from '@shared/lib/gql/graphql'
import type { ResumeFormValues } from '../../model/resume-form.types'

import * as amplitude from '@amplitude/unified'
import { AMPLITUDE_EVENTS } from '@shared/config'

/** 첨삭 결과가 반영되는 편집 필드 하나. `name`은 RHF 필드 경로(동적 문자열). */
export interface AiFeedbackField {
  /** 예: `sections.0.items.0.payload.experience.contents` */
  name: string
  /** 우측 결과 패널에 표시할 라벨. 예: '경험명' | '세부내용' | '내용' */
  label: string
}

export interface AiFeedbackTarget {
  /** 첨삭 대상 항목 종류. */
  kind: ProfilePolishKind
  /** 다듬을 본문 필드. 요청 `description`이자 결과 `description`이 되쓰이는 곳. */
  description: AiFeedbackField
  /** 경험명 필드. kind가 EXPERIENCE일 때만 사용 — 요청 `title`(필수)이자 결과 `title`이 되쓰이는 곳. */
  title?: AiFeedbackField
}

interface AiFeedbackDialogProps {
  /** 첨삭 대상. 경험은 경험명+세부내용, 핵심역량·경력은 세부내용만 다룬다. */
  target: AiFeedbackTarget
  /** 대상 채용공고 ID. 주면 해당 JD의 지원 전략을 반영해 다듬는다(경험 섹션 등). */
  jdId?: string | null
}

/** 작성구조 옵션. value는 서버 `PolishStructure`, label은 표시용. */
const WRITING_STRUCTURES = [
  { value: 'BULLET', label: '불렛형' },
  { value: 'PROBLEM_SOLUTION_RESULT', label: '문제-해결-성과' },
  { value: 'PROSE', label: '산문형' }
] as const satisfies ReadonlyArray<{ value: PolishStructure; label: string }>

/**
 * 이력서 편집 화면의 'AI 첨삭' 다이얼로그.
 * 경험·핵심역량·경력 섹션이 공용으로 쓰며, 대상은 `target`으로 주입한다(경험은 두 필드).
 * 폼과의 연결은 RHF `name` 기반 — 열 때 현재 값을 우측 필드에 채우고, '적용' 시 편집값을 되쓴다.
 * 우측 필드는 항상 직접 타이핑할 수 있고, 'AI 수정 시작'은 그 값을 AI 결과로 덮어쓴다.
 */
export const AiFeedbackDialog = ({ target, jdId }: AiFeedbackDialogProps) => {
  const { kind, title, description } = target
  const { getValues, setValue } = useFormContext<ResumeFormValues>()
  const workspaceId = useWorkspaceId()
  const { mutateAsync: polish, isPending } = usePolishProfileText()

  const [isOpen, setIsOpen] = useState(false)
  const [structure, setStructure] = useState<PolishStructure>('PROBLEM_SOLUTION_RESULT')
  const [instruction, setInstruction] = useState('')
  /** 우측 편집 필드의 현재 값. key = field.name. 열 때 폼 값으로 초기화한다. */
  const [drafts, setDrafts] = useState<Record<string, string>>({})

  /** Amplitude 이벤트 전송용: 세부내용 편집을 시작한 포커스 시점 값. (세부내용 Textarea만 추적) */
  const editBaselineRef = useRef<string | null>(null)

  /** 포커스 시점의 세부내용 값을 기준값으로 저장한다. */
  const handleDescriptionFocus = (value: string) => {
    editBaselineRef.current = value
  }

  /** Amplitude 이벤트 전송용: 기준값과 달라지는 첫 onChange에서만 1회 전송하고, draft를 갱신한다. */
  const handleDescriptionChange = (value: string) => {
    if (editBaselineRef.current !== null && value !== editBaselineRef.current) {
      amplitude.track(AMPLITUDE_EVENTS.SECTION_EDITED, { section_name: SECTION_NAME_BY_KIND[kind], location: 'ai_modal' })
      editBaselineRef.current = null
    }
    setDrafts((prev) => ({ ...prev, [description.name]: value }))
  }

  const readValue = (name: string) => String(getValues(name as FieldPath<ResumeFormValues>) ?? '')

  /** 대상 필드들의 현재 폼 값 스냅샷. 초기화·재오픈 시 이 값으로 되돌린다. */
  const snapshotFromForm = () => ({
    [description.name]: readValue(description.name),
    ...(title && { [title.name]: readValue(title.name) })
  })

  /** 열 때 폼 값으로 채우고, 닫을 때 임시 상태를 정리한다. */
  const handleOpenChange = (next: boolean) => {
    setIsOpen(next)
    if (next) {
      setDrafts(snapshotFromForm())
    } else {
      setInstruction('')
    }
  }

  const handleGenerate = async () => {
    amplitude.track(AMPLITUDE_EVENTS.AI_EDIT_STARTED, { edit_mode: EDIT_MODE_BY_STRUCTURE[structure] })

    const request: PolishProfileTextRequest = {
      kind,
      description: drafts[description.name] ?? '',
      structure,
      instruction: instruction || null,
      jdId: jdId || null,
      title: title ? (drafts[title.name] ?? '') : null
    }
    const polished = await polish({ request, workspaceId })
    setDrafts((prev) => ({
      ...prev,
      [description.name]: polished.description,
      ...(title && polished.title !== null ? { [title.name]: polished.title } : {})
    }))
  }

  const writeField = (field: AiFeedbackField) => setValue(field.name as FieldPath<ResumeFormValues>, (drafts[field.name] ?? '') as never, { shouldDirty: true, shouldValidate: true })

  /** 편집값을 폼에 되쓰고 닫는다. */
  const handleApply = () => {
    amplitude.track(AMPLITUDE_EVENTS.EDIT_APPLIED, { section_name: SECTION_NAME_BY_KIND[kind], edit_mode: EDIT_MODE_BY_STRUCTURE[structure] })
    writeField(description)
    if (title) writeField(title)
    handleOpenChange(false)
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button variant={'secondary'} size={'sm'} className={'ml-auto w-fit'} onClick={() => amplitude.track(AMPLITUDE_EVENTS.EDIT_MODAL_OPENED)}>
          <PencilSparkles size={16} data-icon={'inline-start'} />
          AI 첨삭
        </Button>
      </DialogTrigger>

      <DialogContent className={'bg-bg-gray-subtler flex w-254 p-3'} onOpenAutoFocus={(event) => event.preventDefault()}>
        {/* 좌측: 지원전략(JD 컨텍스트) + AI 편집 지침 */}
        <Flex direction="column" flexGrow={'1'} flexBasis={'0'} minWidth={'0'} p={'5'}>
          <Flex direction={'column'} gap={'4'} flexShrink={'0'}>
            <Text variant={'headline1'}>지원전략</Text>
            {jdId ? (
              <ErrorBoundary
                fallback={
                  <Text variant={'label2'} color={'text-subtler'}>
                    지원전략을 불러오지 못했어요.
                  </Text>
                }
              >
                <Suspense fallback={<JdStrategyLoading />}>
                  <JdStrategy workspaceId={workspaceId} jdId={jdId} />
                </Suspense>
              </ErrorBoundary>
            ) : (
              <Text variant={'label2'} color={'text-subtler'}>
                연결된 채용공고가 없어요.
              </Text>
            )}
          </Flex>

          <Spacing size={40} />
          <Divider color={'gray-10'} className={'mx-auto w-60'} />
          <Spacing size={40} />

          <Flex direction={'column'}>
            <Text variant={'headline1'}>AI 편집 지침</Text>

            <Spacing size={16} />

            <Flex align={'center'}>
              <Text variant={'label1'}>작성구조</Text>
              <HelpTooltip side={'right'}>원하는 문장 구조를 골라주세요.</HelpTooltip>
            </Flex>

            <Spacing size={8} />

            <SelectedControl value={structure} onValueChange={(value) => setStructure(value as PolishStructure)}>
              {WRITING_STRUCTURES.map((item) => (
                <SelectedControlItem key={item.value} value={item.value}>
                  {item.label}
                </SelectedControlItem>
              ))}
            </SelectedControl>

            <Spacing size={16} />

            <Input label={'직접 작성 (선택 입력)'} placeholder={'어투, 강조 수치 등을 적어주면 좋아요'} value={instruction} onChange={(event) => setInstruction(event.target.value)} />

            <Spacing size={12} />

            <Button variant={'secondary'} size={'sm'} className={'ml-auto w-fit'} onClick={handleGenerate} disabled={isPending}>
              AI 수정 시작
              <ArrowRight data-icon="inline-end" />
            </Button>
          </Flex>
        </Flex>

        {/* 우측: 내용 다듬기(첨삭 결과) — 대상 필드 수만큼 렌더. 항상 직접 편집 가능 */}
        <Flex direction="column" flexShrink={'0'} className={'bg-bg-white w-115 min-w-115 rounded-xl p-6'}>
          <Text variant={'headline1'}>내용 다듬기</Text>

          <Spacing size={16} />

          <Flex direction={'column'} gap={'4'} className={'min-h-0 flex-1 overflow-y-auto'}>
            {title && (
              <Flex direction={'column'} gap={'2'}>
                {isPending ? (
                  <FieldSkeleton label={title.label} />
                ) : (
                  <Input label={title.label} clearable={false} value={drafts[title.name] ?? ''} onChange={(event) => setDrafts((prev) => ({ ...prev, [title.name]: event.target.value }))} />
                )}
              </Flex>
            )}

            <Flex direction={'column'} gap={'2'}>
              {isPending ? (
                <FieldSkeleton label={description.label} multiline />
              ) : (
                <Textarea
                  label={description.label}
                  value={drafts[description.name] ?? ''}
                  // Amplitude 이벤트 전송용: 포커스 시점 값과 달라지는 첫 onChange에서만 1회 전송
                  onFocus={(event) => handleDescriptionFocus(event.target.value)}
                  onChange={(event) => handleDescriptionChange(event.target.value)}
                  className={'h-70 max-h-70'}
                  maxLength={500}
                />
              )}
            </Flex>
          </Flex>

          <Flex className={'mt-auto w-full gap-2'}>
            <Button variant={'tertiary'} size={'md'} className={'flex-1'} onClick={() => setDrafts(snapshotFromForm())} disabled={isPending}>
              초기화
            </Button>
            <Button size={'md'} className={'flex-1'} onClick={handleApply} disabled={isPending}>
              적용
            </Button>
          </Flex>
        </Flex>
      </DialogContent>
    </Dialog>
  )
}

/**
 * 다듬는 중 편집 필드 자리에 표시하는 로딩 스켈레톤(라벨 + 박스).
 * `multiline`이면 Textarea 높이(4줄), 아니면 Input 높이(1줄)로 맞춘다.
 */
const FieldSkeleton = ({ label, multiline }: { label: string; multiline?: boolean }) => (
  <>
    <Text variant={'label1'} weight={'semibold'} className={'truncate'}>
      {label}
    </Text>
    {multiline ? (
      <Flex direction={'column'} gap={'2'} className={`border-border-subtle my-auto h-70 rounded-lg border p-4`}>
        {Array.from({ length: 4 }).map((_, index) => (
          <Skeleton key={`skeleton-${index}`} height={'14px'} width={index % 2 ? '60%' : '100%'} />
        ))}
      </Flex>
    ) : (
      <Flex direction={'column'} justify={'center'} className={`border-border-subtle my-auto h-11.75 rounded-lg border px-4 py-3`}>
        <Skeleton height={'14px'} width={'100%'} />
      </Flex>
    )}
  </>
)

/**
 * 대상 JD의 지원 전략(서술형 문단)을 Suspense로 조회해 보여준다. `jdId`가 있을 때만 렌더한다.
 * 네트워크·GraphQL 오류는 `useSuspenseQuery`가 throw → 상위 `ErrorBoundary`가 처리한다(여기선 못 잡음).
 * 아래 `!insight`는 스키마상 nullable인 `jdInsight` 필드를 서버가 null로 반환한 정상 케이스만 다룬다.
 */
const JdStrategy = ({ workspaceId, jdId }: { workspaceId: string; jdId: string }) => {
  const { insight } = useJdInsight(workspaceId, jdId)

  // 오류가 아니라 '인사이트 없음'(nullable 필드) 상태.
  if (!insight) {
    return (
      <Text variant={'label2'} color={'text-subtler'} className={'h-36.75'}>
        지원전략이 아직 없어요.
      </Text>
    )
  }

  return (
    <Text variant={'label2'} color={'text-subtle'} className={'h-36.75 overflow-y-auto'}>
      {insight.strategy}
    </Text>
  )
}

/** 지원전략(AI 생성) 로딩 스켈레톤. */
const JdStrategyLoading = () => (
  <Flex direction={'column'} gap={'1'} className={'h-36.75'}>
    <Skeleton height={'14px'} width={'100%'} />
    <Skeleton height={'14px'} width={'100%'} />
    <Skeleton height={'14px'} width={'80%'} />
  </Flex>
)

/** Amplitude 이벤트 전송 시 사용.
 * (경험=experience, 핵심역량=core_competency, 경력=career)
 */
const SECTION_NAME_BY_KIND: Record<ProfilePolishKind, string> = {
  EXPERIENCE: 'experience',
  CORE_COMPETENCY: 'core_competency',
  CAREER_DESCRIPTION: 'career'
}

/** Amplitude 이벤트 전송 시 사용. 서버 PolishStructure → Amplitude edit_mode 값. */
const EDIT_MODE_BY_STRUCTURE: Record<PolishStructure, string> = {
  BULLET: 'bullet',
  PROBLEM_SOLUTION_RESULT: 'problem_solution',
  PROSE: 'paragraph'
}

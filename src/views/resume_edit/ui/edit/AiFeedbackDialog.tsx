'use client'
import { Suspense, useState } from 'react'
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

/** 첨삭 대상 필드 하나. `name`은 RHF 필드 경로(동적 문자열). */
export interface AiFeedbackTarget {
  /** 예: `sections.0.items.0.payload.experience.contents` */
  name: string
  /** 우측 결과 패널에 표시할 라벨. 예: '경험명' | '세부내용' | '내용' */
  label: string
  /** 첨삭 대상 항목 종류. 서버가 항목별 글자수 제한·프롬프트에 사용한다. */
  kind: ProfilePolishKind
  /** 편집 필드 유형. 경험명처럼 한 줄이면 false(Input), 세부내용처럼 여러 줄이면 true(Textarea). */
  multiline: boolean
}

interface AiFeedbackDialogProps {
  /** 첨삭 대상 필드들. 경험=2개(경험명+세부내용), 핵심역량·경력=1개(세부내용). */
  targets: AiFeedbackTarget[]
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
 * 경험·핵심역량·경력 섹션이 공용으로 쓰며, 대상 필드는 `targets`로 주입한다(1~2개).
 * 폼과의 연결은 RHF `name` 기반 — 열 때 현재 값을 우측 필드에 채우고, '적용' 시 편집값을 되쓴다.
 * 우측 필드는 항상 직접 타이핑할 수 있고, 'AI 수정 시작'은 그 값을 AI 결과로 덮어쓴다.
 */
export const AiFeedbackDialog = ({ targets, jdId }: AiFeedbackDialogProps) => {
  const { getValues, setValue } = useFormContext<ResumeFormValues>()
  const workspaceId = useWorkspaceId()
  const { mutateAsync: polish } = usePolishProfileText()

  const [isOpen, setIsOpen] = useState(false)
  const [structure, setStructure] = useState<PolishStructure>('PROBLEM_SOLUTION_RESULT')
  const [instruction, setInstruction] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)
  /** 우측 편집 필드의 현재 값. key = target.name. 열 때 폼 값으로 초기화한다. */
  const [drafts, setDrafts] = useState<Record<string, string>>({})

  const readValue = (name: string) => String(getValues(name as FieldPath<ResumeFormValues>) ?? '')

  /** 대상들의 현재 폼 값 스냅샷. 초기화·재오픈 시 이 값으로 되돌린다. */
  const snapshotFromForm = () => Object.fromEntries(targets.map((target) => [target.name, readValue(target.name)]))

  /** 열 때 폼 값으로 채우고, 닫을 때 임시 상태를 정리한다. */
  const handleOpenChange = (next: boolean) => {
    setIsOpen(next)
    if (next) {
      setDrafts(snapshotFromForm())
    } else {
      setInstruction('')
      setIsGenerating(false)
    }
  }

  const handleGenerate = async () => {
    // 경험 세부내용을 다듬을 때 맥락으로 넘길 경험명 값(있으면).
    const titleTarget = targets.find((target) => target.kind === 'EXPERIENCE_TITLE')
    const title = titleTarget ? drafts[titleTarget.name] : undefined

    setIsGenerating(true)
    try {
      const entries = await Promise.all(
        targets.map(async (target) => {
          const request: PolishProfileTextRequest = {
            kind: target.kind,
            text: drafts[target.name] ?? '',
            structure,
            instruction: instruction || null,
            jdId: jdId || null,
            title: target.kind === 'EXPERIENCE_DESCRIPTION' ? (title ?? null) : null
          }
          const polished = await polish({ request, workspaceId })
          return [target.name, polished] as const
        })
      )
      setDrafts((prev) => ({ ...prev, ...Object.fromEntries(entries) }))
    } finally {
      setIsGenerating(false)
    }
  }

  /** 편집값을 폼에 되쓰고 닫는다. */
  const handleApply = () => {
    targets.forEach((target) => {
      setValue(target.name as FieldPath<ResumeFormValues>, (drafts[target.name] ?? '') as never, { shouldDirty: true, shouldValidate: true })
    })
    handleOpenChange(false)
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button variant={'secondary'} size={'sm'} className={'ml-auto w-fit'}>
          <PencilSparkles size={16} data-icon={'inline-start'} />
          AI 첨삭
        </Button>
      </DialogTrigger>

      <DialogContent className={'bg-bg-gray-subtler flex w-254 p-3'} onOpenAutoFocus={(event) => event.preventDefault()}>
        {/* 좌측: 지원전략(JD 컨텍스트) + AI 편집 지침 */}
        <Flex direction="column" flexGrow={'1'} flexBasis={'0'} minWidth={'0'} p={'4'}>
          <Flex direction={'column'} gap={'4'} flexShrink={'0'}>
            <Text variant={'headline1'}>지원전략</Text>
            {jdId ? (
              <Suspense fallback={<JdStrategyLoading />}>
                <JdStrategy workspaceId={workspaceId} jdId={jdId} />
              </Suspense>
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

            <Button variant={'secondary'} size={'sm'} className={'ml-auto w-fit'} onClick={handleGenerate} disabled={isGenerating}>
              AI 수정 시작
              <ArrowRight data-icon="inline-end" />
            </Button>
          </Flex>
        </Flex>

        {/* 우측: 내용 다듬기(첨삭 결과) — 대상 필드 수만큼 렌더. 항상 직접 편집 가능 */}
        <Flex direction="column" flexShrink={'0'} className={'bg-bg-white w-107 min-w-107 rounded-xl p-6'}>
          <Text variant={'headline1'}>내용 다듬기</Text>

          <Spacing size={16} />

          <Flex direction={'column'} gap={'4'} className={'min-h-0 flex-1 overflow-y-auto'}>
            {targets.map((target) => (
              <Flex key={target.name} direction={'column'} gap={'2'}>
                {isGenerating ? (
                  <>
                    <Text variant={'label1'} weight={'semibold'} className={'truncate'}>
                      {target.label}
                    </Text>
                    <Flex direction={'column'} gap={'2'} className={`border-border-subtle rounded-lg border ${target.multiline ? 'h-50 p-4' : 'h-11.75 px-4 py-3'}`}>
                      {/* Textarea는 여러 줄, Input은 한 줄 */}
                      {Array.from({ length: target.multiline ? 4 : 1 }).map((_, index, lines) => (
                        <Skeleton key={`${target.name}-skeleton-${index}`} height={'14px'} width={lines.length > 1 && index === lines.length - 1 ? '60%' : '100%'} />
                      ))}
                    </Flex>
                  </>
                ) : target.multiline ? (
                  <Textarea label={target.label} value={drafts[target.name] ?? ''} onChange={(event) => setDrafts((prev) => ({ ...prev, [target.name]: event.target.value }))} className={'h-50'} />
                ) : (
                  <Input label={target.label} clearable={false} value={drafts[target.name] ?? ''} onChange={(event) => setDrafts((prev) => ({ ...prev, [target.name]: event.target.value }))} />
                )}
              </Flex>
            ))}
          </Flex>

          <Spacing size={16} />

          <Flex className={'mt-auto w-full gap-2'}>
            <Button variant={'tertiary'} size={'md'} className={'flex-1'} onClick={() => setDrafts(snapshotFromForm())} disabled={isGenerating}>
              초기화
            </Button>
            <Button size={'md'} className={'flex-1'} onClick={handleApply} disabled={isGenerating}>
              적용
            </Button>
          </Flex>
        </Flex>
      </DialogContent>
    </Dialog>
  )
}

/** 대상 JD의 지원 전략(서술형 문단)을 Suspense로 조회해 보여준다. `jdId`가 있을 때만 렌더한다. */
const JdStrategy = ({ workspaceId, jdId }: { workspaceId: string; jdId: string }) => {
  const { insight } = useJdInsight(workspaceId, jdId)

  if (!insight) {
    return (
      <Text variant={'label2'} color={'text-subtler'}>
        지원전략을 불러오지 못했어요.
      </Text>
    )
  }

  return (
    <Text variant={'label2'} color={'text-subtle'}>
      {insight.strategy}
    </Text>
  )
}

/** 지원전략(AI 생성) 로딩 스켈레톤. */
const JdStrategyLoading = () => (
  <Flex direction={'column'} gap={'1'}>
    <Skeleton height={'14px'} width={'100%'} />
    <Skeleton height={'14px'} width={'100%'} />
    <Skeleton height={'14px'} width={'80%'} />
  </Flex>
)

'use client'

import { Suspense, useEffect, useMemo } from 'react'
import { Loader2Icon } from 'lucide-react'
import { useInfiniteQuery } from '@tanstack/react-query'
import { Dialog, DialogContent } from '@shared/ui/dialog'
import { Button, Divider, Spacing, Text } from '@shared/ui'
import { Flex, Skeleton } from '@radix-ui/themes'
import { useWorkspaceId } from '@entities/user'
import { useJdInsight } from '@entities/jd'
import { experienceQueries } from '@entities/experience'
import { ExperienceCard } from './ExperienceCard'
import { ExperienceSearchPanel } from './ExperienceSearchPanel'
import { useMultiSelect } from '@shared/hooks/useMultiSelect'
import type { Experience } from '../model/experience.types'

import * as amplitude from '@amplitude/unified'
import { AMPLITUDE_EVENTS } from '@shared/config'

const MAX_SELECT = 5

type ActionType = 'first' | 'reselect'

interface Props {
  isOpen: boolean
  jdId: string
  isCompleting?: boolean
  onComplete: (experiences: Experience[]) => void
  onOpenChange?: (isOpen: boolean) => void

  // Amplitude 이벤트 전송용 (ResumeCreatePage에서 호출 시 first, ExperienceSection에서 호출 시 reselect)
  actionType?: ActionType
  // Amplitude 이벤트 전송용 (reselect 시 이전에 선택된 경험 ID들을 전달해, 새로 선택된 경험과 짝지어 previous_experience_id로 보낸다)
  previousExperienceIds?: string[]
}

export const ExperiencePickerDialog = ({ isOpen, jdId, isCompleting = false, actionType = 'first', previousExperienceIds, onOpenChange, onComplete }: Props) => {
  const workspaceId = useWorkspaceId()
  const { selectedItems, isSelected, toggle, isFull, count } = useMultiSelect((experience: Experience) => experience.experienceId, MAX_SELECT)

  useEffect(() => {
    // 페이지 진입 시 Amplitude 이벤트 전송
    if (!isOpen) return
    amplitude.track(AMPLITUDE_EVENTS.EXPERIENCE_SELECTION_VIEWED)
  }, [isOpen])

  // Amplitude 이벤트 전송용: 추천 경험 순위 맵 생성
  const { data: matchedPages } = useInfiniteQuery(experienceQueries.matched(workspaceId, jdId))
  const recommendationRankMap = useMemo(() => buildRecommendationRankMap(matchedPages?.pages.flatMap((page) => page.experiences.experiences) ?? []), [matchedPages])

  const handleComplete = () => {
    trackExperienceSelected(selectedItems, actionType, { previousExperienceIds, rankMap: recommendationRankMap })
    onComplete(selectedItems)
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent showCloseButton={false} className={'bg-bg-gray-subtler flex h-200 min-h-200 w-215 min-w-215 justify-around gap-7 p-4'}>
        <Flex direction="column" flexGrow={'1'} flexBasis={'0'} minWidth={'0'} p={'4'}>
          <Flex direction={'column'} gap={'4'} flexShrink={'0'}>
            <Text variant={'headline1'}>공고 인사이트</Text>
            <Suspense fallback={<JdInsightLoading />}>
              <JdInsight workspaceId={workspaceId} jdId={jdId} />
            </Suspense>
          </Flex>

          <Spacing size={24} />
          <Divider color={'gray-10'} className={'mx-auto w-60'} />
          <Spacing size={24} />

          <Flex direction={'column'} gap={'4'} flexGrow={'1'} minHeight={'0'}>
            <Flex justify={'between'} align={'end'} flexShrink={'0'}>
              <Flex align={'end'} gap={'1'}>
                <Text variant={'headline1'} color={'text-basic'}>
                  선택된 경험
                </Text>
                <Text variant={'headline2'} color={'text-subtler'} className={'tabular-nums'}>
                  ({count}/{MAX_SELECT})
                </Text>
              </Flex>

              <Text variant={'caption1'} color={'text-primary-basic'}>
                최대 {MAX_SELECT}개 선택 가능
              </Text>
            </Flex>

            {selectedItems.length === 0 ? (
              <EmptySelectedExperience />
            ) : (
              <Flex direction={'column'} gap={'2'} minHeight={'0'} flexGrow={'1'} className={'overflow-y-auto'}>
                {selectedItems.map((experience) => (
                  <ExperienceCard
                    key={experience.experienceId}
                    experience={experience}
                    bordered={false}
                    checked={isSelected(experience.experienceId)}
                    disabled={isFull && !isSelected(experience.experienceId)}
                    onCheckedChange={() => toggle(experience)}
                  />
                ))}
              </Flex>
            )}
          </Flex>

          <Spacing size={16} />

          <Button size={'md'} className={'mt-auto'} disabled={count === 0 || isCompleting} onClick={handleComplete}>
            {isCompleting ? <Loader2Icon className={'animate-spin'} strokeWidth={1.5} /> : '선택 완료'}
          </Button>
        </Flex>

        {/*프로젝트 및 경험 조회 — 패널이 검색창/필터/리스트를 각자 Suspense로 관리하므로 바깥 경계 불필요 */}
        <ExperienceSearchPanel workspaceId={workspaceId} jdId={jdId} isSelected={isSelected} isFull={isFull} onToggle={toggle} />
      </DialogContent>
    </Dialog>
  )
}

const EmptySelectedExperience = () => (
  <Flex direction={'column'} align={'center'} className={'border-border-subtle rounded-lg border border-dashed py-10'}>
    <Text variant={'label1'} color={'text-subtle'}>
      이력서에 넣을 경험을 선택해주세요
    </Text>
    <Text variant={'caption1'} color={'text-subtler'}>
      최대 {MAX_SELECT}개까지 선택할 수 있어요
    </Text>
  </Flex>
)

const JdInsight = ({ workspaceId, jdId }: { workspaceId: string; jdId: string }) => {
  const { insight } = useJdInsight(workspaceId, jdId)

  if (!insight) {
    return (
      <Text variant={'label2'} color={'text-subtler'}>
        공고 인사이트를 불러오지 못했어요.
      </Text>
    )
  }

  return (
    <Flex direction={'column'} gap={'2'}>
      <Flex direction={'column'}>
        <Text variant={'label1'} color={'text-basic'}>
          지원 전략
        </Text>
        <Text variant={'label2'} color={'text-subtle'}>
          {insight.strategy}
        </Text>
      </Flex>
    </Flex>
  )
}

/** 인사이트(AI 생성) 로딩 스켈레톤. 실제 JdInsight의 두 블록(핵심/지원 전략) 모양을 따른다. */
const JdInsightLoading = () => (
  <Flex direction={'column'} gap={'2'}>
    {[0, 1].map((block) => (
      <Flex key={block} direction={'column'} gap={'1'}>
        <Skeleton height={'18px'} width={'72px'} />
        <Skeleton height={'14px'} width={'100%'} />
        <Skeleton height={'14px'} width={'100%'} />
        <Skeleton height={'14px'} width={'100%'} />
      </Flex>
    ))}
  </Flex>
)

/**
 * Amplitude 이벤트 전송용
 *  추천(recommendedReason 보유) 경험만 matchRate 내림차순으로 정렬해 1부터 순위를 매긴다. 비추천 경험은 맵에 없다.
 */
const buildRecommendationRankMap = (experiences: Experience[]): Map<string, number> => {
  const recommended = experiences.filter((experience) => Boolean(experience.recommendedReason)).sort((a, b) => (b.matchRate ?? 0) - (a.matchRate ?? 0))
  return new Map(recommended.map((experience, index) => [experience.experienceId, index + 1]))
}

/**
 * Amplitude 이벤트 전송용
 * '선택 완료' 클릭 시 선택된 경험 수만큼 experience_selected 이벤트를 전송한다.
 * 'reselect'에서는 새로 고른 경험과 같은 인덱스의 previousExperienceIds를 짝지어 previous_experience_id로 보내고,
 * previousExperienceIds가 더 길면 넘치는 뒤쪽 id는 버린다(짝이 없으므로).
 */
const trackExperienceSelected = (selected: Experience[], actionType: ActionType, options: { previousExperienceIds?: string[]; rankMap: Map<string, number> }) => {
  const { previousExperienceIds, rankMap } = options
  selected.forEach((experience, index) => {
    const rank = rankMap.get(experience.experienceId)

    amplitude.track(AMPLITUDE_EVENTS.EXPERIENCE_SELECTED, {
      experience_id: experience.experienceId,
      is_recommended: Boolean(experience.recommendedReason), // 추천 이유가 있다면 추천 경험으로 간주
      ...(rank !== undefined && { recommendation_rank: rank }),
      action_type: actionType,
      new_experience_id: actionType === 'reselect' ? experience.experienceId : null,
      previous_experience_id: actionType === 'reselect' ? (previousExperienceIds?.[index] ?? null) : null
    })
  })
}

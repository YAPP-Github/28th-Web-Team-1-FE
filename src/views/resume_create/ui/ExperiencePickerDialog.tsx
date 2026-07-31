'use client'

import { Suspense } from 'react'
import { Loader2Icon } from 'lucide-react'
import { Dialog, DialogContent } from '@shared/ui/dialog'
import { Button, Divider, Spacing, Text } from '@shared/ui'
import { Flex, Skeleton } from '@radix-ui/themes'
import { useWorkspaceId } from '@entities/user'
import { useJdInsight } from '@entities/jd'
import { ExperienceCard } from './ExperienceCard'
import { ExperienceSearchPanel } from './ExperienceSearchPanel'
import { useMultiSelect } from '@shared/hooks/useMultiSelect'
import { useExperiencePickerTracking, type ExperiencePickerActionType } from '../hooks/useExperiencePickerTracking'
import type { Experience } from '../model/experience.types'

const MAX_SELECT = 5

interface Props {
  isOpen: boolean
  jdId: string
  isCompleting?: boolean
  onComplete: (experiences: Experience[]) => void
  onOpenChange?: (isOpen: boolean) => void

  // Amplitude 이벤트 전송용 (ResumeCreatePage에서 호출 시 first, ExperienceSection에서 호출 시 reselect)
  actionType?: ExperiencePickerActionType
  // Amplitude 이벤트 전송용 (reselect 시 이전에 선택된 경험 ID들을 전달해, 새로 선택된 경험과 짝지어 previous_experience_id로 보낸다)
  previousExperienceIds?: string[]
}

export const ExperiencePickerDialog = ({ isOpen, jdId, isCompleting = false, actionType = 'first', previousExperienceIds, onOpenChange, onComplete }: Props) => {
  const workspaceId = useWorkspaceId()
  const { selectedItems, isSelected, toggle, isFull, count } = useMultiSelect((experience: Experience) => experience.experienceId, MAX_SELECT)

  // Amplitude 이벤트 전송용 훅. 경험 선택 완료 시 선택된 경험들을 추적해 EXPERIENCE_SELECTED 이벤트를 보낸다.
  const { trackSelected } = useExperiencePickerTracking({ workspaceId, jdId, isOpen, actionType, previousExperienceIds })

  const handleComplete = () => {
    trackSelected(selectedItems)
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
        공고 인사이트를 불러오지 못했어요. 잠시 후 다시 시도해 주세요.
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

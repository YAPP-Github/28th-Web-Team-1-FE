'use client'

import { Dialog, DialogContent } from '@shared/ui/dialog'
import { Button, Divider, Spacing, Text } from '@shared/ui'
import { Flex } from '@radix-ui/themes'
import { useCurrentWorkspaceId } from '@entities/user'
import { useExperienceList } from '@entities/experience'
import { ExperienceCard } from './ExperienceCard'
import { ExperienceSearchPanel } from './ExperienceSearchPanel'
import { useExperienceSelection } from '../model/useExperienceSelection'
import type { Experience } from '../model/experience.types'

const MAX_SELECT = 5

interface Props {
  isOpen: boolean
  //Todo:  api 요청 시 experienceID(매개변수) 만 전달할지 확인 필요
  onComplete: (experiences: Experience[]) => void
  onOpenChange?: (isOpen: boolean) => void
}

export const ExperiencePickerDialog = ({ isOpen, onOpenChange, onComplete }: Props) => {
  const workspaceId = useCurrentWorkspaceId()
  const { experiences } = useExperienceList(workspaceId)

  const { selectedIds, toggle, isFull } = useExperienceSelection(MAX_SELECT)

  const browseList = sortByMatchRateDesc(experiences)
  const selectedExperiences = browseList.filter((experience) => selectedIds.has(experience.experienceId))

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent showCloseButton={false} className={'bg-bg-gray-subtler flex h-200 min-h-200 w-215 min-w-215 justify-around gap-7 p-4'}>
        <Flex direction="column" minWidth={'0'} p={'4'}>
          <Flex direction={'column'} gap={'4'} flexShrink={'0'}>
            <Text variant={'headline1'}>공고 인사이트</Text>
            <JdInsight />
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
                  ({selectedIds.size}/{MAX_SELECT})
                </Text>
              </Flex>

              <Text variant={'caption1'} color={'text-primary-basic'}>
                최대 {MAX_SELECT}개 선택 가능
              </Text>
            </Flex>

            {selectedExperiences.length === 0 ? (
              <EmptySelectedExperience />
            ) : (
              <Flex direction={'column'} gap={'2'} minHeight={'0'} flexGrow={'1'} className={'overflow-y-auto'}>
                {selectedExperiences.map((experience) => (
                  <ExperienceCard
                    key={experience.experienceId}
                    experience={experience}
                    bordered={false}
                    checked={selectedIds.has(experience.experienceId)}
                    disabled={isFull && !selectedIds.has(experience.experienceId)}
                    onCheckedChange={() => toggle(experience.experienceId)}
                  />
                ))}
              </Flex>
            )}
          </Flex>

          <Spacing size={16} />

          <Button size={'md'} className={'mt-auto'} disabled={selectedIds.size === 0} onClick={() => onComplete(selectedExperiences)}>
            선택 완료
          </Button>
        </Flex>

        {/*프로젝트 및 경험 조회 */}
        <ExperienceSearchPanel experiences={browseList} selectedIds={selectedIds} isFull={isFull} onToggle={toggle} />
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

const JdInsight = () => {
  // Todo: JD 분석 api 요청

  return (
    <Flex direction={'column'} gap={'2'}>
      <Flex direction={'column'}>
        <Text variant={'label1'} color={'text-basic'}>
          핵심
        </Text>
        <Text variant={'label2'} color={'text-subtle'}>
          최고의 사용자 경험을 제공하고자 하는 금융 서비스 분야에서 주도적으로 디자인을 이끌어갈 수 있는 사람을 원해요. 특히, 사용자 경험에 대한 책임감을 가지고, 다양한 팀과 협력하며 특히, 사용자
          경험에 대한 책임감을 가지고, 다양한 팀과 협력하며 다양한 팀과 협력하며
        </Text>
      </Flex>

      <Flex direction={'column'}>
        <Text variant={'label1'} color={'text-basic'}>
          지원 전략
        </Text>
        <Text variant={'label2'} color={'text-subtle'}>
          최고의 사용자 경험을 제공하고자 하는 금융 서비스 분야에서 주도적으로 디자인을 이끌어갈 수 있는 사람을 원해요. 특히, 사용자 경험에 대한 책임감을 가지고, 다양한 팀과 협력하며 특히, 사용자
          경험에 대한 책임감을 가지고, 다양한 팀과 협력하며 다양한 팀과 협력하며
        </Text>
      </Flex>
    </Flex>
  )
}

/** 매칭률 내림차순 정렬 (원본 불변, matchRate 없으면 맨 뒤) */
const sortByMatchRateDesc = (experiences: Experience[]): Experience[] => [...experiences].sort((a, b) => (b.matchRate ?? 0) - (a.matchRate ?? 0))

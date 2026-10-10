import { Suspense, useEffect, useRef, useState } from 'react'
import { useFieldArray, useFormContext, type FieldArrayPath } from 'react-hook-form'
import { Flex, Skeleton } from '@radix-ui/themes'
import { Button, Divider, Spacing, Text } from '@shared/ui'
import { ChevronLeft, ChevronRight, CircleCheckBig, Trash2 } from 'lucide-react'
import * as amplitude from '@amplitude/unified'
import { AMPLITUDE_EVENTS } from '@shared/config'
import { AddItemButton, SectionEmpty } from './Section'
import { AiFeedbackDialog } from './AiFeedbackDialog'
import { DeleteItemAlert } from './DeleteItemAlert'
import { FormInput } from '../form/FormInput'
import { FormPeriodPicker } from '../form/FormPeriodPicker'
import { FormTextarea } from '../form/FormTextarea'
// import { experiencesToFormItems } from '../../model/experiencesToFormItems'
// import { usePreviousExperienceIdsTracking } from '../../hooks/usePreviousExperienceIdsTracking'
import type { ResumeFormValues } from '../../model/resume-form.types'
import { SelectedControl, SelectedControlItem } from '@shared/ui/selected_control'
import { LogoIcon } from '@shared/icon'
import { useExperienceQuestionRooms } from '@entities/experience'
import { useWorkspaceId } from '@entities/user'

/**
 * 경험(EXPERIENCE) 편집 섹션. '경험 재선택'으로 `ExperiencePickerDialog`를 열어 선택한 경험들로 아이템을 통째로 교체한다.
 * 다이얼로그는 대상 채용공고(JD) 기준 매칭 경험을 보여준다(`targetJdId`가 없으면 빈 문자열로 넘긴다).
 */
export const ExperienceSection = ({ title, sectionIndex, targetJdId }: { title: string; sectionIndex: number; targetJdId: string | null }) => {
  const [view, setView] = useState('ai')

  // Amplitude 이벤트 전송용 훅. 경험 재선택 시 이전에 선택된 경험 ID들을 추적해 `previous_experience_id`로 보낸다.
  // const { previousExperienceIds, setPreviousExperienceIds } = usePreviousExperienceIdsTracking()

  return (
    <Flex direction="column" className={'w-full px-8 pb-6'}>
      <Flex justify="between" align="center" className={'py-6'}>
        <Text variant={'headline1'}>{title}</Text>
        <SelectedControl value={view} onValueChange={setView} className="max-w-40">
          <SelectedControlItem value="ai">AI 추천</SelectedControlItem>
          <SelectedControlItem value="manual">직접 작성</SelectedControlItem>
        </SelectedControl>
      </Flex>
      <Divider color={'gray-60'} />
      <Spacing size={32} />

      {/*Todo: AI 추천과 직접 작성 기능을 구현합니다.*/}
      {view === 'ai' && <AiView targetJdId={targetJdId} />}

      {/*Todo: manual View 따로 분리*/}
      {view === 'manual' && <ManualView sectionIndex={sectionIndex} targetJdId={targetJdId} />}
    </Flex>

    //
    //   <ExperiencePickerDialog
    //     isOpen={isPickerOpen}
    //     jdId={targetJdId ?? ''}
    //     actionType={'reselect'}
    //     previousExperienceIds={previousExperienceIds}
    //     onOpenChange={setIsPickerOpen}
    //     onComplete={(experiences) => {
    //       replace(experiencesToFormItems(experiences))
    //       setPreviousExperienceIds(experiences.map((experience) => experience.experienceId))
    //       setIsPickerOpen(false)
    //     }}
    //   />
  )
}

const AiView = ({ targetJdId }: { targetJdId: string | null }) => {
  const [view, setView] = useState<'INDEX' | 'DETAIL'>('INDEX')
  // const [activeQuestionId, setActiveQuestionId] = useState<string | null>(null)
  // Todo: AI 추천 목록 api 연동 후 렌더링
  // Todo: view 전환 시 애니메이션 적용

  return (
    <>
      {view === 'INDEX' && <AiIndexView targetJdId={targetJdId} />}

      {view === 'DETAIL' && (
        <Flex direction={'column'}>
          <Flex align={'center'} gap={'1'} asChild>
            <button onClick={() => setView('INDEX')}>
              <ChevronLeft size={18} className={'text-icon-gray-light shrink-0'} />
              <Text variant={'label1'} color={'text-subtle'}>
                질문목록
              </Text>
            </button>
          </Flex>

          <Spacing size={16} />

          <Flex direction={'column'} className={'gap-2'}>
            <Text variant={'headline1'} className={'line-clamp-2'}>
              생성형 AI의 출력 결과를 직접 평가하고 품질 기준을 정의한 경험이 있나요?
            </Text>
            <Flex>
              <Text variant={'label2'} color={'text-subtler'}>
                담당 업무
              </Text>

              <Divider orientation={'vertical'} className={'mx-1.5 my-auto h-2.5'} />

              <Text variant={'label2'} color={'text-subtler'}>
                AI 모델 성능 고도화: 생성형 모델의 품질 측정 및 피드백
              </Text>
            </Flex>
          </Flex>

          <Spacing size={20} />
          <Divider color={'gray-10'} />
          <Spacing size={20} />
        </Flex>
      )}
    </>
  )
}

const AiIndexView = ({ targetJdId }: { targetJdId: string | null }) => {
  return (
    <Flex direction={'column'} className={'overflow-y-auto'}>
      <Flex gap={'3'}>
        <LogoIcon />

        <Flex direction={'column'} gap={'1'}>
          <Text variant={'headline1'}>SCOOP AI가 채용 공고에 맞는 경험을 분석했어요</Text>
          <Text variant={'label2'} color={'text-subtler'}>
            공고의 담당 업무와 우대 사항에 맞춰 이력서에 꼭 담으면 좋을 경험을 찾았어요
          </Text>
        </Flex>
      </Flex>

      <Spacing size={24} />

      <Flex direction={'column'} className={'gap-2'}>
        {targetJdId ? (
          <Suspense fallback={<AiRecommendQuestions.Skeleton />}>
            <AiRecommendQuestions targetJdId={targetJdId} />
          </Suspense>
        ) : (
          <Text variant={'label2'} color={'text-subtler'}>
            채용 공고를 연결하면 SCOOP AI가 추천 경험 질문을 생성해 드려요.
          </Text>
        )}
      </Flex>
    </Flex>
  )
}

const AiRecommendQuestions = ({ targetJdId }: { targetJdId: string }) => {
  const workspaceId = useWorkspaceId()
  const { questionRooms } = useExperienceQuestionRooms(workspaceId, targetJdId)
  return (
    <>
      {questionRooms.map((room) => (
        <Flex key={room.questionRoomId} align={'center'} className={'bg-element-gray-lighter gap-4 rounded-lg px-4 py-5'} asChild>
          <button
            className={'shrink-0'}
            onClick={() => {
              // setView('DETAIL')
            }}
          >
            <CircleCheckBig size={20} className={'text-icon-gray-lighter shrink-0'} />

            <Flex direction={'column'} className={'flex-1 gap-2'}>
              <Text variant={'headline2'} className={'line-clamp-2 text-left'}>
                {room.question}
              </Text>
              <Flex>
                <Text variant={'label2'} color={'text-subtler'} className={'shrink-0'}>
                  담당 업무
                </Text>

                <Divider orientation={'vertical'} className={'mx-1.5 my-auto h-2.5 shrink-0'} />

                <Text variant={'label2'} color={'text-subtler'} className={'truncate'}>
                  {room.sourceText}
                </Text>
              </Flex>
            </Flex>

            <ChevronRight size={18} className={'text-icon-gray-light shrink-0'} />
          </button>
        </Flex>
      ))}
    </>
  )
}

AiRecommendQuestions.Skeleton = () => {
  return (
    <>
      {[1, 2, 3, 4].map((_, index) => (
        <Flex key={index} align={'center'} className={'bg-element-gray-lighter gap-4 rounded-lg px-4 py-5'}>
          <CircleCheckBig size={20} className={'text-icon-gray-lighter shrink-0'} />

          <Flex direction={'column'} className={'flex-1 gap-2'}>
            <Skeleton className={'h-5.5 w-80'} />
            <Flex>
              <Text variant={'label2'} color={'text-subtler'} className={'shrink-0'}>
                담당 업무
              </Text>

              <Divider orientation={'vertical'} className={'mx-1.5 my-auto h-2.5 shrink-0'} />

              <Skeleton className={'h-4.5 w-full'} />
            </Flex>
          </Flex>

          <ChevronRight size={18} className={'text-icon-gray-light shrink-0'} />
        </Flex>
      ))}
    </>
  )
}

const ManualView = ({ sectionIndex, targetJdId }: { sectionIndex: number; targetJdId: string | null }) => {
  const { control } = useFormContext<ResumeFormValues>()
  const { fields, remove } = useFieldArray({ control, name: `sections.${sectionIndex}.items` as FieldArrayPath<ResumeFormValues> })

  const count = fields.length
  const scrollRef = useRef<HTMLDivElement>(null)
  const prevCount = useRef(count)

  useEffect(() => {
    if (count > prevCount.current) {
      scrollRef.current?.lastElementChild?.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
    }
    prevCount.current = count
  }, [count])

  return (
    <>
      <Flex ref={scrollRef} direction={'column'} className={'gap-12 overflow-y-auto px-1'}>
        {count === 0 ? (
          <SectionEmpty />
        ) : (
          <>
            {fields.map((field, index) => (
              <ExperienceSectionItem key={field.id} sectionIndex={sectionIndex} index={index} targetJdId={targetJdId} onRemove={() => remove(index)} />
            ))}
          </>
        )}
      </Flex>
      <Spacing size={32} />

      <AddItemButton label="경험 추가" onClick={() => {}} />
    </>
  )
}

const ExperienceSectionItem = ({ sectionIndex, index, targetJdId, onRemove }: { sectionIndex: number; index: number; targetJdId: string | null; onRemove: () => void }) => {
  const base = `sections.${sectionIndex}.items.${index}.payload.experience`

  return (
    <Flex direction={'column'}>
      <Flex justify={'between'}>
        <Text variant={'headline2'}>경험 {index + 1}</Text>

        <DeleteItemAlert onConfirm={onRemove}>
          <Button variant={'tertiary'} size={'icon-xs'}>
            <Trash2 />
          </Button>
        </DeleteItemAlert>
      </Flex>

      <Spacing size={16} />
      <Divider />
      <Spacing size={20} />

      <FormInput name={`${base}.name`} label="경험명" clearable={false} placeholder={'경험명을 입력해주세요.'} maxLength={48} />

      <Spacing size={16} />

      <Flex className={'w-full gap-4'}>
        <FormInput name={`${base}.role`} label="역할" clearable={false} placeholder={'역할을 입력해주세요.'} className={'w-full'} maxLength={20} />
        <FormPeriodPicker name={`${base}.period`} label="기간" className={'w-full'} />
      </Flex>

      <Spacing size={16} />

      <Flex direction={'column'} className={'gap-5 py-1'}>
        <FormTextarea
          name={`${base}.contents`}
          label={'세부내용'}
          sectionName="experience"
          jdId={targetJdId}
          onCopy={() => amplitude.track(AMPLITUDE_EVENTS.TEXT_COPIED, { jd_id: targetJdId, section_name: 'experience' })}
        />

        <AiFeedbackDialog
          jdId={targetJdId}
          target={{
            kind: 'EXPERIENCE',
            title: { name: `${base}.name`, label: '경험명' },
            description: { name: `${base}.contents`, label: '세부내용' }
          }}
        />
      </Flex>
    </Flex>
  )
}

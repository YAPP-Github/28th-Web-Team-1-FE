import { useEffect, useRef, useState } from 'react'
import { Flex } from '@radix-ui/themes'
import { Button, Divider, Spacing, Text } from '@shared/ui'
import { type LucideIcon, Trash2, Pencil, FolderOpen } from 'lucide-react'
import * as amplitude from '@amplitude/unified'
import { AMPLITUDE_EVENTS } from '@shared/config'
import { AddItemButton, SectionEmpty } from './Section'
import { AiFeedbackDialog } from './AiFeedbackDialog'
import { DeleteItemAlert } from './DeleteItemAlert'
import { ExperiencePickerDialog } from './ExperiencePickerDialog'
import { FormInput } from '../form/FormInput'
import { FormPeriodPicker } from '../form/FormPeriodPicker'
import { FormTextarea } from '../form/FormTextarea'
import { useSectionItems } from '../../hooks/useSectionItems'
import { SelectedControl, SelectedControlItem } from '@shared/ui/selected_control'
import { AiView } from './AiView'
import { DropdownMenu } from 'radix-ui'
import { flattenExperienceContents } from '@views/resume_create'

/**
 * 경험(EXPERIENCE) 편집 섹션. '경험 재선택'으로 `ExperiencePickerDialog`를 열어 선택한 경험들로 아이템을 통째로 교체한다.
 * 다이얼로그는 대상 채용공고(JD) 기준 매칭 경험을 보여준다(`targetJdId`가 없으면 빈 문자열로 넘긴다).
 */
export const ExperienceSection = ({ title, sectionIndex, targetJdId }: { title: string; sectionIndex: number; targetJdId: string | null }) => {
  const [view, setView] = useState('ai')

  // Amplitude 이벤트 전송용 훅. 경험 재선택 시 이전에 선택된 경험 ID들을 추적해 `previous_experience_id`로 보낸다.
  // const { previousExperienceIds, setPreviousExperienceIds } = usePreviousExperienceIdsTracking()

  return (
    <Flex direction="column" className={'min-h-0 w-full px-8 pb-6'}>
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
  )
}

const ManualView = ({ sectionIndex, targetJdId }: { sectionIndex: number; targetJdId: string | null }) => {
  const { fields, remove, addItem } = useSectionItems(sectionIndex)
  const [isPickerOpen, setIsPickerOpen] = useState(false)

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

      <DropdownMenu.Root>
        <DropdownMenu.Trigger asChild>
          <AddItemButton label="경험 추가" />
        </DropdownMenu.Trigger>
        <DropdownMenu.Content side={'top'} align={'start'} sideOffset={10} collisionPadding={15} className={'bg-element-white shadow-3 shadow-shadow-3 w-fit overflow-hidden rounded-md p-2'}>
          <MenuItem
            icon={Pencil}
            label={'직접 입력하기'}
            description={'원하는 경험을 직접 입력할 수 있어요'}
            onSelect={() => addItem({ experience: { name: '', role: null, contents: '', period: null } })}
          />
          <Divider color={'gray-10'} />
          <MenuItem icon={FolderOpen} label={'내 경험 불러오기'} description={'STAR 구조로 저장된 경험을 불러올 수 있어요'} disabled={!targetJdId} onSelect={() => setIsPickerOpen(true)} />
        </DropdownMenu.Content>
      </DropdownMenu.Root>

      {targetJdId && (
        <ExperiencePickerDialog
          key={String(isPickerOpen)}
          isOpen={isPickerOpen}
          onOpenChange={setIsPickerOpen}
          tab={'MANUAL'}
          jdId={targetJdId}
          onComplete={(experiences) => {
            experiences.forEach((experience) =>
              addItem({
                experience: {
                  name: experience.title,
                  role: experience.role,
                  period: experience.period,
                  contents: flattenExperienceContents(experience.contents)
                }
              })
            )
            setIsPickerOpen(false)
          }}
        />
      )}
    </>
  )
}

const MenuItem = ({ icon: Icon, label, description, onSelect, disabled }: { icon: LucideIcon; label: string; description: string; onSelect: () => void; disabled?: boolean }) => (
  <DropdownMenu.Item onSelect={onSelect} disabled={disabled} className={'flex cursor-pointer items-center gap-4 border-none p-2'}>
    <Icon size={18} className={'text-icon-gray-light'} />
    <Flex direction={'column'}>
      <Text variant={'label1'}>{label}</Text>
      <Text variant={'caption1'} color={'text-subtle'}>
        {description}
      </Text>
    </Flex>
  </DropdownMenu.Item>
)

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

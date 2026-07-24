'use client'
import { useState } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { Flex, Grid } from '@radix-ui/themes'
import { Plus, Pencil, ChevronDown } from 'lucide-react'
import { Button, Text } from '@shared/ui'
import { Input } from '@shared/ui/input'
import { DatePicker } from '@shared/ui/date_picker'
import { MonthPicker } from '@shared/ui/month_picker'
import { Popover, PopoverTrigger, PopoverContent } from '@shared/ui/popover'
import { Dialog, DialogTrigger, DialogContent, DialogTitle, DialogClose } from '@shared/ui/dialog'
import { formatDate, parsePeriodInput } from '@shared/lib'
import { useProfile, useUpdateProfile } from '@entities/profile'
import { useWorkspaceId } from '@entities/user'
import { ADDABLE_SECTION_TYPES, RESUME_SECTIONS, type ResumeField, type ResumeFieldSpan, type ResumeSectionInstance, type ResumeSectionType } from '../model/resumeSections'
import { profileToSections, sectionsToUpdateRequest } from '../model/profileMapping'
import type { OnboardingStepProps } from '../model/onboardingFlow'
import { OnboardingStepShell } from './OnboardingStepShell'
import { OnboardingRadioGroup, OnboardingRadioItem } from './OnboardingRadioGroup'

const createInstance = (type: ResumeSectionType): ResumeSectionInstance => ({ id: crypto.randomUUID(), type, values: {} })

/** 편집 폼 4열 그리드에서 `field.span`에 대응하는 Tailwind 클래스. (동적 문자열 조합은 JIT가 못 읽으므로 리터럴로 나열) */
const FIELD_SPAN_CLASS: Record<ResumeFieldSpan, string> = {
  1: 'col-span-1',
  2: 'col-span-2',
  3: 'col-span-3',
  4: 'col-span-4'
}

/** 온보딩 스텝: 가져온 이력서 정보 확인 (카드 그리드 + 편집/추가 모달). 업로드로 파싱된 프로필을 시드하고, 확인/편집 후 저장한다. */
export const ResumeInfoStep = ({ onDone, onPrev }: OnboardingStepProps) => {
  const workspaceId = useWorkspaceId()
  const profile = useProfile(workspaceId)
  const { mutate: updateProfile, isPending } = useUpdateProfile(workspaceId)
  const [sections, setSections] = useState<ResumeSectionInstance[]>(() => profileToSections(profile))

  const handleNext = () => {
    updateProfile(sectionsToUpdateRequest(sections), { onSuccess: () => onDone() })
  }

  const updateSection = (id: string, values: Record<string, string>) => {
    setSections((prev) => prev.map((section) => (section.id === id ? { ...section, values } : section)))
  }

  const deleteSection = (id: string) => {
    setSections((prev) => prev.filter((section) => section.id !== id))
  }

  const addSections = (types: ResumeSectionType[]) => {
    setSections((prev) => [...prev, ...types.map(createInstance)])
  }

  return (
    <OnboardingStepShell
      wide
      title="가져온 이력서 정보를 확인해 주세요."
      description="추출된 내용을 확인하고, 누락되거나 수정이 필요한 정보가 있다면 직접 편집해 주세요."
      onNext={handleNext}
      nextDisabled={isPending}
      nextLabel={isPending ? '저장 중...' : '다음'}
      onPrev={onPrev}
    >
      <div className="grid grid-cols-[repeat(3,320px)] gap-4">
        {sections.map((section) => (
          <ResumeSectionCard key={section.id} instance={section} onSave={(values) => updateSection(section.id, values)} onDelete={() => deleteSection(section.id)} />
        ))}
        <AddSectionCard onAdd={addSections} />
      </div>
    </OnboardingStepShell>
  )
}

const AddSectionCard = ({ onAdd }: { onAdd: (types: ResumeSectionType[]) => void }) => {
  const [selected, setSelected] = useState<ResumeSectionType[]>([])

  return (
    <Dialog onOpenChange={(open) => !open && setSelected([])}>
      <DialogTrigger asChild>
        <button
          type="button"
          className="border-border-primary text-text-primary-basic hover:bg-element-primary-lighter flex h-full min-h-48.75 w-full items-center justify-center gap-1 rounded-xl border transition-colors outline-none"
        >
          <Plus size={20} />
          <Text variant="headline2" color="text-primary-basic">
            항목 추가하기
          </Text>
        </button>
      </DialogTrigger>
      <DialogContent className="w-150 gap-6">
        <DialogTitle className="text-heading2 text-text-basic font-semibold">항목 추가하기</DialogTitle>
        <OnboardingRadioGroup type="multiple" value={selected} onValueChange={(val) => setSelected(val as ResumeSectionType[])} className="grid w-full grid-cols-2 gap-3">
          {ADDABLE_SECTION_TYPES.map((type) => (
            <OnboardingRadioItem key={type} value={type}>
              {RESUME_SECTIONS[type].title}
            </OnboardingRadioItem>
          ))}
        </OnboardingRadioGroup>
        <DialogClose asChild>
          <Button variant="primary" size="lg" fullWidth disabled={selected.length === 0} onClick={() => onAdd(selected)}>
            추가하기
          </Button>
        </DialogClose>
      </DialogContent>
    </Dialog>
  )
}

interface ResumeFieldInputProps {
  field: ResumeField
  value: string
  onChange: (value: string) => void
}

/**
 * 필드 종류(`field.kind`)에 따라 텍스트 `Input` / `DatePicker` / 기간용 `MonthPicker` 두 개로 렌더링한다.
 * 값은 항상 문자열 하나(`values[field.key]`)로 저장되므로, date/period는 피커 포맷과 저장 포맷 사이를 이 컴포넌트에서 왕복 변환한다.
 */
const ResumeFieldInput = ({ field, value, onChange }: ResumeFieldInputProps) => {
  if (field.kind === 'date') {
    // 저장 포맷은 API가 주는 그대로(YYYY-MM-DD), DatePicker는 YYYY.MM.DD를 주고받는다.
    const picked = formatDate(value ? value.replace(/\./g, '-') : null, 'YYYY.MM.DD') || null
    return (
      <Flex direction="column" gap="2">
        <Text variant="label1" weight="semibold" color="text-basic">
          {field.label}
        </Text>
        <DatePicker value={picked} onChange={(next) => onChange(next.replace(/\./g, '-'))} placeholder={field.placeholder} />
      </Flex>
    )
  }

  if (field.kind === 'period') {
    // 저장 포맷은 formatPeriod/parsePeriodInput과 맞춘 "YYYY.MM - YYYY.MM" 한 문자열.
    const { startAt, endAt } = parsePeriodInput(value) ?? { startAt: null, endAt: null }
    const start = formatDate(startAt, 'YYYY.MM') || null
    const end = formatDate(endAt, 'YYYY.MM') || null
    return (
      <Flex direction="column" gap="2">
        <Text variant="label1" weight="semibold" color="text-basic">
          {field.label}
        </Text>
        <Flex align="center" gap="2">
          <MonthPicker value={start} onChange={(next) => onChange([next, end].filter(Boolean).join(' - '))} placeholder="시작" className="min-w-0 flex-1" />
          <span className="text-text-subtler">-</span>
          <MonthPicker value={end} onChange={(next) => onChange([start, next].filter(Boolean).join(' - '))} placeholder="종료" className="min-w-0 flex-1" />
        </Flex>
      </Flex>
    )
  }

  if (field.kind === 'select') {
    return (
      <Flex direction="column" gap="2">
        <Text variant="label1" weight="semibold" color="text-basic">
          {field.label}
        </Text>
        <SelectDropdown value={value} onChange={onChange} options={field.options ?? []} />
      </Flex>
    )
  }

  return <Input label={field.label} placeholder={field.placeholder} clearable={false} value={value} onChange={(e) => onChange(e.target.value)} />
}

interface ResumeSectionCardProps {
  instance: ResumeSectionInstance
  onSave: (values: Record<string, string>) => void
  onDelete: () => void
}

/**
 * 이력서 섹션 카드
 * 제목 + 필드 목록(값이 있으면 값, 없으면 필드명)을 보여준다. 카드를 누르면 편집 모달이 열린다.
 */
const ResumeSectionCard = ({ instance, onSave, onDelete }: ResumeSectionCardProps) => {
  const config = RESUME_SECTIONS[instance.type]
  const {
    control,
    handleSubmit,
    formState: { isDirty }
  } = useForm<Record<string, string>>({ defaultValues: instance.values })
  const onSubmit = handleSubmit((values) => onSave(values))

  return (
    <Dialog>
      <DialogTrigger asChild>
        <button
          type="button"
          className="border-border-subtle bg-bg-white hover:bg-element-primary-lighter flex h-full min-h-48.75 w-full flex-col items-start gap-3 rounded-xl border px-5 py-4 text-left transition-colors outline-none"
        >
          <Flex align="center" justify="between" className="w-full">
            <Text variant="headline2" color="text-bolder">
              {config.title}
            </Text>
            <Pencil size={16} className="text-icon-gray-lighter" />
          </Flex>
          <Flex direction="column" className="w-full gap-1.5">
            {config.fields.map((field) => {
              const value = instance.values[field.key]
              return (
                <Flex key={field.key} justify={value ? 'between' : 'start'} className="w-full gap-1">
                  <Text variant="body2" color="text-subtler" className="shrink-0">
                    {field.label}
                  </Text>
                  {value && (
                    <Text variant="label1" color="text-subtle" className="min-w-0 truncate">
                      {value}
                    </Text>
                  )}
                </Flex>
              )
            })}
          </Flex>
        </button>
      </DialogTrigger>
      <DialogContent className="w-150 gap-6">
        <DialogTitle className="text-heading2 text-text-basic font-semibold">{config.title}</DialogTitle>
        <Grid columns="4" gap="4" className="w-full">
          {config.fields.map((field) => (
            <div key={field.key} className={FIELD_SPAN_CLASS[field.span ?? 4]}>
              <Controller control={control} name={field.key} render={({ field: rhfField }) => <ResumeFieldInput field={field} value={rhfField.value ?? ''} onChange={rhfField.onChange} />} />
            </div>
          ))}
        </Grid>
        <div className="flex w-full flex-col items-center gap-2.5">
          <DialogClose asChild>
            <Button variant="primary" size="lg" fullWidth disabled={!isDirty} onClick={onSubmit}>
              저장
            </Button>
          </DialogClose>
          {onDelete && (
            <DialogClose asChild>
              <Button variant="text" size="sm" className="text-caption1 text-text-danger" onClick={onDelete}>
                삭제하기
              </Button>
            </DialogClose>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}

interface SelectDropdownProps {
  value: string
  onChange: (value: string) => void
  options: readonly string[]
  placeholder?: string
}

/** 값 하나를 고르는 드롭다운. Popover를 트리거+목록 형태로 조립한다(예: 기술 숙련도). */
const SelectDropdown = ({ value, onChange, options, placeholder = '선택 안 함' }: SelectDropdownProps) => {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          className="border-border-subtle bg-element-white text-body2 hover:bg-element-gray-lighter focus-visible:border-border-primary flex w-full items-center justify-between gap-1 rounded-lg border px-4 py-3 text-left outline-none"
        >
          <Text as="span" variant="body2" color={value ? 'text-basic' : 'text-subtler'}>
            {value || placeholder}
          </Text>
          <ChevronDown size={18} className="text-icon-gray-lighter shrink-0" />
        </button>
      </PopoverTrigger>
      <PopoverContent align="start" sideOffset={8} className="bg-element-gray-lighter shadow-1 w-(--radix-popover-trigger-width) overflow-hidden rounded-lg">
        <Flex direction="column" className="gap-0.5">
          {['', ...options].map((option) => (
            <button
              key={option || 'none'}
              type="button"
              onClick={() => {
                onChange(option)
                setIsOpen(false)
              }}
              className="text-body2 text-text-subtle hover:bg-element-gray-light hover:text-text-basic w-full px-3 py-2.5 text-left outline-none"
            >
              {option || placeholder}
            </button>
          ))}
        </Flex>
      </PopoverContent>
    </Popover>
  )
}

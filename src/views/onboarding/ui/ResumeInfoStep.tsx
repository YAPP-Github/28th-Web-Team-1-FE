'use client'
import { useState } from 'react'
import { Flex, Grid } from '@radix-ui/themes'
import { Plus, Pencil, X, ChevronDown } from 'lucide-react'
import { Button, Text } from '@shared/ui'
import { Input } from '@shared/ui/input'
import { Chip } from '@shared/ui/chip'
import { Popover, PopoverTrigger, PopoverContent } from '@shared/ui/popover'
import { Dialog, DialogTrigger, DialogContent, DialogTitle, DialogClose } from '@shared/ui/dialog'
import { useProfile, useUpdateProfile } from '@entities/profile'
import { useWorkspaceId } from '@entities/user'
import { ADDABLE_SECTION_TYPES, RESUME_SECTIONS, SKILL_LEVELS, type ResumeSectionInstance, type ResumeSectionType, type SkillItem } from '../model/resumeSections'
import { profileToSections, sectionsToUpdateRequest } from '../model/profileMapping'
import type { OnboardingStepProps } from '../model/onboardingFlow'
import { OnboardingStepShell } from './OnboardingStepShell'
import { OnboardingRadioGroup, OnboardingRadioItem } from './OnboardingRadioGroup'

const createInstance = (type: ResumeSectionType): ResumeSectionInstance => ({ id: crypto.randomUUID(), type, values: {}, items: type === 'skill' ? [] : undefined })

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

  const updateSectionItems = (id: string, items: SkillItem[]) => {
    setSections((prev) => prev.map((section) => (section.id === id ? { ...section, items } : section)))
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
      <div className="grid w-full grid-cols-3 gap-4">
        {sections.map((section) =>
          section.type === 'skill' ? (
            <SkillSectionCard key={section.id} instance={section} onSave={(items) => updateSectionItems(section.id, items)} onDelete={() => deleteSection(section.id)} />
          ) : (
            <ResumeSectionCard key={section.id} instance={section} onSave={(values) => updateSection(section.id, values)} onDelete={() => deleteSection(section.id)} />
          )
        )}
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
  const [values, setValues] = useState<Record<string, string>>(instance.values)
  const isDirty = config.fields.some((field) => (values[field.key] ?? '') !== (instance.values[field.key] ?? ''))

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
            {config.fields.map((field) => (
              <Text key={field.key} variant="label1" color="text-subtle" className="w-full truncate">
                {instance.values[field.key] || field.label}
              </Text>
            ))}
          </Flex>
        </button>
      </DialogTrigger>
      <DialogContent className="w-150 gap-6">
        <DialogTitle className="text-heading2 text-text-basic font-semibold">{config.title}</DialogTitle>
        <Grid columns="2" gap="4" className="w-full">
          {config.fields.map((field) => (
            <div key={field.key} className={field.half ? 'col-span-1' : 'col-span-2'}>
              <Input
                label={field.label}
                placeholder={field.placeholder}
                clearable={false}
                value={values[field.key] ?? ''}
                onChange={(e) => setValues((prev) => ({ ...prev, [field.key]: e.target.value }))}
              />
            </div>
          ))}
        </Grid>
        <div className="flex w-full flex-col items-center gap-2.5">
          <DialogClose asChild>
            <Button variant="primary" size="lg" fullWidth disabled={!isDirty} onClick={() => onSave(values)}>
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

interface SkillSectionCardProps {
  instance: ResumeSectionInstance
  onSave: (items: SkillItem[]) => void
  onDelete: () => void
}
/**
 * 기술 카드
 * 기술명 + 숙련도(드롭다운)를 태그로 여러 개 추가/삭제할 수 있는 전용 카드.
 */
const SkillSectionCard = ({ instance, onSave, onDelete }: SkillSectionCardProps) => {
  const config = RESUME_SECTIONS.skill
  const [items, setItems] = useState<SkillItem[]>(instance.items ?? [])
  const [name, setName] = useState('')
  const [level, setLevel] = useState<string | undefined>(undefined)
  const isDirty = JSON.stringify(items.map(({ name, level }) => ({ name, level }))) !== JSON.stringify((instance.items ?? []).map(({ name, level }) => ({ name, level })))

  const addItem = () => {
    if (!name.trim()) return
    setItems((prev) => [...prev, { id: crypto.randomUUID(), name: name.trim(), level: level ?? '' }])
    setName('')
    setLevel(undefined)
  }

  const removeItem = (id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id))
  }

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
          <Text variant="label1" color="text-subtle" className="w-full truncate">
            {(instance.items ?? []).map((item) => item.name).join(', ') || '기술명 또는 도구명'}
          </Text>
          <Text variant="label1" color="text-subtle" className="w-full truncate">
            {(instance.items ?? [])
              .map((item) => item.level)
              .filter(Boolean)
              .join(', ') || '상/중/하'}
          </Text>
        </button>
      </DialogTrigger>
      <DialogContent className="w-150 gap-6">
        <DialogTitle className="text-heading2 text-text-basic font-semibold">{config.title}</DialogTitle>
        <Flex direction="column" className="w-full gap-5">
          <Flex align="end" className="w-full gap-2">
            <Flex className="min-w-0 flex-1 items-start gap-2">
              <Input label="기술/도구" placeholder="기술명 또는 도구명" clearable={false} className="flex-1" value={name} onChange={(e) => setName(e.target.value)} />
              <Flex direction="column" className="w-45 shrink-0 gap-2">
                <Text variant="label1" weight="semibold" color="text-basic">
                  숙련도
                </Text>
                <SkillLevelDropdown value={level} onChange={setLevel} />
              </Flex>
            </Flex>
            <Button variant="secondary" size="sm" className="h-11.75 shrink-0" disabled={!name.trim()} onClick={addItem}>
              추가
            </Button>
          </Flex>
          <Flex wrap="wrap" className="w-full gap-2">
            {items.map((item) => (
              <Chip key={item.id} asChild variant="tertiary" className="rounded-full py-2 pr-3 pl-4">
                <Flex align="center" className="gap-1.5">
                  <Text variant="body2" color="text-basic">
                    {item.level ? `${item.name} · ${item.level}` : item.name}
                  </Text>
                  <button type="button" onClick={() => removeItem(item.id)} aria-label={`${item.name} 삭제`}>
                    <X size={16} className="text-icon-gray-light" />
                  </button>
                </Flex>
              </Chip>
            ))}
          </Flex>
        </Flex>
        <div className="flex w-full flex-col items-center gap-2.5">
          <DialogClose asChild>
            <Button variant="primary" size="lg" fullWidth disabled={!isDirty} onClick={() => onSave(items)}>
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

interface SkillLevelDropdownProps {
  value?: string
  onChange: (value: string) => void
}

/** 기술 숙련도(상/중/하) 커스텀 드롭다운. Popover를 트리거+목록 형태로 조립한다. */
const SkillLevelDropdown = ({ value, onChange }: SkillLevelDropdownProps) => {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          className="border-border-subtle bg-element-white text-body2 hover:bg-element-gray-lighter focus-visible:border-border-primary flex w-45 items-center justify-between gap-1 rounded-lg border px-4 py-3 text-left outline-none"
        >
          <Text as="span" variant="body2" color={value ? 'text-basic' : 'text-subtler'}>
            {value || '선택 안 함'}
          </Text>
          <ChevronDown size={18} className="text-icon-gray-lighter shrink-0" />
        </button>
      </PopoverTrigger>
      <PopoverContent align="start" sideOffset={8} className="bg-element-gray-lighter shadow-1 w-45 overflow-hidden rounded-lg">
        <Flex direction="column" className="gap-0.5">
          {['', ...SKILL_LEVELS].map((level) => (
            <button
              key={level || 'none'}
              type="button"
              onClick={() => {
                onChange(level)
                setIsOpen(false)
              }}
              className="text-body2 text-text-subtle hover:bg-element-gray-light hover:text-text-basic w-full px-3 py-2.5 text-left outline-none"
            >
              {level || '선택 안 함'}
            </button>
          ))}
        </Flex>
      </PopoverContent>
    </Popover>
  )
}

'use client'
import { useEffect, useState } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { Flex, Grid } from '@radix-ui/themes'
import { Award, Book, BookMarked, BookType, ClipboardPen, GraduationCap, Pencil, ShieldCheck, Trash2, type LucideIcon } from 'lucide-react'
import { Button, Text } from '@shared/ui'
import { Input } from '@shared/ui/input'
import { Dialog, DialogTrigger, DialogContent, DialogTitle, DialogClose } from '@shared/ui/dialog'
import { AMPLITUDE_EVENTS } from '@shared/config'
import { useProfile, useUpdateProfile } from '@entities/profile'
import { useWorkspaceId } from '@entities/user'
import { FIELD_SPAN_CLASS, RESUME_SECTIONS, type ResumeSectionInstance, type ResumeSectionType } from '../model/resumeSections'
import { profileToSections, sectionsToUpdateRequest } from '../model/profileMapping'
import type { OnboardingStepProps } from '../model/onboardingFlow'
import { OnboardingStepShell } from './OnboardingStepShell'
import * as amplitude from '@amplitude/unified'
import { AddSectionCard } from './AddSectionCard'
import { ResumeFieldInput, SelectDropdown } from './ResumeFieldInput'

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

  const addSections = (instances: ResumeSectionInstance[]) => {
    setSections((prev) => [...prev, ...instances])
  }

  // 기술은 여러 개여도 카드 하나(태그 목록)로 묶어서 보여준다.
  const skillSections = sections.filter((section) => section.type === 'skill')
  useEffect(() => {
    // Amplitude 이벤트 전송
    amplitude.track(AMPLITUDE_EVENTS.RESUME_CONFIRM_VIEWED)
  }, [])

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
        {sections
          .filter((section) => section.type !== 'skill')
          .map((section) => (
            <ResumeSectionCard key={section.id} instance={section} onSave={(values) => updateSection(section.id, values)} onDelete={() => deleteSection(section.id)} />
          ))}
        {skillSections.length > 0 && <SkillSectionCard instances={skillSections} onSave={updateSection} onDelete={deleteSection} />}
        <AddSectionCard onAdd={addSections} />
      </div>
    </OnboardingStepShell>
  )
}

/** 섹션 타입별 카드 헤더 아이콘. */
const SECTION_ICONS: Record<ResumeSectionType, LucideIcon> = {
  basic: Book,
  education: GraduationCap,
  career: BookMarked,
  award: Award,
  language: BookType,
  certificate: ShieldCheck,
  skill: ClipboardPen
}

/**
 * 이력서 섹션 카드
 * 제목 + 필드 목록(값이 있으면 값, 없으면 필드명)을 보여준다. 카드를 누르면 편집 모달이 열린다.
 */
interface ResumeSectionCardProps {
  instance: ResumeSectionInstance
  onSave: (values: Record<string, string>) => void
  onDelete: () => void
}
const ResumeSectionCard = ({ instance, onSave, onDelete }: ResumeSectionCardProps) => {
  const config = RESUME_SECTIONS[instance.type]
  const Icon = SECTION_ICONS[instance.type]
  const {
    control,
    getValues,
    formState: { isDirty }
  } = useForm<Record<string, string>>({ defaultValues: instance.values })

  return (
    <Dialog>
      <DialogTrigger asChild>
        <button
          type="button"
          className="group border-border-subtle bg-bg-white hover:bg-element-primary-lighter flex h-full min-h-48.75 w-full flex-col items-start gap-3 rounded-xl border px-5 py-4 text-left transition-colors outline-none"
        >
          <Flex align="center" justify="between" className="w-full">
            <Flex align="center" className="gap-1.5">
              <Icon size={20} className="text-text-primary-basic group-hover:text-text-primary-bolder shrink-0 transition-colors" />
              <Text variant="headline2" className="text-text-primary-basic group-hover:text-text-primary-bolder transition-colors">
                {config.title}
              </Text>
            </Flex>
            <Pencil size={18} className="text-icon-primary-border shrink-0 opacity-0 transition-opacity group-hover:opacity-100" />
          </Flex>
          <Flex direction="column" className="w-full gap-1">
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
            <Button variant="primary" size="lg" fullWidth disabled={!isDirty} onClick={() => onSave(getValues())}>
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

/**
 * 기술 카드
 * 기술은 여러 개일 수 있어 태그 목록 하나로 묶어 보여준다. 카드 크기(다른 섹션 카드와 동일)는 고정하고,
 * 태그가 넘치면 카드는 그대로 둔 채 태그 영역만 내부 스크롤한다. 카드를 누르면 기술을 한 번에 편집할 수 있는 모달이 열린다.
 */
interface SkillSectionCardProps {
  instances: ResumeSectionInstance[]
  onSave: (id: string, values: Record<string, string>) => void
  onDelete: (id: string) => void
}
const SkillSectionCard = ({ instances, onSave, onDelete }: SkillSectionCardProps) => {
  const config = RESUME_SECTIONS.skill
  const [values, setValues] = useState<Record<string, Record<string, string>>>({})

  // 다이얼로그를 열 때마다 현재 값으로 편집 상태를 새로 잡는다(그 사이 삭제/변경됐을 수 있으므로).
  const handleOpenChange = (open: boolean) => {
    if (open) setValues(Object.fromEntries(instances.map((instance) => [instance.id, instance.values])))
  }

  const handleSave = () => {
    instances.forEach((instance) => onSave(instance.id, values[instance.id] ?? instance.values))
  }

  return (
    <Dialog onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <button
          type="button"
          className="group border-border-subtle bg-bg-white hover:bg-element-primary-lighter flex h-48.75 w-full flex-col items-start gap-3 rounded-xl border px-5 py-4 text-left transition-colors outline-none"
        >
          <Flex align="center" justify="between" className="w-full shrink-0">
            <Flex align="center" className="gap-1.5">
              <ClipboardPen size={20} className="text-text-primary-basic group-hover:text-text-primary-bolder shrink-0 transition-colors" />
              <Text variant="headline2" className="text-text-primary-basic group-hover:text-text-primary-bolder transition-colors">
                {config.title}
              </Text>
            </Flex>
            <Pencil size={18} className="text-icon-primary-border shrink-0 opacity-0 transition-opacity group-hover:opacity-100" />
          </Flex>
          <Flex wrap="wrap" className="min-h-0 w-full flex-1 content-start gap-x-1.5 gap-y-2.5 overflow-y-auto">
            {instances.map((instance) => (
              <Text key={instance.id} as="span" variant="label2" color="text-basic" className="bg-element-gray-lighter shrink-0 rounded-full px-3 py-1.5">
                {instance.values.name}
                {instance.values.level && ` · ${instance.values.level}`}
              </Text>
            ))}
          </Flex>
        </button>
      </DialogTrigger>
      <DialogContent className="w-150 gap-6">
        <DialogTitle className="text-heading2 text-text-basic font-semibold">{config.title}</DialogTitle>
        <Flex direction="column" gap="2" className="w-full">
          <Flex align="end" gap="2" className="w-full pr-2">
            <Text variant="label1" weight="semibold" color="text-basic" className="flex-1">
              {config.fields.find((field) => field.key === 'name')?.label}
            </Text>
            <Text variant="label1" weight="semibold" color="text-basic" className="w-45 shrink-0">
              {config.fields.find((field) => field.key === 'level')?.label}
            </Text>
            <div aria-hidden className="w-11.25 shrink-0" />
          </Flex>
          <Flex direction="column" gap="2" className="max-h-64.25 w-full scrollbar-gutter-stable overflow-y-auto">
            {instances.map((instance) => (
              <Flex key={instance.id} align="start" gap="2" className="w-full">
                <Input
                  className="flex-1"
                  clearable={false}
                  placeholder={config.fields.find((field) => field.key === 'name')?.placeholder}
                  value={values[instance.id]?.name ?? ''}
                  onChange={(e) => setValues((prev) => ({ ...prev, [instance.id]: { ...prev[instance.id], name: e.target.value } }))}
                />
                <div className="w-45 shrink-0">
                  <SelectDropdown
                    value={values[instance.id]?.level ?? ''}
                    onChange={(value) => setValues((prev) => ({ ...prev, [instance.id]: { ...prev[instance.id], level: value } }))}
                    options={config.fields.find((field) => field.key === 'level')?.options ?? []}
                  />
                </div>
                <Button variant="tertiary" size="icon-md" onClick={() => onDelete(instance.id)} aria-label="삭제" className="size-11.25">
                  <Trash2 size={18} />
                </Button>
              </Flex>
            ))}
          </Flex>
        </Flex>
        <DialogClose asChild>
          <Button variant="primary" size="lg" fullWidth onClick={handleSave}>
            저장
          </Button>
        </DialogClose>
      </DialogContent>
    </Dialog>
  )
}

'use client'
import { useState } from 'react'
import { Flex } from '@radix-ui/themes'
import { Plus, Pencil } from 'lucide-react'
import { Button, Text } from '@shared/ui'
import { Input } from '@shared/ui/input'
import { Dialog, DialogTrigger, DialogContent, DialogTitle, DialogClose } from '@shared/ui/dialog'
import { useProfile, useUpdateProfile } from '@entities/profile'
import { useWorkspaceId } from '@entities/user'
import { ADDABLE_SECTION_TYPES, RESUME_SECTIONS, type ResumeField, type ResumeSectionInstance, type ResumeSectionType } from '../model/resumeSections'
import { profileToSections, sectionsToUpdateRequest } from '../model/profileMapping'
import type { OnboardingStepProps } from '../model/onboardingFlow'
import { OnboardingStepShell } from './OnboardingStepShell'
import { OnboardingRadioGroup, OnboardingRadioItem } from './OnboardingRadioGroup'

const createInstance = (type: ResumeSectionType): ResumeSectionInstance => ({ id: crypto.randomUUID(), type, values: {} })

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
      <div className="grid w-full grid-cols-3 gap-4">
        {sections.map((section) => (
          <ResumeSectionCard key={section.id} instance={section} onSave={(values) => updateSection(section.id, values)} onDelete={() => deleteSection(section.id)} />
        ))}
        <AddSectionCard onAdd={addSections} />
      </div>
    </OnboardingStepShell>
  )
}

interface AddSectionCardProps {
  onAdd: (types: ResumeSectionType[]) => void
}
const AddSectionCard = ({ onAdd }: AddSectionCardProps) => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <button
          type="button"
          className="border-border-primary text-text-primary-basic hover:bg-element-primary-lighter flex h-full min-h-48.75 w-full items-center justify-center gap-1 rounded-xl border border-dashed transition-colors outline-none"
        >
          <Plus size={20} />
          <Text variant="headline2" color="text-primary-basic">
            항목 추가하기
          </Text>
        </button>
      </DialogTrigger>
      <AddSectionDialogContent onAdd={onAdd} />
    </Dialog>
  )
}

const AddSectionDialogContent = ({ onAdd }: AddSectionCardProps) => {
  const [selected, setSelected] = useState<ResumeSectionType[]>([])

  return (
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
  )
}

interface ResumeSectionCardProps {
  instance: ResumeSectionInstance
  onSave: (values: Record<string, string>) => void
  onDelete: () => void
}

/**
 * 이력서 섹션 카드
 *
 * 제목 + 필드 목록(값이 있으면 값, 없으면 필드명)을 보여준다. 카드를 누르면 편집 모달이 열린다.
 * 자체적으로 편집 `Dialog`의 트리거를 소유한다(비제어).
 */
const ResumeSectionCard = ({ instance, onSave, onDelete }: ResumeSectionCardProps) => {
  const config = RESUME_SECTIONS[instance.type]
  const [values, setValues] = useState<Record<string, string>>(instance.values)
  const isDirty = config.fields.some((field) => (values[field.key] ?? '') !== (instance.values[field.key] ?? ''))
  const rows = toRows(config.fields)

  return (
    <Dialog>
      <DialogTrigger asChild>
        <button
          type="button"
          className="border-border-subtle bg-element-white hover:border-border-primary flex h-full min-h-48.75 w-full flex-col items-start gap-3 rounded-xl border px-5 py-4 text-left transition-colors outline-none"
        >
          <Flex align="center" justify="between" className="w-full">
            <Text variant="headline2" color="text-bolder">
              {config.title}
            </Text>
            <Pencil size={16} className="text-text-subtle" />
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
        <div className="flex w-full flex-col gap-4">
          {rows.map((row, rowIndex) => (
            <div key={rowIndex} className="flex w-full gap-2">
              {row.map((field) => (
                <div key={field.key} className="min-w-0 flex-1">
                  <Input
                    label={field.label}
                    placeholder={field.placeholder}
                    clearable={false}
                    value={values[field.key] ?? ''}
                    onChange={(e) => setValues((prev) => ({ ...prev, [field.key]: e.target.value }))}
                  />
                </div>
              ))}
            </div>
          ))}
        </div>
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

type FieldRow = ResumeField[]

/** 연속된 half 필드는 한 행(2열)으로, 나머지는 각자 한 행으로 묶는다. */
const toRows = (fields: ResumeField[]): FieldRow[] => {
  const rows: FieldRow[] = []
  let pending: FieldRow = []
  for (const field of fields) {
    if (field.half) {
      pending.push(field)
      continue
    }
    if (pending.length) {
      rows.push(pending)
      pending = []
    }
    rows.push([field])
  }
  if (pending.length) rows.push(pending)
  return rows
}

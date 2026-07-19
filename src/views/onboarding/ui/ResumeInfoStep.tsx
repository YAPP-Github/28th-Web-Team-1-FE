'use client'
import { useState } from 'react'
import { Check, Plus } from 'lucide-react'
import { cn } from '@shared/lib/cn'
import { Button, Text } from '@shared/ui'
import { Dialog, DialogTrigger, DialogContent, DialogTitle, DialogClose } from '@shared/ui/dialog'
import { ADDABLE_SECTION_TYPES, RESUME_SECTIONS } from '../model/resumeSections'
import { OnboardingStepShell } from './OnboardingStepShell'
import { ResumeSectionCard } from './ResumeSectionCard'
import { INITIAL_SECTION_TYPES, type ResumeSectionInstance, type ResumeSectionType } from '../model/resumeSections'

const createInstance = (type: ResumeSectionType): ResumeSectionInstance => ({ id: crypto.randomUUID(), type, values: {} })

interface ResumeInfoStepProps {
  onDone: () => void
  onPrev: () => void
}

/** 온보딩 스텝: 가져온 이력서 정보 확인 (카드 그리드 + 편집/추가 모달) */
export const ResumeInfoStep = ({ onDone, onPrev }: ResumeInfoStepProps) => {
  const [sections, setSections] = useState<ResumeSectionInstance[]>(() => INITIAL_SECTION_TYPES.map(createInstance))

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
      onNext={onDone}
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

/** 카드 그리드 끝의 "항목 추가하기" 카드. 누르면 추가 모달이 열린다(트리거 내장). */
export const AddSectionCard = ({ onAdd }: AddSectionCardProps) => {
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

/**
 * "항목 추가하기" 모달 본문
 *
 * 추가 가능한 섹션 타입을 다중 선택(토글)하고 "추가하기"로 카드를 늘린다.
 * 같은 타입도 여러 번 추가할 수 있다(선택할 때마다 새 인스턴스).
 * 선택 state를 여기 두는 이유: 모달이 닫히면 언마운트되어 선택이 초기화된다.
 */
const AddSectionDialogContent = ({ onAdd }: AddSectionCardProps) => {
  const [selected, setSelected] = useState<ResumeSectionType[]>([])

  const toggle = (type: ResumeSectionType) => {
    setSelected((prev) => (prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]))
  }

  return (
    <DialogContent className="w-150 gap-6">
      <DialogTitle className="text-heading2 text-text-basic font-semibold">항목 추가하기</DialogTitle>
      <div className="grid w-full grid-cols-2 gap-3">
        {ADDABLE_SECTION_TYPES.map((type) => {
          const isSelected = selected.includes(type)
          return (
            <button
              key={type}
              type="button"
              aria-pressed={isSelected}
              onClick={() => toggle(type)}
              className={cn(
                'flex w-full items-center justify-between rounded-xl border border-transparent px-5 py-4 text-left transition-all outline-none',
                'bg-btn-tertiary-fill text-text-basic',
                'focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-3',
                isSelected && 'bg-element-white border-btn-secondary-border text-text-primary-basic'
              )}
            >
              <span className="text-label1 font-semibold">{RESUME_SECTIONS[type].title}</span>
              <Check size={24} className={isSelected ? 'text-text-primary-basic' : 'text-text-disabled'} />
            </button>
          )
        })}
      </div>
      <DialogClose asChild>
        <Button variant="primary" size="lg" fullWidth disabled={selected.length === 0} onClick={() => onAdd(selected)}>
          추가하기
        </Button>
      </DialogClose>
    </DialogContent>
  )
}

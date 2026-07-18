'use client'
import { useState } from 'react'
import { OnboardingStepHeader } from '../OnboardingStepHeader'
import { OnboardingFooter } from '../OnboardingFooter'
import { ResumeSectionCard } from '../resume/ResumeSectionCard'
import { AddSectionCard } from '../resume/AddSectionCard'
import { INITIAL_SECTION_TYPES, type ResumeSectionInstance, type ResumeSectionType } from '../../model/resumeSections'

const createInstance = (type: ResumeSectionType): ResumeSectionInstance => ({ id: crypto.randomUUID(), type, values: {} })

interface ResumeInfoStepProps {
  onNext: () => void
  onPrev: () => void
}

/** 온보딩 스텝: 가져온 이력서 정보 확인 (카드 그리드 + 편집/추가 모달) */
export const ResumeInfoStep = ({ onNext, onPrev }: ResumeInfoStepProps) => {
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
    <>
      <OnboardingStepHeader title="가져온 이력서 정보를 확인해 주세요." description="추출된 내용을 확인하고, 누락되거나 수정이 필요한 정보가 있다면 직접 편집해 주세요." />
      <div className="grid w-full grid-cols-3 gap-4">
        {sections.map((section) => (
          <ResumeSectionCard key={section.id} instance={section} onSave={(values) => updateSection(section.id, values)} onDelete={() => deleteSection(section.id)} />
        ))}
        <AddSectionCard onAdd={addSections} />
      </div>
      <OnboardingFooter onPrev={onPrev} onNext={onNext} />
    </>
  )
}

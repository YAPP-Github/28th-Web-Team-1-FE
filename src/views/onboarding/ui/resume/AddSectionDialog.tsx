'use client'
import { useState } from 'react'
import { Check } from 'lucide-react'
import { cn } from '@shared/lib/cn'
import { Button } from '@shared/ui'
import { DialogContent, DialogTitle, DialogClose } from '@shared/ui/dialog'
import { ADDABLE_SECTION_TYPES, RESUME_SECTIONS, type ResumeSectionType } from '../../model/resumeSections'

interface AddSectionDialogContentProps {
  onAdd: (types: ResumeSectionType[]) => void
}

/**
 * "항목 추가하기" 모달 본문
 *
 * 추가 가능한 섹션 타입을 다중 선택(토글)하고 "추가하기"로 카드를 늘린다.
 * 같은 타입도 여러 번 추가할 수 있다(선택할 때마다 새 인스턴스).
 */
export const AddSectionDialogContent = ({ onAdd }: AddSectionDialogContentProps) => {
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

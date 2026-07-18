'use client'
import { Plus } from 'lucide-react'
import { Text } from '@shared/ui'
import { Dialog, DialogTrigger } from '@shared/ui/dialog'
import { AddSectionDialogContent } from './AddSectionDialog'
import type { ResumeSectionType } from '../../model/resumeSections'

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

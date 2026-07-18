'use client'
import { Pencil } from 'lucide-react'
import { Text } from '@shared/ui'
import { Dialog, DialogTrigger } from '@shared/ui/dialog'
import { ResumeSectionDialogContent } from './ResumeSectionDialog'
import { RESUME_SECTIONS, type ResumeSectionInstance } from '../../model/resumeSections'

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
export const ResumeSectionCard = ({ instance, onSave, onDelete }: ResumeSectionCardProps) => {
  const config = RESUME_SECTIONS[instance.type]

  return (
    <Dialog>
      <DialogTrigger asChild>
        <button
          type="button"
          className="border-border-subtle bg-element-white hover:border-border-primary flex h-full min-h-48.75 w-full flex-col items-start gap-3 rounded-xl border px-5 py-4 text-left transition-colors outline-none"
        >
          <div className="flex w-full items-center justify-between">
            <Text variant="headline2" color="text-bolder">
              {config.title}
            </Text>
            <Pencil size={16} className="text-text-subtle" />
          </div>
          <div className="flex w-full flex-col gap-1.5">
            {config.fields.map((field) => (
              <Text key={field.key} variant="label1" color="text-subtle" className="w-full truncate">
                {instance.values[field.key] || field.label}
              </Text>
            ))}
          </div>
        </button>
      </DialogTrigger>
      <ResumeSectionDialogContent config={config} initialValues={instance.values} onSave={onSave} onDelete={config.fixed ? undefined : onDelete} />
    </Dialog>
  )
}

'use client'
import { useState } from 'react'
import { Pencil } from 'lucide-react'
import { Button, Text } from '@shared/ui'
import { Input } from '@shared/ui/input'
import { Dialog, DialogTrigger, DialogContent, DialogTitle, DialogClose } from '@shared/ui/dialog'
import { RESUME_SECTIONS, type ResumeField, type ResumeSectionInstance } from '../model/resumeSections'

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

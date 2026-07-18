'use client'
import { useState } from 'react'
import { Button } from '@shared/ui'
import { Input } from '@shared/ui/input'
import { DialogContent, DialogTitle, DialogClose } from '@shared/ui/dialog'
import type { ResumeField, ResumeSectionConfig } from '../../model/resumeSections'

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

interface ResumeSectionDialogContentProps {
  config: ResumeSectionConfig
  initialValues: Record<string, string>
  onSave: (values: Record<string, string>) => void
  /** 제공되면 "삭제하기"를 노출한다(고정 섹션은 미제공). */
  onDelete?: () => void
}

/**
 * 이력서 섹션 편집 모달 본문
 *
 * `config.fields` 스키마로 입력 폼을 구성한다. 값이 변경되면 "저장"이 활성화되고,
 * 저장/삭제는 `DialogClose`로 감싸 사용자 클릭 시 모달이 닫힌다.
 * 비제어 `Dialog`가 닫힐 때 언마운트되므로 다시 열면 초기값에서 시작한다.
 */
export const ResumeSectionDialogContent = ({ config, initialValues, onSave, onDelete }: ResumeSectionDialogContentProps) => {
  const [values, setValues] = useState<Record<string, string>>(initialValues)
  const isDirty = config.fields.some((field) => (values[field.key] ?? '') !== (initialValues[field.key] ?? ''))
  const rows = toRows(config.fields)

  return (
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
  )
}

import { type ComponentProps } from 'react'
import { Controller, useFormContext, type FieldPath } from 'react-hook-form'
import { Textarea } from '@shared/ui/textarea'
import type { ResumeFormValues } from '../../model/resume-form.types'

type FormTextareaProps = Omit<ComponentProps<typeof Textarea>, 'value' | 'onChange' | 'onBlur' | 'name'> & {
  /** 폼 필드 경로. 동적 경로라 `string`으로 받고 어댑터 내부에서만 RHF 타입으로 좁힌다. */
  name: string
}

/**
 * 디자인 시스템 `Textarea`를 react-hook-form에 연결하는 제어형 브릿지.
 * 연동 방식·이유는 {@link FormInput}과 동일하다. (글자수 카운터 등 내부 상태 보존)
 */
export const FormTextarea = ({ name, ...props }: FormTextareaProps) => {
  const { control } = useFormContext<ResumeFormValues>()

  return (
    <Controller
      control={control}
      name={name as FieldPath<ResumeFormValues>}
      render={({ field }) => <Textarea {...props} value={typeof field.value === 'string' ? field.value : ''} onChange={field.onChange} onBlur={field.onBlur} maxLength={500} />}
    />
  )
}

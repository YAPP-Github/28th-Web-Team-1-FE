import { type ComponentProps } from 'react'
import { Controller, useFormContext, type FieldPath } from 'react-hook-form'
import { Textarea } from '@shared/ui/textarea'
import { useSectionEditTracking } from '../../hooks/useSectionEditTracking'
import type { ResumeFormValues } from '../../model/resume-form.types'

type FormTextareaProps = Omit<ComponentProps<typeof Textarea>, 'value' | 'onChange' | 'onBlur' | 'name'> & {
  /** 폼 필드 경로. 동적 경로라 `string`으로 받고 어댑터 내부에서만 RHF 타입으로 좁힌다. */
  name: string
  /** Amplitude 이벤트 전송 시만 사용. */
  sectionName?: 'core_competency' | 'experience' | 'career'
  /** Amplitude 이벤트 전송 시만 사용. 대상 채용공고 ID. */
  jdId?: string | null
}

/**
 * 디자인 시스템 `Textarea`를 react-hook-form에 연결하는 제어형 브릿지.
 * 연동 방식·이유는 {@link FormInput}과 동일하다. (글자수 카운터 등 내부 상태 보존)
 */
export const FormTextarea = ({ name, sectionName, jdId, ...props }: FormTextareaProps) => {
  const { control } = useFormContext<ResumeFormValues>()
  // Amplitude 이벤트 전송용 훅. `sectionName`이 없으면 아무 일도 하지 않는다.
  const { handleFocus, handleChange } = useSectionEditTracking(sectionName ?? 'experience', 'editor', jdId ?? null)

  return (
    <Controller
      control={control}
      name={name as FieldPath<ResumeFormValues>}
      render={({ field }) => (
        <Textarea
          {...props}
          value={typeof field.value === 'string' ? field.value : ''}
          onFocus={(e) => sectionName && handleFocus(e.target.value)}
          onChange={(e) => {
            if (sectionName) handleChange(e.target.value)
            field.onChange(e)
          }}
          onBlur={field.onBlur}
          maxLength={500}
        />
      )}
    />
  )
}

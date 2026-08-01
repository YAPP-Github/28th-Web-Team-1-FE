import { Controller, useFormContext, type FieldPath } from 'react-hook-form'
import { SelectBox, type SelectBoxOption } from '@shared/ui/select_box'
import type { ResumeFormValues } from '../../model/resume-form.types'

type FormSelectProps = {
  /** 폼 필드 경로. 배열 인덱스가 섞인 동적 경로라 `string`으로 받고 어댑터 내부에서만 RHF 타입으로 좁힌다. */
  name: string
  label: string
  placeholder: string
  className?: string
  /** `{ value: enum 코드, label: 한글 }` 선택지. 폼에는 value(코드)를 저장하고 화면엔 label을 보여준다. */
  options: readonly SelectBoxOption[]
}

/**
 * 공용 `SelectBox`를 react-hook-form에 연결하는 제어형 브릿지. `FormInput`의 select 버전.
 * 폼 값에는 서버 enum 코드(`option.value`)를 그대로 저장해 저장/재로딩 왕복이 맞게 한다.
 */
export const FormSelect = ({ name, label, placeholder, className, options }: FormSelectProps) => {
  const { control } = useFormContext<ResumeFormValues>()

  return (
    <Controller
      control={control}
      name={name as FieldPath<ResumeFormValues>}
      render={({ field }) => (
        <SelectBox label={label} placeholder={placeholder} options={options} className={className} value={typeof field.value === 'string' ? field.value : ''} onChange={field.onChange} />
      )}
    />
  )
}

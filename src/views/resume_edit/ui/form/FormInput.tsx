import { type ComponentProps } from 'react'
import { Controller, useFormContext, type FieldPath } from 'react-hook-form'
import { Input } from '@shared/ui/input'
import type { ResumeFormValues } from '../../model/resume-form.types'

type FormInputProps = Omit<ComponentProps<typeof Input>, 'value' | 'onChange' | 'onBlur' | 'name'> & {
  /** 폼 필드 경로. 배열 인덱스가 섞인 동적 경로라 `string`으로 받고 어댑터 내부에서만 RHF 타입으로 좁힌다. */
  name: string
}

/**
 * 디자인 시스템 `Input`을 react-hook-form에 연결하는 제어형 브릿지.
 *
 * `Input`이 내부 ref·clear 버튼 상태를 자체 관리하므로 `register`(ref 주입)와 충돌한다.
 * 대신 `Controller`로 `value`/`onChange`만 넘겨 컴포넌트를 건드리지 않고 연동한다.
 * 타이핑이 폼 값에 반영되면 미리보기(`useWatch`)가 즉시 갱신된다.
 */
export const FormInput = ({ name, ...props }: FormInputProps) => {
  const { control } = useFormContext<ResumeFormValues>()

  return (
    <Controller
      control={control}
      name={name as FieldPath<ResumeFormValues>}
      render={({ field }) => <Input {...props} value={typeof field.value === 'string' ? field.value : ''} onChange={field.onChange} onBlur={field.onBlur} maxLength={150} />}
    />
  )
}

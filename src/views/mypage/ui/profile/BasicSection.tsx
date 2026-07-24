'use client'
import { Controller } from 'react-hook-form'
import { Flex } from '@radix-ui/themes'
import { Input } from '@shared/ui/input'
import { useProfile } from '@entities/profile'
import { useWorkspaceId } from '@entities/user'
import { toBasicForm, withBasic, type BasicForm } from '../../model/profileForm'
import { SaveButton, useProfileSectionForm } from './sectionForm'

export const BasicSection = () => {
  const profile = useProfile(useWorkspaceId())
  const { control, onSubmit, isDirty, isPending } = useProfileSectionForm<BasicForm>(toBasicForm(profile), (values) => withBasic(profile, values))

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-5">
      <Controller
        control={control}
        name="name"
        render={({ field }) => <Input label="이름" clearable={false} placeholder="이름을 입력해 주세요." value={field.value ?? ''} onChange={field.onChange} onBlur={field.onBlur} />}
      />
      <Flex className="w-full gap-4">
        <Controller
          control={control}
          name="phone"
          render={({ field }) => <Input label="연락처" clearable={false} placeholder="010-1234-5678" className="w-full" value={field.value ?? ''} onChange={field.onChange} onBlur={field.onBlur} />}
        />
        <Controller
          control={control}
          name="email"
          render={({ field }) => <Input label="이메일" clearable={false} placeholder="ID@gmail.com" className="w-full" value={field.value ?? ''} onChange={field.onChange} onBlur={field.onBlur} />}
        />
      </Flex>
      <SaveButton disabled={!isDirty || isPending} />
    </form>
  )
}

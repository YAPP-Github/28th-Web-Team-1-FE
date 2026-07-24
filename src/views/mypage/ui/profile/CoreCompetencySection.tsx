'use client'
import { Controller } from 'react-hook-form'
import { Textarea } from '@shared/ui/textarea'
import { useProfile } from '@entities/profile'
import { useWorkspaceId } from '@entities/user'
import { toCoreCompetencyForm, withCoreCompetency, type CoreCompetencyForm } from '../../model/profileForm'
import { SaveButton, useProfileSectionForm } from './sectionForm'

export const CoreCompetencySection = () => {
  const profile = useProfile(useWorkspaceId())
  const { control, onSubmit, isDirty, isPending } = useProfileSectionForm<CoreCompetencyForm>(toCoreCompetencyForm(profile), (values) => withCoreCompetency(profile, values))

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-5">
      <Controller
        control={control}
        name="coreCompetency"
        render={({ field }) => <Textarea maxLength={500} placeholder="핵심 역량을 입력해 주세요." value={field.value ?? ''} onChange={field.onChange} onBlur={field.onBlur} />}
      />
      <SaveButton disabled={!isDirty || isPending} />
    </form>
  )
}

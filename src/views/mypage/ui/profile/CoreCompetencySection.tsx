'use client'
import { Controller } from 'react-hook-form'
import { Textarea } from '@shared/ui/textarea'
import type { Profile } from '@entities/profile'
import { toCoreCompetencyForm, withCoreCompetency, type CoreCompetencyForm } from '../../model/profileForm'
import { SaveButton } from './sectionForm'
import { useProfileSectionForm } from '../../hooks/useProfileSectionForm'

export const CoreCompetencySection = ({ profile }: { profile: Profile }) => {
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

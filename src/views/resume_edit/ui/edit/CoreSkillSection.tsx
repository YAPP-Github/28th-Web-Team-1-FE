import { useFieldArray, useFormContext, type FieldArrayPath } from 'react-hook-form'
import { Flex } from '@radix-ui/themes'
import * as amplitude from '@amplitude/unified'
import { AMPLITUDE_EVENTS } from '@shared/lib'
import { Section } from './Section'
import { AiFeedbackDialog } from './AiFeedbackDialog'
import { FormTextarea } from '../form/FormTextarea'
import type { ResumeFormValues } from '../../model/resume-form.types'

export const CoreSkillSection = ({ title, sectionIndex, targetJdId }: { title: string; sectionIndex: number; targetJdId: string | null }) => {
  const { control } = useFormContext<ResumeFormValues>()
  const { fields } = useFieldArray({ control, name: `sections.${sectionIndex}.items` as FieldArrayPath<ResumeFormValues> })

  return (
    <Section title={title}>
      {fields.map((field, index) => (
        <CoreSkillItem key={field.id} sectionIndex={sectionIndex} index={index} targetJdId={targetJdId} />
      ))}
    </Section>
  )
}

const CoreSkillItem = ({ sectionIndex, index, targetJdId }: { sectionIndex: number; index: number; targetJdId: string | null }) => {
  const contentName = `sections.${sectionIndex}.items.${index}.payload.coreSkill.content`

  return (
    <Flex direction={'column'} className={'gap-5 py-1'}>
      <FormTextarea name={contentName} label={'내용'} sectionName="core_competency" onCopy={() => amplitude.track(AMPLITUDE_EVENTS.TEXT_COPIED, { section_name: 'core_competency' })} />
      <AiFeedbackDialog targets={[{ name: contentName, label: '내용', kind: 'CORE_COMPETENCY', multiline: true }]} jdId={targetJdId} />
    </Flex>
  )
}

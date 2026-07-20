import { useFieldArray, useFormContext, type FieldArrayPath } from 'react-hook-form'
import { Flex } from '@radix-ui/themes'
import { Button } from '@shared/ui'
import { PencilSparkles } from 'lucide-react'
import { Section } from './Section'
import { FormTextarea } from '../form/FormTextarea'
import type { ResumeFormValues } from '../../model/resume-form.types'

export const CoreSkillSection = ({ title, sectionIndex }: { title: string; sectionIndex: number }) => {
  const { control } = useFormContext<ResumeFormValues>()
  const { fields } = useFieldArray({ control, name: `sections.${sectionIndex}.items` as FieldArrayPath<ResumeFormValues> })

  return (
    <Section title={title}>
      {fields.map((field, index) => (
        <CoreSkillItem key={field.id} sectionIndex={sectionIndex} index={index} />
      ))}
    </Section>
  )
}

const CoreSkillItem = ({ sectionIndex, index }: { sectionIndex: number; index: number }) => {
  return (
    <Flex direction={'column'} className={'gap-5 py-1'}>
      <FormTextarea name={`sections.${sectionIndex}.items.${index}.payload.coreSkill.content`} label={'내용'} />
      <Button variant={'secondary'} size={'sm'} className={'ml-auto w-fit'}>
        <PencilSparkles size={16} data-icon="inline-start" />
        AI 첨삭
      </Button>
    </Flex>
  )
}

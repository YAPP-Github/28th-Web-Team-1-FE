'use client'
import { useState } from 'react'
import { useFieldArray } from 'react-hook-form'
import { Flex } from '@radix-ui/themes'
import { X } from 'lucide-react'
import { Button, Text } from '@shared/ui'
import { Input } from '@shared/ui/input'
import { Chip } from '@shared/ui/chip'
import type { Profile } from '@entities/profile'
import { SKILL_LEVEL_OPTIONS, toSkillForms, withSkills, type SkillForm } from '../../model/profileForm'
import { SelectBox } from './SelectBox'
import { SaveButton, useProfileSectionForm } from './sectionForm'

interface SkillSectionForm {
  items: SkillForm[]
}

export const SkillSection = ({ profile }: { profile: Profile }) => {
  const { control, onSubmit, isDirty, isPending } = useProfileSectionForm<SkillSectionForm>({ items: toSkillForms(profile) }, (values) => withSkills(profile, values.items))
  const { fields, append, remove } = useFieldArray({ control, name: 'items' })

  // 새 기술은 상단 입력으로 만들어 append하므로, 입력 중 값은 폼이 아닌 로컬 상태로 둔다.
  const [name, setName] = useState('')
  const [level, setLevel] = useState('')

  const addSkill = () => {
    if (!name.trim()) return
    append({ name: name.trim(), level })
    setName('')
    setLevel('')
  }

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-5">
      <Flex align="end" gap="2">
        <Flex className="min-w-0 flex-1 items-start gap-2">
          <Input
            label="기술/도구"
            placeholder="기술명 또는 도구명"
            clearable={false}
            className="flex-1"
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={(e) => {
              if (e.key !== 'Enter') return
              e.preventDefault()
              addSkill()
            }}
          />
          <Flex direction="column" className="w-45 shrink-0 gap-2">
            <Text variant="label1" weight="semibold">
              숙련도
            </Text>
            <SelectBox placeholder="선택 안 함" options={SKILL_LEVEL_OPTIONS} value={level} onChange={setLevel} />
          </Flex>
        </Flex>
        <Button type="button" variant="secondary" size="sm" className="h-11.75 shrink-0" disabled={!name.trim()} onClick={addSkill}>
          추가
        </Button>
      </Flex>

      <Flex wrap="wrap" className="gap-2">
        {fields.map((arrayField, index) => {
          const levelLabel = SKILL_LEVEL_OPTIONS.find((option) => option.value === arrayField.level)?.label
          return (
            <Chip key={arrayField.id} asChild variant="tertiary" className="rounded-full py-2 pr-3 pl-4">
              <Flex align="center" className="gap-1.5">
                <Text variant="body2" color="text-basic">
                  {levelLabel ? `${arrayField.name} · ${levelLabel}` : arrayField.name}
                </Text>
                <button type="button" onClick={() => remove(index)} aria-label={`${arrayField.name} 삭제`}>
                  <X size={16} className="text-icon-gray-light" />
                </button>
              </Flex>
            </Chip>
          )
        })}
      </Flex>

      <SaveButton disabled={!isDirty || isPending} />
    </form>
  )
}

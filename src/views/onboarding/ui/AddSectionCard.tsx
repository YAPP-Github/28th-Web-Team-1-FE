'use client'
import { useRef, useState } from 'react'
import { Flex, Grid } from '@radix-ui/themes'
import { Plus, X } from 'lucide-react'
import { Button, Text } from '@shared/ui'
import { Divider } from '@shared/ui/divider'
import { Dialog, DialogTrigger, DialogContent, DialogTitle, DialogClose } from '@shared/ui/dialog'
import { cn } from '@shared/lib/cn'
import { ADDABLE_SECTION_TYPES, FIELD_SPAN_CLASS, RESUME_SECTIONS, type ResumeSectionInstance, type ResumeSectionType } from '../model/resumeSections'
import { ResumeFieldInput } from './ResumeFieldInput'

interface AddedSection {
  id: string
  type: ResumeSectionType
}

/** 같은 타입이 여러 번 추가됐을 때 구분용 표시 라벨("경력 1", "경력 2" ...). 하나뿐이면 타입 제목 그대로. */
const sectionLabel = (section: AddedSection, all: AddedSection[]) => {
  const sameType = all.filter((s) => s.type === section.type)
  if (sameType.length <= 1) return RESUME_SECTIONS[section.type].title
  return `${RESUME_SECTIONS[section.type].title} ${sameType.indexOf(section) + 1}`
}

/** 온보딩 "항목 추가하기" 트리거 카드. 누르면 카테고리별 폼을 채워 추가하는 모달이 열린다. 왼쪽 카테고리 버튼은 여러 번 눌러 같은 타입을 여러 개 추가할 수 있다. */
export const AddSectionCard = ({ onAdd }: { onAdd: (instances: ResumeSectionInstance[]) => void }) => {
  const [added, setAdded] = useState<AddedSection[]>([])
  const [values, setValues] = useState<Record<string, Record<string, string>>>({})
  const sectionRefs = useRef<Record<string, HTMLDivElement | null>>({})

  const reset = () => {
    setAdded([])
    setValues({})
  }

  const addSection = (type: ResumeSectionType) => {
    const id = crypto.randomUUID()
    setAdded((prev) => [...prev, { id, type }])
    setValues((prev) => ({ ...prev, [id]: {} }))
    requestAnimationFrame(() => sectionRefs.current[id]?.scrollIntoView({ behavior: 'smooth', block: 'nearest' }))
  }

  const removeSection = (id: string) => {
    setAdded((prev) => prev.filter((section) => section.id !== id))
    setValues((prev) => {
      const { [id]: _removed, ...rest } = prev
      return rest
    })
  }

  const setFieldValue = (id: string, key: string, value: string) => {
    setValues((prev) => ({ ...prev, [id]: { ...prev[id], [key]: value } }))
  }

  const handleSave = () => {
    onAdd(added.map(({ id, type }) => ({ id: crypto.randomUUID(), type, values: values[id] ?? {} })))
  }

  return (
    <Dialog onOpenChange={(open) => !open && reset()}>
      <DialogTrigger asChild>
        <button
          type="button"
          className="border-border-primary text-text-primary-basic hover:bg-element-primary-lighter flex h-full min-h-48.75 w-full items-center justify-center gap-1 rounded-xl border transition-colors outline-none"
        >
          <Plus size={20} />
          <Text variant="headline2" color="text-primary-basic">
            항목 추가하기
          </Text>
        </button>
      </DialogTrigger>
      <DialogContent className="flex max-h-[85vh] w-full max-w-220 flex-col gap-6 p-6">
        <DialogTitle className="text-heading2 text-text-basic font-semibold">항목 추가하기</DialogTitle>
        <Flex gap="3" className="min-h-0 flex-1">
          <Flex direction="column" gap="2" className="w-45 shrink-0">
            {ADDABLE_SECTION_TYPES.map((type) => (
              <CategoryChip key={type} label={RESUME_SECTIONS[type].title} variant="add" onClick={() => addSection(type)} />
            ))}
          </Flex>
          <Divider orientation="vertical" className="h-auto self-stretch" color="gray-10" />
          {added.length === 0 ? (
            // 아무 항목도 추가되지 않았을 때 안내 문구
            <Flex align="center" justify="center" className="border-border-subtle min-w-0 flex-1 rounded-xl border border-dashed px-6 py-5">
              <Flex direction="column" align="center" gap="3" className="text-center">
                <Text variant="headline2" weight="semibold" color="text-basic">
                  추가하고 싶은 항목을 선택해주세요.
                </Text>
                <Text variant="body2" color="text-subtler">
                  필요한 항목을 선택하면 정보를 추가할 수 있어요.
                </Text>
              </Flex>
            </Flex>
          ) : (
            <Flex direction="column" gap="6" className="min-w-0 flex-1 overflow-y-auto">
              {added.map((section, index) => (
                <div key={section.id}>
                  {index > 0 && <Divider className="mb-6" color="gray-10" />}
                  <div ref={(el) => void (sectionRefs.current[section.id] = el)}>
                    <Flex direction="column" gap="4">
                      <Text variant="headline1" weight="semibold" color="text-basic">
                        {sectionLabel(section, added)}
                      </Text>
                      <Grid columns="4" gap="4" className="w-full">
                        {RESUME_SECTIONS[section.type].fields.map((field) => (
                          <div key={field.key} className={FIELD_SPAN_CLASS[field.span ?? 4]}>
                            <ResumeFieldInput field={field} value={values[section.id]?.[field.key] ?? ''} onChange={(value) => setFieldValue(section.id, field.key, value)} />
                          </div>
                        ))}
                      </Grid>
                    </Flex>
                  </div>
                </div>
              ))}
            </Flex>
          )}
        </Flex>
        {added.length > 0 && (
          <Flex direction="column" gap="4" className="shrink-0">
            <Text variant="headline2" weight="semibold" color="text-bolder">
              선택된 항목
            </Text>
            <Flex gap="2" className="overflow-x-auto pb-1">
              {added.map((section) => (
                <CategoryChip key={section.id} label={sectionLabel(section, added)} variant="remove" onClick={() => removeSection(section.id)} className="shrink-0" />
              ))}
            </Flex>
          </Flex>
        )}
        <DialogClose asChild>
          <Button variant="primary" size="lg" fullWidth disabled={added.length === 0} onClick={handleSave}>
            저장
          </Button>
        </DialogClose>
      </DialogContent>
    </Dialog>
  )
}

interface CategoryChipProps {
  label: string
  variant: 'add' | 'remove'
  onClick: () => void
  className?: string
}
const CategoryChip = ({ label, variant, onClick, className }: CategoryChipProps) => {
  const isRemove = variant === 'remove'
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'flex w-45 items-center justify-between rounded-lg px-3 py-2.5 text-left transition-colors outline-none',
        isRemove ? 'bg-element-gray-lighter text-text-subtle' : 'border-border-subtle text-text-subtler border border-dashed',
        // hover
        'hover:bg-element-primary-lighter hover:text-text-primary-basic',
        // active
        'active:border-border-primary active:border-solid',
        className
      )}
    >
      <Text as="span" variant="label1" weight="semibold" className="truncate">
        {label}
      </Text>
      {isRemove ? <X size={16} className="shrink-0" /> : <Plus size={16} className="shrink-0" />}
    </button>
  )
}

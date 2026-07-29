'use client'
import { useEffect, useState } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { Flex, Grid } from '@radix-ui/themes'
import { Pencil } from 'lucide-react'
import { Button, Text } from '@shared/ui'
import { Dialog, DialogTrigger, DialogContent, DialogTitle, DialogClose } from '@shared/ui/dialog'
import { AMPLITUDE_EVENTS } from '@shared/config'
import { useProfile, useUpdateProfile } from '@entities/profile'
import { useWorkspaceId } from '@entities/user'
import { FIELD_SPAN_CLASS, RESUME_SECTIONS, type ResumeSectionInstance } from '../model/resumeSections'
import { profileToSections, sectionsToUpdateRequest } from '../model/profileMapping'
import type { OnboardingStepProps } from '../model/onboardingFlow'
import { OnboardingStepShell } from './OnboardingStepShell'
import * as amplitude from '@amplitude/unified'
import { AddSectionCard } from './AddSectionCard'
import { ResumeFieldInput } from './ResumeFieldInput'

/** 온보딩 스텝: 가져온 이력서 정보 확인 (카드 그리드 + 편집/추가 모달). 업로드로 파싱된 프로필을 시드하고, 확인/편집 후 저장한다. */
export const ResumeInfoStep = ({ onDone, onPrev }: OnboardingStepProps) => {
  const workspaceId = useWorkspaceId()
  const profile = useProfile(workspaceId)
  const { mutate: updateProfile, isPending } = useUpdateProfile(workspaceId)
  const [sections, setSections] = useState<ResumeSectionInstance[]>(() => profileToSections(profile))

  const handleNext = () => {
    updateProfile(sectionsToUpdateRequest(sections), { onSuccess: () => onDone() })
  }

  const updateSection = (id: string, values: Record<string, string>) => {
    setSections((prev) => prev.map((section) => (section.id === id ? { ...section, values } : section)))
  }

  const deleteSection = (id: string) => {
    setSections((prev) => prev.filter((section) => section.id !== id))
  }

  const addSections = (instances: ResumeSectionInstance[]) => {
    setSections((prev) => [...prev, ...instances])
  }

  useEffect(() => {
    // Amplitude 이벤트 전송
    amplitude.track(AMPLITUDE_EVENTS.RESUME_CONFIRM_VIEWED)
  }, [])

  return (
    <OnboardingStepShell
      wide
      title="가져온 이력서 정보를 확인해 주세요."
      description="추출된 내용을 확인하고, 누락되거나 수정이 필요한 정보가 있다면 직접 편집해 주세요."
      onNext={handleNext}
      nextDisabled={isPending}
      nextLabel={isPending ? '저장 중...' : '다음'}
      onPrev={onPrev}
    >
      <div className="grid grid-cols-[repeat(3,320px)] gap-4">
        {sections.map((section) => (
          <ResumeSectionCard key={section.id} instance={section} onSave={(values) => updateSection(section.id, values)} onDelete={() => deleteSection(section.id)} />
        ))}
        <AddSectionCard onAdd={addSections} />
      </div>
    </OnboardingStepShell>
  )
}

/**
 * 이력서 섹션 카드
 * 제목 + 필드 목록(값이 있으면 값, 없으면 필드명)을 보여준다. 카드를 누르면 편집 모달이 열린다.
 */
interface ResumeSectionCardProps {
  instance: ResumeSectionInstance
  onSave: (values: Record<string, string>) => void
  onDelete: () => void
}
const ResumeSectionCard = ({ instance, onSave, onDelete }: ResumeSectionCardProps) => {
  const config = RESUME_SECTIONS[instance.type]
  const {
    control,
    getValues,
    formState: { isDirty }
  } = useForm<Record<string, string>>({ defaultValues: instance.values })

  return (
    <Dialog>
      <DialogTrigger asChild>
        <button
          type="button"
          className="border-border-subtle bg-bg-white hover:bg-element-primary-lighter flex h-full min-h-48.75 w-full flex-col items-start gap-3 rounded-xl border px-5 py-4 text-left transition-colors outline-none"
        >
          <Flex align="center" justify="between" className="w-full">
            <Text variant="headline2" color="text-bolder">
              {config.title}
            </Text>
            <Pencil size={16} className="text-icon-gray-lighter" />
          </Flex>
          <Flex direction="column" className="w-full gap-1.5">
            {config.fields.map((field) => {
              const value = instance.values[field.key]
              return (
                <Flex key={field.key} justify={value ? 'between' : 'start'} className="w-full gap-1">
                  <Text variant="body2" color="text-subtler" className="shrink-0">
                    {field.label}
                  </Text>
                  {value && (
                    <Text variant="label1" color="text-subtle" className="min-w-0 truncate">
                      {value}
                    </Text>
                  )}
                </Flex>
              )
            })}
          </Flex>
        </button>
      </DialogTrigger>
      <DialogContent className="w-150 gap-6">
        <DialogTitle className="text-heading2 text-text-basic font-semibold">{config.title}</DialogTitle>
        <Grid columns="4" gap="4" className="w-full">
          {config.fields.map((field) => (
            <div key={field.key} className={FIELD_SPAN_CLASS[field.span ?? 4]}>
              <Controller control={control} name={field.key} render={({ field: rhfField }) => <ResumeFieldInput field={field} value={rhfField.value ?? ''} onChange={rhfField.onChange} />} />
            </div>
          ))}
        </Grid>
        <div className="flex w-full flex-col items-center gap-2.5">
          <DialogClose asChild>
            <Button variant="primary" size="lg" fullWidth disabled={!isDirty} onClick={() => onSave(getValues())}>
              저장
            </Button>
          </DialogClose>
          {onDelete && (
            <DialogClose asChild>
              <Button variant="text" size="sm" className="text-caption1 text-text-danger" onClick={onDelete}>
                삭제하기
              </Button>
            </DialogClose>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}

'use client'

import { Suspense, useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { ErrorBoundary } from '@sentry/nextjs'
import { toast } from 'sonner'
import { Text } from '@shared/ui'
import { useWorkspaceId } from '@entities/user'
import { useCreateResume } from '@entities/resume'
import { ExperiencePickerDialog } from './ExperiencePickerDialog'
import { buildResumeInput } from '../model/buildResumeInput'

export const ResumeCreatePage = () => {
  return (
    <div>
      {/* Todo: Suspense fallback을 다이얼로그 모양의 스켈레톤으로 교체 (지금은 임시) */}
      <ErrorBoundary
        fallback={
          <Text variant={'label1'} color={'text-subtle'} className={'block p-8 text-center'}>
            경험을 불러오는 데 실패했습니다.
          </Text>
        }
      >
        <Suspense
          fallback={
            <Text variant={'label1'} color={'text-subtle'} className={'block p-8 text-center'}>
              불러오는 중...
            </Text>
          }
        >
          <ResumeCreateContent />
        </Suspense>
      </ErrorBoundary>
    </div>
  )
}

/**
 * jdId가 없으면(직접 URL 진입 등) 홈으로 돌려보낸다.
 * 가드를 통과한 뒤에만 다이얼로그를 렌더해 하위 Suspense 쿼리가 빈 jdId로 발화하지 않게 한다.
 * `useSearchParams`는 상위 `Suspense` 경계 안에서 호출된다.
 */
const ResumeCreateContent = () => {
  const [isOpen, setIsOpen] = useState(true)

  const router = useRouter()
  const jdId = useSearchParams().get('jdId') ?? ''
  const workspaceId = useWorkspaceId()
  const { mutate: createResume, isPending } = useCreateResume(workspaceId)

  useEffect(() => {
    if (!jdId) router.replace('/home')
  }, [jdId, router])

  if (!jdId) return null

  return (
    <ExperiencePickerDialog
      isOpen={isOpen}
      onOpenChange={(open) => {
        setIsOpen(open)
        if (!open) router.push('/home')
      }}
      jdId={jdId}
      isCompleting={isPending}
      onComplete={(selectedExperiences) => {
        createResume(buildResumeInput(selectedExperiences, jdId), {
          onSuccess: ({ resumeId }) => router.push(`/home/resume/${resumeId}`),
          onError: (error) => toast(error.message, { position: 'top-center' })
        })
      }}
    />
  )
}

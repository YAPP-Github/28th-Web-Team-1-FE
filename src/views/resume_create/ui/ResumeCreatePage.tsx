'use client'

import { Suspense, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { ErrorBoundary } from '@sentry/nextjs'
import { Text } from '@shared/ui'
import { ExperiencePickerDialog } from './ExperiencePickerDialog'

export const ResumeCreatePage = () => {
  return (
    <div>
      {/* Todo: 선택된 경험으로 이력서 생성 플로우 연결 */}
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
  const router = useRouter()
  const jdId = useSearchParams().get('jdId') ?? ''

  useEffect(() => {
    if (!jdId) router.replace('/home')
  }, [jdId, router])

  if (!jdId) return null

  return (
    <ExperiencePickerDialog
      isOpen={true}
      jdId={jdId}
      onComplete={(selectedExperiences) => {
        console.log(selectedExperiences)
      }}
    />
  )
}

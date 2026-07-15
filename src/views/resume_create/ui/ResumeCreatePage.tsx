'use client'

import { Suspense } from 'react'
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
          <ExperiencePickerDialog
            isOpen={true}
            onComplete={(selectedExperiences) => {
              console.log(selectedExperiences)
            }}
          />
        </Suspense>
      </ErrorBoundary>
    </div>
  )
}

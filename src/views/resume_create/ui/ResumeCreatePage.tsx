'use client'

import { Suspense, useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { ErrorBoundary } from '@sentry/nextjs'
import { Flex } from '@radix-ui/themes'
import { toast } from 'sonner'
import { PencilSparkles, RotateCcw, Trash2 } from 'lucide-react'
import { Button, Divider, Spacing, Text } from '@shared/ui'
import { Input } from '@shared/ui/input'
import { Textarea } from '@shared/ui/textarea'
import { useQueryClient } from '@tanstack/react-query'
import { useMe, useWorkspaceId } from '@entities/user'
import { useCreateResume, resumeQueries } from '@entities/resume'
import { useJdMeta } from '@entities/jd'
import { ExperiencePickerDialog } from './ExperiencePickerDialog'
import { buildResumeInput } from '../model/buildResumeInput'

import * as amplitude from '@amplitude/unified'
import { AMPLITUDE_EVENTS } from '@shared/config'

export const ResumeCreatePage = () => {
  return (
    // 다이얼로그 뒤로 이력서 편집 화면과 같은 배경을 깔아, 경험 선택이 이력서 위에서 이뤄지는 것처럼 보이게 한다.
    <Flex direction={'column'} className={'relative h-full flex-1 overflow-hidden'}>
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
    </Flex>
  )
}

/**
 * 다이얼로그 뒤에 보이는 이력서 배경. 실제 편집 화면(ResumeEditPage)의 상단 툴바 + 회색 페이지 + 흰 보드 형태를 흉내 낸다.
 * 툴바의 기업명·포지션은 JD 메타에서 채우되, 로딩 중에도 배경 골격은 바로 보이도록 헤더 텍스트만 별도 Suspense로 감싼다.
 */
const ResumeBackdrop = ({ jdId }: { jdId: string }) => (
  <Flex direction={'column'} className={'absolute inset-0 -z-10'}>
    <header className={'flex px-8 py-5'}>
      <Flex direction={'column'} justify={'center'} className={'gap-0.5'}>
        <Suspense
          fallback={
            <Flex direction={'column'}>
              <Text variant={'heading2'}>기업명</Text>
              <Text variant={'body2'} color={'text-subtle'}>
                포지션
              </Text>
            </Flex>
          }
        >
          <ResumeBackdropHeaderText jdId={jdId} />
        </Suspense>
      </Flex>
    </header>
    <main className={'flex min-h-0 flex-1'}>
      <Flex align={'center'} className={'bg-bg-gray-subtler flex-1'}>
        <Flex direction={'column'} className={'bg-bg-white mx-auto h-[calc(100%-2rem)] w-149 min-w-149 overflow-y-auto p-7'}>
          <Suspense fallback={null}>
            <ResumeBackdropBasicInfo />
          </Suspense>
        </Flex>
      </Flex>

      <div className={'bg-bg-gray-subtler w-16 shrink-0'} />

      <Flex className={'bg-bg-white w-160 shrink-0 overflow-y-auto'} aria-hidden={true}>
        <ResumeBackdropEdit />
      </Flex>
    </main>
  </Flex>
)

/** 툴바의 기업명/포지션 텍스트. 편집 화면 ResumeToolbar와 동일하게 기업명이 없으면 '이력서'로 대체한다. */
const ResumeBackdropHeaderText = ({ jdId }: { jdId: string }) => {
  const workspaceId = useWorkspaceId()
  const { jd } = useJdMeta(workspaceId, jdId)

  return (
    <>
      <Text variant={'heading2'}>{jd?.companyName || '이력서'}</Text>
      {jd?.positionTitle && (
        <Text variant={'body2'} color={'text-subtle'}>
          {jd.positionTitle}
        </Text>
      )}
    </>
  )
}

/** 미리보기 상단 기본 정보. 편집 화면 ResumeBasicInfoHeader 구조를 따라 me(이름/이메일)로 채운다. */
const ResumeBackdropBasicInfo = () => {
  const { me } = useMe()

  return (
    <>
      <section className={'flex w-full justify-between rounded-sm p-3'}>
        <Text variant={'title1'}>{me.name}</Text>
        {me.email && (
          <Text size={'1'} color={'gray-40'}>
            {me.email}
          </Text>
        )}
      </section>

      <Spacing size={12} />
      <Divider color={'gray-10'} />
      <Spacing size={12} />
    </>
  )
}

/**
 * 우측 편집 영역 자리표시 UI. 실제 EXPERIENCE 편집 섹션(Section + 경험 아이템) 형태를 흉내 내되,
 * 폼에 연결하지 않고 비활성(disabled) 필드로만 보여준다. 배경 장식이라 aria-hidden 처리한다.
 */
const ResumeBackdropEdit = () => (
  <Flex direction={'column'} className={'w-full px-8 pb-6'}>
    <Flex justify={'between'} align={'center'} className={'py-6'}>
      <Text variant={'headline1'}>경험</Text>
      <Button variant={'text'} size={'sm'} disabled={true}>
        경험 재선택
        <RotateCcw size={16} data-icon={'inline-end'} />
      </Button>
    </Flex>
    <Divider color={'gray-60'} />
    <Spacing size={32} />

    <Flex direction={'column'} className={'gap-12 px-1'}>
      <Flex direction={'column'}>
        <Flex justify={'between'}>
          <Text variant={'headline2'}>경험 1</Text>
          <Button variant={'tertiary'} size={'icon-xs'} disabled={true}>
            <Trash2 />
          </Button>
        </Flex>

        <Spacing size={16} />
        <Divider />
        <Spacing size={20} />

        <Input label={'경험명'} placeholder={'경험명을 입력해주세요.'} clearable={false} disabled={true} />

        <Spacing size={16} />

        <Flex className={'w-full gap-4'}>
          <Input label={'역할'} placeholder={'역할을 입력해주세요.'} clearable={false} disabled={true} className={'w-full'} />
          <Input label={'기간'} placeholder={'기간을 선택해주세요.'} clearable={false} disabled={true} className={'w-full'} />
        </Flex>

        <Spacing size={16} />

        <Flex direction={'column'} className={'gap-5 py-1'}>
          <Textarea label={'세부내용'} placeholder={'세부내용을 입력해주세요.'} disabled={true} />
          <Button variant={'secondary'} size={'sm'} className={'ml-auto w-fit'} disabled={true}>
            <PencilSparkles size={16} data-icon={'inline-start'} />
            AI 첨삭
          </Button>
        </Flex>
      </Flex>
    </Flex>
  </Flex>
)

/**
 * jdId가 없으면(직접 URL 진입 등) 홈으로 돌려보낸다.
 * 가드를 통과한 뒤에만 다이얼로그를 렌더해 하위 Suspense 쿼리가 빈 jdId로 발화하지 않게 한다.
 * `useSearchParams`는 상위 `Suspense` 경계 안에서 호출된다.
 */
const ResumeCreateContent = () => {
  const [isOpen, setIsOpen] = useState(true)
  // createResume 성공 후 이력서 상세를 프리패치하고 이동할 때까지 '완료 처리 중'으로 둬, 그 사이 버튼 재클릭을 막는다.
  const [isNavigating, setIsNavigating] = useState(false)

  const router = useRouter()
  const queryClient = useQueryClient()
  const jdId = useSearchParams().get('jdId') ?? ''
  const workspaceId = useWorkspaceId()
  const { mutate: createResume, isPending } = useCreateResume(workspaceId)

  useEffect(() => {
    if (!jdId) router.replace('/home')
  }, [jdId, router])

  if (!jdId) return null

  return (
    <>
      <ResumeBackdrop jdId={jdId} />
      <ExperiencePickerDialog
        isOpen={isOpen}
        // 사용자가 취소(ESC·바깥 클릭)로 닫으면 홈으로 돌려보낸다. 선택 완료는 아래 onComplete에서 별도로 처리한다.
        onOpenChange={(open) => {
          if (open) return
          setIsOpen(false)
          router.push('/home')
        }}
        jdId={jdId}
        isCompleting={isPending || isNavigating}
        onComplete={(selectedExperiences) => {
          // 경험 선택 완료 시 Amplitude 이벤트 전송
          amplitude.track(AMPLITUDE_EVENTS.EXPERIENCE_SELECTION_COMPLETED, { selected_experience_count: selectedExperiences.length })
          setIsNavigating(true)
          createResume(buildResumeInput(selectedExperiences, jdId), {
            onSuccess: async ({ resumeId }) => {
              // 편집 화면의 useResumeDetail(Suspense)이 첫 진입에서 fallback으로 번쩍이지 않도록,
              // 이동 전에 이력서 상세를 미리 캐시에 채워 둔다(warm cache). 모달은 페이지가 바뀌며 자연히 사라진다.
              await queryClient.prefetchQuery(resumeQueries.detail(workspaceId, resumeId))
              router.push(`/home/resume/${resumeId}`)
            },
            onError: (error) => {
              setIsNavigating(false)
              toast(error.message, { position: 'top-center' })
            }
          })
        }}
      />
    </>
  )
}

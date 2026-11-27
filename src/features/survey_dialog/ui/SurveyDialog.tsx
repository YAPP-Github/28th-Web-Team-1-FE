'use client'
import { useEffect, useState } from 'react'
import { XIcon } from 'lucide-react'
import { useMeQuery } from '@entities/user'
import { Flex } from '@radix-ui/themes'
import { cn } from '@shared/lib/cn'
import { whenAmplitudeReady } from '@shared/lib/amplitude'
import { Button, Text } from '@shared/ui'
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogTitle } from '@shared/ui/dialog'
import * as amplitude from '@amplitude/unified'

const DISMISSED_KEY = 'survey_dialog_dismissed_v1' // 한 번 닫은 유저에게 다시 띄우지 않기 위한 localStorage 키
const FLAG_KEY = 'survey-dialog' // Amplitude 플래그 명

type Variant = 'active' | 'churned'

const isVariant = (value: unknown): value is Variant => value === 'active' || value === 'churned'

const COPY: Record<Variant, { title: string; description: string; chat: [string, string, string] }> = {
  active: {
    title: 'SCOOP을 가장 잘 쓰시는\n분께 묻고 싶어요.',
    description: '다음 기능을 여러분을 위해 준비 중이에요.\n어떤 공고에, 어떻게 쓰셨는지 이야기해 주세요.',
    chat: ['어떤 공고에 쓰셨어요?', '마케터 인턴 공고요', '어떻게 고치셨는지 궁금해요']
  },
  churned: {
    title: '이력서 만들다 막혔던 곳,\n알려주세요',
    description: '불만족스러웠던 경험을 알려주세요.\n이야기해 주시면 다음 버전에서 고쳐 돌아올게요.',
    chat: ['어디서 멈추셨어요?', '공고 넣고 나서요', '그 부분부터 고쳐 볼게요']
  }
}

/**
 * 외부 설문(비대면 인터뷰) 참여 모달. 마운트 시 Amplitude 플래그 `survey-dialog`가 켜진 유저에게만 뜬다.
 *
 * @example
 * ```tsx
 * <SurveyDialog onSettled={(shown) => ...} />
 * ```
 * @param onSettled 노출 여부가 정해지면 한 번 호출된다. 같은 세션의 다른 팝업(동의 시트) 노출 판단용
 */
export const SurveyDialog = ({ onSettled }: { onSettled?: (shown: boolean) => void }) => {
  const userId = useMeQuery().data?.me.userId
  const [survey, setSurvey] = useState<{ variant: Variant; url: string } | null>(null)
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    if (!userId) return
    if (localStorage.getItem(DISMISSED_KEY)) return onSettled?.(false)

    whenAmplitudeReady()
      .then(async () => {
        const experiment = amplitude.experiment()
        if (!experiment) return onSettled?.(false)
        await experiment.fetch({ user_id: userId })
        const { value, payload } = experiment.variant(FLAG_KEY)
        // 대시보드에 등록된 url을 가져옴
        const url: unknown = typeof payload === 'string' ? payload : payload?.url
        if (!isVariant(value) || typeof url !== 'string') return onSettled?.(false)
        // Tally 히든 필드: 응답자와 실제 사용 로그를 매칭하기 위함 (group은 Amplitude payload URL에 포함)
        const tallyUrl = new URL(url)
        tallyUrl.searchParams.set('user_id', String(userId))
        setSurvey({ variant: value, url: tallyUrl.toString() })
        setIsOpen(true)
        onSettled?.(true)
      })
      .catch(() => onSettled?.(false))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId])

  if (!survey) return null
  const { title, description, chat } = COPY[survey.variant]

  const handleOpenChange = (nextOpen: boolean) => {
    setIsOpen(nextOpen)
    if (!nextOpen) localStorage.setItem(DISMISSED_KEY, '1')
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent showCloseButton={false} onOpenAutoFocus={(event) => event.preventDefault()} className={'bg-bg-gray-subtler flex h-82 w-142.5 gap-0 overflow-hidden rounded-xl p-0'}>
        <div aria-hidden className={'bg-primary-50 relative w-60 shrink-0 overflow-hidden'}>
          <div className={'absolute -top-21.25 -left-20 size-50 rounded-full bg-white opacity-12'} />
          <div className={'absolute top-62 left-37.5 size-41 rounded-full bg-white opacity-12'} />

          <Flex align={'center'} justify={'center'} className={'absolute top-12 left-14.25 h-[55.86px] w-[167.19px]'}>
            <Flex
              align={'center'}
              className={'text-label1 text-text-primary-basic rotate-[6.69deg] gap-1.5 rounded-full bg-white py-2 pr-4 pl-3.5 whitespace-nowrap shadow-[0_4px_12px_0_rgba(41,20,128,0.18)]'}
            >
              <span>🎁</span>
              <span>참여 시 ‘배민 상품권’</span>
            </Flex>
          </Flex>

          <Flex direction={'column'} className={'absolute top-36 left-4 w-52 gap-3'}>
            <ChatBubble>{chat[0]}</ChatBubble>
            <ChatBubble mine>{chat[1]}</ChatBubble>
            <ChatBubble>{chat[2]}</ChatBubble>
          </Flex>
        </div>

        <Flex direction={'column'} justify={'between'} className={'relative min-w-0 flex-1 px-5.5 pt-6.5 pb-4.5'}>
          <Flex direction={'column'} gap={'2'}>
            <Text as={'p'} variant={'label1'} color={'text-primary-basic'}>
              비대면 인터뷰 30분
            </Text>
            <DialogTitle className={'text-title3 text-text-basic font-bold whitespace-pre-line'}>{title}</DialogTitle>
            <DialogDescription className={'text-body2 text-text-subtle whitespace-pre-line'}>{description}</DialogDescription>
          </Flex>

          <Flex direction={'column'} align={'center'} gap={'2'}>
            <Button asChild size={'md'} fullWidth className={'rounded-lg'}>
              <a href={survey.url} target={'_blank'} rel={'noopener noreferrer'}>
                참여 신청하기
              </a>
            </Button>
            <DialogClose asChild>
              <Button variant={'text'} size={'md'} className={'text-caption1 border-0'}>
                다음에 할게요
              </Button>
            </DialogClose>
          </Flex>

          <DialogClose asChild>
            <Button variant={'text'} aria-label={'닫기'} className={'text-gray-90 absolute top-5 right-4.5'}>
              <XIcon size={20} strokeWidth={2} />
            </Button>
          </DialogClose>
        </Flex>
      </DialogContent>
    </Dialog>
  )
}

const ChatBubble = ({ mine = false, children }: { mine?: boolean; children: string }) => (
  <Flex align={'center'} justify={mine ? 'end' : 'start'} gap={'2'}>
    {!mine && <div className={'bg-primary-10 size-6.5 shrink-0 rounded-full'} />}
    <span className={cn('text-caption1 rounded-lg px-3 py-2.25 font-semibold whitespace-nowrap', mine ? 'bg-primary-80 text-primary-20 rounded-br-xs' : 'bg-white-50 text-text-basic rounded-bl-xs')}>
      {children}
    </span>
  </Flex>
)

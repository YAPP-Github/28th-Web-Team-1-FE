import { Flex, Skeleton } from '@radix-ui/themes'
import { Divider, Spacing, Text } from '@shared/ui'
import { Chip } from '@shared/ui/chip'
import { cn, formatDate } from '@shared/lib'
import type { ReactNode } from 'react'
import type { Experience } from '../model/experience.types'
import { CheckboxCard } from './CheckboxCard'

interface ExperienceCardProps {
  experience: Experience
  checked: boolean
  onCheckedChange: (checked: boolean) => void
  disabled?: boolean
  bordered?: boolean
  showReason?: boolean
}

export const ExperienceCard = ({ experience, checked, onCheckedChange, disabled, bordered, showReason }: ExperienceCardProps) => {
  const { title, tags, project, matchRate, recommendedReason } = experience

  return (
    <CheckboxCard
      checked={checked}
      onCheckedChange={onCheckedChange}
      disabled={disabled}
      bordered={bordered}
      top={
        <Flex justify={'between'} align={'center'} gap={'2'} width={'100%'}>
          <Text variant={'headline2'} className={'min-w-0 truncate'}>
            {title}
          </Text>
          {typeof matchRate === 'number' && <MatchRateBadge rate={matchRate} disabled={disabled} />}
        </Flex>
      }
      middle={
        <Flex direction={'column'} gap={'2'}>
          <InfoRow label={'역할 및 기간'}>
            <Flex gap={'2'} align={'center'} minWidth={'0'}>
              <Text variant={'label2'} color={'text-bolder'} className={'min-w-0 truncate'}>
                {project?.role}
              </Text>
              <Divider orientation={'vertical'} size={1} className={'h-2.5 shrink-0'} />
              <Text variant={'label2'} color={'text-bolder'} className={'shrink-0 text-nowrap'}>
                {formatDate(project?.period?.startAt, 'YYYY.MM')} ~ {formatDate(project?.period?.endAt, 'YYYY.MM')}
              </Text>
            </Flex>
          </InfoRow>

          <InfoRow label={'관련 역량'}>
            <Flex gap={'1'} className={'overflow-x-auto'}>
              {tags.map((tag) => (
                <Chip variant={'tertiary'} key={tag}>
                  {tag}
                </Chip>
              ))}
            </Flex>
          </InfoRow>
        </Flex>
      }
      bottom={showReason && recommendedReason ? <RecommendedReason reason={recommendedReason} /> : undefined}
    />
  )
}

type MatchLevel = 'high' | 'medium' | 'low'

/** 매칭률 밴드: 99~75 high(green) / 74~50 medium(yellow) / 49~0 low(red) */
const getMatchLevel = (rate: number): MatchLevel => (rate >= 75 ? 'high' : rate >= 50 ? 'medium' : 'low')

const BAND_STYLE: Record<MatchLevel, string> = {
  high: 'bg-green-10 text-green-60',
  medium: 'bg-yellow-10 text-yellow-60',
  low: 'bg-red-10 text-red-60'
}

const DISABLED_STYLE = 'bg-element-disabled text-text-disabled'

const MatchRateBadge = ({ rate, disabled }: { rate: number; disabled?: boolean }) => {
  const style = disabled ? DISABLED_STYLE : BAND_STYLE[getMatchLevel(rate)]

  return (
    <Chip size={'sm'} className={cn('shrink-0 rounded-full px-2 py-0.5 whitespace-nowrap', style)}>
      {rate}% 매칭
    </Chip>
  )
}

const InfoRow = ({ label, children }: { label: string; children: ReactNode }) => (
  <Flex gap={'5'} align={'center'}>
    <Text variant={'label2'} color={'text-subtler'} className={'w-16 shrink-0'}>
      {label}
    </Text>
    {children}
  </Flex>
)

/** 카드 하단 — 추천 이유 행 */
const RecommendedReason = ({ reason }: { reason: string }) => (
  <InfoRow label={'추천 이유'}>
    <Text variant={'label2'} color={'text-subtle'}>
      {reason}
    </Text>
  </InfoRow>
)

/** ExperienceCard 한 장의 모양(체크박스 + 제목/매칭배지 + 역할/역량 행)을 따르는 스켈레톤. */
export const ExperienceCardSkeleton = () => (
  <Flex direction="column" className={'border-border-subtle shrink-0 rounded-xl border p-4'}>
    <Flex align={'center'} gap={'4'}>
      <Skeleton height={'20px'} width={'20px'} />
      <Flex flexGrow={'1'} justify={'between'} align={'center'}>
        <Skeleton height={'18px'} width={'140px'} />
        <Skeleton height={'22px'} width={'64px'} style={{ borderRadius: '9999px' }} />
      </Flex>
    </Flex>
    <Spacing size={16} />
    <Flex direction={'column'} gap={'2'}>
      <Skeleton height={'14px'} width={'80%'} />
      <Skeleton height={'14px'} width={'60%'} />
    </Flex>
  </Flex>
)

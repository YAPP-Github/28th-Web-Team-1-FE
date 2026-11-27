'use client'
import { useMe, useUpdateOptionalConsents } from '@entities/user'
import { formatDate } from '@shared/lib'
import { Divider, Heading, Spacing, Text } from '@shared/ui'
import { Switch } from '@shared/ui/switch'
import { OPTIONAL_CONSENTS, REQUIRED_CONSENTS, type ConsentField } from '@features/consent'
import { toast } from 'sonner'

export const ConsentSettings = () => {
  const { me } = useMe()
  const { mutate } = useUpdateOptionalConsents()

  const toggle = (field: ConsentField, agreed: boolean) =>
    mutate(
      { source: 'MYPAGE', [field]: agreed },
      {
        onError: () => toast.error('저장에 실패했어요.\n잠시 후 다시 시도해 주세요.')
      }
    )

  return (
    <>
      <Heading variant={'heading2'}>선택 동의</Heading>
      <Spacing size={16} />
      <ul className={'border-border-subtler bg-bg-white divide-border-subtler divide-y rounded-lg border'}>
        {OPTIONAL_CONSENTS.map(({ type, field, title, description, url }) => (
          <li key={type} className={'flex items-center justify-between p-5'}>
            <div className={'flex flex-col gap-1'}>
              <div className={'flex items-center gap-2'}>
                <Text variant={'headline2'} color={'text-bolder'}>
                  {title}
                </Text>
                <a href={url} target={'_blank'} rel={'noopener noreferrer'} className={'text-label2 text-text-subtle shrink-0 underline'}>
                  보기
                </a>
              </div>
              <Text variant={'body2'} color={'text-subtle'} className={'whitespace-pre-line'}>
                {description}
              </Text>
            </div>
            <Switch aria-label={title} checked={me.consents.find((consent) => consent.type === type)?.agreed ?? false} onCheckedChange={(agreed) => toggle(field, agreed)} />
          </li>
        ))}
      </ul>
      <Spacing size={16} />
      <Text as={'p'} variant={'caption1'} color={'text-subtler'} className={'px-1'}>
        변경 결과는 이메일로도 알려 드려요. 광고성 정보 수신은 동의한 날부터 2년마다 다시 확인해요.
      </Text>

      <Spacing size={32} />
      <Divider color="gray-10" />
      <Spacing size={32} />

      <Heading variant={'heading2'}>필수 동의</Heading>
      <Spacing size={16} />
      <ul className={'bg-bg-gray-subtler flex flex-col gap-4 rounded-lg p-5'}>
        {REQUIRED_CONSENTS.map(({ type, title, url }) => {
          const consent = me.consents.find((consent) => consent.type === type)
          return (
            <li key={type} className={'flex items-center justify-between'}>
              <Text variant={'body2'} color={'text-basic'}>
                {title}
              </Text>
              <div className={'flex items-center gap-2'}>
                {consent?.agreed && (
                  <Text variant={'caption1'} color={'text-subtler'}>
                    {formatDate(consent.changedAt)} 동의
                  </Text>
                )}
                <a href={url} target={'_blank'} rel={'noopener noreferrer'} className={'text-label2 text-text-subtle shrink-0 underline'}>
                  보기
                </a>
              </div>
            </li>
          )
        })}
      </ul>
    </>
  )
}

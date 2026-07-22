import { Flex } from '@radix-ui/themes'
import { Divider, Text } from '@shared/ui'
import { formatYYYYMM } from '@shared/lib'
import { Fragment, type ReactNode } from 'react'

export const Section = ({ title, children }: { title: string; children: ReactNode }) => {
  return (
    <section className={'group-data-[active=true]:bg-primary-5/50 group-data-[active=false]:hover:bg-gray-5/50 flex gap-18 rounded-sm p-3 transition-colors'}>
      <Text variant={'label2'} color={'text-subtler'} className={'min-12 w-12 shrink-0 text-nowrap'}>
        {title}
      </Text>
      <Flex direction={'column'} gap={'6'} className={'flex-1'}>
        {children}
      </Flex>
    </section>
  )
}

export const SectionItem = ({ children }: { children: ReactNode }) => (
  <Flex direction={'column'} className={'gap-2'}>
    {children}
  </Flex>
)

export const SectionItemTitle = ({ children }: { children: ReactNode }) => <Text variant={'label1'}>{children}</Text>

/** 역할·기간·기관 등 메타 정보를 `·` 구분선으로 이어 붙인다. 비어 있는 값은 자동으로 제외된다. */
export const SectionItemSubtitle = ({ parts }: { parts: Array<string | null | undefined> }) => {
  const visible = parts.filter((part): part is string => Boolean(part && part.trim()))
  if (visible.length === 0) return null

  return (
    <Text variant={'caption2'} color={'gray-40'} className={'flex items-center gap-1'}>
      {visible.map((part, index) => (
        <Fragment key={index}>
          {index > 0 && <Divider orientation={'vertical'} className={'h-2.5'} />}
          {part}
        </Fragment>
      ))}
    </Text>
  )
}

export const SectionItemContent = ({ children }: { children: ReactNode }) => (
  <Text as={'p'} className={'text-gray-90 text-[10px] whitespace-break-spaces'}>
    {children}
  </Text>
)

/** `{ startAt, endAt }` 기간을 `2025.03 - 2025.06` 형태로 만든다. 둘 다 비어 있으면 null. */
export const periodText = (period?: { startAt?: string | null; endAt?: string | null } | null): string | null => {
  const start = formatYYYYMM(period?.startAt)
  const end = formatYYYYMM(period?.endAt)
  if (!start && !end) return null
  return `${start} - ${end}`
}

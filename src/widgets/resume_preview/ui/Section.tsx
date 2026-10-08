import { Flex } from '@radix-ui/themes'
import { Divider, Text } from '@shared/ui'
import { formatYYYYMM } from '@shared/lib'
import { Fragment, type ComponentType, type ReactNode } from 'react'

/**
 * 섹션 컴포넌트가 아이템 하나를 감쌀 때 쓰는 래퍼 컴포넌트의 규약.
 * 편집 화면은 아이템 드래그 정렬을 위해 sortable로 등록하는 컴포넌트를 넘기고,
 * 순수 미리보기(상세·PDF)는 넘기지 않아 원래 마크업이 그대로 렌더된다.
 *
 * 컴포넌트(콜백이 아닌)로 받는 이유는 정렬 등록이 리액트 훅이라, 아이템마다 컴포넌트 인스턴스가
 * 필요하기 때문이다. `uid`는 `payloadsOf`가 붙여 준 클라이언트 전용 정체자다.
 */
export type SectionItemWrapper = ComponentType<{ uid?: string; index: number; children: ReactNode }>

/**
 * 위젯 섹션 컴포넌트가 다루는 아이템 타입.
 * 서버 GraphQL 프래그먼트에, 클라이언트 전용 정체자(`itemId`, `uid`)를 더한 형태다.
 * `uid`는 편집 화면의 드래그 정렬 정체자로만 쓰이고, 순수 미리보기에서는 `undefined`로 채워진다.
 */
export type PreviewItem<T> = T & { itemId?: string | null; uid?: string }

/** 드래그 정렬을 걸지 않는 화면(상세·PDF)의 기본 래퍼. 아무 것도 하지 않고 children만 그대로 렌더한다. */
const PlainItem = ({ children }: { children: ReactNode }) => <>{children}</>

/**
 * 섹션 컴포넌트가 아이템을 감쌀 때 쓰는 헬퍼. 드래그 정렬 화면은 sortable 래퍼를, 나머지는 원래 마크업을 쓴다.
 * 정렬 등록이 리액트 훅이라 아이템마다 컴포넌트 인스턴스가 필요해서, 래퍼는 콜백이 아닌 컴포넌트로 받는다.
 */
export const SectionItemShell = ({ ItemWrapper = PlainItem, uid, index, children }: { ItemWrapper?: SectionItemWrapper; uid?: string; index: number; children: ReactNode }) => (
  <ItemWrapper uid={uid} index={index}>
    {children}
  </ItemWrapper>
)

export const Section = ({ title, children }: { title: string; children: ReactNode }) => {
  return (
    <section className={'group-data-[active=true]:bg-primary-5/50 group-data-[active=false]:hover:bg-gray-5/50 flex gap-18 rounded-sm p-3 transition-colors'}>
      <Text variant={'label2'} color={'text-subtler'} className={'min-12 w-12 shrink-0 text-nowrap'}>
        {title}
      </Text>
      <Flex direction={'column'} gap={'6'} className={'min-w-0 flex-1'}>
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

export const SectionItemTitle = ({ children }: { children: ReactNode }) => (
  <Text variant={'label1'} className={'break-words'}>
    {children}
  </Text>
)

/** 역할·기간·기관 등 메타 정보를 `·` 구분선으로 이어 붙인다. 비어 있는 값은 자동으로 제외된다. */
export const SectionItemSubtitle = ({ parts }: { parts: Array<string | null | undefined> }) => {
  const visible = parts.filter((part): part is string => Boolean(part && part.trim()))
  if (visible.length === 0) return null

  return (
    <Text variant={'caption2'} color={'gray-40'} className={'flex flex-wrap items-center gap-1'}>
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
  <Text as={'p'} className={'text-gray-90 text-[10px] leading-[1.8] whitespace-break-spaces'}>
    {children}
  </Text>
)

/** `{ startAt, endAt }` 기간을 `2025.03 - 2025.06` 형태로 만든다. 둘 다 비어 있으면 null. */
export const periodText = (period?: { startAt?: string | null; endAt?: string | null } | null): string | null => {
  const start = formatYYYYMM(period?.startAt)
  const end = formatYYYYMM(period?.endAt)
  if (!start && !end) return null
  return `${start} ${end && '-'} ${end}`
}

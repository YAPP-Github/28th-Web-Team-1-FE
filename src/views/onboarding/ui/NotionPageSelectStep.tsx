import { useState } from 'react'
import { Flex } from '@radix-ui/themes'
import { cn } from '@shared/lib/cn'
import { Text, SearchField } from '@shared/ui'
import { Chip } from '@shared/ui/chip'
import type { OnboardingStepProps } from '../model/useOnboardingFlow'
import { OnboardingStepShell } from './OnboardingStepShell'

interface NotionPage {
  id: string
  title: string
  kind: '페이지' | '데이터베이스'
  editedAt: string
}

// TODO: Notion 연동 API 연결 후 실제 페이지 목록/검색으로 교체 (지금은 UI만)
const MOCK_PAGES: NotionPage[] = [
  { id: 'page-1', title: '포트폴리오 정리', kind: '페이지', editedAt: '2026.07.01' },
  { id: 'page-2', title: '프로젝트 회고 모음', kind: '페이지', editedAt: '2026.06.24' },
  { id: 'page-3', title: '커리어 기록', kind: '데이터베이스', editedAt: '2026.06.18' },
  { id: 'page-4', title: '사이드 프로젝트 로그', kind: '페이지', editedAt: '2026.05.30' },
  { id: 'page-5', title: '스터디 노트', kind: '데이터베이스', editedAt: '2026.05.11' }
]

/** 온보딩 스텝: 연동된 Notion에서 가져온 페이지 중 이력서로 만들 페이지 검색·선택(다중) */
export const NotionPageSelectStep = ({ onDone, onPrev, onSkip }: OnboardingStepProps) => {
  const [pageIds, setPageIds] = useState<string[]>([])
  const [keyword, setKeyword] = useState('')
  const visiblePages = MOCK_PAGES.filter((page) => page.title.includes(keyword.trim()))

  const toggle = (id: string) => {
    setPageIds((prev) => (prev.includes(id) ? prev.filter((pageId) => pageId !== id) : [...prev, id]))
  }

  return (
    <OnboardingStepShell
      title="노션 페이지를 선택해주세요."
      description="SCOOP의 경험정리에 가져올 이력서/경험정리 페이지를 선택해 주세요."
      onNext={() => onDone()}
      nextDisabled={pageIds.length === 0}
      nextLabel="경험 추출하기"
      onPrev={onPrev}
      prevLabel="취소"
      onSkip={onSkip}
    >
      <Flex direction="column" align="center" className="w-full gap-5">
        <SearchField placeholder="보이지 않는 페이지 또는 데이터베이스는 제목으로 검색" value={keyword} onChange={(e) => setKeyword(e.target.value)} />
        {visiblePages.length > 0 ? (
          <Flex direction="column" gap="3" className="w-full">
            {visiblePages.map((page) => (
              <NotionPageCard key={page.id} page={page} isSelected={pageIds.includes(page.id)} onToggle={() => toggle(page.id)} />
            ))}
          </Flex>
        ) : (
          <Flex direction="column" align="center" justify="center" gap="1" className="border-border-subtle w-full rounded-xl border border-dashed px-6 py-16">
            <Text variant="headline2" color="text-basic">
              검색하신 페이지가 없어요.
            </Text>
            <Text variant="caption1" color="text-subtler">
              Notion에서 페이지를 공유하면 여기에 표시됩니다.
            </Text>
          </Flex>
        )}
        <Flex align="center" className="gap-1.5">
          <Chip size="sm" className="bg-element-primary-lighter text-text-primary-basic">
            TIP
          </Chip>
          <Text variant="caption1" color="text-basic">
            이력서로 만들고 싶은 실제 본문 내용이 담긴 하위 페이지를 <span className="text-text-primary-basic">직접 검색</span>해서 선택해 주세요.
          </Text>
        </Flex>
      </Flex>
    </OnboardingStepShell>
  )
}

interface NotionPageCardProps {
  page: NotionPage
  isSelected: boolean
  onToggle: () => void
}
const NotionPageCard = ({ page, isSelected, onToggle }: NotionPageCardProps) => {
  return (
    <button
      type="button"
      aria-pressed={isSelected}
      onClick={onToggle}
      className={cn(
        'bg-element-white border-border-subtle flex w-full items-center gap-3 rounded-xl border py-3 pr-5 pl-4 text-left transition-all outline-none',
        'focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-3',
        isSelected && 'border-border-primary'
      )}
    >
      <Flex align="center" gap="2" className="min-w-0 flex-1">
        <div className="bg-element-primary-lighter size-10 shrink-0 rounded-full" />
        <Flex direction="column" gap="1" className="min-w-0 flex-1">
          <Text variant="label1" color="text-subtler" className="w-full truncate font-semibold">
            {page.title}
          </Text>
          <Text variant="caption2" color="text-subtler">
            {page.kind} · {page.editedAt}
          </Text>
        </Flex>
      </Flex>
      <span className={cn('border-border-subtle relative size-4.5 shrink-0 rounded-full border bg-white', isSelected && 'border-border-primary')}>
        {isSelected && <span className="bg-element-primary absolute top-1/2 left-1/2 size-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full" />}
      </span>
    </button>
  )
}

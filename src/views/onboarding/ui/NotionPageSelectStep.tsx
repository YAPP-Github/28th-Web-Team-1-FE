import { useCallback, useEffect, useRef, useState } from 'react'
import { Flex, Grid } from '@radix-ui/themes'
import { toast } from 'sonner'
import { Text, SearchField } from '@shared/ui'
import { Chip } from '@shared/ui/chip'
import { useDebounce } from '@shared/hooks/useDebounce'
import { useIntersectionObserver } from '@shared/hooks/useIntersectionObserver'
import { useWorkspaceId } from '@entities/user'
import { useNotionPages, useNotionConnectionId } from '@entities/notion'
import { NotionPageCard } from '@features/notion_connect'
import type { OnboardingStepProps } from '../model/onboardingFlow'
import { OnboardingStepShell } from './OnboardingStepShell'
import { AMPLITUDE_EVENTS } from '@shared/config'
import * as amplitude from '@amplitude/unified'

const MAX_NOTION_PAGES = 3

interface NotionPageSelectStepProps extends OnboardingStepProps {
  /** OAuth 콜백이 URL로 넘긴 Notion 연결 ID. 없으면 연결 목록의 첫 연결로 폴백한다. */
  connectionId?: string
  /** "경험 추출하기" 클릭 시 고른 연결·페이지 목록을 다음 스텝(`NotionProcessingStep`)에 전달한다. */
  onNotionSelected: (selection: { connectionId: string; pageIds: string[] }) => void
}

/** 온보딩 스텝: 연동된 Notion에서 가져온 페이지 중 이력서로 만들 페이지 검색·선택(다중, 최대 3개) */
export const NotionPageSelectStep = ({ onDone, onPrev, onSkip, connectionId: connectionIdFromUrl, onNotionSelected }: NotionPageSelectStepProps) => {
  const [pageIds, setPageIds] = useState<string[]>([])
  const [keyword, setKeyword] = useState('')
  const workspaceId = useWorkspaceId()
  const connectionId = useNotionConnectionId(workspaceId, connectionIdFromUrl)
  const debouncedKeyword = useDebounce(keyword.trim(), 300)
  const { pages, isLoading, hasNextPage, isFetchingNextPage, fetchNextPage } = useNotionPages(workspaceId, connectionId, debouncedKeyword)

  const scrollRef = useRef<HTMLDivElement>(null)
  const sentinelRef = useIntersectionObserver<HTMLDivElement>({
    root: scrollRef,
    enabled: hasNextPage && !isFetchingNextPage,
    onIntersect: fetchNextPage
  })

  useEffect(() => {
    // Amplitude 이벤트 전송
    amplitude.track(AMPLITUDE_EVENTS.NOTION_SELECTED_VIEWED)
  }, [])

  const toggle = useCallback((id: string) => {
    setPageIds((prev) => {
      if (prev.includes(id)) return prev.filter((pageId) => pageId !== id)
      if (prev.length >= MAX_NOTION_PAGES) {
        toast.warning(`페이지는 최대 ${MAX_NOTION_PAGES}개까지 선택할 수 있어요.`, { id: 'notion-page-max', position: 'top-center' })
        return prev
      }
      return [...prev, id]
    })
  }, [])

  const handleImport = () => {
    if (!connectionId || pageIds.length === 0) return
    onNotionSelected({ connectionId, pageIds })
    onDone()
   amplitude.identify(new amplitude.Identify().set('has_notion', true))
    amplitude.track(AMPLITUDE_EVENTS.NOTION_STATUS_SELECTED, { has_notion: true, location: 'onboarding' })
  }

  return (
    <OnboardingStepShell
      title="노션 페이지를 선택해주세요."
      description="SCOOP의 경험정리에 가져올 이력서/경험정리 페이지를 선택해 주세요."
      onNext={handleImport}
      nextDisabled={pageIds.length === 0 || !connectionId}
      nextLabel="경험 추출하기"
      onPrev={onPrev}
      prevLabel="취소"
      onSkip={onSkip}
    >
      <Flex direction="column" align="center" gap="5" className="min-h-0 w-full flex-1">
        <SearchField placeholder="보이지 않는 페이지 또는 데이터베이스는 제목으로 검색" value={keyword} onChange={(e) => setKeyword(e.target.value)} className="shrink-0" />
        {pages.length > 0 ? (
          <Flex ref={scrollRef} direction="column" className="min-h-0 w-full flex-1 overflow-y-auto pr-2">
            <Grid columns={pages.length > 20 ? '2' : '1'} gap="3">
              {pages.map((page) => {
                const isSelected = pageIds.includes(page.pageId)
                return (
                  <NotionPageCard
                    key={page.pageId}
                    id={page.pageId}
                    title={page.title}
                    lastEditedTime={page.lastEditedTime}
                    isSelected={isSelected}
                    onToggle={toggle}
                    disabled={!isSelected && pageIds.length >= MAX_NOTION_PAGES}
                  />
                )
              })}
            </Grid>
            {hasNextPage && <div ref={sentinelRef} aria-hidden className="h-px shrink-0" />}
          </Flex>
        ) : (
          <Flex direction="column" align="center" justify="center" gap="1" className="border-border-subtle w-full shrink-0 rounded-xl border border-dashed px-6 py-16">
            <Text variant="headline2" color="text-basic">
              {isLoading ? '페이지를 불러오는 중이에요.' : '검색하신 페이지가 없어요.'}
            </Text>
            <Text variant="caption1" color="text-subtler">
              Notion에서 페이지를 공유하면 여기에 표시됩니다.
            </Text>
          </Flex>
        )}
        <Flex align="center" className="shrink-0 gap-2">
          <Chip size="sm" className="bg-element-primary-lighter text-text-primary-basic text-label1">
            TIP
          </Chip>
          <Text variant="label1" color="text-basic">
            경험이 정리된 <span className="text-text-primary-basic">페이지 명을 직접 검색</span>하면 AI가 더 잘 분석할 수 있어요.
          </Text>
        </Flex>
      </Flex>
    </OnboardingStepShell>
  )
}

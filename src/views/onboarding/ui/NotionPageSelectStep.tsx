import { useCallback, useRef, useState } from 'react'
import { Flex, Grid } from '@radix-ui/themes'
import { toast } from 'sonner'
import { Text, SearchField } from '@shared/ui'
import { Chip } from '@shared/ui/chip'
import { useDebounce } from '@shared/hooks/useDebounce'
import { useIntersectionObserver } from '@shared/hooks/useIntersectionObserver'
import { useWorkspaceId } from '@entities/user'
import { useNotionPages, useNotionConnectionId, useImportNotionExperiences } from '@entities/notion'
import { NotionPageCard } from '@features/notion_connect'
import type { OnboardingStepProps } from '../model/onboardingFlow'
import { OnboardingStepShell } from './OnboardingStepShell'

interface NotionPageSelectStepProps extends OnboardingStepProps {
  /** OAuth 콜백이 URL로 넘긴 Notion 연결 ID. 없으면 연결 목록의 첫 연결로 폴백한다. */
  connectionId?: string
}

/** 온보딩 스텝: 연동된 Notion에서 가져온 페이지 중 이력서로 만들 페이지 검색·선택(다중) 후 경험으로 추출 */
export const NotionPageSelectStep = ({ onDone, onPrev, onSkip, connectionId: connectionIdFromUrl }: NotionPageSelectStepProps) => {
  const [pageIds, setPageIds] = useState<string[]>([])
  const [keyword, setKeyword] = useState('')
  const workspaceId = useWorkspaceId()
  const connectionId = useNotionConnectionId(workspaceId, connectionIdFromUrl)
  const debouncedKeyword = useDebounce(keyword.trim(), 300)
  const { pages, isLoading, hasNextPage, isFetchingNextPage, fetchNextPage } = useNotionPages(workspaceId, connectionId, debouncedKeyword)
  const { mutate: importPages, isPending } = useImportNotionExperiences(workspaceId)

  const scrollRef = useRef<HTMLDivElement>(null)
  const sentinelRef = useIntersectionObserver<HTMLDivElement>({
    root: scrollRef,
    enabled: hasNextPage && !isFetchingNextPage,
    onIntersect: fetchNextPage
  })

  const toggle = useCallback((id: string) => {
    setPageIds((prev) => (prev.includes(id) ? prev.filter((pageId) => pageId !== id) : [...prev, id]))
  }, [])

  const handleImport = () => {
    if (!connectionId || pageIds.length === 0) return
    importPages(
      { connectionId, pageIds },
      {
        onSuccess: () => onDone(),
        onError: () => toast.error('경험 가져오기에 실패했어요. 다시 시도해 주세요.', { id: 'notion-import-error', position: 'top-center' })
      }
    )
  }

  return (
    <OnboardingStepShell
      title="노션 페이지를 선택해주세요."
      description="SCOOP의 경험정리에 가져올 이력서/경험정리 페이지를 선택해 주세요."
      onNext={handleImport}
      nextDisabled={pageIds.length === 0 || !connectionId || isPending}
      nextLabel={isPending ? '가져오는 중...' : '경험 추출하기'}
      onPrev={onPrev}
      prevLabel="취소"
      onSkip={onSkip}
    >
      <Flex direction="column" align="center" gap="5" className="min-h-0 w-full flex-1">
        <SearchField placeholder="보이지 않는 페이지 또는 데이터베이스는 제목으로 검색" value={keyword} onChange={(e) => setKeyword(e.target.value)} className="shrink-0" />
        {pages.length > 0 ? (
          <Flex ref={scrollRef} direction="column" className="min-h-0 w-full flex-1 overflow-y-auto pr-2">
            <Grid columns={pages.length > 20 ? '2' : '1'} gap="3">
              {pages.map((page) => (
                <NotionPageCard key={page.pageId} id={page.pageId} title={page.title} lastEditedTime={page.lastEditedTime} isSelected={pageIds.includes(page.pageId)} onToggle={toggle} />
              ))}
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
        <Flex align="center" className="shrink-0 gap-1.5">
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

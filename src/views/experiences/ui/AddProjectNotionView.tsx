import { useCallback, useRef, useState } from 'react'
import { Flex, Grid } from '@radix-ui/themes'
import { toast } from 'sonner'
import { Button, Text, SearchField } from '@shared/ui'
import { Chip } from '@shared/ui/chip'
import { DialogHeader, DialogTitle, DialogDescription } from '@shared/ui/dialog'
import { useDebounce } from '@shared/hooks/useDebounce'
import { useIntersectionObserver } from '@shared/hooks/useIntersectionObserver'
import { useNotionPages } from '@entities/notion'
import { NotionPageCard } from '@features/notion_connect'

const MAX_NOTION_PAGES = 3

interface AddProjectNotionViewProps {
  workspaceId: string
  connectionId: string
  onExtract: (pageIds: string[]) => void
}

/** Notion 단계: 연동된 Notion에서 페이지를 검색·다중 선택해(최대 3개) 프로젝트로 추출한다. */
export const AddProjectNotionView = ({ workspaceId, connectionId, onExtract }: AddProjectNotionViewProps) => {
  const [pageIds, setPageIds] = useState<string[]>([])
  const [keyword, setKeyword] = useState('')
  const debouncedKeyword = useDebounce(keyword.trim(), 300)
  const { pages, isLoading, hasNextPage, isFetchingNextPage, fetchNextPage } = useNotionPages(workspaceId, connectionId, debouncedKeyword)

  const scrollRef = useRef<HTMLDivElement>(null)
  const sentinelRef = useIntersectionObserver<HTMLDivElement>({
    root: scrollRef,
    enabled: hasNextPage && !isFetchingNextPage,
    onIntersect: fetchNextPage
  })

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

  return (
    <>
      <DialogHeader>
        <DialogTitle className="text-title3 text-text-basic font-bold">노션 페이지를 선택해주세요.</DialogTitle>
        <DialogDescription className="text-body1 text-text-subtler">SCOOP의 경험정리에 가져올 이력서/경험정리 페이지를 선택해 주세요.</DialogDescription>
      </DialogHeader>
      <Flex direction="column" className="gap-5">
        <SearchField placeholder="보이지 않는 페이지 또는 데이터베이스는 제목으로 검색" value={keyword} onChange={(e) => setKeyword(e.target.value)} />
        {pages.length > 0 ? (
          <Flex ref={scrollRef} direction="column" className="max-h-[60vh] gap-3 overflow-y-auto pr-2">
            <Grid columns={pages.length > 20 ? '2' : '1'} gapX="3" gapY="3">
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
          <Flex direction="column" align="center" justify="center" gap="1" className="border-border-subtle w-full rounded-xl border border-dashed px-6 py-16">
            <Text variant="headline2" color="text-basic">
              {isLoading ? '페이지를 불러오는 중이에요.' : '검색하신 페이지가 없어요.'}
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
      <Button variant="primary" size="xl" className="w-full" disabled={pageIds.length === 0} onClick={() => onExtract(pageIds)}>
        경험 추출하기
      </Button>
    </>
  )
}

import { useState } from 'react'
import { Flex } from '@radix-ui/themes'
import { toast } from 'sonner'
import { cn } from '@shared/lib/cn'
import { formatDate } from '@shared/lib'
import { Text, SearchField } from '@shared/ui'
import { Chip } from '@shared/ui/chip'
import { useDebounce } from '@shared/hooks/useDebounce'
import { useWorkspaceId } from '@entities/user'
import { useNotionPages, useNotionConnectionId, useImportNotionExperiences } from '@entities/notion'
import type { OnboardingStepProps } from '../model/useOnboardingFlow'
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
  const { pages, isLoading } = useNotionPages(workspaceId, connectionId, debouncedKeyword)
  const { mutate: importPages, isPending } = useImportNotionExperiences(workspaceId)

  const toggle = (id: string) => {
    setPageIds((prev) => (prev.includes(id) ? prev.filter((pageId) => pageId !== id) : [...prev, id]))
  }

  const handleImport = () => {
    if (!connectionId || pageIds.length === 0) return
    importPages(
      { connectionId, pageIds },
      {
        onSuccess: ({ failed }) => {
          // 온보딩은 일회성 플로우라 부분 실패여도 진행을 막지 않고 안내만 한다
          if (failed.length > 0) toast.warning(`${pageIds.length}개 중 ${failed.length}개 페이지는 가져오지 못했어요.`, { id: 'notion-import-partial', position: 'top-center' })
          onDone()
        },
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
      <Flex direction="column" align="center" className="w-full gap-5">
        <SearchField placeholder="보이지 않는 페이지 또는 데이터베이스는 제목으로 검색" value={keyword} onChange={(e) => setKeyword(e.target.value)} />
        {pages.length > 0 ? (
          <Flex direction="column" gap="3" className="w-full">
            {pages.map((page) => (
              <NotionPageCard key={page.pageId} title={page.title} lastEditedTime={page.lastEditedTime} isSelected={pageIds.includes(page.pageId)} onToggle={() => toggle(page.pageId)} />
            ))}
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
    </OnboardingStepShell>
  )
}

interface NotionPageCardProps {
  title: string
  lastEditedTime?: string | null
  isSelected: boolean
  onToggle: () => void
}
const NotionPageCard = ({ title, lastEditedTime, isSelected, onToggle }: NotionPageCardProps) => {
  const editedAt = formatDate(lastEditedTime)
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
            {title}
          </Text>
          {editedAt && (
            <Text variant="caption2" color="text-subtler">
              {editedAt} 수정
            </Text>
          )}
        </Flex>
      </Flex>
      <span className={cn('border-border-subtle relative size-4.5 shrink-0 rounded-full border bg-white', isSelected && 'border-border-primary')}>
        {isSelected && <span className="bg-element-primary absolute top-1/2 left-1/2 size-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full" />}
      </span>
    </button>
  )
}

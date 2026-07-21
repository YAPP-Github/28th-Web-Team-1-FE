import { memo } from 'react'
import { Flex } from '@radix-ui/themes'
import { cn } from '@shared/lib/cn'
import { formatDate } from '@shared/lib'
import { Text } from '@shared/ui'

interface NotionPageCardProps {
  id: string
  title: string
  lastEditedTime?: string | null
  isSelected: boolean
  onToggle: (id: string) => void
}

/**
 * Notion 페이지 1개를 나타내는 선택 가능한 카드이다. 다중 선택(체크)·단일 선택(라디오) 모두
 * `isSelected` 상태와 `onToggle` 클릭 핸들러만으로 표현하며, 실제 선택 로직은 호출부(부모)가 결정한다.
 * @example
 * ```tsx
 * <NotionPageCard id={page.pageId} title={page.title} lastEditedTime={page.lastEditedTime} isSelected={selected.includes(page.pageId)} onToggle={toggle} />
 * ```
 */
export const NotionPageCard = memo(({ id, title, lastEditedTime, isSelected, onToggle }: NotionPageCardProps) => {
  const editedAt = formatDate(lastEditedTime)
  return (
    <button
      type="button"
      aria-pressed={isSelected}
      onClick={() => onToggle(id)}
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
      <span className={cn('border-border-subtle relative size-4.5 shrink-0 rounded-full border bg-white transition-colors', isSelected && 'border-element-primary bg-element-primary')}>
        {isSelected && <span className="absolute top-1/2 left-1/2 size-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white" />}
      </span>
    </button>
  )
})

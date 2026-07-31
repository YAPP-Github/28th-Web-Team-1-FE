import { Flex } from '@radix-ui/themes'
import { Button } from '@shared/ui/button'
import { Text } from '@shared/ui/typography'
import { cn } from '@shared/lib/cn'

interface ErrorFallbackProps {
  title: string
  description?: string
  /** 넘기면 안내 문구 아래에 '다시 시도' 버튼이 뜬다. `QueryErrorBoundary`의 `resetError`를 그대로 연결하면 된다. */
  onRetry?: () => void
  className?: string
}

/**
 * ErrorBoundary의 fallback으로 쓰는 에러 안내 UI. `description`을 넘기지 않으면 한 줄, 넘기면 제목/설명 두 줄로 표시한다.
 * @example
 * ```tsx
 * <ErrorBoundary fallback={<ErrorFallback title="채용공고 입력창을 불러오지 못했어요. 새로고침 후 다시 시도해 주세요." className="min-h-105" />}>
 *
 * <ErrorBoundary fallback={<ErrorFallback title="프로젝트 목록을 불러오지 못했어요." description="잠시 후 다시 시도해주세요." className="flex-1" />}>
 * ```
 */
export const ErrorFallback = ({ title, description, onRetry, className }: ErrorFallbackProps) => {
  if (!description) {
    return (
      <Flex direction="column" align="center" justify="center" gap="3" className={cn(className)}>
        <Text variant="body1" color="text-subtler">
          {title}
        </Text>
        {onRetry && (
          <Button variant="secondary" size="sm" onClick={onRetry}>
            다시 시도
          </Button>
        )}
      </Flex>
    )
  }

  return (
    <Flex direction="column" align="center" justify="center" gap="1" className={cn(className)}>
      <Text variant="headline2" color="text-basic">
        {title}
      </Text>
      <Text variant="body2" color="text-subtler">
        {description}
      </Text>
      {onRetry && (
        <Button variant="secondary" size="sm" onClick={onRetry} className="mt-2">
          다시 시도
        </Button>
      )}
    </Flex>
  )
}

import { Flex } from '@radix-ui/themes'
import { cn } from '@shared/lib/cn'
import { Text } from '@shared/ui'

interface FieldRowProps {
  label: string
  align?: 'center' | 'start'
  className?: string
  children: React.ReactNode
}

/** 인라인 라벨(왼쪽 고정폭 25px) + 입력 필드(flex) 한 줄. (Figma: 경험/프로젝트 모달의 이름·역할·기간·설명 행) */
export const FieldRow = ({ label, align = 'center', className, children }: FieldRowProps) => (
  <Flex align={align} className={cn('gap-4', className)}>
    <Text variant="label1" weight="semibold" color="text-basic" className="w-6.25 shrink-0">
      {label}
    </Text>
    <div className="min-w-0 flex-1">{children}</div>
  </Flex>
)

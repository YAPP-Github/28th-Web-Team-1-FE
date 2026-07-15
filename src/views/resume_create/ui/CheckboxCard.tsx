import { Flex } from '@radix-ui/themes'
import { Divider, Spacing } from '@shared/ui'
import { Checkbox } from '@shared/ui/checkbox'
import { cn } from '@shared/lib'
import type { ReactNode } from 'react'

interface Props {
  checked: boolean
  onCheckedChange: (checked: boolean) => void
  disabled?: boolean
  /** 테두리(선택 강조 포함) 표시 여부 */
  bordered?: boolean
  /** 체크박스 오른쪽 헤더 영역 */
  top: ReactNode
  /** 카드 본문 */
  middle: ReactNode
  /** 하단 부가 영역. 있으면 divider와 함께 렌더된다. */
  bottom?: ReactNode
}

export const CheckboxCard = ({ checked, onCheckedChange, disabled = false, bordered = true, top, middle, bottom }: Props) => {
  return (
    <Flex
      direction="column"
      onClick={() => !disabled && onCheckedChange(!checked)}
      className={cn(
        'shrink-0 rounded-xl p-4 select-none',
        disabled ? 'text-text-disabled **:text-text-disabled! cursor-not-allowed' : 'bg-bg-white cursor-pointer',
        bordered && 'border-border-subtle border',
        bordered && checked && !disabled && 'border-border-primary'
      )}
    >
      <Flex align={'center'} gap={'4'} className={'min-w-0'}>
        <Checkbox checked={checked} disabled={disabled} onCheckedChange={(value) => onCheckedChange(value === true)} onClick={(event) => event.stopPropagation()} />
        <Flex flexGrow={'1'} className={'min-w-0'}>
          {top}
        </Flex>
      </Flex>

      <Spacing size={16} />
      {middle}

      {bottom && (
        <>
          <Spacing size={16} />
          <Divider />
          <Spacing size={16} />
          {bottom}
        </>
      )}
    </Flex>
  )
}

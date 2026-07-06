'use client'
import { CheckIcon } from 'lucide-react'
import { Checkbox as CheckboxPrimitive } from 'radix-ui'
import { cn } from '@shared/lib/cn'

/**
 * 디자인 시스템 Checkbox 컴포넌트
 * @param defaultChecked - 초기 체크 상태 (비제어로 사용할 때)
 * @param checked - 체크 상태 (제어로 사용할 때, onCheckedChange와 함께 사용)
 * @param onCheckedChange - 상태가 바뀔 때 호출되는 콜백
 * @param disabled - 비활성화 상태
 * @example
 * <Checkbox defaultChecked onCheckedChange={(checked) => console.log(checked)} />
 */
const Checkbox = ({ className, ...props }: React.ComponentProps<typeof CheckboxPrimitive.Root>) => {
  return (
    <CheckboxPrimitive.Root
      data-slot="checkbox"
      className={cn(
        // Base
        'peer border-border-subtle text-icon-gray-lighter relative flex size-4 shrink-0 items-center justify-center rounded-xs border transition-colors outline-none',
        'after:absolute after:-inset-x-3 after:-inset-y-2',
        // checked
        'data-checked:border-border-primary data-checked:bg-element-primary data-checked:text-icon-inverse',
        // focus
        'focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-3',
        // invalid
        'aria-invalid:border-destructive aria-invalid:ring-destructive/20 aria-invalid:aria-checked:border-primary aria-invalid:ring-3',
        // disabled
        'group-has-disabled/field:opacity-50 disabled:cursor-not-allowed disabled:opacity-50',
        className
      )}
      {...props}
    >
      <CheckboxPrimitive.Indicator forceMount data-slot="checkbox-indicator" className="grid place-content-center text-current transition-none [&>svg]:size-3">
        <CheckIcon />
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  )
}

export { Checkbox }

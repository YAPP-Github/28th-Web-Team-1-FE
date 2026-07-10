import type { ComponentProps, PropsWithChildren } from 'react'
import { RadioGroup as RadioGroupPrimitive } from 'radix-ui'
import { cn } from '@shared/lib/cn'

type SelectedControlProps = ComponentProps<typeof RadioGroupPrimitive.Root>
type SelectedControlItemProps = PropsWithChildren<ComponentProps<typeof RadioGroupPrimitive.Item>>

/**
 * 디자인 시스템 SelectedControl 컴포넌트
 *
 * RadioGroup을 기반으로 한 세그먼트 컨트롤입니다.
 * `SelectedControl`(root) + `SelectedControlItem`(각 옵션)의 조합으로 사용합니다.
 *
 * @example
 * ```tsx
 * // 3개 옵션, 기본값 지정
 * <SelectedControl defaultValue="옵션 2" className="w-80">
 *   <SelectedControlItem value="옵션 1">옵션 1</SelectedControlItem>
 *   <SelectedControlItem value="옵션 2">옵션 2</SelectedControlItem>
 *   <SelectedControlItem value="옵션 3">옵션 3</SelectedControlItem>
 * </SelectedControl>
 *
 * // 제어 컴포넌트
 * <SelectedControl value={value} onValueChange={setValue}>
 *   <SelectedControlItem value="옵션 1">옵션 1</SelectedControlItem>
 *   <SelectedControlItem value="옵션 2">옵션 2</SelectedControlItem>
 *   <SelectedControlItem value="옵션 3">옵션 3</SelectedControlItem>
 * </SelectedControl>
 *
 * // 비활성화
 * <SelectedControl defaultValue="옵션 1" disabled>
 *   <SelectedControlItem value="옵션 1">옵션 1</SelectedControlItem>
 *   <SelectedControlItem value="옵션 2">옵션 2</SelectedControlItem>
 * </SelectedControl>
 * ```
 */

export const SelectedControl = ({ className, ...props }: SelectedControlProps) => {
  return <RadioGroupPrimitive.Root data-slot="radio-group" className={cn('bg-element-gray-light flex w-full justify-around gap-2 overflow-hidden rounded-md p-1', className)} {...props} />
}

export const SelectedControlItem = ({ children, className, ...props }: SelectedControlItemProps) => {
  return (
    <RadioGroupPrimitive.Item
      data-slot="radio-group-item"
      className={cn(
        'group/radio-group-item w-full min-w-0 flex-1 rounded-sm px-2 py-1.5',
        'text-label1 text-text-subtler truncate text-center',
        'transition-all duration-200 ease-in-out',
        'data-checked:bg-element-white data-checked:text-text-basic data-checked:shadow-sm',
        className
      )}
      {...props}
    >
      {children}
    </RadioGroupPrimitive.Item>
  )
}

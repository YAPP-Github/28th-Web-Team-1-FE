import type { ComponentProps } from 'react'
import { ToggleGroup as ToggleGroupPrimitive } from 'radix-ui'
import { Check } from 'lucide-react'
import { cn } from '@shared/lib/cn'

/**
 * 온보딩 카드 선택 그룹 (단일/다중 선택 지원)
 * type="single" | "multiple" 옵션으로 선택 방식을 지정할 수 있습니다.
 */
export const OnboardingRadioGroup = ({ className, ...props }: ComponentProps<typeof ToggleGroupPrimitive.Root>) => {
  return <ToggleGroupPrimitive.Root className={cn('flex w-full flex-col gap-3', className)} {...props} />
}

export const OnboardingRadioItem = ({ children, className, ...props }: ComponentProps<typeof ToggleGroupPrimitive.Item>) => {
  return (
    <ToggleGroupPrimitive.Item
      className={cn(
        // Base
        'group/select-item flex w-full items-center justify-between rounded-xl border border-transparent px-5 py-4 text-left transition-all outline-none',
        'bg-btn-tertiary-fill text-text-basic',
        // Focus
        'focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-3',
        // Selected (Radix ToggleGroup state)
        'data-[state=on]:bg-element-white data-[state=on]:border-btn-secondary-border data-[state=on]:text-text-primary-basic',
        className
      )}
      {...props}
    >
      <span className="text-label1 font-semibold">{children}</span>
      <Check size={24} className="text-icon-gray group-data-[state=on]/select-item:text-icon-primary-basic transition-colors" />
    </ToggleGroupPrimitive.Item>
  )
}

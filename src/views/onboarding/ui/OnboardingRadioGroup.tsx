import type { ComponentProps, PropsWithChildren } from 'react'
import { RadioGroup as RadioGroupPrimitive } from 'radix-ui'
import { cn } from '@shared/lib/cn'

/**
 * 온보딩 세로 선택 카드 그룹
 *
 * RadioGroup을 기반으로 한 단일 선택 목록입니다.
 * `OnboardingRadioGroup`(root) + `OnboardingRadioItem`(각 옵션)의 조합으로 사용합니다.
 *
 * @example
 * ```tsx
 * <OnboardingRadioGroup value={value} onValueChange={setValue}>
 *   <OnboardingRadioItem value="yes">네, 있어요.</OnboardingRadioItem>
 *   <OnboardingRadioItem value="no">아니오, 없어요.</OnboardingRadioItem>
 * </OnboardingRadioGroup>
 * ```
 */
export const OnboardingRadioGroup = ({ className, ...props }: ComponentProps<typeof RadioGroupPrimitive.Root>) => {
  return <RadioGroupPrimitive.Root data-slot="onboarding-radio-group" className={cn('flex w-full flex-col gap-3', className)} {...props} />
}

export const OnboardingRadioItem = ({ children, className, ...props }: PropsWithChildren<ComponentProps<typeof RadioGroupPrimitive.Item>>) => {
  return (
    <RadioGroupPrimitive.Item
      data-slot="onboarding-radio-item"
      className={cn(
        // Base
        'group/radio-item flex w-full items-center justify-between rounded-xl border border-transparent px-5 py-4 text-left transition-all outline-none',
        'bg-btn-tertiary-fill text-text-basic',
        // Focus
        'focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-3',
        // Checked
        'data-checked:bg-element-white data-checked:border-btn-secondary-border data-checked:text-text-primary-basic',
        className
      )}
      {...props}
    >
      <span className="text-label1 font-semibold">{children}</span>
      <span
        className={cn(
          'border-border-subtle relative size-4.5 shrink-0 rounded-full border bg-white transition-colors',
          'group-data-[state=checked]/radio-item:border-element-primary group-data-[state=checked]/radio-item:bg-element-primary'
        )}
      >
        <span className="absolute top-1/2 left-1/2 size-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white" />
      </span>
    </RadioGroupPrimitive.Item>
  )
}

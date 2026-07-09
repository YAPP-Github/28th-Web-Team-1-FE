import { RadioGroup as RadioGroupPrimitive } from 'radix-ui'
import { cn } from '@shared/lib/cn'

const RadioGroup = ({ className, ...props }: React.ComponentProps<typeof RadioGroupPrimitive.Root>) => {
  return <RadioGroupPrimitive.Root data-slot="radio-group" className={cn('grid w-full gap-2', className)} {...props} />
}

// border 없는 디자인 나올 경우 variant로 처리 가능
// SelectedControl이랑 RadioGroup 기능은 같기 때문에 추후 통합 후 variant로 구분 고려 중
const RadioGroupItem = ({ className, children, ...props }: React.ComponentProps<typeof RadioGroupPrimitive.Item>) => {
  return (
    <RadioGroupPrimitive.Item
      data-slot="radio-group-item"
      className={cn(
        // Base
        'group/radio-group-item peer bg-element-white relative flex w-full items-center gap-3 p-5',
        'border-border-subtle cursor-pointer rounded-xl border text-left transition-all outline-none',
        // Focus
        'focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-3',
        // Checked
        'data-checked:border-border-primary data-checked:bg-element-brand-subtle',
        // Disabled
        'disabled:cursor-not-allowed disabled:opacity-50',
        className
      )}
      {...props}
    >
      <div
        className={cn(
          'border-border-subtle relative size-4 shrink-0 rounded-full border bg-white',
          'group-data-[state=checked]/radio-group-item:border-border-primary group-data-[state=checked]/radio-group-item:bg-element-primary'
        )}
      >
        <RadioGroupPrimitive.Indicator data-slot="radio-group-indicator" className="flex size-4 items-center justify-center">
          <span className="bg-element-white absolute top-1/2 left-1/2 size-2 -translate-x-1/2 -translate-y-1/2 rounded-full" />
        </RadioGroupPrimitive.Indicator>
      </div>

      {children}
    </RadioGroupPrimitive.Item>
  )
}

export { RadioGroup, RadioGroupItem }

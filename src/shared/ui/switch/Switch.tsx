'use client'
import { Switch as SwitchPrimitive } from 'radix-ui'
import { cn } from '@shared/lib/cn'

/**
 * 디자인 시스템 Switch 컴포넌트
 * @param defaultChecked - 초기 on/off 상태 (비제어로 사용할 때)
 * @param checked - on/off 상태 (제어로 사용할 때, onCheckedChange와 함께 사용)
 * @param onCheckedChange - 상태가 바뀔 때 호출되는 콜백
 * @example
 * <Switch defaultChecked onCheckedChange={(checked) => console.log(checked)} />
 */
const Switch = ({ className, ...props }: React.ComponentProps<typeof SwitchPrimitive.Root>) => {
  return (
    <SwitchPrimitive.Root
      data-slot="switch"
      className={cn(
        // Layout
        'peer relative inline-flex h-5 w-8 shrink-0 items-center rounded-full border border-transparent px-px',
        // Interaction
        'transition-all duration-200 outline-none after:absolute after:-inset-x-3 after:-inset-y-2',
        // Checked / Unchecked
        'data-checked:bg-element-primary data-unchecked:bg-element-gray-light',
        // Focus visible (키보드 포커스)
        'focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-3',
        // Invalid
        'aria-invalid:border-destructive aria-invalid:ring-destructive/20 aria-invalid:ring-3',
        className
      )}
      {...props}
    >
      <SwitchPrimitive.Thumb
        data-slot="switch-thumb"
        className={cn(
          // Layout
          'shadow-1 pointer-events-none block size-4 rounded-full ring-0',
          // Interaction
          'ease-out-back transition-transform duration-200',
          // Checked / Unchecked
          'bg-element-white data-checked:translate-x-[calc(100%-4px)] data-unchecked:translate-x-0'
        )}
      />
    </SwitchPrimitive.Root>
  )
}

export { Switch }

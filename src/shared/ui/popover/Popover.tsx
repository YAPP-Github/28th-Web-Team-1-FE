'use client'
import { Popover as PopoverPrimitive } from 'radix-ui'
import { cn } from '@shared/lib/cn'

const Popover = ({ ...props }: React.ComponentProps<typeof PopoverPrimitive.Root>) => {
  return <PopoverPrimitive.Root data-slot="popover" {...props} />
}

const PopoverTrigger = ({ ...props }: React.ComponentProps<typeof PopoverPrimitive.Trigger>) => {
  return <PopoverPrimitive.Trigger data-slot="popover-trigger" {...props} />
}

/**
 * 디자인 시스템 Popover의 내용(Content) 영역
 *
 * 위치·애니메이션·그림자(`shadow-1`)·기본 너비(`w-72`)만 제공합니다.
 * 배경색·모서리 반경·패딩(`bg-*` / `rounded-*` / `p-*`)은 의도적으로 포함하지 않으니,
 * 사용하는 쪽에서 `className`으로 직접 지정해 스타일을 완성하세요.
 *
 * @example
 * ```tsx
 * <Popover>
 *   <PopoverTrigger asChild>
 *     <Button>열기</Button>
 *   </PopoverTrigger>
 *   // bg / rounded / padding은 className으로 직접 지정
 *   <PopoverContent className="bg-white rounded-md p-4">
 *     내용
 *   </PopoverContent>
 * </Popover>
 * ```
 */
const PopoverContent = ({ className, align = 'center', sideOffset = 4, ...props }: React.ComponentProps<typeof PopoverPrimitive.Content>) => {
  return (
    <PopoverPrimitive.Portal>
      <PopoverPrimitive.Content
        data-slot="popover-content"
        align={align}
        sideOffset={sideOffset}
        className={cn(
          'data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95 shadow-1 z-50 flex w-72 origin-(--radix-popover-content-transform-origin) flex-col text-sm outline-hidden duration-100',
          className
        )}
        {...props}
      />
    </PopoverPrimitive.Portal>
  )
}

const PopoverAnchor = ({ ...props }: React.ComponentProps<typeof PopoverPrimitive.Anchor>) => {
  return <PopoverPrimitive.Anchor data-slot="popover-anchor" {...props} />
}

const PopoverHeader = ({ className, ...props }: React.ComponentProps<'div'>) => {
  return <div data-slot="popover-header" className={cn('flex flex-col gap-0.5 text-sm', className)} {...props} />
}

const PopoverTitle = ({ className, ...props }: React.ComponentProps<'h2'>) => {
  return <div data-slot="popover-title" className={cn('font-medium', className)} {...props} />
}

const PopoverDescription = ({ className, ...props }: React.ComponentProps<'p'>) => {
  return <p data-slot="popover-description" className={cn('text-muted-foreground', className)} {...props} />
}

export { Popover, PopoverAnchor, PopoverContent, PopoverDescription, PopoverHeader, PopoverTitle, PopoverTrigger }

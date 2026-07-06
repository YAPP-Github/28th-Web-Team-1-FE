'use client'
import { Tooltip as TooltipPrimitive } from 'radix-ui'
import { cn } from '@shared/lib/cn'
import { CircleQuestionMark } from 'lucide-react'

/**
 * 물음표 아이콘이며, 호버하면 툴팁을 표시한다.
 * @param children - 툴팁에 표시할 도움말 문구
 * @example
 * ```tsx
 * <HelpTooltip>다른 사람에게 보여지는 이름이에요.</HelpTooltip>
 * <HelpTooltip sideOffset={8} side="right">다른 사람에게 보여지는 이름이에요.</HelpTooltip>
 * ```
 */
const HelpTooltip = ({ children, ...props }: React.ComponentProps<typeof TooltipContent>) => {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <button type="button" data-slot="tooltip-trigger" className="text-icon-gray-light hover:bg-element-gray-light rounded-full p-1.5">
          <CircleQuestionMark size={12} />
        </button>
      </TooltipTrigger>
      <TooltipContent {...props}>{children}</TooltipContent>
    </Tooltip>
  )
}

/**
 * Tooltip 그룹의 공통 동작을 제어하는 Provider 컴포넌트이다. 여러 Tooltip을 감싸 delayDuration을 공유한다.
 * @param delayDuration - 트리거에 마우스를 올린 후 툴팁이 뜨기까지의 지연 시간(ms, 기본 0)
 * @example
 * ```tsx
 * <TooltipProvider delayDuration={200}>
 *   <Tooltip>...</Tooltip>
 * </TooltipProvider>
 * ```
 */
const TooltipProvider = ({ delayDuration = 0, ...props }: React.ComponentProps<typeof TooltipPrimitive.Provider>) => {
  return <TooltipPrimitive.Provider data-slot="tooltip-provider" delayDuration={delayDuration} {...props} />
}

/**
 * 개별 Tooltip의 열림/닫힘 상태를 관리하는 루트 컴포넌트이다. TooltipProvider 하위에서 사용한다.
 * @example
 * ```tsx
 * <Tooltip>
 *   <TooltipTrigger asChild>
 *     <Button>Hover me</Button>
 *   </TooltipTrigger>
 *   <TooltipContent>안내 문구</TooltipContent>
 * </Tooltip>
 * ```
 */
const Tooltip = ({ ...props }: React.ComponentProps<typeof TooltipPrimitive.Root>) => {
  return <TooltipPrimitive.Root data-slot="tooltip" {...props} />
}

/**
 * Tooltip을 여는 트리거 컴포넌트이다. asChild로 자식 요소에 트리거 동작을 위임할 수 있다.
 * @example
 * ```tsx
 * <TooltipTrigger asChild>
 *   <Button>Hover me</Button>
 * </TooltipTrigger>
 * ```
 */
const TooltipTrigger = ({ ...props }: React.ComponentProps<typeof TooltipPrimitive.Trigger>) => {
  return <TooltipPrimitive.Trigger data-slot="tooltip-trigger" {...props} />
}

/**
 * 디자인 시스템 Tooltip 콘텐츠 컴포넌트이다. 트리거 기준 방향에 화살표와 함께 표시된다.
 * @param side - 트리거 기준 표시 방향 (top / right / bottom / left)
 * @param sideOffset - 트리거와의 간격(px, 기본 0)
 * @example
 * ```tsx
 * <TooltipContent side="top" sideOffset={4}>안내 문구</TooltipContent>
 * ```
 */
const TooltipContent = ({ className, sideOffset = 0, children, ...props }: React.ComponentProps<typeof TooltipPrimitive.Content>) => {
  return (
    <TooltipPrimitive.Portal>
      <TooltipPrimitive.Content
        data-slot="tooltip-content"
        sideOffset={sideOffset}
        className={cn(
          // 기본 레이아웃 및 색상
          'bg-black-75 text-text-bolder-inverse text-caption1 z-50 inline-flex w-fit max-w-xs origin-(--radix-tooltip-content-transform-origin) items-center gap-1.5 rounded-sm p-2',
          // 열림/닫힘 애니메이션
          'data-[state=delayed-open]:animate-in data-[state=delayed-open]:fade-in-0 data-[state=delayed-open]:zoom-in-95 data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95',
          // 방향별 슬라이드 모션
          'data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2',
          // kbd 조합 시 스타일
          'has-data-[slot=kbd]:pr-1.5 **:data-[slot=kbd]:relative **:data-[slot=kbd]:isolate **:data-[slot=kbd]:z-50 **:data-[slot=kbd]:rounded-sm',
          className
        )}
        {...props}
      >
        {children}
        <TooltipPrimitive.Arrow asChild>
          <svg xmlns="http://www.w3.org/2000/svg" width="9" height="5" viewBox="0 0 9 5" fill="none" className="fill-black-75">
            <path d="M5.95192 3.75281C5.15365 4.85893 3.50665 4.85893 2.70838 3.75281L2.28882e-05 0L8.66028 0L5.95192 3.75281Z" />
          </svg>
        </TooltipPrimitive.Arrow>
      </TooltipPrimitive.Content>
    </TooltipPrimitive.Portal>
  )
}

export { HelpTooltip, Tooltip, TooltipContent, TooltipProvider, TooltipTrigger }

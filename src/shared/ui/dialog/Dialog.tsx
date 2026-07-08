'use client'
import { XIcon } from 'lucide-react'
import { Dialog as DialogPrimitive } from 'radix-ui'

import { cn } from '@shared/lib/cn'
import { Button } from '@shared/ui/button'

/**
 * 디자인 시스템 Dialog(Modal)의 루트이다. Radix `Dialog`를 조합형(composable) 프리미티브로 감싼 모달이며,
 * `Trigger`로 비제어(uncontrolled)로 열거나 `open`/`onOpenChange`로 제어(controlled)할 수 있다.
 * 사용자의 확인을 강제하는 `AlertDialog`와 달리, 폼·정보 표시 등 일반적인 모달 용도로 사용한다.
 *
 * @param props Radix `Dialog.Root` props (`open`, `onOpenChange`, `defaultOpen` 등)
 * @example
 * ```tsx
 * <Dialog>
 *   <DialogTrigger asChild>
 *     <Button variant="secondary">모달 열기</Button>
 *   </DialogTrigger>
 *   <DialogContent>
 *     <DialogHeader>
 *       <DialogTitle>프로필 편집</DialogTitle>
 *       <DialogDescription>변경 후 저장을 눌러주세요.</DialogDescription>
 *     </DialogHeader>
 *     <DialogFooter showCloseButton>
 *       <Button onClick={handleSave}>저장</Button>
 *     </DialogFooter>
 *   </DialogContent>
 * </Dialog>
 * ```
 * @see https://ui.shadcn.com/docs/components/dialog shadcn/ui Dialog (구현 기반)
 * @see https://www.radix-ui.com/primitives/docs/components/dialog Radix Dialog (Props·접근성 명세)
 */
const Dialog = ({ ...props }: React.ComponentProps<typeof DialogPrimitive.Root>) => {
  return <DialogPrimitive.Root data-slot="dialog" {...props} />
}

/**
 * 모달을 여는 트리거이다. 보통 `asChild`로 `Button` 등 실제 요소에 동작을 위임한다.
 *
 * @param props Radix `Dialog.Trigger` props (`asChild` 포함)
 * @example
 * ```tsx
 * <DialogTrigger asChild>
 *   <Button variant="secondary">모달 열기</Button>
 * </DialogTrigger>
 * ```
 */
const DialogTrigger = ({ ...props }: React.ComponentProps<typeof DialogPrimitive.Trigger>) => {
  return <DialogPrimitive.Trigger data-slot="dialog-trigger" {...props} />
}

/**
 * 모달을 문서 최상단으로 포탈시키는 컨테이너이다. `Content`가 내부에서 사용하므로 직접 쓸 일은 거의 없다.
 *
 * @param props Radix `Dialog.Portal` props
 */
const DialogPortal = ({ ...props }: React.ComponentProps<typeof DialogPrimitive.Portal>) => {
  return <DialogPrimitive.Portal data-slot="dialog-portal" {...props} />
}

/**
 * 모달을 닫는 버튼이다. 보통 `asChild`로 `Button`에 위임하며, `Footer`의 `showCloseButton`으로 대체할 수도 있다.
 *
 * @param props Radix `Dialog.Close` props (`asChild` 포함)
 * @example
 * ```tsx
 * <DialogClose asChild>
 *   <Button variant="outline">닫기</Button>
 * </DialogClose>
 * ```
 */
const DialogClose = ({ ...props }: React.ComponentProps<typeof DialogPrimitive.Close>) => {
  return <DialogPrimitive.Close data-slot="dialog-close" {...props} />
}

/**
 * 모달 뒤를 덮는 딤(dim) 오버레이이다. `Content`가 내부에서 함께 렌더하므로 직접 쓸 일은 거의 없다.
 *
 * @param props Radix `Dialog.Overlay` props
 */
const DialogOverlay = ({ className, ...props }: React.ComponentProps<typeof DialogPrimitive.Overlay>) => {
  return (
    <DialogPrimitive.Overlay
      data-slot="dialog-overlay"
      className={cn(
        'data-open:animate-in data-open:fade-in-0 data-closed:animate-out data-closed:fade-out-0 fixed inset-0 isolate z-50 bg-black/10 duration-100 supports-backdrop-filter:backdrop-blur-xs',
        className
      )}
      {...props}
    />
  )
}

/**
 * 모달 본문 영역이다. `Overlay`와 `Portal`을 내부에서 함께 렌더하므로 이 컴포넌트만 배치하면 된다.
 * 화면 중앙에 고정되며 `Header`·`Footer` 등을 자식으로 조합한다. 우상단 닫기 버튼이 기본으로 표시된다.
 *
 * @param showCloseButton 우상단 X 닫기 버튼 표시 여부. 기본 `true`
 * @param props Radix `Dialog.Content` props
 * @example
 * ```tsx
 * <DialogContent showCloseButton={false}>...</DialogContent>
 * ```
 */
const DialogContent = ({
  className,
  children,
  showCloseButton = true,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Content> & {
  showCloseButton?: boolean
}) => {
  return (
    <DialogPortal>
      <DialogOverlay />
      <DialogPrimitive.Content
        data-slot="dialog-content"
        className={cn(
          'bg-popover text-popover-foreground ring-foreground/10 data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95 fixed top-1/2 left-1/2 z-50 grid w-full max-w-[calc(100%-2rem)] -translate-x-1/2 -translate-y-1/2 gap-4 rounded-xl p-4 text-sm ring-1 duration-100 outline-none sm:max-w-sm',
          className
        )}
        {...props}
      >
        {children}
        {showCloseButton && (
          <DialogPrimitive.Close data-slot="dialog-close" asChild>
            <Button variant="text" className="absolute top-2 right-2" size="icon-sm">
              <XIcon />
              <span className="sr-only">Close</span>
            </Button>
          </DialogPrimitive.Close>
        )}
      </DialogPrimitive.Content>
    </DialogPortal>
  )
}

/**
 * 제목·설명을 담는 상단 영역이다. `Title`·`Description`을 세로로 쌓는다.
 *
 * @param props `<div>` props
 */
const DialogHeader = ({ className, ...props }: React.ComponentProps<'div'>) => {
  return <div data-slot="dialog-header" className={cn('flex flex-col gap-2', className)} {...props} />
}

/**
 * 하단 버튼 영역이다. 데스크톱에서는 오른쪽 정렬, 모바일에서는 세로로 쌓인다.
 * `showCloseButton`을 켜면 기본 "Close" 버튼이 함께 렌더된다.
 *
 * @param showCloseButton 기본 "Close" 닫기 버튼 표시 여부. 기본 `false`
 * @param props `<div>` props
 * @example
 * ```tsx
 * <DialogFooter showCloseButton>
 *   <Button onClick={handleSave}>저장</Button>
 * </DialogFooter>
 * ```
 */
const DialogFooter = ({
  className,
  showCloseButton = false,
  children,
  ...props
}: React.ComponentProps<'div'> & {
  showCloseButton?: boolean
}) => {
  return (
    <div data-slot="dialog-footer" className={cn('bg-muted/50 -mx-4 -mb-4 flex flex-col-reverse gap-2 rounded-b-xl border-t p-4 sm:flex-row sm:justify-end', className)} {...props}>
      {children}
      {showCloseButton && (
        <DialogPrimitive.Close asChild>
          <Button variant="outline">Close</Button>
        </DialogPrimitive.Close>
      )}
    </div>
  )
}

/**
 * 모달 제목이다. 스크린 리더가 모달의 이름으로 읽으므로 접근성상 함께 두는 것을 권장한다.
 *
 * @param props Radix `Dialog.Title` props
 */
const DialogTitle = ({ className, ...props }: React.ComponentProps<typeof DialogPrimitive.Title>) => {
  return <DialogPrimitive.Title data-slot="dialog-title" className={cn('cn-font-heading text-base leading-none font-medium', className)} {...props} />
}

/**
 * 모달 보조 설명이다. 내부 `<a>`에는 밑줄 스타일이 자동 적용된다.
 *
 * @param props Radix `Dialog.Description` props
 */
const DialogDescription = ({ className, ...props }: React.ComponentProps<typeof DialogPrimitive.Description>) => {
  return (
    <DialogPrimitive.Description
      data-slot="dialog-description"
      className={cn('text-muted-foreground *:[a]:hover:text-foreground text-sm *:[a]:underline *:[a]:underline-offset-3', className)}
      {...props}
    />
  )
}

export { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogOverlay, DialogPortal, DialogTitle, DialogTrigger }

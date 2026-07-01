'use client'
import { AlertDialog as AlertDialogPrimitive } from 'radix-ui'
import { cn } from '@shared/lib/cn'
import { Button } from '@shared/ui/button'

/**
 * 디자인 시스템 AlertModal의 루트이다. Radix `AlertDialog`를 조합형(composable) 프리미티브로 감싼 알림 모달이며,
 * `Trigger`로 비제어(uncontrolled)로 열거나 `open`/`onOpenChange`로 제어(controlled)할 수 있다.
 * 하단 버튼 구성(확인만 / 취소+확인 등)은 `Footer` 안에 `Cancel`·`Action`을 조합해 결정한다.
 *
 * @param props Radix `AlertDialog.Root` props (`open`, `onOpenChange`, `defaultOpen` 등)
 * @example
 * ```tsx
 * <AlertDialog>
 *   <AlertDialogTrigger asChild>
 *     <Button variant="secondary">모달 열기</Button>
 *   </AlertDialogTrigger>
 *   <AlertDialogContent>
 *     <AlertDialogHeader>
 *       <AlertDialogTitle>변경사항을 저장할까요?</AlertDialogTitle>
 *       <AlertDialogDescription>저장하지 않으면 사라져요.</AlertDialogDescription>
 *     </AlertDialogHeader>
 *     <AlertDialogFooter>
 *       <AlertDialogCancel variant="tertiary">취소</AlertDialogCancel>
 *       <AlertDialogAction variant="primary" onClick={handleSave}>확인</AlertDialogAction>
 *     </AlertDialogFooter>
 *   </AlertDialogContent>
 * </AlertDialog>
 * ```
 */
const AlertDialog = ({ ...props }: React.ComponentProps<typeof AlertDialogPrimitive.Root>) => {
  return <AlertDialogPrimitive.Root data-slot="alert-dialog" {...props} />
}

const AlertDialogTrigger = ({ ...props }: React.ComponentProps<typeof AlertDialogPrimitive.Trigger>) => {
  return <AlertDialogPrimitive.Trigger data-slot="alert-dialog-trigger" {...props} />
}

const AlertDialogPortal = ({ ...props }: React.ComponentProps<typeof AlertDialogPrimitive.Portal>) => {
  return <AlertDialogPrimitive.Portal data-slot="alert-dialog-portal" {...props} />
}

const AlertDialogOverlay = ({ className, ...props }: React.ComponentProps<typeof AlertDialogPrimitive.Overlay>) => {
  return (
    <AlertDialogPrimitive.Overlay
      data-slot="alert-dialog-overlay"
      className={cn(
        // Todo : 추후 디자인에서 background blur랑 배경색을 제공하면 수정필요
        'data-open:animate-in data-open:fade-in-0 data-closed:animate-out data-closed:fade-out-0 fixed inset-0 z-50 bg-black/10 duration-100 supports-backdrop-filter:backdrop-blur-xs',
        className
      )}
      {...props}
    />
  )
}

/**
 * 모달 본문 영역이다. `Overlay`와 `Portal`을 내부에서 함께 렌더하므로 이 컴포넌트만 배치하면 된다.
 * 화면 중앙에 고정되며 `Header`·`Footer` 등을 자식으로 조합한다.
 *
 * @param size 모달 크기. `'default'`(기본, 데스크톱에서 더 넓음) | `'sm'`(컴팩트, 버튼 2열 그리드)
 * @param props Radix `AlertDialog.Content` props
 * @example
 * ```tsx
 * <AlertDialogContent size="sm">...</AlertDialogContent>
 * ```
 */
const AlertDialogContent = ({
  className,
  size = 'default',
  ...props
}: React.ComponentProps<typeof AlertDialogPrimitive.Content> & {
  size?: 'default' | 'sm'
}) => {
  return (
    <AlertDialogPortal>
      <AlertDialogOverlay />
      <AlertDialogPrimitive.Content
        data-slot="alert-dialog-content"
        data-size={size}
        className={cn(
          'group/alert-dialog-content bg-bg-white data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95 fixed top-1/2 left-1/2 z-50 grid w-full -translate-x-1/2 -translate-y-1/2 rounded-2xl duration-100 outline-none data-[size=default]:max-w-xs data-[size=sm]:max-w-xs data-[size=default]:sm:max-w-90',
          className
        )}
        {...props}
      />
    </AlertDialogPortal>
  )
}

const AlertDialogHeader = ({ className, ...props }: React.ComponentProps<'div'>) => {
  return (
    <div
      data-slot="alert-dialog-header"
      className={cn(
        'grid grid-rows-[auto_1fr] place-content-center place-items-center gap-1 px-4 py-10 text-center has-data-[slot=alert-dialog-media]:grid-rows-[auto_auto_1fr] has-data-[slot=alert-dialog-media]:gap-x-4',
        className
      )}
      {...props}
    />
  )
}

const AlertDialogFooter = ({ className, ...props }: React.ComponentProps<'div'>) => {
  return <div data-slot="alert-dialog-footer" className={cn('flex flex-row gap-2 rounded-b-2xl px-4 pb-4 *:flex-1', className)} {...props} />
}

const AlertDialogMedia = ({ className, ...props }: React.ComponentProps<'div'>) => {
  return (
    <div
      data-slot="alert-dialog-media"
      className={cn(
        "bg-muted mb-2 inline-flex size-10 items-center justify-center rounded-md sm:group-data-[size=default]/alert-dialog-content:row-span-2 *:[svg:not([class*='size-'])]:size-6",
        className
      )}
      {...props}
    />
  )
}

const AlertDialogTitle = ({ className, ...props }: React.ComponentProps<typeof AlertDialogPrimitive.Title>) => {
  return <AlertDialogPrimitive.Title data-slot="alert-dialog-title" className={cn('text-headline1 text-text-border font-semibold', className)} {...props} />
}

const AlertDialogDescription = ({ className, ...props }: React.ComponentProps<typeof AlertDialogPrimitive.Description>) => {
  return (
    <AlertDialogPrimitive.Description
      data-slot="alert-dialog-description"
      className={cn('text-text-subtler text-body1 *:[a]:hover:text-foreground md:text-pretty *:[a]:underline *:[a]:underline-offset-3', className)}
      {...props}
    />
  )
}

const AlertDialogAction = ({
  className,
  variant = 'primary',
  size = 'md',
  ...props
}: React.ComponentProps<typeof AlertDialogPrimitive.Action> & Pick<React.ComponentProps<typeof Button>, 'variant' | 'size'>) => {
  return (
    <Button variant={variant} size={size} asChild>
      <AlertDialogPrimitive.Action data-slot="alert-dialog-action" className={cn(className)} {...props} />
    </Button>
  )
}

const AlertDialogCancel = ({
  className,
  variant = 'primary',
  size = 'md',
  ...props
}: React.ComponentProps<typeof AlertDialogPrimitive.Cancel> & Pick<React.ComponentProps<typeof Button>, 'variant' | 'size'>) => {
  return (
    <Button variant={variant} size={size} asChild>
      <AlertDialogPrimitive.Cancel data-slot="alert-dialog-cancel" className={cn(className)} {...props} />
    </Button>
  )
}

export {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogMedia,
  AlertDialogOverlay,
  AlertDialogPortal,
  AlertDialogTitle,
  AlertDialogTrigger
}

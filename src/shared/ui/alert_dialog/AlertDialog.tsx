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
 * @see https://ui.shadcn.com/docs/components/alert-dialog shadcn/ui AlertDialog (구현 기반)
 * @see https://www.radix-ui.com/primitives/docs/components/alert-dialog Radix AlertDialog (Props·접근성 명세)
 */
const AlertDialog = ({ ...props }: React.ComponentProps<typeof AlertDialogPrimitive.Root>) => {
  return <AlertDialogPrimitive.Root data-slot="alert-dialog" {...props} />
}

/**
 * 모달을 여는 트리거이다. 보통 `asChild`로 `Button` 등 실제 요소에 동작을 위임한다.
 *
 * @param props Radix `AlertDialog.Trigger` props (`asChild` 포함)
 * @example
 * ```tsx
 * <AlertDialogTrigger asChild>
 *   <Button variant="secondary">모달 열기</Button>
 * </AlertDialogTrigger>
 * ```
 */
const AlertDialogTrigger = ({ ...props }: React.ComponentProps<typeof AlertDialogPrimitive.Trigger>) => {
  return <AlertDialogPrimitive.Trigger data-slot="alert-dialog-trigger" {...props} />
}

/**
 * 모달을 문서 최상단으로 포탈시키는 컨테이너이다. `Content`가 내부에서 사용하므로 직접 쓸 일은 거의 없다.
 *
 * @param props Radix `AlertDialog.Portal` props
 */
const AlertDialogPortal = ({ ...props }: React.ComponentProps<typeof AlertDialogPrimitive.Portal>) => {
  return <AlertDialogPrimitive.Portal data-slot="alert-dialog-portal" {...props} />
}

/**
 * 모달 뒤를 덮는 딤(dim) 오버레이이다. `Content`가 내부에서 함께 렌더하므로 직접 쓸 일은 거의 없다.
 *
 * @param props Radix `AlertDialog.Overlay` props
 */
const AlertDialogOverlay = ({ className, ...props }: React.ComponentProps<typeof AlertDialogPrimitive.Overlay>) => {
  return (
    <AlertDialogPrimitive.Overlay
      data-slot="alert-dialog-overlay"
      className={cn(
        'data-open:animate-in data-open:fade-in-0 data-closed:animate-out data-closed:fade-out-0 bg-black-50 fixed inset-0 z-50 duration-100 supports-backdrop-filter:backdrop-blur-[2px]',
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

/**
 * 제목·설명·미디어를 담는 상단 영역이다. `Media`가 있으면 자동으로 레이아웃(행 구성)이 바뀐다.
 *
 * @param props `<div>` props
 */
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

/**
 * 하단 버튼 영역이다. `Cancel`·`Action`을 자식으로 두며, 버튼들은 가로로 균등(`flex-1`) 배치된다.
 *
 * @param props `<div>` props
 * @example
 * ```tsx
 * <AlertDialogFooter>
 *   <AlertDialogCancel variant="tertiary">취소</AlertDialogCancel>
 *   <AlertDialogAction variant="danger">삭제</AlertDialogAction>
 * </AlertDialogFooter>
 * ```
 */
const AlertDialogFooter = ({ className, ...props }: React.ComponentProps<'div'>) => {
  return <div data-slot="alert-dialog-footer" className={cn('flex flex-row gap-2 rounded-b-2xl px-4 pb-4 *:flex-1', className)} {...props} />
}

/**
 * `Header` 상단에 아이콘/이미지를 넣는 미디어 슬롯이다. 존재하면 `Header` 레이아웃이 자동 조정된다.
 *
 * @param props `<div>` props (보통 `<svg>` 아이콘을 자식으로 둠)
 */
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

/**
 * 모달 제목이다. 스크린 리더가 모달의 이름으로 읽으므로 접근성상 함께 두는 것을 권장한다.
 *
 * @param props Radix `AlertDialog.Title` props
 */
const AlertDialogTitle = ({ className, ...props }: React.ComponentProps<typeof AlertDialogPrimitive.Title>) => {
  return <AlertDialogPrimitive.Title data-slot="alert-dialog-title" className={cn('text-headline1 text-text-border font-semibold', className)} {...props} />
}

/**
 * 모달 보조 설명이다. 내부 `<a>`에는 밑줄 스타일이 자동 적용된다.
 *
 * @param props Radix `AlertDialog.Description` props
 */
const AlertDialogDescription = ({ className, ...props }: React.ComponentProps<typeof AlertDialogPrimitive.Description>) => {
  return (
    <AlertDialogPrimitive.Description
      data-slot="alert-dialog-description"
      className={cn('text-text-subtler text-body1 *:[a]:hover:text-foreground break-keep md:text-pretty *:[a]:underline *:[a]:underline-offset-3', className)}
      {...props}
    />
  )
}

/**
 * 확정 액션 버튼이다. 클릭 시 모달이 닫히며, `onClick`으로 실제 동작을 연결한다.
 * 내부적으로 `Button`으로 렌더되므로 `variant`·`size`를 그대로 받는다(삭제 등 파괴적 동작은 `variant="danger"` 권장).
 *
 * @param variant 버튼 스타일. 기본 `'primary'` (삭제/위험 동작은 `'danger'`)
 * @param size 버튼 크기. 기본 `'md'`
 * @param props Radix `AlertDialog.Action` props (`onClick` 등)
 * @example
 * ```tsx
 * <AlertDialogAction variant="danger" onClick={handleDelete}>삭제</AlertDialogAction>
 * ```
 */
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

/**
 * 취소 버튼이다. 클릭 시 아무 동작 없이 모달을 닫는다. 내부적으로 `Button`으로 렌더된다.
 * 취소는 보조 동작이므로 `variant="tertiary"` 사용을 권장한다.
 *
 * @param variant 버튼 스타일. 기본 `'primary'` (취소는 `'tertiary'` 권장)
 * @param size 버튼 크기. 기본 `'md'`
 * @param props Radix `AlertDialog.Cancel` props
 * @example
 * ```tsx
 * <AlertDialogCancel variant="tertiary">취소</AlertDialogCancel>
 * ```
 */
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

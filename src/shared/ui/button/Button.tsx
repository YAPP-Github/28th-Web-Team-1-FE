import { type ComponentProps } from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { Slot } from 'radix-ui'
import { cn } from '@shared/lib/cn'

const buttonVariants = cva(
  cn(
    // Layout
    'group/button inline-flex shrink-0 items-center justify-center',
    // Shape
    'rounded-lg border border-transparent bg-clip-padding',
    // Typography
    'text-text-basic text-headline1 whitespace-nowrap',
    // Interaction
    'transition-all outline-none select-none',
    // Focus visible
    'focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50',
    // Active
    'active:not-aria-[haspopup]:translate-y-px',
    // Disabled
    'disabled:pointer-events-none disabled:text-text-disabled-on',
    // Invalid
    'aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 [&_svg]:pointer-events-none [&_svg]:shrink-0'
  ),
  {
    variants: {
      variant: {
        primary: cn('text-text-bolder-inverse', 'bg-btn-primary-fill', 'hover:bg-btn-primary-fill-hovered', 'active:bg-btn-primary-fill-pressed'),
        secondary: cn(
          'text-text-primary-basic',
          'bg-btn-secondary-fill border-btn-secondary-border',
          'hover:bg-btn-secondary-fill-hovered hover:border-btn-secondary-border-hovered ',
          'active:bg-btn-secondary-fill-pressed active:border-btn-secondary-border-pressed'
        ),
        tertiary: cn('bg-btn-tertiary-fill', 'hover:bg-btn-tertiary-fill-hovered', 'active:bg-btn-tertiary-fill-pressed'),
        outline: cn('border-btn-outline-border', 'hover:border-btn-outline-border-hovered hover:bg-element-gray-lighter', 'active:bg-element-gray-light'),
        text: 'text-text-subtle hover:text-text-basic',
        danger: cn('text-text-danger bg-element-danger-lighter', 'hover:bg-element-danger-light', 'active:bg-element-danger-dark')
      },
      size: {
        xs: cn(
          'h-7.5 gap-1 px-3 py-1.5 text-caption1 rounded-sm',
          "[&_svg:not([class*='size-'])]:size-3 in-data-[slot=button-group]:rounded-lg has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5"
        ),
        sm: cn(
          'h-9 gap-1 px-4 py-2 text-label1 rounded-md',
          "[&_svg:not([class*='size-'])]:size-4 in-data-[slot=button-group]:rounded-lg has-data-[icon=inline-end]:pr-3 has-data-[icon=inline-start]:pl-3 [&_svg:not([class*='size-'])]:size-3.5"
        ),
        md: cn('h-10.5 gap-1.5 px-5 py-2.5 text-headline2', "[&_svg:not([class*='size-'])]:size-4.5 has-data-[icon=inline-end]:pr-3.5 has-data-[icon=inline-start]:pl-3.5"),
        lg: cn('h-12 gap-1.5 px-8 py-3', "[&_svg:not([class*='size-'])]:size-5 has-data-[icon=inline-end]:pr-6.5 has-data-[icon=inline-start]:pl-6.5"),
        xl: cn('h-14 gap-2 px-12 py-4 rounded-xl', "[&_svg:not([class*='size-'])]:size-6 has-data-[icon=inline-end]:pr-10 has-data-[icon=inline-start]:pl-10"),

        'icon-xs': "size-7.5 p-2 rounded-sm [&_svg:not([class*='size-'])]:size-3 in-data-[slot=button-group]:rounded-lg",
        'icon-sm': "size-9 p-2.5 rounded-md [&_svg:not([class*='size-'])]:size-4 in-data-[slot=button-group]:rounded-lg",
        'icon-md': "size-10.5 p-3 [&_svg:not([class*='size-'])]:size-4.5",
        'icon-lg': "size-12 p-3.5 [&_svg:not([class*='size-'])]:size-5",
        'icon-xl': "size-14 p-4 rounded-xl [&_svg:not([class*='size-'])]:size-6"
      }
    },
    compoundVariants: [
      {
        variant: ['primary', 'secondary', 'tertiary'],
        class: 'disabled:bg-btn-disabled-fill disabled:border-btn-disabled-fill'
      },
      {
        variant: 'text',
        class: 'p-0 h-auto rounded-none disabled:text-text-disabled'
      }
    ],
    defaultVariants: {
      variant: 'primary',
      size: 'lg'
    }
  }
)

interface ButtonProps extends ComponentProps<'button'>, VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

/**
 * 디자인 시스템 Button 컴포넌트
 *
 * @example
 * ```tsx
 * // 기본 사용
 * <Button>저장</Button>
 *
 * // variant
 * <Button variant="primary">확인</Button>
 * <Button variant="secondary">취소</Button>
 * <Button variant="tertiary">더보기</Button>
 *
 * // size
 * <Button size="xs">작게</Button>
 * <Button size="lg">크게</Button>
 * <Button size="xl">더 크게</Button>
 *
 * // 아이콘 + 텍스트
 * // 일반 버튼에서는 아이콘에 data-icon="inline-start | inline-end"를 추가하면
 * // 좌우 패딩이 자동으로 보정됩니다.
 * // text variant에서는 padding이 없으므로 data-icon을 추가하지 않습니다.
 * <Button>
 *   <CheckIcon data-icon="inline-start" />
 *   저장
 *   <CheckIcon data-icon="inline-end" />
 * </Button>
 *
 * // asChild (Radix Slot)
 * <Button asChild>
 *   <Link href="/link">링크 버튼</Link>
 * </Button>
 *
 * // icon only
 * <Button size="icon-lg" aria-label="설정">
 *   <SettingsIcon />
 * </Button>
 * ```
 */
export const Button = ({ className, variant = 'primary', size = 'lg', asChild = false, ...props }: ButtonProps) => {
  const COMP = asChild ? Slot.Root : 'button'

  return <COMP data-slot="button" data-variant={variant} data-size={size} className={cn(buttonVariants({ variant, size, className }))} {...props} />
}

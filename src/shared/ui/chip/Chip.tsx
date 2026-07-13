import { cva, type VariantProps } from 'class-variance-authority'
import { Slot } from 'radix-ui'
import { cn } from '@shared/lib/cn'

const chipVariants = cva(
  'group/chip inline-flex w-fit shrink-0 items-center justify-center gap-1 overflow-hidden rounded-xs whitespace-nowrap has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 [&>svg]:pointer-events-none [&>svg]:size-3!',
  {
    variants: {
      variant: {
        tertiary: 'bg-element-gray-lighter text-text-bolder',
        ghost: 'bg-element-white text-text-bolder'
      },
      size: {
        default: 'px-1.5 py-0.5 text-label2',
        sm: 'px-1.5 py-0.5 text-caption1'
      }
    },
    defaultVariants: {
      variant: 'tertiary',
      size: 'default'
    }
  }
)

/**
 * 디자인 시스템 Chip 컴포넌트
 *
 * @example
 * ```tsx
 * // 기본 사용
 * <Chip>태그</Chip>
 *
 * // variant
 * <Chip variant="tertiary">태그</Chip>
 * <Chip variant="ghost">태그</Chip>
 *
 * // size
 * <Chip size="default">태그</Chip>
 * <Chip size="sm">태그</Chip>
 *
 * // asChild (Radix Slot)
 * <Chip asChild>
 *   <a href="/tag">링크 칩</a>
 * </Chip>
 * ```
 */
const Chip = ({ className, variant = 'tertiary', size = 'default', asChild = false, ...props }: React.ComponentProps<'span'> & VariantProps<typeof chipVariants> & { asChild?: boolean }) => {
  const COMP = asChild ? Slot.Root : 'span'

  return <COMP data-slot="chip" data-variant={variant} data-size={size} className={cn(chipVariants({ variant, size }), className)} {...props} />
}

export { Chip, chipVariants }

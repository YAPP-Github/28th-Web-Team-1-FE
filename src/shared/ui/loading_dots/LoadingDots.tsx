'use client'
import { cva, type VariantProps } from 'class-variance-authority'
import { motion } from 'motion/react'
import { cn } from '@shared/lib/cn'

const DOT_DELAY = 0.16
const DURATION = 0.9

const loadingVariants = cva('inline-flex items-center', {
  variants: {
    size: {
      sm: 'gap-1',
      default: 'gap-1.5',
      lg: 'gap-2'
    }
  },
  defaultVariants: {
    size: 'default'
  }
})

const dotVariants = cva('rounded-full bg-element-primary', {
  variants: {
    size: {
      sm: 'size-1',
      default: 'size-1.5',
      lg: 'size-2.5'
    }
  },
  defaultVariants: {
    size: 'default'
  }
})

interface LoadingDotsProps extends React.ComponentProps<'div'>, VariantProps<typeof loadingVariants> {}

/**
 * 점 세 개가 물결처럼 위아래로 흐르는 로딩 인디케이터.
 *
 * @example
 * ```tsx
 * <LoadingDots />
 * <LoadingDots size="lg" />
 * ```
 */
const LoadingDots = ({ className, size = 'default', ...props }: LoadingDotsProps) => {
  return (
    <div role="status" aria-label="로딩 중" className={cn(loadingVariants({ size }), className)} {...props}>
      {[0, 1, 2].map((index) => (
        <motion.span
          key={index}
          className={dotVariants({ size })}
          animate={{ y: [0, -5, 0], opacity: [0.4, 1, 0.4] }}
          transition={{ duration: DURATION, repeat: Infinity, ease: 'easeInOut', delay: index * DOT_DELAY }}
        />
      ))}
    </div>
  )
}

export { LoadingDots }

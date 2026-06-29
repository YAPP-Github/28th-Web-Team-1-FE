import { Heading as RadixHeading, type HeadingProps } from '@radix-ui/themes'
import { cn } from '@shared/lib/cn'
import { typographyVariants } from '../shared'
import type { TypographyVariant } from '../shared'
import type { CustomColor } from '@shared/config'

type RadixWeight = HeadingProps['weight']

type CustomTextProps = {
  variant?: TypographyVariant
  className?: string
  weight?: HeadingProps['weight'] | 'semibold'
  color?: CustomColor
} & Omit<HeadingProps, 'weight' | 'color'>

/**
 * 디자인 시스템 타이포그래피 컴포넌트.
 * Radix UI `<Heading>`를 기반으로 Pretendard 폰트 스타일(variant)을 적용합니다.
 * 색상은 `color` prop에 커스텀 팔레트(`{color}-{shade}`)를 사용합니다.
 *
 * Radix `size`별 font-size (scaling 100% 기준):
 *   size="1" → 12px
 *   size="2" → 14px
 *   size="3" → 16px
 *   size="4" → 18px
 *   size="5" → 20px
 *   size="6" → 24px
 *   size="7" → 28px
 *   size="8" → 35px
 *   size="9" → 60px
 *
 * ## Prop 우선순위
 * `variant` > `weight`, `size` — weight, size와 함께 설정 시 variant가 적용
 *
 * @example
 * ```
 * <Heading variant="body1">본문 텍스트</Heading>
 * <Heading variant="caption1" color="gray-60">회색 캡션</Heading>
 * <Heading size="9" weight="semibold">빨간 semibold 텍스트</Heading>
 * <Heading as="h2" variant="body2">제목</Heading>
 * ```
 */
export const Heading = ({ variant, className, children, weight, color, ...props }: CustomTextProps) => {
  const isSemibold = weight === 'semibold'

  return (
    <RadixHeading
      {...(props as HeadingProps)}
      weight={isSemibold ? undefined : (weight as RadixWeight)}
      style={color ? { color: `var(--color-${color})` } : undefined}
      className={cn(variant && typographyVariants[variant], isSemibold && 'font-semibold', className)}
    >
      {children}
    </RadixHeading>
  )
}

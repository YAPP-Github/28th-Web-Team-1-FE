import { Text as RadixText, type TextProps } from '@radix-ui/themes'
import { cn } from '@shared/lib'
import type { CustomColor } from '@shared/config'

type TypographyVariant =
  | 'display1'
  | 'display2'
  | 'display3'
  | 'title1'
  | 'title2'
  | 'title3'
  | 'heading1'
  | 'heading2'
  | 'headline1'
  | 'headline2'
  | 'body1'
  | 'body2'
  | 'label1'
  | 'label2'
  | 'caption1'
  | 'caption2'

type RadixWeight = TextProps['weight']

type CustomTextProps = {
  variant?: TypographyVariant
  className?: string
  weight?: TextProps['weight'] | 'semibold'
  color?: CustomColor
} & Omit<TextProps, 'weight' | 'color'>

/** variant별 Tailwind 클래스 매핑 */
export const typographyVariants: Record<TypographyVariant, string> = {
  display1: 'font-bold text-[56px] leading-[130%] -tracking-[0.03em]',
  display2: 'font-bold text-[40px] leading-[130%] -tracking-[0.025em]',
  display3: 'font-bold text-[36px] leading-[130%] -tracking-[0.025em]',
  title1: 'font-bold text-[32px] leading-[135%] -tracking-[0.02em]',
  title2: 'font-bold text-[28px] leading-[135%] -tracking-[0.02em]',
  title3: 'font-bold text-[24px] leading-[135%] -tracking-[0.02em]',
  heading1: 'font-semibold text-[22px] leading-[140%] -tracking-[0.01em]',
  heading2: 'font-semibold text-[20px] leading-[140%] -tracking-[0.01em]',
  headline1: 'font-semibold text-[18px] leading-[140%] -tracking-[0.01em]',
  headline2: 'font-semibold text-[17px] leading-[140%] -tracking-[0.01em]',
  body1: 'font-normal text-[16px] leading-[150%] tracking-normal',
  body2: 'font-normal text-[15px] leading-[150%] tracking-normal',
  label1: 'font-semibold text-[14px] leading-[150%] tracking-normal',
  label2: 'font-normal text-[13px] leading-[150%] tracking-normal',
  caption1: 'font-normal text-[12px] leading-[150%] tracking-normal',
  caption2: 'font-normal text-[11px] leading-[150%] tracking-normal'
}

/**
 * 디자인 시스템 타이포그래피 컴포넌트.
 * Radix UI `<Text>`를 기반으로 Pretendard 폰트 스타일(variant)을 적용합니다.
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
 * @example
 * ```
 * <Text variant="body1">본문 텍스트</Text>
 * <Text variant="title1" size="8" weight="bold">큰 제목</Text>
 * <Text variant="caption1" color="gray-60">회색 캡션</Text>
 * <Text variant="body1" color="red-40" weight="semibold">빨간 semibold 텍스트</Text>
 * <Text as="p" variant="body2">단락</Text>
 * ```
 */
export const Text = ({ variant, className, children, weight, color, ...props }: CustomTextProps) => {
  const isSemibold = weight === 'semibold'

  return (
    <RadixText
      {...(props as TextProps)}
      weight={isSemibold ? undefined : (weight as RadixWeight)}
      style={color ? { color: `var(--color-${color})` } : undefined}
      className={cn(variant && typographyVariants[variant], isSemibold && 'font-semibold', className)}
    >
      {children}
    </RadixText>
  )
}

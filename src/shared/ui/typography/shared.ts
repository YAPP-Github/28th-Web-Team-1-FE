import type { CustomColor } from '@shared/config'

export type TypographyVariant =
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

export const typographyVariants: Record<TypographyVariant, string> = {
  display1: 'text-display1',
  display2: 'text-display2',
  display3: 'text-display3',
  title1: 'text-title1',
  title2: 'text-title2',
  title3: 'text-title3',
  heading1: 'text-heading1',
  heading2: 'text-heading2',
  headline1: 'text-headline1',
  headline2: 'text-headline2',
  body1: 'text-body1',
  body2: 'text-body2',
  label1: 'text-label1',
  label2: 'text-label2',
  caption1: 'text-caption1',
  caption2: 'text-caption2'
}

/** Radix 반응형 prop과 같은 형태. */
export type ResponsiveVariant = TypographyVariant | Partial<Record<'initial' | 'xs' | 'sm' | 'md' | 'lg' | 'xl', TypographyVariant>>

/**
 * variant(반응형 객체 포함)를 Tailwind 클래스로 변환한다.
 * 브레이크포인트 접두 클래스는 globals.css의 `@source inline()`으로 미리 생성된다.
 * @param variant 단일 variant 또는 `{ initial, sm, ... }` 객체
 * @example
 * ```ts
 * getVariantClass('title2') // 'text-title2'
 * getVariantClass({ initial: 'heading1', sm: 'title2' }) // 'text-heading1 sm:text-title2'
 * ```
 */
export const getVariantClass = (variant: ResponsiveVariant) =>
  typeof variant === 'string'
    ? typographyVariants[variant]
    : Object.entries(variant)
        .map(([bp, v]) => (bp === 'initial' ? '' : `${bp}:`) + typographyVariants[v])
        .join(' ')

export const TEXT_COLOR_TOKENS = [
  'text-border',
  'text-basic',
  'text-subtle',
  'text-subtler',
  'text-disabled',
  'text-disabled-on',
  'text-bolder-inverse',
  'text-primary-basic',
  'text-primary-bolder',
  'text-error',
  'text-danger',
  'text-bolder'
] as const

export type TextColorToken = (typeof TEXT_COLOR_TOKENS)[number]
export type TextColor = CustomColor | TextColorToken

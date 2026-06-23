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

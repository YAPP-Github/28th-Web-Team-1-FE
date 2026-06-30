interface SpacingProps {
  /**
   * 간격 크기 (단위 : px)
   */
  size: number
  /**
   * 간격의 방향
   * @default 'horizontal'
   */
  orientation?: 'horizontal' | 'vertical'
}

/**
 * 세로, 가로로 간격을 띄울 때 사용되는 컴포넌트 입니다.
 *
 * @param {SpacingProps} props - Component Props
 *
 * @example
 * ```tsx
 * <Spacing size={16} />
 * ```
 */
export const Spacing = ({ size, orientation = 'horizontal' }: SpacingProps) => {
  const isHorizontal = orientation === 'horizontal'

  return (
    <div
      className={`flex-none`}
      style={{
        width: isHorizontal ? undefined : size,
        height: isHorizontal ? size : undefined
      }}
    />
  )
}

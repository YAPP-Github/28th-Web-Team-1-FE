import type { CustomColor } from '@shared/config'

interface DividerProps {
  /**
   * Divider의 높이 크기 입니다. (단위 : px)
   * @default 1
   */
  size?: number
  /**
   * Divider의 색상 입니다.
   * @default 'gray-20'
   */
  color?: CustomColor
  /**
   * 경계의 방향
   * @default 'horizontal'
   */
  orientation?: 'horizontal' | 'vertical'
}
/**
 * 경계를 표시할 때 사용되는 `<Divider />` 컴포넌트 입니다.
 *
 * @param {DividerProps} props - Component Props
 *
 * @example
 * ```tsx
 * <Divider size={16} />
 * ```
 */
export const Divider = ({ size = 1, color = 'gray-20', orientation = 'horizontal' }: DividerProps) => {
  const isHorizontal = orientation === 'horizontal'

  return (
    <div
      className={`flex-none ${isHorizontal ? 'w-full' : 'h-full'}`}
      style={{
        width: isHorizontal ? undefined : size,
        height: isHorizontal ? size : undefined,
        backgroundColor: `var(--color-${color})`
      }}
    />
  )
}

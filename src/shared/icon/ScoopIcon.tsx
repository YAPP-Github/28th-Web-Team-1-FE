import type { ComponentProps } from 'react'

/**
 * 스쿱 심볼 아이콘 컴포넌트이다. `currentColor`를 사용하므로 `color`/`className`으로 색을 지정할 수 있다.
 * @example
 * ```tsx
 * <ScoopIcon size={24} className="text-primary-50" />
 * ```
 */
export const ScoopIcon = ({ size = 24, ...props }: { size?: number } & ComponentProps<'svg'>) => {
  return (
    <svg width={size} height={size} viewBox="0 0 120 26" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path
        opacity="0.9"
        d="M119.058 0L2.94618 0C1.34825 0 0 1.34825 0 2.94618C0 4.54411 1.34825 5.89236 2.94618 5.89236H66.8258C68.973 14.5811 78.1171 25.1909 91.8992 25.1909C107.229 25.1909 118.326 16.5566 119.663 6.91455C119.835 5.20266 120.606 0 119.008 0L119.058 0Z"
        fill="currentColor"
      />
    </svg>
  )
}

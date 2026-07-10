'use client'
import { CircleCheck, CircleX, Loader2Icon, TriangleAlert } from 'lucide-react'
import { useTheme } from 'next-themes'
import { Toaster as Sonner, type ToasterProps } from 'sonner'

/**
 * 디자인 시스템 Toast(Toaster) 컴포넌트
 *
 * sonner의 `Toaster`를 디자인 토큰에 맞게 감싼 래퍼입니다.
 * 앱 루트(예: `layout.tsx`)에 한 번만 마운트해두고, 실제 토스트는
 * sonner의 `toast()` 함수를 호출해서 띄웁니다.
 *
 * 띄울 수 있는 종류 — 종류에 따라 아이콘이 다르게 표시됩니다:
 * - `toast()` 기본(default)
 * - `toast.success()` 성공
 * - `toast.error()` 오류
 * - `toast.warning()` 경고
 * - `toast.loading()` 로딩(스피너)
 *
 * 표시 위치(`position`)는 다음 6가지를 지원합니다 (기본값 `'bottom-right'`):
 * `'top-left'` | `'top-center'` | `'top-right'` | `'bottom-left'` | `'bottom-center'` | `'bottom-right'`
 *
 * @param props - sonner `ToasterProps` (position, duration, richColors 등 그대로 전달)
 *
 * @example
 * ```tsx
 * // 1) 앱 루트에 한 번만 마운트
 * // app/layout.tsx
 * <body>
 *   {children}
 *   <Toast />
 * </body>
 *
 * // 2) 어디서든 toast()로 호출 — 종류별
 * import { toast } from 'sonner'
 *
 * toast('기본 토스트입니다')
 * toast.success('성공했습니다')
 * toast.error('오류가 발생했습니다')
 * toast.warning('주의가 필요합니다')
 * toast.loading('불러오는 중입니다')
 *
 * // 3) 표시 위치 지정
 * <Toast position="top-center" />
 * ```
 */
const Toast = ({ ...props }: ToasterProps) => {
  const { theme = 'system' } = useTheme()

  return (
    <>
      {/* w-fit 토스트는 sonner center 컨테이너(고정 width) 왼쪽에 붙어 치우쳐 보임.
           transform(var(--y) 세로 애니메이션)을 건드리지 않고 좌우 auto 마진으로 컨테이너 내부 중앙 정렬 */}
      <style>{`
        [data-sonner-toast][data-x-position='center'] {
          left: 0;
          right: 0;
          margin-inline: auto;
        }
      `}</style>

      <Sonner
        theme={theme as ToasterProps['theme']}
        className="toaster group"
        icons={{
          warning: <TriangleAlert className="size-4.5" strokeWidth={1.5} />,
          success: <CircleCheck className="size-4.5" strokeWidth={1.5} />,
          error: <CircleX className="size-4.5" strokeWidth={1.5} />,
          loading: <Loader2Icon className="size-4.5 animate-spin" strokeWidth={1.5} />
        }}
        style={{
          fontFamily: 'Pretendard, "Segoe UI Symbol", sans-serif'
        }}
        toastOptions={{
          classNames: {
            toast: 'rounded-full! px-4! py-3! gap-2! w-fit! bg-bg-white! inset-ring!  border-none! inset-ring-border-subtler! shadow-[0_4px_16px_rgba(0,0,0,0.03),0_0_32px_rgba(0,0,0,0.05)]!',
            title: 'text-label1! font-semibold! text-text-border!',
            icon: '!size-4.5 !mx-0 !justify-center [&>svg]:!m-0',
            success: '[&_[data-icon]]:text-icon-success',
            error: '[&_[data-icon]]:text-icon-error',
            warning: '[&_[data-icon]]:text-icon-warning',
            loading: '[&_[data-icon]]:text-black'
          }
        }}
        {...props}
      />
    </>
  )
}

export { Toast }

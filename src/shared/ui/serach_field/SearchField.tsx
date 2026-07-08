'use client'
import { cva, type VariantProps } from 'class-variance-authority'
import { Search } from 'lucide-react'
import { cn } from '@shared/lib/cn'

const searchFieldVariants = cva(
  cn(
    // base
    // TODO : 애니메이션이 정해지면 추후 수정 필요
    'group flex w-full items-center transition-[box-shadow,background-color] duration-150',
    // default
    'bg-element-gray-lighter ring-border-subtle ring-1 ring-inset',
    // hover
    'hover:ring-border-primary hover:bg-element-white hover:shadow-2',
    // focus
    'focus-within:ring-border-primary focus-within:bg-element-white focus-within:shadow-2'
  ),
  {
    variants: {
      size: {
        default: 'pr-4 pl-5 py-3 gap-1',
        sm: 'pr-3 pl-4 py-1.5 gap-1'
      },
      rounded: {
        full: 'rounded-full',
        top: ''
      }
    },
    compoundVariants: [
      { rounded: 'top', size: 'default', class: 'rounded-t-2xl' },
      { rounded: 'top', size: 'sm', class: 'rounded-t-xl' }
    ],
    defaultVariants: {
      size: 'default',
      rounded: 'full'
    }
  }
)

const searchFieldInputVariants = cva('text-text-bolder caret-gray-80 placeholder:text-text-subtler min-w-0 flex-1 bg-transparent outline-none', {
  variants: {
    size: {
      default: 'text-body1 placeholder:text-body1',
      sm: 'text-body2 placeholder:text-label2'
    }
  },
  defaultVariants: {
    size: 'default'
  }
})

const searchFieldButtonVariants = cva('text-icon-gray-light group-focus-within:text-icon-gray flex shrink-0 items-center justify-center [&_svg]:shrink-0', {
  variants: {
    size: {
      default: 'h-8 w-8 [&_svg]:size-5',
      sm: 'h-7 w-7 [&_svg]:size-4'
    }
  },
  defaultVariants: {
    size: 'default'
  }
})

interface SearchFieldProps extends Omit<React.ComponentProps<'input'>, 'size'>, VariantProps<typeof searchFieldVariants> {
  onSubmit?: () => void
}

/**
 * 디자인 시스템 SearchField 컴포넌트
 *
 * 우측에 검색 버튼(돋보기 아이콘)이 있는 둥근 검색 입력 필드입니다.
 * `form`으로 감싸져 있어 입력 후 Enter를 누르거나 검색 버튼을 클릭하면 `onSubmit`이 호출됩니다.
 * hover/focus 시 테두리·배경·그림자가 강조되고, 포커스 상태에서는 아이콘 색이 진해집니다.
 *
 * @param onSubmit - 검색 실행(Enter 또는 버튼 클릭) 시 호출되는 콜백
 * @param rounded - 모서리 형태 (기본 'full') — 'top'은 하단에 드롭다운(추천 검색어 등)이 붙을 때 사용
 * @param size - 크기 (기본 'default') — 'sm'은 좁은 영역(헤더 등)에서 사용하는 작은 사이즈
 *
 * @example
 * ```tsx
 * // 기본 사용
 * <SearchField placeholder="검색어를 입력해주세요" />
 *
 * // 하단에 드롭다운이 붙는 형태 — 위쪽 모서리만 둥글게
 * <SearchField rounded="top" placeholder="검색어를 입력해주세요" />
 *
 * // 작은 사이즈
 * <SearchField size="sm" placeholder="검색어를 입력해주세요" />
 *
 * // 검색 실행 핸들러 — Enter 또는 검색 버튼 클릭 시 호출
 * <SearchField placeholder="검색어를 입력해주세요" onSubmit={() => refetch()} />
 *
 * // 제어 컴포넌트 — 입력값은 value/onChange로 관리
 * <SearchField value={keyword} onChange={(e) => setKeyword(e.target.value)} onSubmit={handleSearch} />
 * ```
 */
const SearchField = ({ className, type, onSubmit, rounded = 'full', size = 'default', ...props }: SearchFieldProps) => {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    onSubmit?.()
  }

  return (
    <form role="search" onSubmit={handleSubmit} className={cn(searchFieldVariants({ size, rounded, className }))}>
      <input type={type} data-slot="input" className={cn(searchFieldInputVariants({ size }))} {...props} />
      <button type="submit" aria-label="검색" className={cn(searchFieldButtonVariants({ size }))}>
        <Search strokeWidth={1.67} />
      </button>
    </form>
  )
}

export { SearchField }

import { Search } from 'lucide-react'
import { cn } from '@shared/lib/cn'

interface SearchFieldProps extends React.ComponentProps<'input'> {
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
 *
 * @example
 * ```tsx
 * // 기본 사용
 * <SearchField placeholder="검색어를 입력해주세요" />
 *
 * // 검색 실행 핸들러 — Enter 또는 검색 버튼 클릭 시 호출
 * <SearchField placeholder="검색어를 입력해주세요" onSubmit={() => refetch()} />
 *
 * // 제어 컴포넌트 — 입력값은 value/onChange로 관리
 * <SearchField value={keyword} onChange={(e) => setKeyword(e.target.value)} onSubmit={handleSearch} />
 * ```
 */
const SearchField = ({ className, type, onSubmit, ...props }: SearchFieldProps) => {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    onSubmit?.()
  }

  return (
    <form
      role="search"
      onSubmit={handleSubmit}
      className={cn(
        // base
        'group flex w-full items-center gap-2 rounded-full px-4 py-3 transition-[box-shadow,background-color] duration-150',
        'bg-bg-gray-subtler',
        // default
        'ring-border-subtle ring-1 ring-inset',
        // hover
        'hover:ring-border-primary hover:bg-white hover:shadow-[0_4px_16px_0_rgba(0,0,0,0.05)]',
        // focus
        'focus-within:ring-border-primary focus-within:bg-white focus-within:shadow-[0_4px_16px_0_rgba(0,0,0,0.05)]',
        className
      )}
    >
      <input
        type={type}
        data-slot="input"
        className={cn(
          'text-headline2 text-text-bolder caret-gray-80 min-w-0 flex-1 bg-transparent font-semibold outline-none',
          'placeholder:text-text-subtler placeholder:text-body1 placeholder:font-normal'
        )}
        {...props}
      />
      <button type="submit" aria-label="검색" className="text-icon-gray-light group-focus-within:text-icon-gray flex h-8 w-8 shrink-0 items-center justify-center">
        <Search size={20} strokeWidth={1.67} />
      </button>
    </form>
  )
}

export { SearchField }

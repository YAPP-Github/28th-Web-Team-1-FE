'use client'
import { useState } from 'react'
import { cn } from '@shared/lib/cn'
import { Heading, Text } from '../typography'

interface TextareaProps extends React.ComponentProps<'textarea'> {
  heading?: string
  description?: string
  error?: boolean
}

/**
 * 디자인 시스템 Textarea 컴포넌트
 *
 * heading(상단 라벨), description(하단 설명), error 상태를 지원합니다.
 * textarea 안쪽 우측 하단에는 항상 `현재/최대` 글자수 카운터가 표시됩니다. (기본 최대 2000자)
 *
 * ### 크기 동작
 * - **너비**: `w-full`로 부모를 채우되, 최소 너비 `min-w-60`(240px)이 보장됩니다.
 *   (flex 등 가변 레이아웃에서 너무 좁아지지 않게 하기 위함)
 * - **높이**: `field-sizing-content`로 입력 내용에 따라 자동으로 늘어납니다(auto-grow).
 *   - 최소 높이 `min-h-30`(120px) 이상으로 시작합니다.
 *   - 최대 높이 `max-h-60`(240px)에 도달하면 더 늘어나지 않고 내부 스크롤됩니다.
 *     (스크롤 구간에서는 크롬 특성상 하단 패딩이 보이지 않을 수 있습니다.)
 * - 위 기본값은 `className`으로 덮어쓸 수 있습니다.
 *   예: `<Textarea className="min-h-40 max-h-100 min-w-80" />`
 *
 * @example
 * ```tsx
 * // 기본 사용 (우측 하단에 "0/2000" 카운터 표시)
 * <Textarea placeholder="내용을 입력해주세요" />
 *
 * // 최대 글자수 지정 (우측 하단에 "0/500" 카운터 표시)
 * <Textarea heading="리뷰" maxLength={500} placeholder="내용을 입력해주세요" />
 *
 * // 크기 커스텀 (최소/최대 높이, 최소 너비 오버라이드)
 * <Textarea className="min-h-40 max-h-100 min-w-80" placeholder="내용을 입력해주세요" />
 *
 * // heading(라벨) + description(설명)
 * <Textarea heading="자기소개" description="200자 이내로 작성해주세요" placeholder="내용을 입력해주세요" />
 *
 * // error 상태 — 테두리가 강조되고 description이 에러 색상으로 표시됩니다
 * <Textarea heading="리뷰" description="최소 10자 이상 입력해주세요" error />
 *
 * // disabled 상태
 * <Textarea heading="메모" defaultValue="readonly content" disabled />
 * ```
 */
const Textarea = ({ className, heading, description, error, maxLength = 2000, onChange, ...props }: TextareaProps) => {
  const [length, setLength] = useState(() => String(props.value ?? props.defaultValue ?? '').length)

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setLength(e.target.value.length)
    onChange?.(e)
  }

  return (
    <div className="flex flex-col gap-2">
      {heading && (
        <Heading variant="headline2" weight="semibold" className="h-5">
          {heading}
        </Heading>
      )}

      <div className="relative">
        <textarea
          maxLength={maxLength}
          onChange={handleChange}
          aria-invalid={error || undefined}
          data-slot="textarea"
          className={cn(
            'field-sizing-content max-h-60 min-h-30 w-full min-w-60 resize-none rounded-lg border p-4 outline-none',
            'text-headline2 caret-gray-80 text-text-bolder bg-white font-semibold',
            'placeholder:text-body1 placeholder:text-text-subtler placeholder:font-normal',
            // TODO : 애니메이션이 정해지면 추후 수정 필요
            'transition-[border-color,background-color] duration-150',
            // default
            'border-border-subtle',
            // hover
            'hover:bg-bg-gray-subtle hover:border-border-subtle hover:text-text-subtle hover:placeholder:text-text-subtler',
            // focus
            'focus-visible:bg-background focus-visible:border-border-primary',
            // disabled
            'disabled:bg-bg-gray-subtle disabled:border-border-subtle disabled:text-text-disabled',
            'disabled:pointer-events-none disabled:cursor-not-allowed',
            // error
            'aria-invalid:border-border-error',
            className
          )}
          {...props}
        />

        <div className="pointer-events-none absolute right-4 bottom-4">
          <Text variant="label2" weight="regular" color={'gray-50'}>
            {length}/{maxLength}
          </Text>
        </div>
      </div>

      {description && (
        <Text variant="label2" weight="regular" color={error ? 'red-50' : 'gray-50'}>
          {description}
        </Text>
      )}
    </div>
  )
}

export { Textarea }

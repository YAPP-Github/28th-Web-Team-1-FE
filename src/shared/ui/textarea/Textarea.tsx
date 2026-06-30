'use client'
import { useState } from 'react'
import { cn } from '@shared/lib/cn'
import { Text } from '../typography'
import { Flex } from '@radix-ui/themes'

interface TextareaProps extends React.ComponentProps<'textarea'> {
  label?: string
  description?: string
  error?: boolean
}

/**
 * 디자인 시스템 Textarea 컴포넌트
 *
 * label(상단 라벨), description(하단 설명), error 상태를 지원합니다.
 * 입력 박스 안쪽 우측 하단에 본문과 12px(gap-3) 간격을 두고 `현재/최대` 글자수 카운터가 표시됩니다. (기본 최대 2000자)
 *
 * ### 크기 동작
 * - **너비**: `w-full`로 부모를 채우되, 최소 너비 `min-w-60`(240px)이 보장됩니다.
 *   (flex 등 가변 레이아웃에서 너무 좁아지지 않게 하기 위함)
 * - **높이**: `field-sizing-content`로 입력 내용에 따라 자동으로 늘어납니다(auto-grow).
 *   - 최소 높이 `min-h-30`(120px) 이상으로 시작합니다.
 *   - 최대 높이 `max-h-60`(240px)에 도달하면 더 늘어나지 않고 본문만 내부 스크롤됩니다.
 *     (글자수 카운터는 스크롤 영역 밖 하단에 고정됩니다.)
 * - 위 기본값은 `className`으로 덮어쓸 수 있습니다.
 *   예: `<Textarea className="min-h-40 max-h-100 min-w-80" />`
 *
 * @example
 * ```tsx
 * // 기본 사용 (우측 하단에 "0/2000" 카운터 표시)
 * <Textarea placeholder="내용을 입력해주세요" />
 *
 * // 최대 글자수 지정 (우측 하단에 "0/500" 카운터 표시)
 * <Textarea label="리뷰" maxLength={500} placeholder="내용을 입력해주세요" />
 *
 * // 크기 커스텀 (최소/최대 높이, 최소 너비 오버라이드)
 * <Textarea className="min-h-40 max-h-100 min-w-80" placeholder="내용을 입력해주세요" />
 *
 * // label(라벨) + description(설명)
 * <Textarea label="자기소개" description="200자 이내로 작성해주세요" placeholder="내용을 입력해주세요" />
 *
 * // error 상태 — 테두리가 강조되고 description이 에러 색상으로 표시됩니다
 * <Textarea label="리뷰" description="최소 10자 이상 입력해주세요" error />
 *
 * // disabled 상태
 * <Textarea label="메모" defaultValue="readonly content" disabled />
 * ```
 */
const Textarea = ({ className, label, description, error, maxLength = 2000, onChange, ...props }: TextareaProps) => {
  const [length, setLength] = useState(() => String(props.value ?? props.defaultValue ?? '').length)

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setLength(e.target.value.length)
    onChange?.(e)
  }

  return (
    <Flex direction="column" gap={'2'}>
      {label && (
        <Text as="label" variant="headline2" weight="semibold" className="h-5">
          {label}
        </Text>
      )}

      <label
        data-slot="textarea"
        className={cn(
          // label로 감싸 박스 어디를 클릭해도 textarea에 포커스되도록 함
          'group flex max-h-60 min-h-30 w-full min-w-60 cursor-text flex-col gap-3 rounded-lg border p-4',
          'bg-element-white transition-[border-color,background-color] duration-150',
          // default
          'border-border-subtle',
          // hover
          'hover:not-focus-within:bg-element-gray-lighter hover:not-focus-within:border-border-subtle',
          // focus
          'focus-within:bg-element-white focus-within:border-border-primary',
          // disabled
          'has-[textarea:disabled]:bg-element-disabled has-[textarea:disabled]:border-border-subtle',
          'has-[textarea:disabled]:pointer-events-none has-[textarea:disabled]:cursor-not-allowed',
          // error
          'has-[textarea[aria-invalid="true"]]:border-border-error'
        )}
      >
        <textarea
          maxLength={maxLength}
          onChange={handleChange}
          aria-invalid={error || undefined}
          className={cn(
            'field-sizing-content min-h-0 w-full flex-1 resize-none overflow-y-auto border-none bg-transparent p-0 outline-none',
            'text-headline2 caret-gray-80 text-text-bolder font-semibold',
            'placeholder:text-body1 placeholder:text-text-subtler placeholder:font-normal',
            // hover
            'group-hover:not-focus:text-text-subtle group-hover:not-focus:placeholder:text-text-subtler',
            // disabled
            'disabled:text-text-disabled disabled:cursor-not-allowed',
            className
          )}
          {...props}
        />

        <Flex justify="end" className="pointer-events-none shrink-0">
          <Text variant="label2" weight="regular" color={'gray-50'}>
            {length}/{maxLength}
          </Text>
        </Flex>
      </label>

      {description && (
        <Text variant="label2" weight="regular" color={error ? 'red-50' : 'gray-50'}>
          {description}
        </Text>
      )}
    </Flex>
  )
}

export { Textarea }

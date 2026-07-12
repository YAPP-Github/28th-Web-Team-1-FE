'use client'
import { useId, useRef, useState } from 'react'
import { Flex } from '@radix-ui/themes'
import { X } from 'lucide-react'
import { cn } from '@shared/lib/cn'
import { Text } from '../typography'

interface InputProps extends React.ComponentProps<'input'> {
  label?: string
  description?: string
  error?: boolean
  clearable?: boolean
}

/**
 * 디자인 시스템 Input 컴포넌트
 *
 * label(상단 라벨), description(하단 설명), error 상태를 지원하며,
 * 값이 있으면 우측에 입력값을 비우는 X(clear) 버튼이 표시됩니다.
 * `value`/`defaultValue` 초기값이 있으면 처음부터 clear 버튼이 노출됩니다.
 * `clearable={false}`를 주면 clear 버튼이 표시되지 않습니다. (기본값: true)
 *
 * @example
 * ```tsx
 * // 기본 사용
 * <Input placeholder="내용을 입력해주세요" />
 *
 * // label(라벨) + description(설명)
 * <Input label="이메일" description="회사 이메일을 입력해주세요" placeholder="example@company.com" />
 *
 * // error 상태 — 테두리가 강조되고 description이 에러 색상으로 표시됩니다
 * <Input label="비밀번호" description="8자 이상 입력해주세요" error />
 *
 * // disabled 상태 — 입력 불가, clear 버튼도 숨겨집니다
 * <Input label="아이디" defaultValue="readonly_user" disabled />
 *
 * // 초기값 — defaultValue가 있으면 처음부터 clear(X) 버튼이 보입니다
 * <Input defaultValue="입력된 값" />
 *
 * // type 지정 + 제어 컴포넌트
 * <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
 *
 * // clear(X) 버튼 숨기기
 * <Input defaultValue="입력된 값" clearable={false} />
 * ```
 */

const Input = ({ className, label, description, error, disabled, onChange, id, clearable = true, ...props }: InputProps) => {
  const generatedId = useId()
  const inputId = id ?? generatedId
  const inputRef = useRef<HTMLInputElement>(null)
  const [hasValue, setHasValue] = useState(() => String(props.value ?? props.defaultValue ?? '').length > 0)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setHasValue(e.target.value.length > 0)
    onChange?.(e)
  }

  const handleClear = () => {
    const input = inputRef.current
    if (!input) return

    const nativeSetter = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value')?.set
    nativeSetter?.call(input, '')
    input.dispatchEvent(new Event('input', { bubbles: true }))
    input.dispatchEvent(new Event('change', { bubbles: true }))
    input.focus()
    setHasValue(false)
  }

  return (
    <Flex direction="column" gap={'2'}>
      <Flex direction="row" justify="between" gap={'2'}>
        {label && (
          <Text variant="label1" as="label" htmlFor={inputId} weight="semibold" className="truncate">
            {label}
          </Text>
        )}
        {description && (
          <Text variant="label2" weight="regular" color={error ? 'red-50' : 'gray-50'} className="shrink-999 truncate">
            {description}
          </Text>
        )}
      </Flex>

      <div className="relative">
        <input
          ref={inputRef}
          id={inputId}
          data-slot="input"
          aria-invalid={error || undefined}
          onChange={handleChange}
          disabled={disabled}
          className={cn(
            // base
            'w-full min-w-0 rounded-lg border px-4 py-3 outline-none',
            'text-body2 caret-gray-80 text-text-basic bg-element-white',
            'placeholder:text-body2 placeholder:text-text-subtler',
            // X(clear) 버튼이 표시될 때 padding-right를 늘려 버튼과 겹치지 않도록 함
            clearable && hasValue && 'pr-10',
            // TODO : 애니메이션이 정해지면 추후 수정 필요
            'transition-[border-color,background-color] duration-150',
            // default
            'border-border-subtle',
            // hover
            'hover:bg-element-gray-lighter hover:border-border-subtle hover:text-text-subtle hover:placeholder:text-text-subtler',
            // focus
            'focus-visible:bg-element-white focus-visible:border-border-primary',
            // disabled
            'disabled:bg-element-disabled disabled:border-border-subtle disabled:text-text-disabled',
            'disabled:pointer-events-none disabled:cursor-not-allowed',
            // error
            'aria-invalid:border-border-error',
            className
          )}
          {...props}
        />
        {clearable && hasValue && (
          <button type="button" onClick={handleClear} disabled={disabled} className="text-icon-gray absolute top-1/2 right-4 -translate-y-1/2 disabled:hidden">
            <X size={20} strokeWidth={1.67} />
          </button>
        )}
      </div>
    </Flex>
  )
}

export { Input }

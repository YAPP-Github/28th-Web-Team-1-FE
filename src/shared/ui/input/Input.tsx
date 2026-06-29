'use client'
import { X } from 'lucide-react'
import { useRef, useState } from 'react'
import { cn } from '@shared/lib'
import { Heading, Text } from '../typography'

interface InputProps extends React.ComponentProps<'input'> {
  heading?: string
  description?: string
  error?: boolean
}
const Input = ({ className, heading, description, type, error, disabled, onChange, ...props }: InputProps) => {
  const inputRef = useRef<HTMLInputElement>(null)
  const [hasValue, setHasValue] = useState(false)

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
    <div className="flex flex-col gap-2">
      {heading && (
        <Heading variant="headline2" weight="semibold" className="h-5">
          {heading}
        </Heading>
      )}

      <div className="relative">
        <input
          ref={inputRef}
          type={type}
          disabled={disabled}
          data-slot="input"
          onChange={handleChange}
          className={cn(
            // base
            'h-12 w-full min-w-0 rounded-lg border px-4 py-4 outline-none',
            'text-headline2 caret-gray-80 text-text-bolder bg-white font-semibold',
            'placeholder:text-body1 placeholder:text-text-subtler placeholder:font-normal',
            'pr-10',
            // TODO : 애니메이션이 정해지면 추후 수정 필요
            'transition-[border-color,background-color] duration-150',
            // default
            'border-border-subtle',
            // hover
            'hover:bg-bg-gray-subtle hover:border-border-subtle hover:text-text-subtle hover:placeholder:text-text-subtler',
            // focus
            'focus-visible:bg-background focus-visible:border-border-primary',
            // disabled
            'disabled:bg-bg-gray-subtler disabled:border-border-subtle disabled:text-text-disabled',
            'disabled:pointer-events-none disabled:cursor-not-allowed',
            // error
            error && 'border-border-error',
            className
          )}
          {...props}
        />
        {hasValue && (
          <button type="button" onClick={handleClear} disabled={disabled} className="text-icon-gray absolute top-1/2 right-4 -translate-y-1/2 disabled:hidden">
            <X size={20} strokeWidth={1.67} />
          </button>
        )}
      </div>

      {description && (
        <Text variant="label2" weight="regular" color={error ? 'red-50' : 'gray-50'}>
          {description}
        </Text>
      )}
    </div>
  )
}

export { Input }

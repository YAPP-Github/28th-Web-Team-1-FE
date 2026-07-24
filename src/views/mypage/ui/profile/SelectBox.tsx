'use client'
import { useState } from 'react'
import { Flex } from '@radix-ui/themes'
import { Check, ChevronDown } from 'lucide-react'
import { cn } from '@shared/lib/cn'
import { Text } from '@shared/ui'
import { Popover, PopoverContent, PopoverTrigger } from '@shared/ui/popover'
import type { SelectOption } from '../../model/profileForm'

interface SelectBoxProps {
  value: string
  onChange: (value: string) => void
  options: readonly SelectOption[]
  label?: string
  placeholder?: string
  /** true면 목록 맨 위에 '선택 안 함'(빈 값) 항목을 넣는다. */
  clearable?: boolean
  clearLabel?: string
  className?: string
}

/**
 * 값 하나를 고르는 드롭다운 위젯. 트리거 박스는 `Input`/`DatePicker`와 같은 스타일이라 나란히 놓으면 정렬이 맞는다.
 * 라벨을 보여주고 코드(`option.value`)를 저장한다. (RHF는 섹션에서 `Controller`로 직접 연결)
 */
export const SelectBox = ({ value, onChange, options, label, placeholder = '선택', clearable = true, clearLabel = '선택 안 함', className }: SelectBoxProps) => {
  const [isOpen, setIsOpen] = useState(false)
  const items = clearable ? [{ value: '', label: clearLabel }, ...options] : options
  const selectedLabel = options.find((option) => option.value === value)?.label

  const handleSelect = (next: string) => {
    onChange(next)
    setIsOpen(false)
  }

  return (
    <Flex direction="column" gap="2" className={className}>
      {label && (
        <Text variant="label1" weight="semibold">
          {label}
        </Text>
      )}
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <button
            type="button"
            className={cn(
              'flex w-full min-w-0 items-center justify-between gap-2 rounded-lg border px-4 py-3 text-left outline-none',
              'text-body2 bg-element-white border-border-subtle transition-[border-color,background-color] duration-150',
              'hover:bg-element-gray-lighter data-[state=open]:border-border-primary'
            )}
          >
            <span className={cn('min-w-0 truncate', selectedLabel ? 'text-text-basic' : 'text-text-subtler')}>{selectedLabel || placeholder}</span>
            <ChevronDown size={18} strokeWidth={1.67} className="text-icon-gray-light shrink-0" />
          </button>
        </PopoverTrigger>
        <PopoverContent align="start" sideOffset={6} className="bg-bg-white shadow-2 w-(--radix-popover-trigger-width) overflow-hidden rounded-lg p-1">
          {items.map((item) => {
            const isSelected = value === item.value
            return (
              <button
                key={item.value || 'none'}
                type="button"
                onClick={() => handleSelect(item.value)}
                className={cn(
                  'flex w-full items-center justify-between gap-2 rounded-md px-3 py-2.5 text-left outline-none',
                  'hover:bg-element-gray-lighter',
                  isSelected ? 'text-text-basic' : 'text-text-subtle hover:text-text-basic'
                )}
              >
                <Text as="span" variant="body2" className="min-w-0 truncate">
                  {item.label}
                </Text>
                {isSelected && <Check size={16} className="text-icon-gray shrink-0" />}
              </button>
            )
          })}
        </PopoverContent>
      </Popover>
    </Flex>
  )
}

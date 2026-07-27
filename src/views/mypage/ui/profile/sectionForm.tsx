'use client'
import { useState } from 'react'
import { Flex } from '@radix-ui/themes'
import { Plus, Trash2, Check, ChevronDown } from 'lucide-react'
import { cn } from '@shared/lib/cn'
import { Button, Divider, Spacing, Text } from '@shared/ui'
import { Popover, PopoverContent, PopoverTrigger } from '@shared/ui/popover'
import type { SelectOption } from '@entities/profile'

/** 섹션 하단 전체폭 저장 버튼. */
export const SaveButton = ({ disabled }: { disabled: boolean }) => (
  <Button type="submit" variant="primary" size="lg" fullWidth disabled={disabled}>
    저장하기
  </Button>
)

/** 반복 섹션 항목 헤더(제목 + 삭제 버튼 + 구분선). */
export const RepeatableItemHeader = ({ title, onRemove }: { title: string; onRemove: () => void }) => (
  <Flex direction="column">
    <Flex justify="between" align="center">
      <Text variant="headline2" color="text-primary-basic">
        {title}
      </Text>
      <Button type="button" variant="tertiary" size="icon-xs" onClick={onRemove} aria-label={`${title} 삭제`}>
        <Trash2 />
      </Button>
    </Flex>
    <Spacing size={12} />
    <Divider color="gray-10" />
    <Spacing size={16} />
  </Flex>
)

/** 반복 섹션 하단 "추가" 링크 버튼. */
export const AddItemButton = ({ label, onClick }: { label: string; onClick: () => void }) => (
  <Flex justify="center">
    <Button type="button" variant="text" size="sm" onClick={onClick}>
      {label}
      <Plus size={16} data-icon="inline-end" />
    </Button>
  </Flex>
)

interface SelectBoxProps {
  value: string
  onChange: (value: string) => void
  options: readonly SelectOption[]
  label?: string
  placeholder?: string
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

'use client'
import { useState } from 'react'
import { Flex } from '@radix-ui/themes'
import { ChevronDown } from 'lucide-react'
import { Text } from '@shared/ui'
import { Input } from '@shared/ui/input'
import { Textarea } from '@shared/ui/textarea'
import { DatePicker } from '@shared/ui/date_picker'
import { MonthRangePicker } from '@shared/ui/month_range_picker'
import { Popover, PopoverTrigger, PopoverContent } from '@shared/ui/popover'
import { formatDate, formatPhoneNumber, parsePeriodInput, dateToApiDate } from '@shared/lib'
import type { ResumeField } from '../model/resumeSections'

interface ResumeFieldInputProps {
  field: ResumeField
  value: string
  onChange: (value: string) => void
}

/**
 * 값은 항상 문자열 하나(`values[field.key]`)로 저장되므로, date/period는 피커 포맷과 저장 포맷 사이를 이 컴포넌트에서 왕복 변환한다.
 */
export const ResumeFieldInput = ({ field, value, onChange }: ResumeFieldInputProps) => {
  if (field.kind === 'date') {
    // 저장 포맷은 API가 주는 그대로(YYYY-MM-DD), DatePicker는 YYYY.MM.DD를 주고받는다.
    const picked = formatDate(value ? value.replace(/\./g, '-') : null, 'YYYY.MM.DD') || null
    return (
      <Flex direction="column" gap="2">
        <Text variant="label1" weight="semibold" color="text-basic">
          {field.label}
        </Text>
        {/* 현재 스키마상 단일 date 필드(수상일/취득일)는 항상 행의 오른쪽 절반에 놓이므로, 팝오버가 모달 밖으로 넘치지 않게 오른쪽 끝에 맞춘다. */}
        <DatePicker value={picked} onChange={(next) => onChange(dateToApiDate(next) ?? '')} placeholder={field.placeholder} align="end" />
      </Flex>
    )
  }

  if (field.kind === 'period') {
    // 저장 포맷은 formatPeriod/parsePeriodInput과 맞춘 "YYYY.MM - YYYY.MM" 한 문자열.
    const { startAt, endAt } = parsePeriodInput(value) ?? { startAt: null, endAt: null }
    const start = formatDate(startAt, 'YYYY.MM') || null
    const end = formatDate(endAt, 'YYYY.MM') || null
    return (
      <MonthRangePicker
        label={field.label}
        start={start}
        end={end}
        onChangeStart={(next) => onChange([next, end].filter(Boolean).join(' - '))}
        onChangeEnd={(next) => onChange([start, next].filter(Boolean).join(' - '))}
      />
    )
  }

  if (field.kind === 'select') {
    return (
      <Flex direction="column" gap="2">
        <Text variant="label1" weight="semibold" color="text-basic">
          {field.label}
        </Text>
        <SelectDropdown value={value} onChange={onChange} options={field.options ?? []} />
      </Flex>
    )
  }

  if (field.kind === 'textarea') {
    return <Textarea label={field.label} maxLength={500} placeholder={field.placeholder} value={value} onChange={(e) => onChange(e.target.value)} />
  }

  if (field.kind === 'phone') {
    return <Input label={field.label} placeholder={field.placeholder} clearable={false} value={value} onChange={(e) => onChange(formatPhoneNumber(e.target.value))} />
  }

  return <Input label={field.label} placeholder={field.placeholder} clearable={false} value={value} onChange={(e) => onChange(e.target.value)} />
}

interface SelectDropdownProps {
  value: string
  onChange: (value: string) => void
  options: readonly string[]
  placeholder?: string
}

/** 값 하나를 고르는 드롭다운. Popover를 트리거+목록 형태로 조립한다(예: 기술 숙련도). */
export const SelectDropdown = ({ value, onChange, options, placeholder = '선택 안 함' }: SelectDropdownProps) => {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          className="border-border-subtle bg-element-white text-body2 hover:bg-element-gray-lighter focus-visible:border-border-primary flex w-full items-center justify-between gap-1 rounded-lg border px-4 py-3 text-left outline-none"
        >
          <Text as="span" variant="body2" color={value ? 'text-basic' : 'text-subtler'}>
            {value || placeholder}
          </Text>
          <ChevronDown size={18} className="text-icon-gray-lighter shrink-0" />
        </button>
      </PopoverTrigger>
      <PopoverContent align="start" sideOffset={8} className="bg-element-gray-lighter shadow-1 w-(--radix-popover-trigger-width) overflow-hidden rounded-lg">
        <Flex direction="column" className="gap-0.5">
          {['', ...options].map((option) => (
            <button
              key={option || 'none'}
              type="button"
              onClick={() => {
                onChange(option)
                setIsOpen(false)
              }}
              className="text-body2 text-text-subtle hover:bg-element-gray-light hover:text-text-basic w-full px-3 py-2.5 text-left outline-none"
            >
              {option || placeholder}
            </button>
          ))}
        </Flex>
      </PopoverContent>
    </Popover>
  )
}

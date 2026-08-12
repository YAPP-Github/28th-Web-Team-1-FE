'use client'
import { useState } from 'react'
import dayjs, { type Dayjs } from 'dayjs'
import { Calendar, ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from '@shared/lib/cn'
import { Text } from '../typography'
import { Popover, PopoverContent, PopoverTrigger } from '../popover'
import { Button, Spacing } from '@shared/ui'

const WEEKDAYS = ['일', '월', '화', '수', '목', '금', '토']

/** `'YYYY.MM.DD'` → dayjs(유효하지 않으면 null). ISO(`YYYY-MM-DD`)로 바꿔 파싱해 별도 플러그인 없이 처리한다. */
const parseDate = (value: string | null) => {
  if (!value) return null
  const parsed = dayjs(value.replace(/\./g, '-'))
  return parsed.isValid() ? parsed : null
}

interface DatePickerProps {
  /** 선택 값. `'YYYY.MM.DD'` 형식(예: `'2025.05.09'`). 미선택은 `null`. */
  value: string | null
  /** 날짜 선택 시 `'YYYY.MM.DD'` 문자열로, '선택 안 함' 시 `null`로 호출된다. */
  onChange: (value: string | null) => void
  placeholder?: string
  disabled?: boolean
  /** 트리거(필드)에 적용할 클래스. */
  className?: string
  /** 달력 팝오버가 트리거의 어느 쪽 끝에 맞춰 열릴지. 필드가 폼/모달 오른쪽 끝에 있으면 `'end'`로 넘겨 밖으로 넘치지 않게 한다. @default 'start' */
  align?: 'start' | 'center' | 'end'
}

/**
 * 연·월·일까지 고르는 피커. radix `Popover` 위에 월 이동(◀ ▶)과 6주 × 7일 그리드를 얹었다.
 * 값/입력은 `'YYYY.MM.DD'` 문자열을 그대로 주고받아 `formatDate(.., 'YYYY.MM.DD')`와 맞물린다.
 * 연·월만 필요하면 `MonthPicker`를 쓴다.
 *
 * @example
 * ```tsx
 * const [date, setDate] = useState<string | null>(null)
 * <DatePicker value={date} onChange={setDate} placeholder="YYYY.MM.DD" />
 * ```
 */
export const DatePicker = ({ value, onChange, placeholder = 'YYYY.MM.DD', disabled, className, align = 'start' }: DatePickerProps) => {
  const selected = parseDate(value)
  const today = dayjs()

  const [isOpen, setIsOpen] = useState(false)
  // 그리드에 보여줄 달(1일 기준). 열 때마다 선택 월(없으면 이번 달)로 맞춘다.
  const [viewMonth, setViewMonth] = useState<Dayjs>(() => (selected ?? today).startOf('month'))

  const handleOpenChange = (next: boolean) => {
    if (next) setViewMonth((parseDate(value) ?? today).startOf('month'))
    setIsOpen(next)
  }

  const selectDay = (day: Dayjs) => {
    onChange(day.format('YYYY.MM.DD'))
    setIsOpen(false)
  }

  // 달력 첫 칸은 보여줄 달 1일이 속한 주의 일요일. 6주(42칸)를 채운다.
  const gridStart = viewMonth.startOf('week')
  const days = Array.from({ length: 42 }, (_, offset) => gridStart.add(offset, 'day'))

  return (
    <Popover open={isOpen} onOpenChange={handleOpenChange}>
      <PopoverTrigger asChild>
        <button
          type={'button'}
          disabled={disabled}
          className={cn(
            'flex w-full items-center justify-between gap-2 rounded-lg border px-4 py-3 text-left outline-none',
            'text-body2 bg-element-white border-border-subtle',
            'transition-[border-color,background-color] duration-150',
            'hover:bg-element-gray-lighter data-[state=open]:border-border-primary',
            'disabled:bg-element-disabled disabled:text-text-disabled disabled:pointer-events-none',
            className
          )}
        >
          <span className={cn('truncate', selected ? 'text-text-basic' : 'text-text-subtler')}>{selected ? selected.format('YYYY.MM.DD') : placeholder}</span>
          <Calendar size={14} className={'text-icon-gray-light shrink-0'} />
        </button>
      </PopoverTrigger>

      <PopoverContent align={align} className={'bg-bg-white rounded-xl p-4'}>
        <div className={'flex items-center justify-between pb-3'}>
          <button
            type={'button'}
            aria-label={'이전 달'}
            onClick={() => setViewMonth((prev) => prev.subtract(1, 'month'))}
            className={'text-icon-gray hover:bg-element-gray-lighter rounded-md p-1 transition-colors'}
          >
            <ChevronLeft size={20} />
          </button>
          <Text variant={'headline2'}>{viewMonth.format('YYYY년 M월')}</Text>
          <button
            type={'button'}
            aria-label={'다음 달'}
            onClick={() => setViewMonth((prev) => prev.add(1, 'month'))}
            className={'text-icon-gray hover:bg-element-gray-lighter rounded-md p-1 transition-colors'}
          >
            <ChevronRight size={20} />
          </button>
        </div>

        <div className={'grid grid-cols-7 gap-1'}>
          {WEEKDAYS.map((weekday) => (
            <div key={weekday} className={'text-caption1 text-text-subtler py-1 text-center'}>
              {weekday}
            </div>
          ))}
          {days.map((day) => {
            const isCurrentMonth = day.isSame(viewMonth, 'month')
            const isSelected = selected?.isSame(day, 'day')
            const isToday = today.isSame(day, 'day')
            return (
              <button
                key={day.format('YYYY-MM-DD')}
                type={'button'}
                onClick={() => selectDay(day)}
                className={cn(
                  'text-body2 aspect-square rounded-md transition-colors',
                  isSelected && 'bg-btn-primary-fill text-text-bolder-inverse',
                  !isSelected && 'hover:bg-element-gray-lighter',
                  !isSelected && !isCurrentMonth && 'text-text-disabled',
                  !isSelected && isCurrentMonth && isToday && 'text-text-primary-basic',
                  !isSelected && isCurrentMonth && !isToday && 'text-text-basic'
                )}
              >
                {day.date()}
              </button>
            )
          })}
        </div>

        <Spacing size={12} />

        <Button
          variant={'text'}
          size={'sm'}
          onClick={() => {
            onChange(null)
            setIsOpen(false)
          }}
          className={'text-text-subtle underline underline-offset-2'}
        >
          날짜 선택 안함
        </Button>
      </PopoverContent>
    </Popover>
  )
}

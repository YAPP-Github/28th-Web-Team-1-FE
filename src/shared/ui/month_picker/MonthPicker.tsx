'use client'
import { useState } from 'react'
import dayjs from 'dayjs'
import { Calendar, ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from '@shared/lib/cn'
import { Text } from '../typography'
import { Popover, PopoverContent, PopoverTrigger } from '../popover'
import { Button, Spacing } from '@shared/ui'

interface MonthPickerProps {
  /** 선택 값. `'YYYY.MM'` 형식(예: `'2025.05'`). 미선택은 `null`. */
  value: string | null
  /** 월 선택 시 `'YYYY.MM'` 문자열로, '선택 안 함' 시 `null`로 호출된다. */
  onChange: (value: string | null) => void
  placeholder?: string
  disabled?: boolean
  /** 트리거(필드)에 적용할 클래스. */
  className?: string
  /** 달력 팝오버가 트리거의 어느 쪽 끝에 맞춰 열릴지. 필드가 폼/모달 오른쪽 끝에 있으면 `'end'`로 넘겨 밖으로 넘치지 않게 한다. @default 'start' */
  align?: 'start' | 'center' | 'end'
  /** 이 달보다 이전 달은 선택 불가. `'YYYY.MM'`. 기간(시작~종료) 짝을 이룰 때 종료 피커에 시작 값을 넘겨 역전을 방지. */
  min?: string | null
  /** 이 달보다 이후 달은 선택 불가. `'YYYY.MM'`. 기간(시작~종료) 짝을 이룰 때 시작 피커에 종료 값을 넘겨 역전을 방지. */
  max?: string | null
}

/** `'YYYY.MM'` → dayjs(유효하지 않으면 null). ISO(`YYYY-MM-01`)로 바꿔 파싱해 별도 플러그인 없이 처리한다. */
const parseMonth = (value: string | null) => {
  if (!value) return null
  const parsed = dayjs(`${value.replace(/\./g, '-')}-01`)
  return parsed.isValid() ? parsed : null
}

/**
 * 연·월만 고르는 피커. radix `Popover` 위에 연도 이동(◀ ▶)과 12개월 그리드를 얹었다.
 * 값/입력은 앱 도메인 포맷인 `'YYYY.MM'` 문자열을 그대로 주고받아 `formatDate`/`parsePeriodInput`와 맞물린다.
 * 기간(시작–종료)처럼 두 개가 필요하면 `MonthPicker`를 두 번 배치해 조합한다.
 *
 * @example
 * ```tsx
 * const [month, setMonth] = useState<string | null>(null)
 * <MonthPicker value={month} onChange={setMonth} placeholder="YYYY.MM" />
 * ```
 */
export const MonthPicker = ({ value, onChange, placeholder = 'YYYY.MM', disabled, className, align = 'start', min, max }: MonthPickerProps) => {
  const selected = parseMonth(value)
  const minMonth = parseMonth(min ?? null)
  const maxMonth = parseMonth(max ?? null)
  const today = dayjs()

  const [isOpen, setIsOpen] = useState(false)
  // 그리드에 보여줄 연도. 열 때마다 선택 연도(없으면 올해)로 맞춘다.
  const [viewYear, setViewYear] = useState(() => (selected ?? today).year())

  const handleOpenChange = (next: boolean) => {
    if (next) setViewYear((parseMonth(value) ?? today).year())
    setIsOpen(next)
  }

  const selectMonth = (monthIndex: number) => {
    onChange(dayjs(`${viewYear}-${String(monthIndex + 1).padStart(2, '0')}-01`).format('YYYY.MM'))
    setIsOpen(false)
  }

  return (
    <Popover open={isOpen} onOpenChange={handleOpenChange}>
      <PopoverTrigger asChild>
        <button
          type="button"
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
          <span className={cn('truncate', selected ? 'text-text-basic' : 'text-text-subtler')}>{selected ? selected.format('YYYY.MM') : placeholder}</span>
          <Calendar size={14} className={'text-icon-gray-light shrink-0'} />
        </button>
      </PopoverTrigger>

      <PopoverContent align={align} className={'bg-bg-white rounded-xl p-4'}>
        <div className={'flex items-center justify-between pb-3'}>
          <button type={'button'} aria-label={'이전 연도'} onClick={() => setViewYear((year) => year - 1)} className={'text-icon-gray hover:bg-element-gray-lighter rounded-md p-1 transition-colors'}>
            <ChevronLeft size={20} />
          </button>
          <Text variant={'headline2'}>{viewYear}년</Text>
          <button type={'button'} aria-label={'다음 연도'} onClick={() => setViewYear((year) => year + 1)} className={'text-icon-gray hover:bg-element-gray-lighter rounded-md p-1 transition-colors'}>
            <ChevronRight size={20} />
          </button>
        </div>

        <div className={'grid grid-cols-3 gap-1'}>
          {Array.from({ length: 12 }, (_, monthIndex) => {
            const cellMonth = dayjs(`${viewYear}-${String(monthIndex + 1).padStart(2, '0')}-01`)
            const isSelected = selected?.year() === viewYear && selected?.month() === monthIndex
            const isCurrent = today.year() === viewYear && today.month() === monthIndex
            const isOutOfRange = (Boolean(minMonth) && cellMonth.isBefore(minMonth, 'month')) || (Boolean(maxMonth) && cellMonth.isAfter(maxMonth, 'month'))
            return (
              <button
                key={monthIndex}
                type={'button'}
                disabled={isOutOfRange}
                onClick={() => selectMonth(monthIndex)}
                className={cn(
                  'text-body2 rounded-md py-2 transition-colors',
                  isSelected && 'bg-btn-primary-fill text-text-bolder-inverse',
                  !isSelected && !isOutOfRange && 'hover:bg-element-gray-lighter',
                  !isSelected && isCurrent && !isOutOfRange && 'text-text-primary-basic',
                  !isSelected && !isCurrent && !isOutOfRange && 'text-text-basic',
                  isOutOfRange && 'text-text-disabled pointer-events-none'
                )}
              >
                {monthIndex + 1}월
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

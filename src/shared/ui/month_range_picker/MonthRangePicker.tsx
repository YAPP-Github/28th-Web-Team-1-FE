'use client'
import { Flex } from '@radix-ui/themes'
import { MonthPicker } from '@shared/ui/month_picker'
import { Text } from '../typography'
import { cn } from '../../lib'

interface MonthRangePickerProps {
  start: string | null
  end: string | null
  onChangeStart: (value: string | null) => void
  onChangeEnd: (value: string | null) => void
  startPlaceholder?: string
  endPlaceholder?: string
  label?: string
  className?: string
  separatorClassName?: string
}

/**
 * 기간(시작–종료 월)을 고르는 `MonthPicker` 쌍. 시작 피커는 종료값을 `max`로, 종료 피커는 시작값을 `min`으로 서로 넘겨받아
 * 역전 선택(시작 > 종료)을 막는다.
 *
 * @example
 * ```tsx
 * const [start, setStart] = useState<string | null>(null)
 * const [end, setEnd] = useState<string | null>(null)
 * <MonthRangePicker start={start} end={end} onChangeStart={setStart} onChangeEnd={setEnd} className="min-w-0 flex-1" />
 * ```
 */
export const MonthRangePicker = ({ start, end, onChangeStart, onChangeEnd, startPlaceholder = '시작', endPlaceholder = '종료', label, className, separatorClassName }: MonthRangePickerProps) => {
  const row = (
    <Flex align="center" gap="2" className={label ? undefined : className}>
      <MonthPicker value={start} onChange={onChangeStart} placeholder={startPlaceholder} className="min-w-0 flex-1" align="start" max={end} />
      <span className={cn('text-text-subtler', separatorClassName)}>-</span>
      <MonthPicker value={end} onChange={onChangeEnd} placeholder={endPlaceholder} className="min-w-0 flex-1" align="end" min={start} />
    </Flex>
  )

  if (!label) return row

  return (
    <Flex direction="column" gap="2" className={className}>
      <Text variant="label1" weight="semibold">
        {label}
      </Text>
      {row}
    </Flex>
  )
}

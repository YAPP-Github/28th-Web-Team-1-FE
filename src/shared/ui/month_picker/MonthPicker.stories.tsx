import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { MonthPicker } from './MonthPicker'

const meta = {
  title: 'Design System/MonthPicker',
  component: MonthPicker,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: [
          '연·월만 고르는 피커입니다.',
          '',
          'radix `Popover` 위에 연도 이동(◀ ▶)과 12개월 그리드를 얹었습니다.',
          "값/입력은 앱 도메인 포맷인 `'YYYY.MM'` 문자열(예: `'2025.05'`)을 그대로 주고받습니다.",
          '',
          '기간(시작–종료)처럼 두 개가 필요하면 `MonthPicker`를 두 번 배치해 조합하세요.'
        ].join('\n')
      }
    }
  }
} satisfies Meta<typeof MonthPicker>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: { value: null, onChange: () => {} },
  parameters: { docs: { description: { story: '단일 연·월 선택' } } },
  render: () => {
    const [value, setValue] = useState<string | null>(null)
    return (
      <div className={'w-60'}>
        <MonthPicker value={value} onChange={setValue} placeholder={'YYYY.MM'} />
      </div>
    )
  }
}

export const WithValue: Story = {
  args: { value: '2025.05', onChange: () => {} },
  parameters: { docs: { description: { story: '초기값이 있는 상태' } } },
  render: () => {
    const [value, setValue] = useState<string | null>('2025.05')
    return (
      <div className={'w-60'}>
        <MonthPicker value={value} onChange={setValue} />
      </div>
    )
  }
}

export const Period: Story = {
  args: { value: null, onChange: () => {} },
  parameters: { docs: { description: { story: 'MonthPicker 두 개로 기간(시작–종료) 구성' } } },
  render: () => {
    const [start, setStart] = useState<string | null>(null)
    const [end, setEnd] = useState<string | null>(null)
    return (
      <div className={'flex w-100 items-center gap-2'}>
        <MonthPicker value={start} onChange={setStart} placeholder={'시작'} />
        <span>-</span>
        <MonthPicker value={end} onChange={setEnd} placeholder={'종료'} />
      </div>
    )
  }
}

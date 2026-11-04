import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { DatePicker } from './DatePicker'

const meta = {
  title: 'Design System/DatePicker',
  component: DatePicker,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: [
          '연·월·일까지 고르는 피커입니다.',
          '',
          'radix `Popover` 위에 월 이동(◀ ▶)과 6주 × 7일 그리드를 얹었습니다.',
          "값/입력은 `'YYYY.MM.DD'` 문자열(예: `'2025.05.09'`)을 그대로 주고받습니다.",
          '',
          '헤더의 `YYYY년 M월`을 누르면 연·월 선택 화면(12개월 그리드, ◀ ▶는 연도 이동)으로 전환됩니다.',
          '월을 고르면 해당 달의 일자 그리드로 돌아오므로, 먼 과거 날짜도 월을 하나씩 넘기지 않고 빠르게 이동할 수 있습니다.',
          '',
          "그리드 아래 '선택 안 함' 버튼으로 값을 비우면 `onChange(null)`이 호출됩니다.",
          '',
          '연·월만 필요하면 `MonthPicker`를 사용하세요.'
        ].join('\n')
      }
    }
  }
} satisfies Meta<typeof DatePicker>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: { value: null, onChange: () => {} },
  parameters: { docs: { description: { story: '단일 날짜 선택' } } },
  render: () => {
    const [value, setValue] = useState<string | null>(null)
    return (
      <div className={'w-60'}>
        <DatePicker value={value} onChange={setValue} placeholder={'YYYY.MM.DD'} />
      </div>
    )
  }
}

export const WithValue: Story = {
  args: { value: '2025.05.09', onChange: () => {} },
  parameters: { docs: { description: { story: '초기값이 있는 상태' } } },
  render: () => {
    const [value, setValue] = useState<string | null>('2025.05.09')
    return (
      <div className={'w-60'}>
        <DatePicker value={value} onChange={setValue} />
      </div>
    )
  }
}

export const FarPastDate: Story = {
  args: { value: '2015.03.17', onChange: () => {} },
  parameters: {
    docs: {
      description: {
        story: '먼 과거 날짜 선택. 헤더(`YYYY년 M월`)를 눌러 연·월 선택 화면으로 전환 → ◀ ▶로 연도 이동 → 월 선택 → 일 선택 순으로 빠르게 이동합니다.'
      }
    }
  },
  render: () => {
    const [value, setValue] = useState<string | null>('2015.03.17')
    return (
      <div className={'w-60'}>
        <DatePicker value={value} onChange={setValue} />
      </div>
    )
  }
}

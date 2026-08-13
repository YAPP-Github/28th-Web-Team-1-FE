import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { MonthRangePicker } from './MonthRangePicker'

const meta = {
  title: 'Design System/MonthRangePicker',
  component: MonthRangePicker,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: [
          '기간(시작–종료 월)을 고르는 `MonthPicker` 쌍입니다.',
          '',
          '시작 피커는 종료값을 `max`로, 종료 피커는 시작값을 `min`으로 서로 넘겨받아 역전 선택(시작 > 종료)을 막습니다.',
          '',
          "값/입력은 `MonthPicker`와 같은 `'YYYY.MM'` 문자열(예: `'2025.05'`)을 그대로 주고받습니다.",
          'API 저장 포맷(`YYYY-MM-DD` 등) 변환은 이 컴포넌트가 아니라 호출부 책임입니다.'
        ].join('\n')
      }
    }
  }
} satisfies Meta<typeof MonthRangePicker>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: { start: null, end: null, onChangeStart: () => {}, onChangeEnd: () => {} },
  parameters: { docs: { description: { story: '빈 기간에서 시작' } } },
  render: () => {
    const [start, setStart] = useState<string | null>(null)
    const [end, setEnd] = useState<string | null>(null)
    return (
      <div className={'w-100'}>
        <MonthRangePicker start={start} end={end} onChangeStart={setStart} onChangeEnd={setEnd} />
      </div>
    )
  }
}

export const RangeRestriction: Story = {
  args: { start: '2024.01', end: '2024.06', onChangeStart: () => {}, onChangeEnd: () => {} },
  parameters: {
    docs: {
      description: {
        story: '시작(2024.01)~종료(2024.06)가 이미 채워진 상태. 시작 피커를 열면 2024.06 이후 달이, 종료 피커를 열면 2024.01 이전 달이 비활성화됩니다.'
      }
    }
  },
  render: () => {
    const [start, setStart] = useState<string | null>('2024.01')
    const [end, setEnd] = useState<string | null>('2024.06')
    return (
      <div className={'w-100'}>
        <MonthRangePicker start={start} end={end} onChangeStart={setStart} onChangeEnd={setEnd} />
      </div>
    )
  }
}

export const WithLabel: Story = {
  args: { start: null, end: null, onChangeStart: () => {}, onChangeEnd: () => {} },
  parameters: { docs: { description: { story: '`label`을 지정하면 라벨+피커 행을 세로로 쌓은 래퍼가 감쌉니다.' } } },
  render: () => {
    const [start, setStart] = useState<string | null>(null)
    const [end, setEnd] = useState<string | null>(null)
    return (
      <div className={'w-100'}>
        <MonthRangePicker label={'기간'} start={start} end={end} onChangeStart={setStart} onChangeEnd={setEnd} />
      </div>
    )
  }
}

export const CustomSeparator: Story = {
  args: { start: null, end: null, onChangeStart: () => {}, onChangeEnd: () => {} },
  parameters: { docs: { description: { story: '`separatorClassName`으로 구분자 색상 변경(예: 마이페이지 프로필 폼)' } } },
  render: () => {
    const [start, setStart] = useState<string | null>(null)
    const [end, setEnd] = useState<string | null>(null)
    return (
      <div className={'w-100'}>
        <MonthRangePicker start={start} end={end} onChangeStart={setStart} onChangeEnd={setEnd} separatorClassName={'text-icon-gray-lighter'} />
      </div>
    )
  }
}

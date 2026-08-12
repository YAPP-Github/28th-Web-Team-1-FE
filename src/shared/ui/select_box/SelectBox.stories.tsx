import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { SelectBox, type SelectBoxOption } from './SelectBox'

const OPTIONS: SelectBoxOption[] = [
  { value: 'BACHELOR', label: '학사' },
  { value: 'MASTER', label: '석사' },
  { value: 'DOCTOR', label: '박사' }
]

const meta = {
  title: 'Design System/SelectBox',
  component: SelectBox,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: [
          '값 하나를 고르는 드롭다운입니다.',
          '',
          '트리거 박스는 `Input`/`DatePicker`와 같은 스타일이라 나란히 놓으면 정렬이 맞습니다.',
          '',
          '옵션은 `label`을 보여주고 `value`(코드)를 저장/전달합니다.',
          '',
          "`clearable`(기본 `true`)이면 목록 맨 위에 '선택 안 함' 항목이 추가되고, 선택 시 `onChange('')`가 호출됩니다."
        ].join('\n')
      }
    }
  }
} satisfies Meta<typeof SelectBox>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: { value: '', onChange: () => {}, options: OPTIONS },
  parameters: { docs: { description: { story: '값이 없는 초기 상태' } } },
  render: () => {
    const [value, setValue] = useState('')
    return (
      <div className={'w-60'}>
        <SelectBox label="학위" placeholder="학사/석사/박사" options={OPTIONS} value={value} onChange={setValue} />
      </div>
    )
  }
}

export const WithValue: Story = {
  args: { value: 'MASTER', onChange: () => {}, options: OPTIONS },
  parameters: { docs: { description: { story: '초기값이 있는 상태' } } },
  render: () => {
    const [value, setValue] = useState('MASTER')
    return (
      <div className={'w-60'}>
        <SelectBox label="학위" options={OPTIONS} value={value} onChange={setValue} />
      </div>
    )
  }
}

export const NotClearable: Story = {
  args: { value: 'BACHELOR', onChange: () => {}, options: OPTIONS, clearable: false },
  parameters: { docs: { description: { story: "`clearable={false}`이면 '선택 안 함' 항목이 목록에 나타나지 않습니다" } } },
  render: () => {
    const [value, setValue] = useState('BACHELOR')
    return (
      <div className={'w-60'}>
        <SelectBox label="학위" options={OPTIONS} value={value} onChange={setValue} clearable={false} />
      </div>
    )
  }
}

export const WithoutLabel: Story = {
  args: { value: '', onChange: () => {}, options: OPTIONS },
  parameters: { docs: { description: { story: 'label 없이 트리거만 렌더링' } } },
  render: () => {
    const [value, setValue] = useState('')
    return (
      <div className={'w-60'}>
        <SelectBox placeholder="학사/석사/박사" options={OPTIONS} value={value} onChange={setValue} />
      </div>
    )
  }
}

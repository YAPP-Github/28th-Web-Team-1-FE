import { Flex } from '@radix-ui/themes'
import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { Checkbox } from './Checkbox'

const meta = {
  title: 'Design System/Checkbox',
  component: Checkbox,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: [
          '디자인 시스템 Checkbox 컴포넌트',
          '',
          '- `defaultChecked`: 초기 체크 상태 (비제어로 사용할 때)',
          '- `checked`: 체크 상태 (제어로 사용할 때, `onCheckedChange`와 함께 사용)',
          '- `onCheckedChange`: 상태가 바뀔 때 호출되는 콜백',
          '- `disabled`: 비활성화 상태',
          '',
          '```tsx',
          '<Checkbox defaultChecked onCheckedChange={(checked) => console.log(checked)} />',
          '```'
        ].join('\n')
      }
    }
  },
  args: {
    defaultChecked: false,
    disabled: false
  },
  argTypes: {
    defaultChecked: {
      control: 'boolean',
      description: '초기 체크 상태 (비제어)'
    },
    disabled: {
      control: 'boolean',
      description: '비활성화 상태'
    }
  }
} satisfies Meta<typeof Checkbox>

export default meta
type Story = StoryObj<typeof meta>

export const AllStates: Story = {
  render: () => (
    <Flex direction={'row'} gap={'6'} align={'center'}>
      <Checkbox />
      <Checkbox defaultChecked />
      <Checkbox disabled />
      <Checkbox defaultChecked disabled />
    </Flex>
  )
}

export const Playground: Story = {
  args: {
    defaultChecked: false,
    disabled: false
  }
}

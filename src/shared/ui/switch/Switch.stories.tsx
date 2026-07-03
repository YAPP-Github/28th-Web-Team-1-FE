import { Flex } from '@radix-ui/themes'
import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { Switch } from './Switch'

const meta = {
  title: 'Design System/Switch',
  component: Switch,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: [
          '디자인 시스템 Switch 컴포넌트',
          '',
          '- `defaultChecked`: 초기 on/off 상태 (비제어로 사용할 때)',
          '- `checked`: on/off 상태 (제어로 사용할 때, `onCheckedChange`와 함께 사용)',
          '- `onCheckedChange`: 상태가 바뀔 때 호출되는 콜백',
          '',
          '```tsx',
          '<Switch defaultChecked onCheckedChange={(checked) => console.log(checked)} />',
          '```'
        ].join('\n')
      }
    }
  },
  args: {
    defaultChecked: false
  },
  argTypes: {
    defaultChecked: {
      control: 'boolean',
      description: '초기 on/off 상태 (비제어)'
    }
  }
} satisfies Meta<typeof Switch>

export default meta
type Story = StoryObj<typeof meta>

export const AllStates: Story = {
  render: () => (
    <Flex direction={'row'} gap={'6'} align={'center'}>
      <Switch />
      <Switch defaultChecked />
    </Flex>
  )
}

export const Playground: Story = {
  args: {
    defaultChecked: false
  }
}

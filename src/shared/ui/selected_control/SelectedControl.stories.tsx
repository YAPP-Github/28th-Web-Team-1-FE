import { Flex } from '@radix-ui/themes'
import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { SelectedControl, SelectedControlItem } from './SelectedControl'

const OPTIONS = ['옵션 1', '옵션 2', '옵션 3']
const OPTIONS_2 = ['옵션 1', '옵션 2']
const OPTIONS_4 = ['옵션 1', '옵션 2', '옵션 3', '옵션 4']
const OPTIONS_5 = ['옵션 1', '옵션 2', '옵션 3', '옵션 4', '옵션 5']

const meta = {
  title: 'Design System/SelectedControl',
  component: SelectedControl,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered'
  },
  args: {
    defaultValue: OPTIONS[0],
    disabled: false
  },
  argTypes: {
    defaultValue: {
      control: 'radio',
      options: OPTIONS
    },
    disabled: {
      control: 'boolean'
    }
  },
  decorators: [
    (Story) => (
      <div style={{ width: 960 }}>
        <Story />
      </div>
    )
  ]
} satisfies Meta<typeof SelectedControl>

export default meta
type Story = StoryObj<typeof meta>

export const AllStates: Story = {
  render: () => (
    <Flex direction={'column'} gap={'8'}>
      <Flex direction={'column'} gap={'4'}>
        <SelectedControl defaultValue="옵션 2" className="w-80">
          {OPTIONS_2.map((option) => (
            <SelectedControlItem key={option} value={option}>
              {option}
            </SelectedControlItem>
          ))}
        </SelectedControl>

        <SelectedControl defaultValue="옵션 2" className="w-80">
          {OPTIONS.map((option) => (
            <SelectedControlItem key={option} value={option}>
              {option}
            </SelectedControlItem>
          ))}
        </SelectedControl>

        <SelectedControl defaultValue="옵션 2" className="w-80">
          {OPTIONS_4.map((option) => (
            <SelectedControlItem key={option} value={option}>
              {option}
            </SelectedControlItem>
          ))}
        </SelectedControl>

        <SelectedControl defaultValue="옵션 2" className="w-80">
          {OPTIONS_5.map((option) => (
            <SelectedControlItem key={option} value={option}>
              {option}
            </SelectedControlItem>
          ))}
        </SelectedControl>
      </Flex>

      <Flex direction={'column'} gap={'4'}>
        <SelectedControl defaultValue="긴 옵션 라벨" className="w-60">
          <SelectedControlItem value="짧은 옵션">짧은 옵션</SelectedControlItem>
          <SelectedControlItem value="긴 옵션 라벨">긴 옵션 라벨</SelectedControlItem>
          <SelectedControlItem value="더 긴 옵션 라벨 텍스트입니다">더 긴 옵션 라벨 텍스트입니다</SelectedControlItem>
        </SelectedControl>

        <SelectedControl defaultValue="긴 옵션 라벨" className="w-80">
          <SelectedControlItem value="짧은 옵션">짧은 옵션</SelectedControlItem>
          <SelectedControlItem value="긴 옵션 라벨">긴 옵션 라벨</SelectedControlItem>
          <SelectedControlItem value="더 긴 옵션 라벨 텍스트입니다">더 긴 옵션 라벨 텍스트입니다</SelectedControlItem>
        </SelectedControl>
      </Flex>
    </Flex>
  )
}

export const Default: Story = {
  render: () => (
    <Flex direction={'column'} gap={'8'}>
      <Flex direction={'column'} gap={'4'}>
        <SelectedControl defaultValue="옵션 2" className="w-80">
          {OPTIONS_2.map((option) => (
            <SelectedControlItem key={option} value={option}>
              {option}
            </SelectedControlItem>
          ))}
        </SelectedControl>

        <SelectedControl defaultValue="옵션 2" className="w-80">
          {OPTIONS_4.map((option) => (
            <SelectedControlItem key={option} value={option}>
              {option}
            </SelectedControlItem>
          ))}
        </SelectedControl>
      </Flex>

      <Flex direction={'column'} gap={'4'}>
        <SelectedControl defaultValue="옵션 2" className="w-80">
          {OPTIONS_5.map((option) => (
            <SelectedControlItem key={option} value={option}>
              {option}
            </SelectedControlItem>
          ))}
        </SelectedControl>

        <SelectedControl defaultValue="옵션 2" className="w-160">
          {OPTIONS.map((option) => (
            <SelectedControlItem key={option} value={option}>
              {option}
            </SelectedControlItem>
          ))}
        </SelectedControl>
      </Flex>
    </Flex>
  )
}

export const Playground: Story = {
  args: {
    defaultValue: OPTIONS[0],
    disabled: false
  },
  render: (args) => (
    <SelectedControl {...args}>
      {OPTIONS.map((option) => (
        <SelectedControlItem key={option} value={option}>
          {option}
        </SelectedControlItem>
      ))}
    </SelectedControl>
  )
}

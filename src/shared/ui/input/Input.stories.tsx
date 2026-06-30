import { Flex } from '@radix-ui/themes'
import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { Input } from './Input'

const meta = {
  title: 'Design System/Input',
  component: Input,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered'
  },
  args: {
    placeholder: '내용을 입력해주세요'
  },
  argTypes: {
    label: {
      control: 'text'
    },
    description: {
      control: 'text'
    },
    placeholder: {
      control: 'text'
    },
    type: {
      control: 'select',
      options: ['text', 'password', 'email', 'number']
    },
    error: {
      control: 'boolean'
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
} satisfies Meta<typeof Input>

export default meta
type Story = StoryObj<typeof meta>

export const AllStates: Story = {
  render: () => (
    <Flex direction={'column'} gap={'8'}>
      <Flex direction={'row'} gap={'4'} wrap={'wrap'}>
        <Input placeholder="내용을 입력해주세요" />
        <Input label="label만" placeholder="내용을 입력해주세요" />
        <Input placeholder="내용을 입력해주세요" description="가이드 메시지" />
        <Input label="label + description" placeholder="내용을 입력해주세요" description="가이드 메시지" />
        <Input label="입력된 상태" placeholder="내용을 입력해주세요" description="가이드 메시지" defaultValue="입력된 값" />
      </Flex>

      <Flex direction={'row'} gap={'4'} wrap={'wrap'}>
        <Input placeholder="내용을 입력해주세요" error />
        <Input label="label만" placeholder="내용을 입력해주세요" error />
        <Input placeholder="내용을 입력해주세요" description="올바른 값을 입력해주세요" error />
        <Input label="label + description" placeholder="내용을 입력해주세요" description="올바른 값을 입력해주세요" error />
        <Input label="입력된 상태" placeholder="내용을 입력해주세요" description="올바른 값을 입력해주세요" error defaultValue="잘못된 값" />
      </Flex>

      <Flex direction={'row'} gap={'4'} wrap={'wrap'}>
        <Input placeholder="내용을 입력해주세요" disabled />
        <Input label="label만" placeholder="내용을 입력해주세요" disabled />
        <Input placeholder="내용을 입력해주세요" description="가이드 메시지" disabled />
        <Input label="label + description" placeholder="내용을 입력해주세요" description="가이드 메시지" disabled />
        <Input label="입력된 상태" placeholder="내용을 입력해주세요" description="가이드 메시지" defaultValue="비활성화된 값" disabled />
      </Flex>
    </Flex>
  )
}

export const Default: Story = {
  render: () => (
    <Flex direction={'column'} gap={'8'} wrap={'wrap'}>
      <Input placeholder="내용을 입력해주세요" />
      <Input label="label만" placeholder="내용을 입력해주세요" />
      <Input placeholder="내용을 입력해주세요" description="가이드 메시지" />
      <Input label="label + description" placeholder="내용을 입력해주세요" description="가이드 메시지" />
      <Input label="입력된 상태" placeholder="내용을 입력해주세요" description="가이드 메시지" defaultValue="입력된 값" />
    </Flex>
  )
}

export const Error: Story = {
  render: () => (
    <Flex direction={'column'} gap={'8'} wrap={'wrap'}>
      <Input placeholder="내용을 입력해주세요" error />
      <Input label="label만" placeholder="내용을 입력해주세요" error />
      <Input placeholder="내용을 입력해주세요" description="올바른 값을 입력해주세요" error />
      <Input label="label + description" placeholder="내용을 입력해주세요" description="올바른 값을 입력해주세요" error />
      <Input label="입력된 상태" placeholder="내용을 입력해주세요" description="올바른 값을 입력해주세요" error defaultValue="잘못된 값" />
    </Flex>
  )
}

export const Disabled: Story = {
  render: () => (
    <Flex direction={'column'} gap={'8'} wrap={'wrap'}>
      <Input placeholder="내용을 입력해주세요" disabled />
      <Input label="label만" placeholder="내용을 입력해주세요" disabled />
      <Input placeholder="내용을 입력해주세요" description="가이드 메시지" disabled />
      <Input label="label + description" placeholder="내용을 입력해주세요" description="가이드 메시지" disabled />
      <Input label="입력된 상태" placeholder="내용을 입력해주세요" description="가이드 메시지" defaultValue="비활성화된 값" disabled />
    </Flex>
  )
}

export const Playground: Story = {
  args: {
    label: '제목',
    description: '도움말 텍스트입니다',
    placeholder: '내용을 입력해주세요',
    error: false,
    disabled: false
  }
}

import { Flex } from '@radix-ui/themes'
import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { Textarea } from './Textarea'

const meta = {
  title: 'Design System/Textarea',
  component: Textarea,
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
} satisfies Meta<typeof Textarea>

export default meta
type Story = StoryObj<typeof meta>

export const AllStates: Story = {
  render: () => (
    <Flex direction={'column'} gap={'8'}>
      <Flex direction={'row'} gap={'4'} wrap={'wrap'}>
        <Textarea placeholder="내용을 입력해주세요" />
        <Textarea label="label만" placeholder="내용을 입력해주세요" />
        <Textarea placeholder="내용을 입력해주세요" description="가이드 메시지" />
        <Textarea label="label + description" placeholder="내용을 입력해주세요" description="가이드 메시지" />
        <Textarea label="입력된 상태" placeholder="내용을 입력해주세요" description="가이드 메시지" defaultValue="입력된 값" />
      </Flex>

      <Flex direction={'row'} gap={'4'} wrap={'wrap'}>
        <Textarea placeholder="내용을 입력해주세요" error />
        <Textarea label="label만" placeholder="내용을 입력해주세요" error />
        <Textarea placeholder="내용을 입력해주세요" description="올바른 값을 입력해주세요" error />
        <Textarea label="label + description" placeholder="내용을 입력해주세요" description="올바른 값을 입력해주세요" error />
        <Textarea label="입력된 상태" placeholder="내용을 입력해주세요" description="올바른 값을 입력해주세요" error defaultValue="잘못된 값" />
      </Flex>

      <Flex direction={'row'} gap={'4'} wrap={'wrap'}>
        <Textarea placeholder="내용을 입력해주세요" disabled />
        <Textarea label="label만" placeholder="내용을 입력해주세요" disabled />
        <Textarea placeholder="내용을 입력해주세요" description="가이드 메시지" disabled />
        <Textarea label="label + description" placeholder="내용을 입력해주세요" description="가이드 메시지" disabled />
        <Textarea label="입력된 상태" placeholder="내용을 입력해주세요" description="가이드 메시지" defaultValue="비활성화된 값" disabled />
      </Flex>
    </Flex>
  )
}

export const Default: Story = {
  render: () => (
    <Flex direction={'column'} gap={'8'} wrap={'wrap'}>
      <Textarea placeholder="내용을 입력해주세요" />
      <Textarea label="label만" placeholder="내용을 입력해주세요" />
      <Textarea placeholder="내용을 입력해주세요" description="가이드 메시지" />
      <Textarea label="label + description" placeholder="내용을 입력해주세요" description="가이드 메시지" />
      <Textarea label="입력된 상태" placeholder="내용을 입력해주세요" description="가이드 메시지" defaultValue="입력된 값" />
    </Flex>
  )
}

export const Error: Story = {
  render: () => (
    <Flex direction={'column'} gap={'8'} wrap={'wrap'}>
      <Textarea placeholder="내용을 입력해주세요" error />
      <Textarea label="label만" placeholder="내용을 입력해주세요" error />
      <Textarea placeholder="내용을 입력해주세요" description="올바른 값을 입력해주세요" error />
      <Textarea label="label + description" placeholder="내용을 입력해주세요" description="올바른 값을 입력해주세요" error />
      <Textarea label="입력된 상태" placeholder="내용을 입력해주세요" description="올바른 값을 입력해주세요" error defaultValue="잘못된 값" />
    </Flex>
  )
}

export const Disabled: Story = {
  render: () => (
    <Flex direction={'column'} gap={'8'} wrap={'wrap'}>
      <Textarea placeholder="내용을 입력해주세요" disabled />
      <Textarea label="label만" placeholder="내용을 입력해주세요" disabled />
      <Textarea placeholder="내용을 입력해주세요" description="가이드 메시지" disabled />
      <Textarea label="label + description" placeholder="내용을 입력해주세요" description="가이드 메시지" disabled />
      <Textarea label="입력된 상태" placeholder="내용을 입력해주세요" description="가이드 메시지" defaultValue="비활성화된 값" disabled />
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

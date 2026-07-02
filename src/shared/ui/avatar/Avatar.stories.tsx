import { Flex } from '@radix-ui/themes'
import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { Avatar } from './Avatar'

const SAMPLE_IMAGE_URL = 'https://i.pravatar.cc/150?u=sample'

const meta = {
  title: 'Design System/Avatar',
  component: Avatar,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered'
  },
  args: {
    imageUrl: undefined
  },
  argTypes: {
    imageUrl: {
      control: 'text'
    },
    className: {
      control: 'text'
    }
  }
} satisfies Meta<typeof Avatar>

export default meta
type Story = StoryObj<typeof meta>

export const AllVariants: Story = {
  render: () => (
    <Flex direction="row" gap="6" align="center">
      <Avatar imageUrl={SAMPLE_IMAGE_URL} />
      <Avatar />
    </Flex>
  )
}

export const WithImage: Story = {
  args: {
    imageUrl: SAMPLE_IMAGE_URL
  }
}

export const Fallback: Story = {
  args: {
    imageUrl: undefined
  }
}

export const Playground: Story = {
  args: {
    imageUrl: SAMPLE_IMAGE_URL
  }
}

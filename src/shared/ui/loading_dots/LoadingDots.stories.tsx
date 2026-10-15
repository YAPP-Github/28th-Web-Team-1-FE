import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { LoadingDots } from './LoadingDots'

const SIZES = ['sm', 'default', 'lg'] as const

const meta = {
  title: 'Design System/LoadingDots',
  component: LoadingDots,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered'
  },
  args: {
    size: 'default'
  },
  argTypes: {
    size: {
      control: 'select',
      options: SIZES
    }
  }
} satisfies Meta<typeof LoadingDots>

export default meta
type Story = StoryObj<typeof meta>

export const Playground: Story = {}

export const AllSizes: Story = {
  render: () => (
    <div className="flex items-center gap-8">
      {SIZES.map((size) => (
        <LoadingDots key={size} size={size} />
      ))}
    </div>
  )
}

import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { ErrorFallback } from './ErrorFallback'

const meta = {
  title: 'Design System/ErrorFallback',
  component: ErrorFallback,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered'
  },
  args: {
    title: '채용공고 입력창을 불러오지 못했어요. 새로고침 후 다시 시도해 주세요.',
    description: undefined,
    className: 'min-h-52 w-100'
  }
} satisfies Meta<typeof ErrorFallback>

export default meta
type Story = StoryObj<typeof meta>

export const OneLine: Story = {
  args: {
    title: '채용공고 입력창을 불러오지 못했어요. 새로고침 후 다시 시도해 주세요.',
    description: undefined
  }
}

export const TwoLine: Story = {
  args: {
    title: '프로젝트 목록을 불러오지 못했어요.',
    description: '잠시 후 다시 시도해주세요.'
  }
}

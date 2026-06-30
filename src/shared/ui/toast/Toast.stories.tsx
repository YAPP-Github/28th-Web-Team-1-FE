import { useState } from 'react'
import { Flex } from '@radix-ui/themes'
import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { toast } from 'sonner'
import { Button } from '../button'
import { Toast } from './Toast'

const POSITIONS = ['top-left', 'top-center', 'top-right', 'bottom-left', 'bottom-center', 'bottom-right'] as const
type Position = (typeof POSITIONS)[number]

const meta = {
  title: 'Design System/Toast',
  component: Toast,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered'
  },
  args: {
    position: 'bottom-right'
  },
  argTypes: {
    position: {
      control: 'select',
      options: POSITIONS
    }
  }
} satisfies Meta<typeof Toast>

export default meta
type Story = StoryObj<typeof meta>

export const AllVariants: Story = {
  render: (args) => (
    <>
      <Flex direction={'row'} gap={'4'} wrap={'wrap'} justify={'center'}>
        <Button variant={'secondary'} onClick={() => toast('기본 토스트입니다')}>
          Default
        </Button>
        <Button variant={'secondary'} onClick={() => toast.success('성공했습니다')}>
          Success
        </Button>
        <Button variant={'secondary'} onClick={() => toast.error('오류가 발생했습니다')}>
          Error
        </Button>
        <Button variant={'secondary'} onClick={() => toast.warning('주의가 필요합니다')}>
          Warning
        </Button>
        <Button variant={'secondary'} onClick={() => toast.loading('불러오는 중입니다')}>
          Loading
        </Button>
      </Flex>
      <Toast {...args} />
    </>
  )
}

export const Position: Story = {
  render: () => {
    const PositionDemo = () => {
      const [position, setPosition] = useState<Position>('bottom-right')
      return (
        <>
          <Flex direction={'row'} gap={'4'} wrap={'wrap'} justify={'center'}>
            {POSITIONS.map((p) => (
              <Button
                key={p}
                variant={'secondary'}
                onClick={() => {
                  setPosition(p)
                  toast.success(`${p} 위치 토스트`)
                }}
              >
                {p}
              </Button>
            ))}
          </Flex>
          <Toast position={position} />
        </>
      )
    }
    return <PositionDemo />
  }
}

export const Playground: Story = {
  render: (args) => (
    <>
      <Button variant={'secondary'} onClick={() => toast.success('토스트를 띄웠습니다')}>
        토스트 띄우기
      </Button>
      <Toast {...args} />
    </>
  )
}

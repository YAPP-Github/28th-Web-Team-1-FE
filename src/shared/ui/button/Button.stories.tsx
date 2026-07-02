import { Flex } from '@radix-ui/themes'
import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { Button } from './Button'
import { Home } from 'lucide-react'

const VARIANTS = ['primary', 'secondary', 'tertiary', 'outline', 'text', 'danger'] as const
const SIZES = ['xs', 'sm', 'md', 'lg', 'xl', 'icon-xs', 'icon-sm', 'icon-md', 'icon-lg', 'icon-xl'] as const

const meta = {
  title: 'Design System/Button',
  component: Button,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered'
  },
  args: {
    children: 'Button',
    variant: 'primary',
    size: 'lg',
    disabled: false
  },
  argTypes: {
    variant: {
      control: 'select',
      options: VARIANTS
    },
    size: {
      control: 'select',
      options: SIZES
    },
    asChild: {
      control: 'boolean'
    },
    disabled: {
      control: 'boolean'
    }
  }
} satisfies Meta<typeof Button>

export default meta
type Story = StoryObj<typeof meta>

const isIconOnly = (size: string) => size.startsWith('icon')

export const AllVariants: Story = {
  render: () => (
    <Flex direction={'column'} align={'center'} gap={'4'}>
      {VARIANTS.map((variant) => (
        <Flex key={variant} direction={'row'} gap={'8'} wrap={'wrap'} justify={'center'}>
          {SIZES.map((size) => (
            <Button key={`${variant}-${size}`} variant={variant} size={size}>
              {isIconOnly(size) ? <Home /> : variant}
            </Button>
          ))}
        </Flex>
      ))}
    </Flex>
  )
}

export const Playground: Story = {
  args: {
    variant: 'primary',
    size: 'lg',
    disabled: false,
    children: 'Click me'
  }
}

export const WithIconEnd: Story = {
  render: () => (
    <Flex direction={'column'} align={'center'} gap={'4'}>
      {SIZES.filter((s) => !s.startsWith('icon')).map((size) => (
        <Button key={size} size={size}>
          Button
          <Home data-icon="inline-end" />
        </Button>
      ))}
    </Flex>
  )
}

export const WithIconStart: Story = {
  render: () => (
    <Flex direction={'column'} align={'center'} gap={'4'}>
      {SIZES.filter((s) => !s.startsWith('icon')).map((size) => (
        <Button key={size} size={size}>
          <Home data-icon="inline-start" />
          Button
        </Button>
      ))}
    </Flex>
  )
}

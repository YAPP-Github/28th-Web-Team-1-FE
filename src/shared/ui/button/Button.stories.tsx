import { Flex } from '@radix-ui/themes'
import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { Button } from './Button'

const VARIANTS = ['default', 'outline', 'secondary', 'ghost', 'destructive', 'link'] as const
const SIZES = ['default', 'xs', 'sm', 'lg', 'icon', 'icon-xs', 'icon-sm', 'icon-lg'] as const

const meta = {
  title: 'Design System/Button',
  component: Button,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered'
  },
  args: {
    children: 'Button',
    variant: 'default',
    size: 'default'
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
    }
  }
} satisfies Meta<typeof Button>

export default meta
type Story = StoryObj<typeof meta>

export const AllVariants: Story = {
  render: () => (
    <Flex direction={'column'} align={'center'} gap={'4'}>
      {VARIANTS.map((variant) => (
        <Flex key={variant} direction={'row'} gap={'8'} wrap={'wrap'} justify={'center'}>
          {SIZES.map((size) => (
            <Button key={`${variant}-${size}`} variant={variant} size={size}>
              {variant}
            </Button>
          ))}
        </Flex>
      ))}
    </Flex>
  )
}

export const Playground: Story = {
  args: {
    variant: 'default',
    size: 'default',
    children: 'Click me'
  }
}

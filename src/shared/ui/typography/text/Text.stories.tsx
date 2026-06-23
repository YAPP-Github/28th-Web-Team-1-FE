import { Flex } from '@radix-ui/themes'
import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { Text } from './Text'
import { typographyVariants } from '../shared'
import { CUSTOM_COLORS } from '@shared/config'

const meta = {
  title: 'Design System/Text',
  component: Text,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered'
  },
  args: {
    children: '디자인 시스템 타이포그래피',
    variant: 'body1'
  },
  argTypes: {
    variant: {
      control: 'select',
      options: Object.keys(typographyVariants)
    },
    size: {
      control: 'select',
      options: ['1', '2', '3', '4', '5', '6', '7', '8', '9']
    },
    weight: {
      control: 'select',
      options: ['regular', 'medium', 'semibold', 'bold']
    },
    color: {
      control: 'select',
      options: CUSTOM_COLORS
    }
  }
} satisfies Meta<typeof Text>

export default meta
type Story = StoryObj<typeof meta>

export const AllVariants: Story = {
  render: () => (
    <Flex direction={'column'} align={'start'} justify={'start'} className="space-y-2">
      {(Object.keys(typographyVariants) as Array<keyof typeof typographyVariants>).map((variant: keyof typeof typographyVariants) => (
        <Text key={variant} variant={variant}>
          {variant}
        </Text>
      ))}
    </Flex>
  )
}

export const Playground: Story = {
  args: {
    variant: 'title1',
    children: 'YAPP-TEXT'
  }
}

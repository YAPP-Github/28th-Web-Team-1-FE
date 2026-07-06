import { Flex } from '@radix-ui/themes'
import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { Tag } from 'lucide-react'
import { Chip } from './Chip'

const VARIANTS = ['tertiary', 'ghost'] as const
const SIZES = ['default', 'sm'] as const

const meta = {
  title: 'Design System/Chip',
  component: Chip,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: [
          '디자인 시스템 Chip 컴포넌트',
          '',
          '- `variant`: 색상 스타일 (`tertiary`: 회색 배경 / `ghost`: 투명 배경, 기본값 `tertiary`)',
          '- `size`: 크기 (`default` | `sm`, 기본값 `default`)',
          '- `asChild`: true면 span 대신 Radix `Slot`을 통해 자식 요소에 스타일과 속성을 위임 (기본값 false)',
          '',
          '```tsx',
          '<Chip variant="ghost" size="sm">태그</Chip>',
          '```'
        ].join('\n')
      }
    }
  },
  args: {
    children: 'Chip',
    variant: 'tertiary',
    size: 'default',
    asChild: false
  },
  argTypes: {
    variant: {
      control: 'select',
      options: VARIANTS,
      description: '칩의 색상 스타일'
    },
    size: {
      control: 'select',
      options: SIZES,
      description: '칩의 크기'
    },
    asChild: {
      control: 'boolean',
      description: 'true면 span 대신 자식 요소로 렌더링 (Radix Slot)'
    }
  }
} satisfies Meta<typeof Chip>

export default meta
type Story = StoryObj<typeof meta>

export const AllVariants: Story = {
  parameters: {
    docs: { description: { story: 'variant(tertiary / ghost) × size(default / sm) 조합을 한 화면에서 확인' } }
  },
  render: () => (
    <Flex direction={'column'} align={'center'} gap={'4'}>
      {VARIANTS.map((variant) => (
        <Flex key={variant} direction={'row'} gap={'4'} align={'center'}>
          {SIZES.map((size) => (
            <Chip key={`${variant}-${size}`} variant={variant} size={size}>
              {variant} / {size}
            </Chip>
          ))}
        </Flex>
      ))}
    </Flex>
  )
}

export const WithIcon: Story = {
  parameters: {
    docs: { description: { story: '아이콘에 `data-icon="inline-start" | "inline-end"`를 추가하면 좌우 패딩이 자동으로 보정됩니다.' } }
  },
  render: () => (
    <Flex direction={'row'} gap={'4'} align={'center'}>
      <Chip>
        <Tag data-icon="inline-start" />
        태그
      </Chip>
      <Chip>
        태그
        <Tag data-icon="inline-end" />
      </Chip>
    </Flex>
  )
}

export const AsChild: Story = {
  parameters: {
    docs: { description: { story: 'asChild로 Chip의 스타일을 a 태그 등 다른 요소에 그대로 적용' } }
  },
  render: () => (
    <Chip asChild>
      <a href="#">링크 칩</a>
    </Chip>
  )
}

export const Playground: Story = {
  args: {
    variant: 'tertiary',
    size: 'default',
    asChild: false,
    children: 'Chip'
  }
}

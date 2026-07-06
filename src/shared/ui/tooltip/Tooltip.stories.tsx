import { Flex } from '@radix-ui/themes'
import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { Button } from '../button'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './Tooltip'

const SIDES = ['top', 'right', 'bottom', 'left'] as const

const meta = {
  title: 'Design System/Tooltip',
  component: TooltipContent,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: [
          '디자인 시스템 Tooltip 컴포넌트',
          '',
          'Radix `Tooltip`을 조합형(composable) 프리미티브로 감싼 컴포넌트로,',
          '`TooltipProvider` 하위에서 `Tooltip` + `TooltipTrigger` + `TooltipContent`를 조합해 사용합니다.',
          '',
          '- `TooltipProvider`의 `delayDuration`: 트리거에 마우스를 올린 후 툴팁이 뜨기까지의 지연 시간(ms, 기본 0)',
          '- `TooltipContent`의 `side`: 트리거 기준 표시 방향 (`top` / `right` / `bottom` / `left`)',
          '- `TooltipContent`의 `sideOffset`: 트리거와의 간격(px, 기본 0)',
          '',
          '```tsx',
          '<TooltipProvider>',
          '  <Tooltip>',
          '    <TooltipTrigger asChild>',
          '      <Button>Hover me</Button>',
          '    </TooltipTrigger>',
          '    <TooltipContent>안내 문구</TooltipContent>',
          '  </Tooltip>',
          '</TooltipProvider>',
          '```'
        ].join('\n')
      }
    }
  },
  args: {
    side: 'top',
    sideOffset: 4
  },
  argTypes: {
    side: {
      control: 'select',
      options: SIDES,
      description: '트리거 기준 표시 방향'
    },
    sideOffset: {
      control: 'number',
      description: '트리거와의 간격 (px)'
    }
  }
} satisfies Meta<typeof TooltipContent>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="secondary">Hover me</Button>
        </TooltipTrigger>
        <TooltipContent>안내 문구예요.</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}

export const Sides: Story = {
  parameters: {
    docs: { description: { story: '표시 방향(top / right / bottom / left)별 예시' } }
  },
  render: () => (
    <TooltipProvider>
      <Flex direction={'row'} gap={'8'} align={'center'}>
        {SIDES.map((side) => (
          <Tooltip key={side}>
            <TooltipTrigger asChild>
              <Button variant="secondary">{side}</Button>
            </TooltipTrigger>
            <TooltipContent side={side}>{side} 방향 툴팁</TooltipContent>
          </Tooltip>
        ))}
      </Flex>
    </TooltipProvider>
  )
}

export const Playground: Story = {
  args: {
    side: 'top',
    sideOffset: 4
  },
  render: (args) => (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="secondary">Hover me</Button>
        </TooltipTrigger>
        <TooltipContent {...args}>안내 문구예요.</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}

import { Check, ChevronDown } from 'lucide-react'
import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { cn } from '@shared/lib/cn'
import { Button } from '../button'
import { Input } from '../input'
import { Text } from '../typography/text'
import { Popover, PopoverAnchor, PopoverContent, PopoverDescription, PopoverHeader, PopoverTitle, PopoverTrigger } from './Popover'

const SIDES = ['top', 'right', 'bottom', 'left'] as const
const ALIGNS = ['start', 'center', 'end'] as const

const meta = {
  title: 'Design System/Popover',
  component: PopoverContent,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: [
          '디자인 시스템 Popover 컴포넌트',
          '',
          'Radix `Popover`를 조합형(composable) 프리미티브로 감싼 컴포넌트로,',
          '`Popover` + `PopoverTrigger` + `PopoverContent`를 조합해 사용합니다.',
          '`PopoverHeader` / `PopoverTitle` / `PopoverDescription`으로 헤더 영역을,',
          '`PopoverAnchor`로 트리거와 별개의 위치 기준을 지정할 수 있습니다.',
          '',
          '`PopoverContent`는 위치·애니메이션·그림자(`shadow-1`)·기본 너비(`w-72`)만 제공하고,',
          '배경색·모서리 반경·패딩(`bg-*` / `rounded-*` / `p-*`)은 의도적으로 포함하지 않습니다.',
          '따라서 사용하는 쪽에서 `className`으로 이 값들을 직접 지정해 스타일을 완성해야 합니다.',
          '`Trigger`로 비제어(uncontrolled)로 열거나 `open`/`onOpenChange`로 제어(controlled)할 수 있습니다.',
          '',
          '- `PopoverContent`의 `side`: 트리거 기준 표시 방향 (`top` / `right` / `bottom` / `left`)',
          '- `PopoverContent`의 `align`: 트리거 기준 정렬 (`start` / `center` / `end`)',
          '- `PopoverContent`의 `sideOffset`: 트리거와의 간격(px, 기본 4)',
          '',
          '```tsx',
          '<Popover>',
          '  <PopoverTrigger asChild>',
          '    <Button>열기</Button>',
          '  </PopoverTrigger>',
          '  <PopoverContent className="bg-white rounded-md p-4">',
          '    내용',
          '  </PopoverContent>',
          '</Popover>',
          '```',
          '',
          '- [shadcn/ui Popover](https://ui.shadcn.com/docs/components/popover) — 구현 기반',
          '- [Radix Popover](https://www.radix-ui.com/primitives/docs/components/popover) — Props·접근성 명세'
        ].join('\n')
      }
    }
  },
  args: {
    side: 'bottom',
    align: 'center',
    sideOffset: 4
  },
  argTypes: {
    side: {
      control: 'select',
      options: SIDES,
      description: '트리거 기준 표시 방향'
    },
    align: {
      control: 'select',
      options: ALIGNS,
      description: '트리거 기준 정렬'
    },
    sideOffset: {
      control: 'number',
      description: '트리거와의 간격 (px)'
    }
  }
} satisfies Meta<typeof PopoverContent>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  parameters: {
    docs: { description: { story: '기본 팝오버 (트리거 + 헤더(제목 + 설명))' } }
  },
  render: () => (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="secondary">팝오버 열기</Button>
      </PopoverTrigger>
      <PopoverContent>
        <PopoverHeader>
          <PopoverTitle>알림</PopoverTitle>
          <PopoverDescription>트리거 아래에 표시되는 팝오버예요.</PopoverDescription>
        </PopoverHeader>
      </PopoverContent>
    </Popover>
  )
}

export const WithForm: Story = {
  parameters: {
    docs: { description: { story: '폼 입력 + 하단 액션 버튼 구성' } }
  },
  render: () => (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="secondary">프로젝트 추가</Button>
      </PopoverTrigger>
      <PopoverContent align="start">
        <PopoverHeader>
          <PopoverTitle>새 프로젝트</PopoverTitle>
          <PopoverDescription>프로젝트 명을 입력해주세요.</PopoverDescription>
        </PopoverHeader>
        <Input placeholder="프로젝트 명" />
        <Button className="self-end">추가</Button>
      </PopoverContent>
    </Popover>
  )
}

export const Sides: Story = {
  parameters: {
    docs: { description: { story: '표시 방향(top / right / bottom / left)별 배치' } }
  },
  render: () => (
    <div className="flex gap-4">
      {SIDES.map((side) => (
        <Popover key={side}>
          <PopoverTrigger asChild>
            <Button variant="secondary">{side}</Button>
          </PopoverTrigger>
          <PopoverContent side={side}>{side} 방향 팝오버</PopoverContent>
        </Popover>
      ))}
    </div>
  )
}

export const WithAnchor: Story = {
  parameters: {
    docs: { description: { story: '`PopoverAnchor`로 트리거와 별개의 위치 기준을 지정' } }
  },
  render: () => (
    <Popover>
      <PopoverAnchor asChild>
        <div className="border-btn-outline-border rounded-md border border-dashed px-6 py-10 text-center text-sm">기준(Anchor) 영역</div>
      </PopoverAnchor>
      <PopoverTrigger asChild>
        <Button variant="secondary" className="mt-4">
          여기를 눌러도 Anchor 기준으로 열려요
        </Button>
      </PopoverTrigger>
      <PopoverContent side="top">트리거가 아닌 Anchor를 기준으로 위치해요.</PopoverContent>
    </Popover>
  )
}

const PROJECTS = ['취업로드맵 서비스', '사이드 프로젝트', '동아리 활동']

export const CustomStyle: Story = {
  parameters: {
    docs: {
      description: {
        story: [
          '실제 프로젝트(`ProjectSelectPopover`)의 스타일을 기반으로 한 프로젝트 선택 팝오버.',
          '`PopoverContent`는 `shadow-1 rounded-sm overflow-hidden`으로 감싸고 패딩은 두지 않으며,',
          '`PopoverHeader` 영역과 리스트 영역이 각자 `bg-*`를 갖도록 구성했습니다.',
          '`PopoverTitle` / `PopoverDescription`은 `Text` 타이포와 시맨틱 색상 토큰으로 커스텀합니다.'
        ].join('\n')
      }
    }
  },
  render: () => {
    const selected = PROJECTS[0]
    return (
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="secondary"
            size="md"
            className={cn(
              'bg-btn-tertiary-fill text-icon-gray border-transparent',
              'data-[state=open]:bg-btn-secondary-fill-pressed data-[state=open]:text-text-primary-bolder data-[state=open]:border-btn-secondary-border-pressed'
            )}
          >
            {selected} <ChevronDown />
          </Button>
        </PopoverTrigger>
        <PopoverContent sideOffset={10} align="start" className="shadow-1 w-60 overflow-hidden rounded-sm">
          <PopoverHeader className="bg-bg-gray-subtler gap-1 px-3 py-2.5">
            <PopoverTitle>
              <Text variant="label1" color="text-basic" weight="semibold">
                프로젝트 선택
              </Text>
            </PopoverTitle>
            <PopoverDescription>
              <Text variant="caption1" color="text-subtler">
                경험을 정리할 프로젝트를 골라주세요.
              </Text>
            </PopoverDescription>
          </PopoverHeader>
          {PROJECTS.map((project) => {
            const isSelected = project === selected
            return (
              <button
                key={project}
                type="button"
                className={cn(
                  'bg-element-gray-lighter hover:bg-element-gray-light hover:text-text-basic flex items-center justify-between px-3 py-2.5 text-start',
                  isSelected ? 'text-text-basic' : 'text-text-subtle'
                )}
              >
                <Text variant="body2">{project}</Text>
                {isSelected && <Check className="text-icon-gray size-4" />}
              </button>
            )
          })}
        </PopoverContent>
      </Popover>
    )
  }
}

export const Playground: Story = {
  args: {
    side: 'bottom',
    align: 'center',
    sideOffset: 4
  },
  render: (args) => (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="secondary">열기</Button>
      </PopoverTrigger>
      <PopoverContent {...args}>
        <PopoverHeader>
          <PopoverTitle>Playground</PopoverTitle>
          <PopoverDescription>side / align / sideOffset를 조절해보세요.</PopoverDescription>
        </PopoverHeader>
      </PopoverContent>
    </Popover>
  )
}

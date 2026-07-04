import { Flex } from '@radix-ui/themes'
import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { SearchField } from './SearchField'

const meta = {
  title: 'Design System/SearchField',
  component: SearchField,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered'
  },
  args: {
    placeholder: '검색어를 입력해주세요'
  },
  argTypes: {
    placeholder: {
      control: 'text'
    },
    type: {
      control: 'select',
      options: ['text', 'search']
    },
    rounded: {
      control: 'radio',
      options: ['full', 'top']
    },
    onSubmit: {
      action: 'submit'
    }
  },
  decorators: [
    (Story) => (
      <div style={{ width: 480 }}>
        <Story />
      </div>
    )
  ]
} satisfies Meta<typeof SearchField>

export default meta
type Story = StoryObj<typeof meta>

export const AllStates: Story = {
  render: () => (
    <Flex direction={'column'} gap={'4'}>
      {/* default */}
      <SearchField placeholder="검색어를 입력해주세요" />
      {/* 입력된 상태 */}
      <SearchField placeholder="검색어를 입력해주세요" defaultValue="검색어" />
      {/* rounded="top" — 하단에 드롭다운이 붙는 형태 */}
      <SearchField placeholder="검색어를 입력해주세요" rounded="top" />
    </Flex>
  )
}

export const Default: Story = {
  args: {
    placeholder: '검색어를 입력해주세요'
  }
}

export const Filled: Story = {
  args: {
    placeholder: '검색어를 입력해주세요',
    defaultValue: '검색어'
  }
}

export const RoundedTop: Story = {
  args: {
    placeholder: '검색어를 입력해주세요',
    rounded: 'top'
  }
}

export const Playground: Story = {
  args: {
    placeholder: '검색어를 입력해주세요'
  }
}

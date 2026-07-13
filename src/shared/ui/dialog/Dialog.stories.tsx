import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { Button } from '../button'
import { Input } from '../input'
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from './Dialog'

const meta = {
  title: 'Design System/Dialog',
  component: DialogContent,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: [
          '디자인 시스템 Dialog(Modal) 컴포넌트',
          '',
          '`Dialog`는 폼 입력·정보 표시 등 일반적인 용도의 모달입니다.',
          'Radix `Dialog`를 조합형(composable) 프리미티브로 감싼 컴포넌트로,',
          '`Trigger`로 비제어(uncontrolled)로 열거나 `open`/`onOpenChange`로 제어(controlled)할 수 있습니다.',
          '',
          '`DialogContent`의 `showCloseButton`(기본 `true`)으로 우상단 X 버튼을,',
          '`DialogFooter`의 `showCloseButton`(기본 `false`)으로 하단 "Close" 버튼을 켤 수 있습니다.',
          '사용자의 확인을 강제하는 알림에는 `AlertDialog`를 사용하세요.',
          '',
          '- [shadcn/ui Dialog](https://ui.shadcn.com/docs/components/dialog) — 구현 기반',
          '- [Radix Dialog](https://www.radix-ui.com/primitives/docs/components/dialog) — Props·접근성 명세'
        ].join('\n')
      }
    }
  }
} satisfies Meta<typeof DialogContent>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  parameters: {
    docs: { description: { story: '기본 모달 (제목 + 설명 + 우상단 닫기 버튼)' } }
  },
  render: () => (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="secondary">모달 열기</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>알림을 확인해주세요</DialogTitle>
          <DialogDescription>변경사항이 성공적으로 저장되었어요.</DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  )
}

export const WithForm: Story = {
  parameters: {
    docs: { description: { story: '폼 입력 + 하단 취소/저장 버튼 구성' } }
  },
  render: () => (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="secondary">프로필 편집</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>프로필 편집</DialogTitle>
          <DialogDescription>변경 후 저장을 눌러주세요.</DialogDescription>
        </DialogHeader>
        <Input placeholder="이름" defaultValue="미리내" />
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">취소</Button>
          </DialogClose>
          <Button onClick={() => console.log('save')}>저장</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export const WithFooterCloseButton: Story = {
  parameters: {
    docs: { description: { story: 'Footer의 `showCloseButton`으로 기본 "Close" 버튼을 렌더' } }
  },
  render: () => (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="secondary">모달 열기</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>이용약관</DialogTitle>
          <DialogDescription>내용을 모두 확인한 뒤 닫아주세요.</DialogDescription>
        </DialogHeader>
        <DialogFooter showCloseButton />
      </DialogContent>
    </Dialog>
  )
}

export const WithoutCloseButton: Story = {
  parameters: {
    docs: { description: { story: 'Content의 `showCloseButton={false}`로 우상단 X 버튼 숨김' } }
  },
  render: () => (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="secondary">모달 열기</Button>
      </DialogTrigger>
      <DialogContent showCloseButton={false}>
        <DialogHeader>
          <DialogTitle>계속 진행할까요?</DialogTitle>
          <DialogDescription>아래 버튼으로만 닫을 수 있어요.</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">취소</Button>
          </DialogClose>
          <DialogClose asChild>
            <Button>확인</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

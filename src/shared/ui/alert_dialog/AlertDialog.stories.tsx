import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { Button } from '../button'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger
} from './AlertDialog'

const meta = {
  title: 'Design System/AlertModal',
  component: AlertDialogContent,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: [
          '디자인 시스템 Input 컴포넌트',
          '',
          '`AlertDialog`(AlertModal)는 사용자의 확인이 필요한 알림 모달입니다.',
          'Radix `AlertDialog`를 조합형(composable) 프리미티브로 감싼 컴포넌트로,',
          '`Trigger`로 비제어(uncontrolled)로 열거나 `open`/`onOpenChange`로 제어(controlled)할 수 있습니다.',
          '',
          '하단 버튼은 `Footer` 안에 `Cancel`·`Action`을 조합해 구성합니다. (취소는 `tertiary`, 삭제 등 파괴적 동작은 `danger` 권장)',
          '',
          '- [shadcn/ui AlertDialog](https://ui.shadcn.com/docs/components/alert-dialog) — 구현 기반',
          '- [Radix AlertDialog](https://www.radix-ui.com/primitives/docs/components/alert-dialog) — Props·접근성 명세'
        ].join('\n')
      }
    }
  }
} satisfies Meta<typeof AlertDialogContent>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  parameters: {
    docs: { description: { story: '여러 구성을 한 화면에서 확인 (취소+확인 / 확인 1개 / 취소+삭제 / 삭제 1개)' } }
  },
  render: () => (
    <div className="flex flex-wrap justify-center gap-3">
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button variant="secondary">취소 + 확인</Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>변경사항을 저장할까요?</AlertDialogTitle>
            <AlertDialogDescription>저장하지 않으면 사라져요.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel variant="tertiary">취소</AlertDialogCancel>
            <AlertDialogAction variant="primary" onClick={() => console.log('confirm')}>
              확인
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button variant="secondary">확인 1개</Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>전송이 완료되었어요.</AlertDialogTitle>
            <AlertDialogDescription>잠시 후 결과를 확인할 수 있어요.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction variant="primary">확인</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button variant="secondary">취소 + 삭제</Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>정말 삭제할까요?</AlertDialogTitle>
            <AlertDialogDescription>되돌릴 수 없어요.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel variant="tertiary">취소</AlertDialogCancel>
            <AlertDialogAction variant="danger" onClick={() => console.log('delete')}>
              삭제
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button variant="secondary">삭제 1개</Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>삭제되었어요.</AlertDialogTitle>
            <AlertDialogDescription>선택한 항목이 삭제되었어요.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction variant="danger" onClick={() => console.log('delete')}>
              삭제
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

export const ConfirmOnly: Story = {
  parameters: {
    docs: { description: { story: '확인 버튼 1개 (primary)' } }
  },
  render: () => (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="secondary">모달 열기</Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>전송이 완료되었어요.</AlertDialogTitle>
          <AlertDialogDescription>잠시 후 결과를 확인할 수 있어요.</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogAction variant="primary">확인</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

export const CancelDelete: Story = {
  parameters: {
    docs: { description: { story: '취소 + 삭제 버튼 (취소는 tertiary, 삭제는 danger)' } }
  },
  render: () => (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="secondary">삭제하기</Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>정말 삭제할까요?</AlertDialogTitle>
          <AlertDialogDescription>되돌릴 수 없어요.</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel variant="tertiary">취소</AlertDialogCancel>
          <AlertDialogAction variant="danger" onClick={() => console.log('delete')}>
            삭제
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

export const DeleteOnly: Story = {
  parameters: {
    docs: { description: { story: '삭제 버튼 1개 (danger)' } }
  },
  render: () => (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="secondary">삭제하기</Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>삭제되었어요.</AlertDialogTitle>
          <AlertDialogDescription>선택한 항목이 삭제되었어요.</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogAction variant="danger" onClick={() => console.log('delete')}>
            삭제
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

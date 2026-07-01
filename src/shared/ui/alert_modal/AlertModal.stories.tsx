import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { Button } from '../button'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from './AlertModal'

const meta = {
  title: 'Design System/AlertModal',
  component: AlertDialogContent,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered'
  }
} satisfies Meta<typeof AlertDialogContent>

export default meta
type Story = StoryObj<typeof meta>

/** 기본 — 여러 구성을 한 화면에서 확인 (버튼 2개 / 1개 / 취소+삭제 / 삭제만) */
export const Default: Story = {
  render: () => (
    <div className="flex flex-wrap justify-center gap-3">
      {/* 취소 + 확인 (버튼 2개) */}
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

      {/* 확인 (버튼 1개) */}
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

      {/* 취소 + 삭제 */}
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
            <AlertDialogAction variant="primary" onClick={() => console.log('delete')}>
              삭제
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* 삭제만 */}
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
            <AlertDialogAction variant="primary" onClick={() => console.log('delete')}>
              삭제
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

/** 기본 — 확인 버튼 1개 */
export const ConfirmOnly: Story = {
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

/** 취소 + 삭제 버튼 (danger Button 도입 전까진 primary로 대체) */
export const CancelDelete: Story = {
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
          <AlertDialogAction variant="primary" onClick={() => console.log('delete')}>
            삭제
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

/** 삭제 버튼 1개 (danger Button 도입 전까진 primary로 대체) */
export const DeleteOnly: Story = {
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
          <AlertDialogAction variant="primary" onClick={() => console.log('delete')}>
            삭제
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

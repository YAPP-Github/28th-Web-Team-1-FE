'use client'
import type { ReactNode } from 'react'
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
} from '@shared/ui/alert_dialog'

interface DeleteItemAlertProps {
  /** 삭제 트리거. `asChild`로 위임되므로 클릭하면 바로 삭제하지 않고 확인 모달을 연다(자체 onClick 불필요). */
  children: ReactNode
  /** '삭제'를 눌러 확인했을 때 실행할 실제 삭제 동작. */
  onConfirm: () => void
  title?: string
  description?: string
}

/**
 * 항목 삭제 전 확인을 받는 모달. 트리거(children)를 누르면 열리고, '삭제'를 눌러야 `onConfirm`이 실행된다.
 * 편집 섹션의 아이템 삭제 버튼을 이 컴포넌트로 감싸 실수 삭제를 막는다.
 */
export const DeleteItemAlert = ({
  children,
  onConfirm,
  title = '해당 항목을 삭제하시겠어요?',
  description = '작성한 세부 내용이 모두 삭제되며,\n삭제된 내용은 복구할 수 없습니다.'
}: DeleteItemAlertProps) => {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>{children}</AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription className={'whitespace-pre-line'}>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel variant="tertiary">취소</AlertDialogCancel>
          <AlertDialogAction variant="danger" onClick={onConfirm}>
            삭제
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

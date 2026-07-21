'use client'
import { ChevronRight } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { useWithdraw } from '@entities/user'
import { Button } from '@shared/ui'
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction
} from '@shared/ui/alert_dialog'

/**
 * 회원탈퇴 버튼. 클릭하면 확인 AlertDialog를 띄우고, 확정 시 계정을 탈퇴 처리한다.
 * @example
 * ```tsx
 * <WithdrawButton />
 * ```
 */
export const WithdrawButton = () => {
  const router = useRouter()
  const { mutate: withdraw } = useWithdraw()

  const onWithdraw = () => {
    withdraw(undefined, {
      onSuccess: () => {
        // TODO : 탈퇴 시 이동할 페이지를 정해야 함. 현재는 로그인 페이지로 이동하도록 설정
        toast.success('계정이 탈퇴되었어요.', { id: 'withdraw-success', position: 'top-center' })
        router.replace('/login')
      },
      onError: () => toast.error('탈퇴에 실패했어요. 다시 시도해 주세요.', { id: 'withdraw-error', position: 'top-center' })
    })
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="text" size="sm">
          탈퇴하기
          <ChevronRight />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>계정을 탈퇴하시겠습니까?</AlertDialogTitle>
          <AlertDialogDescription>
            탈퇴 시 모든 데이터가 영구 삭제되며
            <br />
            복구할 수 없습니다.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel variant="tertiary">취소</AlertDialogCancel>
          <AlertDialogAction variant="danger" onClick={onWithdraw}>
            탈퇴
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

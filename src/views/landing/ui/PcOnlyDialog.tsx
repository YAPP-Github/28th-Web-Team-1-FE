'use client'
import { XIcon } from 'lucide-react'
import { Button, Text } from '@shared/ui'
import { Dialog, DialogClose, DialogContent, DialogHeader } from '@shared/ui/dialog'
import { sendKakaoMessageToMe } from '../lib/kakaoShare'

interface PcOnlyDialogProps {
  isOpen: boolean
  onOpenChange: (isOpen: boolean) => void
}
export const PcOnlyDialog = ({ isOpen, onOpenChange }: PcOnlyDialogProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent showCloseButton={false} className="max-w-[min(361px,calc(100%-2rem))] gap-1 p-5 text-center">
        <div className="flex justify-end">
          <DialogClose asChild>
            <XIcon size={18} className="text-icon-gray-lighter" />
          </DialogClose>
        </div>
        <div className="flex flex-col gap-6">
          <DialogHeader className="gap-2">
            <Text variant="heading2" color="text-basic">
              로그인부터는 PC에서 진행돼요
            </Text>
            <Text variant="label1" color="text-subtler" className="whitespace-pre-line">
              {'카카오톡 나에게 보내기한 뒤,\nPC에서 링크를 열어 이어가보세요'}
            </Text>
          </DialogHeader>
          <Button type="button" variant="text" size="lg" fullWidth className="text-text-basic rounded-lg border-none bg-[#FEE500] py-3 hover:bg-[#FEE500]/90" onClick={sendKakaoMessageToMe}>
            카카오톡 나에게 보내기
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

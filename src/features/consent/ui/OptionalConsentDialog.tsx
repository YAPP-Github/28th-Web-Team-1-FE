'use client'
import { useEffect, useState } from 'react'
import { useMarkConsentSheetShown, useUpdateOptionalConsents } from '@entities/user'
import { Checkbox } from '@shared/ui/checkbox'
import { Button, Text } from '@shared/ui'
import { Dialog, DialogContent, DialogDescription, DialogTitle } from '@shared/ui/dialog'
import { OPTIONAL_CONSENTS, OPTIONAL_INITIAL_CHECKS } from '../model/consents'
import { toast } from 'sonner'

/**
 * 기존 가입자에게 홈에서 한 번 띄우는 선택 동의 시트. 열리는 순간 노출 기록을 남겨 다시 뜨지 않는다.
 * 노출 여부(consentSheetRequired, 인터뷰 모달과의 우선순위)는 호출부가 판단한다.
 */
export const OptionalConsentDialog = () => {
  const [isOpen, setIsOpen] = useState(true)
  const [checked, setChecked] = useState(OPTIONAL_INITIAL_CHECKS)
  const { mutate: markShown } = useMarkConsentSheetShown()
  const { mutate, isPending } = useUpdateOptionalConsents()

  useEffect(() => markShown(), [markShown])

  const handleSave = () =>
    mutate(
      { ...checked, source: 'EXISTING_USER_SHEET' },
      {
        onSuccess: () => {
          setIsOpen(false)
        },
        onError: () => {
          toast.error('일시적인 오류가 생겼어요. 잠시 후 다시 시도해 주세요.')
        }
      }
    )

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent showCloseButton={false} onOpenAutoFocus={(event) => event.preventDefault()} className={'bg-bg-white flex w-102.5 flex-col gap-5 rounded-2xl p-6'}>
        <div className={'flex flex-col gap-1'}>
          <DialogTitle className={'text-heading2 text-text-bolder'}>받아 볼 안내를 골라 주세요</DialogTitle>
          <DialogDescription className={'text-body2 text-text-subtler'}>동의하지 않아도 지금처럼 이용할 수 있어요.</DialogDescription>
        </div>

        <div className={'flex flex-col gap-4'}>
          <div className={'border-border-subtler flex flex-col gap-5 rounded-lg border p-4'}>
            {OPTIONAL_CONSENTS.map((consent) => (
              <div key={consent.type} className={'flex w-full items-start gap-2.5'}>
                <label className={'flex min-w-0 flex-1 cursor-pointer items-start gap-2.5'}>
                  <span className={'flex h-4.5 w-4 shrink-0 items-end'}>
                    <Checkbox checked={checked[consent.field]} onCheckedChange={(value) => setChecked((prev) => ({ ...prev, [consent.field]: value === true }))} />
                  </span>
                  <span className={'flex min-w-0 flex-1 flex-col gap-1'}>
                    <span className={'flex items-center gap-1.5'}>
                      <span className={'text-label1 text-text-subtle font-semibold'}>선택</span>
                      <span className={'text-body2 text-text-basic'}>{consent.title}</span>
                    </span>
                    <Text variant={'caption1'} color={'text-subtler'} className={'whitespace-pre-line'}>
                      {consent.description}
                    </Text>
                  </span>
                </label>
                <a href={consent.url} target={'_blank'} rel={'noopener noreferrer'} className={'text-label2 text-text-subtle shrink-0 underline'}>
                  보기
                </a>
              </div>
            ))}
          </div>
          <div className={'flex gap-2'}>
            <Button variant={'tertiary'} className={'flex-1'} onClick={() => setIsOpen(false)}>
              괜찮아요
            </Button>
            <Button className={'flex-1'} disabled={!OPTIONAL_CONSENTS.some(({ field }) => checked[field]) || isPending} onClick={handleSave}>
              저장하기
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

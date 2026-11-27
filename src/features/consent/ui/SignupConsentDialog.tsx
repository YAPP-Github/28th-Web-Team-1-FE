'use client'
import { useState } from 'react'
import { useAgreeSignupConsents } from '@entities/user'
import { Checkbox } from '@shared/ui/checkbox'
import { Button, Text } from '@shared/ui'
import { Dialog, DialogContent, DialogDescription, DialogTitle } from '@shared/ui/dialog'
import { CONSENTS, INITIAL_CHECKS, REQUIRED_CONSENTS, type ConsentField } from '../model/consents'

const ALL_CHECKED: Record<ConsentField, boolean> = { terms: true, privacy: true, research: true, marketingEmail: true }

// 가입 직후 필수 동의가 없는 유저에게 띄우는 동의 시트.
export const SignupConsentDialog = () => {
  const { mutate, isPending } = useAgreeSignupConsents()
  const [checked, setChecked] = useState(INITIAL_CHECKS)

  const isAllChecked = CONSENTS.every(({ field }) => checked[field])
  const isSubmittable = REQUIRED_CONSENTS.every(({ field }) => checked[field])

  const handleSubmit = () => mutate(checked)

  return (
    <Dialog open>
      <DialogContent
        showCloseButton={false}
        onEscapeKeyDown={(event) => event.preventDefault()}
        onPointerDownOutside={(event) => event.preventDefault()}
        onOpenAutoFocus={(event) => event.preventDefault()}
        className={'bg-bg-white flex w-117.5 flex-col gap-5 rounded-2xl p-6'}
      >
        <div className={'flex flex-col gap-1'}>
          <DialogTitle className={'text-heading2 text-text-bolder'}>시작하기 전에 확인해 주세요</DialogTitle>
          <DialogDescription className={'text-body2 text-text-subtler'}>필수 항목에 동의하면 바로 시작할 수 있어요.</DialogDescription>
        </div>

        <div className={'flex flex-col gap-6'}>
          <div className={'flex flex-col gap-5'}>
            <label className={'bg-bg-gray-subtler flex cursor-pointer items-center justify-between rounded-xl px-4 py-3.5'}>
              <span className={'flex items-center gap-2.5'}>
                <Checkbox checked={isAllChecked} onCheckedChange={(value) => setChecked(value === true ? ALL_CHECKED : INITIAL_CHECKS)} />
                <Text variant={'headline2'} color={'text-bolder'}>
                  전체 동의
                </Text>
              </span>
              <Text variant={'caption1'} color={'text-subtler'}>
                선택 항목 포함
              </Text>
            </label>

            <div className={'flex flex-col gap-5 px-4'}>
              {CONSENTS.map((consent) => (
                <div key={consent.type} className={'flex w-full items-start gap-2.5'}>
                  <label className={'flex min-w-0 flex-1 cursor-pointer items-start gap-2.5'}>
                    <span className={'flex h-4.5 w-4 shrink-0 items-end'}>
                      <Checkbox checked={checked[consent.field]} onCheckedChange={(value) => setChecked((prev) => ({ ...prev, [consent.field]: value === true }))} />
                    </span>
                    <span className={'flex min-w-0 flex-1 flex-col gap-1'}>
                      <span className={'text-body2 flex items-center gap-1.5'}>
                        <span className={consent.isRequired ? 'text-text-primary-basic font-semibold' : 'text-text-subtle font-semibold'}>{consent.isRequired ? '필수' : '선택'}</span>
                        <span className={'text-text-basic'}>{consent.title}</span>
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
          </div>

          <div className={'flex flex-col gap-2'}>
            <Button fullWidth disabled={!isSubmittable || isPending} onClick={handleSubmit}>
              시작하기
            </Button>
            <Text as={'p'} variant={'caption1'} color={'text-subtler'} className={'text-center'}>
              마이페이지에서 언제든 바꿀 수 있어요.
            </Text>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

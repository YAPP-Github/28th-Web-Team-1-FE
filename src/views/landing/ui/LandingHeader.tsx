'use client'
import Link from 'next/link'
import { cn } from '@shared/lib'
import { Button } from '@shared/ui'
import { Logo } from '@shared/icon'
import { usePcOnlyDialog } from '../lib/usePcOnlyDialog'
import { PcOnlyDialog } from './PcOnlyDialog'

export const LandingHeader = () => {
  const { isOpen, setIsOpen, handleClick } = usePcOnlyDialog()

  return (
    <header className="border-border-subtler fixed inset-x-0 top-0 z-50 bg-white py-3 shadow-[0_4px_8px_rgba(0,0,0,0.08)] md:py-8">
      <div className="mx-auto flex max-w-360 items-center justify-between px-4 md:px-8">
        <div className="flex items-center gap-3 md:gap-20">
          <Logo className="text-xl font-extrabold md:text-2xl" />
          <Button
            asChild
            variant="text"
            className={cn(
              'text-text-basic md:text-headline1 hover:text-text-primary-basic relative px-0 text-[13px]',
              "after:bg-text-primary-basic after:absolute after:bottom-0 after:left-0 after:h-[1.5px] after:w-0 after:transition-all after:duration-300 after:content-[''] hover:after:w-full"
            )}
          >
            <Link href="#features">주요기능</Link>
          </Button>
          <Button
            asChild
            variant="text"
            className={cn(
              'text-text-basic md:text-headline1 hover:text-text-primary-basic relative px-0 text-[13px]',
              "after:bg-text-primary-basic after:absolute after:bottom-0 after:left-0 after:h-[1.5px] after:w-0 after:transition-all after:duration-300 after:content-[''] hover:after:w-full"
            )}
          >
            <Link href="https://tally.so/r/zx497a" target="_blank" rel="noopener noreferrer">
              제보
            </Link>
          </Button>
        </div>
        <Button asChild variant="secondary" size="sm" className="md:text-headline2 rounded-lg md:h-10.5 md:gap-1.5 md:px-5 md:py-2.5">
          <Link href="/login" onClick={handleClick}>
            로그인
          </Link>
        </Button>
      </div>
      <PcOnlyDialog isOpen={isOpen} onOpenChange={setIsOpen} />
    </header>
  )
}

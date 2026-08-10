import Link from 'next/link'
import { Button } from '@shared/ui'
import { Logo } from '@shared/icon'

export const LandingHeader = () => {
  return (
    <header className="border-border-subtler fixed inset-x-0 top-0 z-50 bg-white py-3 shadow-[0_4px_8px_rgba(0,0,0,0.08)] md:py-8">
      <div className="mx-auto flex max-w-360 items-center justify-between px-4 md:px-8">
        <div className="flex items-center gap-3 md:gap-20">
          <Logo className="text-xl font-extrabold md:text-2xl" />
          <Button asChild variant="text" className="text-text-basic md:text-headline1 text-[13px]">
            <Link href="#">주요기능</Link>
          </Button>
          <Button asChild variant="text" className="text-text-basic md:text-headline1 text-[13px]">
            <Link href="https://tally.so/r/zx497a" target="_blank" rel="noopener noreferrer">
              제보
            </Link>
          </Button>
        </div>
        <Button asChild variant="secondary" size="sm" className="md:text-headline2 rounded-lg md:h-10.5 md:gap-1.5 md:px-5 md:py-2.5">
          <Link href="/login">로그인</Link>
        </Button>
      </div>
    </header>
  )
}

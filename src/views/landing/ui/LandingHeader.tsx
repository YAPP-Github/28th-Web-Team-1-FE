'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { cn } from '@shared/lib'
import { Button } from '@shared/ui'
import { Logo } from '@shared/icon'
import { useLoginCta } from '../lib/useLoginCta'
import { MobileBlockDialog } from './MobileBlockDialog'

/** @param transparentAtTop 스크롤 맨 위에선 배경 없이 뒤의 히어로 배경이 비치게 한다 (히어로 B안용) */
export const LandingHeader = ({ transparentAtTop = false }: { transparentAtTop?: boolean }) => {
  const { isOpen, setIsOpen, handleClick } = useLoginCta()
  const [isAtTop, setIsAtTop] = useState(true)

  useEffect(() => {
    if (!transparentAtTop) return
    const handleScroll = () => setIsAtTop(window.scrollY === 0)
    handleScroll()
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [transparentAtTop])

  return (
    <header
      className={cn(
        'border-border-subtler fixed inset-x-0 top-0 z-50 py-2 transition-[background-color,box-shadow] duration-300 md:py-8',
        transparentAtTop && isAtTop ? 'bg-transparent' : 'bg-white md:shadow-[0_4px_8px_rgba(0,0,0,0.08)]'
      )}
    >
      <div className="mx-auto flex max-w-360 items-center justify-between px-5 md:px-8">
        <div className="flex items-center gap-6 md:gap-20">
          <Logo className="text-lg font-extrabold md:text-2xl" />
          <Button
            asChild
            variant="text"
            className={cn(
              'text-text-subtle md:text-headline1 hover:text-text-primary-basic text-headline1 relative px-0',
              "after:bg-text-primary-basic after:absolute after:bottom-0 after:left-0 after:h-[1.5px] after:w-0 after:transition-all after:duration-300 after:content-[''] hover:after:w-full"
            )}
          >
            <Link href="#features">주요기능</Link>
          </Button>
          <Button
            asChild
            variant="text"
            className={cn(
              'text-text-subtle md:text-headline1 hover:text-text-primary-basic text-headline1 relative px-0',
              "after:bg-text-primary-basic after:absolute after:bottom-0 after:left-0 after:h-[1.5px] after:w-0 after:transition-all after:duration-300 after:content-[''] hover:after:w-full"
            )}
          >
            <Link href="https://tally.so/r/zx497a" target="_blank" rel="noopener noreferrer">
              제보
            </Link>
          </Button>
        </div>
        <Button variant="secondary" size="sm" className="md:text-headline2 rounded-md px-4 py-2 md:h-10.5 md:gap-1.5 md:rounded-lg md:px-5 md:py-2.5" onClick={handleClick}>
          로그인
        </Button>
      </div>
      <MobileBlockDialog isOpen={isOpen} onOpenChange={setIsOpen} />
    </header>
  )
}

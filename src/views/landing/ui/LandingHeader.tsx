import Link from 'next/link'
import { Button } from '@shared/ui'
import { Logo } from '@shared/icon'

export const LandingHeader = () => {
  return (
    <header className="border-border-subtler fixed inset-x-0 top-0 z-50 flex items-center justify-between bg-white px-16 py-8 shadow-[0_4px_8px_rgba(0,0,0,0.08)]">
      <div className="flex items-center gap-20">
        <Logo className="text-2xl font-extrabold" />
        {/* TODO : 주요기능 섹션 링크 연결 필요 */}
        <Button asChild variant="text" className="text-text-basic">
          <Link href="#">주요기능</Link>
        </Button>
        <Button asChild variant="text" className="text-text-basic">
          <Link href="https://tally.so/r/yPrQ4B" target="_blank" rel="noopener noreferrer">
            제보
          </Link>
        </Button>
      </div>
      <Button asChild variant="secondary" size="md" className="rounded-lg">
        <Link href="/login">로그인</Link>
      </Button>
    </header>
  )
}

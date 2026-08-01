import Link from 'next/link'
import { Button } from '@shared/ui'
import { Logo } from '@shared/icon'

export const LandingHeader = () => {
  return (
    <header className="border-border-subtler flex h-26.5 items-center justify-between border-b">
      <div className="flex items-center gap-9">
        <Logo />
        {/* TODO : 주요기능 섹션 링크 연결 필요 */}
        <Button asChild variant="text" size="md">
          <Link href="#">주요기능</Link>
        </Button>
        {/* TODO : 제보 링크 연결 필요 */}
        <Button asChild variant="text" size="md">
          <Link href="#">제보</Link>
        </Button>
      </div>
      {/* TODO : 로그인 라우트 연결 필요 */}
      <Button asChild variant="outline" size="md" className="rounded-full">
        <Link href="/login">로그인</Link>
      </Button>
    </header>
  )
}

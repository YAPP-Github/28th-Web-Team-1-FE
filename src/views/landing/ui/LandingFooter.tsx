import Link from 'next/link'
import { Button } from '@shared/ui'
import { Logo } from '@shared/icon'

export const LandingFooter = () => {
  return (
    <footer className="border-border-subtler flex h-23.75 items-center gap-8 border-t">
      <Logo />
      {/* TODO : 이용약관 링크 연결 필요 */}
      <Button asChild variant="text" size="sm">
        <Link href="#">이용약관</Link>
      </Button>
      {/* TODO : 개인정보 처리방침 링크 연결 필요 */}
      <Button asChild variant="text" size="sm">
        <Link href="#">개인정보 처리방침</Link>
      </Button>
    </footer>
  )
}

import Link from 'next/link'
import { Button } from '@shared/ui'
import { Logo } from '@shared/icon'

export const LandingFooter = () => {
  return (
    <footer className="flex flex-wrap items-center gap-4 py-8 md:gap-20">
      <Logo className="text-xl font-extrabold md:text-2xl" />
      <Button asChild variant="text" className="text-text-basic md:text-heading1 text-[13px]">
        <Link href="https://available-snow-c5b.notion.site/3ac0173187fb80b583f4d497f1721bcc?source=copy_link" target="_blank" rel="noopener noreferrer">
          이용약관
        </Link>
      </Button>
      <Button asChild variant="text" className="text-text-basic md:text-heading1 text-[13px]">
        <Link href="https://available-snow-c5b.notion.site/3ac0173187fb80a3af84fbb6bb20f150?source=copy_link" target="_blank" rel="noopener noreferrer">
          개인정보 처리방침
        </Link>
      </Button>
    </footer>
  )
}

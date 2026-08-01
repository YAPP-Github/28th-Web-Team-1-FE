import Link from 'next/link'
import { cn } from '../lib/cn'

export const Logo = ({ className }: { className?: string }) => {
  return (
    <Link href="/home" className={cn(`font-elms rounded-xs px-1 py-0.5 text-xl font-bold tracking-[-0.02em]`, className)}>
      SCOOP
    </Link>
  )
}

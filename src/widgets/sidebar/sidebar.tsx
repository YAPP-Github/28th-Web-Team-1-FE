'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { type LucideIcon, Home, Layers, PanelLeft, PencilLineIcon } from 'lucide-react'
import { cn } from '@shared/lib/cn'
import { Divider, Heading, Spacing, Text } from '@shared/ui'
import { UserProfile, UserAvatar } from '@entities/user'

export const Sidebar = () => {
  const [isOpen, setIsOpen] = useState<boolean>(true)

  return (
    <aside className={cn('vh-100 bg-bg-gray-subtler flex flex-col px-4 py-5', 'transition-all duration-300 ease-in-out', isOpen ? 'w-55' : 'w-19')}>
      <header className={cn('flex h-10', isOpen ? 'justify-between' : 'justify-center')}>
        {isOpen && (
          <Heading size={'6'} weight={'bold'} className={cn('border-border-subtle overflow-hidden rounded-sm border px-2 py-1 whitespace-nowrap')}>
            Scoop
          </Heading>
        )}
        <button
          className={'bg-element-gray-lighter hover:bg-element-gray-light text-icon-gray-light hover:text-icon-gray h-fit cursor-pointer rounded-sm p-1.5'}
          onClick={() => setIsOpen((prev) => !prev)}
          aria-label={isOpen ? '사이드바 접기' : '사이드바 펼치기'}
        >
          <PanelLeft size={16} />
        </button>
      </header>

      <Spacing size={32} />

      <nav className={'flex flex-1 flex-col gap-1'}>
        <LinkButton icon={Home} href={'/'} label={isOpen ? '홈' : undefined} />
        <LinkButton icon={PencilLineIcon} href={'/experiences'} label={isOpen ? '경험정리' : undefined} />
        <LinkButton icon={Layers} href={'/resumes'} label={isOpen ? '이력서' : undefined} />
      </nav>

      <Divider />
      <Spacing size={16} />

      {isOpen ? <UserProfile /> : <UserAvatar />}
    </aside>
  )
}

interface LinkButtonProps {
  icon: LucideIcon
  href: string
  label?: string
}

const LinkButton = ({ icon: Icon, href, label }: LinkButtonProps) => {
  const isActive = useActivePath(href)

  return (
    <Link href={href} className={cn('flex h-11 items-center gap-3 rounded-md p-3.5', isActive && 'bg-element-white text-text-primary-basic shadow-shadow-1 shadow-md', !label && 'w-fit')}>
      <Icon size={16} className="shrink-0" />
      {label && (
        <Text variant={'label1'} className={cn('overflow-hidden whitespace-nowrap')}>
          {label}
        </Text>
      )}
    </Link>
  )
}

/**
 * 현재 라우트 경로(pathname)가 인자로 받은 특정 주소(href)와 일치하거나
 * 하위 경로에 속해 있는지 체크하여 활성화 상태를 반환하는 커스텀 훅입니다.
 *
 * @param href - 검사할 대상 경로 (예: '/', '/experiences')
 * @returns 현재 경로가 대상 경로와 일치하거나 하위 경로이면 `true`, 그렇지 않으면 `false`
 *
 * @example
 * ```tsx
 * const isActive = useActivePath('/experiences'); // 현재 /experiences/123 이라면 true
 * const isHomeActive = useActivePath('/');        // 현재 / 이외의 경로에서는 false
 * ```
 */
// Todo: 파일 분리 고려 (Breadcrumb 등 공용으로 사용 가능 )
export const useActivePath = (href: string): boolean => {
  const pathname = usePathname()
  return href === '/' ? pathname === '/' : pathname === href || pathname.startsWith(`${href}/`)
}

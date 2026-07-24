'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { DropdownMenu } from 'radix-ui'
import { type LucideIcon, Home, Layers, PanelLeft, PencilLineIcon, Settings, UserRoundIcon, MessageCircleMore, LogOut } from 'lucide-react'
import { cn } from '@shared/lib/cn'
import { Divider, Heading, Spacing, Text } from '@shared/ui'
import { UserProfile, UserAvatar } from '@entities/user'
import { useActivePath } from '@shared/hooks/useActivePath'
import { useLogout } from '@features/authenticate'

/**
 * 이력서 작성·편집(`/home/resume/*`)·상세(`/resumes/[id]`) 화면에서는 넓은 작업 공간을 위해 사이드바를 강제로 접고 토글을 막는다.
 */
const isCollapseLockedPath = (pathname: string) => /^\/home\/resume\/[^/]+$/.test(pathname) || /^\/resumes\/[^/]+$/.test(pathname)

export const Sidebar = () => {
  const [isExpanded, setIsExpanded] = useState<boolean>(true)
  const { handleLogout } = useLogout()

  const pathname = usePathname()
  const isCollapseLocked = isCollapseLockedPath(pathname)
  const isEffectiveExpanded = isCollapseLocked ? false : isExpanded

  return (
    <aside
      data-sidebar={isEffectiveExpanded ? 'expanded' : 'collapsed'}
      className={cn(
        'bg-bg-gray-subtler flex h-full flex-col px-4 py-5',
        'transition-all duration-300 ease-in-out',
        isEffectiveExpanded ? 'w-(--sidebar-width-expanded)' : 'w-(--sidebar-width-collapsed)'
      )}
    >
      <header className={cn('flex h-10', isEffectiveExpanded ? 'justify-between' : 'justify-center')}>
        {isEffectiveExpanded && (
          <Link href="/home">
            <Heading size={'6'} weight={'bold'} className={cn('border-border-subtle font-elms overflow-hidden rounded-sm border px-2 py-1 tracking-[-0.02em] whitespace-nowrap')}>
              Scoop
            </Heading>
          </Link>
        )}
        <button
          className={cn(
            'bg-element-gray-lighter text-icon-gray-light h-fit rounded-sm p-1.5',
            isCollapseLocked ? 'cursor-not-allowed opacity-50' : 'hover:bg-element-gray-light hover:text-icon-gray cursor-pointer'
          )}
          onClick={() => setIsExpanded((prev) => !prev)}
          disabled={isCollapseLocked}
          aria-label={isEffectiveExpanded ? '사이드바 접기' : '사이드바 펼치기'}
        >
          <PanelLeft size={16} />
        </button>
      </header>

      <Spacing size={32} />

      <nav className={'flex flex-1 flex-col gap-1'}>
        <LinkButton icon={Home} href={'/home'} label={'홈'} isExpanded={isEffectiveExpanded} />
        <LinkButton icon={PencilLineIcon} href={'/experiences'} label={'경험 정리'} isExpanded={isEffectiveExpanded} />
        <LinkButton icon={Layers} href={'/resumes'} label={'이력서'} isExpanded={isEffectiveExpanded} />
      </nav>

      <Divider />
      <Spacing size={16} />

      <Menu trigger={isEffectiveExpanded ? <UserProfile /> : <UserAvatar />}>
        <MenuItem icon={Settings} label={'내 정보'} href={'/mypage/profile'} />
        <MenuItem icon={UserRoundIcon} label={'계정관리'} href={'/mypage/account'} />
        <MenuItem
          icon={MessageCircleMore}
          label={'제보'}
          onSelect={() => {
            console.log('제보')
          }}
        />
        <MenuItem icon={LogOut} label={'로그아웃'} onSelect={handleLogout} />
      </Menu>
    </aside>
  )
}

interface LinkButtonProps {
  icon: LucideIcon
  href: string
  label: string
  isExpanded: boolean
}

const LinkButton = ({ icon: Icon, href, label, isExpanded }: LinkButtonProps) => {
  const isActive = useActivePath(href)

  return (
    <Link
      href={href}
      className={cn('flex h-11 items-center gap-3 rounded-md p-3.5', isActive && 'bg-element-white text-text-primary-basic shadow-shadow-1 shadow-md', !isExpanded && 'w-fit')}
      aria-label={!isExpanded ? label : undefined}
      title={!isExpanded ? label : undefined}
    >
      <Icon size={16} className="shrink-0" />
      {isExpanded && (
        <Text variant={'label1'} className={cn('overflow-hidden whitespace-nowrap')}>
          {label}
        </Text>
      )}
    </Link>
  )
}

interface MenuProps {
  trigger: React.ReactNode
  children: React.ReactNode
}

const Menu = ({ trigger, children }: MenuProps) => {
  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <button type="button" aria-label="사용자 메뉴 열기" className={'text-left outline-none'}>
          {trigger}
        </button>
      </DropdownMenu.Trigger>
      <DropdownMenu.Content
        className={'bg-element-white text-text-subtler shadow-3 shadow-shadow-3 w-47 overflow-hidden rounded-md'}
        side={'top'}
        align={'center'}
        sideOffset={10}
        collisionPadding={15}
      >
        {children}
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  )
}

interface MenuItemProps {
  icon: LucideIcon
  label: string
  href?: string
  onSelect?: () => void
  disabled?: boolean
}

const MenuItem = ({ icon: Icon, label, href, onSelect: handleSelect, disabled }: MenuItemProps) => {
  const className = cn(
    'flex items-center gap-3 px-4 py-3.5',
    'data-highlighted:bg-element-gray-lighter data-highlighted:text-text-basic',
    'cursor-pointer outline-none',
    disabled && 'pointer-events-none opacity-50'
  )

  if (href) {
    return (
      <DropdownMenu.Item asChild disabled={disabled} className={className}>
        <Link href={href}>
          <Icon size={16} />
          <Text variant={'label1'}>{label}</Text>
        </Link>
      </DropdownMenu.Item>
    )
  }

  return (
    <DropdownMenu.Item className={className} onSelect={handleSelect} disabled={disabled}>
      <Icon size={16} />
      <Text variant={'label1'}>{label}</Text>
    </DropdownMenu.Item>
  )
}

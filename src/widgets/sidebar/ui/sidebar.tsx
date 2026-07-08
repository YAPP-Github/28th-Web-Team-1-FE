'use client'

import { useState } from 'react'
import Link from 'next/link'
import { DropdownMenu } from 'radix-ui'
import { type LucideIcon, Home, Layers, PanelLeft, PencilLineIcon, Settings, UserRoundIcon, MessageCircleMore, LogOut } from 'lucide-react'
import { cn } from '@shared/lib/cn'
import { Divider, Heading, Spacing, Text } from '@shared/ui'
import { UserProfile, UserAvatar } from '@entities/user'
import { useActivePath } from '@shared/hooks/useActivePath'
import { useLogout } from '@features/authenticate'

export const Sidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState<boolean>(true)
  const { handleLogout } = useLogout()

  return (
    <aside className={cn('bg-bg-gray-subtler flex h-full flex-col px-4 py-5', 'transition-all duration-300 ease-in-out', isCollapsed ? 'w-55' : 'w-19')}>
      <header className={cn('flex h-10', isCollapsed ? 'justify-between' : 'justify-center')}>
        {isCollapsed && (
          <Heading size={'6'} weight={'bold'} className={cn('border-border-subtle overflow-hidden rounded-sm border px-2 py-1 whitespace-nowrap')}>
            Scoop
          </Heading>
        )}
        <button
          className={'bg-element-gray-lighter hover:bg-element-gray-light text-icon-gray-light hover:text-icon-gray h-fit cursor-pointer rounded-sm p-1.5'}
          onClick={() => setIsCollapsed((prev) => !prev)}
          aria-label={isCollapsed ? '사이드바 접기' : '사이드바 펼치기'}
        >
          <PanelLeft size={16} />
        </button>
      </header>

      <Spacing size={32} />

      <nav className={'flex flex-1 flex-col gap-1'}>
        <LinkButton icon={Home} href={'/'} label={'홈'} isCollapsed={!isCollapsed} />
        <LinkButton icon={PencilLineIcon} href={'/experiences'} label={'경험정리'} isCollapsed={!isCollapsed} />
        <LinkButton icon={Layers} href={'/resumes'} label={'이력서'} isCollapsed={!isCollapsed} />
      </nav>

      <Divider />
      <Spacing size={16} />

      <Menu trigger={isCollapsed ? <UserProfile /> : <UserAvatar />}>
        <MenuItem
          icon={Settings}
          label={'내 정보'}
          onSelect={() => {
            console.log('내 정보')
          }}
        />
        <MenuItem
          icon={UserRoundIcon}
          label={'계정관리'}
          onSelect={() => {
            console.log('계정관리')
          }}
        />
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
  isCollapsed: boolean
}

const LinkButton = ({ icon: Icon, href, label, isCollapsed }: LinkButtonProps) => {
  const isActive = useActivePath(href)

  return (
    <Link
      href={href}
      className={cn('flex h-11 items-center gap-3 rounded-md p-3.5', isActive && 'bg-element-white text-text-primary-basic shadow-shadow-1 shadow-md', isCollapsed && 'w-fit')}
      aria-label={isCollapsed ? label : undefined}
      title={isCollapsed ? label : undefined}
    >
      <Icon size={16} className="shrink-0" />
      {!isCollapsed && (
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
  onSelect?: () => void
  disabled?: boolean
}

const MenuItem = ({ icon: Icon, label, onSelect: handleSelect, disabled }: MenuItemProps) => {
  return (
    <DropdownMenu.Item
      className={cn(
        'flex items-center gap-3 px-4 py-3.5',
        'data-highlighted:bg-element-gray-lighter data-highlighted:text-text-basic',
        'cursor-pointer outline-none',
        disabled && 'pointer-events-none opacity-50'
      )}
      onSelect={handleSelect}
      disabled={disabled}
    >
      <Icon size={16} />
      <Text variant={'label1'}>{label}</Text>
    </DropdownMenu.Item>
  )
}

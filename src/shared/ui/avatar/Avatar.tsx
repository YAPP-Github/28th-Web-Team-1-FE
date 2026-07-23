import { Avatar as AvatarPrimitive } from 'radix-ui'
import { cn } from '@shared/lib/cn'
import { UserRoundIcon } from 'lucide-react'

interface AvatarProps {
  /** 아바타 이미지 URL. 제공되지 않으면 fallback 아이콘이 표시됩니다. */
  imageUrl?: string | null
  /**
   * 아바타 크기입니다.
   * @default 'lg'
   */
  size?: 'sm' | 'default' | 'lg' | 'xl'
  /** 추가 CSS 클래스 */
  className?: string
}

/**
 * 사용자 아바타를 표시하는 컴포넌트입니다.
 * 이미지가 제공되면 해당 이미지를, 없으면 UserRoundIcon fallback을 보여줍니다.
 * `sm`(24x24) / `default`(32x32) / `lg`(36x36) / `xl`(60x60) 사이즈를 지원합니다.
 * @example
 * ```tsx
 * <Avatar imageUrl={profileImageUrl} size="xl" />
 * ```
 */
export const Avatar = ({ imageUrl, size = 'lg', className }: AvatarProps) => {
  return (
    <AvatarRoot size={size} className={className}>
      <AvatarImage src={imageUrl ?? undefined} alt="User Avatar" />
      <AvatarFallback className={'bg-element-primary-lighter'}>
        <UserRoundIcon className="text-icon-primary-basic" size={size === 'xl' ? 28 : undefined} />
      </AvatarFallback>
    </AvatarRoot>
  )
}

const AvatarRoot = ({
  className,
  size = 'default',
  ...props
}: React.ComponentProps<typeof AvatarPrimitive.Root> & {
  size?: 'default' | 'sm' | 'lg' | 'xl'
}) => {
  return (
    <AvatarPrimitive.Root
      data-slot="avatar"
      data-size={size}
      className={cn(
        'group/avatar after:border-border relative flex size-8 shrink-0 rounded-full select-none after:absolute after:inset-0 after:rounded-full after:border after:mix-blend-darken data-[size=lg]:size-9 data-[size=sm]:size-6 data-[size=xl]:size-15 dark:after:mix-blend-lighten',
        className
      )}
      {...props}
    />
  )
}

const AvatarImage = ({ className, ...props }: React.ComponentProps<typeof AvatarPrimitive.Image>) => {
  return <AvatarPrimitive.Image data-slot="avatar-image" className={cn('aspect-square size-full rounded-full object-cover', className)} {...props} />
}

const AvatarFallback = ({ className, ...props }: React.ComponentProps<typeof AvatarPrimitive.Fallback>) => {
  return (
    <AvatarPrimitive.Fallback
      data-slot="avatar-fallback"
      className={cn('bg-muted text-muted-foreground flex size-full items-center justify-center rounded-full text-sm group-data-[size=sm]/avatar:text-xs', className)}
      {...props}
    />
  )
}

import { cn } from '@shared/lib/cn'
import { Flex } from '@radix-ui/themes'
import { Text } from '@shared/ui'

export const AddProjectExperienceButton = ({ title, description, icon, className, ...props }: { title: string; description: string; icon: React.ReactNode } & React.ComponentProps<'button'>) => {
  return (
    <button
      type="button"
      className={cn(
        'ring-btn-outline-border flex w-full flex-row items-center gap-2.5 rounded-sm px-2.5 py-2.5 ring-1 ring-inset',
        // TODO : 인터렉션 추가 시 변경 필요
        //hover
        'hover:bg-element-primary-lighter hover:ring-btn-secondary-border',
        className
      )}
      {...props}
    >
      <div className="bg-btn-tertiary-fill flex h-10.5 w-10.5 items-center justify-center rounded-lg">{icon}</div>
      <Flex direction="column" align="start" className="gap-0.5">
        <Text variant="label1" color="text-basic">
          {title}
        </Text>
        <Text variant="caption2" color="text-basic">
          {description}
        </Text>
      </Flex>
    </button>
  )
}

import { useEffect, useRef, Children } from 'react'
import { Flex } from '@radix-ui/themes'
import { Button, Divider, Spacing, Text } from '@shared/ui'
import { Plus } from 'lucide-react'

interface SectionProps {
  title: string
  actionButton?: React.ReactNode
  children: React.ReactNode
}

export const Section = ({ title, actionButton, children }: SectionProps) => {
  const count = Children.count(children)
  const isEmpty = count === 0

  const scrollRef = useRef<HTMLDivElement>(null)
  const prevCount = useRef(count)
  useEffect(() => {
    if (count > prevCount.current) {
      scrollRef.current?.lastElementChild?.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
    }
    prevCount.current = count
  }, [count])

  return (
    <Flex direction="column" className={'w-full px-8 pb-6'}>
      <Flex justify="between" align="center" className={'py-6'}>
        <Text variant={'headline1'}>{title}</Text>
      </Flex>
      <Divider color={'gray-60'} />
      <Spacing size={32} />

      <Flex ref={scrollRef} direction={'column'} className={'gap-12 overflow-y-auto px-1'}>
        {isEmpty ? <SectionEmpty /> : children}
      </Flex>

      <Spacing size={32} />

      {actionButton}
    </Flex>
  )
}

export const SectionEmpty = () => {
  return (
    <Text variant={'headline2'} color={'text-subtler'} className={'text-center'}>
      이력서에 입력하고 싶은 정보를 추가해주세요
    </Text>
  )
}

export const AddItemButton = ({ label, onClick }: { label: string; onClick: () => void }) => {
  return (
    <Button type={'button'} fullWidth variant={'tertiary'} onClick={onClick} className={'border-border-subtle border-dashed'}>
      <Plus size={16} data-icon="inline-start" />
      {label}
    </Button>
  )
}

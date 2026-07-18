'use client'
import { Fragment, useState } from 'react'
import { Flex } from '@radix-ui/themes'
import { cn } from '@shared/lib/cn'
import { Divider, Text } from '@shared/ui'
import { getSectionItemLabels, visibleSortedItems, type ResumeSectionData } from '../model/section'
import { Menu } from 'lucide-react'

/**
 * 이력서 미리보기의 목차(minimap). 서버가 내려준 섹션·아이템 구조를 그대로 반영한다.
 * - 접힌 상태: 섹션은 긴 dash, 하위 아이템은 짧은 dash로 표시
 * - 펼친 상태(hover): 섹션 제목(displayText)과 아이템 라벨 목록
 */
export const ResumeIndex = ({ sections, activeSectionId }: { sections: ResumeSectionData[]; activeSectionId: string | null }) => {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <Flex className={'relative w-16 px-4 py-20'} onMouseLeave={() => setIsOpen(false)}>
      <Flex direction="column" align={'end'} gap="2" className="h-fit w-full" onMouseEnter={() => setIsOpen(true)}>
        {sections.map((section) => {
          const isActive = activeSectionId === section.sectionId
          return (
            <Fragment key={section.sectionId}>
              <div className={cn('h-0.75 w-6 rounded-full', isActive ? 'bg-border-primary' : 'bg-border-subtle')} />
              {visibleSortedItems(section).map((item) => (
                <div key={item.itemId} className={cn('h-0.75 w-4 rounded-full', isActive ? 'bg-primary-20' : 'bg-border-subtler')} />
              ))}
            </Fragment>
          )
        })}
      </Flex>

      {isOpen && (
        <Flex direction="column" gap="1" className={cn('bg-element-white border-border-subtler shadow-1 absolute top-16 right-4 z-10 min-w-40 rounded-lg border px-5 py-3')}>
          <Flex align={'center'} gap={'1'}>
            <Text variant="label2" color={'text-basic'}>
              기본정보
            </Text>
          </Flex>
          <Divider className={'mx-auto'} />

          {sections.map((section) => (
            <Flex key={section.sectionId} direction="column" gap="1">
              <Flex align={'center'} className={cn('group/section relative rounded-sm', activeSectionId === section.sectionId && 'bg-element-primary-lighter px-2 py-1')}>
                <Menu size={12} className={'text-icon-gray absolute top-1/2 right-full mr-1 -translate-y-1/2 cursor-pointer opacity-0 transition-opacity group-hover/section:opacity-100'} />

                <Text variant="label2" color={activeSectionId === section.sectionId ? 'text-primary-bolder' : 'text-basic'} className={'w-40 max-w-40 truncate'}>
                  {section.displayText}
                </Text>
              </Flex>

              <Flex direction="column" gap="1" className={cn('rounded-sm', activeSectionId === section.sectionId && 'bg-element-gray-lighter px-2 py-1')}>
                {getSectionItemLabels(section).map((label, index) => (
                  <Flex key={index} align={'center'} className={'group/item relative mx-3'}>
                    <Menu size={10} className={'text-icon-gray absolute top-1/2 right-full mr-1 -translate-y-1/2 cursor-pointer opacity-0 transition-opacity group-hover/item:opacity-100'} />

                    <Text variant="caption2" color="text-subtler" className="w-35 max-w-35 truncate">
                      {label}
                    </Text>
                  </Flex>
                ))}
              </Flex>
            </Flex>
          ))}
        </Flex>
      )}
    </Flex>
  )
}

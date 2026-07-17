'use client'
import { Fragment, useState } from 'react'
import { Flex } from '@radix-ui/themes'
import { cn } from '@shared/lib/cn'
import { Text } from '@shared/ui'
import { getSectionItemLabels, visibleSortedItems, type ResumeSectionData } from './ResumeSectionView'

/**
 * 이력서 미리보기의 목차(minimap). 서버가 내려준 섹션·아이템 구조를 그대로 반영한다.
 * - 접힌 상태: 섹션은 긴 dash, 하위 아이템은 짧은 dash로 표시
 * - 펼친 상태(hover): 섹션 제목(displayText)과 아이템 라벨 목록
 */
export const ResumeIndex = ({ sections }: { sections: ResumeSectionData[] }) => {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <Flex className={'relative w-16 px-4 py-20'} onMouseEnter={() => setIsOpen(true)} onMouseLeave={() => setIsOpen(false)}>
      <Flex direction="column" align={'end'} gap="2" className="w-full">
        {sections.map((section) => (
          <Fragment key={section.sectionId}>
            <div className={'bg-border-subtle h-0.75 w-6 rounded-full'} />
            {visibleSortedItems(section).map((item) => (
              <div key={item.itemId} className={'bg-border-subtler h-0.75 w-4 rounded-full'} />
            ))}
          </Fragment>
        ))}
      </Flex>

      {isOpen && (
        <Flex direction="column" gap="4" className={cn('bg-element-white border-border-subtler shadow-1 absolute top-16 right-4 z-10 min-w-40 rounded-lg border p-4')}>
          {sections.map((section) => (
            <Flex key={section.sectionId} direction="column" gap="1">
              <Text variant="label2" color="text-basic" className="text-nowrap">
                {section.displayText}
              </Text>
              {getSectionItemLabels(section).map((label, index) => (
                <Text key={index} variant="caption2" color="text-subtler" className="max-w-48 truncate">
                  {label}
                </Text>
              ))}
            </Flex>
          ))}
        </Flex>
      )}
    </Flex>
  )
}

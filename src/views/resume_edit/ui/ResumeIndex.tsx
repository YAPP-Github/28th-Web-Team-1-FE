'use client'
import { Fragment, useState } from 'react'
import { Flex } from '@radix-ui/themes'
import { cn } from '@shared/lib/cn'
import { Button, Divider, Text } from '@shared/ui'
import { getSectionItemLabels, visibleSortedItems, type ResumeSectionData } from '../model/section'
import { Menu, Settings } from 'lucide-react'

/**
 * 이력서 미리보기의 목차(minimap). 서버가 내려준 섹션·아이템 구조를 그대로 반영한다.
 * - 접힌 상태: 섹션은 긴 dash, 하위 아이템은 짧은 dash로 표시
 * - 펼친 상태(hover): 섹션 제목(displayText)과 아이템 라벨 목록
 */
export const ResumeIndex = ({ sections, basicInfoSection, activeSectionId }: { sections: ResumeSectionData[]; basicInfoSection: ResumeSectionData | null; activeSectionId: string | null }) => {
  const [isOpen, setIsOpen] = useState(false)
  const basicInfoSectionId = basicInfoSection?.sectionId ?? null

  return (
    <Flex className={'bg-bg-gray-subtler relative w-16 px-4 py-20'} onMouseLeave={() => setIsOpen(false)}>
      <Flex direction="column" align={'end'} gap="2" className="h-fit w-full" onMouseEnter={() => setIsOpen(true)}>
        {basicInfoSectionId && <div className={cn('h-0.75 w-6 rounded-full', activeSectionId === basicInfoSectionId ? 'bg-border-primary' : 'bg-border-subtle')} />}
        {sections.map((section) => {
          const isActive = activeSectionId === section.sectionId
          return (
            <Fragment key={section.sectionId}>
              <div className={cn('h-0.75 w-6 rounded-full', isActive ? 'bg-border-primary' : 'bg-border-subtle')} />
              {visibleSortedItems(section).map((item) => (
                <div key={item.itemId} className={cn('h-0.75 w-4 rounded-full', isActive ? 'bg-border-primary' : 'bg-border-subtle')} />
              ))}
            </Fragment>
          )
        })}
      </Flex>

      {isOpen && (
        <Flex direction="column" className={cn('bg-element-white border-border-subtler shadow-1 absolute top-16 right-4 z-10 w-55.5 gap-1.5 rounded-lg border px-5 py-3')}>
          <Flex align={'center'} className={cn('rounded-sm px-1.5 py-1', activeSectionId === basicInfoSectionId && 'bg-element-primary-lighter')}>
            <Text variant="label2" color={'text-subtler'}>
              기본정보
            </Text>
          </Flex>

          <Divider />

          <Flex direction="column" className={'-ml-4 max-h-130 gap-1.5 overflow-y-auto pl-4'}>
            {sections.map((section) => {
              const isActive = activeSectionId === section.sectionId
              return (
                <Flex
                  key={section.sectionId}
                  direction="column"
                  className={cn(
                    'active:border-border-primary-light active:bg-element-white rounded-sm border border-transparent has-[[data-item]:active]:border-transparent',
                    isActive ? 'bg-element-primary-lighter has-[[data-item]:active]:bg-element-primary-lighter' : 'has-[[data-item]:active]:bg-transparent'
                  )}
                >
                  <Flex align={'center'} className={'group/section relative'}>
                    <Menu size={12} className={'text-icon-gray absolute top-1.75 right-full mr-0.5 cursor-pointer opacity-0 transition-opacity group-hover/section:opacity-100'} />

                    <Text variant="label2" color={'text-subtler'} className={'w-full truncate px-1.5 py-1'}>
                      {section.displayText}
                    </Text>
                  </Flex>

                  <Flex direction="column" gap="1" className={'rounded-sm'}>
                    {getSectionItemLabels(section).map((label, index) => (
                      <Flex
                        key={index}
                        data-item
                        align={'center'}
                        gap={'1'}
                        className={cn('group/item active:border-border-primary-light active:bg-element-white rounded-sm border border-transparent p-1')}
                      >
                        <Menu size={12} className={'text-icon-gray shrink-0 cursor-pointer opacity-0 transition-opacity group-hover/item:opacity-100'} />

                        <Text variant="caption2" color="text-subtler" className="w-full truncate">
                          {label}
                        </Text>
                      </Flex>
                    ))}
                  </Flex>
                </Flex>
              )
            })}
          </Flex>

          <Divider />

          <Button
            variant={'text'}
            size={'xs'}
            className={'ml-auto'}
            onClick={() => {
              // Todo: 카테고리 추가/삭제 모달 열기
            }}
          >
            카테고리 추가/삭제 <Settings />
          </Button>
        </Flex>
      )}
    </Flex>
  )
}

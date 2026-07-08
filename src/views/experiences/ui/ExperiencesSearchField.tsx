'use client'
import { useState } from 'react'
import { Flex } from '@radix-ui/themes'
import { ArrowRight, Search } from 'lucide-react'
import { SearchField, Text } from '@shared/ui'

export const ExperiencesSearchField = () => {
  const [isFocused, setIsFocused] = useState(false)

  return (
    <Flex direction="column" className="relative w-142.5">
      <SearchField placeholder="경험 이름, 태그로 검색하세요" className="w-full" onFocus={() => setIsFocused(true)} onBlur={() => setIsFocused(false)} rounded={isFocused ? 'top' : 'full'} />
      {isFocused && (
        // TODO : 실제 검색 결과/추천어로 교체 필요
        <Flex direction="column" onMouseDown={(e) => e.preventDefault()} className="bg-element-white shadow-2 absolute top-full left-0 z-10 w-full overflow-hidden rounded-b-2xl">
          {['프로젝트 경험', '동아리 활동', '인턴 경험'].map((label) => (
            <ExperiencesSearchItem key={label} label={label} />
          ))}
        </Flex>
      )}
    </Flex>
  )
}

const ExperiencesSearchItem = ({ label }: { label: string }) => {
  return (
    <Flex direction="row" align="center" justify="between" className="group hover:bg-element-gray-light cursor-pointer px-5 py-3 transition-colors">
      <Flex direction="row" align="center" gap="3">
        <div className="bg-btn-tertiary-fill flex h-8 w-8 items-center justify-center rounded-full">
          <Search size={18} className="text-icon-disabled group-hover:text-icon-gray-light" />
        </div>
        <Text variant="body2" color="text-subtler">
          {label}
        </Text>
      </Flex>
      <ArrowRight size={18} className="text-icon-disabled-on group-hover:text-icon-gray-light" />
    </Flex>
  )
}

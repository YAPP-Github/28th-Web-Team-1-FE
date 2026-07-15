'use client'
import { useState } from 'react'
import Link from 'next/link'
import { Flex } from '@radix-ui/themes'
import { ArrowRight, ChevronRight, Search } from 'lucide-react'
import { useSearchExperiences } from '@entities/experience'
import { useWorkspaceId } from '@entities/user'
import { useDebounce } from '@shared/hooks/useDebounce'
import { SearchField, Text } from '@shared/ui'

export const ExperiencesSearchField = () => {
  const workspaceId = useWorkspaceId()
  const [isFocused, setIsFocused] = useState(false)
  const [keyword, setKeyword] = useState('')

  const debouncedKeyword = useDebounce(keyword, 300)
  const { results, isFetching } = useSearchExperiences(workspaceId, debouncedKeyword)

  const trimmedKeyword = keyword.trim()
  // 조회 중이거나 입력값이 아직 디바운스에 반영 안 된 구간(지웠다 다시 입력한 직후 등)에는
  // keepPreviousData로 남아있는 '이전 검색어' 결과가 보이지 않도록 드롭다운을 닫아둔다.
  const isSearching = isFetching || trimmedKeyword !== debouncedKeyword.trim()
  const isOpen = isFocused && trimmedKeyword.length > 0 && !isSearching

  return (
    <Flex
      direction="column"
      className="relative w-142.5"
      onFocus={() => setIsFocused(true)}
      // 포커스가 컨테이너(입력창+드롭다운) 밖으로 나갈 때만 닫아, Tab으로 결과 링크에 접근할 수 있게 한다.
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget)) setIsFocused(false)
      }}
    >
      <SearchField placeholder="경험 이름, 태그로 검색하세요" className="w-full" value={keyword} onChange={(e) => setKeyword(e.target.value)} rounded={isFocused ? 'top' : 'full'} />
      {isOpen && (
        <Flex direction="column" className="bg-element-white shadow-2 absolute top-full left-0 z-10 w-full overflow-hidden rounded-b-2xl">
          {results.length > 0 ? (
            results.map((experience) => <ExperiencesSearchItem key={experience.experienceId} experience={experience} />)
          ) : (
            <Flex direction="row" align="center" gap="3" className="bg-element-gray-lighter w-full px-5 py-3">
              <Search size={18} className="bg-btn-secondary-fill text-icon-disabled h-8 w-8 rounded-full p-1.75" />
              <Text variant="headline2" color="text-disabled">
                검색결과가 없어요.
              </Text>
            </Flex>
          )}
        </Flex>
      )}
    </Flex>
  )
}

const ExperiencesSearchItem = ({ experience }: { experience: ReturnType<typeof useSearchExperiences>['results'][0] }) => {
  return (
    <Link
      href={`/experiences/${experience.project?.projectId}`}
      className="group hover:bg-element-gray-light focus-visible:bg-element-gray-light flex w-full cursor-pointer items-center justify-between px-5 py-3 text-left transition-colors outline-none"
    >
      <Flex direction="row" align="center" gap="3">
        <Search size={18} className="text-icon-disabled group-hover:text-icon-gray-light group-focus-visible:text-icon-gray-light bg-btn-tertiary-fill box-content rounded-full p-1.75" />
        <Flex direction="row" align="center" gap="6px">
          <Text variant="headline2" color="text-subtler">
            {experience.project?.name}
          </Text>
          <ChevronRight size={18} className="text-icon-gray-light" strokeWidth={1.5} />
          <Text variant="headline2" color="text-primary-basic">
            {experience.title}
          </Text>
        </Flex>
      </Flex>
      <ArrowRight size={18} className="text-icon-disabled-on group-hover:text-icon-gray-light group-focus-visible:text-icon-gray-light" />
    </Link>
  )
}

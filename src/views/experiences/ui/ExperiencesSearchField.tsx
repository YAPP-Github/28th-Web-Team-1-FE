'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Flex } from '@radix-ui/themes'
import { ArrowRight, ChevronRight, Search } from 'lucide-react'
import { useSearchExperiences } from '@entities/experience'
import { useWorkspaceId } from '@entities/user'
import { useDebounce } from '@shared/hooks/useDebounce'
import { SearchField, Text } from '@shared/ui'

export const ExperiencesSearchField = () => {
  const router = useRouter()
  const workspaceId = useWorkspaceId()
  const [isFocused, setIsFocused] = useState(false)
  const [keyword, setKeyword] = useState('')

  const debouncedKeyword = useDebounce(keyword, 300)
  const { results } = useSearchExperiences(workspaceId, debouncedKeyword)

  const isOpen = isFocused && keyword.trim().length > 0

  const handleSelect = (projectId?: string | null) => {
    if (!projectId) return
    setIsFocused(false)
    router.push(`/experiences/${projectId}`)
  }

  return (
    <Flex direction="column" className="relative w-142.5">
      <SearchField
        placeholder="경험 이름, 태그로 검색하세요"
        className="w-full"
        value={keyword}
        onChange={(e) => setKeyword(e.target.value)}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        rounded={isOpen ? 'top' : 'full'}
      />
      {isOpen && (
        <Flex direction="column" onMouseDown={(e) => e.preventDefault()} className="bg-element-white shadow-2 absolute top-full left-0 z-10 w-full overflow-hidden rounded-b-2xl">
          {results.length > 0 ? (
            results.map((experience) => <ExperiencesSearchItem key={experience.experienceId} experience={experience} onSelect={() => handleSelect(experience.project?.projectId)} />)
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

const ExperiencesSearchItem = ({ experience, onSelect }: { experience: ReturnType<typeof useSearchExperiences>['results'][0]; onSelect?: () => void }) => {
  return (
    <button type="button" onClick={onSelect} className="group hover:bg-element-gray-light flex w-full cursor-pointer items-center justify-between px-5 py-3 text-left transition-colors">
      <Flex direction="row" align="center" gap="3">
        <Search size={18} className="text-icon-disabled group-hover:text-icon-gray-light bg-btn-tertiary-fill box-content rounded-full p-1.75" />
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
      <ArrowRight size={18} className="text-icon-disabled-on group-hover:text-icon-gray-light" />
    </button>
  )
}

'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Flex } from '@radix-ui/themes'
import { ArrowRight, Search } from 'lucide-react'
import { useSearchExperiences } from '@entities/experience'
import { useDebounce } from '@shared/hooks/useDebounce'
import { SearchField, Text } from '@shared/ui'

export const ExperiencesSearchField = () => {
  const router = useRouter()
  const [isFocused, setIsFocused] = useState(false)
  const [keyword, setKeyword] = useState('')

  const debouncedKeyword = useDebounce(keyword, 300)
  const { results } = useSearchExperiences(debouncedKeyword)
  console.log('results', results)

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
            results.map((experience) => <ExperiencesSearchItem key={experience.experienceId} label={experience.title} onSelect={() => handleSelect(experience.project?.projectId)} />)
          ) : (
            <Flex align="center" className="px-5 py-4">
              <Text variant="body2" color="text-subtler">
                검색 결과가 없어요.
              </Text>
            </Flex>
          )}
        </Flex>
      )}
    </Flex>
  )
}

const ExperiencesSearchItem = ({ label, onSelect }: { label: string; onSelect?: () => void }) => {
  return (
    <button type="button" onClick={onSelect} className="group hover:bg-element-gray-light flex w-full cursor-pointer items-center justify-between px-5 py-3 text-left transition-colors">
      <Flex direction="row" align="center" gap="3">
        <div className="bg-btn-tertiary-fill flex h-8 w-8 items-center justify-center rounded-full">
          <Search size={18} className="text-icon-disabled group-hover:text-icon-gray-light" />
        </div>
        <Text variant="body2" color="text-subtler">
          {label}
        </Text>
      </Flex>
      <ArrowRight size={18} className="text-icon-disabled-on group-hover:text-icon-gray-light" />
    </button>
  )
}

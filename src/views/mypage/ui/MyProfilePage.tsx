'use client'

import { Suspense, type ComponentType } from 'react'
import { Flex } from '@radix-ui/themes'
import { Accordion as AccordionPrimitive } from 'radix-ui'
import { ErrorBoundary } from '@sentry/nextjs'
import { ChevronDown } from 'lucide-react'
import { cn } from '@shared/lib/cn'
import { Divider, Heading, Spacing, Text } from '@shared/ui'
import { Avatar } from '@shared/ui/avatar'
import { useMe } from '@entities/user'
import { BasicSection } from './profile/BasicSection'
import { CoreCompetencySection } from './profile/CoreCompetencySection'
import { EducationSection } from './profile/EducationSection'
import { CareerSection } from './profile/CareerSection'
import { LanguageSection } from './profile/LanguageSection'
import { AwardSection } from './profile/AwardSection'
import { CertificateSection } from './profile/CertificateSection'
import { SkillSection } from './profile/SkillSection'

const INFO_SECTIONS: Array<{ value: string; label: string; Component: ComponentType }> = [
  { value: 'basic', label: '기본 정보', Component: BasicSection },
  { value: 'competency', label: '핵심 역량', Component: CoreCompetencySection },
  { value: 'education', label: '학력', Component: EducationSection },
  { value: 'career', label: '경력', Component: CareerSection },
  { value: 'language', label: '어학', Component: LanguageSection },
  { value: 'award', label: '수상', Component: AwardSection },
  { value: 'certificate', label: '자격증', Component: CertificateSection },
  { value: 'skill', label: '기술', Component: SkillSection }
]

export const MyProfilePage = () => {
  return (
    <Flex direction="column" p="8" className="min-h-0 flex-1 overflow-y-auto">
      <Heading variant="heading2" color="text-basic">
        내 정보
      </Heading>

      <Spacing size={32} />

      <Flex direction="column" className="w-full max-w-158.5">
        <ErrorBoundary fallback={<SectionFallback>사용자 정보를 불러오는 데 실패했습니다.</SectionFallback>}>
          <Suspense fallback={<SectionFallback>불러오는 중...</SectionFallback>}>
            <ProfileSummary />
          </Suspense>
        </ErrorBoundary>

        <Spacing size={32} />
        <Divider color="gray-10" />
        <Spacing size={32} />

        <AccordionPrimitive.Root type="multiple" className="flex flex-col gap-5">
          {INFO_SECTIONS.map((section) => (
            <InfoAccordionItem key={section.value} value={section.value} label={section.label} Component={section.Component} />
          ))}
        </AccordionPrimitive.Root>
      </Flex>
    </Flex>
  )
}

const ProfileSummary = () => {
  const { me } = useMe()

  return (
    <Flex gap="5" align="center" className="shadow-1 rounded-xl px-5 py-4">
      <Avatar imageUrl={me.profileImageUrl} size="xl" />
      <Flex direction="column">
        <Text variant="headline1" color="text-subtle">
          {me.name}
        </Text>
        <Text variant="body2" color="text-subtler">
          {me.email}
        </Text>
      </Flex>
    </Flex>
  )
}

const SectionFallback = ({ children }: { children: React.ReactNode }) => (
  <Text variant="label1" color="text-subtler">
    {children}
  </Text>
)

interface InfoAccordionItemProps {
  value: string
  label: string
  Component: ComponentType
}
const InfoAccordionItem = ({ value, label, Component }: InfoAccordionItemProps) => {
  return (
    <AccordionPrimitive.Item value={value} className="border-border-subtler data-[state=open]:border-border-subtle data-[state=open]:shadow-2 overflow-hidden rounded-xl border">
      <AccordionPrimitive.Header>
        <AccordionPrimitive.Trigger className={cn('group flex h-13.5 w-full cursor-pointer items-center justify-between py-3 pr-6 pl-5 outline-none')}>
          <Text variant="headline2" color="text-basic">
            {label}
          </Text>
          <ChevronDown size={20} className="text-icon-gray-light transition-transform duration-200 group-data-[state=open]:rotate-180" />
        </AccordionPrimitive.Trigger>
      </AccordionPrimitive.Header>
      <AccordionPrimitive.Content className="px-6 pt-2 pb-6">
        <ErrorBoundary fallback={<SectionFallback>정보를 불러오는 데 실패했습니다.</SectionFallback>}>
          <Suspense fallback={<SectionFallback>불러오는 중...</SectionFallback>}>
            <Component />
          </Suspense>
        </ErrorBoundary>
      </AccordionPrimitive.Content>
    </AccordionPrimitive.Item>
  )
}

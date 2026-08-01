import { ArrowRight } from 'lucide-react'
import { Flex } from '@radix-ui/themes'
import { Heading, Text } from '@shared/ui'

const StarInputMockup = () => {
  const fields = [
    { en: 'Situation', ko: '상황' },
    { en: 'Task', ko: '과업' },
    { en: 'Action', ko: '행동' },
    { en: 'Result', ko: '결과' }
  ]

  return (
    <Flex direction="column" gap="4" className="border-border-subtler shadow-2 w-full max-w-[420px] rounded-2xl border bg-white p-6">
      {fields.map((field) => (
        <Flex key={field.en} align="center" gap="4">
          <Flex direction="column" className="w-16 shrink-0">
            <Text variant="label2" color="text-basic" weight="semibold">
              {field.en}
            </Text>
            <Text variant="caption2" color="text-subtler">
              {field.ko}
            </Text>
          </Flex>
          <div className="bg-bg-gray-subtler h-2 w-full rounded-full" />
        </Flex>
      ))}
    </Flex>
  )
}

const JobDescriptionMockup = () => {
  return (
    <Flex direction="column" gap="3" align="end" className="w-full max-w-[420px]">
      <div className="bg-primary-5 relative w-full rounded-2xl px-5 py-4">
        <Text variant="label1" color="text-primary-basic" weight="semibold" className="block text-center">
          지원할 공고의 링크를 입력해주세요
        </Text>
        <Text variant="caption1" color="text-subtler" className="block text-center">
          공고 내용을 분석해, 가장 맞는 경험을 추천해 드릴게요.
        </Text>
      </div>
      <Flex align="center" gap="2" className="border-border-subtler shadow-2 w-full rounded-full border bg-white py-2 pr-2 pl-5">
        <Text variant="body2" color="text-subtler" className="flex-1 truncate">
          https:// 채용 공고 링크를 입력하세요
        </Text>
        <div className="bg-primary-50 flex size-8 items-center justify-center rounded-full">
          <ArrowRight className="text-white" size={16} />
        </div>
      </Flex>
    </Flex>
  )
}

const MatchedExperienceMockup = () => {
  const experiences = ['경험 1', '경험 2', '경험 3']

  return (
    <Flex direction="column" gap="3" className="w-full max-w-[420px]">
      {experiences.map((experience) => (
        <Flex key={experience} align="center" justify="between" className="border-border-subtler shadow-2 rounded-xl border bg-white px-4 py-3">
          <Flex align="center" gap="3">
            <div className="border-border-subtle size-4 rounded-sm border" />
            <Text variant="label1" color="text-basic" weight="semibold">
              {experience}
            </Text>
          </Flex>
          <span className="bg-primary-5 text-primary-basic rounded-full px-2.5 py-1 text-xs font-semibold">매칭 90%</span>
        </Flex>
      ))}
    </Flex>
  )
}

const STEPS = [
  {
    number: '01',
    titleEn: 'Experience',
    titleKo: '경험 정리',
    description: 'Notion, PDF 등 경험이 담긴 자료를 업로드해주세요. 혹은 떠오르는 경험을 자유롭게 작성해 주시면, AI가 이력서에 적합한 STAR 구조로 정리해 드려요.',
    mockup: <StarInputMockup />
  },
  {
    number: '02',
    titleEn: 'Job Description',
    titleKo: '채용 공고 분석',
    description: '지원하고 싶은 채용공고를 입력해주세요. 채용 공고를 분석해, 그에 맞는 경험을 추천해 드릴게요.',
    mockup: <JobDescriptionMockup />
  },
  {
    number: '03',
    titleEn: 'Resume',
    titleKo: '이력서 생성',
    description: 'AI가 채용공고를 분석해 가장 적합한 경험을 선별하고, 맞춤형 이력서를 자동으로 생성해 드려요.',
    mockup: <MatchedExperienceMockup />
  }
]

export const ProcessStepsSection = () => {
  return (
    <section className="bg-bg-gray-subtler py-24">
      <Flex direction="column" align="center" gap="3">
        <Text variant="label1" color="text-primary-basic" weight="semibold">
          SCOOP
        </Text>
        <Heading variant="title2" color="text-basic">
          3단계로 완성하는 맞춤 이력서
        </Heading>
      </Flex>

      <Flex direction="column" gap="6" className="mx-auto mt-16 max-w-[1140px]">
        {STEPS.map((step) => (
          <Flex key={step.number} align="center" justify="between" gap="8" className="shadow-2 rounded-2xl bg-white p-12">
            <Flex direction="column" gap="3" className="max-w-[400px]">
              <Text className="text-primary-10 font-elms text-6xl">{step.number}</Text>
              <Heading variant="title3" color="text-basic">
                {step.titleEn}
              </Heading>
              <Text variant="headline2" color="text-subtler">
                {step.titleKo}
              </Text>
              <Text variant="body1" color="text-subtle" className="mt-2">
                {step.description}
              </Text>
            </Flex>
            <Flex align="center" justify="center" className="flex-1">
              {step.mockup}
            </Flex>
          </Flex>
        ))}
      </Flex>
    </section>
  )
}

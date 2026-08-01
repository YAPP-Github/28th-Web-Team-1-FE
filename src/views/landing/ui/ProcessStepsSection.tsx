import { ArrowRight, Check } from 'lucide-react'
import { Flex } from '@radix-ui/themes'
import { cn } from '@shared/lib/cn'

const StarInputMockup = () => {
  const fields = [
    { en: 'Situation', ko: '상황' },
    { en: 'Task', ko: '과업' },
    { en: 'Action', ko: '행동' },
    { en: 'Result', ko: '결과' }
  ]

  return (
    <Flex direction="column" className="w-full max-w-[420px] gap-4 rounded-2xl border border-border-subtler bg-white p-6 shadow-2">
      {fields.map((field) => (
        <Flex key={field.en} align="center" className="gap-4">
          <Flex direction="column" className="w-16 shrink-0">
            <p className="text-label2 font-semibold text-text-basic">{field.en}</p>
            <p className="text-caption2 text-text-subtler">{field.ko}</p>
          </Flex>
          <div className="h-2 w-full rounded-full bg-bg-gray-subtler" />
        </Flex>
      ))}
    </Flex>
  )
}

const JobDescriptionMockup = () => {
  const tabs = ['URL 붙여넣기', '원문 붙여넣기']

  return (
    <Flex direction="column" align="center" className="w-full max-w-[420px]">
      <Flex direction="column" align="center" className="relative z-10 gap-1 rounded-xl bg-white px-4.5 py-3.5 text-center shadow-3">
        <p className="text-base font-bold tracking-[-0.02em] text-text-basic">지원할 공고의 링크를 입력해주세요</p>
        <p className="text-caption1 text-text-subtle">공고 내용을 분석해, 가장 맞는 경험을 추천해 드릴게요.</p>
      </Flex>
      <div className="h-0 w-0 border-x-8 border-t-8 border-x-transparent border-t-white" aria-hidden />

      <Flex direction="column" className="w-full gap-2.5 rounded-2xl border border-border-subtler bg-white p-2">
        <Flex align="center" className="w-fit gap-1 rounded-lg bg-element-gray-lighter p-1">
          {tabs.map((tab, index) => (
            <span key={tab} className={cn('rounded-md px-3 py-1.5 text-label2 font-semibold', index === 0 ? 'bg-white text-text-basic shadow-1' : 'text-text-subtler')}>
              {tab}
            </span>
          ))}
        </Flex>
        <div className="h-10 w-full" />
        <Flex justify="end">
          <div className="flex size-8 items-center justify-center rounded-full bg-primary-50">
            <ArrowRight className="text-white" size={16} />
          </div>
        </Flex>
      </Flex>
    </Flex>
  )
}

const MatchedExperienceMockup = () => {
  const experiences = ['경험 1', '경험 2', '경험 3']

  return (
    <Flex align="center" className="w-full max-w-[420px] gap-4">
      <Flex direction="column" className="flex-1 gap-3">
        {experiences.map((experience) => (
          <Flex key={experience} align="center" justify="between" className="rounded-xl border border-border-subtler bg-white px-4 py-3 shadow-2">
            <Flex align="center" className="gap-3">
              <div className="size-4 rounded-sm border border-border-subtle" />
              <p className="text-label1 font-semibold text-text-basic">{experience}</p>
            </Flex>
            <span className="rounded-full bg-green-10 px-2.5 py-1 text-xs font-semibold text-green-60">매칭 90%</span>
          </Flex>
        ))}
      </Flex>

      <ArrowRight className="shrink-0 text-text-subtler" size={20} />

      <Flex direction="column" className="w-[120px] shrink-0 gap-2 rounded-xl bg-white p-3 shadow-3">
        <Flex align="center" justify="between">
          <p className="text-caption2 font-semibold text-text-subtler">이력서</p>
          <Check className="text-primary-50" size={12} />
        </Flex>
        <Flex direction="column" className="mt-2 gap-1.5">
          <div className="h-1.5 w-full rounded-full bg-bg-gray-subtle" />
          <div className="h-1.5 w-full rounded-full bg-bg-gray-subtle" />
          <div className="h-1.5 w-3/4 rounded-full bg-bg-gray-subtle" />
        </Flex>
      </Flex>
    </Flex>
  )
}

const STEPS = [
  {
    number: '01',
    titleEn: 'Experience',
    titleKo: '경험 정리',
    description: ['Notion, PDF 등 경험이 담긴 자료를 업로드해주세요.', '혹은 떠오르는 경험을 자유롭게 작성해 주시면,', 'AI가 이력서에 적합한 STAR 구조로 정리해 드려요.'],
    mockup: <StarInputMockup />
  },
  {
    number: '02',
    titleEn: 'Job Description',
    titleKo: '채용 공고 분석',
    description: ['지원하고 싶은 채용공고를 입력해주세요.', '채용 공고를 분석해, 그에 맞는 경험을 추천해 드릴게요.'],
    mockup: <JobDescriptionMockup />
  },
  {
    number: '03',
    titleEn: 'Resume',
    titleKo: '이력서 생성',
    description: ['AI가 채용공고를 분석해 가장 적합한 경험을 선별하고,', '맞춤형 이력서를 자동으로 생성해 드려요.'],
    mockup: <MatchedExperienceMockup />
  }
]

export const ProcessStepsSection = () => {
  return (
    <section className="bg-bg-gray-subtler py-24">
      <Flex direction="column" align="center" className="mx-auto max-w-[1245px] gap-[100px]">
        <Flex direction="column" align="center" className="gap-3">
          <p className="font-elms text-[36px] font-extrabold tracking-[-0.025em] text-primary-50">SCOOP</p>
          <h2 className="text-[48px] font-bold tracking-[-0.025em] text-text-basic">3단계로 완성하는 맞춤 이력서</h2>
        </Flex>

        <Flex direction="column" className="w-full gap-[60px]">
          {STEPS.map((step) => (
            <Flex key={step.number} align="center" className="w-full gap-[66px] rounded-[40px] bg-white p-16 shadow-2">
              <Flex direction="column" className="w-[500px] shrink-0 gap-8">
                <div className="relative h-[110px] overflow-hidden opacity-90" aria-hidden>
                  <p className="font-elms text-[220px] leading-none font-bold tracking-[-0.025em] text-primary-10">{step.number}</p>
                </div>

                <Flex direction="column" className="gap-6">
                  <Flex direction="column" className="gap-2">
                    <h3 className="text-[70px] leading-tight font-bold tracking-[-0.025em] text-text-basic">{step.titleEn}</h3>
                    <p className="text-[28px] font-semibold tracking-[-0.025em] text-text-disabled">{step.titleKo}</p>
                  </Flex>
                  <Flex direction="column" className="text-[20px] leading-[1.5] text-text-subtle">
                    {step.description.map((line) => (
                      <p key={line}>{line}</p>
                    ))}
                  </Flex>
                </Flex>
              </Flex>

              <Flex align="center" justify="center" className="w-[550px] shrink-0 rounded-[22px] bg-bg-gray-subtler p-10">
                {step.mockup}
              </Flex>
            </Flex>
          ))}
        </Flex>
      </Flex>
    </section>
  )
}

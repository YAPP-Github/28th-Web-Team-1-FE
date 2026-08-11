import type { ReactNode } from 'react'
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
    <Flex direction="column" className="w-full gap-3.5">
      {fields.map((field) => (
        <Flex key={field.en} className="gap-2.5">
          <Flex direction="column" justify="center" className="w-17 shrink-0 gap-0.5">
            <p className="text-text-basic text-[13px] font-semibold">{field.en}</p>
            <p className="text-text-subtler text-[12px]">{field.ko}</p>
          </Flex>
          <Flex direction="column" justify="center" className="h-18 min-w-0 flex-1 gap-2 rounded-[11px] bg-white px-4">
            <div className="bg-gray-10 h-1.5 w-[45%] rounded-full" />
            <div className="bg-gray-10 h-1.5 w-[92%] rounded-full" />
            <div className="bg-gray-10 h-1.5 w-[92%] rounded-full" />
          </Flex>
        </Flex>
      ))}
    </Flex>
  )
}

const JobDescriptionMockup = () => {
  const tabs = ['URL 붙여넣기', '원문 붙여넣기']

  return (
    <Flex direction="column" align="center" className="w-full max-w-105">
      <Flex direction="column" align="center" className="shadow-3 relative z-10 gap-1 rounded-xl bg-white px-4.5 py-3.5 text-center">
        <p className="text-text-basic text-base font-bold tracking-[-0.02em]">지원할 공고의 링크를 입력해주세요</p>
        <p className="text-caption1 text-text-subtle">공고 내용을 분석해, 가장 맞는 경험을 추천해 드릴게요.</p>
      </Flex>
      <div className="h-0 w-0 border-x-8 border-t-14 border-x-transparent border-t-white" aria-hidden />

      <Flex direction="column" className="border-border-subtler w-full gap-1.5 rounded-xl border bg-white p-2">
        <Flex align="center" className="bg-element-gray-light w-fit gap-0.5 rounded-md p-0.5">
          {tabs.map((tab, index) => (
            <span key={tab} className={cn('rounded px-1.5 py-0.75 text-[7px] font-semibold', index === 0 ? 'text-text-basic shadow-1 bg-white' : 'text-text-subtler')}>
              {tab}
            </span>
          ))}
        </Flex>
        <Flex direction="column" className="gap-2 px-1 py-1.5">
          <div className="bg-bg-gray-subtler h-1 w-[40%] rounded-full" />
          <div className="bg-bg-gray-subtler h-1 w-[88%] rounded-full" />
          <div className="bg-bg-gray-subtler h-1 w-[88%] rounded-full" />
        </Flex>
        <Flex justify="end">
          <div className="bg-primary-50 flex size-6 items-center justify-center rounded-lg">
            <ArrowRight className="text-white" size={12} />
          </div>
        </Flex>
      </Flex>
    </Flex>
  )
}

const ExperienceMatchCard = ({ label }: { label: string }) => (
  <Flex direction="column" className="shadow-2 w-full gap-2 rounded-lg bg-white p-2.5">
    <Flex align="center" justify="between">
      <Flex align="center" className="gap-1.5">
        <div className="border-border-subtle flex size-3 items-center justify-center rounded-[3px] border">
          <Check className="text-text-subtler" size={8} strokeWidth={3} />
        </div>
        <p className="text-text-bolder text-[11px] font-semibold">{label}</p>
      </Flex>
      <span className="bg-green-10 text-green-60 rounded-full px-1.5 py-0.5 text-[9px] font-medium">매칭 90%</span>
    </Flex>

    <Flex align="center" className="gap-2">
      <p className="text-text-subtler w-13 shrink-0 text-[9px]">역할 및 기간</p>
      <div className="bg-bg-gray-subtler h-1 flex-1 rounded-full" />
    </Flex>

    <Flex align="start" className="gap-2">
      <p className="text-text-subtler w-13 shrink-0 text-[9px]">관련 역량</p>
      <Flex className="min-w-0 flex-1 flex-wrap gap-1">
        {[0, 1, 2, 3].map((chip) => (
          <div key={chip} className="bg-bg-gray-subtler h-3 w-8 rounded-sm" />
        ))}
      </Flex>
    </Flex>

    <div className="border-border-subtler border-t" />

    <Flex align="center" className="gap-2">
      <p className="text-text-subtler w-13 shrink-0 text-[9px]">추천 이유</p>
      <div className="bg-bg-gray-subtler h-1 flex-1 rounded-full" />
    </Flex>
  </Flex>
)

const ResumeSection = ({ label, children }: { label: string; children: ReactNode }) => (
  <Flex className="gap-3">
    <p className="text-text-subtler w-11 shrink-0 text-[9px]">{label}</p>
    <Flex direction="column" className="min-w-0 flex-1 gap-2">
      {children}
    </Flex>
  </Flex>
)

const ResumeEntry = ({ lines = 0 }: { lines?: number }) => (
  <Flex direction="column" className="gap-1.5">
    <div className="bg-bg-gray-subtle h-1.5 w-[45%] rounded-full" />
    <Flex align="center" className="gap-1.5">
      <div className="bg-bg-gray-subtler h-1 w-8 rounded-full" />
      <div className="bg-border-subtler h-2 w-px" />
      <div className="bg-bg-gray-subtler h-1 w-12 rounded-full" />
    </Flex>
    {lines > 0 && (
      <Flex direction="column" className="gap-1 pt-0.5">
        {Array.from({ length: lines }).map((_, index) => (
          <div key={index} className="bg-bg-gray-subtler h-1.5 w-full rounded-full" />
        ))}
      </Flex>
    )}
  </Flex>
)

const MatchedExperienceMockup = () => {
  const experiences = ['경험 1', '경험 2', '경험 3']

  return (
    <Flex direction={{ initial: 'column', md: 'row' }} align="center" className="w-full gap-3">
      <Flex direction="column" className="w-full gap-2 md:w-52.5 md:gap-2.5">
        {experiences.map((experience) => (
          <ExperienceMatchCard key={experience} label={experience} />
        ))}
      </Flex>

      <ArrowRight className="text-text-subtler shrink-0 rotate-90 md:rotate-0" size={18} />

      <Flex direction="column" className="shadow-3 w-full min-w-0 gap-3 rounded-xl bg-white p-4 md:flex-1">
        <Flex align="center" justify="between">
          <p className="text-text-basic text-sm font-bold">김스쿱</p>
          <div className="bg-bg-gray-subtler h-1 w-14 rounded-full" />
        </Flex>
        <div className="border-border-subtler border-t" />

        <ResumeSection label="핵심 역량">
          <div className="bg-bg-gray-subtler h-1.5 w-full rounded-full" />
          <div className="bg-bg-gray-subtler h-1.5 w-[55%] rounded-full" />
        </ResumeSection>

        <ResumeSection label="경험">
          <ResumeEntry lines={2} />
          <ResumeEntry lines={2} />
          <ResumeEntry lines={2} />
        </ResumeSection>

        <ResumeSection label="학력">
          <ResumeEntry />
          <ResumeEntry />
        </ResumeSection>
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
    <section id="features" className="py-14 md:py-24">
      <Flex direction="column" align="center" className="mx-auto max-w-311.25 gap-10 md:gap-25">
        <Flex direction="column" align="center" className="gap-2 md:gap-3">
          <p className="font-elms text-primary-50 text-[20px] font-extrabold tracking-tight md:text-[36px]">SCOOP</p>
          <h2 className="text-text-basic px-4 text-center text-[26px] font-bold tracking-tight break-keep md:text-[48px]">3단계로 완성하는 맞춤 이력서</h2>
        </Flex>

        <Flex direction="column" className="w-full gap-6 md:gap-15">
          {STEPS.map((step) => (
            <Flex
              key={step.number}
              direction={{ initial: 'column', md: 'row' }}
              align="center"
              className="shadow-2 w-full gap-6 rounded-3xl bg-white p-6 md:h-138.75 md:gap-16.5 md:rounded-[40px] md:p-16"
            >
              <Flex direction="column" className="w-full gap-4 md:w-125 md:shrink-0 md:gap-8">
                <div className="relative h-14 overflow-hidden opacity-90 md:h-40" aria-hidden>
                  <p className="font-elms text-primary-10 text-[80px] leading-none font-bold tracking-tight md:text-[220px]">{step.number}</p>
                </div>

                <Flex direction="column" className="gap-3 md:gap-6">
                  <Flex direction="column" className="gap-1 md:gap-2">
                    <h3 className="text-text-basic text-[28px] leading-tight font-bold tracking-tight md:text-[70px]">{step.titleEn}</h3>
                    <p className="text-text-disabled text-[16px] font-semibold tracking-tight md:text-[28px]">{step.titleKo}</p>
                  </Flex>
                  <Flex direction="column" className="text-text-subtle text-[14px] leading-normal md:text-[20px]">
                    {step.description.map((line) => (
                      <p key={line}>{line}</p>
                    ))}
                  </Flex>
                </Flex>
              </Flex>

              <Flex align="center" justify="center" className="bg-bg-gray-subtler w-full rounded-2xl p-5 md:w-137.5 md:shrink-0 md:rounded-[22px] md:p-10">
                {step.mockup}
              </Flex>
            </Flex>
          ))}
        </Flex>
      </Flex>
    </section>
  )
}

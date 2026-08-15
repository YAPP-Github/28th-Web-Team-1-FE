'use client'
import type { ReactNode } from 'react'
import { useRef, useState } from 'react'
import { ArrowRight, Check } from 'lucide-react'
import { motion, useMotionValueEvent, useScroll } from 'motion/react'
import { Flex } from '@radix-ui/themes'
import { cn } from '@shared/lib/cn'

const EASE_EXPO_OUT = [0.16, 1, 0.3, 1] as const

const StarInputMockup = () => {
  const fields = [
    { en: 'Situation', ko: '상황' },
    { en: 'Task', ko: '과업' },
    { en: 'Action', ko: '행동' },
    { en: 'Result', ko: '결과' }
  ]

  return (
    <Flex direction="column" className="w-full gap-1.5 md:gap-3.5">
      {fields.map((field) => (
        <Flex key={field.en} className="gap-1 md:gap-2.5">
          <Flex direction="column" justify="center" className="w-9 shrink-0 gap-0 md:w-17 md:gap-0.5">
            <p className="text-text-basic text-[7px] leading-tight font-semibold md:text-[13px]">{field.en}</p>
            <p className="text-text-subtler text-[6px] leading-tight md:text-[12px]">{field.ko}</p>
          </Flex>
          <Flex direction="column" justify="center" className="h-7 min-w-9 flex-1 gap-1 rounded-[6px] bg-white px-1 md:h-18 md:min-w-0 md:gap-2 md:rounded-[11px] md:px-4">
            <div className="bg-gray-10 h-0.5 w-[45%] rounded-full md:h-1.5" />
            <div className="bg-gray-10 h-0.5 w-[92%] rounded-full md:h-1.5" />
            <div className="bg-gray-10 h-0.5 w-[92%] rounded-full md:h-1.5" />
          </Flex>
        </Flex>
      ))}
    </Flex>
  )
}

const JobDescriptionMockup = () => {
  return (
    <Flex direction="column" align="center" className="w-full max-w-105">
      <Flex direction="column" align="center" className="shadow-3 relative z-10 w-full gap-0.5 rounded-xs bg-white px-2.5 py-2 text-center md:w-auto md:gap-1 md:rounded-xl md:px-4.5 md:py-3.5">
        <p className="text-text-basic text-[6px] leading-tight font-medium tracking-[-0.02em] text-balance md:text-base md:font-bold md:text-pretty">지원할 공고의 링크를 입력해주세요</p>
        <p className="text-text-subtle md:text-caption1 text-[5px] leading-normal text-balance md:text-pretty">공고 내용을 분석해, 가장 맞는 경험을 추천해 드릴게요.</p>
      </Flex>
      <div className="mb-2 h-0 w-0 border-x-4 border-t-4 border-x-transparent border-t-white md:mb-4 md:border-x-8 md:border-t-8" aria-hidden />

      <Flex direction="column" className="w-full gap-1 rounded-xs bg-white p-1.5 md:gap-2 md:rounded-xl md:p-2">
        <Flex align="center" className="bg-element-gray-light w-fit gap-0.5 rounded-[1.5px] p-0.5 md:gap-1 md:rounded-lg md:p-1">
          {['URL 붙여넣기', '원문 붙여넣기'].map((tab, index) => (
            <span
              key={tab}
              className={`rounded-[1px] px-1.5 py-0.5 text-[6px] font-semibold whitespace-nowrap md:rounded-md md:px-3 md:py-1.5 md:text-[10px] ${index === 0 ? 'text-text-basic shadow-1 bg-white' : 'text-text-subtler'}`}
            >
              {tab}
            </span>
          ))}
        </Flex>
        <Flex direction="column" className="gap-1 px-0.5 py-1 md:gap-2 md:px-1 md:py-1.5">
          <div className="bg-gray-10 h-0.5 w-[40%] rounded-full md:h-1" />
          <div className="bg-gray-10 h-0.5 w-[88%] rounded-full md:h-1" />
          <div className="bg-gray-10 h-0.5 w-[88%] rounded-full md:h-1" />
        </Flex>
        <Flex justify="end">
          <div className="bg-primary-50 flex size-4.5 items-center justify-center rounded-[2.5px] md:size-8 md:rounded-sm">
            <ArrowRight className="size-2.5 text-white md:size-4" size={16} />
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
        {[0, 1, 2].map((chip) => (
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

const CompactExperienceMatchCard = ({ label }: { label: string }) => (
  <Flex direction="column" className="shadow-2 min-w-0 flex-1 gap-0.5 rounded-xs bg-white p-1">
    <Flex align="center" justify="between">
      <Flex align="center" className="gap-1">
        <div className="border-border-subtle flex size-1.5 items-center justify-center rounded-[1.5px] border">
          <Check className="text-text-subtler" size={4.5} strokeWidth={5} />
        </div>
        <p className="text-text-bolder text-[6px] font-semibold">{label}</p>
      </Flex>
      <span className="bg-green-10 text-green-60 rounded-full p-0.5 text-[4px] leading-none">매칭률</span>
    </Flex>
    <Flex direction="column" className="gap-1">
      <div className="bg-bg-gray-subtle h-0.5 w-[40%] rounded-full" />
      <div className="bg-bg-gray-subtle h-0.5 w-full rounded-full" />
      <div className="bg-bg-gray-subtle h-0.5 w-full rounded-full" />
    </Flex>
  </Flex>
)

const CompactResumeSection = ({ label, children }: { label: string; children: ReactNode }) => (
  <Flex className="gap-1.5">
    <p className="text-text-subtler w-6.5 shrink-0 text-[4.5px] leading-tight">{label}</p>
    <Flex direction="column" className="min-w-0 flex-1 gap-0.5">
      {children}
    </Flex>
  </Flex>
)

const CompactResumeEntry = () => (
  <Flex direction="column" className="gap-0.5">
    <div className="bg-bg-gray-subtle h-0.5 w-[60%] rounded-full" />
    <div className="bg-bg-gray-subtle h-0.5 w-[75%] rounded-full" />
    <div className="bg-bg-gray-subtle h-0.5 w-[75%] rounded-full" />
  </Flex>
)

const MatchedExperienceMockupMobile = () => {
  const experiences = ['경험 1', '경험 2']

  return (
    <Flex direction="column" align="center" className="w-full gap-2 md:hidden">
      <Flex className="w-full gap-2">
        {experiences.map((experience) => (
          <CompactExperienceMatchCard key={experience} label={experience} />
        ))}
      </Flex>

      <ArrowRight className="text-primary-30 size-2 shrink-0 rotate-90 md:size-4" />

      <div className="shadow-3 w-[80%] rounded-xs bg-white p-1.5 md:rounded-xl md:p-2.5">
        <Flex direction="column" className="gap-1.5">
          <Flex align="center" justify="between">
            <p className="text-text-basic text-[7px] font-bold">김스쿱</p>
            <div className="bg-bg-gray-subtle h-0.5 w-6 rounded-full" />
          </Flex>
          <div className="border-border-subtler border-t" />

          <CompactResumeSection label="핵심역량">
            <div className="bg-bg-gray-subtle h-0.5 w-full rounded-full" />
            <div className="bg-bg-gray-subtle h-0.5 w-full rounded-full" />
            <div className="bg-bg-gray-subtle h-0.5 w-[55%] rounded-full" />
          </CompactResumeSection>

          <CompactResumeSection label="경험">
            <CompactResumeEntry />
            <CompactResumeEntry />
            <CompactResumeEntry />
          </CompactResumeSection>

          <CompactResumeSection label="학력">
            <CompactResumeEntry />
          </CompactResumeSection>
        </Flex>
      </div>
    </Flex>
  )
}

const MatchedExperienceMockupDesktop = () => {
  const experiences = ['경험 1', '경험 2', '경험 3']

  return (
    <Flex direction="row" align="center" className="hidden w-full gap-3 md:flex">
      <Flex direction="column" className="w-52.5 gap-2.5">
        {experiences.map((experience) => (
          <ExperienceMatchCard key={experience} label={experience} />
        ))}
      </Flex>

      <ArrowRight className="text-text-subtler shrink-0" size={18} />

      <Flex direction="column" className="shadow-3 min-w-0 flex-1 gap-3 rounded-xl bg-white p-4">
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

const MatchedExperienceMockup = () => (
  <>
    <MatchedExperienceMockupMobile />
    <MatchedExperienceMockupDesktop />
  </>
)

const STEPS = [
  {
    number: '01',
    titleEn: 'Experience',
    titleKo: '경험 정리',
    description: 'Notion, PDF 등 경험이 담긴 자료를 업로드해주세요. 혹은 떠오르는 경험을 자유롭게 작성해 주시면, AI가 이력서에 적합한 STAR 구조로 정리해 드려요.',
    mockup: <StarInputMockup />,
    glowPosition: 'top-right' as const,
    clipMockupMobile: false
  },
  {
    number: '02',
    titleEn: 'Job Description',
    titleKo: '채용 공고 분석',
    description: '지원하고 싶은 채용공고를 입력해주세요. 채용 공고를 분석해, 그에 맞는 경험을 추천해 드릴게요.',
    mockup: <JobDescriptionMockup />,
    glowPosition: 'bottom-left' as const,
    clipMockupMobile: false
  },
  {
    number: '03',
    titleEn: 'Resume',
    titleKo: '이력서 생성',
    description: 'AI가 채용공고를 분석해 가장 적합한 경험을 선별하고, 맞춤형 이력서를 자동으로 생성해 드려요.',
    mockup: <MatchedExperienceMockup />,
    glowPosition: 'right' as const,
    clipMockupMobile: true
  }
]

type Step = (typeof STEPS)[number]

const GLOW_POSITION_CLASSES: Record<Step['glowPosition'], string> = {
  'top-right': 'top-0 right-0 -translate-y-4 translate-x-4 md:-translate-y-1/4 md:translate-x-1/4',
  'bottom-left': 'bottom-0 left-0 translate-y-4 -translate-x-4 md:translate-y-1/4 md:-translate-x-1/4',
  right: 'top-1/2 right-0 -translate-y-1/2 translate-x-4 md:translate-x-1/4'
}

const StepGlow = ({ position }: { position: Step['glowPosition'] }) => (
  <div
    aria-hidden
    className={cn('pointer-events-none absolute -z-10 size-56 rounded-full bg-[radial-gradient(circle,#DFDBFE_0%,transparent_70%)] blur-2xl md:size-125', GLOW_POSITION_CLASSES[position])}
  />
)

const StepCard = ({ step }: { step: Step }) => (
  <Flex direction="row" align="center" justify="between" className="shadow-2 w-full gap-4 rounded-lg bg-white p-5 md:h-138.75 md:gap-16.5 md:rounded-[40px] md:p-16">
    <Flex direction="column" className="min-w-0 flex-1 gap-3 md:max-w-125 md:gap-8">
      <div className="relative h-14 overflow-hidden opacity-90 md:h-40" aria-hidden>
        <p className="font-elms text-primary-10 text-[80px] leading-none font-bold tracking-tight md:text-[220px]">{step.number}</p>
      </div>

      <Flex direction="column" className="gap-3 md:gap-6">
        <Flex direction="column" className="gap-1 md:gap-2">
          <h3 className="text-text-basic text-heading2 leading-tight font-bold tracking-tight whitespace-nowrap md:text-[70px]">{step.titleEn}</h3>
          <p className="text-text-disabled text-caption2 tracking-tight md:text-[28px] md:font-semibold">{step.titleKo}</p>
        </Flex>
        <p className="text-text-subtle text-[9px] leading-normal md:text-[20px]">{step.description}</p>
      </Flex>
    </Flex>

    <Flex
      align={step.clipMockupMobile ? { initial: 'start', md: 'center' } : 'center'}
      justify="center"
      className={cn('bg-bg-gray-subtler min-w-0 flex-1 rounded-sm p-2.5 md:h-full md:max-w-137.5 md:rounded-[22px] md:p-10', step.clipMockupMobile ? 'relative h-36 overflow-hidden' : 'h-full')}
    >
      {step.mockup}
    </Flex>
  </Flex>
)

const ProcessStepsMobile = () => (
  <Flex direction="column" className="w-full gap-6 md:hidden">
    {STEPS.map((step, index) => (
      <motion.div
        key={step.number}
        className="relative"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.7, ease: EASE_EXPO_OUT, delay: index * 0.1 }}
      >
        <StepGlow position={step.glowPosition} />
        <StepCard step={step} />
      </motion.div>
    ))}
  </Flex>
)

type StepPanelState = 'prev' | 'active' | 'next'

const STEP_PANEL_VARIANTS: Record<StepPanelState, { opacity: number; y: number }> = {
  prev: { opacity: 0, y: -40 },
  active: { opacity: 1, y: 0 },
  next: { opacity: 0, y: 40 }
}

const StepPanel = ({ step, state }: { step: Step; state: StepPanelState }) => (
  <motion.div
    className="absolute inset-0 flex items-center"
    style={{ zIndex: state === 'active' ? 1 : 0, pointerEvents: state === 'active' ? 'auto' : 'none' }}
    initial={false}
    animate={STEP_PANEL_VARIANTS[state]}
    transition={{ duration: 0.6, ease: EASE_EXPO_OUT }}
  >
    <StepGlow position={step.glowPosition} />
    <StepCard step={step} />
  </motion.div>
)

const SCROLL_VH_PER_STEP = 80

const ProcessStepsDesktop = () => {
  const trackRef = useRef<HTMLDivElement>(null)
  const [activeIndex, setActiveIndex] = useState(0)
  const { scrollYProgress } = useScroll({
    target: trackRef,
    offset: ['start start', 'end end']
  })

  useMotionValueEvent(scrollYProgress, 'change', (value) => {
    const nextIndex = Math.min(STEPS.length - 1, Math.floor(value * STEPS.length))
    setActiveIndex(nextIndex)
  })

  return (
    <div ref={trackRef} className="relative hidden w-full md:block" style={{ height: `${STEPS.length * SCROLL_VH_PER_STEP}vh` }}>
      <div className="sticky top-26.5 flex h-[calc(100vh-6.625rem)] items-center">
        {STEPS.map((step, index) => (
          <StepPanel key={step.number} step={step} state={index === activeIndex ? 'active' : index < activeIndex ? 'prev' : 'next'} />
        ))}
      </div>
    </div>
  )
}

export const ProcessStepsSection = () => {
  return (
    <section id="features" className="py-14 md:py-24">
      <Flex direction="column" align="center" className="w-full gap-10 md:gap-25">
        <Flex direction="column" align="center" className="mx-auto max-w-311.25 gap-2 md:gap-3">
          <p className="font-elms text-primary-50 text-[16px] font-extrabold tracking-tight md:text-[36px]">SCOOP</p>
          <h2 className="text-text-basic text-heading2 px-4 text-center font-bold tracking-tight break-keep md:text-[48px]">3단계로 완성하는 맞춤 이력서</h2>
        </Flex>

        <ProcessStepsMobile />
        <ProcessStepsDesktop />
      </Flex>
    </section>
  )
}

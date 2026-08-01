import { Check, FilePlus2 } from 'lucide-react'
import { Flex } from '@radix-ui/themes'
import { cn } from '@shared/lib/cn'

const RESUME_CARDS = [
  { label: '이력서 A', rotate: '-rotate-[20deg]', offsetY: 'top-8', z: 'z-10' },
  { label: '이력서 B', rotate: '-rotate-[9deg]', offsetY: 'top-16', z: 'z-20' },
  { label: '이력서 C', rotate: 'rotate-0', offsetY: 'top-1', z: 'z-10' },
  { label: '이력서 D', rotate: 'rotate-[14deg]', offsetY: 'top-18', z: 'z-20' },
  { label: '이력서 E', rotate: 'rotate-[24deg]', offsetY: 'top-0', z: 'z-10' }
]

export const UploadFeatureSection = () => {
  return (
    <section className="relative overflow-hidden bg-white pt-24 pb-16">
      <Flex justify="center" className="mx-auto max-w-308.5 gap-8">
        <Flex direction="column" className="border-primary-20 shadow-3 flex-1 gap-5 rounded-4xl border-2 bg-white p-9.5">
          <Flex align="center" className="gap-8">
            <div className="bg-primary-5 text-primary-50 flex size-20 shrink-0 items-center justify-center rounded-[23px]">
              <FilePlus2 size={32} />
            </div>
            <h3 className="text-text-basic text-[36px] leading-[1.3] font-bold tracking-tight">pdf 업로드</h3>
          </Flex>
          <p className="text-text-subtle text-[24px] leading-[1.6] tracking-[-0.01em]">이미 만들어둔 이력서를 등록해 두면, 기본 정보와 경력을 불러 와서 이력서 초안을 만들 때 활용해요.</p>
        </Flex>
        <Flex direction="column" className="border-primary-20 shadow-3 flex-1 gap-5 rounded-4xl border-2 bg-white p-9.5">
          <Flex align="center" className="gap-8">
            <div className="bg-primary-5 flex size-20 shrink-0 items-center justify-center rounded-[23px]">
              <img src="/landing/notion-mark.png" alt="" className="h-9 w-auto" />
            </div>
            <h3 className="text-text-basic text-[36px] leading-[1.3] font-bold tracking-tight">노션 연동</h3>
          </Flex>
          <p className="text-text-subtle text-[24px] leading-[1.6] tracking-[-0.01em]">Notion을 연결하면 정리해 둔 경험을 내 이력서에 맞는 형태로 만들어 드려요.</p>
        </Flex>
      </Flex>

      <div className="relative mt-4 flex flex-col items-center overflow-hidden pt-32 pb-24">
        <div className="bg-primary-30 absolute top-0 left-1/2 h-350 w-[160%] max-w-400 -translate-x-1/2 rounded-full" aria-hidden />

        <img src="/landing/upload-arrows.svg" alt="" className="relative mt-2 block h-15 w-107" aria-hidden />

        <div className="relative mx-auto mt-8 h-80 w-250 max-w-full">
          {RESUME_CARDS.map((card, index) => (
            <div
              key={card.label}
              className={cn('shadow-2 absolute h-65 w-54 rounded-2xl border border-white bg-white px-6.5 py-6', card.rotate, card.offsetY, card.z)}
              style={{ left: `${index * 196}px` }}
            >
              <Flex align="center" justify="between">
                <div className="relative">
                  <span className="bg-primary-5 absolute inset-x-0 bottom-0.5 h-2.5 rounded-full" aria-hidden />
                  <p className="text-text-subtler relative text-[24px] leading-[1.35] font-bold tracking-[-0.02em]">{card.label}</p>
                </div>
                <span className="bg-primary-10 size-7.5 shrink-0 rounded-full" aria-hidden />
              </Flex>
              <Flex direction="column" className="mt-8 gap-5">
                <div className="bg-primary-10 h-3.5 w-full rounded-full" />
                <div className="bg-primary-10 h-3.5 w-full rounded-full" />
                <div className="bg-primary-10 h-3.5 w-full rounded-full" />
                <div className="bg-primary-10 h-3.5 w-full rounded-full" />
              </Flex>
            </div>
          ))}
        </div>

        <Flex align="center" className="relative mt-8 gap-4" direction="column">
          <div className="flex size-10 items-center justify-center rounded-full bg-white">
            <Check className="text-primary-50" size={22} />
          </div>
          <p className="text-[40px] leading-[1.3] font-bold tracking-tight text-white">이력서 자동 생성 완료</p>
        </Flex>
      </div>
    </section>
  )
}

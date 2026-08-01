import { Check, FilePlus2 } from 'lucide-react'
import { Flex } from '@radix-ui/themes'
import { cn } from '@shared/lib/cn'
import { NotionIcon } from '@shared/icon'

const RESUME_CARDS = [
  { label: '이력서 A', rotate: '-rotate-[15.7deg]', offsetY: 'top-6', z: 'z-10' },
  { label: '이력서 B', rotate: '-rotate-[6.4deg]', offsetY: 'top-11', z: 'z-20' },
  { label: '이력서 C', rotate: 'rotate-0', offsetY: 'top-8', z: 'z-30' },
  { label: '이력서 D', rotate: 'rotate-[11.19deg]', offsetY: 'top-11', z: 'z-20' },
  { label: '이력서 E', rotate: 'rotate-[19.67deg]', offsetY: 'top-0', z: 'z-10' }
]

export const UploadFeatureSection = () => {
  return (
    <section className="relative overflow-hidden bg-white pt-24 pb-16">
      <Flex justify="center" className="mx-auto max-w-[1234px] gap-8">
        <Flex align="center" className="border-primary-20 shadow-3 flex-1 gap-8 rounded-[32px] border-2 bg-white p-9.5">
          <div className="bg-primary-5 text-primary-50 flex size-20 shrink-0 items-center justify-center rounded-[23px]">
            <FilePlus2 size={32} />
          </div>
          <Flex direction="column" className="gap-1">
            <h3 className="text-text-basic text-[36px] leading-[1.3] font-bold tracking-[-0.025em]">pdf 업로드</h3>
            <p className="text-text-subtle text-[24px] leading-[1.6] tracking-[-0.01em]">이미 만들어둔 이력서를 등록해 두면, 기본 정보와 경력을 불러 와서 이력서 초안을 만들 때 활용해요.</p>
          </Flex>
        </Flex>
        <Flex align="center" className="border-primary-20 shadow-3 flex-1 gap-8 rounded-[32px] border-2 bg-white p-9.5">
          <div className="bg-primary-5 flex size-20 shrink-0 items-center justify-center rounded-[23px]">
            <NotionIcon size={36} />
          </div>
          <Flex direction="column" className="gap-1">
            <h3 className="text-text-basic text-[36px] leading-[1.3] font-bold tracking-[-0.025em]">노션 연동</h3>
            <p className="text-text-subtle text-[24px] leading-[1.6] tracking-[-0.01em]">Notion을 연결하면 정리해 둔 경험을 내 이력서에 맞는 형태로 만들어 드려요.</p>
          </Flex>
        </Flex>
      </Flex>

      <img src="/landing/upload-arrows.svg" alt="" className="mx-auto mt-4 block h-15 w-[428px] opacity-70" aria-hidden />

      <div className="bg-primary-30 relative mt-4 flex flex-col items-center overflow-hidden rounded-t-[50%] pt-32 pb-24">
        <div className="relative mx-auto h-[300px] w-[856px] max-w-full">
          {RESUME_CARDS.map((card, index) => (
            <div
              key={card.label}
              className={cn('shadow-2 absolute h-[260px] w-[216px] rounded-2xl border border-white bg-white p-4', card.rotate, card.offsetY, card.z)}
              style={{ left: `${index * 160}px` }}
            >
              <Flex align="center" justify="between">
                <p className="text-text-subtler text-[24px] leading-[1.35] font-bold tracking-[-0.02em]">{card.label}</p>
                <span className="bg-primary-10 size-[30px] shrink-0 rounded-full" aria-hidden />
              </Flex>
              <Flex direction="column" className="mt-4 gap-3.5">
                <div className="bg-primary-5 h-3.5 w-[45%] rounded-full" />
                <div className="bg-primary-10 h-3.5 w-full rounded-full" />
                <div className="bg-primary-10 h-3.5 w-full rounded-full" />
                <div className="bg-primary-10 h-3.5 w-full rounded-full" />
                <div className="bg-primary-10 h-3.5 w-full rounded-full" />
              </Flex>
            </div>
          ))}
        </div>

        <Flex align="center" className="relative mt-8 gap-4">
          <div className="flex size-10 items-center justify-center rounded-full bg-white">
            <Check className="text-primary-50" size={22} />
          </div>
          <p className="text-[40px] leading-[1.3] font-bold tracking-[-0.025em] text-white">이력서 자동 생성 완료</p>
        </Flex>
      </div>
    </section>
  )
}

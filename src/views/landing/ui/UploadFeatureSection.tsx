import { ArrowDownRight, Check, FilePlus2 } from 'lucide-react'
import { Flex } from '@radix-ui/themes'
import { Heading, Text } from '@shared/ui'
import { NotionIcon } from '@shared/icon'

const RESUME_CARDS = [
  { label: '이력서 A', rotate: '-rotate-6', z: 'z-10' },
  { label: '이력서 B', rotate: '-rotate-3', z: 'z-20' },
  { label: '이력서 C', rotate: 'rotate-0', z: 'z-30' },
  { label: '이력서 D', rotate: 'rotate-3', z: 'z-20' },
  { label: '이력서 E', rotate: 'rotate-6', z: 'z-10' }
]

export const UploadFeatureSection = () => {
  return (
    <section className="overflow-hidden bg-white pt-24">
      <Flex justify="center" gap="6" className="mx-auto max-w-[1234px]">
        <Flex direction="column" gap="4" className="border-border-subtler flex-1 rounded-2xl border p-8">
          <div className="bg-primary-5 text-primary-50 flex size-14 items-center justify-center rounded-xl">
            <FilePlus2 size={28} />
          </div>
          <Heading variant="heading1" color="text-basic">
            pdf 업로드
          </Heading>
          <Text variant="body1" color="text-subtle">
            이미 만들어둔 이력서를 등록해 두면, 기본 정보와 경력을 불러와서 이력서 초안을 만들 때 활용해요.
          </Text>
        </Flex>
        <Flex direction="column" gap="4" className="border-border-subtler flex-1 rounded-2xl border p-8">
          <div className="bg-primary-5 flex size-14 items-center justify-center rounded-xl">
            <NotionIcon />
          </div>
          <Heading variant="heading1" color="text-basic">
            노션 연동
          </Heading>
          <Text variant="body1" color="text-subtle">
            Notion을 연결하면 정리해 둔 경험을 내 이력서에 맞는 형태로 만들어 드려요.
          </Text>
        </Flex>
      </Flex>

      <Flex justify="center" gap="80" className="mx-auto mt-6 max-w-[624px]">
        <ArrowDownRight className="text-white/70" size={32} />
        <ArrowDownRight className="scale-x-[-1] text-white/70" size={32} />
      </Flex>

      <div className="bg-primary-40 relative mt-6 flex flex-col items-center overflow-hidden rounded-t-[50%] pt-24 pb-16">
        <div className="relative flex h-[180px] w-full max-w-[640px] items-center justify-center">
          {RESUME_CARDS.map((card, index) => (
            <div key={card.label} className={`shadow-2 absolute h-[160px] w-[120px] ${card.rotate} ${card.z} rounded-xl bg-white p-3`} style={{ left: `${index * 90}px` }}>
              <Flex align="center" justify="between">
                <Text variant="caption2" color="text-subtler" weight="semibold">
                  {card.label}
                </Text>
                <span className="bg-primary-10 size-3 rounded-full" aria-hidden />
              </Flex>
              <Flex direction="column" gap="1.5" className="mt-3">
                <div className="bg-bg-gray-subtle h-1.5 w-full rounded-full" />
                <div className="bg-bg-gray-subtle h-1.5 w-full rounded-full" />
                <div className="bg-bg-gray-subtle h-1.5 w-3/4 rounded-full" />
              </Flex>
            </div>
          ))}
        </div>

        <Flex align="center" gap="2" className="relative mt-8">
          <div className="flex size-6 items-center justify-center rounded-full bg-white">
            <Check className="text-primary-50" size={16} />
          </div>
          <Text variant="headline1" color="text-bolder-inverse" weight="semibold">
            이력서 자동 생성 완료
          </Text>
        </Flex>
      </div>
    </section>
  )
}

'use client'
import { Flex } from '@radix-ui/themes'
import { Text } from '@shared/ui'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@shared/ui/dialog'

export type ResumeCreateMethod = 'import' | 'scratch'

interface ResumeCreateMethodDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSelect: (method: ResumeCreateMethod) => void
}
export const ResumeCreateMethodDialog = ({ open, onOpenChange, onSelect }: ResumeCreateMethodDialogProps) => (
  <Dialog open={open} onOpenChange={onOpenChange}>
    <DialogContent aria-describedby={undefined} className="w-94.5 gap-10">
      <DialogHeader>
        <DialogTitle className="text-headline1 text-text-basic font-semibold">이력서 어떻게 만들까요?</DialogTitle>
      </DialogHeader>
      <Flex direction="column" gap="3">
        <MethodCard
          title="기존 내 이력서에서 추출하기"
          description={`파일을 업로드하면 AI가 분석하여\n채용 공고에 맞는 이력서를 생성합니다.`}
          thumbnail={<ImportThumbnail />}
          onClick={() => onSelect('import')}
        />
        <MethodCard
          title="처음부터 만들기"
          description={`빈 이력서에서 AI와 함께 채용 공고에 맞는\n경험을 선택하고 이력서를 만듭니다.`}
          thumbnail={<ScratchThumbnail />}
          onClick={() => onSelect('scratch')}
        />
      </Flex>
    </DialogContent>
  </Dialog>
)

const MethodCard = ({ title, description, thumbnail, onClick }: { title: string; description: string; thumbnail: React.ReactNode; onClick: () => void }) => (
  <button type="button" onClick={onClick} className="bg-element-gray-lighter flex items-center justify-between gap-4 rounded-lg p-6 text-left">
    <Flex direction="column" gap="6px">
      <Text variant="headline2" weight="semibold" className="text-text-basic">
        {title}
      </Text>
      <Text variant="caption1" className="text-text-subtle break-keep whitespace-pre-line">
        {description}
      </Text>
    </Flex>
    {thumbnail}
  </button>
)

// 이력서 문서 일러스트(제목·상태 점·본문 라인)
const ImportThumbnail = () => (
  <span aria-hidden className="bg-element-gray-light relative h-15 w-12.5 shrink-0 overflow-clip rounded-[3.7px]">
    <span className="bg-primary-0 absolute top-3 left-1.5 h-1 w-6 rounded-full" />
    <span className="text-gray-95 absolute top-1.25 left-[7.64px] text-[8px] leading-[1.35] font-bold tracking-[-0.16px]">이력서</span>
    <span className="bg-primary-10 absolute top-1.75 left-9 size-2 rounded-full" />
    <span className="absolute top-5.5 left-[6.48px] flex flex-col gap-[5.55px]">
      {Array.from({ length: 4 }, (_, i) => (
        <span key={i} className="bg-primary-30 h-[3.24px] w-9.25 rounded-full" />
      ))}
    </span>
  </span>
)

// 빈 문서 + 플러스 일러스트
const ScratchThumbnail = () => (
  <span aria-hidden className="bg-element-gray-light relative flex h-15 w-12.5 shrink-0 items-center justify-center rounded-[3.7px]">
    <span className="bg-gray-0 relative flex size-6.5 items-center justify-center rounded-full">
      <span className="bg-primary-30 absolute h-[2.8px] w-4.25 rounded-full" />
      <span className="bg-primary-30 absolute h-4.25 w-[2.8px] rounded-full" />
    </span>
  </span>
)

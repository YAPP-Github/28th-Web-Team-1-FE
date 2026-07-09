import { Flex } from '@radix-ui/themes'
import { Button } from '@shared/ui'
import { Textarea } from '@shared/ui/textarea'
import { DialogHeader, DialogTitle, DialogDescription } from '@shared/ui/dialog'
import { ChevronLeft } from 'lucide-react'
import { AddProjectTabs } from './AddProjectTabs'

export const AddProjectManualView = ({ onBack }: { onBack: () => void }) => {
  return (
    <>
      <DialogHeader>
        <Flex direction="row" align="center" className="gap-2">
          <button onClick={() => onBack()} aria-label="이전으로" className="text-icon-gray">
            <ChevronLeft size={24} />
          </button>
          <DialogTitle className="text-title3 text-text-basic font-bold">직접 입력하기</DialogTitle>
        </Flex>
        <DialogDescription className="text-body1 text-text-subtler">떠오르는 경험을 자유롭게 작성해 주세요. AI가 이력서에 적합한 STAR 구조로 정리해 드려요.</DialogDescription>
      </DialogHeader>
      <Flex direction="column" className="max-h-[60vh] gap-4 overflow-y-auto">
        <AddProjectTabs />
        <Textarea label="경험내용" placeholder="텍스트를 입력해주세요." maxLength={null} />
      </Flex>
      <Button variant="primary" size="xl" className="w-full">
        경험 추출하기
      </Button>
    </>
  )
}

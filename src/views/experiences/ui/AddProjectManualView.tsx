import { useState } from 'react'
import { Flex } from '@radix-ui/themes'
import { Button } from '@shared/ui'
import { Textarea } from '@shared/ui/textarea'
import { DialogHeader, DialogTitle, DialogDescription } from '@shared/ui/dialog'
import { ChevronLeft } from 'lucide-react'
import { ProjectSelectPopover } from './ProjectSelectPopover'
import { ProjectCreatePopover } from './ProjectCreatePopover'

const PROJECTS = ['프로젝트1', '프로젝트2', '프로젝트3', '프로젝트4']

export const AddProjectManualView = ({ onBack, onExtract }: { onBack: () => void; onExtract: () => void }) => {
  const [selected, setSelected] = useState(PROJECTS[0])

  const handleSelectProject = (project: string) => {
    setSelected(project)
  }

  const handleCreateProject = (name: string) => {
    // TODO : 실제 프로젝트 추가 연동 필요
    console.log('create project:', name)
  }

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
      <Flex direction="column" className="max-h-[60vh] gap-6 overflow-y-auto">
        <Flex className="gap-2">
          {PROJECTS.length > 0 && <ProjectSelectPopover projects={PROJECTS} selected={selected} onSelect={handleSelectProject} />}
          <ProjectCreatePopover projects={PROJECTS} onCreate={handleCreateProject} />
        </Flex>
        <Textarea label="경험내용" placeholder="텍스트를 입력해주세요." maxLength={null} />
      </Flex>
      <Button variant="primary" size="xl" className="w-full" onClick={() => onExtract()}>
        경험 추출하기
      </Button>
    </>
  )
}

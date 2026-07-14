import { toast } from 'sonner'
import { useState } from 'react'
import { ChevronDown, ChevronLeft, Plus } from 'lucide-react'
import { Flex } from '@radix-ui/themes'
import { useProjectOptions, type CreateProjectInput } from '@entities/project'
import { useWorkspaceId } from '@entities/user'
import { Button, Text } from '@shared/ui'
import { Textarea } from '@shared/ui/textarea'
import { DialogHeader, DialogTitle, DialogDescription } from '@shared/ui/dialog'
import { cn } from '@shared/lib/cn'
import { Popover, PopoverContent, PopoverTrigger } from '@shared/ui/popover'
import { Input } from '@shared/ui/input'

export const AddProjectManualView = ({ onBack, onExtract }: { onBack: () => void; onExtract: (input: CreateProjectInput) => void }) => {
  const [selected, setSelected] = useState('')
  const [content, setContent] = useState('')
  const [createdProjects, setCreatedProjects] = useState<string[]>([])
  const workspaceId = useWorkspaceId()

  // 서버의 기존 프로젝트 목록 + 화면에서 새로 추가한 이름(아직 생성 전)을 합쳐 선택지로 보여준다.
  const serverProjectNames = useProjectOptions(workspaceId).map((project) => project.name)
  const projects = [...createdProjects, ...serverProjectNames.filter((name) => !createdProjects.includes(name))]

  // 명시적으로 고르지 않았으면 목록 첫 번째 프로젝트를 기본 선택으로 사용한다.
  const selectedProject = selected || projects[0] || ''

  const handleCreateProject = (name: string) => {
    setCreatedProjects((prev) => (prev.includes(name) ? prev : [name, ...prev]))
    setSelected(name)
  }

  const handleExtract = () => {
    if (!selectedProject) {
      toast.warning('프로젝트를 먼저 추가해 주세요.', { id: 'project-required', position: 'top-center' })
      return
    }
    if (!content.trim()) {
      toast.warning('경험 내용을 입력해 주세요.', { id: 'content-required', position: 'top-center' })
      return
    }
    onExtract({ name: selectedProject, summary: content })
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
          {projects.length > 0 && <ProjectSelectPopover projects={projects} selected={selectedProject} onSelect={setSelected} />}
          <ProjectCreatePopover projects={projects} onCreate={handleCreateProject} />
        </Flex>
        <Textarea label="경험내용" placeholder="텍스트를 입력해주세요." maxLength={null} value={content} onChange={(e) => setContent(e.target.value)} />
      </Flex>
      <Button variant="primary" size="xl" className="w-full" onClick={handleExtract}>
        경험 추출하기
      </Button>
    </>
  )
}

interface ProjectCreatePopoverProps {
  projects: string[]
  onCreate: (name: string) => void
}
const ProjectCreatePopover = ({ projects, onCreate }: ProjectCreatePopoverProps) => {
  const MAX_LENGTH = 20
  const [isOpen, setIsOpen] = useState(false)
  const [text, setText] = useState('')

  const handleChange = (value: string) => {
    if (value.length > MAX_LENGTH) {
      // 같은 id로 재사용해 연타 시 토스트가 쌓이지 않도록 함
      toast.warning(`프로젝트 명은 ${MAX_LENGTH}자까지 입력할 수 있어요.`, { id: 'project-name-max', position: 'top-center' })
      return
    }
    setText(value)
  }

  const handleCreate = () => {
    onCreate(text)
    setText('')
    setIsOpen(false)
  }

  return (
    <Popover open={isOpen} onOpenChange={(open) => setIsOpen(open)}>
      <PopoverTrigger asChild>
        {projects.length === 0 ? (
          <Button
            variant="secondary"
            size="md"
            className={cn(
              'bg-btn-tertiary-fill text-icon-gray border-transparent',
              // open
              'data-[state=open]:bg-btn-secondary-fill-pressed data-[state=open]:text-text-primary-bolder data-[state=open]:border-btn-secondary-border-pressed'
            )}
          >
            <Plus size={18} />
            신규 프로젝트 생성
          </Button>
        ) : (
          <Button
            variant="secondary"
            size="icon-md"
            className={cn(
              'bg-btn-tertiary-fill text-icon-gray border-transparent',
              // open
              'data-[state=open]:bg-btn-secondary-fill-pressed data-[state=open]:text-text-primary-bolder data-[state=open]:border-btn-secondary-border-pressed'
            )}
          >
            <Plus size={18} />
          </Button>
        )}
      </PopoverTrigger>
      <PopoverContent sideOffset={10} align="start" className="shadow-1 w-max max-w-lg min-w-80 overflow-hidden rounded-sm">
        <div className="bg-bg-gray-subtler px-2.5 py-2.5">
          <Input placeholder="프로젝트 명을 직접 입력해서 추가할 수 있어요." value={text} onChange={(e) => handleChange(e.target.value)} />
        </div>
        {text && (
          <div className="bg-bg-gray-subtler border-btn-outline-border border-t px-2.5 py-2.5">
            <button
              type="button"
              onClick={handleCreate}
              className={cn(
                'border-btn-secondary-border bg-btn-secondary-fill text-text-primary-basic text-body2 flex w-full items-center gap-1 rounded-lg border border-dashed px-4 py-3 whitespace-nowrap',
                //hover
                'hover:bg-btn-secondary-fill-hovered hover:font-semibold'
              )}
            >
              <Plus size={18} />`{text}` 직접 추가
            </button>
          </div>
        )}
      </PopoverContent>
    </Popover>
  )
}

interface ProjectSelectPopoverProps {
  projects: string[]
  selected: string
  onSelect: (project: string) => void
}
const ProjectSelectPopover = ({ projects, selected, onSelect }: ProjectSelectPopoverProps) => {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <Popover open={isOpen} onOpenChange={(open) => setIsOpen(open)}>
      <PopoverTrigger asChild>
        <Button
          variant="secondary"
          size="md"
          className={cn(
            'bg-btn-tertiary-fill text-icon-gray max-w-50 border-transparent',
            // open
            'data-[state=open]:bg-btn-secondary-fill-pressed data-[state=open]:text-text-primary-bolder data-[state=open]:border-btn-secondary-border-pressed'
          )}
        >
          <span className="min-w-0 truncate">{selected}</span>
          <ChevronDown className="shrink-0" />
        </Button>
      </PopoverTrigger>
      <PopoverContent sideOffset={10} align="start" className="shadow-1 max-w-60 overflow-hidden rounded-sm">
        {projects.map((project) => (
          <button
            key={project}
            type="button"
            onClick={() => {
              onSelect(project)
              setIsOpen(false)
            }}
            className="text-text-subtle hover:text-text-basic bg-element-gray-lighter hover:bg-element-gray-light px-3 py-2.5 text-start"
          >
            <Text variant="body2">{project}</Text>
          </button>
        ))}
      </PopoverContent>
    </Popover>
  )
}

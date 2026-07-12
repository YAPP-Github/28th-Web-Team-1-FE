import { useState } from 'react'
import { Plus } from 'lucide-react'
import { toast } from 'sonner'
import { cn } from '@shared/lib/cn'
import { Button } from '@shared/ui'
import { Popover, PopoverContent, PopoverTrigger } from '@shared/ui/popover'
import { Input } from '@/src/shared/ui/input'

const MAX_LENGTH = 20

interface ProjectCreatePopoverProps {
  projects: string[]
  onCreate: (name: string) => void
}
export const ProjectCreatePopover = ({ projects, onCreate }: ProjectCreatePopoverProps) => {
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
      <PopoverContent sideOffset={10} align="start" className="shadow-1 max-w-lg min-w-80 overflow-hidden rounded-sm">
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

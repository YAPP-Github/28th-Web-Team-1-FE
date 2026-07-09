import { useState } from 'react'
import { ChevronDown, Plus } from 'lucide-react'
import { Flex } from '@radix-ui/themes'
import { cn } from '@shared/lib/cn'
import { Button, Text } from '@shared/ui'
import { Popover, PopoverContent, PopoverTrigger } from '@shared/ui/popover'
import { Input } from '@/src/shared/ui/input'

// TODO : 실제 프로젝트 목록/추가 연동 예정
const PROJECTS = ['프로젝트 1ddddddddddddddddddddddddd', '프로젝트 2', '프로젝트 3']

export const AddProjectTabs = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [isAddOpen, setIsAddOpen] = useState(false)
  const [text, setText] = useState('')
  const [selected, setSelected] = useState(PROJECTS[0])

  const handleSelect = (project: string) => {
    setSelected(project)
    setIsOpen(false)
  }

  return (
    <Flex className="gap-2">
      <Popover open={isOpen} onOpenChange={(open) => setIsOpen(open)}>
        <PopoverTrigger asChild>
          <Button
            variant="secondary"
            size="md"
            className={cn(
              'bg-btn-tertiary-fill text-icon-gray border-transparent',
              // open
              'data-[state=open]:bg-btn-secondary-fill-pressed data-[state=open]:text-text-primary-bolder data-[state=open]:border-btn-secondary-border-pressed'
            )}
          >
            {selected} <ChevronDown />
          </Button>
        </PopoverTrigger>
        <PopoverContent sideOffset={10} align="start" className="shadow-1 w-60 overflow-hidden rounded-sm">
          {PROJECTS.map((project) => (
            <button
              key={project}
              type="button"
              onClick={() => handleSelect(project)}
              className="text-text-subtle hover:text-text-basic bg-element-gray-lighter hover:bg-element-gray-light px-3 py-2.5 text-start"
            >
              <Text variant="body2">{project}</Text>
            </button>
          ))}
        </PopoverContent>
      </Popover>
      <Popover open={isAddOpen} onOpenChange={(open) => setIsAddOpen(open)}>
        <PopoverTrigger asChild>
          <Button
            variant="secondary"
            size="icon-md"
            className={cn(
              'bg-btn-tertiary-fill text-icon-gray border-transparent',
              // open
              'data-[state=open]:bg-btn-secondary-fill-pressed data-[state=open]:text-text-primary-bolder data-[state=open]:border-btn-secondary-border-pressed'
            )}
          >
            <Plus />
          </Button>
        </PopoverTrigger>
        <PopoverContent sideOffset={10} align="start" className="shadow-1 w-80 overflow-hidden rounded-sm">
          <div className="bg-bg-gray-subtler px-2.5 py-2.5">
            <Input placeholder="프로젝트 명을 직접 입력해서 추가할 수 있어요." value={text} onChange={(e) => setText(e.target.value)} />
          </div>
          {text && (
            <div className="bg-bg-gray-subtler border-btn-outline-border border-t px-2.5 py-2.5">
              <button
                className={cn(
                  'border-btn-secondary-border bg-btn-secondary-fill text-text-primary-basic text-body2 flex w-full items-center gap-1 rounded-lg border border-dashed px-4 py-3',
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
    </Flex>
  )
}

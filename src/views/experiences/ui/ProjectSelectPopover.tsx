import { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { cn } from '@shared/lib/cn'
import { Button, Text } from '@shared/ui'
import { Popover, PopoverContent, PopoverTrigger } from '@shared/ui/popover'

interface ProjectSelectPopoverProps {
  projects: string[]
  selected: string
  onSelect: (project: string) => void
}

export const ProjectSelectPopover = ({ projects, selected, onSelect }: ProjectSelectPopoverProps) => {
  const [isOpen, setIsOpen] = useState(false)

  const handleSelect = (project: string) => {
    onSelect(project)
    setIsOpen(false)
  }

  return (
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
        {projects.map((project) => (
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
  )
}

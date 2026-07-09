'use client'
import { NotionIcon } from '@shared/icon'
import { cn } from '@shared/lib/cn'
import { Flex } from '@radix-ui/themes'
import { Button, Text } from '@shared/ui'
import { Textarea } from '@shared/ui/textarea'
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@shared/ui/dialog'
import { ChevronLeft, FilePlusCorner, Pencil, Trash2 } from 'lucide-react'
import { useRef, useState, type DragEvent } from 'react'

type DialogView = 'default' | 'manual'

export const AddProjectDialog = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [view, setView] = useState<DialogView>('default')

  const handleOpenChange = (next: boolean) => {
    // 열 때마다 기본 화면으로 초기화 (닫는 애니메이션 중 화면이 바뀌는 깜빡임 방지)
    if (next) setView('default')
    setIsOpen(next)
  }

  const renderView = () => {
    switch (view) {
      case 'manual':
        return <ManualInputView onBack={() => setView('default')} />
      case 'default':
      default:
        return <DefaultView onManualClick={() => setView('manual')} />
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button variant="secondary" size="md">
          프로젝트 추가하기
        </Button>
      </DialogTrigger>
      <DialogContent className="w-200">{renderView()}</DialogContent>
    </Dialog>
  )
}

const DefaultView = ({ onManualClick }: { onManualClick: () => void }) => {
  const inputRef = useRef<HTMLInputElement>(null)
  const [file, setFile] = useState<File | null>(null)
  const [isDragging, setIsDragging] = useState(false)

  const selectFile = (selected: File | undefined) => {
    if (!selected) return
    setFile(selected)
  }

  const handleDrop = (e: DragEvent<HTMLButtonElement>) => {
    e.preventDefault()
    setIsDragging(false)
    selectFile(e.dataTransfer.files[0])
  }

  const handleClearFile = () => {
    setFile(null)
    if (inputRef.current) inputRef.current.value = ''
  }

  return (
    <>
      <DialogHeader>
        <DialogTitle className="text-title3 text-text-basic font-bold">프로젝트 추가하기</DialogTitle>
        <DialogDescription className="text-body1 text-text-subtler">한 번 정리해 두면 언제든 이력서에 불러와 사용할 수 있어요.</DialogDescription>
      </DialogHeader>
      <Flex direction="column" className="h-100 gap-4">
        <input ref={inputRef} type="file" accept=".pdf" className="hidden" onChange={(e) => selectFile(e.target.files?.[0])} />
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          onDragOver={(e) => {
            e.preventDefault()
            setIsDragging(true)
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          className={cn(
            'border-btn-outline-border bg-element-gray-lighter flex w-full flex-1 flex-col items-center justify-center gap-2 rounded-lg border border-dashed',
            // TODO : 인터렉션 추가 시 변경 필요
            isDragging ? 'border-btn-secondary-border' : '',
            'hover:border-btn-secondary-border hover:bg-element-primary-lighter'
          )}
        >
          <FilePlusCorner size={24} className="text-text-subtler" />
          <Flex direction="column" align="center" className="gap-0.5">
            <Text variant="headline2" color="text-subtler">
              이력서 파일을 드래그하거나 선택해 주세요.
            </Text>
            <Text variant="caption1" color="text-subtler">
              지원가능 파일 : pdf (최대 4.5MB까지 업로드 가능)
            </Text>
          </Flex>
        </button>
        {file ? (
          <Flex direction="column" align="start" className="gap-2">
            <Text variant="headline2" color="text-basic">
              업로드된 파일
            </Text>
            <Flex direction="row" align="center" justify="between" className="bg-bg-gray-subtler w-full rounded-lg px-4 py-3">
              <Text variant="headline2" color="text-basic">
                {file.name}
              </Text>
              <Button variant="danger" size="xs" onClick={handleClearFile} className="w-7.5">
                <Trash2 size={12} />
              </Button>
            </Flex>
            <Button variant="primary" size="xl" className="mt-6 w-full">
              경험 추출하기
            </Button>
          </Flex>
        ) : (
          <DialogFooter>
            <ExperiencesButton title="직접 정리" description="STAR 방식으로 직접 정리하기" icon={<Pencil size={18} />} onClick={() => onManualClick()} />
            <ExperiencesButton title="Notion" description="페이지, 워크스페이스 가져오기" icon={<NotionIcon size={20} />} />
          </DialogFooter>
        )}
      </Flex>
    </>
  )
}

const ManualInputView = ({ onBack }: { onBack: () => void }) => {
  return (
    <>
      <DialogHeader>
        <Flex direction="row" align="center" className="gap-1">
          <button onClick={() => onBack()} aria-label="이전으로" className="text-icon-gray">
            <ChevronLeft size={24} />
          </button>
          <DialogTitle className="text-title3 text-text-basic font-bold">직접 입력하기</DialogTitle>
        </Flex>
        <DialogDescription className="text-body1 text-text-subtler">떠오르는 경험을 자유롭게 작성해 주세요. AI가 이력서에 적합한 STAR 구조로 정리해 드려요.</DialogDescription>
      </DialogHeader>
      <Flex direction="column" className="max-h-[60vh] gap-4 overflow-y-auto">
        <Textarea label="경험내용" placeholder="텍스트를 입력해주세요." />
      </Flex>
      <Button variant="primary" size="xl" className="w-full">
        경험 추출하기
      </Button>
    </>
  )
}

const ExperiencesButton = ({ title, description, icon, className, ...props }: { title: string; description: string; icon: React.ReactNode } & React.ComponentProps<'button'>) => {
  return (
    <button
      type="button"
      className={cn(
        'ring-btn-outline-border flex w-full flex-row items-center gap-2.5 rounded-sm px-2.5 py-2.5 ring-1 ring-inset',
        // TODO : 인터렉션 추가 시 변경 필요
        //hover
        'hover:bg-element-primary-lighter hover:ring-btn-secondary-border',
        className
      )}
      {...props}
    >
      <div className="bg-btn-tertiary-fill flex h-10.5 w-10.5 items-center justify-center rounded-lg">{icon}</div>
      <Flex direction="column" align="start" className="gap-0.5">
        <Text variant="label1" color="text-basic">
          {title}
        </Text>
        <Text variant="caption2" color="text-basic">
          {description}
        </Text>
      </Flex>
    </button>
  )
}

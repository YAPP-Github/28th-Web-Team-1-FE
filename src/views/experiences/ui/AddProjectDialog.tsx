'use client'
import { NotionIcon } from '@shared/icon'
import { cn } from '@shared/lib/cn'
import { Flex } from '@radix-ui/themes'
import { Button, Text } from '@shared/ui'
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@shared/ui/dialog'
import { FilePlusCorner, Pencil, Trash2 } from 'lucide-react'
import { useRef, useState, type DragEvent } from 'react'

export const AddProjectDialog = () => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="secondary" size="md">
          프로젝트 추가하기
        </Button>
      </DialogTrigger>
      <DialogContent className="w-200">
        <DialogHeader>
          <DialogTitle className="text-title3 text-text-basic font-bold">프로젝트 추가하기</DialogTitle>
          <DialogDescription className="text-body1 text-text-subtler">한 번 정리해 두면 언제든 이력서에 불러와 사용할 수 있어요.</DialogDescription>
        </DialogHeader>
        <ResumeDropzone />
      </DialogContent>
    </Dialog>
  )
}

const ResumeDropzone = ({ onFileSelect }: { onFileSelect?: (file: File) => void }) => {
  const inputRef = useRef<HTMLInputElement>(null)
  const [file, setFile] = useState<File | null>(null)
  const [isDragging, setIsDragging] = useState(false)

  const selectFile = (selected: File | undefined) => {
    if (!selected) return
    setFile(selected)
    onFileSelect?.(selected)
  }

  const handleDrop = (e: DragEvent<HTMLButtonElement>) => {
    e.preventDefault()
    setIsDragging(false)
    selectFile(e.dataTransfer.files[0])
  }

  const handleClearFile = (e: React.MouseEvent) => {
    e.stopPropagation()
    setFile(null)
    if (inputRef.current) inputRef.current.value = ''
  }

  return (
    <Flex direction="column" gap="2" className={cn('flex h-100 gap-4')}>
      <input ref={inputRef} type="file" accept={'.pdf'} className="hidden" onChange={(e) => selectFile(e.target.files?.[0])} />
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
        <>
          <FilePlusCorner size={24} className="text-text-subtler" />
          <Flex direction="column" gap="2px" align="center">
            <Text variant="headline2" color="text-subtler">
              이력서 파일을 드래그하거나 선택해 주세요.
            </Text>
            <Text variant="caption1" color="text-subtler">
              지원가능 파일 : pdf (최대 4.5MB까지 업로드 가능)
            </Text>
          </Flex>
        </>
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
            <span
              role="button"
              tabIndex={0}
              aria-label="파일 제거"
              onClick={handleClearFile}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') handleClearFile(e as unknown as React.MouseEvent)
              }}
              className="text-icon-error bg-element-danger-lighter cursor-pointer rounded-sm p-2.25"
            >
              <Trash2 size={12} />
            </span>
          </Flex>
          <Button variant="primary" size="xl" className="mt-6 w-full">
            경험 추출하기
          </Button>
        </Flex>
      ) : (
        <DialogFooter>
          <ExperiencesButton title="직접 정리" description="STAR 방식으로 직접 정리하기" icon={<Pencil size={18} />} />
          <ExperiencesButton title="Notion" description="페이지, 워크스페이스 가져오기" icon={<NotionIcon size={20} />} />
        </DialogFooter>
      )}
    </Flex>
  )
}

const ExperiencesButton = ({ title, description, icon }: { title: string; description: string; icon: React.ReactNode }) => {
  return (
    <button
      className={cn(
        'ring-btn-outline-border flex w-full flex-row items-center gap-2.5 rounded-sm px-2.5 py-2.5 ring-1 ring-inset',
        // TODO : 인터렉션 추가 시 변경 필요
        //hover
        'hover:bg-element-primary-lighter hover:ring-btn-secondary-border'
      )}
    >
      <div className="bg-btn-tertiary-fill flex h-10.5 w-10.5 items-center justify-center rounded-lg">{icon}</div>
      <Flex direction="column" gap="0.5px" align="start">
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

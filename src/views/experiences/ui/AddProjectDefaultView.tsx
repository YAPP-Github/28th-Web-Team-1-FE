import { useState } from 'react'
import { Flex } from '@radix-ui/themes'
import { Pencil } from 'lucide-react'
import { NotionIcon } from '@shared/icon'
import { cn } from '@shared/lib/cn'
import { Button, Text } from '@shared/ui'
import { DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@shared/ui/dialog'
import { PdfUpload } from '@features/pdf_upload'

export const AddProjectDefaultView = ({ onManualClick, onNotionClick, onExtract }: { onManualClick: () => void; onNotionClick: () => void; onExtract: (file: File) => void }) => {
  const [file, setFile] = useState<File | null>(null)

  return (
    <>
      <DialogHeader>
        <DialogTitle className="text-title3 text-text-basic font-bold">경험 추가하기</DialogTitle>
        <DialogDescription className="text-body1 text-text-subtler">한 번 정리해 두면 언제든 이력서에 불러와 사용할 수 있어요.</DialogDescription>
      </DialogHeader>
      <Flex direction="column" className="gap-4">
        <PdfUpload file={file} onChange={setFile} className="h-100" />
        {file ? (
          <Button
            variant="primary"
            size="xl"
            className="mt-4 w-full"
            onClick={() => {
              if (!file) return
              onExtract(file)
            }}
          >
            경험 정리하기
          </Button>
        ) : (
          <DialogFooter>
            <AddProjectExperienceButton title="직접 정리" description="AI와 함께 STAR로 정리해보세요." icon={<Pencil size={18} />} onClick={() => onManualClick()} />
            <AddProjectExperienceButton title="Notion" description="경험이 정리된 페이지를 직접 검색해주세요." icon={<NotionIcon size={20} />} onClick={() => onNotionClick()} />
          </DialogFooter>
        )}
      </Flex>
    </>
  )
}

const AddProjectExperienceButton = ({ title, description, icon, className, ...props }: { title: string; description: string; icon: React.ReactNode } & React.ComponentProps<'button'>) => {
  return (
    <button
      type="button"
      className={cn(
        'ring-btn-outline-border flex w-full flex-row items-center gap-2.5 rounded-sm px-2.5 py-2.5 ring-1 ring-inset',
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

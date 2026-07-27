'use client'
import { useRef, useState, type DragEvent } from 'react'
import { Flex } from '@radix-ui/themes'
import { AnimatePresence, motion } from 'motion/react'
import { toast } from 'sonner'
import { FilePlusCorner, Trash2 } from 'lucide-react'
import { cn } from '@shared/lib/cn'
import { Button, Text } from '@shared/ui'
import { isPdfFile } from '@shared/lib/isPdfFile'

const MAX_FILE_SIZE = 4.5 * 1024 * 1024

interface PdfUploadProps {
  /** 파일 상태는 부모가 소유한다 (삭제 시 null) */
  file: File | null
  onChange: (file: File | null) => void
  /** 전체 높이 지정용. 높이를 주면 파일 행까지 포함해 그 높이 안에 들어가고, 드롭존/카드가 남는 공간을 채운다 */
  className?: string
}

/**
 * 이력서 PDF 업로드. 파일 선택 전에는 드래그&드롭/클릭 드롭존을,
 * 선택 후에는 "업로드 완료" 카드 + 업로드된 파일 행을 보여준다.
 * pdf 타입·4.5MB 검증과 경고 토스트를 내장하고, 검증 통과한 파일만 `onChange`로 올려준다.
 * @example
 * ```tsx
 * const [file, setFile] = useState<File | null>(null)
 * <PdfUpload file={file} onChange={setFile} />
 * ```
 */
export const PdfUpload = ({ file, onChange, className }: PdfUploadProps) => {
  const inputRef = useRef<HTMLInputElement>(null)
  const [isDragging, setIsDragging] = useState(false)

  const selectFile = async (selected: File | undefined) => {
    if (!selected) return
    const isPdf = await isPdfFile(selected)
    if (isPdf === false) {
      toast.warning('PDF 파일만 업로드할 수 있어요.', { id: 'pdf-type', position: 'top-center' })
      return
    }
    if (selected.size > MAX_FILE_SIZE) {
      toast.warning('파일 크기는 최대 4.5MB까지 업로드할 수 있어요.', { id: 'pdf-size', position: 'top-center' })
      return
    }
    onChange(selected)
  }

  const handleDrop = (e: DragEvent<HTMLButtonElement>) => {
    e.preventDefault()
    setIsDragging(false)
    selectFile(e.dataTransfer.files[0])
  }

  return (
    <Flex direction="column" className={cn('w-full gap-4', className)}>
      <input
        ref={inputRef}
        type="file"
        accept=".pdf"
        className="hidden"
        onChange={(e) => {
          selectFile(e.target.files?.[0])
          e.target.value = ''
        }}
      />
      <AnimatePresence mode="wait" initial={false}>
        {file ? (
          <motion.div
            key="complete"
            className="flex w-full grow flex-col"
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
          >
            <UploadCompleteCard />
          </motion.div>
        ) : (
          <motion.div key="dropzone" className="flex w-full grow flex-col" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.15 }}>
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
                'border-btn-outline-border bg-element-gray-lighter flex h-38.5 w-full grow flex-col items-center justify-center gap-2 rounded-xl border border-dashed px-6 py-10',
                isDragging && 'border-btn-secondary-border',
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
          </motion.div>
        )}
      </AnimatePresence>
      {file && <UploadedFileRow file={file} onRemove={() => onChange(null)} />}
    </Flex>
  )
}

const UploadCompleteCard = () => {
  return (
    <Flex direction="column" align="center" justify="center" className="border-border-subtle h-38.5 w-full grow gap-5 rounded-xl border px-6 py-8">
      <Flex direction="column" align="center" className="gap-2">
        <motion.div initial={{ scale: 0.4, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: 'spring', stiffness: 400, damping: 15, delay: 0.05 }}>
          <FilePlusCorner size={24} className="text-text-basic" />
        </motion.div>
        <Text variant="headline2" color="text-basic">
          업로드 완료
        </Text>
      </Flex>
    </Flex>
  )
}

const UploadedFileRow = ({ file, onRemove }: { file: File; onRemove: () => void }) => {
  return (
    <Flex direction="column" align="start" className="w-full gap-2">
      <Text variant="headline2" color="text-basic">
        업로드된 파일
      </Text>
      <Flex align="center" justify="between" className="bg-bg-gray-subtler w-full gap-2 rounded-xl px-4 py-3">
        <Text variant="headline2" color="text-subtle" className="min-w-0 flex-1 truncate">
          {file.name}
        </Text>
        <Button variant="danger" size="icon-xs" className="shrink-0" onClick={onRemove} aria-label="파일 삭제">
          <Trash2 />
        </Button>
      </Flex>
    </Flex>
  )
}

import { useRef, useState, type DragEvent } from 'react'
import { toast } from 'sonner'
import { FilePlusCorner, Trash2 } from 'lucide-react'
import { cn } from '@shared/lib/cn'
import { Button, Text } from '@shared/ui'
import { isPdfFile } from '@shared/lib/isPdfFile'
import { OnboardingStepShell } from './OnboardingStepShell'

const MAX_FILE_SIZE = 4.5 * 1024 * 1024

interface ResumeUploadStepProps {
  /** 파일은 "이전 갔다 와도 보존" UX 때문에 페이지가 소유한다(컨트롤드). */
  file: File | null
  onChange: (file: File | null) => void
  onDone: () => void
  onPrev: () => void
  onSkip: () => void
}

/** 온보딩 스텝2: 작성해 둔 이력서 파일(pdf) 업로드 */
export const ResumeUploadStep = ({ file, onChange, onDone, onPrev, onSkip }: ResumeUploadStepProps) => {
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

  const clearFile = () => {
    onChange(null)
    if (inputRef.current) inputRef.current.value = ''
  }

  return (
    <OnboardingStepShell
      title="작성해 둔 이력서 파일을 업로드해주세요."
      description="기존 이력서를 분석해 필요한 정보만 추출하고, JD에 맞게 이력서를 개선할 수 있어요."
      onNext={onDone}
      nextDisabled={!file}
      onPrev={onPrev}
      onSkip={onSkip}
    >
      <input ref={inputRef} type="file" accept=".pdf" className="hidden" onChange={(e) => selectFile(e.target.files?.[0])} />
      {file ? (
        <div className="flex w-full flex-col gap-4">
          <div className="border-border-subtle flex h-38.5 w-full flex-col items-center justify-center gap-5 rounded-xl border px-6 py-8">
            <div className="flex flex-col items-center gap-2">
              <FilePlusCorner size={24} className="text-text-basic" />
              <Text variant="headline2" color="text-basic">
                업로드 완료
              </Text>
            </div>
          </div>
          <div className="flex w-full flex-col items-start gap-2">
            <Text variant="headline2" color="text-basic">
              업로드된 파일
            </Text>
            <div className="bg-bg-gray-subtler flex w-full items-center justify-between gap-2 rounded-xl px-4 py-3">
              <Text variant="headline2" color="text-subtle" className="min-w-0 flex-1 truncate">
                {file.name}
              </Text>
              <Button variant="danger" size="icon-xs" className="shrink-0" onClick={clearFile} aria-label="파일 삭제">
                <Trash2 />
              </Button>
            </div>
          </div>
        </div>
      ) : (
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
            'border-btn-outline-border bg-element-gray-lighter flex h-38.5 w-full flex-col items-center justify-center gap-2 rounded-xl border border-dashed px-6 py-10',
            isDragging && 'border-btn-secondary-border',
            'hover:border-btn-secondary-border hover:bg-element-primary-lighter'
          )}
        >
          <FilePlusCorner size={24} className="text-text-subtler" />
          <div className="flex flex-col items-center gap-0.5">
            <Text variant="headline2" color="text-subtler">
              파일을 드래그하거나 선택해 주세요.
            </Text>
            <Text variant="caption1" color="text-subtler">
              지원가능 파일 : pdf (최대 4.5MB까지 업로드 가능)
            </Text>
          </div>
        </button>
      )}
    </OnboardingStepShell>
  )
}

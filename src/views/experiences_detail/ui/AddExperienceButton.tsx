'use client'
import { useState } from 'react'
import { useParams } from 'next/navigation'
import { toast } from 'sonner'
import { Plus } from 'lucide-react'
import { useCreateExperience } from '@entities/experience'
import { useWorkspaceId } from '@entities/user'
import { Button, Text } from '@shared/ui'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@shared/ui/dialog'
import { Textarea } from '@/src/shared/ui/textarea'

export const AddExperienceButton = () => {
  const workspaceId = useWorkspaceId()
  const { projectId } = useParams<{ projectId: string }>()

  const [isOpen, setIsOpen] = useState(false)
  const [content, setContent] = useState('')
  const { mutate: createExperience, isPending } = useCreateExperience(workspaceId, projectId)

  const handleOpenChange = (next: boolean) => {
    if (next) setContent('')
    setIsOpen(next)
  }

  const handleSubmit = () => {
    const trimmed = content.trim()
    if (!trimmed) {
      toast.warning('경험 내용을 입력해 주세요.', { id: 'experience-content-required', position: 'top-center' })
      return
    }
    createExperience(
      { projectId, title: trimmed, contents: { type: 'FREE', free: { content: content } } },
      {
        onSuccess: () => {
          toast.success('경험이 추가되었어요.', { id: 'experience-created', position: 'top-center' })
          setIsOpen(false)
        },
        onError: () => toast.error('경험 추가에 실패했어요. 다시 시도해 주세요.', { id: 'experience-create-error', position: 'top-center' })
      }
    )
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button variant="primary" size="sm">
          <Plus size={16} data-icon="inline-start" />
          경험 추가하기
        </Button>
      </DialogTrigger>
      <DialogContent className="w-200 gap-6">
        <DialogHeader>
          <DialogTitle>
            <Text variant="heading2" weight="semibold" color="text-basic">
              직접 정리하기
            </Text>
          </DialogTitle>
          <DialogDescription className="text-body1 text-text-subtler">떠오르는 경험을 자유롭게 작성해 주세요. AI가 이력서에 적합한 STAR 구조로 정리해 드려요.</DialogDescription>
        </DialogHeader>
        <Textarea label="경험내용" placeholder="텍스트를 입력해주세요." maxLength={null} value={content} onChange={(e) => setContent(e.target.value)} />
        <Button variant="primary" size="xl" className="w-full" onClick={handleSubmit} disabled={isPending}>
          경험 추출하기
        </Button>
      </DialogContent>
    </Dialog>
  )
}

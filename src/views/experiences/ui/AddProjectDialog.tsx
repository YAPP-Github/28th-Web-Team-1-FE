'use client'
import { useState } from 'react'
import { toast } from 'sonner'
import { useProjectCount, useCreateProjectFromPdf, useCreateProject, type CreateProjectInput } from '@entities/project'
import { useWorkspaceId } from '@entities/user'
import { cn } from '@shared/lib/cn'
import { Button } from '@shared/ui'
import { Dialog, DialogTrigger, DialogContent } from '@shared/ui/dialog'
import { AddProjectDefaultView } from './AddProjectDefaultView'
import { AddProjectManualView } from './AddProjectManualView'
import { AddProjectProgressView } from './AddProjectProgressView'

// TODO : 노션 연동 페이지 완성 시 수정 필요
type DialogView = 'default' | 'manual' | 'progress'

export const AddProjectDialog = () => {
  const workspaceId = useWorkspaceId()
  const projectCount = useProjectCount(workspaceId)
  const { mutate: uploadPdf, isSuccess: isPdfDone, reset: resetPdf } = useCreateProjectFromPdf(workspaceId)
  const { mutate: createProject, isSuccess: isManualDone, reset: resetManual } = useCreateProject(workspaceId)
  const [isOpen, setIsOpen] = useState(false)
  const [view, setView] = useState<DialogView>('default')

  const MAX_PROJECTS = 10

  const handleOpenChange = (next: boolean) => {
    if (next && projectCount >= MAX_PROJECTS) {
      toast.warning(`프로젝트는 최대 ${MAX_PROJECTS}개까지 생성할 수 있습니다.`, { id: 'project-max', position: 'bottom-center' })
      return
    }
    if (next) {
      setView('default')
      resetPdf()
      resetManual()
    }
    setIsOpen(next)
  }

  // 추출 요청 실패 시 기본 화면으로 되돌린다.
  const handleExtractError = () => {
    toast.error('요청에 실패했어요. 다시 시도해 주세요.', { position: 'top-center' })
    setView('default')
  }

  // PDF 업로드: 진행 화면으로 전환한 뒤 업로드하고, 완료는 업로드 응답(isPdfDone)으로 판정한다.
  const handleExtractPdf = (file: File) => {
    setView('progress')
    uploadPdf(file, { onError: handleExtractError })
  }

  // 직접 입력: 진행 화면으로 전환한 뒤 생성하고, 완료는 생성 응답(isManualDone)으로 판정한다.
  const handleExtractManual = (input: CreateProjectInput) => {
    setView('progress')
    createProject(input, { onError: handleExtractError })
  }

  const renderView = () => {
    switch (view) {
      case 'default':
        return <AddProjectDefaultView onManualClick={() => setView('manual')} onExtract={handleExtractPdf} />
      case 'manual':
        return <AddProjectManualView onBack={() => setView('default')} onExtract={handleExtractManual} />
      case 'progress':
        return <AddProjectProgressView isComplete={isPdfDone || isManualDone} onCancel={() => handleOpenChange(false)} />
      default:
        return null
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button variant="secondary" size="md">
          프로젝트 추가하기
        </Button>
      </DialogTrigger>
      <DialogContent showCloseButton={view !== 'progress'} className={cn(view === 'progress' ? 'w-150' : 'w-200')}>
        {renderView()}
      </DialogContent>
    </Dialog>
  )
}

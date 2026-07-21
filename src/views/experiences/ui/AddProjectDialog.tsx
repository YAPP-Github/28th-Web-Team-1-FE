'use client'
import { useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { projectKeys, useProjectCount, useCreateProjectFromPdf, useCreateProject, type CreateProjectInput } from '@entities/project'
import { useWorkspaceId } from '@entities/user'
import { useImportNotionExperiences } from '@entities/notion'
import { startNotionOAuth, useNotionReturn } from '@features/notion_connect'
import { cn } from '@shared/lib/cn'
import { Button } from '@shared/ui'
import { Dialog, DialogTrigger, DialogContent } from '@shared/ui/dialog'
import { AddProjectDefaultView } from './AddProjectDefaultView'
import { AddProjectManualView } from './AddProjectManualView'
import { AddProjectNotionView } from './AddProjectNotionView'
import { AddProjectProgressView } from './AddProjectProgressView'

type DialogView = 'default' | 'manual' | 'notion-select' | 'progress'

/** Notion OAuth 콜백이 이 페이지로 돌아올 때 붙이는 재진입 파라미터가 가리킬 경로 */
const NOTION_RETURN_PATH = '/experiences'

export const AddProjectDialog = () => {
  const workspaceId = useWorkspaceId()
  const queryClient = useQueryClient()
  const projectCount = useProjectCount(workspaceId)
  const { mutate: uploadPdf, isSuccess: isPdfDone, reset: resetPdf } = useCreateProjectFromPdf(workspaceId)
  const { mutate: createProject, isSuccess: isManualDone, reset: resetManual } = useCreateProject(workspaceId)
  const { mutate: importNotionPages, isSuccess: isNotionDone, reset: resetNotion } = useImportNotionExperiences(workspaceId)

  // 노션에서 돌아온 경우, URL 파라미터를 읽어 connectionId를 가져온다. (없으면 null)
  const { connectionId } = useNotionReturn(NOTION_RETURN_PATH)

  const [isOpen, setIsOpen] = useState(() => Boolean(connectionId))
  const [view, setView] = useState<DialogView>(() => (connectionId ? 'notion-select' : 'default'))

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
      resetNotion()
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

  // Notion: 진행 화면으로 전환한 뒤 선택한 페이지들을 가져오고, 완료는 가져오기 응답(isNotionDone)으로 판정한다.
  const handleExtractNotion = (pageIds: string[]) => {
    if (!connectionId || pageIds.length === 0) return
    setView('progress')
    importNotionPages(
      { connectionId: connectionId, pageIds },
      {
        onSuccess: () => queryClient.invalidateQueries({ queryKey: projectKeys.lists() }),
        onError: handleExtractError
      }
    )
  }

  const renderView = () => {
    switch (view) {
      case 'default':
        return <AddProjectDefaultView onManualClick={() => setView('manual')} onNotionClick={() => startNotionOAuth({ workspaceId, returnTo: NOTION_RETURN_PATH })} onExtract={handleExtractPdf} />
      case 'manual':
        return <AddProjectManualView onBack={() => setView('default')} onExtract={handleExtractManual} />
      case 'notion-select':
        return connectionId ? <AddProjectNotionView workspaceId={workspaceId} connectionId={connectionId} onExtract={handleExtractNotion} /> : null
      case 'progress':
        return <AddProjectProgressView isComplete={isPdfDone || isManualDone || isNotionDone} onCancel={() => handleOpenChange(false)} />
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

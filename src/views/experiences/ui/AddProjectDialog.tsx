'use client'
import { useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { projectKeys, useProjectCount, useCreateProjectFromPdf, useCreateProject, type CreateProjectInput } from '@entities/project'
import { useCreateExperience, type CreateExperienceInput } from '@entities/experience'
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

import { AMPLITUDE_EVENTS } from '@shared/config'
import * as amplitude from '@amplitude/unified'

type DialogView = 'default' | 'manual' | 'notion-select' | 'progress'

/** Notion OAuth 콜백이 이 페이지로 돌아올 때 붙이는 재진입 파라미터가 가리킬 경로 */
const NOTION_RETURN_PATH = '/experiences'

export const AddProjectDialog = () => {
  const workspaceId = useWorkspaceId()
  const queryClient = useQueryClient()
  const projectCount = useProjectCount(workspaceId)
  const { mutate: uploadPdf, isSuccess: isPdfDone, reset: resetPdf } = useCreateProjectFromPdf(workspaceId)
  const { mutate: createProject, reset: resetManual } = useCreateProject(workspaceId)
  const { mutate: importNotionPages, isSuccess: isNotionDone, reset: resetNotion } = useImportNotionExperiences(workspaceId)
  const { mutate: createExperience, isSuccess: isExperienceDone, reset: resetExperience } = useCreateExperience(workspaceId)

  // 노션에서 돌아온 경우, URL 파라미터를 읽어 connectionId를 가져온다. (없으면 null)
  const { connectionId } = useNotionReturn(NOTION_RETURN_PATH)

  const [isOpen, setIsOpen] = useState(() => Boolean(connectionId))
  const [view, setView] = useState<DialogView>(() => (connectionId ? 'notion-select' : 'default'))
  const [isNotionWide, setIsNotionWide] = useState(false)

  const MAX_PROJECTS = 20

  const handleOpenChange = (next: boolean) => {
    if (next && projectCount >= MAX_PROJECTS) {
      toast.warning(`프로젝트는 최대 ${MAX_PROJECTS}개까지 생성할 수 있습니다.`, { id: 'project-max', position: 'bottom-center' })
      return
    }
    if (next) {
      setView('default')
      setIsNotionWide(false)
      resetPdf()
      resetManual()
      resetNotion()
      resetExperience()
    }
    setIsOpen(next)
  }

  // 추출 요청 실패 시 기본 화면으로 되돌린다.
  const handleExtractError = (error: Error) => {
    toast.error(error.message, { position: 'top-center' })
    setView('default')
  }

  // PDF 업로드: 진행 화면으로 전환한 뒤 업로드하고, 완료는 업로드 응답(isPdfDone)으로 판정한다.
  const handleExtractPdf = (file: File) => {
    setView('progress')

    // 버튼 클릭 시 Amplitude 이벤트 전송(유저 속성 업데이트 포함)
    amplitude.track(AMPLITUDE_EVENTS.RESUME_STATUS_SELECTED, { has_resume: true, location: 'ex_tab' })
    amplitude.identify(new amplitude.Identify().set('has_resume', true))

    uploadPdf(file, { onError: handleExtractError })
  }

  // 직접 입력(신규 프로젝트): 진행 화면으로 전환한 뒤 프로젝트를 만들고, 그 안에 입력한 내용으로 경험까지 생성한다.
  // createExperienceProject는 프로젝트 껍데기만 만들 뿐 경험을 만들어주지 않으므로, 생성된 projectId로 경험 생성을 이어서 호출해야 한다.
  // 완료는 경험 생성 응답(isExperienceDone)으로 판정한다.
  const handleExtractManual = (input: CreateProjectInput) => {
    // 버튼 클릭 시 Amplitude 이벤트 전송(유저 속성 업데이트 포함)
    amplitude.track(AMPLITUDE_EVENTS.EXPERIENCE_WRITE_SELECTED)
    amplitude.identify(new amplitude.Identify().set('is_direct_write', true))

    setView('progress')
    createProject(input, {
      onSuccess: (project) => {
        // title은 빈값을 보내고, AI가 생성한다.
        createExperience({ projectId: project.projectId, title: '', contents: { type: 'FREE', free: { content: input.summary } } }, { onError: handleExtractError })
      },
      onError: handleExtractError
    })
  }

  // 기존 프로젝트에 경험 추가: 로딩 화면으로 전환한 뒤 생성하고, 완료는 생성 응답(isExperienceDone)으로 판정한다.
  const handleAddExperience = (input: CreateExperienceInput) => {
    // 버튼 클릭 시 Amplitude 이벤트 전송(유저 속성 업데이트 포함)
    amplitude.track(AMPLITUDE_EVENTS.EXPERIENCE_WRITE_SELECTED)
    amplitude.identify(new amplitude.Identify().set('is_direct_write', true))

    setView('progress')
    createExperience(input, {
      onSuccess: () => queryClient.invalidateQueries({ queryKey: projectKeys.lists() }),
      onError: handleExtractError
    })
  }

  // Notion: 진행 화면으로 전환한 뒤 선택한 페이지들을 가져오고, 완료는 가져오기 응답(isNotionDone)으로 판정한다.
  const handleExtractNotion = (pageIds: string[]) => {
    if (!connectionId || pageIds.length === 0) return

    // 버튼 클릭 시 Amplitude 이벤트 전송(유저 속성 업데이트 포함)
    amplitude.track(AMPLITUDE_EVENTS.NOTION_STATUS_SELECTED, { has_notion: true, location: 'ex_tab' })
    amplitude.identify(new amplitude.Identify().set('has_notion', true))

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
        return <AddProjectManualView onBack={() => setView('default')} onExtract={handleExtractManual} onAddExperience={handleAddExperience} />
      case 'notion-select':
        return connectionId ? <AddProjectNotionView workspaceId={workspaceId} connectionId={connectionId} onExtract={handleExtractNotion} onWideChange={setIsNotionWide} /> : null
      case 'progress':
        return <AddProjectProgressView isComplete={isPdfDone || isNotionDone || isExperienceDone} onCancel={() => handleOpenChange(false)} />
      default:
        return null
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button variant="secondary" size="md">
          경험 추가하기
        </Button>
      </DialogTrigger>
      <DialogContent showCloseButton={view !== 'progress'} className={cn(view === 'progress' ? 'w-150' : view === 'notion-select' && isNotionWide ? 'w-248' : 'w-200')}>
        {renderView()}
      </DialogContent>
    </Dialog>
  )
}

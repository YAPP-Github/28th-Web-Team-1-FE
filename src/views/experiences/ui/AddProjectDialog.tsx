'use client'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import { useExperienceProjectCount } from '@entities/experience'
import { useWorkspaceId } from '@entities/user'
import { cn } from '@shared/lib/cn'
import { Button } from '@shared/ui'
import { Dialog, DialogTrigger, DialogContent } from '@shared/ui/dialog'
import { AddProjectDefaultView } from './AddProjectDefaultView'
import { AddProjectManualView } from './AddProjectManualView'
import { AddProjectProgressView } from './AddProjectProgressView'

type DialogView = 'default' | 'manual' | 'progress'

const MAX_PROJECTS = 10

export const AddProjectDialog = () => {
  const workspaceId = useWorkspaceId()
  const projectCount = useExperienceProjectCount(workspaceId)
  const [isOpen, setIsOpen] = useState(false)
  const [view, setView] = useState<DialogView>('default')
  // TODO : 더미 완료 신호, 실제로는 백엔드 단건 조회로 완료 여부를 받도록 교체
  const [isExtractDone, setIsExtractDone] = useState(false)

  const handleOpenChange = (next: boolean) => {
    // 프로젝트가 최대치면 열지 않고 토스트로 안내한다.
    if (next && projectCount >= MAX_PROJECTS) {
      toast.warning(`프로젝트는 최대 ${MAX_PROJECTS}개까지 생성할 수 있습니다.`, { id: 'project-max', position: 'bottom-center' })
      return
    }
    // 열 때마다 기본 화면으로 초기화 (닫는 애니메이션 중 화면이 바뀌는 깜빡임 방지)
    if (next) {
      setView('default')
      setIsExtractDone(false)
    }
    setIsOpen(next)
  }

  const handleExtract = () => {
    setIsExtractDone(false)
    setView('progress')
  }

  // TODO : 더미 완료 신호, 실제로는 백엔드 단건 조회로 완료 여부를 받도록 교체
  useEffect(() => {
    if (view !== 'progress') return
    const timer = setTimeout(() => setIsExtractDone(true), 4000)
    return () => clearTimeout(timer)
  }, [view])

  const renderView = () => {
    switch (view) {
      case 'manual':
        return <AddProjectManualView onBack={() => setView('default')} onExtract={handleExtract} />
      case 'progress':
        return <AddProjectProgressView isComplete={isExtractDone} onCancel={() => handleOpenChange(false)} />
      case 'default':
      default:
        return <AddProjectDefaultView onManualClick={() => setView('manual')} onExtract={handleExtract} />
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

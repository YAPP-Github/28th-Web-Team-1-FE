'use client'
import { useEffect, useState } from 'react'
import { cn } from '@shared/lib/cn'
import { Button } from '@shared/ui'
import { Dialog, DialogTrigger, DialogContent } from '@shared/ui/dialog'
import { AddProjectDefaultView } from './AddProjectDefaultView'
import { AddProjectManualView } from './AddProjectManualView'
import { AddProjectProgressView } from './AddProjectProgressView'

type DialogView = 'default' | 'manual' | 'progress'

export const AddProjectDialog = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [view, setView] = useState<DialogView>('default')
  // TODO : 더미 완료 신호, 실제로는 백엔드 단건 조회로 완료 여부를 받도록 교체
  const [isExtractDone, setIsExtractDone] = useState(false)

  const handleOpenChange = (next: boolean) => {
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

  // TODO: 백엔드 단건 조회(polling)로 완료 여부를 받도록 교체. 지금은 임의 타이머로 완료 처리한다.
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

'use client'
import { Button } from '@shared/ui'
import { Dialog, DialogTrigger, DialogContent } from '@shared/ui/dialog'
import { useState } from 'react'
import { AddProjectDefaultView } from './AddProjectDefaultView'
import { AddProjectManualView } from './AddProjectManualView'
import { AddProjectProgressView } from './AddProjectProgressView'

type DialogView = 'default' | 'manual' | 'progress'

export const AddProjectDialog = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [view, setView] = useState<DialogView>('default')

  const handleOpenChange = (next: boolean) => {
    // 열 때마다 기본 화면으로 초기화 (닫는 애니메이션 중 화면이 바뀌는 깜빡임 방지)
    if (next) setView('default')
    setIsOpen(next)
  }

  const renderView = () => {
    switch (view) {
      case 'manual':
        return <AddProjectManualView onBack={() => setView('default')} />
      case 'progress':
        return <AddProjectProgressView />
      case 'default':
      default:
        return <AddProjectDefaultView onManualClick={() => setView('manual')} />
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button variant="secondary" size="md">
          프로젝트 추가하기
        </Button>
      </DialogTrigger>
      <DialogContent className="w-200">{renderView()}</DialogContent>
    </Dialog>
  )
}

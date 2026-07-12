'use client'
import { useState } from 'react'
import { Flex } from '@radix-ui/themes'
import { Plus } from 'lucide-react'
import { Button } from '@shared/ui'
import { Dialog, DialogTrigger, DialogContent, DialogTitle } from '@shared/ui/dialog'
import { Input } from '@shared/ui/input'

export const AddExperienceDialog = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [name, setName] = useState('')

  const handleOpenChange = (next: boolean) => {
    if (next) setName('')
    setIsOpen(next)
  }

  const handleSubmit = () => {
    // TODO : 실제 경험 추가 연동 예정
    console.log('create experience:', name)
    setIsOpen(false)
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button variant="primary" size="sm">
          <Plus size={16} data-icon="inline-start" />
          경험 추가하기
        </Button>
      </DialogTrigger>
      <DialogContent className="w-115.5 gap-8">
        <DialogTitle className="text-title3 text-text-basic font-bold">프로젝트명</DialogTitle>
        <Input placeholder="입력된 프로젝트 명" value={name} onChange={(e) => setName(e.target.value)} />
        <Flex className="w-full gap-4">
          <Button variant="tertiary" size="lg" className="flex-1" onClick={() => setIsOpen(false)}>
            취소
          </Button>
          <Button variant="primary" size="lg" className="flex-1" onClick={handleSubmit}>
            완료
          </Button>
        </Flex>
      </DialogContent>
    </Dialog>
  )
}

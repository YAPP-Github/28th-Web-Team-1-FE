'use client'
import { ProcessingView } from '@shared/ui'

const STEPS = ['경험 불러오는 중', '핵심 내용 분석하는 중', 'STAR 구조로 정리 중']

interface AddProjectProgressViewProps {
  isComplete: boolean
  onCancel: () => void
}
export const AddProjectProgressView = ({ isComplete, onCancel }: AddProjectProgressViewProps) => (
  <ProcessingView
    isComplete={isComplete}
    steps={STEPS}
    title="경험을 가져오는 중이에요."
    description="잠시만 기다려주세요!"
    successTitle="경험을 성공적으로 가져왔어요!"
    successDescription="정리된 경험을 확인하고 이력서에 활용해 보세요."
    onCancel={onCancel}
  />
)

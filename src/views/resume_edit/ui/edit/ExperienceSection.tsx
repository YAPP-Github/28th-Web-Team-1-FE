import { useState } from 'react'
import { Flex } from '@radix-ui/themes'
import { Divider, Spacing, Text } from '@shared/ui'
import { SelectedControl, SelectedControlItem } from '@shared/ui/selected_control'
import { AiView } from './AiView'
import { ManualView } from './ManualView'

/**
 * 경험(EXPERIENCE) 편집 섹션. '경험 재선택'으로 `ExperiencePickerDialog`를 열어 선택한 경험들로 아이템을 통째로 교체한다.
 * 다이얼로그는 대상 채용공고(JD) 기준 매칭 경험을 보여준다(`targetJdId`가 없으면 빈 문자열로 넘긴다).
 */
export const ExperienceSection = ({ title, sectionIndex, targetJdId }: { title: string; sectionIndex: number; targetJdId: string | null }) => {
  const [view, setView] = useState('ai')

  // Amplitude 이벤트 전송용 훅. 경험 재선택 시 이전에 선택된 경험 ID들을 추적해 `previous_experience_id`로 보낸다.
  // const { previousExperienceIds, setPreviousExperienceIds } = usePreviousExperienceIdsTracking()

  return (
    <Flex direction="column" className={'min-h-0 w-full px-8 pb-6'}>
      <Flex justify="between" align="center" className={'py-6'}>
        <Text variant={'headline1'}>{title}</Text>
        <SelectedControl value={view} onValueChange={setView} className="max-w-40">
          <SelectedControlItem value="ai">AI 추천</SelectedControlItem>
          <SelectedControlItem value="manual">직접 작성</SelectedControlItem>
        </SelectedControl>
      </Flex>
      <Divider color={'gray-60'} />
      <Spacing size={32} />

      {view === 'ai' && <AiView targetJdId={targetJdId} sectionIndex={sectionIndex} onApplied={() => setView('manual')} />}

      {view === 'manual' && <ManualView sectionIndex={sectionIndex} targetJdId={targetJdId} />}
    </Flex>
  )
}

import { Flex } from '@radix-ui/themes'
import { Divider, Spacing, Text } from '@shared/ui'
import { SelectedControl, SelectedControlItem } from '@shared/ui/selected_control'
import { AiView } from './AiView'
import { ManualView } from './ManualView'
import { useExperienceEdit } from '../../model/experienceEditContext'
import { useTargetJdId } from '../../model/targetJdContext'

/**
 * 경험(EXPERIENCE) 편집 섹션. '경험 재선택'으로 `ExperiencePickerDialog`를 열어 선택한 경험들로 아이템을 통째로 교체한다.
 * 다이얼로그는 대상 채용공고(JD) 기준 매칭 경험을 보여준다. 대상 JD id는 `TargetJdProvider`에서 읽는다.
 *
 * AI 추천/직접 작성 뷰 상태와 미리보기에서 클릭한 item 스크롤 대상은 `ExperienceEditProvider`가 소유한다.
 * - 최초 페이지 진입(대상 없음): 'ai' 추천 뷰
 * - 미리보기에서 EXPERIENCE(item 포함)를 클릭: 'manual' 뷰, item이면 해당 item으로 스크롤
 */
export const ExperienceSection = ({ title, sectionIndex }: { title: string; sectionIndex: number }) => {
  const targetJdId = useTargetJdId()
  const { view, setView, itemTarget } = useExperienceEdit()

  return (
    <Flex direction="column" className={'min-h-0 w-full px-8 pb-6'}>
      <Flex justify="between" align="center" className={'py-6'}>
        <Text variant={'headline1'}>{title}</Text>
        <SelectedControl value={view} onValueChange={(value) => setView(value as 'ai' | 'manual')} className="max-w-40">
          <SelectedControlItem value="ai">AI 추천</SelectedControlItem>
          <SelectedControlItem value="manual">직접 작성</SelectedControlItem>
        </SelectedControl>
      </Flex>
      <Divider color={'gray-60'} />
      <Spacing size={32} />

      {view === 'ai' && <AiView targetJdId={targetJdId} sectionIndex={sectionIndex} onApplied={() => setView('manual')} />}

      {view === 'manual' && <ManualView sectionIndex={sectionIndex} targetJdId={targetJdId} target={itemTarget} />}
    </Flex>
  )
}

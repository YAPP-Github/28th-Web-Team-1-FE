import { payloadsOf, visibleSortedItems, type ResumeSectionData } from '../../model/section'
import { AwardSection } from './AwardSection'
import { CareerSection } from './CarrerSection'
import { CertificatesSection } from './CertificatesSection'
import { CoreSkillSection } from './CoreSkillSection'
import { EducationSection } from './EducationSection'
import { ExperienceSection } from './ExperienceSection'
import { LanguageSection } from './LanguageSection'
import { SkillSection } from './SkillSection'

/**
 * 활성 섹션 하나를 `type`으로 분기해 알맞은 편집 섹션 컴포넌트로 렌더한다.
 * 미리보기(`preview/ResumeSectionView`)와 같은 유틸(`visibleSortedItems`·`payloadsOf`)을 공유한다.
 * `BASIC_INFO`는 편집 영역에서 다루지 않으므로 무시한다.
 */
export const ResumeSectionEdit = ({ section }: { section: ResumeSectionData }) => {
  const { type, displayText } = section
  const items = visibleSortedItems(section)

  switch (type) {
    case 'CORE_SKILL':
      return <CoreSkillSection title={displayText} items={payloadsOf(items, 'coreSkill')} />
    case 'CAREER':
      return <CareerSection title={displayText} items={payloadsOf(items, 'career')} />
    case 'EXPERIENCE':
      return <ExperienceSection title={displayText} items={payloadsOf(items, 'experience')} />
    case 'EDUCATION':
      return <EducationSection title={displayText} items={payloadsOf(items, 'education')} />
    case 'CERTIFICATE':
      return <CertificatesSection title={displayText} items={payloadsOf(items, 'certificate')} />
    case 'AWARD':
      return <AwardSection title={displayText} items={payloadsOf(items, 'award')} />
    case 'LANGUAGE':
      return <LanguageSection title={displayText} items={payloadsOf(items, 'language')} />
    case 'SKILL':
      return <SkillSection title={displayText} items={payloadsOf(items, 'skill')} />
    case 'BASIC_INFO':
      return null
    default:
      return null
  }
}

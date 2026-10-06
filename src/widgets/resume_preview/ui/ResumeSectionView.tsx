import { payloadsOf, visibleItems, type ResumeSectionData } from '@entities/resume'
import { AwardSection } from './AwardSection'
import { CareerSection } from './CareerSection'
import { CertificatesSection } from './CertificatesSection'
import { CoreSkillSection } from './CoreSkillSection'
import { EducationSection } from './EducationSection'
import { ExperienceSection } from './ExperienceSection'
import { LanguageSection } from './LanguageSection'
import { SkillSection } from './SkillSection'
import type { SectionItemWrapper } from './Section'

/**
 * 서버가 내려준 섹션 하나를 `type`으로 분기해 알맞은 섹션 컴포넌트로 렌더한다.
 * 섹션 제목(`displayText`)·순서·노출 여부는 상위(`ResumePreview`)에서 서버 값 그대로 처리한다.
 * `BASIC_INFO`는 미리보기 헤더에서 별도로 렌더하므로 여기서는 무시한다.
 */
export const ResumeSectionView = ({ section, ItemWrapper }: { section: ResumeSectionData; ItemWrapper?: SectionItemWrapper }) => {
  const { type, displayText } = section
  const items = visibleItems(section)

  switch (type) {
    case 'CORE_SKILL':
      return <CoreSkillSection title={displayText} items={payloadsOf(items, 'coreSkill')} ItemWrapper={ItemWrapper} />
    case 'CAREER':
      return <CareerSection title={displayText} items={payloadsOf(items, 'career')} ItemWrapper={ItemWrapper} />
    case 'EXPERIENCE':
      return <ExperienceSection title={displayText} items={payloadsOf(items, 'experience')} ItemWrapper={ItemWrapper} />
    case 'EDUCATION':
      return <EducationSection title={displayText} items={payloadsOf(items, 'education')} ItemWrapper={ItemWrapper} />
    case 'CERTIFICATE':
      return <CertificatesSection title={displayText} items={payloadsOf(items, 'certificate')} ItemWrapper={ItemWrapper} />
    case 'AWARD':
      return <AwardSection title={displayText} items={payloadsOf(items, 'award')} ItemWrapper={ItemWrapper} />
    case 'LANGUAGE':
      return <LanguageSection title={displayText} items={payloadsOf(items, 'language')} ItemWrapper={ItemWrapper} />
    case 'SKILL':
      return <SkillSection title={displayText} items={payloadsOf(items, 'skill')} ItemWrapper={ItemWrapper} />
    case 'BASIC_INFO':
      return null
    default:
      return null
  }
}

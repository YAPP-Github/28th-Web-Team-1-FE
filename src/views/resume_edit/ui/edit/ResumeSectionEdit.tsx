import type { ResumeFormSection } from '../../model/resume-form.types'
import { AwardSection } from './AwardSection'
import { BasicInfoSection } from './BasicInfoSection'
import { CareerSection } from './CarrerSection'
import { CertificatesSection } from './CertificatesSection'
import { CoreSkillSection } from './CoreSkillSection'
import { EducationSection } from './EducationSection'
import { ExperienceSection } from './ExperienceSection'
import { LanguageSection } from './LanguageSection'
import { SkillSection } from './SkillSection'

/**
 * 활성 섹션 하나를 `type`으로 분기해 알맞은 편집 섹션 컴포넌트로 렌더한다.
 * 각 섹션은 폼 필드 경로 조립에 쓸 `sectionIndex`(폼 `sections` 배열 내 위치)를 받아
 * `useFormContext`/`useFieldArray`로 공유 폼에 직접 연결된다.
 */
export const ResumeSectionEdit = ({ section, sectionIndex, targetJdId }: { section: ResumeFormSection; sectionIndex: number; targetJdId: string | null }) => {
  const { type, displayText } = section

  switch (type) {
    case 'BASIC_INFO':
      return <BasicInfoSection title={displayText} sectionIndex={sectionIndex} />
    case 'CAREER':
      return <CareerSection title={displayText} sectionIndex={sectionIndex} targetJdId={targetJdId} />
    case 'CORE_SKILL':
      return <CoreSkillSection title={displayText} sectionIndex={sectionIndex} targetJdId={targetJdId} />
    case 'EXPERIENCE':
      return <ExperienceSection title={displayText} sectionIndex={sectionIndex} targetJdId={targetJdId} />
    case 'EDUCATION':
      return <EducationSection title={displayText} sectionIndex={sectionIndex} />
    case 'CERTIFICATE':
      return <CertificatesSection title={displayText} sectionIndex={sectionIndex} />
    case 'AWARD':
      return <AwardSection title={displayText} sectionIndex={sectionIndex} />
    case 'LANGUAGE':
      return <LanguageSection title={displayText} sectionIndex={sectionIndex} />
    case 'SKILL':
      return <SkillSection title={displayText} sectionIndex={sectionIndex} />
    default:
      return null
  }
}

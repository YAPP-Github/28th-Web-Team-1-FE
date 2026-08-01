import type { Degree, EducationStatus, ResumeEducationFieldsFragment } from '@shared/lib/gql/graphql'
import { DEGREE_LABELS, EDUCATION_STATUS_LABELS } from '@entities/profile'
import { Section, SectionItem, SectionItemSubtitle, SectionItemTitle, periodText } from './Section'

export const EducationSection = ({ title, items }: { title: string; items: ResumeEducationFieldsFragment[] }) => {
  return (
    <Section title={title}>
      {items.map((item, index) => {
        // 서버가 enum 코드('BACHELOR'/'GRADUATED')로 내려주므로 표시용 한글 라벨로 변환한다.
        const degree = item.degree ? (DEGREE_LABELS[item.degree as Degree] ?? item.degree) : null
        const status = item.status ? (EDUCATION_STATUS_LABELS[item.status as EducationStatus] ?? item.status) : null
        return (
          <SectionItem key={index}>
            <SectionItemTitle>{[item.schoolName, item.major].filter(Boolean).join(' ')}</SectionItemTitle>
            <SectionItemSubtitle parts={[periodText(item.period), degree, status]} />
          </SectionItem>
        )
      })}
    </Section>
  )
}

import type { ResumeEducationFieldsFragment } from '@shared/lib/gql/graphql'
import { Section, SectionItem, SectionItemSubtitle, SectionItemTitle, periodText } from './Section'

export const EducationSection = ({ title, items }: { title: string; items: ResumeEducationFieldsFragment[] }) => {
  return (
    <Section title={title}>
      {items.map((item, index) => (
        <SectionItem key={index}>
          <SectionItemTitle>{[item.schoolName, item.major].filter(Boolean).join(' ')}</SectionItemTitle>
          <SectionItemSubtitle parts={[periodText(item.period), item.degree, item.status]} />
        </SectionItem>
      ))}
    </Section>
  )
}

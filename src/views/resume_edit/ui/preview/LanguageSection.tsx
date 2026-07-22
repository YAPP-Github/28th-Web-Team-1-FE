import type { ResumeLanguageFieldsFragment } from '@shared/lib/gql/graphql'
import { formatDate } from '@shared/lib'
import { Section, SectionItem, SectionItemSubtitle, SectionItemTitle } from './Section'

export const LanguageSection = ({ title, items }: { title: string; items: ResumeLanguageFieldsFragment[] }) => {
  return (
    <Section title={title}>
      {items.map((item, index) => (
        <SectionItem key={index}>
          <SectionItemTitle>{item.examName}</SectionItemTitle>
          <SectionItemSubtitle parts={[item.scoreOrGrade, formatDate(item.acquiredAt, 'YYYY.MM.DD')]} />
        </SectionItem>
      ))}
    </Section>
  )
}

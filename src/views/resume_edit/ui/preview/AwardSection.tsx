import type { ResumeAwardFieldsFragment } from '@shared/lib/gql/graphql'
import { formatDate } from '@shared/lib'
import { Section, SectionItem, SectionItemSubtitle, SectionItemTitle } from './Section'

export const AwardSection = ({ title, items }: { title: string; items: ResumeAwardFieldsFragment[] }) => {
  return (
    <Section title={title}>
      {items.map((item, index) => (
        <SectionItem key={index}>
          <SectionItemTitle>{item.name}</SectionItemTitle>
          <SectionItemSubtitle parts={[item.organization, formatDate(item.awardedAt, 'YYYY.MM.DD')]} />
        </SectionItem>
      ))}
    </Section>
  )
}

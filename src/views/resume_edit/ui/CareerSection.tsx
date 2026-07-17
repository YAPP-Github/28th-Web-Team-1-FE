import type { ResumeCareerFieldsFragment } from '@shared/lib/gql/graphql'
import { Section, SectionItem, SectionItemContent, SectionItemSubtitle, SectionItemTitle, periodText } from './Section'

export const CareerSection = ({ title, items }: { title: string; items: ResumeCareerFieldsFragment[] }) => {
  return (
    <Section title={title}>
      {items.map((item, index) => (
        <SectionItem key={index}>
          <SectionItemTitle>{item.companyName}</SectionItemTitle>
          <SectionItemSubtitle parts={[item.role, periodText(item.period)]} />
          {item.contents && <SectionItemContent>{item.contents}</SectionItemContent>}
        </SectionItem>
      ))}
    </Section>
  )
}

import type { ResumeCareerFieldsFragment } from '@shared/lib/gql/graphql'
import { Section, SectionItem, SectionItemContent, SectionItemSubtitle, SectionItemTitle, periodText, SectionItemShell, type SectionItemWrapper, type PreviewItem } from './Section'

export const CareerSection = ({ title, items, ItemWrapper }: { title: string; items: Array<PreviewItem<ResumeCareerFieldsFragment>>; ItemWrapper?: SectionItemWrapper }) => {
  return (
    <Section title={title}>
      {items.map((item, index) => (
        <SectionItemShell key={item.uid ?? index} ItemWrapper={ItemWrapper} uid={item.uid} index={index}>
          <SectionItem>
            <SectionItemTitle>{item.companyName}</SectionItemTitle>
            <SectionItemSubtitle parts={[item.role, periodText(item.period)]} />
            {item.contents && <SectionItemContent>{item.contents}</SectionItemContent>}
          </SectionItem>
        </SectionItemShell>
      ))}
    </Section>
  )
}

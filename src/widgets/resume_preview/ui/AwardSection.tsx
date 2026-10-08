import type { ResumeAwardFieldsFragment } from '@shared/lib/gql/graphql'
import { formatDate } from '@shared/lib'
import { Section, SectionItem, SectionItemSubtitle, SectionItemTitle, SectionItemShell, type SectionItemWrapper, type PreviewItem } from './Section'

export const AwardSection = ({ title, items, ItemWrapper }: { title: string; items: Array<PreviewItem<ResumeAwardFieldsFragment>>; ItemWrapper?: SectionItemWrapper }) => {
  return (
    <Section title={title}>
      {items.map((item, index) => (
        <SectionItemShell key={item.uid ?? index} ItemWrapper={ItemWrapper} uid={item.uid} index={index}>
          <SectionItem>
            <SectionItemTitle>{item.name}</SectionItemTitle>
            <SectionItemSubtitle parts={[item.organization, formatDate(item.awardedAt, 'YYYY.MM.DD')]} />
          </SectionItem>
        </SectionItemShell>
      ))}
    </Section>
  )
}

import type { ResumeLanguageFieldsFragment } from '@shared/lib/gql/graphql'
import { formatDate } from '@shared/lib'
import { Section, SectionItem, SectionItemSubtitle, SectionItemTitle, SectionItemShell, type SectionItemWrapper, type PreviewItem } from './Section'

export const LanguageSection = ({ title, items, ItemWrapper }: { title: string; items: Array<PreviewItem<ResumeLanguageFieldsFragment>>; ItemWrapper?: SectionItemWrapper }) => {
  return (
    <Section title={title}>
      {items.map((item, index) => (
        <SectionItemShell key={item.uid ?? index} ItemWrapper={ItemWrapper} uid={item.uid} index={index}>
          <SectionItem>
            <SectionItemTitle>{item.examName}</SectionItemTitle>
            <SectionItemSubtitle parts={[item.scoreOrGrade, formatDate(item.acquiredAt, 'YYYY.MM.DD')]} />
          </SectionItem>
        </SectionItemShell>
      ))}
    </Section>
  )
}

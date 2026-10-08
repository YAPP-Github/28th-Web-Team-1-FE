import type { ResumeCoreSkillFieldsFragment } from '@shared/lib/gql/graphql'
import { Section, SectionItem, SectionItemContent, SectionItemShell, type SectionItemWrapper, type PreviewItem } from './Section'

export const CoreSkillSection = ({ title, items, ItemWrapper }: { title: string; items: Array<PreviewItem<ResumeCoreSkillFieldsFragment>>; ItemWrapper?: SectionItemWrapper }) => {
  return (
    <Section title={title}>
      {items.map((item, index) => (
        <SectionItemShell key={index} ItemWrapper={ItemWrapper} uid={item.uid} index={index}>
          <SectionItem>
            <SectionItemContent>{item.content}</SectionItemContent>
          </SectionItem>
        </SectionItemShell>
      ))}
    </Section>
  )
}

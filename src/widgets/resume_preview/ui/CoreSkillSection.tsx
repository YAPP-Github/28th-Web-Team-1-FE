import type { ResumeCoreSkillFieldsFragment } from '@shared/lib/gql/graphql'
import { Section, SectionItem, SectionItemContent } from './Section'

export const CoreSkillSection = ({ title, items }: { title: string; items: ResumeCoreSkillFieldsFragment[] }) => {
  return (
    <Section title={title}>
      {items.map((item, index) => (
        <SectionItem key={index}>
          <SectionItemContent>{item.content}</SectionItemContent>
        </SectionItem>
      ))}
    </Section>
  )
}

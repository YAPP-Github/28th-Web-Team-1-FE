import type { ResumeCertificateFieldsFragment } from '@shared/lib/gql/graphql'
import { formatDate } from '@shared/lib'
import { Section, SectionItem, SectionItemSubtitle, SectionItemTitle, SectionItemShell, type SectionItemWrapper, type PreviewItem } from './Section'

export const CertificatesSection = ({ title, items, ItemWrapper }: { title: string; items: Array<PreviewItem<ResumeCertificateFieldsFragment>>; ItemWrapper?: SectionItemWrapper }) => {
  return (
    <Section title={title}>
      {items.map((item, index) => (
        <SectionItemShell key={item.uid ?? index} ItemWrapper={ItemWrapper} uid={item.uid} index={index}>
          <SectionItem>
            <SectionItemTitle>{item.name}</SectionItemTitle>
            <SectionItemSubtitle parts={[item.organization, formatDate(item.acquiredAt, 'YYYY.MM.DD')]} />
          </SectionItem>
        </SectionItemShell>
      ))}
    </Section>
  )
}

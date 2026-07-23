import type { ResumeCertificateFieldsFragment } from '@shared/lib/gql/graphql'
import { formatDate } from '@shared/lib'
import { Section, SectionItem, SectionItemSubtitle, SectionItemTitle } from './Section'

export const CertificatesSection = ({ title, items }: { title: string; items: ResumeCertificateFieldsFragment[] }) => {
  return (
    <Section title={title}>
      {items.map((item, index) => (
        <SectionItem key={index}>
          <SectionItemTitle>{item.name}</SectionItemTitle>
          <SectionItemSubtitle parts={[item.organization, formatDate(item.acquiredAt, 'YYYY.MM.DD')]} />
        </SectionItem>
      ))}
    </Section>
  )
}

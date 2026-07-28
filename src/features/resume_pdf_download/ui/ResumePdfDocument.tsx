import { Document, Page, StyleSheet, Text, View } from '@react-pdf/renderer'
import { Fragment, type ReactNode } from 'react'
import type { ResumeBasicInfoFieldsFragment } from '@shared/lib/gql/graphql'
import { formatDate, formatYYYYMM } from '@shared/lib'
import { payloadsOf, visibleItems, type ResumeSectionData } from '@entities/resume'
import { FONT_FAMILY } from '../lib/registerPdfFonts'

/**
 * 이력서 상세 미리보기(`@widgets/resume_preview`)를 react-pdf primitive로 옮긴 PDF 문서.
 * 미리보기가 DOM/Tailwind로 그리는 것과 달리 react-pdf는 자체 렌더러라 레이아웃을 다시 구성하지만,
 * 섹션 분기·아이템 추출은 미리보기와 동일한 헬퍼(payloadsOf/visibleItems)를 공유해 로직 이중화를 줄인다.
 */

// globals.css의 --color-gray-* 토큰과 맞춘 값
const COLOR = {
  basic: '#1e2124', // text-basic (이름·아이템 제목·본문)
  subtler: '#6d7882', // gray-50 (섹션 제목)
  meta: '#8a949e', // gray-40 (연락처·부제)
  divider: '#cdd1d5' // gray-20
}

const styles = StyleSheet.create({
  page: {
    fontFamily: FONT_FAMILY,
    paddingVertical: 44,
    paddingHorizontal: 40,
    color: COLOR.basic
  },

  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  name: { fontSize: 20, fontWeight: 700 },
  contact: { flexDirection: 'column', gap: 3, alignItems: 'flex-end' },
  contactText: { fontSize: 9, color: COLOR.meta },

  divider: { borderBottomWidth: 1, borderBottomColor: COLOR.divider, marginVertical: 16 },

  sections: { flexDirection: 'column', gap: 40 },
  section: { flexDirection: 'row', gap: 50 },
  sectionTitle: { width: 64, flexShrink: 0, fontSize: 10, color: COLOR.subtler },
  sectionBody: { flex: 1, flexDirection: 'column', gap: 24 },

  item: { flexDirection: 'column', gap: 3 },
  itemTitle: { fontSize: 11, fontWeight: 600 },
  subtitle: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  subtitleDivider: { width: 1, height: 9, backgroundColor: COLOR.divider },
  itemSubtitle: { fontSize: 9, color: COLOR.meta },
  itemContent: { fontSize: 9.5, color: COLOR.basic, lineHeight: 1.6, marginTop: 6 },

  skillGrid: { flexDirection: 'row', flexWrap: 'wrap' },
  skillCell: { width: '50%', flexDirection: 'row', alignItems: 'baseline', paddingRight: 24, marginBottom: 3 },
  skillName: { fontSize: 9.5, flexGrow: 1, flexShrink: 1, flexBasis: 0, minWidth: 0, maxLines: 1, textOverflow: 'ellipsis', marginRight: 8 },
  skillLevel: { fontSize: 9.5, color: COLOR.subtler, flexShrink: 0 }
})

/** `{ startAt, endAt }` 기간을 `2025.03 - 2025.06` 형태로. 둘 다 없으면 null. (미리보기 periodText와 동일 규약) */
const periodText = (period?: { startAt?: string | null; endAt?: string | null } | null): string | null => {
  const start = formatYYYYMM(period?.startAt)
  const end = formatYYYYMM(period?.endAt)
  if (!start && !end) return null
  return `${start} - ${end}`
}

/** 역할·기간·기관 등 메타를 `·`로 잇는다. 빈 값은 제외. 모두 비면 렌더 안 함. (미리보기 SectionItemSubtitle 대응) */
const Subtitle = ({ parts }: { parts: Array<string | null | undefined> }) => {
  const visible = parts.filter((part): part is string => Boolean(part && part.trim()))
  if (visible.length === 0) return null
  return (
    <View style={styles.subtitle}>
      {visible.map((part, index) => (
        <Fragment key={index}>
          {index > 0 && <View style={styles.subtitleDivider} />}
          <Text style={styles.itemSubtitle}>{part}</Text>
        </Fragment>
      ))}
    </View>
  )
}

const SectionRow = ({ title, children }: { title: string; children: ReactNode }) => (
  <View style={styles.section}>
    <Text style={styles.sectionTitle}>{title}</Text>
    <View style={styles.sectionBody}>{children}</View>
  </View>
)

/**
 * 제목 + 부제(+ 선택적 본문) 구조의 공통 아이템 블록.
 * 경력·활동·학력·자격증·수상·어학이 모두 이 형태라 공유한다. 페이지 중간에서 쪼개지지 않도록 wrap={false}.
 */
const ResumeItem = ({ title, subtitle, content }: { title: string | null | undefined; subtitle: Array<string | null | undefined>; content?: string | null }) => (
  <View style={styles.item} wrap={false}>
    <Text style={styles.itemTitle}>{title}</Text>
    <Subtitle parts={subtitle} />
    {content ? <Text style={styles.itemContent}>{content}</Text> : null}
  </View>
)

/** 서버 섹션 하나를 type으로 분기해 렌더한다. 미리보기 ResumeSectionView와 동일한 분기·라벨 규칙. */
const SectionView = ({ section }: { section: ResumeSectionData }) => {
  const { type, displayText } = section
  const items = visibleItems(section)

  switch (type) {
    case 'CORE_SKILL':
      return (
        <SectionRow title={displayText}>
          {payloadsOf(items, 'coreSkill').map((item, i) => (
            <Text key={i} style={styles.itemContent} wrap={false}>
              {item.content}
            </Text>
          ))}
        </SectionRow>
      )
    case 'CAREER':
      return (
        <SectionRow title={`${displayText} / 활동`}>
          {payloadsOf(items, 'career').map((item, i) => (
            <ResumeItem key={i} title={item.companyName} subtitle={[item.role, periodText(item.period)]} content={item.contents} />
          ))}
        </SectionRow>
      )
    case 'EXPERIENCE':
      return (
        <SectionRow title={displayText}>
          {payloadsOf(items, 'experience').map((item, i) => (
            <ResumeItem key={i} title={item.name} subtitle={[item.role, periodText(item.period)]} content={item.contents} />
          ))}
        </SectionRow>
      )
    case 'EDUCATION':
      return (
        <SectionRow title={displayText}>
          {payloadsOf(items, 'education').map((item, i) => (
            <ResumeItem key={i} title={[item.schoolName, item.major].filter(Boolean).join(' ')} subtitle={[periodText(item.period), item.degree, item.status]} />
          ))}
        </SectionRow>
      )
    case 'CERTIFICATE':
      return (
        <SectionRow title={displayText}>
          {payloadsOf(items, 'certificate').map((item, i) => (
            <ResumeItem key={i} title={item.name} subtitle={[item.organization, formatDate(item.acquiredAt, 'YYYY.MM.DD')]} />
          ))}
        </SectionRow>
      )
    case 'AWARD':
      return (
        <SectionRow title={displayText}>
          {payloadsOf(items, 'award').map((item, i) => (
            <ResumeItem key={i} title={item.name} subtitle={[item.organization, formatDate(item.awardedAt, 'YYYY.MM.DD')]} />
          ))}
        </SectionRow>
      )
    case 'LANGUAGE':
      return (
        <SectionRow title={displayText}>
          {payloadsOf(items, 'language').map((item, i) => (
            <ResumeItem key={i} title={item.examName} subtitle={[item.scoreOrGrade, formatDate(item.acquiredAt, 'YYYY.MM.DD')]} />
          ))}
        </SectionRow>
      )
    case 'SKILL':
      return (
        <SectionRow title={displayText}>
          <View style={styles.skillGrid} wrap={false}>
            {payloadsOf(items, 'skill').map((item, i) => (
              <View key={i} style={styles.skillCell}>
                <Text style={styles.skillName}>{item.name}</Text>
                {item.level && <Text style={styles.skillLevel}>{item.level}</Text>}
              </View>
            ))}
          </View>
        </SectionRow>
      )
    case 'BASIC_INFO':
    default:
      return null
  }
}

export interface ResumePdfDocumentProps {
  basicInfo: ResumeBasicInfoFieldsFragment | null
  sections: ResumeSectionData[]
}

export const ResumePdfDocument = ({ basicInfo, sections }: ResumePdfDocumentProps) => (
  <Document title={basicInfo?.name ? `${basicInfo.name} 이력서` : '이력서'}>
    <Page size="A4" style={styles.page}>
      <View style={styles.header}>
        <Text style={styles.name}>{basicInfo?.name ?? ''}</Text>
        {/* 연락처 숨김(hideContact) 시 전화·이메일 미표시 — 미리보기와 동일 */}
        {!basicInfo?.hideContact && (
          <View style={styles.contact}>
            {basicInfo?.phone && <Text style={styles.contactText}>{basicInfo.phone}</Text>}
            {basicInfo?.email && <Text style={styles.contactText}>{basicInfo.email}</Text>}
          </View>
        )}
      </View>

      <View style={styles.divider} />

      <View style={styles.sections}>
        {sections.map((section) => (
          <SectionView key={section.sectionId} section={section} />
        ))}
      </View>
    </Page>
  </Document>
)

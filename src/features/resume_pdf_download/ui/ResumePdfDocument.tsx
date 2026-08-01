import { Document, Page, StyleSheet, Text, View } from '@react-pdf/renderer'
import { Children, Fragment, type ReactNode } from 'react'
import type { Degree, EducationStatus, ResumeBasicInfoFieldsFragment, SkillLevel } from '@shared/lib/gql/graphql'
import { formatDate, formatYYYYMM } from '@shared/lib'
import { payloadsOf, visibleItems, type ResumeSectionData } from '@entities/resume'
import { DEGREE_LABELS, EDUCATION_STATUS_LABELS, SKILL_LEVEL_LABELS } from '@entities/profile'
import { FONT_FAMILY } from '../lib/registerPdfFonts'
import { buildResumeBaseName } from '../lib/resumeFileName'

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
  divider: '#cdd1d5' // gray-10
}

const styles = StyleSheet.create({
  page: {
    fontFamily: FONT_FAMILY,
    padding: 40,
    color: COLOR.basic
  },

  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', paddingBottom: 12 },
  name: { fontSize: 32, fontWeight: 700 },
  contact: { flexDirection: 'column', gap: 8, alignItems: 'flex-end' },
  contactText: { fontSize: 12, color: COLOR.meta },
  divider: { borderBottomWidth: 1, borderBottomColor: COLOR.divider, marginTop: 12, marginBottom: 24 },

  sections: { flexDirection: 'column', gap: 44 },
  // 섹션 = [제목+첫 항목 줄] + [빈 열+나머지 항목 줄]을 세로로 쌓음. 세로 gap은 항목 간격(24)과 동일.
  section: { flexDirection: 'column', gap: 24 },
  sectionLine: { flexDirection: 'row', gap: 48 }, // 제목(또는 빈 열) | 본문
  sectionTitle: { width: 72, flexShrink: 0, fontSize: 13, color: COLOR.subtler },
  sectionBody: { flex: 1, flexDirection: 'column', gap: 24 },

  item: { flexDirection: 'column', gap: 8 },
  itemTitle: { fontSize: 14, fontWeight: 600 },
  subtitle: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  subtitleDivider: { width: 1, height: 10, backgroundColor: COLOR.divider },
  itemSubtitle: { fontSize: 11, color: COLOR.meta },
  itemContent: { fontSize: 10, color: COLOR.basic, lineHeight: 1.8 },

  skillGrid: { flexDirection: 'row', flexWrap: 'wrap' },
  skillCell: { width: '50%', flexDirection: 'row', alignItems: 'baseline', paddingRight: 40, marginBottom: 6 },
  skillName: { fontSize: 12, flexGrow: 1, flexShrink: 1, flexBasis: 0, minWidth: 0, maxLines: 1, textOverflow: 'ellipsis', marginRight: 8 },
  skillLevel: { fontSize: 12, color: COLOR.subtler, flexShrink: 0 }
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

const SectionRow = ({ title, children }: { title: string; children: ReactNode }) => {
  const [first, ...rest] = Children.toArray(children)
  return (
    // '제목 + 첫 항목'을 wrap={false}로 묶어, 페이지 경계에서 제목만 홀로 남는 분리를 막는다(묶음은 항목 하나 크기라
    // 항상 한 페이지에 들어감 → 겹침 없음). 나머지 항목은 자유롭게 나뉘어(빈 좌측 열로 정렬 유지) 큰 섹션도 이어진다.
    <View style={styles.section}>
      <View style={styles.sectionLine} wrap={false}>
        <Text style={styles.sectionTitle}>{title}</Text>
        <View style={styles.sectionBody}>{first}</View>
      </View>
      {rest.length > 0 && (
        <View style={styles.sectionLine}>
          <View style={styles.sectionTitle} />
          <View style={styles.sectionBody}>{rest}</View>
        </View>
      )}
    </View>
  )
}

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
            <ResumeItem
              key={i}
              title={[item.schoolName, item.major].filter(Boolean).join(' ')}
              // 서버가 enum 코드('BACHELOR'/'GRADUATED')로 내려주므로 표시용 한글 라벨로 변환한다.
              subtitle={[
                periodText(item.period),
                item.degree ? (DEGREE_LABELS[item.degree as Degree] ?? item.degree) : null,
                item.status ? (EDUCATION_STATUS_LABELS[item.status as EducationStatus] ?? item.status) : null
              ]}
            />
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
                {item.level && <Text style={styles.skillLevel}>{SKILL_LEVEL_LABELS[item.level as SkillLevel] ?? item.level}</Text>}
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
  // 브라우저 탭 제목(Document title)에 사용 — 다운로드 파일명과 동일한 베이스로 맞춘다.
  companyName?: string | null
  positionTitle?: string | null
}

export const ResumePdfDocument = ({ basicInfo, sections, companyName, positionTitle }: ResumePdfDocumentProps) => (
  <Document title={buildResumeBaseName(companyName, positionTitle)}>
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

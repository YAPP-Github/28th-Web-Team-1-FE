import { formatPeriod, parsePeriodInput } from '@shared/lib'
import { DEGREE_LABELS as DEGREE, EDUCATION_STATUS_LABELS as STATUS, SKILL_LEVEL_LABELS as LEVEL, type Profile } from '@entities/profile'
import type { UpdateProfileRequest } from '@shared/lib/gql/graphql'
import { INITIAL_SECTION_TYPES, type ResumeSectionInstance, type ResumeSectionType } from './resumeSections'

/**
 * 이력서 기본 정보 프로필(GraphQL) ↔ 정보 확인 카드 매핑.
 * 카드 값은 전부 문자열이라, enum은 한글 라벨로 / 기간은 formatPeriod·parsePeriodInput로 왕복한다.
 * (라벨과 정확히 일치하지 않는 값은 저장 시 null로 떨어짐)
 */

const codeOf = <T extends string>(labels: Record<T, string>, label?: string): T | null => (Object.keys(labels) as T[]).find((code) => labels[code] === label?.trim()) ?? null
const nullIfBlank = (value?: string): string | null => value?.trim() || null
const card = (type: ResumeSectionType, values: Record<string, string>): ResumeSectionInstance => ({ id: crypto.randomUUID(), type, values })

/** 조회한 프로필을 카드 목록으로. 모든 섹션(기술 포함)이 항목당 1장, 항목이 없으면 빈 카드 1장(직접 채우도록). */
export const profileToSections = (profile: Profile): ResumeSectionInstance[] => {
  const rows: Record<ResumeSectionType, Array<Record<string, string>>> = {
    basic: [{ name: profile.name ?? '', phone: profile.phone ?? '', email: profile.email ?? '' }],
    education: profile.educations.map((e) => ({
      school: e.school ?? '',
      major: e.major ?? '',
      degree: e.degree ? DEGREE[e.degree] : '',
      status: e.status ? STATUS[e.status] : '',
      period: formatPeriod(e.period?.startAt, e.period?.endAt)
    })),
    career: profile.careers.map((c) => ({
      company: c.company ?? '',
      position: c.position ?? '',
      period: formatPeriod(c.period?.startAt, c.period?.endAt),
      description: c.description ?? ''
    })),
    award: profile.awards.map((a) => ({ title: a.title ?? '', organization: a.organization ?? '', awardedAt: a.awardedAt ?? '' })),
    language: profile.languageTests.map((l) => ({ testName: l.testName ?? '', score: l.score ?? '', acquiredAt: l.acquiredAt ?? '' })),
    certificate: profile.certifications.map((c) => ({ name: c.name ?? '', issuer: c.issuer ?? '', acquiredAt: c.acquiredAt ?? '' })),
    skill: profile.skills.map((k) => ({ name: k.name ?? '', level: k.level ? LEVEL[k.level] : '' }))
  }
  return INITIAL_SECTION_TYPES.flatMap((type) => (rows[type].length ? rows[type].map((values) => card(type, values)) : [card(type, {})]))
}

/** 카드 목록을 프로필 수정 요청으로. 빈 카드는 제외하고, coreCompetency는 미포함(=미변경)해 기존 값을 보존한다. */
export const sectionsToUpdateRequest = (sections: ResumeSectionInstance[]): UpdateProfileRequest => {
  const basic = sections.find((section) => section.type === 'basic')?.values ?? {}
  const pick = (type: ResumeSectionType) => sections.filter((section) => section.type === type && Object.values(section.values).some((v) => v?.trim())).map((section) => section.values)
  return {
    name: basic.name?.trim(),
    email: basic.email?.trim(),
    phone: basic.phone?.trim(),
    educations: pick('education').map((v) => ({
      school: nullIfBlank(v.school),
      major: nullIfBlank(v.major),
      degree: codeOf(DEGREE, v.degree),
      status: codeOf(STATUS, v.status),
      period: parsePeriodInput(v.period ?? '')
    })),
    careers: pick('career').map((v) => ({
      company: nullIfBlank(v.company),
      position: nullIfBlank(v.position),
      period: parsePeriodInput(v.period ?? ''),
      description: nullIfBlank(v.description)
    })),
    awards: pick('award').map((v) => ({ title: nullIfBlank(v.title), organization: nullIfBlank(v.organization), awardedAt: nullIfBlank(v.awardedAt) })),
    languageTests: pick('language').map((v) => ({ testName: nullIfBlank(v.testName), score: nullIfBlank(v.score), acquiredAt: nullIfBlank(v.acquiredAt) })),
    certifications: pick('certificate').map((v) => ({ name: nullIfBlank(v.name), issuer: nullIfBlank(v.issuer), acquiredAt: nullIfBlank(v.acquiredAt) })),
    skills: pick('skill')
      .filter((v) => v.name?.trim())
      .map((v) => ({ name: nullIfBlank(v.name), level: codeOf(LEVEL, v.level) }))
  }
}

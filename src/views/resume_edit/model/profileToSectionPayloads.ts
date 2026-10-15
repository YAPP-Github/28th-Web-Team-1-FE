import type { Profile } from '@entities/profile'
import type { ResumeFormItem } from './resume-form.types'

/** 프로필의 카테고리별 목록을 편집 폼의 아이템 payload 배열로 변환한 결과. */
export type ProfileSectionPayload = Partial<ResumeFormItem['payload']>

/** 기간이 비어 있는지(시작·종료 모두 없음) 판단한다. 빈 항목 필터에서 공통으로 쓴다. */
const isEmptyPeriod = (period?: { startAt: string | null; endAt: string | null } | null) => !period?.startAt && !period?.endAt

/** 프로필 학력 → EDUCATION 섹션 아이템 payload. 빈 항목은 제외한다. */
export const toEducationPayloads = (profile: Profile): ProfileSectionPayload[] =>
  profile.educations
    .filter((education) => education.school || education.major || education.degree || education.status || !isEmptyPeriod(education.period))
    .map((education) => ({
      education: {
        schoolName: education.school ?? '',
        major: education.major ?? null,
        degree: education.degree ?? null,
        status: education.status ?? null,
        period: education.period ?? null
      }
    }))

/** 프로필 경력 → CAREER 섹션 아이템 payload. 빈 항목은 제외한다. */
export const toCareerPayloads = (profile: Profile): ProfileSectionPayload[] =>
  profile.careers
    .filter((career) => career.company || career.position || career.description || !isEmptyPeriod(career.period))
    .map((career) => ({
      career: {
        companyName: career.company ?? '',
        role: career.position ?? null,
        contents: career.description ?? '',
        period: career.period ?? null
      }
    }))

/** 프로필 수상 → AWARD 섹션 아이템 payload. 빈 항목은 제외한다. */
export const toAwardPayloads = (profile: Profile): ProfileSectionPayload[] =>
  profile.awards
    .filter((award) => award.title || award.organization || award.awardedAt)
    .map((award) => ({ award: { name: award.title ?? '', organization: award.organization ?? null, awardedAt: award.awardedAt ?? null } }))

/** 프로필 어학 → LANGUAGE 섹션 아이템 payload. 빈 항목은 제외한다. */
export const toLanguagePayloads = (profile: Profile): ProfileSectionPayload[] =>
  profile.languageTests
    .filter((languageTest) => languageTest.testName || languageTest.score || languageTest.acquiredAt)
    .map((languageTest) => ({ language: { examName: languageTest.testName ?? '', scoreOrGrade: languageTest.score ?? '', acquiredAt: languageTest.acquiredAt ?? null } }))

/** 프로필 자격증 → CERTIFICATE 섹션 아이템 payload. 빈 항목은 제외한다. */
export const toCertificatePayloads = (profile: Profile): ProfileSectionPayload[] =>
  profile.certifications
    .filter((certification) => certification.name || certification.issuer || certification.acquiredAt)
    .map((certification) => ({ certificate: { name: certification.name ?? '', organization: certification.issuer ?? null, acquiredAt: certification.acquiredAt ?? null } }))

/** 프로필 기술 → SKILL 섹션 아이템 payload. 이름이 빈 항목은 제외한다. */
export const toSkillPayloads = (profile: Profile): ProfileSectionPayload[] =>
  profile.skills.filter((skill) => skill.name).map((skill) => ({ skill: { name: skill.name ?? '', level: skill.level ?? null } }))

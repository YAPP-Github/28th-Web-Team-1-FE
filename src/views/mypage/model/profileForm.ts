import type { Profile } from '@entities/profile'
import type {
  PeriodInput,
  ProfileAwardRequest,
  ProfileCareerRequest,
  ProfileCertificationRequest,
  ProfileEducationRequest,
  ProfileLanguageTestRequest,
  ProfileSkillRequest,
  UpdateProfileRequest
} from '@shared/lib/gql/graphql'

// ---- 폼 값 타입 ----

interface FormPeriod {
  startAt: string | null
  endAt: string | null
}

export interface BasicForm {
  name: string
  phone: string
  email: string
}
export interface CoreCompetencyForm {
  coreCompetency: string
}
export interface EducationForm {
  school: string
  status: string
  period: FormPeriod
  major: string
  degree: string
}
export interface CareerForm {
  company: string
  position: string
  period: FormPeriod
  description: string
}
export interface LanguageForm {
  testName: string
  score: string
  acquiredAt: string
}
export interface AwardForm {
  title: string
  organization: string
  awardedAt: string
}
export interface CertificateForm {
  name: string
  issuer: string
  acquiredAt: string
}
export interface SkillForm {
  name: string
  level: string
}

// ---- 공통 헬퍼 ----

const nullIfBlank = (value?: string | null): string | null => value?.trim() || null
const toPeriod = (period?: { startAt: string | null; endAt: string | null } | null): FormPeriod => ({ startAt: period?.startAt ?? null, endAt: period?.endAt ?? null })
const periodToRequest = (period: FormPeriod): PeriodInput | null => (period.startAt || period.endAt ? { startAt: period.startAt, endAt: period.endAt } : null)

export const toBasicForm = (profile: Profile): BasicForm => ({ name: profile.name ?? '', phone: profile.phone ?? '', email: profile.email ?? '' })
export const toCoreCompetencyForm = (profile: Profile): CoreCompetencyForm => ({ coreCompetency: profile.coreCompetency ?? '' })

export const toEducationForms = (profile: Profile): EducationForm[] =>
  profile.educations.map((e) => ({ school: e.school ?? '', major: e.major ?? '', degree: e.degree ?? '', status: e.status ?? '', period: toPeriod(e.period) }))

export const toCareerForms = (profile: Profile): CareerForm[] =>
  profile.careers.map((c) => ({ company: c.company ?? '', position: c.position ?? '', description: c.description ?? '', period: toPeriod(c.period) }))

export const toLanguageForms = (profile: Profile): LanguageForm[] => profile.languageTests.map((l) => ({ testName: l.testName ?? '', score: l.score ?? '', acquiredAt: l.acquiredAt ?? '' }))

export const toAwardForms = (profile: Profile): AwardForm[] => profile.awards.map((a) => ({ title: a.title ?? '', organization: a.organization ?? '', awardedAt: a.awardedAt ?? '' }))

export const toCertificateForms = (profile: Profile): CertificateForm[] => profile.certifications.map((c) => ({ name: c.name ?? '', issuer: c.issuer ?? '', acquiredAt: c.acquiredAt ?? '' }))

export const toSkillForms = (profile: Profile): SkillForm[] => profile.skills.map((k) => ({ name: k.name ?? '', level: k.level ?? '' }))

// ---- 새 항목 추가 시 쓰는 빈 값 ----

export const EMPTY_EDUCATION: EducationForm = { school: '', major: '', degree: '', status: '', period: { startAt: null, endAt: null } }
export const EMPTY_CAREER: CareerForm = { company: '', position: '', description: '', period: { startAt: null, endAt: null } }
export const EMPTY_LANGUAGE: LanguageForm = { testName: '', score: '', acquiredAt: '' }
export const EMPTY_AWARD: AwardForm = { title: '', organization: '', awardedAt: '' }
export const EMPTY_CERTIFICATE: CertificateForm = { name: '', issuer: '', acquiredAt: '' }
export const EMPTY_SKILL: SkillForm = { name: '', level: '' }

// ---- 폼 → 저장 요청 (섹션 슬라이스) ----

const educationsToRequest = (items: EducationForm[]): ProfileEducationRequest[] =>
  items
    .filter((item) => item.school.trim() || item.major.trim() || item.degree || item.status || item.period.startAt || item.period.endAt)
    .map((item) => ({
      school: nullIfBlank(item.school),
      major: nullIfBlank(item.major),
      degree: (item.degree || null) as ProfileEducationRequest['degree'],
      status: (item.status || null) as ProfileEducationRequest['status'],
      period: periodToRequest(item.period)
    }))

const careersToRequest = (items: CareerForm[]): ProfileCareerRequest[] =>
  items
    .filter((item) => item.company.trim() || item.position.trim() || item.description.trim() || item.period.startAt || item.period.endAt)
    .map((item) => ({ company: nullIfBlank(item.company), position: nullIfBlank(item.position), description: nullIfBlank(item.description), period: periodToRequest(item.period) }))

const languageTestsToRequest = (items: LanguageForm[]): ProfileLanguageTestRequest[] =>
  items
    .filter((item) => item.testName.trim() || item.score.trim() || item.acquiredAt)
    .map((item) => ({ testName: nullIfBlank(item.testName), score: nullIfBlank(item.score), acquiredAt: nullIfBlank(item.acquiredAt) }))

const awardsToRequest = (items: AwardForm[]): ProfileAwardRequest[] =>
  items
    .filter((item) => item.title.trim() || item.organization.trim() || item.awardedAt)
    .map((item) => ({ title: nullIfBlank(item.title), organization: nullIfBlank(item.organization), awardedAt: nullIfBlank(item.awardedAt) }))

const certificationsToRequest = (items: CertificateForm[]): ProfileCertificationRequest[] =>
  items
    .filter((item) => item.name.trim() || item.issuer.trim() || item.acquiredAt)
    .map((item) => ({ name: nullIfBlank(item.name), issuer: nullIfBlank(item.issuer), acquiredAt: nullIfBlank(item.acquiredAt) }))

const skillsToRequest = (items: SkillForm[]): ProfileSkillRequest[] =>
  items.filter((item) => item.name.trim()).map((item) => ({ name: nullIfBlank(item.name), level: (item.level || null) as ProfileSkillRequest['level'] }))

/**
 * 현재 프로필을 그대로 `UpdateProfileRequest`(전체 스냅샷)로 변환한다.
 * 섹션 저장 시 이 베이스에 자기 섹션만 덮어써서 보낸다: `{ ...profileToUpdateRequest(profile), educations }`.
 */
const profileToUpdateRequest = (profile: Profile): UpdateProfileRequest => ({
  name: profile.name,
  email: profile.email,
  phone: profile.phone,
  coreCompetency: profile.coreCompetency,
  educations: educationsToRequest(toEducationForms(profile)),
  careers: careersToRequest(toCareerForms(profile)),
  awards: awardsToRequest(toAwardForms(profile)),
  languageTests: languageTestsToRequest(toLanguageForms(profile)),
  certifications: certificationsToRequest(toCertificateForms(profile)),
  skills: skillsToRequest(toSkillForms(profile))
})

export const withBasic = (profile: Profile, form: BasicForm): UpdateProfileRequest => ({
  ...profileToUpdateRequest(profile),
  name: nullIfBlank(form.name),
  email: nullIfBlank(form.email),
  phone: nullIfBlank(form.phone)
})
export const withCoreCompetency = (profile: Profile, form: CoreCompetencyForm): UpdateProfileRequest => ({ ...profileToUpdateRequest(profile), coreCompetency: nullIfBlank(form.coreCompetency) })
export const withEducations = (profile: Profile, items: EducationForm[]): UpdateProfileRequest => ({ ...profileToUpdateRequest(profile), educations: educationsToRequest(items) })
export const withCareers = (profile: Profile, items: CareerForm[]): UpdateProfileRequest => ({ ...profileToUpdateRequest(profile), careers: careersToRequest(items) })
export const withLanguageTests = (profile: Profile, items: LanguageForm[]): UpdateProfileRequest => ({ ...profileToUpdateRequest(profile), languageTests: languageTestsToRequest(items) })
export const withAwards = (profile: Profile, items: AwardForm[]): UpdateProfileRequest => ({ ...profileToUpdateRequest(profile), awards: awardsToRequest(items) })
export const withCertifications = (profile: Profile, items: CertificateForm[]): UpdateProfileRequest => ({ ...profileToUpdateRequest(profile), certifications: certificationsToRequest(items) })
export const withSkills = (profile: Profile, items: SkillForm[]): UpdateProfileRequest => ({ ...profileToUpdateRequest(profile), skills: skillsToRequest(items) })

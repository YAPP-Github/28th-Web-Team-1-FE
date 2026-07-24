import type { Profile } from '@entities/profile'
import type {
  Degree,
  EducationStatus,
  PeriodInput,
  ProfileAwardRequest,
  ProfileCareerRequest,
  ProfileCertificationRequest,
  ProfileEducationRequest,
  ProfileLanguageTestRequest,
  ProfileSkillRequest,
  SkillLevel,
  UpdateProfileRequest
} from '@shared/lib/gql/graphql'

/**
 * 마이페이지 "내 정보" 편집 폼 모델.
 *
 * `updateProfile`가 프로필 전체 스냅샷을 교체하므로, 각 섹션 저장은 `profileToUpdateRequest(profile)`로 만든
 * 베이스 스냅샷에 자기 섹션만 덮어써서 보낸다. 폼 값은 저장 형태에 가깝게(enum=코드, 기간=`{startAt,endAt}`,
 * 날짜=`YYYY-MM-DD`) 들고 다니고, 표시용 라벨 변환은 렌더링(드롭다운)에서 한다.
 */

/** enum 코드 ↔ 한글 라벨의 단일 출처. (`satisfies`로 enum 전체 강제) */
export const DEGREE_LABELS = { BACHELOR: '학사', MASTER: '석사', DOCTOR: '박사' } satisfies Record<Degree, string>
export const EDUCATION_STATUS_LABELS = { ENROLLED: '재학', ON_LEAVE: '휴학', GRADUATED: '졸업', EXPECTED_GRADUATION: '졸업예정', COMPLETED: '수료' } satisfies Record<EducationStatus, string>
export const SKILL_LEVEL_LABELS = { HIGH: '상', MEDIUM: '중', LOW: '하' } satisfies Record<SkillLevel, string>

export interface SelectOption {
  value: string
  label: string
}
const toOptions = (labels: Record<string, string>): SelectOption[] => Object.entries(labels).map(([value, label]) => ({ value, label }))

export const DEGREE_OPTIONS = toOptions(DEGREE_LABELS)
export const EDUCATION_STATUS_OPTIONS = toOptions(EDUCATION_STATUS_LABELS)
export const SKILL_LEVEL_OPTIONS = toOptions(SKILL_LEVEL_LABELS)

// ---- 폼 값 타입 ----

export interface FormPeriod {
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

// ---- 프로필 → 폼 (seed) ----

export const toBasicForm = (profile: Profile): BasicForm => ({ name: profile.name ?? '', phone: profile.phone ?? '', email: profile.email ?? '' })
export const toCoreCompetencyForm = (profile: Profile): CoreCompetencyForm => ({ coreCompetency: profile.coreCompetency ?? '' })

export const toEducationForms = (profile: Profile): EducationForm[] =>
  profile.educations.map((e) => ({ school: e.school ?? '', status: e.status ?? '', period: toPeriod(e.period), major: e.major ?? '', degree: e.degree ?? '' }))
export const toCareerForms = (profile: Profile): CareerForm[] =>
  profile.careers.map((c) => ({ company: c.company ?? '', position: c.position ?? '', period: toPeriod(c.period), description: c.description ?? '' }))
export const toLanguageForms = (profile: Profile): LanguageForm[] => profile.languageTests.map((l) => ({ testName: l.testName ?? '', score: l.score ?? '', acquiredAt: l.acquiredAt ?? '' }))
export const toAwardForms = (profile: Profile): AwardForm[] => profile.awards.map((a) => ({ title: a.title ?? '', organization: a.organization ?? '', awardedAt: a.awardedAt ?? '' }))
export const toCertificateForms = (profile: Profile): CertificateForm[] => profile.certifications.map((c) => ({ name: c.name ?? '', issuer: c.issuer ?? '', acquiredAt: c.acquiredAt ?? '' }))
export const toSkillForms = (profile: Profile): SkillForm[] => profile.skills.map((s) => ({ name: s.name ?? '', level: s.level ?? '' }))

// 새 항목 추가 시 쓰는 빈 값
export const EMPTY_EDUCATION: EducationForm = { school: '', status: '', period: { startAt: null, endAt: null }, major: '', degree: '' }
export const EMPTY_CAREER: CareerForm = { company: '', position: '', period: { startAt: null, endAt: null }, description: '' }
export const EMPTY_LANGUAGE: LanguageForm = { testName: '', score: '', acquiredAt: '' }
export const EMPTY_AWARD: AwardForm = { title: '', organization: '', awardedAt: '' }
export const EMPTY_CERTIFICATE: CertificateForm = { name: '', issuer: '', acquiredAt: '' }
export const EMPTY_SKILL: SkillForm = { name: '', level: '' }

// ---- 폼 → 저장 요청 (섹션 슬라이스) ----

const educationsToRequest = (items: EducationForm[]): ProfileEducationRequest[] =>
  items
    .filter((e) => e.school.trim() || e.major.trim() || e.degree || e.status || e.period.startAt || e.period.endAt)
    .map((e) => ({
      school: nullIfBlank(e.school),
      major: nullIfBlank(e.major),
      degree: (e.degree || null) as Degree | null,
      status: (e.status || null) as EducationStatus | null,
      period: periodToRequest(e.period)
    }))

const careersToRequest = (items: CareerForm[]): ProfileCareerRequest[] =>
  items
    .filter((c) => c.company.trim() || c.position.trim() || c.description.trim() || c.period.startAt || c.period.endAt)
    .map((c) => ({ company: nullIfBlank(c.company), position: nullIfBlank(c.position), description: nullIfBlank(c.description), period: periodToRequest(c.period) }))

const languageTestsToRequest = (items: LanguageForm[]): ProfileLanguageTestRequest[] =>
  items.filter((l) => l.testName.trim() || l.score.trim() || l.acquiredAt).map((l) => ({ testName: nullIfBlank(l.testName), score: nullIfBlank(l.score), acquiredAt: nullIfBlank(l.acquiredAt) }))

const awardsToRequest = (items: AwardForm[]): ProfileAwardRequest[] =>
  items
    .filter((a) => a.title.trim() || a.organization.trim() || a.awardedAt)
    .map((a) => ({ title: nullIfBlank(a.title), organization: nullIfBlank(a.organization), awardedAt: nullIfBlank(a.awardedAt) }))

const certificationsToRequest = (items: CertificateForm[]): ProfileCertificationRequest[] =>
  items.filter((c) => c.name.trim() || c.issuer.trim() || c.acquiredAt).map((c) => ({ name: nullIfBlank(c.name), issuer: nullIfBlank(c.issuer), acquiredAt: nullIfBlank(c.acquiredAt) }))

const skillsToRequest = (items: SkillForm[]): ProfileSkillRequest[] => items.filter((s) => s.name.trim()).map((s) => ({ name: nullIfBlank(s.name), level: (s.level || null) as SkillLevel | null }))

/**
 * 현재 프로필을 그대로 `UpdateProfileRequest`(전체 스냅샷)로 변환한다.
 * 섹션 저장 시 이 베이스에 자기 섹션만 덮어써서 보낸다: `{ ...profileToUpdateRequest(profile), educations }`.
 */
export const profileToUpdateRequest = (profile: Profile): UpdateProfileRequest => ({
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

/** 섹션 저장용 헬퍼: 베이스 스냅샷에 한 섹션만 덮어쓴 요청을 만든다. */
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

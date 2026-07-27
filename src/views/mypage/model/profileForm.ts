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

/**
 * 마이페이지 "내 정보" 편집 폼 모델.
 *
 * `updateProfile`가 프로필 전체 스냅샷을 교체하므로, 각 섹션 저장은 `profileToUpdateRequest(profile)`로 만든
 * 베이스 스냅샷에 자기 섹션만 덮어써서 보낸다. 폼 값은 저장 형태에 가깝게(enum=코드, 기간=`{startAt,endAt}`,
 * 날짜=`YYYY-MM-DD`) 들고 다니고, 표시용 라벨 변환은 렌더링(드롭다운)에서 한다.
 *
 * 학력/경력/어학/수상/자격증/기술 6개 도메인은 폼 필드명이 `Profile` 서브아이템·`*Request` 타입과
 * 정확히 일치해서(예: 학력 = school/major/degree/status/period), 필드별 반복 로직(seed/빈값/request 변환)을
 * `FieldSpec` 설정 + 아래 엔진으로 대체했다. 도메인을 추가/수정할 땐 새 함수를 쓰는 대신 `*_FIELDS` 배열만 바꾸면 된다.
 */

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

export const toBasicForm = (profile: Profile): BasicForm => ({ name: profile.name ?? '', phone: profile.phone ?? '', email: profile.email ?? '' })
export const toCoreCompetencyForm = (profile: Profile): CoreCompetencyForm => ({ coreCompetency: profile.coreCompetency ?? '' })

// ---- 반복 섹션(학력/경력/어학/수상/자격증/기술) 공통 엔진 ----

type FieldKind = 'text' | 'date' | 'enum' | 'period'

/**
 * key는 TForm과 TReq 양쪽에 실존해야 한다(오타 방지). period 값 필드는 kind:'period'만 허용하도록
 * 조건부 타입으로 제약해, 기간 필드를 text/enum으로 잘못 표시하는 실수를 컴파일 타임에 막는다.
 */
type FieldSpec<TForm, TReq> = {
  [K in keyof TForm & keyof TReq & string]: TForm[K] extends FormPeriod ? { key: K; kind: 'period' } : { key: K; kind: 'text' | 'date' | 'enum' }
}[keyof TForm & keyof TReq & string]

const isFieldBlank = (kind: FieldKind, value: unknown): boolean => {
  if (kind === 'period') {
    const period = value as FormPeriod
    return !period.startAt && !period.endAt
  }
  if (kind === 'text') return !(value as string)?.trim()
  return !value // 'date' | 'enum' — 기존 코드와 동일하게 trim 없이 truthy만 확인
}

const fieldToRequestValue = (kind: FieldKind, value: unknown): unknown => {
  if (kind === 'period') return periodToRequest(value as FormPeriod)
  if (kind === 'enum') return (value as string) || null
  return nullIfBlank(value as string) // 'text' | 'date'
}

const fieldToFormValue = (kind: FieldKind, value: unknown): unknown =>
  kind === 'period' ? toPeriod(value as { startAt: string | null; endAt: string | null } | null) : ((value as string | null) ?? '')

// TS는 `FieldSpec`(매핑+인덱스 접근 조건부 타입)만으로 TForm/TReq를 역추론하지 못하므로, 아래 세 함수는
// 항상 호출부에서 `<Form, Request>` 타입 인자를 명시한다(TSource만 인자에서 추론되도록 마지막에 둠).
const buildFormItems = <TForm, TReq, TSource>(items: readonly TSource[], fields: ReadonlyArray<FieldSpec<TForm, TReq>>): TForm[] =>
  items.map((item) => {
    const form = {} as Record<string, unknown>
    const source = item as Record<string, unknown>
    fields.forEach((f) => {
      form[f.key] = fieldToFormValue(f.kind, source[f.key])
    })
    return form as TForm
  })

const emptyFormRow = <TForm, TReq>(fields: ReadonlyArray<FieldSpec<TForm, TReq>>): TForm => {
  const form = {} as Record<string, unknown>
  fields.forEach((f) => {
    form[f.key] = f.kind === 'period' ? { startAt: null, endAt: null } : ''
  })
  return form as TForm
}

/**
 * isRowBlank 기본값 = "설정된 필드 중 하나라도 값이 있으면 유지"(학력/경력/어학/수상/자격증 공통 규칙).
 * skill처럼 예외가 있는 도메인만 override로 넘긴다(name만으로 판단, level은 무시).
 */
const buildRequestItems = <TForm, TReq>(
  items: readonly TForm[],
  fields: ReadonlyArray<FieldSpec<TForm, TReq>>,
  isRowBlank: (item: TForm) => boolean = (item) => fields.every((f) => isFieldBlank(f.kind, (item as Record<string, unknown>)[f.key]))
): TReq[] =>
  items
    .filter((item) => !isRowBlank(item))
    .map((item) => {
      const request = {} as Record<string, unknown>
      const source = item as Record<string, unknown>
      fields.forEach((f) => {
        request[f.key] = fieldToRequestValue(f.kind, source[f.key])
      })
      return request as TReq
    })

// ---- 도메인별 필드 설정 ----

const EDUCATION_FIELDS: Array<FieldSpec<EducationForm, ProfileEducationRequest>> = [
  { key: 'school', kind: 'text' },
  { key: 'major', kind: 'text' },
  { key: 'degree', kind: 'enum' },
  { key: 'status', kind: 'enum' },
  { key: 'period', kind: 'period' }
]
const CAREER_FIELDS: Array<FieldSpec<CareerForm, ProfileCareerRequest>> = [
  { key: 'company', kind: 'text' },
  { key: 'position', kind: 'text' },
  { key: 'description', kind: 'text' },
  { key: 'period', kind: 'period' }
]
const LANGUAGE_FIELDS: Array<FieldSpec<LanguageForm, ProfileLanguageTestRequest>> = [
  { key: 'testName', kind: 'text' },
  { key: 'score', kind: 'text' },
  { key: 'acquiredAt', kind: 'date' }
]
const AWARD_FIELDS: Array<FieldSpec<AwardForm, ProfileAwardRequest>> = [
  { key: 'title', kind: 'text' },
  { key: 'organization', kind: 'text' },
  { key: 'awardedAt', kind: 'date' }
]
const CERTIFICATE_FIELDS: Array<FieldSpec<CertificateForm, ProfileCertificationRequest>> = [
  { key: 'name', kind: 'text' },
  { key: 'issuer', kind: 'text' },
  { key: 'acquiredAt', kind: 'date' }
]
const SKILL_FIELDS: Array<FieldSpec<SkillForm, ProfileSkillRequest>> = [
  { key: 'name', kind: 'text' },
  { key: 'level', kind: 'enum' }
]

// ---- 프로필 → 폼 (seed) ----

export const toEducationForms = (profile: Profile): EducationForm[] => buildFormItems<EducationForm, ProfileEducationRequest, Profile['educations'][number]>(profile.educations, EDUCATION_FIELDS)
export const toCareerForms = (profile: Profile): CareerForm[] => buildFormItems<CareerForm, ProfileCareerRequest, Profile['careers'][number]>(profile.careers, CAREER_FIELDS)
export const toLanguageForms = (profile: Profile): LanguageForm[] => buildFormItems<LanguageForm, ProfileLanguageTestRequest, Profile['languageTests'][number]>(profile.languageTests, LANGUAGE_FIELDS)
export const toAwardForms = (profile: Profile): AwardForm[] => buildFormItems<AwardForm, ProfileAwardRequest, Profile['awards'][number]>(profile.awards, AWARD_FIELDS)
export const toCertificateForms = (profile: Profile): CertificateForm[] =>
  buildFormItems<CertificateForm, ProfileCertificationRequest, Profile['certifications'][number]>(profile.certifications, CERTIFICATE_FIELDS)
export const toSkillForms = (profile: Profile): SkillForm[] => buildFormItems<SkillForm, ProfileSkillRequest, Profile['skills'][number]>(profile.skills, SKILL_FIELDS)

// 새 항목 추가 시 쓰는 빈 값
export const EMPTY_EDUCATION: EducationForm = emptyFormRow<EducationForm, ProfileEducationRequest>(EDUCATION_FIELDS)
export const EMPTY_CAREER: CareerForm = emptyFormRow<CareerForm, ProfileCareerRequest>(CAREER_FIELDS)
export const EMPTY_LANGUAGE: LanguageForm = emptyFormRow<LanguageForm, ProfileLanguageTestRequest>(LANGUAGE_FIELDS)
export const EMPTY_AWARD: AwardForm = emptyFormRow<AwardForm, ProfileAwardRequest>(AWARD_FIELDS)
export const EMPTY_CERTIFICATE: CertificateForm = emptyFormRow<CertificateForm, ProfileCertificationRequest>(CERTIFICATE_FIELDS)
export const EMPTY_SKILL: SkillForm = emptyFormRow<SkillForm, ProfileSkillRequest>(SKILL_FIELDS)

// ---- 폼 → 저장 요청 (섹션 슬라이스) ----

const educationsToRequest = (items: EducationForm[]): ProfileEducationRequest[] => buildRequestItems<EducationForm, ProfileEducationRequest>(items, EDUCATION_FIELDS)
const careersToRequest = (items: CareerForm[]): ProfileCareerRequest[] => buildRequestItems<CareerForm, ProfileCareerRequest>(items, CAREER_FIELDS)
const languageTestsToRequest = (items: LanguageForm[]): ProfileLanguageTestRequest[] => buildRequestItems<LanguageForm, ProfileLanguageTestRequest>(items, LANGUAGE_FIELDS)
const awardsToRequest = (items: AwardForm[]): ProfileAwardRequest[] => buildRequestItems<AwardForm, ProfileAwardRequest>(items, AWARD_FIELDS)
const certificationsToRequest = (items: CertificateForm[]): ProfileCertificationRequest[] => buildRequestItems<CertificateForm, ProfileCertificationRequest>(items, CERTIFICATE_FIELDS)
// skill은 name만으로 빈 행을 판단한다(level만 채워진 행은 저장하지 않음) — 기존 동작 보존을 위한 override.
const skillsToRequest = (items: SkillForm[]): ProfileSkillRequest[] => buildRequestItems<SkillForm, ProfileSkillRequest>(items, SKILL_FIELDS, (item) => !item.name.trim())

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

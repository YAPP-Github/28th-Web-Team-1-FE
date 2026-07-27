import type { Degree, EducationStatus, SkillLevel } from '@shared/lib/gql/graphql'

/** enum 코드 ↔ 한글 라벨의 단일 출처. (`satisfies`로 enum 전체 강제) 마이페이지·온보딩이 함께 참조한다. */
export const DEGREE_LABELS = { BACHELOR: '학사', MASTER: '석사', DOCTOR: '박사' } satisfies Record<Degree, string>
export const EDUCATION_STATUS_LABELS = { ENROLLED: '재학', ON_LEAVE: '휴학', GRADUATED: '졸업', EXPECTED_GRADUATION: '졸업예정', COMPLETED: '수료' } satisfies Record<EducationStatus, string>
export const SKILL_LEVEL_LABELS = { HIGH: '상', MEDIUM: '중', LOW: '하' } satisfies Record<SkillLevel, string>

/** 라벨 목록(드롭다운 선택지 등)이 필요할 때 쓰는 파생 배열. */
export const DEGREE_LEVELS = Object.values(DEGREE_LABELS)
export const EDUCATION_STATUSES = Object.values(EDUCATION_STATUS_LABELS)
export const SKILL_LEVELS = Object.values(SKILL_LEVEL_LABELS)

export interface SelectOption {
  value: string
  label: string
}
const toOptions = (labels: Record<string, string>): SelectOption[] => Object.entries(labels).map(([value, label]) => ({ value, label }))

/** `{value, label}` 형태의 드롭다운 선택지(값=enum 코드). */
export const DEGREE_OPTIONS = toOptions(DEGREE_LABELS)
export const EDUCATION_STATUS_OPTIONS = toOptions(EDUCATION_STATUS_LABELS)
export const SKILL_LEVEL_OPTIONS = toOptions(SKILL_LEVEL_LABELS)

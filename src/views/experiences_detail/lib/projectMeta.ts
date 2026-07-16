import { formatPeriod } from './formatPeriod'

/**
 * 프로젝트 단위의 역할·기간 값. 경험별로 저장되지 않아 프로젝트 값을 공통 표시한다.
 * 빈값은 `''`로 유지하고, `-` 대체는 표시하는 컴포넌트에서만 적용한다.
 */
export interface ProjectMeta {
  role: string
  period: string
}

/**
 * 프로젝트 단건에서 표시/입력에 쓸 역할·기간을 원본값(빈값은 `''`)으로 유도한다.
 * @param project `role`(nullable)과 `period` 객체를 가진 프로젝트
 * @example
 * ```ts
 * const meta = getProjectMeta(project) // { role: 'FE', period: '2025.05 - 2025.08' }
 * ```
 */
export const getProjectMeta = (project: { role?: string | null; period?: { startAt?: string | null; endAt?: string | null } | null }): ProjectMeta => ({
  role: project.role ?? '',
  period: formatPeriod(project.period)
})

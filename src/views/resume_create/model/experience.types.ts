import type { ExperiencesQuery } from '@shared/lib/gql/graphql'

/** experiences 쿼리 항목 + 매칭/추천 UI 확장 필드 */
export type Experience = ExperiencesQuery['experiences']['experiences'][0] & {
  recommendedReason?: string
  matchRate?: number
}

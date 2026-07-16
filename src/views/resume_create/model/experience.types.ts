import type { MatchedExperiencesQuery } from '@shared/lib/gql/graphql'

/** JD 매칭 경험 항목. matchRate와 상위 5개 recommendedReason(그 외 null)이 포함된다. */
export type Experience = MatchedExperiencesQuery['experiences']['experiences'][0]

import type { ProfileQuery } from '@shared/lib/gql/graphql'

/** 이력서 기본 정보 프로필 (조회 결과 형태). 온보딩 정보 확인 스텝의 매핑 소스 타입. */
export type Profile = ProfileQuery['profile']

import { execute, graphql } from '@shared/lib'
import { type PolishProfileTextRequest, type UpdateProfileRequest } from '@shared/lib/gql/graphql'

export const profileAPI = {
  getProfile: (variables: { workspaceId: string }) => execute(profileDocument, variables),
  updateProfile: (variables: { workspaceId: string; request: UpdateProfileRequest }) => execute(updateProfileDocument, variables),
  polishProfileText: (variables: { request: PolishProfileTextRequest; workspaceId?: string | null }) => execute(polishProfileTextDocument, variables),
  generateCoreCompetency: (variables: { workspaceId: string; jdId?: string | null }) => execute(generateCoreCompetencyDocument, variables)
}

const profileDocument = graphql(`
  query Profile($workspaceId: ID!) {
    profile(workspaceId: $workspaceId) {
      profileId
      name
      email
      phone
      educations {
        school
        major
        degree
        status
        period {
          startAt
          endAt
        }
      }
      careers {
        company
        position
        period {
          startAt
          endAt
        }
      }
      awards {
        title
        organization
        awardedAt
      }
      languageTests {
        testName
        score
        acquiredAt
      }
      certifications {
        name
        issuer
        acquiredAt
      }
      skills {
        name
        level
      }
    }
  }
`)

const updateProfileDocument = graphql(`
  mutation UpdateProfile($workspaceId: ID!, $request: UpdateProfileRequest!) {
    updateProfile(workspaceId: $workspaceId, request: $request) {
      profileId
    }
  }
`)

/** 프로필 텍스트(핵심역량/경력 세부/경험명/STAR 설명)를 AI로 다듬는다. 결과 문자열만 반환하고 저장하지 않는다. */
const polishProfileTextDocument = graphql(`
  mutation PolishProfileText($request: PolishProfileTextRequest!, $workspaceId: ID) {
    polishProfileText(request: $request, workspaceId: $workspaceId)
  }
`)

/** 프로필 정보(경력/프로젝트/스킬)를 바탕으로 핵심역량을 AI로 생성한다. 결과만 반환하고 저장하지 않는다. jdId를 주면 해당 JD 지원 전략 기준으로 생성하고 strategy도 함께 반환한다. */
const generateCoreCompetencyDocument = graphql(`
  mutation GenerateCoreCompetency($workspaceId: ID!, $jdId: ID) {
    generateCoreCompetency(workspaceId: $workspaceId, jdId: $jdId) {
      coreCompetency
      strategy
    }
  }
`)

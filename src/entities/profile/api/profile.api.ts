import { execute, graphql } from '@shared/lib'
import { type PolishProfileTextRequest, type UpdateProfileRequest } from '@shared/lib/gql/graphql'

export const profileAPI = {
  getProfile: (variables: { workspaceId: string }) => execute(profileDocument, variables),
  updateProfile: (variables: { workspaceId: string; request: UpdateProfileRequest }) => execute(updateProfileDocument, variables),
  polishProfileText: (variables: { request: PolishProfileTextRequest; workspaceId?: string | null }) => execute(polishProfileTextDocument, variables),
  generateCoreCompetency: (variables: { workspaceId: string; resumeId: string; jdId?: string | null }) => execute(generateCoreCompetencyDocument, variables)
}

const profileDocument = graphql(`
  query Profile($workspaceId: ID!) {
    profile(workspaceId: $workspaceId) {
      profileId
      name
      email
      phone
      coreCompetency
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
        description
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

/**
 * 프로필 텍스트(핵심역량/경력 세부/경험)를 AI로 다듬는다. 결과만 반환하고 저장하지 않는다.
 * kind가 EXPERIENCE이면 title에 다듬은 경험명이 채워지고, 나머지 kind에선 title은 null이다.
 */
const polishProfileTextDocument = graphql(`
  mutation PolishProfileText($request: PolishProfileTextRequest!, $workspaceId: ID) {
    polishProfileText(request: $request, workspaceId: $workspaceId) {
      title
      description
    }
  }
`)

/** 프로필 정보(경력/프로젝트/스킬)를 바탕으로 핵심역량을 AI로 생성한다. 결과만 반환하고 이력서(resumeId)에는 생성 성공 여부만 기록한다. jdId를 주면 해당 JD 내용을 반영해 생성하고 strategy도 함께 반환한다. */
const generateCoreCompetencyDocument = graphql(`
  mutation GenerateCoreCompetency($workspaceId: ID!, $resumeId: ID!, $jdId: ID) {
    generateCoreCompetency(workspaceId: $workspaceId, resumeId: $resumeId, jdId: $jdId) {
      coreCompetency
      strategy
    }
  }
`)

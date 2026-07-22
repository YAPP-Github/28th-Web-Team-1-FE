import { execute, graphql } from '@shared/lib'
import { type UpdateProfileRequest } from '@shared/lib/gql/graphql'

export const profileAPI = {
  getProfile: (variables: { workspaceId: string }) => execute(profileDocument, variables),
  updateProfile: (variables: { workspaceId: string; request: UpdateProfileRequest }) => execute(updateProfileDocument, variables)
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

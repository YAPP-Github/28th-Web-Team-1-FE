import { execute, graphql } from '@shared/lib'
import { type CreateResumeInput, type SaveResumeInput } from '@shared/lib/gql/graphql'

export const resumeAPI = {
  createResume: (variables: { workspaceId: string; input: CreateResumeInput }) => execute(createResumeDocument, variables),
  updateResume: (variables: { workspaceId: string; resumeId: string; input: SaveResumeInput }) => execute(updateResumeDocument, variables),
  getResume: (variables: { resumeId: string; workspaceId: string }) => execute(resumeDocument, variables)
}

const createResumeDocument = graphql(`
  mutation CreateResume($workspaceId: ID!, $input: CreateResumeInput!) {
    createResume(workspaceId: $workspaceId, input: $input) {
      resumeId
    }
  }
`)

const updateResumeDocument = graphql(`
  mutation UpdateResume($workspaceId: ID!, $resumeId: ID!, $input: SaveResumeInput!) {
    updateResume(workspaceId: $workspaceId, resumeId: $resumeId, input: $input) {
      resumeId
    }
  }
`)

/** 이력서 미리보기에 필요한 섹션별 payload 필드. 섹션 컴포넌트 props 타입이 이 fragment에서 1:1로 파생된다. */
export const resumeBasicInfoFields = graphql(`
  fragment ResumeBasicInfoFields on ResumeBasicInfoPayload {
    name
    email
    phone
  }
`)

export const resumeCoreSkillFields = graphql(`
  fragment ResumeCoreSkillFields on ResumeCoreSkillPayload {
    content
  }
`)

export const resumeCareerFields = graphql(`
  fragment ResumeCareerFields on ResumeCareerPayload {
    companyName
    role
    contents
    period {
      startAt
      endAt
    }
  }
`)

export const resumeExperienceFields = graphql(`
  fragment ResumeExperienceFields on ResumeExperiencePayload {
    name
    role
    contents
    period {
      startAt
      endAt
    }
  }
`)

export const resumeEducationFields = graphql(`
  fragment ResumeEducationFields on ResumeEducationPayload {
    schoolName
    major
    degree
    status
    period {
      startAt
      endAt
    }
  }
`)

export const resumeAwardFields = graphql(`
  fragment ResumeAwardFields on ResumeAwardPayload {
    name
    organization
    awardedAt
  }
`)

export const resumeLanguageFields = graphql(`
  fragment ResumeLanguageFields on ResumeLanguagePayload {
    examName
    scoreOrGrade
    acquiredAt
  }
`)

export const resumeCertificateFields = graphql(`
  fragment ResumeCertificateFields on ResumeCertificatePayload {
    name
    organization
    acquiredAt
  }
`)

export const resumeSkillFields = graphql(`
  fragment ResumeSkillFields on ResumeSkillPayload {
    name
    level
  }
`)

const resumeDocument = graphql(`
  query Resume($resumeId: ID!, $workspaceId: ID!) {
    resume(resumeId: $resumeId, workspaceId: $workspaceId) {
      resumeId
      status
      template
      targetJd {
        jdId
        companyName
        positionTitle
      }
      sections {
        sectionId
        type
        displayText
        displayOrder
        visible
        items {
          itemId
          displayOrder
          visible
          payload {
            basicInfo {
              ...ResumeBasicInfoFields
            }
            coreSkill {
              ...ResumeCoreSkillFields
            }
            career {
              ...ResumeCareerFields
            }
            experience {
              ...ResumeExperienceFields
            }
            education {
              ...ResumeEducationFields
            }
            award {
              ...ResumeAwardFields
            }
            language {
              ...ResumeLanguageFields
            }
            certificate {
              ...ResumeCertificateFields
            }
            skill {
              ...ResumeSkillFields
            }
          }
        }
      }
    }
  }
`)

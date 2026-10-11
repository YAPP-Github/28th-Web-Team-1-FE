import { execute, graphql } from '@shared/lib'
import type { ExperienceListTab, SendExperienceQuestionRoomMessageRequest } from '@shared/lib/gql/graphql'
import type { CreateExperienceInput, UpdateExperienceInput } from '../model/experience.types'

export const experienceAPI = {
  getExperiences: (variables: { workspaceId: string; size: number; cursor?: string | null }) => execute(experiencesDocument, variables),
  //Todo: getMatchedExperiences api 삭제 예정
  getMatchedExperiences: (variables: { workspaceId: string; jdId: string; size: number; cursor?: string | null }) => execute(matchedExperiencesDocument, variables),
  getProjectExperiences: (variables: {
    workspaceId: string
    projectId: string
    size: number
    cursor?: string | null
    jdId?: string | null
    tab?: ExperienceListTab | null
    questionRoomId?: string | null
  }) => execute(projectExperiencesDocument, variables),
  getExperience: (variables: { workspaceId: string; experienceId: string }) => execute(experienceDocument, variables),
  getSearchExperiences: (variables: { workspaceId: string; keyword: string; size: number; cursor?: string | null }) => execute(searchExperiencesDocument, variables),
  getExperienceQuestionRooms: (variables: { workspaceId: string; jdId: string }) => execute(experienceQuestionRoomsDocument, variables),
  getExperienceQuestionRoom: (variables: { workspaceId: string; questionRoomId: string }) => execute(experienceQuestionRoomDocument, variables),
  sendExperienceQuestionRoomMessage: (variables: { workspaceId: string; questionRoomId: string; request: SendExperienceQuestionRoomMessageRequest }) =>
    execute(sendExperienceQuestionRoomMessageDocument, variables),
  createExperience: (variables: { workspaceId: string; request: CreateExperienceInput }) => execute(createExperienceDocument, variables),
  updateExperience: (variables: { workspaceId: string; experienceId: string; request: UpdateExperienceInput }) => execute(updateExperienceDocument, variables),
  deleteExperience: (variables: { workspaceId: string; experienceId: string }) => execute(deleteExperienceDocument, variables)
}

const experiencesDocument = graphql(`
  query Experiences($workspaceId: ID!, $size: Int!, $cursor: String) {
    experiences(workspaceId: $workspaceId, size: $size, cursor: $cursor) {
      cursor {
        hasNext
        nextCursor
      }
      experiences {
        experienceId
        title
        tags
        project {
          projectId
          name
          role
          period {
            startAt
            endAt
          }
        }
      }
    }
  }
`)

const projectExperiencesDocument = graphql(`
  query ProjectExperiences($workspaceId: ID!, $projectId: ID!, $size: Int!, $cursor: String, $jdId: ID, $tab: ExperienceListTab, $questionRoomId: ID) {
    experiences(workspaceId: $workspaceId, projectId: $projectId, size: $size, cursor: $cursor, jdId: $jdId, tab: $tab, questionRoomId: $questionRoomId) {
      cursor {
        hasNext
        nextCursor
      }
      experiences {
        experienceId
        title
        tags
        matchRate
        recommendedReason
        role
        period {
          startAt
          endAt
        }
        contents {
          type
          star {
            situation
            task
            action
            result
          }
          free {
            content
          }
        }
        project {
          projectId
          name
          role
          period {
            startAt
            endAt
          }
        }
      }
    }
  }
`)

const experienceDocument = graphql(`
  query Experience($workspaceId: ID!, $experienceId: ID!) {
    experience(workspaceId: $workspaceId, experienceId: $experienceId) {
      experienceId
      title
      tags
      role
      period {
        startAt
        endAt
      }
      contents {
        type
        star {
          situation
          task
          action
          result
        }
        free {
          content
        }
      }
    }
  }
`)

const searchExperiencesDocument = graphql(`
  query SearchExperiences($workspaceId: ID!, $keyword: String!, $size: Int!, $cursor: String) {
    searchExperiences(workspaceId: $workspaceId, keyword: $keyword, size: $size, cursor: $cursor) {
      cursor {
        hasNext
        nextCursor
      }
      experiences {
        experienceId
        title
        tags
        project {
          projectId
          name
        }
      }
    }
  }
`)

/** JD 매칭 조회용. jdId 기준 matchRate와 상위 5개 recommendedReason이 함께 내려온다. */
const matchedExperiencesDocument = graphql(`
  query MatchedExperiences($workspaceId: ID!, $jdId: ID!, $size: Int!, $cursor: String) {
    experiences(workspaceId: $workspaceId, jdId: $jdId, size: $size, cursor: $cursor) {
      cursor {
        hasNext
        nextCursor
      }
      experiences {
        experienceId
        title
        tags
        matchRate
        recommendedReason
        role
        period {
          startAt
          endAt
        }
        contents {
          type
          free {
            content
          }
          star {
            situation
            task
            action
            result
          }
        }
        project {
          projectId
          name
        }
      }
    }
  }
`)
/**
 * JD별 경험 질문 카드 목록을 조회한다. (0~5개)
 * JD 담당업무·우대사항을 바탕으로 AI가 질문을 생성하며, 최초 조회는 느릴 수 있다(이후엔 저장된 목록 반환).
 */
const experienceQuestionRoomsDocument = graphql(`
  query ExperienceQuestionRooms($workspaceId: ID!, $jdId: ID!) {
    experienceQuestionRooms(workspaceId: $workspaceId, jdId: $jdId) {
      questionRoomId
      question
      sourceText
      sourceType
    }
  }
`)
/**
 * 경험 질문 대화방의 질문 카드와 전체 메시지를 오래된 순서로 조회한다.
 * 목록 카드(experienceQuestionRooms)의 questionRoomId로 상세 진입 시 사용한다.
 */
const experienceQuestionRoomDocument = graphql(`
  query ExperienceQuestionRoom($workspaceId: ID!, $questionRoomId: ID!) {
    experienceQuestionRoom(workspaceId: $workspaceId, questionRoomId: $questionRoomId) {
      room {
        questionRoomId
        question
        sourceText
        sourceType
      }
      messages {
        messageId
        role
        content
        createdAt
        experienceIds
        block {
          title
          bullets
        }
        feedback {
          fit
          improvement
        }
      }
    }
  }
`)

const sendExperienceQuestionRoomMessageDocument = graphql(`
  mutation SendExperienceQuestionRoomMessage($workspaceId: ID!, $questionRoomId: ID!, $request: SendExperienceQuestionRoomMessageRequest!) {
    sendExperienceQuestionRoomMessage(workspaceId: $workspaceId, questionRoomId: $questionRoomId, request: $request) {
      messageId
      role
      content
      createdAt
      experienceIds
      block {
        title
        bullets
      }
      feedback {
        fit
        improvement
      }
    }
  }
`)

const createExperienceDocument = graphql(`
  mutation CreateExperience($workspaceId: ID!, $request: CreateExperienceRequest!) {
    createExperience(workspaceId: $workspaceId, request: $request) {
      experienceId
    }
  }
`)

const updateExperienceDocument = graphql(`
  mutation UpdateExperience($workspaceId: ID!, $experienceId: ID!, $request: UpdateExperienceRequest!) {
    updateExperience(workspaceId: $workspaceId, experienceId: $experienceId, request: $request) {
      experienceId
    }
  }
`)

const deleteExperienceDocument = graphql(`
  mutation DeleteExperience($workspaceId: ID!, $experienceId: ID!) {
    deleteExperience(workspaceId: $workspaceId, experienceId: $experienceId)
  }
`)

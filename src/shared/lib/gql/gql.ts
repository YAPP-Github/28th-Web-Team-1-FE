/* eslint-disable */
import * as types from './graphql';



/**
 * Map of all GraphQL operations in the project.
 *
 * This map has several performance disadvantages:
 * 1. It is not tree-shakeable, so it will include all operations in the project.
 * 2. It is not minifiable, so the string of a GraphQL query will be multiple times inside the bundle.
 * 3. It does not support dead code elimination, so it will add unused operations.
 *
 * Therefore it is highly recommended to use the babel or swc plugin for production.
 * Learn more about it here: https://the-guild.dev/graphql/codegen/plugins/presets/preset-client#reducing-bundle-size
 */
type Documents = {
    "\n  query Experiences($workspaceId: ID!, $size: Int!, $cursor: String) {\n    experiences(workspaceId: $workspaceId, size: $size, cursor: $cursor) {\n      cursor {\n        hasNext\n        nextCursor\n      }\n      experiences {\n        experienceId\n        title\n        tags\n        project {\n          projectId\n          name\n          role\n          period {\n            startAt\n            endAt\n          }\n        }\n      }\n    }\n  }\n": typeof types.ExperiencesDocument,
    "\n  query ProjectExperiences($workspaceId: ID!, $projectId: ID!, $size: Int!, $cursor: String) {\n    experiences(workspaceId: $workspaceId, projectId: $projectId, size: $size, cursor: $cursor) {\n      cursor {\n        hasNext\n        nextCursor\n      }\n      experiences {\n        experienceId\n        title\n        tags\n        role\n        period {\n          startAt\n          endAt\n        }\n      }\n    }\n  }\n": typeof types.ProjectExperiencesDocument,
    "\n  query Experience($workspaceId: ID!, $experienceId: ID!) {\n    experience(workspaceId: $workspaceId, experienceId: $experienceId) {\n      experienceId\n      title\n      tags\n      role\n      period {\n        startAt\n        endAt\n      }\n      contents {\n        type\n        star {\n          situation\n          task\n          action\n          result\n        }\n        free {\n          content\n        }\n      }\n    }\n  }\n": typeof types.ExperienceDocument,
    "\n  query SearchExperiences($workspaceId: ID!, $keyword: String!, $size: Int!, $cursor: String) {\n    searchExperiences(workspaceId: $workspaceId, keyword: $keyword, size: $size, cursor: $cursor) {\n      cursor {\n        hasNext\n        nextCursor\n      }\n      experiences {\n        experienceId\n        title\n        tags\n        project {\n          projectId\n          name\n        }\n      }\n    }\n  }\n": typeof types.SearchExperiencesDocument,
    "\n  query MatchedExperiences($workspaceId: ID!, $jdId: ID!, $size: Int!, $cursor: String) {\n    experiences(workspaceId: $workspaceId, jdId: $jdId, size: $size, cursor: $cursor) {\n      cursor {\n        hasNext\n        nextCursor\n      }\n      experiences {\n        experienceId\n        title\n        tags\n        matchRate\n        recommendedReason: reason\n        role\n        period {\n          startAt\n          endAt\n        }\n        contents {\n          type\n          free {\n            content\n          }\n          star {\n            situation\n            task\n            action\n            result\n          }\n        }\n        project {\n          projectId\n          name\n        }\n      }\n    }\n  }\n": typeof types.MatchedExperiencesDocument,
    "\n  mutation CreateExperience($workspaceId: ID!, $request: CreateExperienceRequest!) {\n    createExperience(workspaceId: $workspaceId, request: $request) {\n      experienceId\n    }\n  }\n": typeof types.CreateExperienceDocument,
    "\n  mutation UpdateExperience($workspaceId: ID!, $experienceId: ID!, $request: UpdateExperienceRequest!) {\n    updateExperience(workspaceId: $workspaceId, experienceId: $experienceId, request: $request) {\n      experienceId\n    }\n  }\n": typeof types.UpdateExperienceDocument,
    "\n  mutation DeleteExperience($workspaceId: ID!, $experienceId: ID!) {\n    deleteExperience(workspaceId: $workspaceId, experienceId: $experienceId)\n  }\n": typeof types.DeleteExperienceDocument,
    "\n  query JdInsight($workspaceId: ID!, $jdId: ID!) {\n    jdInsight(workspaceId: $workspaceId, jdId: $jdId) {\n      keyPoints\n      strategy\n    }\n  }\n": typeof types.JdInsightDocument,
    "\n  mutation RegisterJd($workspaceId: ID!, $request: JdRegisterRequest!) {\n    registerJd(workspaceId: $workspaceId, request: $request) {\n      jd {\n        jdId\n      }\n      candidates {\n        title\n        body\n      }\n    }\n  }\n": typeof types.RegisterJdDocument,
    "\n  fragment ProjectListItem on ExperienceProject {\n    projectId\n    name\n  }\n": typeof types.ProjectListItemFragmentDoc,
    "\n  query Projects($workspaceId: ID!, $size: Int!, $cursor: String) {\n    projectList: experienceProjects(workspaceId: $workspaceId, size: $size, cursor: $cursor) {\n      cursor {\n        hasNext\n        nextCursor\n      }\n      projects {\n        projectId\n        name\n        period {\n          startAt\n          endAt\n        }\n      }\n    }\n  }\n": typeof types.ProjectsDocument,
    "\n  query Project($workspaceId: ID!, $projectId: ID!) {\n    project: experienceProject(workspaceId: $workspaceId, projectId: $projectId) {\n      projectId\n      name\n      role\n      summary\n      period {\n        startAt\n        endAt\n      }\n    }\n  }\n": typeof types.ProjectDocument,
    "\n  mutation CreateProject($workspaceId: ID!, $input: CreateExperienceProjectRequest!) {\n    createProject: createExperienceProject(workspaceId: $workspaceId, input: $input) {\n      projectId\n      name\n      summary\n      period {\n        startAt\n        endAt\n      }\n    }\n  }\n": typeof types.CreateProjectDocument,
    "\n  query ProjectFilterOptions($workspaceId: ID!, $size: Int!, $cursor: String) {\n    experienceProjects(workspaceId: $workspaceId, size: $size, cursor: $cursor) {\n      cursor {\n        hasNext\n        nextCursor\n      }\n      projects {\n        ...ProjectListItem\n      }\n    }\n  }\n": typeof types.ProjectFilterOptionsDocument,
    "\n  mutation UpdateProject($workspaceId: ID!, $projectId: ID!, $request: UpdateExperienceProjectRequest!) {\n    updateProject: updateExperienceProject(workspaceId: $workspaceId, projectId: $projectId, request: $request) {\n      projectId\n      name\n      role\n      summary\n      period {\n        startAt\n        endAt\n      }\n    }\n  }\n": typeof types.UpdateProjectDocument,
    "\n  mutation DeleteProject($workspaceId: ID!, $projectId: ID!) {\n    deleteExperienceProject(workspaceId: $workspaceId, projectId: $projectId)\n  }\n": typeof types.DeleteProjectDocument,
    "\n  mutation CreateResume($workspaceId: ID!, $input: CreateResumeInput!) {\n    createResume(workspaceId: $workspaceId, input: $input) {\n      resumeId\n    }\n  }\n": typeof types.CreateResumeDocument,
    "\n  fragment ResumeBasicInfoFields on ResumeBasicInfoPayload {\n    name\n    email\n    phone\n  }\n": typeof types.ResumeBasicInfoFieldsFragmentDoc,
    "\n  fragment ResumeCoreSkillFields on ResumeCoreSkillPayload {\n    content\n  }\n": typeof types.ResumeCoreSkillFieldsFragmentDoc,
    "\n  fragment ResumeCareerFields on ResumeCareerPayload {\n    companyName\n    role\n    contents\n    period {\n      startAt\n      endAt\n    }\n  }\n": typeof types.ResumeCareerFieldsFragmentDoc,
    "\n  fragment ResumeExperienceFields on ResumeExperiencePayload {\n    name\n    role\n    contents\n    period {\n      startAt\n      endAt\n    }\n  }\n": typeof types.ResumeExperienceFieldsFragmentDoc,
    "\n  fragment ResumeEducationFields on ResumeEducationPayload {\n    schoolName\n    major\n    degree\n    status\n    period {\n      startAt\n      endAt\n    }\n  }\n": typeof types.ResumeEducationFieldsFragmentDoc,
    "\n  fragment ResumeAwardFields on ResumeAwardPayload {\n    name\n    organization\n    awardedAt\n  }\n": typeof types.ResumeAwardFieldsFragmentDoc,
    "\n  fragment ResumeLanguageFields on ResumeLanguagePayload {\n    examName\n    scoreOrGrade\n    acquiredAt\n  }\n": typeof types.ResumeLanguageFieldsFragmentDoc,
    "\n  fragment ResumeCertificateFields on ResumeCertificatePayload {\n    name\n    organization\n    acquiredAt\n  }\n": typeof types.ResumeCertificateFieldsFragmentDoc,
    "\n  fragment ResumeSkillFields on ResumeSkillPayload {\n    name\n    level\n  }\n": typeof types.ResumeSkillFieldsFragmentDoc,
    "\n  query Resume($resumeId: ID!, $workspaceId: ID!) {\n    resume(resumeId: $resumeId, workspaceId: $workspaceId) {\n      resumeId\n      status\n      targetJd {\n        jdId\n        companyName\n        positionTitle\n      }\n      sections {\n        sectionId\n        type\n        displayText\n        displayOrder\n        visible\n        items {\n          itemId\n          displayOrder\n          visible\n          payload {\n            basicInfo {\n              ...ResumeBasicInfoFields\n            }\n            coreSkill {\n              ...ResumeCoreSkillFields\n            }\n            career {\n              ...ResumeCareerFields\n            }\n            experience {\n              ...ResumeExperienceFields\n            }\n            education {\n              ...ResumeEducationFields\n            }\n            award {\n              ...ResumeAwardFields\n            }\n            language {\n              ...ResumeLanguageFields\n            }\n            certificate {\n              ...ResumeCertificateFields\n            }\n            skill {\n              ...ResumeSkillFields\n            }\n          }\n        }\n      }\n    }\n  }\n": typeof types.ResumeDocument,
    "\n  query Me {\n    me {\n      userId\n      name\n      profileImageUrl\n      email\n      workspaces {\n        workspaceId\n      }\n    }\n  }\n": typeof types.MeDocument,
    "\n  query UserWorkspaces {\n    me {\n      workspaces {\n        workspaceId\n      }\n    }\n  }\n": typeof types.UserWorkspacesDocument,
};
const documents: Documents = {
    "\n  query Experiences($workspaceId: ID!, $size: Int!, $cursor: String) {\n    experiences(workspaceId: $workspaceId, size: $size, cursor: $cursor) {\n      cursor {\n        hasNext\n        nextCursor\n      }\n      experiences {\n        experienceId\n        title\n        tags\n        project {\n          projectId\n          name\n          role\n          period {\n            startAt\n            endAt\n          }\n        }\n      }\n    }\n  }\n": types.ExperiencesDocument,
    "\n  query ProjectExperiences($workspaceId: ID!, $projectId: ID!, $size: Int!, $cursor: String) {\n    experiences(workspaceId: $workspaceId, projectId: $projectId, size: $size, cursor: $cursor) {\n      cursor {\n        hasNext\n        nextCursor\n      }\n      experiences {\n        experienceId\n        title\n        tags\n        role\n        period {\n          startAt\n          endAt\n        }\n      }\n    }\n  }\n": types.ProjectExperiencesDocument,
    "\n  query Experience($workspaceId: ID!, $experienceId: ID!) {\n    experience(workspaceId: $workspaceId, experienceId: $experienceId) {\n      experienceId\n      title\n      tags\n      role\n      period {\n        startAt\n        endAt\n      }\n      contents {\n        type\n        star {\n          situation\n          task\n          action\n          result\n        }\n        free {\n          content\n        }\n      }\n    }\n  }\n": types.ExperienceDocument,
    "\n  query SearchExperiences($workspaceId: ID!, $keyword: String!, $size: Int!, $cursor: String) {\n    searchExperiences(workspaceId: $workspaceId, keyword: $keyword, size: $size, cursor: $cursor) {\n      cursor {\n        hasNext\n        nextCursor\n      }\n      experiences {\n        experienceId\n        title\n        tags\n        project {\n          projectId\n          name\n        }\n      }\n    }\n  }\n": types.SearchExperiencesDocument,
    "\n  query MatchedExperiences($workspaceId: ID!, $jdId: ID!, $size: Int!, $cursor: String) {\n    experiences(workspaceId: $workspaceId, jdId: $jdId, size: $size, cursor: $cursor) {\n      cursor {\n        hasNext\n        nextCursor\n      }\n      experiences {\n        experienceId\n        title\n        tags\n        matchRate\n        recommendedReason: reason\n        role\n        period {\n          startAt\n          endAt\n        }\n        contents {\n          type\n          free {\n            content\n          }\n          star {\n            situation\n            task\n            action\n            result\n          }\n        }\n        project {\n          projectId\n          name\n        }\n      }\n    }\n  }\n": types.MatchedExperiencesDocument,
    "\n  mutation CreateExperience($workspaceId: ID!, $request: CreateExperienceRequest!) {\n    createExperience(workspaceId: $workspaceId, request: $request) {\n      experienceId\n    }\n  }\n": types.CreateExperienceDocument,
    "\n  mutation UpdateExperience($workspaceId: ID!, $experienceId: ID!, $request: UpdateExperienceRequest!) {\n    updateExperience(workspaceId: $workspaceId, experienceId: $experienceId, request: $request) {\n      experienceId\n    }\n  }\n": types.UpdateExperienceDocument,
    "\n  mutation DeleteExperience($workspaceId: ID!, $experienceId: ID!) {\n    deleteExperience(workspaceId: $workspaceId, experienceId: $experienceId)\n  }\n": types.DeleteExperienceDocument,
    "\n  query JdInsight($workspaceId: ID!, $jdId: ID!) {\n    jdInsight(workspaceId: $workspaceId, jdId: $jdId) {\n      keyPoints\n      strategy\n    }\n  }\n": types.JdInsightDocument,
    "\n  mutation RegisterJd($workspaceId: ID!, $request: JdRegisterRequest!) {\n    registerJd(workspaceId: $workspaceId, request: $request) {\n      jd {\n        jdId\n      }\n      candidates {\n        title\n        body\n      }\n    }\n  }\n": types.RegisterJdDocument,
    "\n  fragment ProjectListItem on ExperienceProject {\n    projectId\n    name\n  }\n": types.ProjectListItemFragmentDoc,
    "\n  query Projects($workspaceId: ID!, $size: Int!, $cursor: String) {\n    projectList: experienceProjects(workspaceId: $workspaceId, size: $size, cursor: $cursor) {\n      cursor {\n        hasNext\n        nextCursor\n      }\n      projects {\n        projectId\n        name\n        period {\n          startAt\n          endAt\n        }\n      }\n    }\n  }\n": types.ProjectsDocument,
    "\n  query Project($workspaceId: ID!, $projectId: ID!) {\n    project: experienceProject(workspaceId: $workspaceId, projectId: $projectId) {\n      projectId\n      name\n      role\n      summary\n      period {\n        startAt\n        endAt\n      }\n    }\n  }\n": types.ProjectDocument,
    "\n  mutation CreateProject($workspaceId: ID!, $input: CreateExperienceProjectRequest!) {\n    createProject: createExperienceProject(workspaceId: $workspaceId, input: $input) {\n      projectId\n      name\n      summary\n      period {\n        startAt\n        endAt\n      }\n    }\n  }\n": types.CreateProjectDocument,
    "\n  query ProjectFilterOptions($workspaceId: ID!, $size: Int!, $cursor: String) {\n    experienceProjects(workspaceId: $workspaceId, size: $size, cursor: $cursor) {\n      cursor {\n        hasNext\n        nextCursor\n      }\n      projects {\n        ...ProjectListItem\n      }\n    }\n  }\n": types.ProjectFilterOptionsDocument,
    "\n  mutation UpdateProject($workspaceId: ID!, $projectId: ID!, $request: UpdateExperienceProjectRequest!) {\n    updateProject: updateExperienceProject(workspaceId: $workspaceId, projectId: $projectId, request: $request) {\n      projectId\n      name\n      role\n      summary\n      period {\n        startAt\n        endAt\n      }\n    }\n  }\n": types.UpdateProjectDocument,
    "\n  mutation DeleteProject($workspaceId: ID!, $projectId: ID!) {\n    deleteExperienceProject(workspaceId: $workspaceId, projectId: $projectId)\n  }\n": types.DeleteProjectDocument,
    "\n  mutation CreateResume($workspaceId: ID!, $input: CreateResumeInput!) {\n    createResume(workspaceId: $workspaceId, input: $input) {\n      resumeId\n    }\n  }\n": types.CreateResumeDocument,
    "\n  fragment ResumeBasicInfoFields on ResumeBasicInfoPayload {\n    name\n    email\n    phone\n  }\n": types.ResumeBasicInfoFieldsFragmentDoc,
    "\n  fragment ResumeCoreSkillFields on ResumeCoreSkillPayload {\n    content\n  }\n": types.ResumeCoreSkillFieldsFragmentDoc,
    "\n  fragment ResumeCareerFields on ResumeCareerPayload {\n    companyName\n    role\n    contents\n    period {\n      startAt\n      endAt\n    }\n  }\n": types.ResumeCareerFieldsFragmentDoc,
    "\n  fragment ResumeExperienceFields on ResumeExperiencePayload {\n    name\n    role\n    contents\n    period {\n      startAt\n      endAt\n    }\n  }\n": types.ResumeExperienceFieldsFragmentDoc,
    "\n  fragment ResumeEducationFields on ResumeEducationPayload {\n    schoolName\n    major\n    degree\n    status\n    period {\n      startAt\n      endAt\n    }\n  }\n": types.ResumeEducationFieldsFragmentDoc,
    "\n  fragment ResumeAwardFields on ResumeAwardPayload {\n    name\n    organization\n    awardedAt\n  }\n": types.ResumeAwardFieldsFragmentDoc,
    "\n  fragment ResumeLanguageFields on ResumeLanguagePayload {\n    examName\n    scoreOrGrade\n    acquiredAt\n  }\n": types.ResumeLanguageFieldsFragmentDoc,
    "\n  fragment ResumeCertificateFields on ResumeCertificatePayload {\n    name\n    organization\n    acquiredAt\n  }\n": types.ResumeCertificateFieldsFragmentDoc,
    "\n  fragment ResumeSkillFields on ResumeSkillPayload {\n    name\n    level\n  }\n": types.ResumeSkillFieldsFragmentDoc,
    "\n  query Resume($resumeId: ID!, $workspaceId: ID!) {\n    resume(resumeId: $resumeId, workspaceId: $workspaceId) {\n      resumeId\n      status\n      targetJd {\n        jdId\n        companyName\n        positionTitle\n      }\n      sections {\n        sectionId\n        type\n        displayText\n        displayOrder\n        visible\n        items {\n          itemId\n          displayOrder\n          visible\n          payload {\n            basicInfo {\n              ...ResumeBasicInfoFields\n            }\n            coreSkill {\n              ...ResumeCoreSkillFields\n            }\n            career {\n              ...ResumeCareerFields\n            }\n            experience {\n              ...ResumeExperienceFields\n            }\n            education {\n              ...ResumeEducationFields\n            }\n            award {\n              ...ResumeAwardFields\n            }\n            language {\n              ...ResumeLanguageFields\n            }\n            certificate {\n              ...ResumeCertificateFields\n            }\n            skill {\n              ...ResumeSkillFields\n            }\n          }\n        }\n      }\n    }\n  }\n": types.ResumeDocument,
    "\n  query Me {\n    me {\n      userId\n      name\n      profileImageUrl\n      email\n      workspaces {\n        workspaceId\n      }\n    }\n  }\n": types.MeDocument,
    "\n  query UserWorkspaces {\n    me {\n      workspaces {\n        workspaceId\n      }\n    }\n  }\n": types.UserWorkspacesDocument,
};

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query Experiences($workspaceId: ID!, $size: Int!, $cursor: String) {\n    experiences(workspaceId: $workspaceId, size: $size, cursor: $cursor) {\n      cursor {\n        hasNext\n        nextCursor\n      }\n      experiences {\n        experienceId\n        title\n        tags\n        project {\n          projectId\n          name\n          role\n          period {\n            startAt\n            endAt\n          }\n        }\n      }\n    }\n  }\n"): typeof import('./graphql').ExperiencesDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query ProjectExperiences($workspaceId: ID!, $projectId: ID!, $size: Int!, $cursor: String) {\n    experiences(workspaceId: $workspaceId, projectId: $projectId, size: $size, cursor: $cursor) {\n      cursor {\n        hasNext\n        nextCursor\n      }\n      experiences {\n        experienceId\n        title\n        tags\n        role\n        period {\n          startAt\n          endAt\n        }\n      }\n    }\n  }\n"): typeof import('./graphql').ProjectExperiencesDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query Experience($workspaceId: ID!, $experienceId: ID!) {\n    experience(workspaceId: $workspaceId, experienceId: $experienceId) {\n      experienceId\n      title\n      tags\n      role\n      period {\n        startAt\n        endAt\n      }\n      contents {\n        type\n        star {\n          situation\n          task\n          action\n          result\n        }\n        free {\n          content\n        }\n      }\n    }\n  }\n"): typeof import('./graphql').ExperienceDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query SearchExperiences($workspaceId: ID!, $keyword: String!, $size: Int!, $cursor: String) {\n    searchExperiences(workspaceId: $workspaceId, keyword: $keyword, size: $size, cursor: $cursor) {\n      cursor {\n        hasNext\n        nextCursor\n      }\n      experiences {\n        experienceId\n        title\n        tags\n        project {\n          projectId\n          name\n        }\n      }\n    }\n  }\n"): typeof import('./graphql').SearchExperiencesDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query MatchedExperiences($workspaceId: ID!, $jdId: ID!, $size: Int!, $cursor: String) {\n    experiences(workspaceId: $workspaceId, jdId: $jdId, size: $size, cursor: $cursor) {\n      cursor {\n        hasNext\n        nextCursor\n      }\n      experiences {\n        experienceId\n        title\n        tags\n        matchRate\n        recommendedReason: reason\n        role\n        period {\n          startAt\n          endAt\n        }\n        contents {\n          type\n          free {\n            content\n          }\n          star {\n            situation\n            task\n            action\n            result\n          }\n        }\n        project {\n          projectId\n          name\n        }\n      }\n    }\n  }\n"): typeof import('./graphql').MatchedExperiencesDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation CreateExperience($workspaceId: ID!, $request: CreateExperienceRequest!) {\n    createExperience(workspaceId: $workspaceId, request: $request) {\n      experienceId\n    }\n  }\n"): typeof import('./graphql').CreateExperienceDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation UpdateExperience($workspaceId: ID!, $experienceId: ID!, $request: UpdateExperienceRequest!) {\n    updateExperience(workspaceId: $workspaceId, experienceId: $experienceId, request: $request) {\n      experienceId\n    }\n  }\n"): typeof import('./graphql').UpdateExperienceDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation DeleteExperience($workspaceId: ID!, $experienceId: ID!) {\n    deleteExperience(workspaceId: $workspaceId, experienceId: $experienceId)\n  }\n"): typeof import('./graphql').DeleteExperienceDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query JdInsight($workspaceId: ID!, $jdId: ID!) {\n    jdInsight(workspaceId: $workspaceId, jdId: $jdId) {\n      keyPoints\n      strategy\n    }\n  }\n"): typeof import('./graphql').JdInsightDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation RegisterJd($workspaceId: ID!, $request: JdRegisterRequest!) {\n    registerJd(workspaceId: $workspaceId, request: $request) {\n      jd {\n        jdId\n      }\n      candidates {\n        title\n        body\n      }\n    }\n  }\n"): typeof import('./graphql').RegisterJdDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  fragment ProjectListItem on ExperienceProject {\n    projectId\n    name\n  }\n"): typeof import('./graphql').ProjectListItemFragmentDoc;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query Projects($workspaceId: ID!, $size: Int!, $cursor: String) {\n    projectList: experienceProjects(workspaceId: $workspaceId, size: $size, cursor: $cursor) {\n      cursor {\n        hasNext\n        nextCursor\n      }\n      projects {\n        projectId\n        name\n        period {\n          startAt\n          endAt\n        }\n      }\n    }\n  }\n"): typeof import('./graphql').ProjectsDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query Project($workspaceId: ID!, $projectId: ID!) {\n    project: experienceProject(workspaceId: $workspaceId, projectId: $projectId) {\n      projectId\n      name\n      role\n      summary\n      period {\n        startAt\n        endAt\n      }\n    }\n  }\n"): typeof import('./graphql').ProjectDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation CreateProject($workspaceId: ID!, $input: CreateExperienceProjectRequest!) {\n    createProject: createExperienceProject(workspaceId: $workspaceId, input: $input) {\n      projectId\n      name\n      summary\n      period {\n        startAt\n        endAt\n      }\n    }\n  }\n"): typeof import('./graphql').CreateProjectDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query ProjectFilterOptions($workspaceId: ID!, $size: Int!, $cursor: String) {\n    experienceProjects(workspaceId: $workspaceId, size: $size, cursor: $cursor) {\n      cursor {\n        hasNext\n        nextCursor\n      }\n      projects {\n        ...ProjectListItem\n      }\n    }\n  }\n"): typeof import('./graphql').ProjectFilterOptionsDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation UpdateProject($workspaceId: ID!, $projectId: ID!, $request: UpdateExperienceProjectRequest!) {\n    updateProject: updateExperienceProject(workspaceId: $workspaceId, projectId: $projectId, request: $request) {\n      projectId\n      name\n      role\n      summary\n      period {\n        startAt\n        endAt\n      }\n    }\n  }\n"): typeof import('./graphql').UpdateProjectDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation DeleteProject($workspaceId: ID!, $projectId: ID!) {\n    deleteExperienceProject(workspaceId: $workspaceId, projectId: $projectId)\n  }\n"): typeof import('./graphql').DeleteProjectDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation CreateResume($workspaceId: ID!, $input: CreateResumeInput!) {\n    createResume(workspaceId: $workspaceId, input: $input) {\n      resumeId\n    }\n  }\n"): typeof import('./graphql').CreateResumeDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  fragment ResumeBasicInfoFields on ResumeBasicInfoPayload {\n    name\n    email\n    phone\n  }\n"): typeof import('./graphql').ResumeBasicInfoFieldsFragmentDoc;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  fragment ResumeCoreSkillFields on ResumeCoreSkillPayload {\n    content\n  }\n"): typeof import('./graphql').ResumeCoreSkillFieldsFragmentDoc;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  fragment ResumeCareerFields on ResumeCareerPayload {\n    companyName\n    role\n    contents\n    period {\n      startAt\n      endAt\n    }\n  }\n"): typeof import('./graphql').ResumeCareerFieldsFragmentDoc;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  fragment ResumeExperienceFields on ResumeExperiencePayload {\n    name\n    role\n    contents\n    period {\n      startAt\n      endAt\n    }\n  }\n"): typeof import('./graphql').ResumeExperienceFieldsFragmentDoc;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  fragment ResumeEducationFields on ResumeEducationPayload {\n    schoolName\n    major\n    degree\n    status\n    period {\n      startAt\n      endAt\n    }\n  }\n"): typeof import('./graphql').ResumeEducationFieldsFragmentDoc;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  fragment ResumeAwardFields on ResumeAwardPayload {\n    name\n    organization\n    awardedAt\n  }\n"): typeof import('./graphql').ResumeAwardFieldsFragmentDoc;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  fragment ResumeLanguageFields on ResumeLanguagePayload {\n    examName\n    scoreOrGrade\n    acquiredAt\n  }\n"): typeof import('./graphql').ResumeLanguageFieldsFragmentDoc;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  fragment ResumeCertificateFields on ResumeCertificatePayload {\n    name\n    organization\n    acquiredAt\n  }\n"): typeof import('./graphql').ResumeCertificateFieldsFragmentDoc;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  fragment ResumeSkillFields on ResumeSkillPayload {\n    name\n    level\n  }\n"): typeof import('./graphql').ResumeSkillFieldsFragmentDoc;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query Resume($resumeId: ID!, $workspaceId: ID!) {\n    resume(resumeId: $resumeId, workspaceId: $workspaceId) {\n      resumeId\n      status\n      targetJd {\n        jdId\n        companyName\n        positionTitle\n      }\n      sections {\n        sectionId\n        type\n        displayText\n        displayOrder\n        visible\n        items {\n          itemId\n          displayOrder\n          visible\n          payload {\n            basicInfo {\n              ...ResumeBasicInfoFields\n            }\n            coreSkill {\n              ...ResumeCoreSkillFields\n            }\n            career {\n              ...ResumeCareerFields\n            }\n            experience {\n              ...ResumeExperienceFields\n            }\n            education {\n              ...ResumeEducationFields\n            }\n            award {\n              ...ResumeAwardFields\n            }\n            language {\n              ...ResumeLanguageFields\n            }\n            certificate {\n              ...ResumeCertificateFields\n            }\n            skill {\n              ...ResumeSkillFields\n            }\n          }\n        }\n      }\n    }\n  }\n"): typeof import('./graphql').ResumeDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query Me {\n    me {\n      userId\n      name\n      profileImageUrl\n      email\n      workspaces {\n        workspaceId\n      }\n    }\n  }\n"): typeof import('./graphql').MeDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query UserWorkspaces {\n    me {\n      workspaces {\n        workspaceId\n      }\n    }\n  }\n"): typeof import('./graphql').UserWorkspacesDocument;


export function graphql(source: string) {
  return (documents as any)[source] ?? {};
}

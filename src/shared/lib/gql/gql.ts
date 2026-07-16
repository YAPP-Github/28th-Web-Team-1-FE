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
    "\n  query SearchExperiences($workspaceId: ID!, $keyword: String!, $size: Int!, $cursor: String) {\n    searchExperiences(workspaceId: $workspaceId, keyword: $keyword, size: $size, cursor: $cursor) {\n      cursor {\n        hasNext\n        nextCursor\n      }\n      experiences {\n        experienceId\n        title\n        tags\n        project {\n          projectId\n          name\n        }\n      }\n    }\n  }\n": typeof types.SearchExperiencesDocument,
    "\n  query JdInsight($workspaceId: ID!, $jdId: ID!) {\n    jdInsight(workspaceId: $workspaceId, jdId: $jdId) {\n      keyPoints\n      strategy\n    }\n  }\n": typeof types.JdInsightDocument,
    "\n  mutation RegisterJd($workspaceId: ID!, $request: JdRegisterRequest!) {\n    registerJd(workspaceId: $workspaceId, request: $request) {\n      jd {\n        jdId\n      }\n      candidates {\n        title\n        body\n      }\n    }\n  }\n": typeof types.RegisterJdDocument,
    "\n  fragment ProjectListItem on ExperienceProject {\n    projectId\n    name\n  }\n": typeof types.ProjectListItemFragmentDoc,
    "\n  query Projects($workspaceId: ID!, $size: Int!, $cursor: String) {\n    projectList: experienceProjects(workspaceId: $workspaceId, size: $size, cursor: $cursor) {\n      cursor {\n        hasNext\n        nextCursor\n      }\n      projects {\n        projectId\n        name\n        period {\n          startAt\n          endAt\n        }\n      }\n    }\n  }\n": typeof types.ProjectsDocument,
    "\n  mutation CreateProject($workspaceId: ID!, $input: CreateExperienceProjectRequest!) {\n    createProject: createExperienceProject(workspaceId: $workspaceId, input: $input) {\n      projectId\n      name\n      summary\n      period {\n        startAt\n        endAt\n      }\n    }\n  }\n": typeof types.CreateProjectDocument,
    "\n  query ProjectFilterOptions($workspaceId: ID!, $size: Int!, $cursor: String) {\n    experienceProjects(workspaceId: $workspaceId, size: $size, cursor: $cursor) {\n      cursor {\n        hasNext\n        nextCursor\n      }\n      projects {\n        ...ProjectListItem\n      }\n    }\n  }\n": typeof types.ProjectFilterOptionsDocument,
    "\n  query Me {\n    me {\n      userId\n      name\n      profileImageUrl\n      email\n      workspaces {\n        workspaceId\n      }\n    }\n  }\n": typeof types.MeDocument,
    "\n  query UserWorkspaces {\n    me {\n      workspaces {\n        workspaceId\n      }\n    }\n  }\n": typeof types.UserWorkspacesDocument,
};
const documents: Documents = {
    "\n  query Experiences($workspaceId: ID!, $size: Int!, $cursor: String) {\n    experiences(workspaceId: $workspaceId, size: $size, cursor: $cursor) {\n      cursor {\n        hasNext\n        nextCursor\n      }\n      experiences {\n        experienceId\n        title\n        tags\n        project {\n          projectId\n          name\n          role\n          period {\n            startAt\n            endAt\n          }\n        }\n      }\n    }\n  }\n": types.ExperiencesDocument,
    "\n  query SearchExperiences($workspaceId: ID!, $keyword: String!, $size: Int!, $cursor: String) {\n    searchExperiences(workspaceId: $workspaceId, keyword: $keyword, size: $size, cursor: $cursor) {\n      cursor {\n        hasNext\n        nextCursor\n      }\n      experiences {\n        experienceId\n        title\n        tags\n        project {\n          projectId\n          name\n        }\n      }\n    }\n  }\n": types.SearchExperiencesDocument,
    "\n  query JdInsight($workspaceId: ID!, $jdId: ID!) {\n    jdInsight(workspaceId: $workspaceId, jdId: $jdId) {\n      keyPoints\n      strategy\n    }\n  }\n": types.JdInsightDocument,
    "\n  mutation RegisterJd($workspaceId: ID!, $request: JdRegisterRequest!) {\n    registerJd(workspaceId: $workspaceId, request: $request) {\n      jd {\n        jdId\n      }\n      candidates {\n        title\n        body\n      }\n    }\n  }\n": types.RegisterJdDocument,
    "\n  fragment ProjectListItem on ExperienceProject {\n    projectId\n    name\n  }\n": types.ProjectListItemFragmentDoc,
    "\n  query Projects($workspaceId: ID!, $size: Int!, $cursor: String) {\n    projectList: experienceProjects(workspaceId: $workspaceId, size: $size, cursor: $cursor) {\n      cursor {\n        hasNext\n        nextCursor\n      }\n      projects {\n        projectId\n        name\n        period {\n          startAt\n          endAt\n        }\n      }\n    }\n  }\n": types.ProjectsDocument,
    "\n  mutation CreateProject($workspaceId: ID!, $input: CreateExperienceProjectRequest!) {\n    createProject: createExperienceProject(workspaceId: $workspaceId, input: $input) {\n      projectId\n      name\n      summary\n      period {\n        startAt\n        endAt\n      }\n    }\n  }\n": types.CreateProjectDocument,
    "\n  query ProjectFilterOptions($workspaceId: ID!, $size: Int!, $cursor: String) {\n    experienceProjects(workspaceId: $workspaceId, size: $size, cursor: $cursor) {\n      cursor {\n        hasNext\n        nextCursor\n      }\n      projects {\n        ...ProjectListItem\n      }\n    }\n  }\n": types.ProjectFilterOptionsDocument,
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
export function graphql(source: "\n  query SearchExperiences($workspaceId: ID!, $keyword: String!, $size: Int!, $cursor: String) {\n    searchExperiences(workspaceId: $workspaceId, keyword: $keyword, size: $size, cursor: $cursor) {\n      cursor {\n        hasNext\n        nextCursor\n      }\n      experiences {\n        experienceId\n        title\n        tags\n        project {\n          projectId\n          name\n        }\n      }\n    }\n  }\n"): typeof import('./graphql').SearchExperiencesDocument;
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
export function graphql(source: "\n  mutation CreateProject($workspaceId: ID!, $input: CreateExperienceProjectRequest!) {\n    createProject: createExperienceProject(workspaceId: $workspaceId, input: $input) {\n      projectId\n      name\n      summary\n      period {\n        startAt\n        endAt\n      }\n    }\n  }\n"): typeof import('./graphql').CreateProjectDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query ProjectFilterOptions($workspaceId: ID!, $size: Int!, $cursor: String) {\n    experienceProjects(workspaceId: $workspaceId, size: $size, cursor: $cursor) {\n      cursor {\n        hasNext\n        nextCursor\n      }\n      projects {\n        ...ProjectListItem\n      }\n    }\n  }\n"): typeof import('./graphql').ProjectFilterOptionsDocument;
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

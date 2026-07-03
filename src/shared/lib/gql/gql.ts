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
    "\n  query Experiences($workspaceId: ID!, $size: Int!, $cursor: String) {\n    experiences(workspaceId: $workspaceId, size: $size, cursor: $cursor) {\n      cursor {\n        hasNext\n        nextCursor\n      }\n      experiences {\n        experienceId\n        title\n        tags\n        project {\n          projectId\n          name\n        }\n      }\n    }\n  }\n": typeof types.ExperiencesDocument,
    "\n  query Me {\n    me {\n      userId\n      name\n      profileImageUrl\n      workspaces {\n        workspaceId\n      }\n    }\n  }\n": typeof types.MeDocument,
};
const documents: Documents = {
    "\n  query Experiences($workspaceId: ID!, $size: Int!, $cursor: String) {\n    experiences(workspaceId: $workspaceId, size: $size, cursor: $cursor) {\n      cursor {\n        hasNext\n        nextCursor\n      }\n      experiences {\n        experienceId\n        title\n        tags\n        project {\n          projectId\n          name\n        }\n      }\n    }\n  }\n": types.ExperiencesDocument,
    "\n  query Me {\n    me {\n      userId\n      name\n      profileImageUrl\n      workspaces {\n        workspaceId\n      }\n    }\n  }\n": types.MeDocument,
};

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query Experiences($workspaceId: ID!, $size: Int!, $cursor: String) {\n    experiences(workspaceId: $workspaceId, size: $size, cursor: $cursor) {\n      cursor {\n        hasNext\n        nextCursor\n      }\n      experiences {\n        experienceId\n        title\n        tags\n        project {\n          projectId\n          name\n        }\n      }\n    }\n  }\n"): typeof import('./graphql').ExperiencesDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query Me {\n    me {\n      userId\n      name\n      profileImageUrl\n      workspaces {\n        workspaceId\n      }\n    }\n  }\n"): typeof import('./graphql').MeDocument;


export function graphql(source: string) {
  return (documents as any)[source] ?? {};
}

/** Internal type. DO NOT USE DIRECTLY. */
type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] }
/** Internal type. DO NOT USE DIRECTLY. */
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never }
import { DocumentTypeDecoration } from '@graphql-typed-document-node/core'
export type MeQueryVariables = Exact<{ [key: string]: never }>

export type MeQuery = { me: { userId: string; name: string; profileImageUrl: string | null } }

export class TypedDocumentString<TResult, TVariables> extends String implements DocumentTypeDecoration<TResult, TVariables> {
  __apiType?: NonNullable<DocumentTypeDecoration<TResult, TVariables>['__apiType']>
  private value: string
  public __meta__?: Record<string, any> | undefined

  constructor(value: string, __meta__?: Record<string, any> | undefined) {
    super(value)
    this.value = value
    this.__meta__ = __meta__
  }

  override toString(): string & DocumentTypeDecoration<TResult, TVariables> {
    return this.value
  }
}

export const MeDocument = new TypedDocumentString(`
    query Me {
  me {
    userId
    name
    profileImageUrl
  }
}
    `) as unknown as TypedDocumentString<MeQuery, MeQueryVariables>

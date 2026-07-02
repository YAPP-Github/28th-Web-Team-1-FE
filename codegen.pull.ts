import 'dotenv/config'
import type { CodegenConfig } from '@graphql-codegen/cli'

/**
 * 백엔드 GraphQL 엔드포인트를 introspection해서 레포 루트 `schema.graphql`(SDL)로 덤프한다.
 * **네트워크를 타는 유일한 단계**로, 백엔드 스키마가 바뀔 때만 실행한다.
 * 실행: `npm run schema:pull`
 * 이후 타입 생성(`codegen.ts`)은 이 로컬 파일만 읽으므로 오프라인·즉시 동작한다.
 */
const config: CodegenConfig = {
  schema: `${process.env.API_URL}/api/graphql`,
  generates: {
    'schema.graphql': {
      plugins: ['schema-ast']
    }
  }
}

export default config

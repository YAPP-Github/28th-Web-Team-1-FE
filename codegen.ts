import 'dotenv/config'
import type { CodegenConfig } from '@graphql-codegen/cli'

/**
 * GraphQL Code Generator 설정.
 * 백엔드 GraphQL 엔드포인트를 introspection해서 스키마를 가져오고,
 * `src` 안에서 `graphql(...)`로 작성한 오퍼레이션을 스캔해 타입을 생성한다.
 * 실행: `npm run codegen` (감시 모드: `npm run codegen:watch`)
 */
const config: CodegenConfig = {
  schema: `${process.env.API_URL}/api/graphql`,
  documents: ['src/**/*.{ts,tsx}'],
  ignoreNoDocuments: true,
  generates: {
    'src/shared/api/gql/': {
      preset: 'client',
      config: {
        documentMode: 'string'
      }
    }
  }
}

export default config

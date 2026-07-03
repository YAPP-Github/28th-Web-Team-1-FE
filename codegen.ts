import 'dotenv/config'
import type { CodegenConfig } from '@graphql-codegen/cli'

/**
 * GraphQL Code Generator 설정 (타입 생성).
 * **로컬 `schema.graphql`**(= `npm run schema:pull`로 덤프한 SDL)을 읽고,
 * `src` 안에서 `graphql(...)`로 작성한 오퍼레이션을 스캔해 타입을 생성한다.
 * 백엔드로 요청하지 않고 오프라인·즉시 동작한다(백엔드 스키마 갱신은 `codegen.pull.ts`가 담당).
 * 실행: `npm run codegen` (감시 모드: `npm run codegen:watch`)
 */
const config: CodegenConfig = {
  schema: 'schema.graphql',
  documents: ['src/**/*.{ts,tsx}'],
  ignoreNoDocuments: true,
  generates: {
    'src/shared/lib/gql/': {
      preset: 'client',
      config: {
        documentMode: 'string'
      },
      presetConfig: {
        fragmentMasking: false // fragment-masking.ts 생성 안 함
      }
    }
  }
}

export default config

// For more info, see https://github.com/storybookjs/eslint-plugin-storybook#configuration-flat-config-format
import storybook from "eslint-plugin-storybook";

import js from '@eslint/js'
import tseslint from 'typescript-eslint'
import reactPlugin from 'eslint-plugin-react'
import reactHooksPlugin from 'eslint-plugin-react-hooks'
import prettierPlugin from 'eslint-plugin-prettier'
import prettierConfig from 'eslint-config-prettier'
import importPlugin from 'eslint-plugin-import'
import globals from 'globals'
import { fixupPluginRules } from '@eslint/compat'

export default tseslint.config({
  ignores: ['node_modules', 'dist', 'build', '.next', 'out', 'public/mockServiceWorker.js', 'src/shared/lib/gql/**']
}, js.configs.recommended, ...tseslint.configs.recommended, {
  files: ['**/*.{js,jsx,ts,tsx}'],
  languageOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    parserOptions: {
      ecmaFeatures: { jsx: true },
      project: true,
      tsconfigRootDir: import.meta.dirname
    },
    globals: {
      ...globals.browser,
      ...globals.node,
      ...globals.es2015
    }
  },
  plugins: {
    react: fixupPluginRules(reactPlugin),
    'react-hooks': fixupPluginRules(reactHooksPlugin),
    import: fixupPluginRules(importPlugin),
    prettier: prettierPlugin
  },
  settings: {
    react: { version: 'detect' },
    'import/resolver': {
      typescript: {
        project: './tsconfig.json'
      }
    }
  },
  rules: {
    ...reactPlugin.configs.recommended.rules,
    ...reactHooksPlugin.configs.recommended.rules,

    // ────────────────────────────────────────────────
    // Prettier
    // ────────────────────────────────────────────────
    'prettier/prettier': 'error',

    // ────────────────────────────────────────────────
    // 명명 규칙 (Naming Convention)
    // - 변수·함수: camelCase
    // - 컴포넌트·class: PascalCase
    // - 상수·enum: UPPER_CASE (snake_case)
    // - boolean 변수: is/has/should/need prefix
    // - 이벤트 핸들러: handle prefix
    // ────────────────────────────────────────────────

    '@typescript-eslint/naming-convention': [
      'error',
      // 일반 변수: camelCase | UPPER_CASE만 허용
      {
        selector: 'variable',
        format: ['camelCase', 'UPPER_CASE'],
        leadingUnderscore: 'allow'
      },
      // React 컴포넌트 변수: PascalCase 허용
      // (const MyComponent = () => <div /> 형태 대응)
      {
        selector: 'variable',
        types: ['function'],
        format: ['camelCase', 'PascalCase'],
        leadingUnderscore: 'allow'
      },
      // boolean 변수: is / has / should / need prefix 강제
      {
        selector: 'variable',
        types: ['boolean'],
        format: ['PascalCase'],
        prefix: ['is', 'has', 'should', 'need', 'disabled', 'opened', 'show']
      },
      // 함수: camelCase | PascalCase
      {
        selector: 'function',
        format: ['camelCase', 'PascalCase']
      },
      // 인터페이스: PascalCase
      {
        selector: 'interface',
        format: ['PascalCase']
      },
      // 타입 별칭: PascalCase
      {
        selector: 'typeAlias',
        format: ['PascalCase']
      },
      // enum: UPPER_CASE
      {
        selector: 'enum',
        format: ['UPPER_CASE']
      },
      // enum 멤버: UPPER_CASE
      {
        selector: 'enumMember',
        format: ['UPPER_CASE']
      }
    ],

    // ────────────────────────────────────────────────
    // 이벤트 핸들러 handle prefix 강제
    // - JSX prop에 전달되는 함수: handle prefix 강제
    // - 로컬 변수로 선언된 핸들러도 함께 체크
    // ────────────────────────────────────────────────
    'react/jsx-handler-names': [
      'error',
      {
        eventHandlerPrefix: 'handle', // 함수 이름은 handle로 시작
        eventHandlerPropPrefix: 'on', // prop 이름은 on으로 시작
        checkLocalVariables: true, // 로컬 변수에 할당된 핸들러도 체크
        checkInlineFunction: false // 인라인 함수 (() => {}) 는 허용
      }
    ],

    // ────────────────────────────────────────────────
    // 변수 (Variables)
    // - var 사용 금지
    // - const 우선 사용
    // - 전역변수 지양
    // ────────────────────────────────────────────────
    'no-var': 'error',
    'prefer-const': 'error',
    'no-implicit-globals': 'error',

    // ────────────────────────────────────────────────
    // 함수 (Functions)
    // - 매개변수 최대 3개 (초과 시 object 사용)
    // ────────────────────────────────────────────────
    'max-params': ['error', 3],

    // ────────────────────────────────────────────────
    // 구현 (Implementation)
    // - 삼중 등호(===, !==) 강제
    // - 템플릿 문자열 사용 권장
    // - 중괄호 생략 금지 (early return 등 일관성)
    // ────────────────────────────────────────────────
    eqeqeq: ['error', 'always', { null: 'ignore' }],
    'prefer-template': 'error',
    curly: ['error', 'all'],

    // ────────────────────────────────────────────────
    // 모듈 (Modules)
    // - 타입은 import type 강제
    // - export * 금지
    // - import 중복 금지
    // ────────────────────────────────────────────────
    '@typescript-eslint/consistent-type-imports': [
      'error',
      {
        prefer: 'type-imports',
        disallowTypeAnnotations: true,
        fixStyle: 'separate-type-imports'
      }
    ],
    'import/no-duplicates': 'error',

    // FSD Public API 강제: 레이어 alias로는 슬라이스 루트(index.ts)까지만 import 허용,
    // 슬라이스 내부 경로(@features/auth/ui/LoginForm 등)로의 딥 임포트는 금지
    'import/no-internal-modules': [
      'error',
      {
        forbid: ['@views/*/**', '@widgets/*/**', '@features/*/**', '@entities/*/**', '@shared/*/**']
      }
    ],

    // ────────────────────────────────────────────────
    // FSD 레이어 의존 방향 강제
    // shared → entities → features → widgets → views → app
    // 낮은 레이어는 자신보다 높은 레이어를 import할 수 없음
    // ────────────────────────────────────────────────
    'import/no-restricted-paths': [
      'error',
      {
        zones: [
          {
            target: './src/shared',
            from: ['./src/entities', './src/features', './src/widgets', './src/views', './src/app'],
            message: 'shared 레이어는 entities/features/widgets/views/app를 import할 수 없습니다.'
          },
          {
            target: './src/entities',
            from: ['./src/features', './src/widgets', './src/views', './src/app'],
            message: 'entities 레이어는 features/widgets/views/app를 import할 수 없습니다.'
          },
          {
            target: './src/features',
            from: ['./src/widgets', './src/views', './src/app'],
            message: 'features 레이어는 widgets/views/app를 import할 수 없습니다.'
          },
          {
            target: './src/widgets',
            from: ['./src/views', './src/app'],
            message: 'widgets 레이어는 views/app를 import할 수 없습니다.'
          },
          {
            target: './src/views',
            from: ['./src/app'],
            message: 'views 레이어는 app를 import할 수 없습니다.'
          }
        ]
      }
    ],

    // ────────────────────────────────────────────────
    // no-restricted-syntax: 메시지 커스텀 가능한 규칙들
    // ────────────────────────────────────────────────
    'no-restricted-syntax': [
      'error',
      {
        selector: 'FunctionDeclaration:not(ExportDefaultDeclaration > FunctionDeclaration)',
        message: '함수 선언식 대신 화살표 함수를 사용해주세요. (const fn = () => {})'
      },
      // export * 금지
      {
        selector: 'ExportAllDeclaration',
        message: "export * 는 사용하지 않습니다. import 후 named export를 사용해주세요. (import { x } from '...'; export { x };)"
      },
      // == / != 사용 금지 (eqeqeq와 이중 방어)
      {
        selector: 'BinaryExpression[operator="=="]',
        message: '== 대신 === 을 사용해주세요. '
      },
      {
        selector: 'BinaryExpression[operator="!="]',
        message: '!= 대신 !== 을 사용해주세요.'
      },
      // var 사용 금지 (no-var와 이중 방어)
      {
        selector: 'VariableDeclaration[kind="var"]',
        message: 'var는 사용하지 않습니다. const 또는 let을 사용해주세요.'
      },
      // 문자열 연결(+) 금지 — 템플릿 리터럴 사용 유도
      {
        selector:
          'BinaryExpression[operator="+"][left.type="Literal"][left.regex=undefined][right.type!="Literal"], BinaryExpression[operator="+"][right.type="Literal"][right.regex=undefined][left.type!="Literal"]',
        message: '문자열 연결에 + 연산자 대신 템플릿 리터럴을 사용해주세요. (예: `안녕 ${name}`)'
      },
      // window.xxx 전역변수 할당 금지
      {
        selector: 'AssignmentExpression[left.type="MemberExpression"][left.object.name="window"]',
        message: 'window.xxx 전역변수 할당은 사용하지 않습니다. 모듈 스코프 내에서 변수를 선언해주세요.'
      }
    ],

    // ────────────────────────────────────────────────
    // no-restricted-imports: 잘못된 import 패턴 차단
    // ────────────────────────────────────────────────
    'no-restricted-imports': [
      'error',
      {
        paths: [
          {
            name: 'util',
            importNames: ['isArray'],
            message: 'util.isArray 대신 Array.isArray를 사용해주세요.'
          },
          {
            name: 'lodash',
            message: 'lodash 전체를 import하지 말고 개별 함수를 import해주세요. (예: import debounce from "lodash/debounce")'
          },
          {
            name: 'react',
            importNames: ['default'],
            message: 'React는 default import 없이 사용할 수 있습니다. (React 17+ JSX transform)'
          }
        ]
      }
    ],

    // ────────────────────────────────────────────────
    // 기타 기존 규칙 유지
    // ────────────────────────────────────────────────
    'no-implicit-coercion': 'error',
    'no-undef': 'off',
    indent: 'off',
    '@typescript-eslint/indent': 'off',
    semi: 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/no-non-null-assertion': 'off',
    'no-extra-boolean-cast': 'off',
    'getter-return': 'warn',
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/no-use-before-define': 'off',
    '@typescript-eslint/no-empty-interface': 'off',
    '@typescript-eslint/no-parameter-properties': 'off',
    'no-async-promise-executor': 'warn',
    '@typescript-eslint/prefer-as-const': 'warn',
    '@typescript-eslint/no-non-null-asserted-optional-chain': 'warn',
    '@typescript-eslint/no-restricted-types': 'warn',
    '@typescript-eslint/no-inferrable-types': 'warn',
    '@typescript-eslint/no-empty-function': 'off',
    '@typescript-eslint/array-type': ['error', { default: 'array-simple' }],
    '@typescript-eslint/no-unused-vars': ['error', { ignoreRestSiblings: true }],
    '@typescript-eslint/member-ordering': [
      'error',
      {
        default: [
          'public-static-field',
          'private-static-field',
          'public-instance-field',
          'private-instance-field',
          'public-constructor',
          'private-constructor',
          'public-instance-method',
          'private-instance-method'
        ]
      }
    ],
    'no-warning-comments': ['warn', { terms: ['TODO', 'FIXME', 'XXX', 'BUG'], location: 'anywhere' }],
    'react/prop-types': 'off',
    'react/display-name': 'off',
    'react-hooks/rules-of-hooks': 'error',
    'react-hooks/exhaustive-deps': 'error',
    'react/jsx-no-target-blank': 'error',
    'react/react-in-jsx-scope': 'off',
    'react/no-unknown-property': ['error', { ignore: ['css'] }]
  }
}, {
  files: ['**/*.stories.{ts,tsx}', '.storybook/**/*.{ts,tsx}'],
  languageOptions: {
    parserOptions: {
      project: false
    }
  },
  rules: {
    '@typescript-eslint/naming-convention': 'off'
  }
}, prettierConfig, storybook.configs["flat/recommended"]);

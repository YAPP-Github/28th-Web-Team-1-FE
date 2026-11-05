---
name: e2e-from-pr
description: PR(연결 이슈·본문·diff)을 분석해 TC를 만들고 Playwright로 E2E를 실행한 뒤 결과를 보고한다. "PR e2e 돌려줘", "/e2e-from-pr 215" 같은 요청이나 CI(e2e-ai 워크플로)에서 사용.
---

# e2e-from-pr

PR 하나를 받아 **TC 작성 → Playwright spec 생성 → 실행 → 결과 보고**를 수행한다.
TC와 spec은 일회성이다. `e2e-ai/generated/`, `e2e-ai/tc.md`, `e2e-ai/result.md`는 gitignore 대상이며 **절대 커밋하지 않는다.**

## 입력
- 인자: PR 번호 또는 이슈 번호 (없으면 현재 브랜치 기준으로 진행). 번호 해석은 '1. 컨텍스트 수집'의 0번 참고
- 환경변수: `E2E_BASE_URL` (없으면 `http://localhost:3000`, 로컬에서 `npm run dev`가 떠 있어야 함), `QA_REFRESH_TOKEN` (로컬은 `.env.qa`에서 자동 로드)

## 1. 컨텍스트 수집
0. **번호 해석**: 이 레포는 이슈·PR이 같은 번호 체계를 쓴다 (브랜치 `feat/#215`의 PR은 #217일 수 있음)
   - `gh pr view <N>`이 실패하면 이슈 번호로 보고, 연결된 PR을 찾는다
     1. 브랜치명 기준: `gh pr list --state all --limit 200 --json number,headRefName,state,body` 결과를 가져와 `headRefName`이 `*/#<N>`으로 끝나는 것 (검색어로 거르지 않는다. 제목·본문에 번호가 없으면 검색에서 빠진다)
     2. 없으면 같은 결과에서 `body`에 `#<N>`이 있는 것. 번호 뒤에 숫자가 이어지면 다른 번호다 (`#21`은 `#215`가 아님)
     3. 후보가 여러 개면 임의로 고르지 말고 후보 목록을 결과에 적고 중단한다
   - 그래도 없으면 중단하고 "PR을 찾지 못함"으로 보고한다. 어떤 PR로 진행했는지 결과 첫 줄에 적는다 (예: "이슈 #215 → PR #217")
1. PR: `gh pr view <PR> --json number,title,body,headRefName,baseRefName,files`
   - `gh`가 없으면 현재 브랜치명과 `git log origin/dev..HEAD --oneline`으로 대신한다
2. 연결 이슈: 브랜치명 `feat/#N`, `bug/#N` 등의 `N` 또는 PR 본문의 `#N` → `gh issue view N --json title,body`
3. 코드 변경: `git diff origin/<base>...HEAD` (base 기본값 `dev`). 큰 파일은 `--stat`을 먼저 보고 필요한 부분만 읽는다
   - **이미 머지된 PR**(`state=MERGED`)이면 현재 HEAD와 무관하므로 머지 커밋 기준으로 본다: `gh pr view <PR> --json mergeCommit` → `git diff <merge>^1 <merge>`
   - 테스트 대상 코드에 그 변경이 들어 있는지 확인한다: 로컬은 `git merge-base --is-ancestor <merge 또는 head sha> HEAD`, 아니면 결과에 "현재 코드에 PR 변경 미포함"을 표시하고 중단

## 2. 영향 범위 분석
- 변경 파일을 FSD 레이어로 분류: `src/views` → `src/widgets` → `src/features` → `src/entities` → `src/shared`
- import를 거슬러 올라가 해당 화면을 쓰는 `app/` 라우트를 찾는다. 주요 라우트:
  - 공개: `/` (랜딩, 모바일은 A/B 쿠키 `landing_variant=A|B`)
  - 로그인 필요: `/home`, `/resumes`, `/resumes/[id]`, `/resumes/edit/[id]`, `/experiences`, `/experiences/[projectId]`, `/mypage/profile`, `/mypage/account`
- `src/shared` 변경은 대표 화면 2~3개만 회귀 확인
- 동적 라우트(`[id]`)는 목록 화면에서 첫 항목을 클릭해 들어간다 (id 하드코딩 금지)

## 3. TC 작성 → `e2e-ai/tc.md`
형식:
```
| TC | 화면 | 사전조건 | 단계 | 기대결과 | 근거 |
|---|---|---|---|---|---|
| TC-01 | /home | 로그인 | 1. 진입 2. 하단까지 스크롤 | 다음 페이지 카드가 추가 노출 | #215, src/widgets/home/... |
```
- 우선순위: ① 이슈/PR에 적힌 요구사항 ② diff로 바뀐 동작 ③ 같은 화면의 핵심 흐름 회귀 1개
- **최대 8개**. 모바일·반응형 관련 변경이면 해당 TC를 모바일로도 실행 (`@mobile` 태그)
- CSS·스타일만 바뀐 경우: "시각 확인 필요"로 표시하고 해당 요소의 스크린샷만 남기는 TC 작성 (픽셀 비교 안 함)
- 트래킹 이벤트(Amplitude) 변경: 실제 전송은 fixture가 차단하므로, 이벤트를 트리거하는 사용자 동작이 에러 없이 되는지만 확인하고 "이벤트 수신은 Amplitude에서 수동 확인"으로 표시

## 4. spec 생성 → `e2e-ai/generated/*.spec.ts`
- 먼저 `e2e-ai/templates/00-smoke.spec.ts`를 `e2e-ai/generated/00-smoke.spec.ts`로 복사한다
- TC마다(또는 화면 단위로) `NN-<화면>.spec.ts` 작성
- **반드시** `import { test, expect, routeGraphql, gql, waitForGraphql, expectToast, expectAuthenticated, e2eName } from '../fixtures'` 사용 (`@playwright/test` 직접 import 금지)
  - `page`: 로그인 상태, `guestPage`: 비로그인 상태
  - ⛔ **한 테스트에서 `page`와 `guestPage`를 함께 쓰지 않는다.** 같은 context를 공유해 `page`의 로그인 쿠키가 `guestPage`에도 적용된다 (비로그인 `/` 진입이 `/home`으로 리다이렉트됨). 로그인/비로그인 비교는 테스트를 나눈다
- test 제목은 `TC-01 | <시나리오>` 형식, 모바일도 돌릴 TC는 제목 끝에 ` @mobile`
- 셀렉터 우선순위: `getByRole` > `getByLabel`/`getByPlaceholder` > `getByText` > `getByTestId` > CSS
  - 셀렉터를 정하기 전에 실제 컴포넌트 소스를 읽어 문구·role을 확인한다
- 고정 `waitForTimeout` 금지. `expect(...).toBeVisible()`, `waitForGraphql(page, 'OperationName')` 사용
- 데이터 생성·수정·삭제, AI 요청, 외부 연동은 아래 4-1 규칙을 따른다
- 로그인(Google/Kakao OAuth)처럼 외부 화면으로 넘어가는 흐름은 `test.skip(true, '사유')` 처리한다
- 랜딩 A/B가 필요하면 `guestPage.context().addCookies([{ name: 'landing_variant', value: 'B', url: baseURL }])`

### 4-1. 요청 처리 규칙 (데이터 · AI · 외부 연동)
GraphQL 요청 제어는 fixture의 **`routeGraphql(page, { mock, transform, block })`** 한 번으로 한다 (테스트당 1회). GraphQL은 `page.route`를 직접 작성하지 않고, REST(AI 추출 등)만 아래 규칙 B처럼 예외로 직접 가짜 응답을 줄 수 있다.
AI·외부 연동 오퍼레이션은 `mock`을 주지 않으면 **자동 차단**된다.

| 구분 | 오퍼레이션 | 처리 |
|---|---|---|
| **테스트가 만든 데이터** | `CreateExperience`·`UpdateExperience`·`DeleteExperience`, `CreateProject`·`UpdateProject`·`DeleteProject`, 테스트가 만든 이력서의 `UpdateResume`·`DeleteResume` 등 | **실제로 실행**하고, 새로고침·재조회로 반영 여부까지 확인. 끝나면 정리 (규칙 A) |
| **QA 계정의 기존 데이터 변경** | 기존 이력서 `UpdateResume`·`DeleteResume`, `UpdateProfile` 등 | **실제로 실행한다.** QA 계정(잡도리)은 E2E 전용이므로 허용. 단 규칙 A의 대상 지정·원복·기록 규칙을 지킨다. 원복이 어려우면 `block`으로 막고 요청 본문(`calls`)만 검사 |
| **AI 비용·시간** | `GenerateCoreCompetency`, `RegisterJd`(JD 분석), `SendExperienceQuestionRoomMessage`, `PolishProfileText`, PDF 이력서 추출(REST `resume-imports`) | **가짜 응답(`mock`)으로 대체** (규칙 B). 실제 호출은 기본 차단 |
| **외부 연동** | `ConnectNotion`, `ImportNotionExperiences`, OAuth | 기본 차단. 필요하면 `mock`, 화면 이동이 있으면 `test.skip` |

#### 규칙 A. 실제 생성·수정·삭제 (테스트가 만든 데이터만)
- 이름·제목에 `e2eName('라벨')`(`[E2E-AI] 라벨 타임스탬프`)을 쓴다. 목록에서 찾을 때도 **이 이름으로만** 찾는다 (다른 PR 실행이 같은 QA 계정을 동시에 쓸 수 있음)
- 기존 데이터(QA 계정의 원래 이력서·프로필 등)도 수정·삭제할 수 있다. 단 (a) 대상은 이름이나 ID로 명확히 고르고, "첫 번째 항목"처럼 임의로 고르지 않는다, (b) 수정 전 값을 저장해 테스트 끝에 원래 값으로 되돌린다. 되돌릴 수 없는 삭제는 결과의 "사람이 확인할 것"에 무엇을 지웠는지 적는다
- 동작 후 **새로고침(`page.reload()`) 또는 재진입으로 실제 반영**을 확인한다 (화면 상태만 보고 통과시키지 않는다)
- 정리는 `try/finally`로, 테스트가 실패해도 실행되게 한다. 화면 대신 `gql()`로 직접 지우는 게 빠르고 확실하다
  ```ts
  const gqlRoute = await routeGraphql(page) // AI·외부 연동만 자동 차단, 나머지는 실제 실행
  const name = e2eName('경험')
  let created: { workspaceId: string; experienceId: string } | null = null
  try {
    // ... 화면에서 name으로 생성 → 응답/URL에서 id 확보해 created에 저장
    await page.reload()
    await expect(page.getByText(name)).toBeVisible() // 실제 반영 확인
    // ... 수정 → reload → 확인, 삭제 → reload → 사라졌는지 확인 (삭제까지 했으면 created = null)
  } finally {
    if (created) {
      const target = created
      await gql(page, 'mutation DeleteExperience($workspaceId: ID!, $experienceId: ID!) { deleteExperience(workspaceId: $workspaceId, experienceId: $experienceId) }', target).catch((e: Error) => {
        // 정리 실패를 삼키지 않는다. 남은 데이터를 테스트 실패 메시지와 결과 보고에 남긴다
        throw new Error(`[e2e-ai] 정리 실패 — 남은 데이터: ${name} (experienceId=${target.experienceId}): ${e.message}`)
      })
    }
  }
  ```
  - 오퍼레이션 이름·인자·반환 필드는 `src/entities/**/api/*.api.ts`의 실제 문서를 보고 쓴다
- 결과의 "사람이 확인할 것"에 정리 실패가 있었다면 남은 데이터 이름을 적는다

#### 규칙 B. AI 요청은 가짜 응답으로 대체
- 목적은 **프론트 동작 검증**이다: 요청이 올바른 인자로 나가는지, 응답이 화면에 반영되는지, 실패 시 에러가 보이는지. AI 답변 품질은 검증 대상이 아니다
- 가짜 응답은 `src/entities/**/api/*.api.ts`의 해당 문서 선택 필드와 `src/shared/lib/gql/graphql.ts`의 타입에 맞춰 **필요한 필드를 모두** 채운다. 화면에 보일 값은 `E2E 핵심역량 응답`처럼 고유한 문자열로 해서, 그 문자열이 화면에 나타나는지 확인한다
  ```ts
  const gqlRoute = await routeGraphql(page, {
    mock: {
      GenerateCoreCompetency: { data: { generateCoreCompetency: { coreCompetency: 'E2E 핵심역량 응답', strategy: 'E2E 전략' } } }
    }
  })
  // ... 트리거 후
  await expect(page.getByText('E2E 핵심역량 응답')).toBeVisible()
  expect(gqlRoute.calls.find((c) => c.operation === 'GenerateCoreCompetency')?.variables).toMatchObject({ jdId: expect.any(String) })
  ```
- **실패 경로도 1개** 검증한다: `mock: { X: { errors: [{ message: '...', extensions: { code: 'INTERNAL' } }] } }` → 에러 토스트·복구 UI 확인
- 실제 AI 호출(`allowAiCalls: true`)은 **PR이 AI 기능 자체(해당 mutation·응답 처리)를 바꾼 경우의 대표 흐름 1개**에만 쓴다. 이때 TC 제목 끝에 ` @real-ai`를 붙이고, 응답 내용이 아니라 "응답이 와서 화면에 반영됐는지"만 검증한다 (타임아웃은 `test.setTimeout`으로 넉넉히)
- `GenerateCoreCompetency`는 백엔드에서 LLM을 호출하는 비용 발생 API다. 이력서 편집 화면은 대상 JD가 있고 핵심역량이 아직 초기 항목이면 **진입 시 자동 호출**한다(`src/views/resume_edit/ui/ResumeEditPage.tsx`, `src/views/resume_edit/ui/ResumeMobilePreview.tsx`). 이 화면을 여는 TC는 반드시 `mock`으로 막아라. 다른 AI 흐름을 실제로 테스트하려고 `allowAiCalls: true`를 쓰더라도, 이 자동 호출까지 실제로 나가지 않도록 `mock`을 함께 지정한다.
- PDF 업로드 후 추출처럼 REST로 가는 AI 요청은 자동 차단된다. GraphQL과 달리 REST는 `routeGraphql`이 아니라 `page.route`로 직접 가짜 응답을 준다: `page.route(/resume-imports/, (r) => r.fulfill({ json: { resumeId: '...' } }))` (단, 이후 화면이 그 id를 실제 조회하면 실패하므로 요청 인자 검증까지만 한다)

#### 상태 재현: 조회 응답 가공
- 서버 데이터로 만들기 어려운 상태(섹션 없음, 기간 일부 누락, 빈 목록 등)는 `transform`으로 조회 응답을 가공한다
  ```ts
  const gqlRoute = await routeGraphql(page, {
    block: ['UpdateResume'], // 이 TC는 상태 재현만 보므로 저장은 막고 본문만 검사 (저장 결과를 검증할 TC라면 생략하고 규칙 A대로 원복)
    transform: { Resume: (data) => ({ ...data, resume: { ...data.resume, sections: data.resume.sections.filter((s: { type: string }) => s.type !== 'EXPERIENCE') } }) }
  })
  // 진입 후 반드시
  expect(gqlRoute.transformed.Resume, '응답 가공이 실제로 적용돼야 함').toBeGreaterThan(0)
  ```
  - ⚠️ **가공 적용 여부를 반드시 assert 한다.** 서버 렌더링(SSR)으로 조회되면 브라우저 route에 걸리지 않아, 원래 데이터만으로 통과하는 **거짓 통과**가 생긴다
  - 같은 이유로, 기존 데이터만으로도 기대결과가 이미 성립하는지 먼저 확인하고, 그렇다면 가공이나 고유 값(예: `E2E경력시작만`)으로 PR 변경이 없으면 실패하는 테스트로 만든다
- `waitForLoadState('networkidle')` 금지: dev 서버·폴링 때문에 끝나지 않아 타임아웃 난다. 화면 요소(`toBeVisible`)로 기다린다

## 5. 실행 및 자가 수정
1. `npx playwright test 00-smoke` → 실패하면 **중단**하고 "환경 문제"로 보고 (토큰 만료, Preview 접근 불가 등)
2. `npx playwright test` 전체 실행
3. 실패한 테스트마다 에러 메시지, 스크린샷(`test-results/`), 관련 소스를 보고 분류:
   - `앱 버그 의심`: 기대결과가 이슈/PR 요구사항과 일치하는데 앱이 다르게 동작
   - `테스트 문제`: 셀렉터 오류, 타이밍, 잘못된 사전조건
   - `환경 문제`: 인증 실패, 백엔드 5xx, 데이터 없음
4. **`테스트 문제`만 수정 후 재실행 가능, 최대 2회.**
   - ⛔ 기대결과(assertion 대상 값·조건)를 바꾸거나 지우거나 `test.skip`으로 돌려서 통과시키는 것 **금지**
   - ⛔ 앱 소스 코드(`src/`, `app/`) 수정 금지. 이 스킬은 보고만 한다
5. 마지막 실행 결과가 `e2e-ai/report.json`에 남아 있어야 한다
   - 마지막 실행은 `--reporter` 옵션 없이 돌린다. `--reporter=list` 등을 주면 config의 json/html 리포터가 대체돼 `report.json`·HTML 리포트가 생성되지 않는다

## 6. 결과 보고 → `e2e-ai/result.md`
```markdown
## 🤖 AI E2E 결과: 통과 6 / 실패 1 / 건너뜀 1

| TC | 화면 | 시나리오 | 결과 | 비고 |
|---|---|---|---|---|
| TC-01 | /home | ... | ✅ | |
| TC-03 | /home (mobile) | ... | ❌ 앱 버그 의심 | 원인 추정 한 줄. `src/...:42` |
| TC-04 | / | ... | ⏭️ | 건너뛴 사유 |

<details><summary>TC 상세</summary>

(tc.md 표 그대로)

</details>

### 사람이 확인할 것
- 시각 확인 필요 항목, Amplitude 수동 확인 항목, 자동화하지 못한 시나리오
```
- 실패 원인에는 추측임을 명시하고, 관련 코드 위치를 `파일:라인`으로 적는다
- 자가 수정을 했다면 "TC-02: 셀렉터 수정 1회" 처럼 기록한다
- 로컬 실행이면 같은 내용을 대화에도 출력한다

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
   - `gh pr view <N>`이 실패하면 이슈 번호로 보고, 연결된 PR을 찾는다: `gh pr list --state all --search "<N> in:title,body" --json number,headRefName,state` 중 `headRefName`이 `*/#<N>`인 것 → 없으면 PR 본문에 `#<N>`이 있는 것
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
- **반드시** `import { test, expect, waitForGraphql, expectToast, expectAuthenticated, e2eName } from '../fixtures'` 사용 (`@playwright/test` 직접 import 금지)
  - `page`: 로그인 상태, `guestPage`: 비로그인 상태
- test 제목은 `TC-01 | <시나리오>` 형식, 모바일도 돌릴 TC는 제목 끝에 ` @mobile`
- 셀렉터 우선순위: `getByRole` > `getByLabel`/`getByPlaceholder` > `getByText` > `getByTestId` > CSS
  - 셀렉터를 정하기 전에 실제 컴포넌트 소스를 읽어 문구·role을 확인한다
- 고정 `waitForTimeout` 금지. `expect(...).toBeVisible()`, `waitForGraphql(page, 'OperationName')` 사용
- 데이터를 생성하면 이름에 `e2eName('라벨')`을 사용하고, 가능하면 테스트 끝에 삭제한다 (단, 아래 4-1의 차단 방식을 우선)
- 외부 연동(Google/Kakao/Notion OAuth, 파일 업로드 후 AI 분석처럼 오래 걸리는 생성 작업)은 `test.skip(true, '사유')` 처리하거나 `page.route`로 응답을 막는다
- 랜딩 A/B가 필요하면 `guestPage.context().addCookies([{ name: 'landing_variant', value: 'B', url: baseURL }])`

### 4-1. 데이터 안전 · 상태 재현 패턴
- **저장·생성 요청은 차단하고 요청 본문을 검사한다.** 실데이터를 바꾸지 않으면서 "무엇을 보내는지"를 확인할 수 있다
  ```ts
  const mutations: Array<{ query: string; variables: any }> = []
  await page.route('**/api/graphql', async (route) => {
    const raw = route.request().postData() ?? ''
    if (raw.includes('mutation ')) { mutations.push(JSON.parse(raw)); return route.abort() }
    return route.continue()
  })
  // ... 저장 버튼 클릭 후
  await expect.poll(() => mutations.filter((m) => m.query.includes('mutation UpdateResume')).length).toBeGreaterThan(0)
  ```
  - AI 생성·메시지 전송 같은 비용 드는 mutation도 같은 방식으로 막는다
  - 실제로 저장돼야만 검증 가능한 시나리오(저장 후 재조회 등)만 예외로 실데이터를 쓰고, 그때는 `e2eName`과 정리를 지킨다
- **서버 데이터로 만들기 어려운 상태는 조회 응답을 가공해 재현한다** (섹션 없음, 기간 일부 누락, 빈 목록 등)
  ```ts
  let transformed = 0
  await page.route('**/api/graphql', async (route) => {
    const raw = route.request().postData() ?? ''
    if (raw.includes('query Resume(')) {
      const response = await route.fetch()
      const json = await response.json()
      json.data.resume.sections = json.data.resume.sections.filter((s) => s.type !== 'EXPERIENCE')
      transformed += 1
      return route.fulfill({ response, json })
    }
    return route.continue()
  })
  // 진입 후 반드시
  expect(transformed, '응답 가공이 실제로 적용돼야 함').toBeGreaterThan(0)
  ```
  - ⚠️ **가공 적용 여부를 반드시 assert 한다.** 서버 렌더링(SSR)으로 조회되면 브라우저 route에 걸리지 않아, 원래 데이터만으로 통과하는 **거짓 통과**가 생긴다
  - 같은 이유로, 기존 데이터만으로도 기대결과가 이미 성립하는지 먼저 확인하고, 그렇다면 가공이나 고유 값(예: `E2E경력시작만`)으로 PR 변경이 없으면 실패하는 테스트로 만든다
  - 하나의 테스트에서 차단과 가공을 함께 쓸 때는 route 핸들러를 하나로 합친다
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

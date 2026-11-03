/**
 * GitHub Pages에 올릴 정적 사이트(e2e-ai/site)와 PR 코멘트용 스크린샷 마크다운(e2e-ai/screens.md)을 만든다.
 * - playwright-report(HTML 리포트)를 복사하되 트레이스 zip은 제외한다.
 *   트레이스에는 요청 헤더(QA 계정 쿠키·Vercel bypass 시크릿)가 그대로 남아 공개 배포하면 안 된다. 트레이스는 비공개 artifact로만 제공한다.
 * - 실패한 테스트의 스크린샷과, 테스트가 직접 attach한 시각 확인용 이미지를 screens/에 모은다.
 *
 * 사용: node e2e-ai/scripts/build-pages.mjs <이 실행의 Pages URL (끝에 / 없이)>
 */
import fs from 'node:fs'
import path from 'node:path'
import process from 'node:process'
import { Buffer } from 'node:buffer'

const [, , baseUrl = ''] = process.argv
const REPORT_DIR = 'playwright-report'
const REPORT_JSON = 'e2e-ai/report.json'
const SITE_DIR = 'e2e-ai/site'
const SCREENS_MD = 'e2e-ai/screens.md'
const MAX_SCREENS = 12

fs.rmSync(SITE_DIR, { recursive: true, force: true })
if (fs.existsSync(REPORT_DIR)) fs.cpSync(REPORT_DIR, SITE_DIR, { recursive: true })
fs.mkdirSync(path.join(SITE_DIR, 'screens'), { recursive: true })

/** 트레이스(zip) 제거 */
const removeTraces = (dir) => {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name)
    if (entry.isDirectory()) removeTraces(full)
    else if (entry.name.endsWith('.zip')) fs.rmSync(full)
  }
}
removeTraces(SITE_DIR)

/** report.json에서 [{ title, project, kind, attachment }] 수집 */
const collect = (suite, out = []) => {
  for (const spec of suite.specs ?? []) {
    for (const t of spec.tests ?? []) {
      const result = t.results?.at(-1)
      if (!result) continue
      const images = (result.attachments ?? []).filter((a) => a.contentType === 'image/png' && (a.path || a.body))
      if (t.status === 'unexpected') {
        const shot = images.filter((a) => a.name === 'screenshot').at(-1)
        if (shot) out.push({ title: spec.title, project: t.projectName, kind: 'fail', attachment: shot })
      }
      for (const a of images.filter((a) => a.name !== 'screenshot')) {
        out.push({ title: `${spec.title} · ${a.name}`, project: t.projectName, kind: 'visual', attachment: a })
      }
    }
  }
  for (const child of suite.suites ?? []) collect(child, out)
  return out
}

const report = fs.existsSync(REPORT_JSON) ? JSON.parse(fs.readFileSync(REPORT_JSON, 'utf8')) : { suites: [] }
const entries = report.suites.flatMap((s) => collect(s))
// 실패 먼저, 그 다음 시각 확인
entries.sort((a, b) => (a.kind === b.kind ? 0 : a.kind === 'fail' ? -1 : 1))

const lines = []
entries.slice(0, MAX_SCREENS).forEach((entry, i) => {
  const file = `screens/${String(i + 1).padStart(2, '0')}-${entry.kind}-${entry.project}.png`
  const dest = path.join(SITE_DIR, file)
  if (entry.attachment.path && fs.existsSync(entry.attachment.path)) fs.copyFileSync(entry.attachment.path, dest)
  else if (entry.attachment.body) fs.writeFileSync(dest, Buffer.from(entry.attachment.body, 'base64'))
  else return

  const icon = entry.kind === 'fail' ? '❌' : '👀'
  const open = entry.kind === 'fail' ? ' open' : ''
  lines.push(`<details${open}><summary>${icon} ${entry.title} (${entry.project})</summary>\n\n<img src="${baseUrl}/${file}" width="420" />\n\n</details>`)
})

const md = lines.length ? `### 📸 스크린샷\n${lines.join('\n')}\n` : ''
fs.writeFileSync(SCREENS_MD, md)
process.stdout.write(`[build-pages] site=${SITE_DIR}, screens=${lines.length}\n`)

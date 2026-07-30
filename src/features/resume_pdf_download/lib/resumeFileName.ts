const sanitize = (value?: string | null): string => value?.trim().replace(/[\\/:*?"<>|]/g, '') ?? ''

/**
 * 다운로드 파일명과 PDF 문서 타이틀(브라우저 탭 제목)에 공통으로 쓰는 베이스 `{기업명}_{직무명}_이력서`.
 * 비어 있는 부분은 건너뛰고, 둘 다 없으면 `이력서`. OS·파일명에서 문제되는 문자는 제거한다.
 */
export const buildResumeBaseName = (companyName?: string | null, positionTitle?: string | null): string => {
  const parts = [sanitize(companyName), sanitize(positionTitle)].filter(Boolean)
  return [...parts, '이력서'].join('_')
}

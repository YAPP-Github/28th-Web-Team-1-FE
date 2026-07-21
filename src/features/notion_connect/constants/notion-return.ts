/**
 * `/auth/notion/callback`(서버)이 만들고 `useNotionReturn`(클라이언트)이 읽는 복귀 URL 쿼리 값.
 */

/** 연동 성공 시 콜백이 복귀 URL에 붙이는 `?step=` 값 */
export const NOTION_PAGE_SELECT_STEP = 'notion-page-select'

/** 연동 실패 시 콜백이 복귀 URL에 붙이는 `?error=` 값 */
export const NOTION_CONNECT_ERROR = 'notion'

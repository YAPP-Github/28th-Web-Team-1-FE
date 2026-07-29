// Amplitude 이벤트 이름을 상수로 정의하여 오타를 방지합니다.

export const AMPLITUDE_EVENTS = {
  RESUME_VIEWED: 'resume_viewed',
  RESUME_UPLOAD_VIEWED: 'resume_upload_viewed',
  RESUME_CONFIRM_VIEWED: 'resume_confirm_viewed',
  RESUME_STATUS_SELECTED: 'resume_status_selected',
  NOTION_VIEWED: 'notion_viewed',
  NOTION_SELECTED_VIEWED: 'notion_selected_viewed',
  NOTION_STATUS_SELECTED: 'notion_status_selected',
  DIRECT_WRITE_ENTERED: 'direct_write_entered',
  EXPERIENCE_WRITE_SELECTED: 'experience_write_selected',
  JD_URL_ENTERED: 'jd_url_entered',
  EXPERIENCE_SELECTION_VIEWED: 'experience_selection_viewed',
  EXPERIENCE_SELECTED: 'experience_selected',
  EXPERIENCE_SELECTION_COMPLETED: 'experience_selection_completed',
  RESUME_DRAFT_VIEWED: 'resume_draft_viewed',
  TEXT_COPIED: 'text_copied',
  EDIT_MODAL_OPENED: 'edit_modal_opened'
} as const

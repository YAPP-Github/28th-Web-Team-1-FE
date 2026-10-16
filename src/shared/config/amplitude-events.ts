// Amplitude 이벤트 이름을 상수로 정의하여 오타를 방지합니다.

export const AMPLITUDE_EVENTS = {
  // 세그먼트 분기
  RESUME_STATUS_SELECTED: 'resume_status_selected',
  NOTION_STATUS_SELECTED: 'notion_status_selected',
  EXPERIENCE_WRITE_SELECTED: 'experience_write_selected',

  // JD 분석
  JD_URL_ENTERED: 'jd_url_entered',

  // 경험 선택 모달
  EXPERIENCE_SELECTION_VIEWED: 'experience_selection_viewed',
  EXPERIENCE_SELECTED: 'experience_selected',

  // 이력서 편집
  TEXT_COPIED: 'text_copied',

  // AI 첨삭 모달
  EDIT_MODAL_OPENED: 'edit_modal_opened',
  SECTION_EDITED: 'section_edited',
  AI_EDIT_STARTED: 'ai_edit_started',
  EDIT_APPLIED: 'edit_applied',
  RESUME_COMPLETION_CLICKED: 'resume_completion_clicked',

  // 랜딩
  LANDING_VIEWED: 'landing_viewed',
  MOBILE_MODAL_VIEWED: 'mobile_modal_viewed',
  KAKAO_CLICKED: 'kakao_clicked',

  // 경험 정리
  EXPERIENCE_ADD_METHOD_SELECTED: 'experience_add_method_selected',
  EXPERIENCE_TEXT_SUBMITTED: 'experience_text_submitted',
  STAR_FIELD_EDITED: 'star_field_edited',

  // 계정
  ACCOUNT_TAB_VIEWED: 'account_tab_viewed',
  ACCOUNT_INFO_UPDATED: 'account_info_updated'
} as const

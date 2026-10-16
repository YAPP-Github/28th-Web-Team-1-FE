// Amplitude 이벤트 이름을 상수로 정의하여 오타를 방지합니다.

export const AMPLITUDE_EVENTS = {
  // 가입
  SIGN_UP_COMPLETED: 'sign_up_completed',

  // 홈
  HOME_VIEWED: 'home_viewed',
  RESUME_CREATE_METHOD_VIEWED: 'resume_create_method_viewed',
  RESUME_CREATE_METHOD_SELECTED: 'resume_create_method_selected',

  // 세그먼트 분기
  RESUME_STATUS_SELECTED: 'resume_status_selected',
  NOTION_STATUS_SELECTED: 'notion_status_selected',
  EXPERIENCE_WRITE_SELECTED: 'experience_write_selected',

  // JD 분석
  JD_URL_ENTERED: 'jd_url_entered',

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

/** 신규 가입 직후임을 클라이언트에 알리는 일회용 쿠키. 구글 콜백이 심고, `AmplitudeIdentify`가 읽은 뒤 지운다. */
export const SIGN_UP_COMPLETED_COOKIE = 'sign_up_completed'

/** 가입 후 첫 홈 진입임을 알리는 일회용 쿠키. 구글 콜백이 심고, `HomeViewTracker`가 읽은 뒤 지운다. (가입 쿠키와 따로 둬 소비 순서에 의존하지 않는다) */
export const FIRST_HOME_VISIT_COOKIE = 'first_home_visit'

'use client'
import { createContext, useCallback, useContext, useMemo, useState, type PropsWithChildren } from 'react'

/** EXPERIENCE 편집 뷰. 최초 페이지 진입은 'ai', 미리보기에서 EXPERIENCE를 클릭하면 'manual'. */
export type ExperienceEditView = 'ai' | 'manual'

/**
 * 미리보기에서 EXPERIENCE 섹션(item 포함)을 클릭했을 때 우측 편집 화면에 전달하는 스크롤 대상.
 * `nonce`는 클릭마다 올라가며, 같은 item을 다시 클릭해도 스크롤이 다시 일어나게 하는 신호다.
 * `uid`가 null이면 '직접 작성' 뷰로만 열고 스크롤은 하지 않는다.
 */
export type ExperienceItemTarget = { uid: string | null; nonce: number }

type ExperienceEditContextValue = {
  view: ExperienceEditView
  setView: (view: ExperienceEditView) => void
  /** 미리보기에서 클릭한 item으로 편집 뷰를 스크롤하기 위한 대상. 클릭이 없었으면 null. */
  itemTarget: ExperienceItemTarget | null
  openManual: (uid?: string) => void
}

/**
 * EXPERIENCE 편집 상태(뷰 전환 + 미리보기 클릭 item 스크롤 대상)를 소유하는 훅.
 * 뷰/스크롤 대상의 세부 규칙(기본 'ai', 클릭 시 'manual', nonce 증가)을 캡슐화해,
 * 소유 컴포넌트(`ResumeBoard`)는 `value`를 provider에 넘기고 클릭 시 `openManual`만 호출하면 된다.
 */
export const useExperienceEditState = () => {
  const [view, setViewState] = useState<ExperienceEditView>('ai')
  const [itemTarget, setItemTarget] = useState<ExperienceItemTarget | null>(null)

  /** 뷰 전환. 'ai'로 돌아갈 때 이전 클릭 대상을 비워, 다시 'manual'로 전환해도 stale 스크롤이 일어나지 않게 한다. */
  const setView = useCallback((next: ExperienceEditView) => {
    setViewState(next)
    if (next === 'ai') setItemTarget(null)
  }, [])

  /** 미리보기에서 EXPERIENCE(item 포함)를 클릭한 신호. 'manual' 뷰로 전환하고 대상 item을 갱신한다. */
  const openManual = useCallback((uid?: string) => {
    setViewState('manual')
    setItemTarget((prev) => ({ uid: uid ?? null, nonce: (prev?.nonce ?? 0) + 1 }))
  }, [])

  const value = useMemo<ExperienceEditContextValue>(() => ({ view, setView, itemTarget, openManual }), [view, setView, itemTarget, openManual])

  return { value, openManual }
}

/**
 * EXPERIENCE 편집 상태를 범용 섹션 편집 컴포넌트(`ResumeEdit`/`ResumeSectionEdit`)를 거치지 않고
 * `ExperienceSection`에 직접 전달하기 위한 Context. 상태는 `ResumeBoard`가 소유하고 provider로 내려준다.
 */
const ExperienceEditContext = createContext<ExperienceEditContextValue | null>(null)

export const ExperienceEditProvider = ({ value, children }: PropsWithChildren<{ value: ExperienceEditContextValue }>) => (
  <ExperienceEditContext.Provider value={value}>{children}</ExperienceEditContext.Provider>
)

export const useExperienceEdit = () => {
  const context = useContext(ExperienceEditContext)
  if (!context) throw new Error('useExperienceEdit must be used within ExperienceEditProvider')
  return context
}

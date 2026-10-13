'use client'
import { createContext, useContext, type PropsWithChildren } from 'react'

/**
 * 이력서가 맞춤 대상으로 삼은 채용공고(JD) id를 편집 리프 섹션들에 직접 전달하는 Context.
 *
 * `targetJdId`는 `ResumeWorkspace`에서만 알 수 있는 값이지만 실제로 쓰는 곳은 편집 리프
 * (`CareerSection`/`CoreSkillSection`/`ExperienceSection` 및 그 하위)이다. 이 값을 쓰지 않는
 * 범용 계층(`ResumeBoard`/`ResumeEdit`/`ResumeSectionEdit`)을 그대로 관통시키지 않도록
 * provider를 상위에 두고 리프에서 `useTargetJdId`로 읽는다. 대상 JD가 없으면 `null`이다.
 */
const TargetJdContext = createContext<string | null>(null)

export const TargetJdProvider = ({ targetJdId, children }: PropsWithChildren<{ targetJdId: string | null }>) => <TargetJdContext.Provider value={targetJdId}>{children}</TargetJdContext.Provider>

/** 편집 리프 섹션들이 대상 채용공고 id를 prop drilling 없이 읽는다. */
export const useTargetJdId = () => useContext(TargetJdContext)

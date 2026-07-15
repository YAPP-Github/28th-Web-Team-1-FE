import { useEffect, useRef, type RefObject } from 'react'

interface Options {
  /** 관찰 대상이 뷰포트(또는 root)에 들어왔을 때 실행할 콜백 */
  onIntersect: () => void
  /** false이면 관찰을 중단한다. 무한스크롤에서 `hasNextPage && !isFetchingNextPage` 등을 넘긴다. */
  enabled?: boolean
  /** 교차 판정 기준이 되는 스크롤 컨테이너. 생략하면 뷰포트를 기준으로 한다. */
  root?: RefObject<Element | null>
  /** root 경계를 확장/축소해 콜백 시점을 앞당기거나 늦춘다. (예: 끝 도달 전 미리 로드) */
  rootMargin?: string
  /** 관찰 대상이 얼마나 보여야 교차로 볼지(0~1). */
  threshold?: number
}

/**
 * 관찰 대상 요소가 화면(또는 스크롤 컨테이너)에 들어오면 콜백을 실행하는 훅이다.
 * 반환된 ref를 sentinel 요소에 붙여 사용하며, 무한스크롤의 다음 페이지 로드 트리거로 쓴다.
 *
 * @returns sentinel 요소에 부착할 ref
 * @example
 * ```tsx
 * const scrollRef = useRef<HTMLDivElement>(null)
 * const sentinelRef = useIntersectionObserver<HTMLDivElement>({
 *   root: scrollRef,
 *   enabled: hasNextPage && !isFetchingNextPage,
 *   onIntersect: fetchNextPage
 * })
 * return (
 *   <div ref={scrollRef} className={'overflow-y-auto'}>
 *     {items.map(...)}
 *     {hasNextPage && <div ref={sentinelRef} />}
 *   </div>
 * )
 * ```
 */
export const useIntersectionObserver = <T extends Element>({ onIntersect, enabled = true, root, rootMargin = '0px', threshold = 0 }: Options): RefObject<T | null> => {
  const targetRef = useRef<T>(null)

  // 콜백은 최신값으로 유지하되, 관찰자 재생성은 유발하지 않는다.
  const callbackRef = useRef(onIntersect)
  useEffect(() => {
    callbackRef.current = onIntersect
  }, [onIntersect])

  useEffect(() => {
    const target = targetRef.current
    if (!enabled || target === null) return

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) callbackRef.current()
      },
      { root: root?.current ?? null, rootMargin, threshold }
    )
    observer.observe(target)
    return () => observer.disconnect()
  }, [enabled, root, rootMargin, threshold])

  return targetRef
}

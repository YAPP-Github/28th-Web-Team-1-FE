/**
 * draggable이 sortable 그룹에 속하는지 판정한다.
 *
 * `SortableInput.accept`과 `PointerSensor.preventActivation` 콜백이 받는 source는 sortable 여부와 무관한
 * draggable 타입이라, 이 자리에서 `isSortable`로 좁히려면 패키지가 각각 선언한 `Draggable` 타입이 서로
 * 맞지 않아 컴파일되지 않는다(런타임에는 같은 클래스 계층이다). 판정에 필요한 것은 그룹 정체성뿐이므로
 * `group` 값 자체를 `unknown`으로 받아 비교한다.
 *
 * @param source 드래그 소스
 * @param group 허용할 sortable 그룹. 아이템은 자신의 섹션 uid를, 섹션은 `undefined`를 넘긴다.
 */
export const isInSortableGroup = (source: unknown, group: string | undefined): boolean => {
  const sourceGroup = (source as { group?: unknown } | null)?.group
  return sourceGroup === group
}

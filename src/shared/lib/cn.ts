import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

/**
 * Tailwind CSS 클래스를 조건적으로 병합하고 충돌을 해결하는 유틸리티 함수이다.
 * `clsx`와 `tailwind-merge`를 결합하여 클래스 이름을 효율적으로 처리한다.
 * @param inputs 문자열, 조건부 클래스 객체, falsy 값 등이 포함된 클래스 입력 배열
 * @example
 * ```ts
 * cn('text-red-500', 'bg-blue-500'); // 'text-red-500 bg-blue-500'
 *
 * cn('text-red-500', false && 'bg-blue-500'); // 'text-red-500'
 *
 * cn('p-2', 'p-4'); // 'p-4' (tailwind-merge가 충돌을 해결)
 *
 * cn('block', { hidden: isHidden }); // 'block hidden' (isHidden이 true일 경우)
 * ```
 */
export const cn = (...inputs: ClassValue[]) => {
  return twMerge(clsx(inputs))
}

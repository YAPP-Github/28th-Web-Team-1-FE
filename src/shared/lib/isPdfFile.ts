/**
 * 파일의 매직 넘버(파일 시그니처)를 검사하여 PDF 파일인지 확인합니다.
 * 파일의 첫 5바이트를 읽어 PDF 시그니처인 `%PDF-`(0x25 0x50 0x44 0x46 0x2D)와 일치하는지 확인합니다.
 *
 * @param file - 검사할 File 객체
 * @returns 파일이 `%PDF-` 시그니처로 시작하면 `true`, 아니면 `false`를 resolve하는 Promise
 *
 * @remarks
 * - 5바이트 미만의 파일은 항상 `false`를 반환합니다.
 * - 헤더가 파일 시작 지점이 아닌 곳(첫 1024바이트 내)에 위치한 비표준 PDF는 `false`로 판정될 수 있습니다.
 *
 * @example
 * ```ts
 * if (await isPdf(file)) {
 *   console.log('PDF 파일입니다')
 * }
 * ```
 */
export const isPdfFile = async (file: File): Promise<boolean> => {
  const buffer = await file.slice(0, 5).arrayBuffer()
  const bytes = new Uint8Array(buffer)
  return bytes[0] === 0x25 && bytes[1] === 0x50 && bytes[2] === 0x44 && bytes[3] === 0x46 && bytes[4] === 0x2d
}

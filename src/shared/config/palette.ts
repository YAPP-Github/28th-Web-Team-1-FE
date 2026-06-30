export const CUSTOM_SHADE = [0, 5, 10, 20, 30, 40, 50, 60, 70, 80, 90, 95, 100] as const
export const CUSTOM_COLOR_NAMES = ['red', 'yellow', 'green', 'gray', 'primary'] as const

export type CustomColorShade = (typeof CUSTOM_SHADE)[number]
export type CustomColorName = (typeof CUSTOM_COLOR_NAMES)[number]
export type CustomColor = `${CustomColorName}-${CustomColorShade}`

export const CUSTOM_COLORS: CustomColor[] = CUSTOM_COLOR_NAMES.flatMap((n) => CUSTOM_SHADE.map((s) => `${n}-${s}` as CustomColor)).sort((a, b) => a.localeCompare(b, undefined, { numeric: true }))

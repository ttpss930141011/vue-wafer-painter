import type { Coords } from './types'

export interface WafermapProps {
  coords: Coords[]
  width: number
  height: number
  grid: boolean
  notch: 'top' | 'bottom' | 'left' | 'right' | 'none'
  showFocusTooltip: boolean
  showAxisValues: boolean
  scaleSize: number
  focusBorderColor: string
  focusBorderWidth: number
}

export const wafermapEmits = {
  onDie: (e: MouseEvent) => e instanceof MouseEvent
}

export type WafermapEmits = typeof wafermapEmits

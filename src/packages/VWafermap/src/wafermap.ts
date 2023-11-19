import type { Coords } from './types'

export interface WafermapProps {
  /**
   * The coordinates of the dies to be displayed
   */
  coords: Coords[]
  /**
   * The width of the wafermap
   * @default 500
   */
  width: number
  /**
   * The height of the wafermap
   * @default 500
   */
  height: number
  /**
   * Show the grid on the wafermap
   */
  showGrid: boolean
  /**
   * The notch position of the wafermap
   */
  notch: 'top' | 'bottom' | 'left' | 'right' | 'none'
  /**
   * Show the focus  on the wafermap
   */
  showFocus: boolean
  /**
   * Show the tooltip on the wafermap
   */
  showTooltip: boolean
  /**
   * Show the axis values on the wafermap
   */
  showAxisValues: boolean
  /**
   * Show the die info on the wafermap
   */
  showDieInfo: boolean
  /**
   * The scale size between the wafermap and waferbackground
   */
  scaleSize: number
  /**
   * The border color of the focus
   */
  focusBorderColor: string
  /**
   * The border width of the focus
   */
  focusBorderWidth: number
}

export type WafermapEmits = {
  (e: 'onDie', event: MouseEvent, dieInfo: Coords): void
}

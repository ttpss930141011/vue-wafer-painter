import type { Coords } from './types'

export interface WafermapProps {
  /**
   * The coordinates of the dies to be displayed
   * @requires
   */
  coords?: Coords[]
  /**
   * The width of the wafermap
   * @default 500
   */
  width?: number
  /**
   * The height of the wafermap
   * @default 500
   */
  height?: number
  /**
   * The font family of axis values and die info on the wafermap
   * @default 'Arial, Helvetica, sans-serif'
   */
  fontFamily?: string
  /**
   * The notch position of the wafermap
   * @default 'top'
   */
  notch?: 'top' | 'bottom' | 'left' | 'right' | 'none'
  /**
   * Show the grid on the wafermap
   * @default true
   */
  showGrid?: boolean
  /**
   * The grid color of the wafermap
   * @default '#f2f2f2'
   */
  gridColor?: string
  /**
   * Show the background on the wafermap
   * @default true
   */
  showBackground?: boolean
  /**
   * The background color of the wafermap
   * @default '#C0C0C0'
   */
  backgroundColor?: string
  /**
   * Show the focus  on the wafermap
   * @default true
   */
  showFocus?: boolean
  /**
   * Show the tooltip on the wafermap
   * @default true
   */
  showTooltip?: boolean
  /**
   * Show the axis values on the wafermap
   * @default true
   */
  showAxisValues?: boolean
  /**
   * Show the die info on the wafermap
   * @default true
   */
  showDieInfo?: boolean
  /**
   * The die info color of the wafermap
   * @default '#000000'
   */
  dieinfoColor?: string
  /**
   * The scale size between the wafermap and waferbackground
   * @default 0.7
   */
  scaleSize?: number
  /**
   * The border color of the focus
   * @default '#0000ff'
   */
  focusBorderColor?: string
  /**
   * The border width of the focus
   * @default 1
   */
  focusBorderWidth?: number
}

export type WafermapEmits = {
  (e: 'onDie', event: MouseEvent, dieInfo: Coords): void
}

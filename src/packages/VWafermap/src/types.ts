export interface Coords {
  info: string
  x: number
  y: number
  color: string
}

export interface WafermapProps {
  width: number
  height: number
  grid: 'On' | 'Off'
  notch: 'Top' | 'Bottom' | 'Left' | 'Right'
  enableDrawLine: boolean
  scaleSize: number
}

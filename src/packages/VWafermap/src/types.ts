export interface Coords {
  info: Array<string>
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

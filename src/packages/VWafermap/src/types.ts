export interface Coords {
  info: Array<string>
  x: number
  y: number
  dut: number
  color: string
}

export interface WafermapProps {
  coords: Coords[]
  width: number
  height: number
  grid: 'On' | 'Off'
  notch: 'Top' | 'Bottom' | 'Left' | 'Right'
  enableDrawLine: boolean
  scaleSize: number
  focusBorderColor: string
  focusBorderWidth: number
}

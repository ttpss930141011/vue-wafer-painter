export interface Coords {
  info: Array<string>
  x: number
  y: number
  dut: number
  color: string
}

export interface OnDieInfo {
  x: number | undefined
  y: number | undefined
  dut: number | undefined
  info: string | undefined
}

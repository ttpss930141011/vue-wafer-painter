import { expect, test, it } from 'vitest'
import { useMapinfo } from '../src/use-mapinfo'
import { Coords } from '../src/types'
import { WafermapProps } from '../src/wafermap'
import { xAsixTextRowCount, yAsixTextColCount } from '../src/constants'

test('useCounter', () => {
  it('should be 0 by props.coords.length is 0', () => {
    const props = {
      coords: [],
      width: 0,
      height: 0,
      showGrid: false,
      notch: 'none',
      showFocus: false,
      showTooltip: false,
      showDieInfo: false,
      showAxisValues: false,
      scaleSize: 0,
      focusBorderColor: '',
      focusBorderWidth: 0
    } as WafermapProps

    const {
      minX,
      minY,
      maxX,
      maxY,
      dieWidth,
      dieHeight,
      mapPaddingLeft,
      mapPaddingTop,
      gridFontSize
    } = useMapinfo(props)

    expect(minX.value).toBe(0)
    expect(minY.value).toBe(0)
    expect(maxX.value).toBe(0)
    expect(maxY.value).toBe(0)
    expect(dieWidth.value).toBe(0)
    expect(dieHeight.value).toBe(0)
    expect(mapPaddingLeft.value).toBe(0)
    expect(mapPaddingTop.value).toBe(0)
    expect(gridFontSize.value).toBe(0)
  })

  it('should calculate correctly minX, minY, maxX, maxY', () => {
    const props = {
      coords: [
        { x: 0, y: 0, dut: 0, info: ['2'] },
        { x: 1, y: 1, dut: 1, info: ['2'] },
        { x: 2, y: 2, dut: 2, info: ['2'] }
      ] as Coords[],
      width: 0,
      height: 0,
      showGrid: false,
      notch: 'none',
      showFocus: false,
      showTooltip: false,
      showDieInfo: false,
      showAxisValues: false,
      scaleSize: 0,
      focusBorderColor: '',
      focusBorderWidth: 0
    } as WafermapProps

    const { minX, minY, maxX, maxY } = useMapinfo(props)

    expect(minX.value).toBe(0)
    expect(minY.value).toBe(0)
    expect(maxX.value).toBe(2)
    expect(maxY.value).toBe(2)
  })

  it('should calculate correctly dieWidth, dieHeight', () => {
    const props = {
      coords: [
        { x: 0, y: 0, dut: 0, info: ['2'] },
        { x: 1, y: 1, dut: 1, info: ['2'] },
        { x: 2, y: 2, dut: 2, info: ['2'] }
      ] as Coords[],
      width: 100,
      height: 100,
      showGrid: false,
      notch: 'none',
      showFocus: false,
      showTooltip: false,
      showDieInfo: false,
      showAxisValues: false,
      scaleSize: 1,
      focusBorderColor: '',
      focusBorderWidth: 0
    } as WafermapProps

    const { dieWidth, dieHeight } = useMapinfo(props)

    expect(dieWidth.value).toBe((100 * 1) / (2 + yAsixTextColCount + 1))
    expect(dieHeight.value).toBe((100 * 1) / (2 + xAsixTextRowCount + 1))
  })

  it('should calculate correctly mapPaddingLeft, mapPaddingTop', () => {
    const props = {
      coords: [
        { x: 0, y: 0, dut: 0, info: ['2'] },
        { x: 1, y: 1, dut: 1, info: ['2'] },
        { x: 2, y: 2, dut: 2, info: ['2'] }
      ] as Coords[],
      width: 100,
      height: 100,
      showGrid: false,
      notch: 'none',
      showFocus: false,
      showTooltip: false,
      showDieInfo: false,
      showAxisValues: false,
      scaleSize: 1,
      focusBorderColor: '',
      focusBorderWidth: 0
    } as WafermapProps

    const { mapPaddingLeft, mapPaddingTop } = useMapinfo(props)

    expect(mapPaddingLeft.value).toBe((props.width - props.width * props.scaleSize) / 2)
    expect(mapPaddingTop.value).toBe((props.height - props.height * props.scaleSize) / 2)
  })

  it('should calculate correctly gridFontSize', () => {
    const props = {
      coords: [
        { x: 0, y: 0, dut: 0, info: ['2'] },
        { x: 1, y: 1, dut: 1, info: ['2'] },
        { x: 2, y: 2, dut: 2, info: ['2'] }
      ] as Coords[],
      width: 100,
      height: 100,
      showGrid: false,
      notch: 'none',
      showFocus: false,
      showTooltip: false,
      showDieInfo: false,
      showAxisValues: false,
      scaleSize: 1,
      focusBorderColor: '',
      focusBorderWidth: 0
    } as WafermapProps

    const { gridFontSize } = useMapinfo(props)

    expect(gridFontSize.value).toBe(
      Math.min((100 * 1) / (2 + yAsixTextColCount + 1), (100 * 1) / (2 + xAsixTextRowCount + 1)) /
        String(2).length
    )
  })
})

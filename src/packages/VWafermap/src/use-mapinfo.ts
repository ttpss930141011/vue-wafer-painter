import { computed } from 'vue'
import type { WafermapProps } from './wafermap'
import { xAsixTextRowCount, yAsixTextColCount } from './constants'
import _ from 'lodash'

export const useMapinfo = (props: Required<WafermapProps>) => {
  const minX = computed(() => {
    const xCoords = props.coords.map((item) => item.x)
    return _.min(xCoords) ?? 0
  })

  const minY = computed(() => {
    const yCoords = props.coords.map((item) => item.y)
    return _.min(yCoords) ?? 0
  })

  const maxX = computed(() => {
    const xCoords = props.coords.map((item) => item.x)
    return _.max(xCoords) ?? 0
  })

  const maxY = computed(() => {
    const yCoords = props.coords.map((item) => item.y)
    return _.max(yCoords) ?? 0
  })
  const dieWidth = computed(
    () => (props.width * props.scaleSize) / (maxX.value - minX.value + yAsixTextColCount + 1)
  )
  const dieHeight = computed(
    () => (props.height * props.scaleSize) / (maxY.value - minY.value + xAsixTextRowCount + 1)
  )
  const mapPaddingLeft = computed(() => (props.width - props.width * props.scaleSize) / 2)
  const mapPaddingTop = computed(() => (props.height - props.height * props.scaleSize) / 2)

  const gridFontSize = computed(() => {
    const maxXY = Math.max(maxX.value, maxY.value)
    const minDieHW = Math.min(dieWidth.value, dieHeight.value)
    const gridFontSize = minDieHW / String(maxXY).length
    return gridFontSize
  })

  return {
    minX,
    minY,
    maxX,
    maxY,
    dieWidth,
    dieHeight,
    mapPaddingLeft,
    mapPaddingTop,
    gridFontSize
  }
}

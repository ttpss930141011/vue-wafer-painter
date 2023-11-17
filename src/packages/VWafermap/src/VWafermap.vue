<template>
  <div ref="waferMapContainer" class="vwp-container">
    <canvas
      ref="waferBg"
      class="vwp-background"
      :width="props.width"
      :height="props.height"
      :style="bgStyle"
    ></canvas>

    <canvas
      ref="waferMap"
      class="vwp-wafermap"
      :width="props.width * props.scaleSize + canvasLineSpace"
      :height="props.height * props.scaleSize + canvasLineSpace"
      :style="mapStyle"
    ></canvas>
    <canvas
      ref="waferInfo"
      class="vwp-waferinfo"
      :width="props.width * props.scaleSize + canvasLineSpace"
      :height="props.height * props.scaleSize + canvasLineSpace"
      :style="infoStyle"
    ></canvas>
    <canvas
      ref="waferGrid"
      class="vwp-grid"
      :width="props.width * props.scaleSize + canvasLineSpace"
      :height="props.height * props.scaleSize + canvasLineSpace"
      :style="gridStyle"
    ></canvas>
    <canvas
      ref="waferAxisValues"
      class="vwp-axis-values"
      :width="props.width * props.scaleSize + canvasLineSpace"
      :height="props.height * props.scaleSize + canvasLineSpace"
      :style="axisValueStyle"
    ></canvas>
    <div ref="waferFocus" class="vwp-focus" :style="focusStyle"></div>
    <div ref="focusTooltip" class="vwp-tooltip" :style="floatingStyles">
      <p>({{ onDieInfo.x }},{{ onDieInfo.y }})</p>
      <p>Info: {{ onDieInfo.info }}</p>
      <p>Dut: {{ onDieInfo.dut }}</p>
    </div>
  </div>
</template>
<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, reactive, ref } from 'vue'
import type { Coords, WafermapProps } from './types'
import { useFloating, flip, offset, shift } from '@floating-ui/vue'
import _ from 'lodash'

const waferFocus = ref<HTMLElement | null>(null)
const focusTooltip = ref<HTMLElement | null>(null)
const waferMapContainer = ref<HTMLElement | null>(null)
const waferBg = ref<HTMLCanvasElement | null>(null)
const waferMap = ref<HTMLCanvasElement | null>(null)
const waferInfo = ref<HTMLCanvasElement | null>(null)
const waferGrid = ref<HTMLCanvasElement | null>(null)
const waferAxisValues = ref<HTMLCanvasElement | null>(null)

const props = withDefaults(defineProps<WafermapProps>(), {
  coords: () => [],
  width: 500,
  height: 500,
  grid: 'On',
  notch: 'Top',
  enableDrawLine: true,
  scaleSize: 0.7,
  focusBorderColor: 'blue',
  focusBorderWidth: 1
})

const xAsixTextRowCount = 1
const yAsixTextColCount = 1
const canvasLineSpace = 1

// 當 width 或 height 改變，waferBg.height 與 waferBg.width 也會跟著改變

const bgStyle = computed(() => ({
  height: `${props.height}px`,
  width: `${props.width}px`
}))

const mapStyle = computed(() => ({
  height: `${props.height * props.scaleSize + canvasLineSpace}px`,
  width: `${props.width * props.scaleSize + canvasLineSpace}px`,
  paddingTop: `${mapPaddingTop.value}px`,
  paddingRight: '0px',
  paddingBottom: '0px',
  paddingLeft: `${mapPaddingLeft.value}px`
}))

const infoStyle = computed(() => ({
  height: `${props.height * props.scaleSize + canvasLineSpace}px`,
  width: `${props.width * props.scaleSize + canvasLineSpace}px`,
  paddingTop: `${mapPaddingTop.value}px`,
  paddingRight: '0px',
  paddingBottom: '0px',
  paddingLeft: `${mapPaddingLeft.value}px`
}))

const gridStyle = computed(() => ({
  height: `${props.height * props.scaleSize + canvasLineSpace}px`,
  width: `${props.width * props.scaleSize + canvasLineSpace}px`,
  paddingTop: `${mapPaddingTop.value}px`,
  paddingRight: '0px',
  paddingBottom: '0px',
  paddingLeft: `${mapPaddingLeft.value}px`
}))

const axisValueStyle = computed(() => ({
  height: `${props.height * props.scaleSize + canvasLineSpace}px`,
  width: `${props.width * props.scaleSize + canvasLineSpace}px`,
  paddingTop: `${mapPaddingTop.value}px`,
  paddingRight: '0px',
  paddingBottom: '0px',
  paddingLeft: `${mapPaddingLeft.value}px`
}))

const focusStyle = computed(() => ({
  height: `${dieHeight.value - props.focusBorderWidth}px`,
  width: `${dieWidth.value - props.focusBorderWidth}px`,
  border: `${props.focusBorderWidth}px solid ${props.focusBorderColor}`
}))

const mapPaddingLeft = computed(() => (props.width - props.width * props.scaleSize) / 2)
const mapPaddingTop = computed(() => (props.height - props.height * props.scaleSize) / 2)

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

const gridFontSize = computed(() => {
  const maxXY = Math.max(maxX.value, maxY.value)
  const minDieHW = Math.min(dieWidth.value, dieHeight.value)
  const gridFontSize = minDieHW / String(maxXY).length
  return gridFontSize
})

const onDieInfo = reactive<{
  x: number | null
  y: number | null
  dut: number | null
  info: string | null
}>({
  x: null,
  y: null,
  dut: null,
  info: null
})

const { floatingStyles, update: tooltipUpdate } = useFloating(waferFocus, focusTooltip, {
  middleware: [offset(10), flip(), shift({ padding: 5 })]
})

/**
 * Draws the background of the canvas.
 *
 * @return {void} This function does not return any value.
 */
const drawBackgroupd = () => {
  const ctx = waferBg.value?.getContext('2d')
  if (!ctx) return
  ctx.clearRect(0, 0, props.width, props.height)
  const centX = props.width / 2 //center X
  const centY = props.height / 2 //center Y
  ctx.fillStyle = '#C0C0C0'
  ctx.beginPath()
  ctx.arc(centX, centY, centY, 0, 2 * Math.PI)
  ctx.fill()

  ctx.beginPath()
  let notchX = 0
  let notchY = 0
  let notchWidth = 0
  let notchHeight = 0
  let notchScale = 0.1
  if (props.notch == 'Top') {
    notchHeight = props.height * notchScale
    notchWidth = props.width
  } else if (props.notch == 'Right') {
    notchWidth = props.width * notchScale
    notchX = props.width - notchWidth
    notchHeight = props.height
  } else if (props.notch == 'Bottom') {
    notchHeight = props.height * notchScale
    notchY = props.height - notchHeight
    notchWidth = props.width
  } else if (props.notch == 'Left') {
    notchWidth = props.width * notchScale
    notchHeight = props.height
  }
  //draw notch
  ctx.fillStyle = '#ffffff'
  ctx.fillRect(notchX, notchY, notchWidth, notchHeight)
  ctx.fill()
}

/**
 * Draws filled rectangles on the canvas.
 *
 * @return {void} The function does not return a value.
 */
const drawFillRect = () => {
  const ctx = waferMap.value?.getContext('2d')
  if (!ctx) return
  ctx.clearRect(0, 0, props.width, props.height)

  for (const coord of props.coords) {
    ctx.fillStyle = coord.color
    ctx.fillRect(
      (coord.x - minX.value + yAsixTextColCount) * dieWidth.value,
      (coord.y - minY.value + xAsixTextRowCount) * dieHeight.value,
      dieWidth.value,
      dieHeight.value
    )
  }
}

/**
 * Draws a grid on the canvas.
 *
 * @return {void} No return value.
 */
const drawGrid = () => {
  const ctx = waferGrid.value?.getContext('2d')
  if (!ctx) return
  ctx.clearRect(0, 0, props.width, props.height)
  ctx.beginPath()
  ctx.strokeStyle = 'rgb(242,242,242)'
  ctx.lineWidth = 1
  ctx.font = `${gridFontSize.value}px Arial`

  //vertical line
  for (let x = yAsixTextColCount; x <= maxX.value - minX.value + yAsixTextColCount + 1; x++) {
    console.log(x, minX.value)
    const xFixedPos = Math.floor(x * dieWidth.value) + 0.5
    ctx.moveTo(xFixedPos, dieHeight.value)
    ctx.lineTo(xFixedPos, (maxY.value - minX.value + xAsixTextRowCount + 1) * dieHeight.value)
    ctx.stroke()
  }

  //horizontal line
  for (let y = xAsixTextRowCount; y <= maxY.value - minY.value + xAsixTextRowCount + 1; y++) {
    const yfixedPos = Math.floor(y * dieHeight.value) + 0.5
    ctx.moveTo(dieWidth.value, yfixedPos)
    ctx.lineTo((maxX.value - minX.value + yAsixTextColCount + 1) * dieWidth.value, yfixedPos)
    ctx.stroke()
  }
}

/**
 * Draws the axis values on the canvas.
 *
 * @return {void}
 */
const drawAxisValues = () => {
  const ctx = waferAxisValues.value?.getContext('2d')
  if (!ctx) return
  ctx.clearRect(0, 0, props.width, props.height)
  ctx.beginPath()
  ctx.strokeStyle = 'rgb(242,242,242)'
  ctx.lineWidth = 1

  ctx.font = `${gridFontSize.value}px Arial`
  // horizontal line
  for (let x = yAsixTextColCount; x <= maxX.value - minX.value + yAsixTextColCount; x++) {
    const offsetWidth = (dieWidth.value - ctx.measureText(String(x - yAsixTextColCount)).width) / 2

    ctx.fillText(
      String(minX.value + x - yAsixTextColCount),
      x * dieWidth.value + offsetWidth,
      (gridFontSize.value + dieHeight.value) / 2,
      dieWidth.value
    )
  }

  // vertical line
  for (let y = xAsixTextRowCount; y <= maxY.value - minY.value + xAsixTextRowCount; y++) {
    ctx.fillText(
      String(minY.value + y - xAsixTextRowCount),
      0,
      y * dieHeight.value + (gridFontSize.value + dieHeight.value) / 2
    )
  }
}
/**
 * Calculates the font size and offset values for rendering text in a canvas context.
 *
 * @param {Coords['info']} info - The info array containing the text strings.
 * @return {Object} An object containing the calculated font size, offset width, and offset height.
 */
const getDieTextInfo = (info: Coords['info']) => {
  const ctx = waferInfo.value?.getContext('2d')
  if (!ctx) return

  let fontSize = dieWidth.value > dieHeight.value ? dieHeight.value * 0.5 : dieWidth.value * 0.5
  const longestString = info.reduce((a, b) => (a.length > b.length ? a : b), '')
  ctx.font = `${fontSize}px Arial`

  while (ctx.measureText(longestString).width > dieWidth.value) {
    //去計算他會不會超出邊界，會的話就fontsize--
    fontSize -= 0.5
    ctx.font = `${fontSize}px Arial`
  }
  while (info.length * fontSize > dieHeight.value) {
    //因為要上下擺放，所以要計算疊起來會不會超過邊界，會的話也fontsize--
    fontSize -= 0.5
    ctx.font = `${fontSize}px Arial`
  }

  const textWidth = ctx.measureText(longestString).width
  const textHeight = fontSize * info.length
  const offsetWidth = (dieWidth.value - textWidth) / 2
  const offsetHeight = (dieHeight.value - textHeight) / 2

  //第零個參數是font size給外面的接，第一個是width偏移值，第二個是height偏移值
  return {
    fontSize,
    offsetWidth,
    offsetHeight
  }
}
/**
 * Draws filled text on the canvas.
 *
 * @return {void}
 */
const drawFillText = () => {
  const ctx = waferInfo.value?.getContext('2d')
  if (!ctx) return
  ctx.fillStyle = 'black'
  for (const coord of props.coords) {
    const dieTextInfo = getDieTextInfo(coord.info)
    if (!dieTextInfo) return
    const { fontSize, offsetWidth, offsetHeight } = dieTextInfo
    ctx.font = `${fontSize}px Arial`
    if (coord.info.length > 1) {
      //bin值1個以上需要斷行處理
      coord.info.forEach((info, index) => {
        ctx.fillText(
          info,
          (coord.x - minX.value + yAsixTextColCount) * dieWidth.value + offsetWidth,
          (coord.y - minY.value + xAsixTextRowCount) * dieHeight.value +
            offsetHeight +
            (index + 1) * fontSize
        )
      })
    } else {
      //bin值只有一個就不需要斷行
      const info = coord.info[0]
      ctx.fillText(
        info,
        (coord.x - minX.value + yAsixTextColCount) * dieWidth.value + offsetWidth,
        (coord.y - minY.value + xAsixTextRowCount) * dieHeight.value +
          (fontSize + dieHeight.value) / 2
      )
    }
  }
}

const onDieInfoEvent = _.throttle((dieInfo: Coords) => {
  onDieInfo.x = dieInfo.x
  onDieInfo.y = dieInfo.y
  onDieInfo.info = dieInfo.info.map((item) => item).join(',')
  onDieInfo.dut = dieInfo.dut
  tooltipUpdate()
}, 60)

const getDieInfo = (dieX: number, dieY: number) =>
  props.coords.find((coord) => coord.x == dieX && coord.y == dieY)

const setFocueMoveEvent = (e: MouseEvent) => {
  const mouseX = e.offsetX - canvasLineSpace
  const mouseY = e.offsetY - canvasLineSpace
  const onDieX =
    Math.floor((mouseX - mapPaddingLeft.value) / dieWidth.value) + minX.value - yAsixTextColCount
  const onDieY =
    Math.floor((mouseY - mapPaddingTop.value) / dieHeight.value) + minY.value - xAsixTextRowCount
  const dieInfo = getDieInfo(onDieX, onDieY)
  if (!dieInfo || !waferFocus.value) return

  const posTop = (onDieY - minX.value + xAsixTextRowCount) * dieHeight.value + mapPaddingTop.value
  const posLeft = (onDieX - minY.value + yAsixTextColCount) * dieWidth.value + mapPaddingLeft.value
  waferFocus.value.style.top = posTop + 'px'
  waferFocus.value.style.left = posLeft + 'px'

  onDieInfoEvent(dieInfo)
}
onMounted(() => {
  waferAxisValues.value?.addEventListener('mousemove', setFocueMoveEvent, false)
  drawBackgroupd()
  drawFillRect()
  drawFillText()
  drawAxisValues()
  drawGrid()
})

onBeforeUnmount(() => {
  waferAxisValues.value?.removeEventListener('mousemove', setFocueMoveEvent, false)
})
</script>

<style scoped>
.vwp-container {
  width: fit-content;
  height: fit-content;
  position: relative;

  .vwp-background,
  .vwp-wafermap,
  .vwp-waferinfo,
  .vwp-grid,
  .vwp-axis-values {
    position: absolute;
    overflow-x: hidden;
  }

  .vwp-focus {
    position: relative;
    overflow-x: hidden;
    top: 0;
    left: 0;
  }

  .vwp-tooltip {
    font-family: Arial, Helvetica, sans-serif;
    width: max-content;
    position: absolute;
    top: 0;
    left: 0;
    background: #ffecbe;
    color: rgb(0, 0, 0);
    font-weight: bold;
    padding: 5px;
    border-radius: 4px;
  }
}
</style>

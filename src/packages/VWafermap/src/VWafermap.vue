<template>
  <div id="wafermap-container">
    <div ref="waferMapContainer" class="vwp-container">
      <canvas
        ref="waferBg"
        class="vwp-background"
        :width="mapInfo.width"
        :height="mapInfo.height"
        :style="bgStyle"
      ></canvas>

      <!-- <canvas ref="waferMap" class="vwp-wafermap" :style="mapStyle"></canvas>
      <canvas ref="waferGrid" class="vwp-grid" :style="gridStyle"></canvas> -->
      <div ref="waferFocus" class="vwp-focus" :style="focusStyle"></div>
      <div ref="focusPopper" :style="floatingStyles">
        <p>({{ onDieInfo.x }},{{ onDieInfo.y }})</p>
        <p>Bin: {{ onDieInfo.bin }}</p>
        <p>Site: {{ onDieInfo.site }}</p>
        <div ref="popperArrow" data-popper-arrow></div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, reactive, ref } from 'vue'
import type { Coords, WafermapProps } from './types'
import { useFloating, offset } from '@floating-ui/vue'
import _ from 'lodash'

const waferFocus = ref<Element | null>(null)
const focusPopper = ref<HTMLElement | null>(null)
const popperArrow = ref<HTMLElement | null>(null)
const waferMapContainer = ref<HTMLElement | null>(null)
const waferBg = ref<HTMLCanvasElement | null>(null)
const waferMap = ref<HTMLCanvasElement | null>(null)
const waferGrid = ref<HTMLCanvasElement | null>(null)

const { coords } = defineProps({
  coords: {
    type: Array<Coords>,
    default: () => []
  }
})

const mapInfo = reactive<WafermapProps>({
  width: 500,
  height: 500,
  grid: 'On',
  notch: 'Top',
  enableDrawLine: true,
  scaleSize: 0.9
})

// 當 width 或 height 改變，waferBg.height 與 waferBg.width 也會跟著改變

const bgStyle = computed(() => ({
  height: `${mapInfo.height}px`,
  width: `${mapInfo.width}px`
}))

const mapStyle = computed(() => ({
  height: `${mapInfo.height * mapInfo.scaleSize}px`,
  width: `${mapInfo.width * mapInfo.scaleSize}px`,
  paddingTop: `${mapPosOffsetY.value}px`,
  paddingRight: '0px',
  paddingBottom: '0px',
  paddingLeft: `${mapPosOffsetX.value}px`
}))

const gridStyle = computed(() => ({
  height: `${mapInfo.height * mapInfo.scaleSize}px`,
  width: `${mapInfo.width * mapInfo.scaleSize}px`,
  paddingTop: `${mapPosOffsetY.value}px`,
  paddingRight: '0px',
  paddingBottom: '0px',
  paddingLeft: `${mapPosOffsetX.value}px`
}))

const focusStyle = computed(() => ({
  height: `${dieHeight.value}px`,
  width: `${dieWidth.value}px`,
  top: `${mapPosOffsetY.value}px`,
  left: `${mapPosOffsetX.value}px`
}))

const mapPosOffsetX = computed(() => (mapInfo.width - mapInfo.width * mapInfo.scaleSize) / 2)
const mapPosOffsetY = computed(() => (mapInfo.height - mapInfo.height * mapInfo.scaleSize) / 2)

const offsetValueX = computed(() => {
  const xCoords = coords.map((item) => item.x)
  return _.min(xCoords) ?? 0
})
const offsetValueY = computed(() => {
  const yCoords = coords.map((item) => item.y)
  return _.min(yCoords) ?? 0
})

const maxX = computed(() => {
  const xCoords = coords.map((item) => item.x)
  const maxXCoord = _.max(xCoords) ?? 0
  return maxXCoord + 2 - offsetValueX.value ?? 0
})

const maxY = computed(() => {
  const yCoords = coords.map((item) => item.y)
  const maxYCoord = _.max(yCoords) ?? 0
  return maxYCoord + 2 - offsetValueY.value ?? 0
})

const dieWidth = computed(() => (mapInfo.width / maxX.value) * mapInfo.scaleSize)
const dieHeight = computed(() => (mapInfo.height / maxY.value) * mapInfo.scaleSize)

const onDieInfo = reactive({
  x: null,
  y: null,
  bin: null,
  site: null
})

const { floatingStyles } = useFloating(waferFocus, focusPopper, {
  placement: 'right',
  middleware: [offset(10)]
})

const drawBackgroupd = () => {
  const ctx = waferBg.value?.getContext('2d')
  if (!ctx) return
  ctx.clearRect(0, 0, mapInfo.width, mapInfo.height)
  const centX = mapInfo.width / 2 //center X
  const centY = mapInfo.height / 2 //center Y
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
  if (mapInfo.notch == 'Top') {
    notchHeight = mapInfo.height * notchScale
    notchWidth = mapInfo.width
  } else if (mapInfo.notch == 'Right') {
    notchWidth = mapInfo.width * notchScale
    notchX = mapInfo.width - notchWidth
    notchHeight = mapInfo.height
  } else if (mapInfo.notch == 'Bottom') {
    notchHeight = mapInfo.height * notchScale
    notchY = mapInfo.height - notchHeight
    notchWidth = mapInfo.width
  } else if (mapInfo.notch == 'Left') {
    notchWidth = mapInfo.width * notchScale
    notchHeight = mapInfo.height
  }
  //draw notch
  ctx.fillStyle = '#ffffff'
  ctx.fillRect(notchX, notchY, notchWidth, notchHeight)
  ctx.fill()
}

const setFocueMoveEvent = (e: any) => {
  console.log(e)
}
onMounted(() => {
  waferGrid.value?.addEventListener('mousemove', setFocueMoveEvent, false)
  drawBackgroupd()
})

onBeforeUnmount(() => {
  waferGrid.value?.removeEventListener('mousemove', setFocueMoveEvent, false)
})
</script>
<style scoped>
#wafermap-container {
  position: relative;
  overflow: scroll;
  background-color: #ffffff;
}
.vwp-container {
  width: 1000px;
  height: 1000px;
  position: relative;
}
.vwp-background {
  position: absolute;
  overflow-x: hidden;
}
.vwp-wafermap {
  position: absolute;
  overflow-x: hidden;
}
.vwp-focus {
  position: relative;
  overflow-x: hidden;
  border: 2px solid blue;
}
.vwp-grid {
  position: absolute;
  overflow-x: hidden;
}
</style>

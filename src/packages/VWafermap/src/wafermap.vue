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
      v-if="props.grid === true"
      ref="waferGrid"
      class="vwp-grid"
      :width="props.width * props.scaleSize + canvasLineSpace"
      :height="props.height * props.scaleSize + canvasLineSpace"
      :style="gridStyle"
    ></canvas>
    <canvas
      v-if="props.showAxisValues === true"
      ref="waferAxisValues"
      class="vwp-axis-values"
      :width="props.width * props.scaleSize + canvasLineSpace"
      :height="props.height * props.scaleSize + canvasLineSpace"
      :style="axisValueStyle"
    ></canvas>
    <div ref="waferFocus" class="vwp-focus" :style="focusStyle"></div>
    <div
      v-if="
        onDieInfo.x !== undefined && onDieInfo.y !== undefined && props.showFocusTooltip === true
      "
      ref="focusTooltip"
      class="vwp-tooltip"
      :style="tooltipStyle"
    >
      <p>({{ onDieInfo.x }},{{ onDieInfo.y }})</p>
      <p>Info: {{ onDieInfo.info }}</p>
      <p>Dut: {{ onDieInfo.dut }}</p>
    </div>
  </div>
</template>
<script setup lang="ts">
import type { WafermapProps } from './wafermap'
import { canvasLineSpace } from './constants'
import { useWafer } from './use-wafermap'

const props = withDefaults(defineProps<WafermapProps>(), {
  coords: () => [],
  width: 500,
  height: 500,
  grid: true,
  notch: 'top',
  showFocusTooltip: true,
  showAxisValues: true,
  scaleSize: 0.7,
  focusBorderColor: 'blue',
  focusBorderWidth: 1
})

const emit = defineEmits(['onDie'])

const { _ref, _style, _data } = useWafer(props, emit)

const { onDieInfo } = _data

const {
  waferMapContainer,
  waferBg,
  waferMap,
  waferInfo,
  waferGrid,
  waferAxisValues,
  waferFocus,
  focusTooltip
} = _ref

const { bgStyle, mapStyle, infoStyle, gridStyle, axisValueStyle, focusStyle, tooltipStyle } = _style

defineExpose({
  /** @description  The current wafermap props */
  props,
  /** @description  The current die info */
  onDieInfo
})
</script>

<style scoped>
.vwp-container {
  width: fit-content;
  height: fit-content;
  position: relative;

  .vwp-background,
  .vwp-waferinfo,
  .vwp-grid,
  .vwp-axis-values {
    position: absolute;
    overflow-x: hidden;
    pointer-events: none;
  }
  .vwp-wafermap {
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

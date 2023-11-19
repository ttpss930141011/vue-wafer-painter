import { computed } from 'vue'
import type { WafermapProps } from './wafermap'
import { canvasLineSpace } from './constants'
import { useMapinfo } from './use-mapinfo'

export function useWafermapStyle(props: WafermapProps) {
  const { dieWidth, dieHeight, mapPaddingLeft, mapPaddingTop } = useMapinfo(props)

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

  return {
    bgStyle,
    mapStyle,
    infoStyle,
    gridStyle,
    axisValueStyle,
    focusStyle
  }
}

import _ from 'lodash'
import { onBeforeUnmount, onMounted, reactive, ref, watch, computed } from 'vue'
import { useFloating, flip, offset, shift } from '@floating-ui/vue'
import { canvasLineSpace, xAsixTextRowCount, yAsixTextColCount } from './constants'
import { useMapinfo } from './use-mapinfo'
import { useWafermapStyle } from './wafermap-style'
import type { WafermapEmits, WafermapProps } from './wafermap'
import type { Coords, OnDieInfo } from './types'

export const useWafer = (props: Required<WafermapProps>, emit: WafermapEmits) => {
  const waferFocus = ref<HTMLElement>()
  const focusTooltip = ref<HTMLElement>()
  const waferMapContainer = ref<HTMLElement>()
  const waferBg = ref<HTMLCanvasElement>()
  const waferMap = ref<HTMLCanvasElement>()
  const waferInfo = ref<HTMLCanvasElement>()
  const waferGrid = ref<HTMLCanvasElement>()
  const waferAxisValues = ref<HTMLCanvasElement>()

  const initialOnDieInfo = {
    x: undefined,
    y: undefined,
    dut: undefined,
    info: undefined
  }

  const onDieInfo = reactive<OnDieInfo>({ ...initialOnDieInfo })

  const updateDieInfoOnTooltip = _.throttle((dieInfo: Coords) => {
    onDieInfo.x = dieInfo.x
    onDieInfo.y = dieInfo.y
    onDieInfo.info = dieInfo.info.map((item) => item).join(',')
    onDieInfo.dut = dieInfo.dut
    tooltipUpdate()
  }, 60)

  const updateFocusPosition = (onDieX: number, onDieY: number) => {
    if (!waferFocus.value) return
    const posLeft =
      (onDieX - minX.value + yAsixTextColCount) * dieWidth.value + mapPaddingLeft.value
    const posTop = (onDieY - minY.value + xAsixTextRowCount) * dieHeight.value + mapPaddingTop.value
    waferFocus.value.style.top = posTop + 'px'
    waferFocus.value.style.left = posLeft + 'px'
  }

  const {
    dieWidth,
    dieHeight,
    minX,
    minY,
    maxX,
    maxY,
    gridFontSize,
    mapPaddingLeft,
    mapPaddingTop
  } = useMapinfo(props)

  const { containerStyle, bgStyle, mapStyle, infoStyle, gridStyle, axisValueStyle, _focusStyle } =
    useWafermapStyle(props)

  const focusStyle = computed(() => ({
    ..._focusStyle.value,
    border: props.showFocus ? _focusStyle.value.border : 'transparent',
    display: onDieInfo.x !== undefined && onDieInfo.y !== undefined ? 'block' : 'none'
  }))

  // The third part library floating-ui is used to implement the floating tooltip.
  const { floatingStyles, update: tooltipUpdate } = useFloating(waferFocus, focusTooltip, {
    middleware: [offset(10), flip(), shift({ padding: 5 })]
  })

  const tooltipStyle = computed(() => ({
    ...floatingStyles.value,
    display:
      onDieInfo.x !== undefined && onDieInfo.y !== undefined && props.showTooltip ? 'block' : 'none'
  }))

  const _resetOnDieInfo = () => Object.assign(onDieInfo, initialOnDieInfo)

  const _resetAllCanvas = () => {
    if (
      !waferBg.value ||
      !waferMap.value ||
      !waferInfo.value ||
      !waferGrid.value ||
      !waferAxisValues.value
    )
      return

    const ctxBg = waferBg.value.getContext('2d')
    const ctxMap = waferMap.value.getContext('2d')
    const ctxInfo = waferInfo.value.getContext('2d')
    const ctxGrid = waferGrid.value.getContext('2d')
    const ctxAxisValues = waferAxisValues.value.getContext('2d')

    if (!ctxBg || !ctxMap || !ctxInfo || !ctxGrid || !ctxAxisValues) return

    ctxBg.clearRect(0, 0, props.width, props.height)
    ctxMap.clearRect(0, 0, props.width, props.height)
    ctxInfo.clearRect(0, 0, props.width, props.height)
    ctxGrid.clearRect(0, 0, props.width, props.height)
    ctxAxisValues.clearRect(0, 0, props.width, props.height)
  }

  /**
   * Retrieves information about a die based on its coordinates.
   *
   * @param {number} dieX - The x-coordinate of the die.
   * @param {number} dieY - The y-coordinate of the die.
   * @return {object | undefined} - The die information or undefined if not found.
   */
  const _getDieInfo = (dieX: number, dieY: number) =>
    props.coords.find((coord) => coord.x == dieX && coord.y == dieY)

  const handleFocusEvent = (e: MouseEvent) => {
    const mouseX = e.offsetX - canvasLineSpace
    const mouseY = e.offsetY - canvasLineSpace
    const onDieX =
      Math.floor((mouseX - mapPaddingLeft.value) / dieWidth.value) + minX.value - yAsixTextColCount
    const onDieY =
      Math.floor((mouseY - mapPaddingTop.value) / dieHeight.value) + minY.value - xAsixTextRowCount

    const dieInfo = _getDieInfo(onDieX, onDieY)
    if (!dieInfo || !waferFocus.value) return

    updateFocusPosition(onDieX, onDieY)
    updateDieInfoOnTooltip(dieInfo)
    emit('onDie', e, dieInfo)
  }

  /**
   * Draws the background of the canvas.
   *
   * @return {void} This function does not return any value.
   */
  const drawBackgroupd = () => {
    if (!waferBg.value || !props.showBackground) return

    const ctx = waferBg.value.getContext('2d')
    if (!ctx) return
    const centX = props.width / 2 //center X
    const centY = props.height / 2 //center Y
    const notchScale = 0.1
    let notchX = 0
    let notchY = 0
    let notchWidth = 0
    let notchHeight = 0

    ctx.fillStyle = props.backgroundColor
    ctx.beginPath()
    ctx.arc(centX, centY, centY, 0, 2 * Math.PI)
    ctx.fill()
    ctx.beginPath()

    switch (props.notch) {
      case 'top':
        notchHeight = props.height * notchScale
        notchWidth = props.width
        break
      case 'right':
        notchWidth = props.width * notchScale
        notchX = props.width - notchWidth
        notchHeight = props.height
        break
      case 'bottom':
        notchHeight = props.height * notchScale
        notchY = props.height - notchHeight
        notchWidth = props.width
        break
      case 'left':
        notchWidth = props.width * notchScale
        notchHeight = props.height
        break
      default:
        return
    }

    // Draw notch
    ctx.fillStyle = '#ffffff'
    ctx.fillRect(notchX, notchY, notchWidth, notchHeight)
    ctx.fill()
  }

  const drawNoData = () => {
    if (!waferMap.value) return

    const ctx = waferMap.value.getContext('2d')
    if (!ctx) return

    ctx.fillStyle = '#ffffff'
    ctx.font = `100% ${props.fontFamily}`
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillText('No Data', ctx.canvas.width / 2, ctx.canvas.height / 2)
  }

  /**
   * Draws filled rectangles on the canvas.
   *
   * @return {void} The function does not return a value.
   */
  const drawFillRect = () => {
    if (!waferMap.value) return
    if (props.coords.length === 0) return drawNoData()

    const ctx = waferMap.value.getContext('2d')
    if (!ctx) return

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
    if (!waferGrid.value || !props.showGrid || !props.coords.length) return

    const ctx = waferGrid.value.getContext('2d')
    if (!ctx) return

    ctx.beginPath()
    ctx.strokeStyle = props.gridColor
    ctx.lineWidth = 1
    ctx.font = `${gridFontSize.value}px ${props.fontFamily}`

    //vertical line
    for (let x = 1; x <= maxX.value - minX.value + yAsixTextColCount + 1; x++) {
      const xFixedPos = Math.floor(x * dieWidth.value) + 0.5
      ctx.moveTo(xFixedPos, dieHeight.value)
      ctx.lineTo(xFixedPos, (maxY.value - minY.value + xAsixTextRowCount + 1) * dieHeight.value)
      ctx.stroke()
    }

    //horizontal line
    for (let y = 1; y <= maxY.value - minY.value + xAsixTextRowCount + 1; y++) {
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
    if (!waferAxisValues.value || !props.showAxisValues || !props.coords.length) return

    const ctx = waferAxisValues.value.getContext('2d')
    if (!ctx) return

    ctx.beginPath()
    ctx.font = `${gridFontSize.value}px ${props.fontFamily}`

    // horizontal line
    for (let x = yAsixTextColCount; x <= maxX.value - minX.value + yAsixTextColCount; x++) {
      const offsetWidth =
        (dieWidth.value - ctx.measureText(String(x - yAsixTextColCount)).width) / 2

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
   * @private
   * @param {Coords['info']} info - The info array containing the text strings.
   * @return {Object} An object containing the calculated font size, offset width, and offset height.
   * There are three properties in the returned object:
   * 1. fontSize: The font size.
   * 2. offsetWidth: The offset width.
   * 3. offsetHeight: The offset height.
   *
   * - fontSize: It calculates the font size according to the width and height of the die, and the length of the longest string in the info array.
   * - offsetWidth: It calculates the offset width according to the width of the die and the width of the longest string in the info array.
   * - offsetHeight: It calculates the offset height according to the height of the die and the length of the info array.
   */
  const _getDieTextInfo = (info: Coords['info']) => {
    if (!waferInfo.value) return

    const ctx = waferInfo.value?.getContext('2d')
    if (!ctx) return

    let fontSize = dieWidth.value > dieHeight.value ? dieHeight.value * 0.5 : dieWidth.value * 0.5
    const longestString = info.reduce((a, b) => (a.length > b.length ? a : b), '')
    ctx.font = `${fontSize}px ${props.fontFamily}`

    while (ctx.measureText(longestString).width > dieWidth.value) {
      //Calculate if it's going to go out of bounds, and if so, then fontsize--
      fontSize -= 0.5
      ctx.font = `${fontSize}px ${props.fontFamily}`
    }
    while (info.length * fontSize > dieHeight.value) {
      //Because it has to be placed up and down, so calculate whether the stack will exceed the border, if so, also fontsize--
      fontSize -= 0.5
      ctx.font = `${fontSize}px ${props.fontFamily}`
    }

    const textWidth = ctx.measureText(longestString).width
    const textHeight = fontSize * info.length
    const offsetWidth = (dieWidth.value - textWidth) / 2
    const offsetHeight = (dieHeight.value - textHeight) / 2

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
  const drawDieInfo = () => {
    if (!waferInfo.value || !props.showDieInfo || !props.coords.length) return

    const ctx = waferInfo.value.getContext('2d')
    if (!ctx) return

    ctx.fillStyle = props.dieinfoColor
    console.log('props.dieinfoColor', props.dieinfoColor)

    for (const coord of props.coords) {
      const dieTextInfo = _getDieTextInfo(coord.info)
      if (!dieTextInfo) return

      const { fontSize, offsetWidth, offsetHeight } = dieTextInfo
      ctx.font = `${fontSize}px ${props.fontFamily}`

      if (coord.info.length > 1) {
        //Text line breaking
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
        const [info] = coord.info
        ctx.fillText(
          info,
          (coord.x - minX.value + yAsixTextColCount) * dieWidth.value + offsetWidth,
          (coord.y - minY.value + xAsixTextRowCount) * dieHeight.value +
            (fontSize + dieHeight.value) / 2
        )
      }
    }
  }
  const draw = _.debounce(() => {
    _resetOnDieInfo()
    _resetAllCanvas()
    drawBackgroupd()
    drawFillRect()
    drawDieInfo()
    drawAxisValues()
    drawGrid()
  }, 30)

  watch(
    () => props,
    () => draw(),
    { deep: true, immediate: true }
  )

  onMounted(() => {
    waferMap.value?.addEventListener('mousemove', handleFocusEvent, false)
  })

  onBeforeUnmount(() => {
    waferMap.value?.removeEventListener('mousemove', handleFocusEvent, false)
  })

  return {
    _style: {
      containerStyle,
      bgStyle,
      mapStyle,
      infoStyle,
      gridStyle,
      axisValueStyle,
      focusStyle,
      tooltipStyle
    },
    _ref: {
      waferBg,
      waferMap,
      waferInfo,
      waferGrid,
      waferAxisValues,
      waferFocus,
      waferMapContainer,
      focusTooltip
    },
    _data: {
      onDieInfo,
      dieWidth,
      dieHeight,
      minX,
      minY,
      maxX,
      maxY,
      gridFontSize,
      mapPaddingLeft,
      mapPaddingTop
    }
  }
}

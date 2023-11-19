import type { Meta, StoryObj } from '@storybook/vue3'

import VWafermap from '@/packages/VWafermap/src/wafermap.vue'
import { coords } from './constants'

// More on how to set up stories at: https://storybook.js.org/docs/vue/writing-stories/introduction
const meta = {
  title: 'Example/VWafermap',
  component: VWafermap,
  // This component will have an automatically generated docsPage entry: https://storybook.js.org/docs/vue/writing-docs/autodocs
  tags: ['autodocs'],
  args: {
    width: 500,
    height: 500,
    coords: coords,
    notch: 'top',
    scaleSize: 0.7,
    showDieInfo: true,
    showGrid: true,
    showAxisValues: true,
    showFocus: true,
    showTooltip: true,
    focusBorderWidth: 1,
    focusBorderColor: 'blue'
  },

  argTypes: {
    width: { control: { type: 'range', min: 100, max: 1000, step: 50 } },
    height: { control: { type: 'range', min: 100, max: 1000, step: 50 } },
    notch: { control: 'select', options: ['top', 'bottom', 'left', 'right', 'none'] },
    scaleSize: { control: { type: 'range', min: 0.1, max: 1, step: 0.1 } }
  },
  parameters: {
    // More on how to position stories at: https://storybook.js.org/docs/vue/configure/story-layout
    layout: 'fullscreen'
  }
  // args: { primary: false } // default value
} satisfies Meta<typeof VWafermap>

export default meta
type Story = StoryObj<typeof meta>
/*
 *👇 Render functions are a framework specific feature to allow you control on how the component renders.
 * See https://storybook.js.org/docs/vue/api/csf
 * to learn how to use render functions.
 */
export const Primary: Story = {
  args: {
    coords
  }
}

// export const Secondary: Story = {
//   args: {
//     primary: false,
//     label: 'VWafermap'
//   }
// }

// export const Large: Story = {
//   args: {
//     label: 'VWafermap',
//     size: 'large'
//   }
// }

// export const Small: Story = {
//   args: {
//     label: 'VWafermap',
//     size: 'small'
//   }
// }

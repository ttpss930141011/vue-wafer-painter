# vue-wafer-painter

The wafer component library based on Vue 3 provides a versatile and customizable solution for visualizing wafermaps, commonly used in semiconductor manufacturing.

## Features

- Scalable Canvas: The component utilizes HTML5 canvas elements for rendering, allowing for efficient and scalable display of wafer maps.
- Customization Options: Users can customize various aspects of the wafer map, including dimensions, grid visibility, notch position, and more.
- Interactive Focus: The component includes an interactive focus feature, where users can hover over individual dies to view detailed information.
- Tooltips: Informative tooltips appear when hovering over dies, displaying coordinates, die information, and DUT (Device Under Test) details.
- Axis Values: Optionally, axis values can be displayed on the wafer map, aiding in orientation and die identification.

## Installation

To use this wafermap component, follow these steps:

1. Install the package using your preferred package manager:

   ```bash
   npm install vue-wafer-painter
   ```

2. Import the component into your Vue application:

   ```javascript
   import VWafermap from 'vue-wafer-painter'
   ```

3. Add the VWafermap component to your template:

   ```html
   <template>
     <v-wafermap :width="800" :height="800" />
   </template>
   ```

## Usage

Here's a simple example of using the VWafermap component:

```html
<template>
  <v-wafermap
    :width="800"
    :height="800"
    :showGrid="true"
    :notch="'top'"
    :showTooltip="true"
    :showFocus="true"
    :showAxisValues="true"
    :showDieInfo="true"
    :scaleSize="0.7"
    :focusBorderColor="'blue'"
    :focusBorderWidth="1"
    @onDie="handleDieHover"
  />
</template>

<script>
  import VWafermap from 'vue-wafer-painter'

  export default {
    components: {
      VWafermap
    },
    methods: {
      handleDieHover(event, dieInfo) {
        // Handle the click on a die
        console.log('Hovered on die:', dieInfo)
      }
    }
  }
</script>
```

## Props

- **width** (_Number_): The width of the wafer map.
- **height** (_Number_): The height of the wafer map.
- **showGrid** (_Boolean_): Whether to display grid lines on the wafer map.
- **notch** (_String_): The position of the wafer's notch ('top', 'bottom', 'left', 'right').
- **showTooltip** (_Boolean_): Whether to show tooltips on hover.
- **showFocus** (_Boolean_): Whether to show the focus border on hover.
- **showAxisValues** (_Boolean_): Whether to display axis values.
- **showDieInfo** (_Boolean_): Whether to display die information in the tooltip.
- **scaleSize** (_Number_): The scale factor for the wafer map.
- **focusBorderColor** (_String_): The color of the focus border.
- **focusBorderWidth** (_Number_): The width of the focus border.

## Events

- **onDie** (_Function_): Event emitted when a die is clicked. Provides information about the clicked die.

## License

MIT

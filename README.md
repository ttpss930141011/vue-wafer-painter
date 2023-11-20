<div align="center">
<h1 align="center">
<img src="./public/logo.svg" width="100" />
<br>vue-wafer-painter
</h1>
<h3>◦ Paint your wafer to stunning Vue apps!</h3>

<p align="center">
<img src="https://img.shields.io/badge/Storybook-FF4785.svg?style&logo=Storybook&logoColor=white" alt="Storybook" />
<img src="https://img.shields.io/badge/Prettier-F7B93E.svg?style&logo=Prettier&logoColor=black" alt="Prettier" />
<img src="https://img.shields.io/badge/Canvas-E34F26.svg?style&logo=HTML5&logoColor=white" alt="Canvas" />
<img src="https://img.shields.io/badge/Sass-CC6699.svg?style&logo=Sass&logoColor=white" alt="Sass" />
<img src="https://img.shields.io/badge/Vitest-6E9F18.svg?style&logo=Vitest&logoColor=white" alt="Vitest" />
<img src="https://img.shields.io/badge/Vite-646CFF.svg?style&logo=Vite&logoColor=white" alt="Vite" />
<img src="https://img.shields.io/badge/Vue 3-4FC08D.svg?style&logo=vuedotjs&logoColor=white" alt="Vue.js" />
<img src="https://img.shields.io/badge/ESLint-4B32C3.svg?style&logo=ESLint&logoColor=white" alt="ESLint" />
<img src="https://img.shields.io/badge/Lodash-3492FF.svg?style&logo=Lodash&logoColor=white" alt="Lodash" />
<img src="https://img.shields.io/badge/TypeScript-3178C6.svg?style&logo=TypeScript&logoColor=white" alt="TypeScript" />
</p>
<img src="https://img.shields.io/github/languages/top/ttpss930141011/vue-wafer-painter?style&color=5D6D7E" alt="GitHub top language" />
<img src="https://img.shields.io/github/languages/code-size/ttpss930141011/vue-wafer-painter?style&color=5D6D7E" alt="GitHub code size in bytes" />
<img src="https://img.shields.io/github/commit-activity/m/ttpss930141011/vue-wafer-painter?style&color=5D6D7E" alt="GitHub commit activity" />
<img src="https://img.shields.io/github/license/ttpss930141011/vue-wafer-painter?style&color=5D6D7E" alt="GitHub license" />
</div>

---

## 📍 Overview

The wafer component library based on Vue 3 provides a versatile and customizable solution for visualizing wafermaps, commonly used in semiconductor manufacturing.

## 🎬 Demo

1. [Online Storybook](https://vue-wafer-painter.justinxiao.app/)

2. [Try example in repo](https://github.com/ttpss930141011/vue-wafer-painter/tree/main/example)

3. Local Storybook

   ```bash
    # Clone the repo
    git clone https://github.com/ttpss930141011/vue-wafer-painter.git

    # Install dependencies

    pnpm install

    # Run Storybook

    npm run storybook
   ```

## ⚙️ Features

- Scalable Canvas: The component utilizes HTML5 canvas elements for rendering, allowing for efficient and scalable display of wafer maps.
- Customization Options: Users can customize various aspects of the wafer map, including dimensions, grid visibility, notch position, and more.
- Interactive Focus: The component includes an interactive focus feature, where users can hover over individual dies to view detailed information.

## 🚀 Getting Started

### Installation

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
     <v-wafermap :width="800" :height="800" :coords="[{...your coords}]" />
   </template>
   ```

### Usage

<details closed><summary>VWafermap</summary>

Here's a simple example of Coords data:

```javascript
//src\packages\VWafermap\src\types.ts

export interface Coords {
  info: Array<string>
  x: number
  y: number
  dut: number
  color: string
}

const coords = [
  {
    info: ['1'],
    x: -2,
    y: -2,
    dut: 1,
    color: '#ff8080'
  },
  {
    info: ['2'],
    x: 0,
    y: 1,
    dut: 2,
    color: 'green'
  },
  {
    info: ['4'],
    x: 1,
    y: 0,
    dut: 1,
    color: 'rgb(0, 102, 204)'
  },
  {
    info: ['7', '789'],
    x: 2,
    y: 0,
    dut: 1,
    color: 'red'
  },
  {
    info: ['9'],
    x: 2,
    y: 2,
    dut: 3,
    color: '#b800e6'
  }
]


```

Here's the simplest example of using the VWafermap component:

```html
<template>
  <v-wafermap :coords="coords" @onDie="handleDieHover" />
</template>

<script setup>
  import { ref } from 'vue'
  import VWafermap from 'vue-wafer-painter'

  const coords = ref([
    // many coords
  ])

  const handleDieHover = (event, dieInfo) => {
    // Handle the click on a die
    console.log('Hovered on die:', dieInfo)
  }
</script>
```

</details>

### Props

<details closed><summary>VWafermap</summary>

| Name               | Type                                               | Default                          | Required | Description                                                   |
| ------------------ | -------------------------------------------------- | -------------------------------- | -------- | ------------------------------------------------------------- |
| `coords`           | `Array<Coords>`                                    | `[]`                             | true     | The coordinates of the dies on the wafer map.                 |
| `width`            | `Number`                                           | `500`                            | false    | The width of the wafer map.                                   |
| `height`           | `Number`                                           | `500`                            | false    | The height of the wafer map.                                  |
| `fontFamily`       | `String`                                           | `'Arial, Helvetica, sans-serif'` | false    | The font family of axis values and die info on the wafer map. |
| `notch`            | `'top' \| 'bottom' \| 'left' \| 'right' \| 'none'` | `'top'`                          | false    | The notch position of the wafer map.                          |
| `showGrid`         | `Boolean`                                          | `true`                           | false    | Whether to display grid lines on the wafer map.               |
| `gridColor`        | `String`                                           | `'#f2f2f2'`                      | false    | The grid color of the wafer map.                              |
| `showBackground`   | `Boolean`                                          | `true`                           | false    | Whether to display the background on the wafer map.           |
| `backgroundColor`  | `String`                                           | `'#C0C0C0'`                      | false    | The background color of the wafer map.                        |
| `showFocus`        | `Boolean`                                          | `true`                           | false    | Whether to show the focus border on hover.                    |
| `showTooltip`      | `Boolean`                                          | `true`                           | false    | Whether to show tooltips on hover.                            |
| `showAxisValues`   | `Boolean`                                          | `true`                           | false    | Whether to display axis values.                               |
| `showDieInfo`      | `Boolean`                                          | `true`                           | false    | Whether to display die information in the tooltip.            |
| `dieinfoColor`     | `String`                                           | `'#000000'`                      | false    | The color of the die information text.                        |
| `scaleSize`        | `Number`                                           | `0.7`                            | false    | The scale factor for the wafer map.                           |
| `focusBorderColor` | `String`                                           | `'#0000ff'`                      | false    | The color of the focus border.                                |
| `focusBorderWidth` | `Number`                                           | `1`                              | false    | The width of the focus border.                                |

</details>

### Events

<details closed><summary>VWafermap</summary>

| Name    | Type       | Description                                                                      |
| ------- | ---------- | -------------------------------------------------------------------------------- |
| `onDie` | `Function` | Event emitted when a die is hovered. Provides information about the hovered die. |

</details>

---

## 🧩 Modules

<details closed><summary>VWafermap</summary>

| File                                                                                                                            | Summary                                                                                                                                                                                                                                                                                                                                                                                                                                                |
| ------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| [index.ts](https://github.com/ttpss930141011/vue-wafer-painter/blob/main/src\packages\VWafermap\index.ts)                       | This code exports a component called VWafermap, which represents a wafermap visualization.                                                                                                                                                                                                                                                                                                                                                             |
| [use-mapinfo.ts](https://github.com/ttpss930141011/vue-wafer-painter/blob/main/src\packages\VWafermap\src\use-mapinfo.ts)       | This code defines a custom hook "useMapinfo" that calculates various map calculations for a wafermap component based on its props. It calculates the minimum and maximum coordinates, and the corresponding width and height of each die on the map. It also calculates padding and grid font size for the map.                                                                                                                                        |
| [wafermap-style.ts](https://github.com/ttpss930141011/vue-wafer-painter/blob/main/src\packages\VWafermap\src\wafermap-style.ts) | The code defines a function that calculates and returns different styles for a wafermap UI component based on the provided props. These styles include container, background, map, info, grid, axis value, and focus styles.                                                                                                                                                                                                                           |
| [use-wafermap.ts](https://github.com/ttpss930141011/vue-wafer-painter/blob/main/src\packages\VWafermap\src\use-wafermap.ts)     | This code defines the most siginicant logic for a wafermap component. It includes functions for drawing the background, wafermap, die information, wafer grid, and axis values based on the data from `useMapinfo`, and add further handling from the style from `useWafermapStyle` It also includes functions for handling mouse events such as mouse move, mouse leave, and mouse click. Finally, it will redraw the wafermap when the props change. |
| [wafermap.ts](https://github.com/ttpss930141011/vue-wafer-painter/blob/main/src\packages\VWafermap\src\wafermap.ts)             | This code defines the props and emits for a wafermap component. It allows customization of various visual elements such as size, grid, focus, tooltip, axis values, and die info. Users can also specify the notch position, scale size, focus border color, and width.                                                                                                                                                                                |
| [wafermap.vue](https://github.com/ttpss930141011/vue-wafer-painter/blob/main/src\packages\VWafermap\src\wafermap.vue)           | This code defines a Vue component for displaying a wafer map. It includes multiple canvas elements for drawing the background, wafer map, information, grid, and axis values. It also includes elements for focus and tooltip functionality. The code handles props, emits, and exposes the current wafer map props and die information. The component's styles are scoped to the component's container.                                               |

</details>

---

## 📄 License

This project is licensed under the MIT License. See the [LICENSE](https://docs.github.com/en/communities/setting-up-your-project-for-healthy-contributions/adding-a-license-to-a-repository) file for additional info.

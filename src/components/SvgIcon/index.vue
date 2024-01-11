<script lang="ts">
import { computed, defineComponent } from 'vue'

export default defineComponent({
  name: 'SvgIcon',
  props: {
    name: {
      type: String,
      required: true,
    },
    color: {
      type: String,
      default: '',
    },
    size: {
      type: String,
      default: '1',
    },
    top: {
      type: Number,
      default: 0,
    },
    right: {
      type: Number,
      default: 0,
    },
    bottom: {
      type: Number,
      default: 0,
    },
    left: {
      type: Number,
      default: 0,
    },
    height: { type: Number, default: 0 },
    width: { type: Number, default: 0 },
  },
  setup(props) {
    const iconName = computed(() => `#icon-${props.name}`)
    const svgClass = computed(() => {
      if (props.name) {
        return `svg-icon icon-${props.name}`
      }
      return 'svg-icon'
    })

    const heightSize = computed(() => {
      let temp = ''
      if (props.height) {
        temp = `${String(props.height)}px`
      }
      else {
        temp = `${props.size}em`
      }
      return temp
    })
    const widthSize = computed(() => {
      let temp = ''
      if (props.width) {
        temp = `${String(props.width)}px`
      }
      else {
        temp = `${props.size}em`
      }
      return temp
    })

    return { iconName, svgClass, heightSize, widthSize }
  },
})
</script>

<template>
  <svg
    :class="svgClass"
    v-bind="$attrs"
    :style="{
      '--size': `${size}em`,
      '--right': right,
      '--bottom': bottom,
      '--top': top,
      '--left': left,
      '--height': heightSize,
      '--width': widthSize,
    }"
  >
    <use :xlink:href="iconName" :fill="color" />
  </svg>
</template>

<style lang="scss" scoped>
.svg-icon {
  width: var(--width);
  height: var(--height);
  fill: currentColor;
  vertical-align: middle;
  margin: calc(var(--top) * 1px) calc(var(--right) * 1px)
    calc(var(--bottom) * 1px) calc(var(--left) * 1px);
}

.svg-external-icon {
  mask-size: cover !important;
  display: inline-block;
}
</style>

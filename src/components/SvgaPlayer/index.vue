<script lang="ts" setup>
import { defineProps, onMounted } from 'vue'
import { Parser, Player } from 'svga'

const props = defineProps({
  svgaUrl: {
    type: String,
    default: '',
  },
  loop: {
    type: Number,
    default: 0,
  },
  svgaWidth: {
    type: Number,
    default: 52,
  },
  svgaHeight: {
    type: Number,
    defatult: 52,
  },
})

const render = async () => {
  const parser = new Parser()
  const svga = await parser.load(new URL('../../assets/home/loading.svga', import.meta.url).href)
  const doc: any = document.getElementById('svga-canvas')
  const player: any = new Player(doc)
  await player.mount(svga)

  player.start()
}
onMounted(() => {
  render()
})
</script>

<template>
  <div class="svga-player">
    <canvas
      id="svga-canvas"
      :style="`width: ${svgaWidth}px; height: ${svgaHeight}px`"
    />
  </div>
</template>

<style lang="scss" scoped>
.svga-player {
  display: flex;
  justify-content: center;
}
</style>

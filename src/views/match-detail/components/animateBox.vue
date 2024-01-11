<script lang="ts">
import {
  defineComponent,
  getCurrentInstance,
  onMounted,
  onUnmounted,
  ref,
} from 'vue'
import videoAndAnimationHook from '@/hooks/videoAndAnimationHook'

export default defineComponent({
  name: 'AnimateBox',
  props: {
    matchDetail: {
      type: Object,
      default: () => {
        return {}
      },
    },
  },
  emits: ['closeAnimate'],
  setup(props, { emit }) {
    const { proxy } = getCurrentInstance() as any

    function closeAnimateHndle() {
      emit('closeAnimate')
    }

    const { animateSrc } = videoAndAnimationHook(
      props.matchDetail,
    )

    const isMin = ref(false)

    onMounted(() => {
      proxy.mittBus.on('setMiniAnimateBus', (isMinTag: boolean) => {
        isMin.value = isMinTag
      })
    })

    onUnmounted(() => {
      proxy.mittBus.off('setMiniAnimateBus')
    })

    return { closeAnimateHndle, animateSrc }
  },
})
</script>

<template>
  <div class="animate-box">
    <div class="animate-video">
      <iframe width="100%" height="100%" :src="animateSrc" />
      <!-- <div class="close-icon" @click="closeAnimateHndle" /> -->
    </div>
  </div>
</template>

<style lang="scss" scoped>
.animate-box {
  width: 100%;
  position: relative;
  flex-shrink: 0;
  overflow: hidden;
  background-color: var(--color-bg-second);
  z-index: 10;
  border-radius: 8px 8px 0 0;
  .animate-video {
    position: relative;
    height: 182px;
    width: 100%;
    iframe {
      border: 0;
    }
    .close-icon {
      position: absolute;
      border-radius: 50%;
      right: 10px;
      top: 16px;
      z-index: 9999;
      background-color: #eb0d0d50;
      padding: 15px;
      .lazy-image {
        height: 24px;
        width: 24px;
      }
    }
  }
}
</style>

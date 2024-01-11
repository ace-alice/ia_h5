<script lang="ts">
import type { Ref } from 'vue'
import {
  defineComponent,
  getCurrentInstance,
  nextTick,
  onMounted,
  onUnmounted,
  ref,
} from 'vue'
import Player from 'xgplayer'
import HlsJsPlayer from 'xgplayer-hls.js'
import FlvPlayer from 'xgplayer-flv'
import { getLocal } from '@/utils/storage'
import videoAndAnimationHook from '@/hooks/videoAndAnimationHook'
import { globalApiConfigStore } from '@/store/globalApiConfig'

export default defineComponent({
  name: 'LiveBox',
  components: {},
  props: {
    matchDetail: {
      type: Object,
      default: () => {
        return {}
      },
    },
  },
  emits: ['closeVideo'],
  setup(props, { emit }) {
    const { proxy } = getCurrentInstance() as any

    const isMin = ref(false)

    const { isFullscreen } = storeToRefs(globalApiConfigStore())

    function closeVideo() {
      emit('closeVideo')
    }
    const player: Ref<any> = ref(null)

    const iframeStyle = ref((720 * 720) / 1280)

    const isAppleDevice = () => {
      const ua = navigator.userAgent.toLowerCase()
      return /iphone|ipad|phone|Mac/i.test(ua)
    }

    function initPlayer(url: string) {
      const commonOption = {
        el: proxy.$refs.dplayer,
        url,
        isLive: true,
        // 是否自动播放
        autoplay: true,
        // 是否显示视频首帧
        videoInit: true,
        // 封面图
        poster: '',
        // 触发全屏时实现样式横屏全屏
        // rotateFullscreen: true,
        cssFullscreen: true,
        rotate: { // 视频旋转按钮配置项
          innerRotate: true, // 只旋转内部video
          clockwise: false, // 旋转方向是否为顺时针
        },
        crossOrigin: true,
        playsinline: true,
        // fitVideoSize: 'auto',
        width: '100%',
        height: 197,
        lang: getLocal('lang')?.id === 1 ? 'zh-cn' : 'en',
        closeVideoTouch: true,
        enableVideoDbltouch: true,
        closeVideoClick: true,
        useHls: true,
      }

      const flvTag = url.indexOf('.flv')
      const m3u8Tag = url.indexOf('.m3u8')

      if (flvTag !== -1) {
        player.value = new FlvPlayer(Object.assign(commonOption, {}))
      }
      else if (m3u8Tag !== -1) {
        player.value = new HlsJsPlayer(Object.assign(commonOption, {}))
      }
      else {
        player.value = new Player(Object.assign(commonOption, {}))
      }
      // }
    }

    const { currentVideoUrl, isIframe } = videoAndAnimationHook(props.matchDetail)

    const isInit = ref(false)

    watch(() => currentVideoUrl.value, (newVal) => {
      if (
        newVal
          && proxy.$refs.dplayer
          && isInit.value
          && !isIframe.value
      ) {
        if (player.value) {
          player.value.pause()
          player.value.src = newVal
          player.value.play()
        }
        else {
          initPlayer(newVal)
        }
      }
    })
    onMounted(() => {
      isInit.value = true

      proxy.mittBus.on('setMiniplayerBus', (isMinTag: boolean) => {
        if (player.value) {
          isMin.value = isMinTag
          isMinTag
            ? player.value.getMiniplayer()
            : player.value.exitMiniplayer()
        }
      })

      nextTick(() => {
        if (player.value && !isIframe.value) {
          player.value.pause()
          player.value.destroy()
          player.value = null
        }
        else {
          initPlayer(currentVideoUrl.value)
          player.value.on('getRotateFullscreen', () => {
            isFullscreen.value = true
          })
          player.value.on('exitRotateFullscreen', () => {
            isFullscreen.value = false
          })
          player.value.on('requestCssFullscreen', () => {
            isFullscreen.value = true
          })
          player.value.on('exitCssFullscreen', () => {
            isFullscreen.value = false
          })
          player.value.on('requestFullscreen', () => {
            isFullscreen.value = true
          })
          player.value.on('exitFullscreen', () => {
            isFullscreen.value = false
          })
        }
      })
    })

    onUnmounted(() => {
      isInit.value = false
      proxy.mittBus.off('setMiniplayerBus')
      if (player.value) {
        player.value.pause()
        player.value.destroy()
        player.value = null
      }
      isFullscreen.value = false
    })

    return {
      closeVideo,
      player,
      currentVideoUrl,
      isIframe,
      iframeStyle,
      isMin,
      isAppleDevice,
      isFullscreen,
    }
  },
})
</script>

<template>
  <div class="live-box" :class="{ 'is-min': isMin }">
    <div class="live-video" :style="{ '--height': iframeStyle }">
      <div v-if="!isIframe" id="dplayer" ref="dplayer" />
      <div v-else class="iframe-box" v-html="currentVideoUrl" />
      <!-- <div class="close-icon" @click="closeVideo" /> -->
    </div>
  </div>
</template>

<style lang="scss" scoped>
.is-min {
  margin: auto !important;
  min-height: 0 !important;
}
#dplayer {
  border-radius: 8px 8px 0 0;
  overflow: hidden;
}
.live-box {
  width: 100%;
  // min-height: 197px;
  margin: auto;
  flex-shrink: 0;
  transition: all 0.5s ease-in-out;
  .iframe-box {
    height: calc(var(--height) * 1px);
  }
  overflow: hidden;
  .live-video {
    position: relative;
    width: 100%;
    height: 100%;
    &:hover .close-icon {
      display: block;
    }
    .close-icon {
      position: absolute;
      border-radius: 50%;
      right: 10px;
      top: 16px;
      z-index: 1000;
      background-color: #00000050;
      padding: 4px;
      display: none;
      .lazy-image {
        height: 24px;
        width: 24px;
      }
    }
  }
  .iframe-box iframe {
    width: 100% !important;
    height: 100% !important;
    border: none !important;
  }
}
#dplayer {
  z-index: 1000;
}
</style>

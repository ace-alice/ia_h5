<script lang="ts">
import { defineComponent, nextTick, ref } from 'vue'
import dong_01 from '@/assets/home/dong_01.png'
import loadbg_01 from '@/assets/home/loadbg_02.png'
import iaText from '@/assets/home/font_01.png'

export default defineComponent({
  name: 'GlobalLoading',
  props: {
    period: {
      type: Number,
      default: 5,
    },
  },

  setup(props) {
    const percent = ref(0)
    const sourceLoad = ref(false)
    let timer: any = null

    function loading() {
      sourceLoad.value = true
      nextTick(() => {
        let speed = 10
        timer = setInterval(() => {
          percent.value += speed

          speed < 1 ? (speed = 1) : (speed = Math.floor(speed / 1.1))
          if (percent.value > 99) {
            percent.value = 99
          }
        }, 20)

        setTimeout(() => {
          if (timer) {
            percent.value = 100
            sourceLoad.value = false
            clearInterval(timer)
            timer = null
          }
        }, props.period * 1000)
      })
    }

    function done() {
      setTimeout(() => {
        if (timer) {
          percent.value = 100
          sourceLoad.value = false
          clearInterval(timer)
          timer = null
        }
      }, 30)
    }

    function end() {
      done()
    }

    return {
      percent,
      sourceLoad,
      loading,
      done,
      end,
      dong_01,
      loadbg_01,
      iaText,
    }
  },
})
</script>

<template>
  <Teleport to="body">
    <div
      v-show="sourceLoad"
      class="index_load_page"
      :style="{
        '--width': percent,
      }"
    >
      <div class="loadbg-box">
        <img class="loadbg_01" :src="loadbg_01">
        <div class="loadbg_02">
          <img class="dong_01" :src="dong_01">
          <img class="ia-text" :src="iaText">
        </div>
      </div>
    </div>
  </Teleport>
</template>

<style lang="scss" scoped>
.index_load_page {
  position: absolute;
  z-index: 10000;
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
  background-color: #181c22;
  background-size: 100% 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  .dong_01 {
    height: 48px;
    width: 48px;
    position: absolute;
    right: -10px;
    top: -38px;
  }
  .ia-text {
    width: 48px;
    margin-top: 8px;
    position: absolute;
    right: -14px;
    top: 8px;
  }
  .loadbg-box {
    position: relative;
    width: calc(100% - 40px);
  }
  .loadbg_01 {
    height: 6px;
    width: 100%;
  }
  .loadbg_02 {
    height: 6px;
    width: calc(var(--width) * 1%);
    border-radius: 8px;
    top: 8px;
    left: 0;
    background-image: url("@/assets/home/loadbg_01.png");
    background-size: 100% 100%;
    background-repeat: no-repeat;
    position: absolute;
    box-shadow: 0 3px #00000050;
  }
}
</style>

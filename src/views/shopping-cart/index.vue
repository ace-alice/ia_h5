<script lang="ts">
import {
  defineComponent,
  getCurrentInstance,
  onMounted,
  onUnmounted,
  ref,
  watch,
} from 'vue'
import Ordinary from './ordinary/index.vue'
import Together from './together/index.vue'
import shoppingHaveIcon from '@/assets/home/tab_shop_on.png'
import shoppingNoIcon from '@/assets/home/tab_shop_nor.png'
import shoppingMoreIcon from '@/assets/home/home_more_up.png'
import { shopCartStore } from '@/store/shopCart'
import { globalApiConfigStore } from '@/store/globalApiConfig'
import defaultIcon from '@/assets/home/default.png'
import home_dataanalysis_02 from '@/assets/matchData/shuju_dataanalysis_02.png'
import log_touzhu_01 from '@/assets/matchData/log_touzhu_01.png'
export default defineComponent({
  name: 'ShoppingCart',
  components: {
    Ordinary,
    Together,
  },
  setup() {
    const { shoppingShow, showBetList, hasMatchOfData } = storeToRefs(
      globalApiConfigStore(),
    )

    const { proxy }: any = getCurrentInstance()

    function showBetListHandle() {
      setTimeout(() => {
        showBetList.value = true
      }, 200)
    }

    function matchOfDataShowHandle() {
      setTimeout(() => {
        proxy.mittBus.emit('setShowInfoBus', true)
      }, 200)
    }
    const shoppingSwipeIndex = ref(0)
    const swiperWidth = ref(0)
    const { singleIds, parlayIds } = storeToRefs(shopCartStore())
    const ordinaryRef = ref(null)
    const shoppingLeft = ref(0)
    const shoppingTop = ref(0)
    const shoppingSwipeChange = (index: number) => {
      // setTimeout(() => {
      shoppingSwipeIndex.value = index
      // }, 300);
    }

    const shopLength = computed(() => {
      return singleIds.value.length + parlayIds.value.length
    })

    watch(() => shopLength.value, (newVal, oldVal) => {
      if (+newVal === 1 && +oldVal === 0) {
        shoppingShow.value = true
      }
    })

    const ordinaryDragx = (el: any) => {
      el.preventDefault()
      const oDiv: any = document.getElementById('ordinaryRef')
      const disX = el.changedTouches[0].pageX - oDiv.offsetLeft
      const disY = el.changedTouches[0].pageY - oDiv.offsetTop
      document.ontouchmove = function (e: any) {
        let l = e.changedTouches[0].pageX - disX
        let t = e.changedTouches[0].pageY - disY
        // if (t < oDiv.offsetTop) {
        //   return false
        // }
        // else
        if (l < 0) {
          l = 0
        }
        else if (
          l
          > document.documentElement.clientWidth - oDiv.offsetWidth
        ) {
          l = document.documentElement.clientWidth - oDiv.offsetWidth
        }
        else if (t < 0) {
          t = 0
        }
        else if (
          t
          > document.documentElement.clientHeight - oDiv.offsetHeight
        ) {
          t = document.documentElement.clientHeight - oDiv.offsetHeight
        }
        oDiv.style.left = `${l}px`
        oDiv.style.top = `${t}px`
      }
      document.ontouchend = function (e: any) {
        const t = e.changedTouches[0].pageY - disY
        if (t > 400) {
          shoppingShow.value = false
          setTimeout(() => {
            oDiv.style.left = `${shoppingLeft.value}px`
            oDiv.style.top = `${shoppingTop.value}px`
          }, 500)
        }
        else {
          oDiv.style.left = `${shoppingLeft.value}px`
          oDiv.style.top = `${shoppingTop.value}px`
        }
        document.ontouchmove = null
        document.ontouchend = null
      }
      return false
    }

    onMounted(() => {
      shoppingSwipeIndex.value = 0
      swiperWidth.value = document.documentElement.clientWidth - 13
      proxy.mittBus.on('dragShopping', (val: any) => {
        ordinaryDragx(val)
      })
    })
    onUnmounted(() => {
      proxy.mittBus.off('dragShopping')
    })
    watch(
      () => shoppingShow.value,
      (newVal) => {
        if (newVal) {
          setTimeout(() => {
            const oDiv: any = document.getElementById('ordinaryRef')
            if (oDiv) {
              shoppingLeft.value = oDiv.offsetLeft
              shoppingTop.value = oDiv.offsetTop
            }
          }, 500)
        }
      },
    )
    return {
      shoppingShow,
      shoppingSwipeIndex,
      shoppingHaveIcon,
      shoppingNoIcon,
      shoppingMoreIcon,
      shoppingSwipeChange,
      swiperWidth,
      shopLength,
      parlayIds,
      singleIds,
      ordinaryRef,
      ordinaryDragx,
      shoppingLeft,
      shoppingTop,
      showBetList,
      defaultIcon,
      home_dataanalysis_02,
      log_touzhu_01,
      showBetListHandle,
      matchOfDataShowHandle,
      hasMatchOfData,
    }
  },
})
</script>

<template>
  <div class="shopping-cart">
    <div class="shopping-cart-put" @click="shoppingShow = true">
      <div class="shopping-cart-put-l">
        <img :src="shopLength > 0 ? shoppingHaveIcon : shoppingNoIcon">
        {{ $t("selected")
        }}<span
          :style="{
            color: shopLength > 0 ? '#fe5e00' : 'rgba(255,255,255,0.60)',
          }"
        >{{ shopLength }}</span>{{ $t("unit") }}
      </div>
      <div class="shopping-cart-put-c">
        <span />
      </div>
      <div class="shopping-cart-put-r">
        <span>{{ $t("viewDetails") }}</span>
        <img :src="shoppingMoreIcon">
      </div>
    </div>
    <div class="shopping-cart-expand">
      <!--      @touchstart="ordinaryDragx($event)" -->
      <van-popup
        id="ordinaryRef"
        v-model:show="shoppingShow"
        position="bottom"
        z-index="5001"
        teleport="body"
      >
        <div class="fast-box" @click="shoppingShow = false">
          <div v-if="hasMatchOfData" @click="matchOfDataShowHandle">
            <van-image
              width="32"
              height="32"
              :src="home_dataanalysis_02"
              :error-icon="defaultIcon"
              :show-loading="false"
            />
          </div>
          <div @click="showBetListHandle">
            <van-image
              width="32"
              height="32"
              :src="log_touzhu_01"
              :error-icon="defaultIcon"
              :show-loading="false"
            />
          </div>
        </div>
        <van-swipe
          :width="swiperWidth"
          :loop="false"
          :show-indicators="false"
          @change="shoppingSwipeChange"
        >
          <van-swipe-item
            v-if="!(parlayIds.length > 0 && singleIds.length === 0)"
          >
            <Ordinary />
          </van-swipe-item>
          <van-swipe-item v-if="parlayIds.length > 0">
            <Together />
          </van-swipe-item>
        </van-swipe>
      </van-popup>
    </div>
  </div>
</template>

<style lang="scss">
#ordinaryRef {
  height: calc(80% + 64px) !important;
  display: flex;
  flex-direction: column;
  .van-swipe {
    height: calc(100% - 72px);
  }
}
</style>

<style lang="scss" scoped>
.fast-box {
  overflow: visible;
  height: 56px;
  width: calc(100% - 32px);
  display: flex;
  margin: 0 auto;
  & > div {
    height: 40px;
    width: 40px;
    background: rgba(255, 255, 255, 0.1);
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-left: 12px;
  }
}
.shopping-cart {
  position: fixed;
  left: 18px;
  bottom: 18px;
  width: calc(100% - 36px);
  z-index: 1005;

  &-put {
    display: flex;
    justify-content: space-between;
    width: 100%;
    height: 48px;
    background: rgba(255 255 255 / 20%);
    border-radius: 8px;
    backdrop-filter: blur(10px);

    &-l {
      display: flex;
      flex: 40%;
      align-items: center;
      font-size: 14px;
      color: #fff;
      font-weight: 500;

      img {
        width: 40px;
        height: 40px;
        margin: 0 8px;
      }

      span {
        font-size: 16px;
        padding: 0 5px;
        font-family: Gotham-Medium;
      }
    }

    &-c {
      display: flex;
      justify-content: center;
      flex: 20%;
      margin-top: 6px;

      span {
        width: 32px;
        height: 3px;
        opacity: 0.2;
        background: #fff;
        border-radius: 3px;
      }
    }

    &-r {
      display: flex;
      justify-content: flex-end;
      align-items: center;
      flex: 40%;

      img {
        width: 16px;
        height: 16px;
        margin: 0 12px;
      }

      span {
        font-size: 14px;
        color: rgba(255 255 255 / 60%);
        font-weight: 400;
      }
    }
  }

  &-expand {
    :deep(.van-swipe) {
      height: calc(100% - 64px);
    }

    :deep(.van-swipe__indicators) {
      display: none;
    }

    :deep(.van-popup) {
      background: transparent;
    }

    :deep(.van-popup--bottom) {
      bottom: 10px;
    }

    .shopping-swipe1 {
      .van-swipe-item:nth-child(1) {
        display: flex;
        justify-content: flex-start;
        margin-left: 18px;
      }

      .van-swipe-item:nth-child(2) {
        display: flex;
        margin-left: -28px;
      }
    }

    .shopping-swipe2 {
      .van-swipe-item:nth-child(1) {
        display: flex;
        justify-content: flex-end;
        margin-left: 8px;
      }

      .van-swipe-item:nth-child(2) {
        display: flex;
        margin-left: 10px;
      }
    }

    .shopping-swipe3 {
      .van-swipe-item:nth-child(1) {
        margin-left: 18px;
        margin-right: 10px;
      }
    }
  }
}
</style>

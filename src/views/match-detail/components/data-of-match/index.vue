<script lang="ts" setup name="DataOfMatch">
import dayjs from 'dayjs'
import Preview from './components/preview/index.vue'
import defaultIcon from '@/assets/home/default.png'
import home_dataanalysis_02 from '@/assets/matchData/home_dataanalysis_02.png'
import { globalApiConfigStore } from '@/store/globalApiConfig'
import { userInfoStore } from '@/store/userInfo'
import shuju_shopping from '@/assets/matchData/shuju_shopping.png'
import log_touzhu_01 from '@/assets/matchData/log_touzhu_01.png'
import { getLocal, removeLocal, setLocal } from '@/utils/storage'

const showInfoBox = ref(false)

function showInfoBoxHandle() {
  closeDatawarning()
}

const { showBetList, shoppingShow } = storeToRefs(globalApiConfigStore())
const { isLogin } = storeToRefs(userInfoStore())

const shoppingTop = ref(0)

const changeDragx = (el: any) => {
  el.preventDefault()
  const oDiv: any = document.getElementById('dataOfMatchRef')
  const disY = el.changedTouches[0].pageY - oDiv.offsetTop
  document.ontouchmove = function (e: any) {
    let t = e.changedTouches[0].pageY - disY
    if (t < 0) {
      t = 0
    }
    else if (t > document.documentElement.clientHeight - oDiv.offsetHeight) {
      t = document.documentElement.clientHeight - oDiv.offsetHeight
    }
    oDiv.style.top = `${t}px`
  }
  document.ontouchend = function (e: any) {
    const t = e.changedTouches[0].pageY - disY
    if (t > 300) {
      showInfoBox.value = false
      setTimeout(() => {
        oDiv.style.top = `${shoppingTop.value}px`
      }, 500)
    }
    else {
      oDiv.style.top = `${shoppingTop.value}px`
    }
    document.ontouchmove = null
    document.ontouchend = null
  }
  return false
}

watch(
  () => showInfoBox.value,
  (newVal) => {
    if (newVal) {
      setTimeout(() => {
        const oDiv: any = document.getElementById('dataOfMatchRef')
        if (oDiv) {
          shoppingTop.value = oDiv.offsetTop
        }
      }, 500)
    }
  },
)
const noShowDatawarning = ref(getLocal('noShowDatawarning') || false)

const closeTime = ref(getLocal('closeTime'))

function dealShow() {
  if (!noShowDatawarning.value) {
    return
  }
  if (dayjs().isBefore(dayjs('2023-5-2'))) {
    if (noShowDatawarning.value) {
      if (closeTime.value && dayjs(closeTime.value).isBefore(dayjs().subtract(1, 'day'))) {
        removeLocal('noShowDatawarning')
        removeLocal('closeTime')
        noShowDatawarning.value = false
      }
    }
  }
}

dealShow()

function closeDatawarning() {
  showInfoBox.value = !showInfoBox.value
  setLocal('closeTime', dayjs())
  if (noShowDatawarning.value) {
    return
  }
  setLocal('noShowDatawarning', true)
  noShowDatawarning.value = true
}

const { proxy }: any = getCurrentInstance()

onMounted(() => {
  proxy.mittBus.on('setShowInfoBus', (isMinTag: boolean) => {
    if (showInfoBox.value !== isMinTag) {
      showInfoBox.value = isMinTag
    }
  })
})
onUnmounted(() => {
  proxy.mittBus.off('setShowInfoBus')
})
</script>

<template>
  <van-image
    :src="home_dataanalysis_02"
    class="show-image"
    :error-icon="defaultIcon"
    :show-loading="false"
    @click="showInfoBoxHandle"
  />
  <Teleport v-if="!noShowDatawarning" to="body">
    <div class="warn-box-analyze" @click.stop="closeDatawarning">
      <div>{{ $t('click_to_analyze') }}</div>
    </div>
  </Teleport>
  <van-popup
    id="infoBoxRef"
    v-model:show="showInfoBox"
    position="bottom"
    teleport="body"
    z-index="5001"
  >
    <div id="dataOfMatchRef" class="data-of-match" @click="showInfoBox = false">
      <div class="fast-box">
        <div v-if="isLogin" @click="shoppingShow = true">
          <van-image
            width="32"
            height="32"
            :src="shuju_shopping"
            :error-icon="defaultIcon"
            :show-loading="false"
          />
        </div>
        <div v-if="isLogin" @click="showBetList = true">
          <van-image
            width="32"
            height="32"
            :src="log_touzhu_01"
            :error-icon="defaultIcon"
            :show-loading="false"
          />
        </div>
      </div>
      <div class="touch-box" @touchstart="changeDragx($event)" />
      <div class="match-of-data-header" @click.stop>
        <div class="header-left">
          <div>{{ $t('data_analysis') }}</div>
          <van-image
            :src="home_dataanalysis_02"
            class="show-image"
            :error-icon="defaultIcon"
            :show-loading="false"
          />
        </div>
        <div />
      </div>
      <van-swipe
        class="my-swipe"
        :loop="false"
        :show-indicators="false"
        indicator-color="white"
      >
        <van-swipe-item>
          <Preview />
        </van-swipe-item>
      </van-swipe>
    </div>
  </van-popup>
</template>

<style lang="scss">
.warn-box-analyze {
  position: fixed;
  background: #006ede;
  border-radius: 4px;
  height: 32px;
  z-index: 99999;
  width: unset !important;
  top: 46px;
  right: 18px;
  font-size: 12px;
  color: #ffffff;
  display: flex;
  align-items: center;
  padding: 0 12px;
  // box-shadow: 0 0 4px #000;
}
</style>

<style lang="scss" scoped>
.my-swipe {
  height: calc(100% - 75px);
}
.match-of-data-header {
  display: flex;
  width: calc(100% - 32px);
  margin: 0 auto 22px;
  justify-content: space-between;
  .header-left {
    display: flex;
    align-items: center;
    font-size: 16px;
    color: #ffffff;
    font-weight: 600;
    .show-image {
      margin-left: 12px;
    }
  }
}
.show-image {
  height: 24px;
  width: 24px;
}
.data-of-match {
  height: calc(100% - 64px);
  width: 100%;
  top: 64px;
  overflow-x: visible;
  position: relative;
  border-radius: 16px;
  background: #262d34 !important;
  .touch-box {
    height: 25px;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 16px 16px 0px 0px;
    &::before {
      content: "";
      height: 3px;
      width: 32px;
      background: #fff;
      opacity: 0.2;
      border-radius: 3px;
    }
  }
}
.fast-box {
  position: absolute;
  top: -56px;
  overflow: visible;
  height: 56px;
  width: 100%;
  display: flex;
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
</style>

<style lang="scss">
#infoBoxRef {
  background: transparent;
  bottom: 10px;
  width: calc(100% - 32px);
  left: 16px;
  overflow: hidden;
  height: calc(80% + 64px);
}
:deep(.van-overlay) {
  z-index: 999999;
}
</style>

<script setup lang="ts" name="DetailPageHeader">
import backIcon from '@/assets/home/com_back.png'
import details_betslip from '@/assets/home/details_betslip.png'
import { globalApiConfigStore } from '@/store/globalApiConfig'
import { userInfoStore } from '@/store/userInfo'
const props = defineProps({
  isBindAntInfo: {
    type: Boolean,
    default: false,
  },
})

const DataOfMatch = defineAsyncComponent(
  () => import('./data-of-match/index.vue'),
)

const { matchDetailQuery } = storeToRefs(globalApiConfigStore())

const isEnd = matchDetailQuery.value.is_end || false

function toMatchList() {
  matchDetailQuery.value.show = false
}
const { showBetList } = storeToRefs(globalApiConfigStore())

const { isLogin } = storeToRefs(userInfoStore())
</script>

<template>
  <div class="detail-page-header">
    <div>
      <img :src="backIcon" alt="" @click="toMatchList">
      <div>{{ $t("gameQuiz") }}</div>
      <div>
        <DataOfMatch v-if="isBindAntInfo && !isEnd" />
        <img
          v-if="isLogin"
          style="margin-left: 12px"
          :src="details_betslip"
          alt=""
          @click="showBetList = true"
        >
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.detail-page-header {
  height: 50px;
  width: 100%;
  background: #181c22;
  position: relative;
  flex-shrink: 0;
  .show-image {
    height: 24px;
  }
  & > div {
    display: flex;
    width: calc(100% - 36px);
    margin: auto;
    height: 100%;
    justify-content: space-between;
    align-items: center;
    font-size: 16px;
    color: #ffffff;
    text-align: center;
    font-weight: 600;
    img {
      height: 24px;
      width: 24px;
    }
  }
}
</style>

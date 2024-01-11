<script lang="ts">
import { reactive, ref } from 'vue'
import SingleBet from './single-bet/index.vue'
import DropdownMenu from './dropdown-menu/index.vue'
import HeadTitle from '@/components/HeadTitle/index.vue'
import { getBettingRecord } from '@/api/tools-api'
import backIcon from '@/assets/home/com_back.png'
import betIcon from '@/assets/home/log_touzhu_02.png'
import emptyImg from '@/assets/home/empty.png'
import { fixedKeep, toFixedNumber } from '@/utils'
import { globalApiConfigStore } from '@/store/globalApiConfig'
export default {
  name: 'BettingHistory',
  components: {
    SingleBet,
    DropdownMenu,
    HeadTitle,
  },
  setup() {
    const { showBetList } = storeToRefs(globalApiConfigStore())
    const historyList = ref<any[]>([])
    const historyCount = ref(0)
    const totalWinLost = ref(0)
    const totalAmount = ref(0)
    const historyRef = ref<HTMLDivElement>()
    const betRefreshing = ref(true)
    const formData: any = reactive({
      start_time: null,
      end_time: null,
      page: 1,
      limit: 10,
      game_id: null,
      money_type: null,
      category_id: null,
      is_getprize: null,
      is_del: null,
    })
    const finished = ref(false)
    function filterForm() {
      const temp: any = {}
      for (const fk of Object.keys(formData)) {
        if (
          (['start_time', 'end_time'].includes(fk) && formData[fk])
          || (!['start_time', 'end_time'].includes(fk) && formData[fk] !== -1)
        ) {
          temp[fk] = formData[fk]
        }
      }
      return temp
    }

    const loading = ref(true)

    const getHistoryList = () => {
      finished.value = false
      loading.value = true
      getBettingRecord(filterForm()).then(({ data }: any) => {
        let newList = []
        if (+data.code === 1) {
          historyCount.value = data.data.total
          totalWinLost.value = data.data.total_win_lost
          totalAmount.value = data.data.total_amount
          formData.page++
          newList = data.data.data
          if (!newList || newList.length === 0) {
            betRefreshing.value = false
            return
          }
          historyList.value = historyList.value.concat(newList)
          loading.value = false
          if (+historyCount.value <= +historyList.value.length) {
            finished.value = true
          }
        }
        else {
          betRefreshing.value = false
          finished.value = true
        }
      })
    }
    const handleSearch = (form: any) => {
      if (historyRef.value) {
        historyRef.value.scrollTo({ top: 0 })
      }
      Object.assign(formData, form)
      formData.page = 1
      historyList.value = []
      getHistoryList()
    }

    function onLoad() {
      getHistoryList()
    }

    const betOnRefresh = () => {
      formData.page = 1
      historyList.value = []
      finished.value = false
      betRefreshing.value = true
      loading.value = true
      onLoad()
    }

    return {
      backIcon,
      betIcon,
      emptyImg,
      historyCount,
      historyList,
      handleSearch,
      onLoad,
      finished,
      loading,
      historyRef,
      totalWinLost,
      totalAmount,
      toFixedNumber,
      betRefreshing,
      betOnRefresh,
      showBetList,
      fixedKeep,
    }
  },
}
</script>

<template>
  <van-popup
    v-model:show="showBetList"
    class="bet-popup"
    position="right"
    close-on-popstate
    teleport="body"
    z-index="5001"
    @open="betOnRefresh"
  >
    <div class="betting-history">
      <HeadTitle :title="$t('bettingHistory')" />
      <DropdownMenu @search="handleSearch" />
      <div class="betting-history-summary">
        <div class="betting-history-summary-icon">
          <img :src="betIcon">
        </div>
        <div class="betting-history-summary-info">
          <div class="betting-history-summary-info-top">
            <div>
              <span>{{ $t("oddNumber") }}</span>
              <span>{{ historyCount }}</span>
            </div>
            <div>
              <span>{{ $t("cart_bet_amount") }}</span>
              <span>{{ toFixedNumber(totalAmount).toFixed(fixedKeep) }}</span>
            </div>
          </div>
          <!-- <div class="betting-history-summary-info-bottom">
            <span>{{ $t("bet_profit") }}</span>
            <span>{{ toFixedNumber(totalWinLost).toFixed(2) }}</span>
          </div> -->
        </div>
      </div>

      <div
        v-if="historyList.length > 0"
        ref="historyRef"
        class="betting-history-main"
      >
        <van-pull-refresh
          v-model="betRefreshing"
          :head-height="100"
          @refresh="betOnRefresh"
        >
          <!-- 下拉提示，通过 scale 实现一个缩放效果 -->
          <template #pulling>
            <svga-player />
            <span>{{ $t("pullDownRefresh") }}</span>
          </template>

          <!-- 释放提示 -->
          <template #loosing>
            <svga-player />
            <span>{{ $t("releaseRefresh") }}</span>
          </template>

          <!-- 加载提示 -->
          <template #loading>
            <svga-player />
            <span>{{ $t("pullDownRefresh") }}</span>
          </template>
          <van-list
            v-model:loading="loading"
            :finished="finished"
            :finished-text="$t('no_more')"
            @load="onLoad"
          >
            <div>
              <SingleBet
                v-for="item in historyList"
                :key="item.order_id"
                :bet-info="item"
              />
            </div>
          </van-list>
        </van-pull-refresh>
      </div>
      <div v-else>
        <van-pull-refresh
          v-model="betRefreshing"
          :head-height="100"
          @refresh="betOnRefresh"
        >
          <!-- 下拉提示，通过 scale 实现一个缩放效果 -->
          <template #pulling>
            <svga-player />
            <span>{{ $t("pullDownRefresh") }}</span>
          </template>

          <!-- 释放提示 -->
          <template #loosing>
            <svga-player />
            <span>{{ $t("releaseRefresh") }}</span>
          </template>

          <!-- 加载提示 -->
          <template #loading>
            <svga-player />
            <span>{{ $t("pullDownRefresh") }}</span>
          </template>
          <van-empty
            image-size="234"
            :image="emptyImg"
            :description="$t('noRecords')"
          />
        </van-pull-refresh>
      </div>
    </div>
  </van-popup>
</template>

<style lang="scss" scoped>
.betting-history {
  height: 100%;
  overflow: hidden;
  width: 100%;

  &-summary {
    display: flex;
    height: 64px;
    padding: 0 18px;
    background: rgba(255 255 255 / 5%);
    margin: 8px 0 0;

    &-icon {
      display: flex;
      align-items: center;

      img {
        width: 40px;
        height: 40px;
        margin-right: 18px;
      }
    }

    &-info {
      display: flex;
      flex-direction: column;
      justify-content: center;
      flex: 1;

      &-top {
        display: flex;
        justify-content: space-between;

        div {
          display: flex;
          font-size: 12px;

          span:nth-child(1) {
            color: rgba(255 255 255 / 60%);
            font-weight: 400;
            margin-right: 14px;
          }

          span:nth-child(2) {
            color: #fff;
            font-weight: 500;
          }
        }
      }

      &-bottom {
        display: flex;
        margin-top: 6px;
        font-size: 12px;

        span:nth-child(1) {
          color: #fff;
          font-weight: 400;
          margin-right: 8px;
        }

        span:nth-child(2) {
          color: #fecb00;
          font-weight: 500;
        }
      }
    }
  }

  &-main {
    width: calc(100% - 36px);
    margin: 0 auto 20px;
    height: calc(100% - 170px);
    padding-top: 14px;
    overflow: auto;
    scroll-behavior: smooth;
  }

  :deep(.van-empty) {
    height: calc(100% - 240px);
    padding: 0;
  }
}
</style>

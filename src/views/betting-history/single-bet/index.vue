<script lang="ts">
import { fixedKeep, getBetListStatus, parseTime, toFixedNumber } from '@/utils'
import Clipboard from '@/components/Clipboard/index.vue'
import betIcon from '@/assets/home/find_ copy.png'
import defaultImg from '@/assets/home/default.png'
import openImage from '@/assets/home/spread_001.png'
import closeImage from '@/assets/home/spread_002.png'
import Chuanguan from '@/assets/home/chuanguan.png'
import { getUserParlayList } from '@/api/tools-api'

export default {
  name: 'SingleBet',
  components: { Clipboard },
  props: {
    betInfo: {
      type: Object,
      default: () => {
        return {}
      },
    },
  },
  setup(props: any) {
    const statusInfo: any = getBetListStatus(props.betInfo)
    function showNumber(info: any) {
      let num = 0
      if ([5, 6].includes(getBetListStatus(info).code)) {
        num = toFixedNumber(Math.abs(+info.bonus - info.amount))
      }
      else {
        num = toFixedNumber(+info.amount * (+info.odds - 1))
      }
      return num.toFixed(fixedKeep)
    }
    const showAll = ref(false)

    const isGetDetail = ref(false)

    function showMoreHandle() {
      if (!isGetDetail.value) {
        getUserParlayList({ id: props.betInfo.id }).then((res: any) => {
          if (+res.data.code === 1) {
            Object.assign(props.betInfo, {
              parlay_info: res.data.data,
            })
            setTimeout(() => {
              // eslint-disable-next-line @typescript-eslint/no-use-before-define
              parlayHeight.value = parlayBoxRef.value?.clientHeight || 0
            }, 3)
            isGetDetail.value = true
          }
          else {
            showAll.value = false
            isGetDetail.value = false
          }
        }).catch(() => {
          showAll.value = false
          isGetDetail.value = false
        })
      }
      showAll.value = !showAll.value
    }

    const parlayBoxRef = ref<HTMLDivElement>()
    const parlayHeight = ref(0)
    const curParlayHeight = computed(() => {
      if (showAll.value) {
        return parlayHeight.value
      }
      else {
        return 0
      }
    })

    onMounted(() => {
      nextTick(() => {
        if (props.betInfo.is_parlay && parlayBoxRef.value) {
          parlayHeight.value = parlayBoxRef.value.clientHeight
        }
      })
    })
    return {
      betIcon,
      statusInfo,
      defaultImg,
      parseTime,
      toFixedNumber,
      showNumber,
      getBetListStatus,
      openImage,
      closeImage,
      showAll,
      parlayHeight,
      parlayBoxRef,
      curParlayHeight,
      Chuanguan,
      showMoreHandle,
      fixedKeep,
    }
  },
}
</script>

<template>
  <div class="single-bet" :style="{ '--parlay-height': curParlayHeight }">
    <div class="single-bet-header">
      <div>
        <van-image
          width="16px"
          height="16px"
          :src="betInfo.game_type_logo ? betInfo.game_type_logo : Chuanguan"
          :error-icon="defaultImg"
          :show-loading="false"
        />
        <span>{{ $t("toWin") }}</span>
        <span>{{ betInfo.game_name }}</span>
      </div>
      <div class="header-status">
        <span :style="{ color: statusInfo.color }">{{
          [5, 6].includes(statusInfo.code) ? $t("clearinged") : statusInfo.name
        }}</span>
        <template v-if="!!betInfo.is_parlay">
          <img
            v-show="showAll"
            :src="closeImage"
            alt=""
            @click="showAll = !showAll"
          >
          <img
            v-show="!showAll"
            :src="openImage"
            alt=""
            @click="showMoreHandle"
          >
        </template>
      </div>
    </div>
    <div v-if="+betInfo.is_parlay" class="parlay-box">
      <div ref="parlayBoxRef">
        <div
          v-for="info in betInfo.parlay_info"
          :key="`${info.order_id}-${getBetListStatus(info).code}`"
          class="single-bet-info"
        >
          <div>
            <span>{{ $t("handicapOdds") }}</span>
            <span class="odds">x{{ toFixedNumber(info.odds).toFixed(fixedKeep) }}</span>
          </div>
          <div>
            <span>{{ $t("playerName") }}</span>
            <span>{{ info.desc }}</span>
          </div>
          <div>
            <span>{{ $t("leagueName") }}</span>
            <span>{{ info.event_name }}</span>
          </div>
          <div>
            <span>{{ $t("matchInformation") }}</span>
            <span>{{ info.team_name_1 }} vs {{ info.team_name_2 }}</span>
          </div>
          <div>
            <span>{{ $t("winOrLose") }}</span>
            <span>{{ getBetListStatus(info).name }}</span>
          </div>
        </div>
      </div>
    </div>
    <div v-else class="single-bet-info">
      <div>
        <span>{{ $t("handicapOdds") }}</span>
        <span class="odds">x{{ toFixedNumber(betInfo.odds).toFixed(fixedKeep) }}</span>
      </div>
      <div>
        <span>{{ $t("playerName") }}</span>
        <span>{{ betInfo.desc }}</span>
      </div>
      <div>
        <span>{{ $t("leagueName") }}</span>
        <span>{{ betInfo.event_name }}</span>
      </div>
      <div v-if="betInfo.team_info_desc">
        <span style="flex-shrink: 0">{{ $t("matchInformation") }}</span>
        <span style="word-break: break-all">{{ betInfo.team_info_desc }}</span>
      </div>
      <div v-else>
        <span style="flex-shrink: 0">{{ $t("matchInformation") }}</span>
        <span>{{ betInfo.team_name_1 }} vs {{ betInfo.team_name_2 }}</span>
      </div>
    </div>
    <template v-if="+betInfo.is_parlay === 1">
      <div v-show="!showAll" class="parlay-odd">
        <span>{{ $t('handicapOdds') }}</span>
        <span>x{{ toFixedNumber(betInfo.odds).toFixed(fixedKeep) }}</span>
      </div>
    </template>
    <div class="single-bet-name">
      <div>
        <span />
        <span>{{
          +betInfo.is_parlay === 0 ? $t("single_bet") : $t("parlay_game")
        }}</span>
        <span v-if="+betInfo.is_parlay !== 0">{{ betInfo.desc }}</span>
      </div>
      <div v-if="+betInfo.is_parlay === 1 && showAll">
        {{ toFixedNumber(betInfo.odds).toFixed(fixedKeep) }}
      </div>
    </div>
    <div class="single-bet-detail">
      <div>
        <span>{{ $t("betNumber") }}</span>
        <Clipboard :content="betInfo.order_id">
          <template #label>
            <span class="order-id">
              <span>{{ betInfo.order_id }}</span>
              <img :src="betIcon">
            </span>
          </template>
        </Clipboard>
      </div>
      <div>
        <span>{{ $t("bettingTime") }}</span>
        <span>{{ parseTime(betInfo.create_time) }}</span>
      </div>
      <div>
        <span>{{ $t("cart_bet_amount") }}</span>
        <span>{{ toFixedNumber(betInfo.amount).toFixed(fixedKeep) }}</span>
      </div>
      <div v-if="[5, 6].includes(statusInfo.code)">
        <span>{{ $t("winOrLose") }}</span>
        <span>{{ statusInfo.name }}
          {{
            +statusInfo.code === 5
              ? toFixedNumber(betInfo.bonus).toFixed(fixedKeep)
              : toFixedNumber(betInfo.amount).toFixed(fixedKeep)
          }}</span>
      </div>
      <div v-else>
        <span>{{ $t("expected_profit") }}</span>
        <span>{{ showNumber(betInfo) }}</span>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.single-bet {
  background: #262d34;
  border-radius: 16px;
  padding: 20px 12px;
  margin-bottom: 14px;
  .header-status {
    display: flex;
    align-items: center;
    img {
      height: 16px;
      width: 16px;
      margin-left: 26px;
    }
  }
  .parlay-box {
    height: calc(var(--parlay-height) * 1px) !important;
    overflow: hidden;
    transition: height 0.2s ease-in-out;
  }
  .parlay-odd {
    display: flex;
    background: rgba(255, 255, 255, 0.04);
    border-radius: 2px;
    height: 34px;
    justify-content: space-between;
    align-items: center;
    span {
      padding: 0 8px;
      &:nth-child(1) {
        opacity: 0.6;
        font-size: 12px;
        color: #ffffff;
      }
      &:nth-child(2) {
        font-family: Gotham-Medium;
        font-size: 14px;
        color: #fe5e00;
      }
    }
  }

  &-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 12px;

    div:nth-child(1) {
      display: flex;
      font-size: 14px;
      letter-spacing: 0;
      font-weight: 400;

      span:nth-child(2) {
        color: #fff;
        margin: 0 12px 0 8px;
      }

      span:nth-child(3) {
        color: rgba(255 255 255 / 60%);
      }

      :deep(.van-image__error, .van-image__loading) {
        background: transparent;

        img {
          width: 16px;
          height: 16px;
        }
      }
    }

    div:nth-child(2) {
      font-size: 12px;
      color: #fecb00;
      letter-spacing: 0;
      font-weight: 400;
    }
  }

  &-info {
    padding: 8px;
    background: rgba(255 255 255 / 4%);
    border-radius: 2px;
    margin-top: 4px;

    div {
      display: flex;
      justify-content: space-between;
      font-size: 12px;
      color: rgba(255 255 255 / 60%);
      letter-spacing: 0;
      font-weight: 400;
      overflow: hidden;
      & + div {
        margin-top: 6px;
      }

      span:nth-child(1) {
        flex: 60px;
      }

      span:nth-child(2) {
        display: flex;
        flex: calc(100% - 60px);
        justify-content: flex-end;
        color: #fff;
      }

      .odds {
        font-family: Gotham-Medium;
        color: #fe5e00 !important;
        font-weight: 500;
      }
    }
  }

  &-name {
    display: flex;
    justify-content: space-between;
    margin: 12px 0;
    font-size: 12px;
    color: #fff;
    font-weight: 500;

    div:nth-child(1) {
      display: flex;

      span:nth-child(1) {
        width: 2px;
        height: 12px;
        background: #fecb00;
        border-radius: 1.5px;
        margin-right: 12px;
      }

      span:nth-child(2) {
        margin-right: 8px;
      }
    }

    div:nth-child(2) {
      font-family: Gotham-Medium;
      color: #fe5e00;
      font-weight: 500;
    }
  }

  &-detail {
    div {
      display: flex;
      align-items: center;
      height: 20px;
      font-size: 12px;
      color: rgba(255 255 255 / 60%);
      letter-spacing: 0;
      font-weight: 400;

      span:nth-child(1) {
        margin-right: 8px;
        display: flex;
        align-items: center;
      }

      img {
        width: 16px;
        height: 16px;
      }
    }

    div:nth-child(3),
    div:nth-child(4) {
      span:nth-child(2) {
        font-family: Gotham-Medium;
        color: #fff;
        font-weight: 500;
      }
    }
  }
}
</style>

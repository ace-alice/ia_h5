<script setup lang="ts" name="EndBetItem">
import defaultImg from '@/assets/home/default.png'
import { globalApiConfigStore } from '@/store/globalApiConfig'
import { parseTime } from '@/utils'
import statusIcon1 from '@/assets/home/status-1.png'
import statusIcon2 from '@/assets/home/status-2.png'
const props = defineProps({
  matchInfo: {
    type: Object,
    default: () => {
      return {}
    },
  },
})

const statusObj: any = {
  status1: statusIcon1,
  status2: statusIcon2,
}

const setWinLoseImage = (tag: any) => {
  // return new URL(`../../assets/home/status-${tag}.png`, import.meta.url).href
  return statusObj[`status${tag || 1}`]
}

const { matchDetailQuery } = storeToRefs(globalApiConfigStore())

const statusTab = (row: any, rowId: number) => {
  if (!row.winner_team_id) {
    return setWinLoseImage(1)
  }
  if (+row.winner_team_id === -1) {
    return setWinLoseImage(1)
  }
  if (+row.winner_team_id === +rowId) {
    return setWinLoseImage(1)
  }
  else {
    return setWinLoseImage(2)
  }
}
function toMatchDetail() {
  const query: any = {
    game_id: props.matchInfo.id,
    is_end: true,
    show: true,
  }
  matchDetailQuery.value = query
}
</script>

<template>
  <div class="results-bet-item" @click="toMatchDetail">
    <div class="results-header">
      <div>
        <van-image
          class="game-logo"
          width="16"
          height="16"
          :src="matchInfo.game_type_logo"
          :error-icon="defaultImg"
          :show-loading="false"
        />
        <span class="bo">{{ `BO${matchInfo.matches}` }}</span>
        <span class="vertical" />
        <span class="game-name van-ellipsis">{{ matchInfo.event_name }}</span>
        <span class="start-time">+{{ matchInfo.play_count }}</span>
      </div>
      <div>{{ parseTime(matchInfo.game_start_time, '{m}-{d} {h}:{i}') }}</div>
    </div>
    <div class="results-bottom">
      <div class="results-bottom-left">
        <div>
          <van-image
            width="32"
            height="32"
            :src="matchInfo.team_logo_1"
            :error-icon="defaultImg"
            :show-loading="false"
          />
          <span>{{ matchInfo.team_name_1 }}</span>
        </div>
        <div>
          <van-image
            width="32"
            height="32"
            :src="matchInfo.team_logo_2"
            :error-icon="defaultImg"
            :show-loading="false"
          />
          <span>{{ matchInfo.team_name_2 }}</span>
        </div>
      </div>
      <div class="results-bottom-right">
        <div class="results-bottom-right-l">
          <div class="results-bottom-right-l-bg">
            <span>{{ matchInfo.score_1 }}</span>
            <van-image
              width="28"
              height="28"
              :src="statusTab(matchInfo, matchInfo.team_id_1)"
              :error-icon="defaultImg"
              :show-loading="false"
            />
          </div>
          <div class="results-bottom-right-l-bg">
            <span>{{ matchInfo.score_2 }}</span>
            <van-image
              width="28"
              height="28"
              :src="statusTab(matchInfo, matchInfo.team_id_2)"
              :error-icon="defaultImg"
              :show-loading="false"
            />
          </div>
        </div>
        <!-- <div class="results-bottom-right-r">
          {{ matchInfo.score_1 }} - {{ matchInfo.score_2 }}
        </div> -->
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.results-bet-item {
  width: calc(100% - 72px);
  margin: 0 auto 12px;
  padding: 14px 18px;
  background: #262d34;
  border-radius: 16px;

  .results-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    overflow: hidden;

    :deep(.van-image__error, .van-image__loading) {
      background: transparent;

      img {
        width: 16px;
        height: 16px;
      }
    }

    div:nth-child(1) {
      display: flex;
      align-items: center;
      flex-grow: 1;
      overflow: hidden;

      .game-logo {
        width: 16px;
        height: 16px;
        flex-shrink: 0;
        flex-grow: 0;
      }

      .bo {
        font-size: 12px;
        color: #fff;
        font-weight: 600;
        margin-left: 8px;
        flex-shrink: 0;
      }

      .vertical {
        width: 1px;
        height: 10px;
        background: rgba(255 255 255 / 10%);
        border-radius: 0.5px;
        margin: 0 4px;
        flex-shrink: 0;
      }

      .game-name {
        font-size: 12px;
        color: rgba(255 255 255 / 60%);
        font-weight: 400;
        // flex-grow: 1;
      }
      .start-time {
        font-size: 12px;
        color: rgba(255 255 255 / 60%);
        font-weight: 500;
        padding:0 26px 0 6px;
        flex-shrink: 0;
      }
    }

    div:nth-child(2) {
      font-size: 12px;
      color: rgba(255 255 255 / 60%);
      font-weight: 500;
      flex-shrink: 0;
      margin-left: 12px;
    }
  }

  .results-bottom {
    display: flex;
    margin-top: 20px;

    &-left {
      display: flex;
      flex-direction: column;
      flex-grow: 1;

      &:deep(.van-image) {
        flex-shrink: 0;
        width: 32px;
        height: 32px;
      }

      &:deep(.van-image__error, .van-image__loading) {
        background: transparent;
        flex-shrink: 0;
        width: 32px;
        height: 32px;
        img {
          width: 32px;
          height: 32px;
        }
      }

      div {
        display: flex;
        align-items: center;
        margin-top: 14px;
        font-size: 14px;
        color: rgba(255 255 255 / 60%);
        // text-align: center;
        font-weight: 500;

        span {
          padding-left: 14px;
          word-break: break-all;
        }
      }

      div:nth-child(1) {
        margin-top: 0;
      }
    }

    &-right {
      display: flex;
      width: 114px;
      margin-left: 12px;
      flex-shrink: 0;

      &-l {
        display: flex;
        flex-direction: column;
        width: 100%;

        :deep(.van-image__error, .van-image__loading) {
          background: transparent;

          img {
            width: 32px;
            height: 32px;
          }
        }

        &-bg {
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-direction: initial;
          width: calc(100% - 18px);
          height: 36px;
          background: rgba(255 255 255 / 6%);
          border-radius: 4px;
          padding: 0 10px;

          span {
            font-size: 18px;
            color: #fff;
            font-weight: 500;
          }
        }

        div:nth-child(1) {
          margin-bottom: 8px;
        }

        img {
          width: 32px;
          height: 32px;
        }
      }

      // &-r {
      //   display: flex;
      //   justify-content: center;
      //   align-items: center;
      //   width: calc(100% - 8px);
      //   height: 80px;
      //   background: rgba(255 255 255 / 6%);
      //   border-radius: 4px;
      //   margin-left: 8px;
      //   font-size: 12px;
      //   color: #fff;
      //   font-weight: 500;

      //   img {
      //     width: 36px;
      //     height: 36px;
      //   }
      // }
    }
  }
}
</style>

<script lang="ts" setup name="UnMain">
import UniversalBox from './components/UniversalBox.vue'
import videoAndAnimationHook from '@/hooks/videoAndAnimationHook'
import { parseTime, setItemName } from '@/utils'
import defaultIcon from '@/assets/home/default.png'
import videoIcon from '@/assets/home/home_live.png'
import animationIcon from '@/assets/home/home_ score board.png'
import rollIcon from '@/assets/home/home_live_provide.png'
import findMoreNor from '@/assets/home/find_ more_nor.png'
import type { BetType } from '@/interface/shopCart'
import { globalApiConfigStore } from '@/store/globalApiConfig'
const props = defineProps({
  itemInfo: {
    type: Object,
    default: () => {},
  },
})

const { matchDetailQuery } = storeToRefs(globalApiConfigStore())

const gameShowPopover = ref(false)

const { videoHas, animationHas } = videoAndAnimationHook(props.itemInfo)

const betType: BetType = inject('betType', 'single')

const hasPlayInfo = computed(() => {
  return (
    !Array.isArray(props.itemInfo.recommend_play)
    && props.itemInfo.recommend_play?.id
  )
})

/**
 * @description 战队名称
 * */
function teamName(num: number) {
  if (hasPlayInfo.value) {
    return props.itemInfo.recommend_play.team_points[num - 1]?.desc
  }
  else {
    return props.itemInfo[`team_name_${num}`] || 'IA ESPORT'
  }
}

// watch(
//   () => props.itemInfo.game_start_time,
//   () => {
//     setTime()
//   },
// )

const route = useRoute()

const isLeaguePage = route.name === 'LeaguePage'

const handicap: any = inject('handicap', '')

const router = useRouter()

function toMatchDetail(params?: 'video' | 'animate' | null) {
  const query: any = {
    game_id: props.itemInfo.id,
    betType,
    show: true,
  }
  if (hasPlayInfo.value) {
    query.match = props.itemInfo.recommend_play?.match
  }
  if (params) {
    Object.assign(query, { type: params })
  }
  matchDetailQuery.value = query
}
</script>

<template>
  <div class="bet-main">
    <div class="bet-main-header">
      <div class="bet-main-header-left">
        <van-image
          width="16"
          height="16"
          fit="contain"
          class="bet-main-header-img"
          :src="itemInfo.game_type_logo ? itemInfo.game_type_logo : defaultIcon"
          :error-icon="defaultIcon"
          :show-loading="false"
          lazy-load
        />
        <span class="game-name van-ellipsis">{{ itemInfo.event_name }}</span>
        <div class="game-roll">
          <!-- <van-image
            v-if="
              itemInfo.category_id === 2 && itemInfo.bowls_prediction
            "
            class="roll-icon"
            :src="rollIcon"
          /> -->
          <div v-if="+itemInfo.category_id === 3" class="container">
            <span />
            <span />
            <span />
          </div>
        </div>
        <div
          class="start-time"
          :class="{ 'is-tom': +itemInfo.category_id !== 3 }"
        >
          <span v-if="+itemInfo.category_id !== 3">
            {{
              parseTime(
                Number(
                  String(
                    itemInfo.game_start_time ? itemInfo.game_start_time : 0,
                  ).padEnd(13, "0"),
                ),
                "{m}-{d} {h}:{i}",
              )
            }}
          </span>
          <span v-else>
            {{
              parseTime(
                Number(
                  String(
                    itemInfo.game_start_time ? itemInfo.game_start_time : 0,
                  ).padEnd(13, "0"),
                ),
                "{h}:{i}",
              )
            }}
          </span>
        </div>
        <span class="game-count">+{{ itemInfo.play_count }}</span>
      </div>
      <div
        v-if="!isLeaguePage && (videoHas || animationHas)"
        class="bet-main-header-right-list"
      >
        <img
          v-if="videoHas"
          :src="videoIcon"
          @click.stop="toMatchDetail('video')"
        >
        <!-- v-if="animationHas" -->
        <img
          v-if="animationHas"
          :src="animationIcon"
          @click.stop="toMatchDetail('animate')"
        >
      </div>
      <div
        v-if="isLeaguePage && (videoHas || animationHas)"
        class="bet-main-header-right"
      >
        <van-popover
          v-model:show="gameShowPopover"
          :overlay="true"
          overlay-class="game-popover"
          theme="dark"
          placement="bottom-end"
        >
          <template #reference>
            <img :src="findMoreNor" @click.stop="gameShowPopover = true">
          </template>
          <template #default>
            <div class="game-popover-main">
              <img
                v-if="videoHas"
                :src="videoIcon"
                @click.stop="toMatchDetail('video')"
              >
              <img
                v-if="animationHas"
                :src="animationIcon"
                @click.stop="toMatchDetail('animate')"
              >
            </div>
          </template>
        </van-popover>
      </div>
    </div>
    <div class="bet-main-middle">
      <div class="bet-main-middle-l">
        <van-image
          width="32"
          height="32"
          fit="contain"
          :src="itemInfo.team_logo_1 ? itemInfo.team_logo_1 : defaultIcon"
          :error-icon="defaultIcon"
          :show-loading="false"
          lazy-load
        />
        <span class="van-ellipsis">{{ teamName(1) }}</span>
      </div>
      <div class="bet-main-middle-c">
        <div class="score">
          <span>{{ itemInfo.score_1 }}</span>
          <span>-</span>
          <span>{{ itemInfo.score_2 }}</span>
        </div>
        <div class="play-result van-multi-ellipsis--l3">
          <span
            v-if="itemInfo.recommend_play?.match >= 0"
            style="margin-right: 4px"
          >
            {{
              setItemName(
                +itemInfo.recommend_play.match,
                itemInfo.recommend_play.stage_name,
              ).label
            }}
          </span>
          <span>{{ itemInfo.recommend_play?.name }}</span>
        </div>
      </div>
      <div class="bet-main-middle-r">
        <van-image
          width="32"
          height="32"
          fit="contain"
          :src="itemInfo.team_logo_2 ? itemInfo.team_logo_2 : defaultIcon"
          :error-icon="defaultIcon"
          :show-loading="false"
          lazy-load
        />
        <span class="van-ellipsis">{{ teamName(2) }}</span>
      </div>
    </div>
    <div class="bet-main-footer">
      <UniversalBox
        :key="itemInfo ? `${itemInfo.recommend_play?.id || 0}0` : 0"
        :team-info="itemInfo"
        :index="0"
      />
      <UniversalBox
        v-if="
          itemInfo.recommend_play?.id
            && itemInfo.recommend_play?.team_points.length === 3
        "
        :key="itemInfo ? `${itemInfo.recommend_play?.id || 2}2` : 0"
        :team-info="itemInfo"
        :index="2"
        style="margin: 0 16px"
      />
      <UniversalBox
        :key="itemInfo ? `${itemInfo.recommend_play?.id || 1}1` : 1"
        :team-info="itemInfo"
        :index="1"
      />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.bet-main-header-right-list {
  display: flex;
  flex-shrink: 0;
  padding-left: 8px;
  img {
    height: 16px;
    width: 16px;
    & + img {
      margin-left: 8px;
    }
  }
}
.bet-main {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 140px;
  padding: 12px 14px;

  .bet-main-header {
    display: flex;
    height: 26px;
    align-items: center;
    justify-content: space-between;
    font-size: 12px;
    color: rgba(255 255 255 / 60%);
    font-weight: 400;
    overflow: hidden;
    flex-wrap: nowrap;

    .bet-main-header-img {
      flex-shrink: 0;
    }

    .bet-main-header-left {
      // flex-shrink: 0;
      overflow: hidden;
      display: flex;
      height: 26px;
      align-items: center;
      max-width: calc(100% - var(--header-width) * 1px);

      :deep(.van-image__error, .van-image__loading) {
        background: transparent;

        img {
          width: 16px;
          height: 16px;
        }
      }
      .is-tom {
        background: rgba(255, 255, 255, 0.1) !important;
        border: 1px solid rgba(255, 255, 255, 0.2) !important;
        color: rgba(255, 255, 255, 0.6) !important;
      }

      .start-time {
        display: flex;
        flex-shrink: 0;
        justify-content: space-between;
        align-items: center;
        height: 16px;
        background: rgba(254 94 0 / 10%);
        border: 1px solid rgba(254 94 0 / 40%);
        font-size: 10px;
        color: #fe5e00;
        font-weight: 400;
        padding: 0 4px;
        border-radius: 2px;
        margin-left: 8px;
        span {
          display: inline-block;
        }

        span + span {
          margin-left: 4px;
        }

        &:deep(.van-count-down) {
          color: #fe5e00;
          font-size: 10px;
          min-width: 35px;
          text-align: center;
        }
      }

      .game-count {
        // width: 26px;
        margin: 0 6px;
        text-align: right;
      }

      @keyframes movement {
        0% {
          height: 30%;
        }

        100% {
          height: 100%;
        }
      }

      .container {
        position: relative;
        width: 16px;
        height: 16px;

        span {
          position: absolute;
          bottom: 0;
          width: 2px;
          height: 100%;
          border-radius: 50px;
          background-color: #fe5e00;
          vertical-align: middle;
          display: inline-block;
        }

        span:nth-child(1) {
          left: 0;
          animation: 500ms linear 0s infinite alternate none running movement;
        }

        span:nth-child(2) {
          left: 6px;
          animation: 500ms linear 0.3s infinite alternate none running movement;
        }

        span:nth-child(3) {
          left: 12px;
          animation: 500ms linear 0.6s infinite alternate none running movement;
        }
      }

      .game-roll {
        max-width: 16px;
        height: 16px;
        .game-coming {
          height: 16px;
          width: 16px;
        }
      }

      .game-logo,
      .roll-icon {
        width: 16px;
        height: 16px;
      }

      .bo {
        font-size: 12px;
        color: #fff;
        font-weight: 600;
        margin-left: 8px;
      }

      .vertical {
        width: 1px;
        height: 10px;
        background: rgba(255 255 255 / 10%);
        border-radius: 0.5px;
        margin: 0 4px;
      }

      .game-name {
        min-width: 5px;
        // max-width: 70px;
        margin: 0 6px;
        flex-grow: 1;
      }

      .ball {
        display: flex;
        justify-content: center;
        align-items: center;
        width: 28px;
        height: 16px;
        background: rgba(254 94 0 / 10%);
        border: 1px solid rgba(254 94 0 / 40%);
        border-radius: 2px;
        font-size: 10px;
        color: #fe5e00;
        font-weight: 400;
        margin-left: 12px;
        margin-right: 16px;
      }

      .video-icon {
        display: flex;
        align-items: center;
        font-size: 12px;
        color: rgba(255 255 255 / 60%);
        text-align: right;
        font-weight: 500;
        font-family: Gotham-Medium;

        img {
          width: 12px;
          height: 12px;
        }
      }
    }

    &-right {
      display: flex;
      flex-shrink: 0;
      align-items: center;

      img {
        width: 16px;
        height: 16px;
        margin-left: 8px;
        margin-top: 2px;
      }
    }
  }

  &-middle {
    display: flex;
    justify-content: space-between;

    :deep(.van-image__error, .van-image__loading) {
      background: transparent !important;

      img {
        width: 32px;
        height: 32px;
      }
    }

    &-l {
      display: flex;
      width: calc(50% - 30px);
      flex-direction: column;
      align-items: center;

      span {
        opacity: 0.6;
        font-size: 14px;
        color: #fff;
        font-weight: 500;
        margin-top: 8px;
        width: 100%;
        text-align: center;
      }
    }

    &-c {
      display: flex;
      width: 60px;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      font-size: 12px;
      color: rgb(255 255 255 / 30%);
      text-align: center;
      font-weight: 400;
      font-family: Gotham-Medium;

      .score {
        font-size: 18px;
        color: #fff;
        text-align: center;
        font-weight: 500;
        margin-bottom: 8px;
        white-space: nowrap;

        span:nth-child(2) {
          margin: 0 4px;
        }
      }
    }

    &-r {
      display: flex;
      width: calc(50% - 30px);
      flex-direction: column;
      align-items: center;

      span {
        opacity: 0.6;
        font-size: 14px;
        color: #fff;
        font-weight: 500;
        margin-top: 8px;
        width: 100%;
        text-align: center;
      }
    }
  }

  &-footer {
    display: flex;
    justify-content: space-between;

    .odds {
      display: flex;
      width: calc(50% - 15px);
      height: 36px;
      align-items: center;
      justify-content: center;
      background: rgba(255 255 255 / 6%);
      border-radius: 4px;
      font-size: 14px;
      color: #fff;
      font-weight: 500;
      transition: all 0.2s linear;
      &:active {
        opacity: 0.6;
        transform: scale(0.8);
      }
    }

    .odds-b {
      background-image: linear-gradient(90deg, #f16720 0%, #fd8908 94%);
    }
  }
}
</style>

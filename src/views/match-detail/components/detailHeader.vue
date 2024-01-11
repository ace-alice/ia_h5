<script setup lang="ts">
import LiveBox from './liveBox.vue'
import AnimateBox from './animateBox.vue'
import videoAndAnimationHook from '@/hooks/videoAndAnimationHook'
import videoIcon from '@/assets/home/home_live.png'
import animationIcon from '@/assets/home/home_ score board.png'
import defaultIcon from '@/assets/home/default.png'
import closeIcon from '@/assets/home/com_closed.png'
import { parseTime } from '@/utils'
const props = defineProps({
  matchDetail: {
    type: Object,
    default: () => {},
  },
  headerStyle: {
    type: String,
    default: '',
  },
  currentTop: {
    type: Number,
    default: 0,
  },
})
const emit = defineEmits(['showVideoEmit', 'showAnimateEmit'])

const { videoHas, animationHas } = videoAndAnimationHook(props.matchDetail)

const showVideo = inject('showVideo', false)

const showAnimate = inject('showAnimate', false)

// const minHeightHeader = (document.body.clientWidth / 375) * 80

// const maxHeightHeader = (document.body.clientWidth / 375) * 160

function showVideoHnadle() {
  emit('showVideoEmit')
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

function showAnimateHnadle() {
  emit('showAnimateEmit')
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

function closeHandle() {
  emit('showVideoEmit', false)
  emit('showAnimateEmit', false)
}
</script>

<template>
  <div class="game-mid" :class="headerStyle">
    <div class="top-header" />
    <div v-if="showVideo || showAnimate" class="video-animate-box">
      <LiveBox v-if="showVideo" :match-detail="matchDetail" />
      <AnimateBox v-if="showAnimate" :match-detail="matchDetail" />
      <div class="live-box-info">
        <div class="live-box-left">
          <div class="van-ellipsis">
            {{ matchDetail.event_name }}
          </div>
        </div>
        <div class="live-box-right">
          <van-image
            width="32"
            height="32"
            :src="matchDetail.team_logo_1"
            :error-icon="defaultIcon"
            :show-loading="false"
          />
          <span>{{ matchDetail.score_1 }} - {{ matchDetail.score_2 }}</span>
          <van-image
            width="32"
            height="32"
            :src="matchDetail.team_logo_2"
            :error-icon="defaultIcon"
            :show-loading="false"
          />
        </div>
      </div>
      <div class="close-icon" @click.stop="closeHandle">
        <van-image
          width="24"
          height="24"
          :src="closeIcon"
          :error-icon="defaultIcon"
          :show-loading="false"
        />
      </div>
    </div>
    <!-- :style="{
        height: `${
          maxHeightHeader - currentTop > minHeightHeader
            ? maxHeightHeader - currentTop
            : minHeightHeader
        }px`,
      }" -->
    <div v-else class="game-info" :class="{ [`header-bg-${matchDetail.game_type_id}`]: true }">
      <div class="game-info-header">
        <div>
          <van-image
            class="game-logo"
            width="16"
            height="16"
            :src="matchDetail.game_type_logo"
            :error-icon="defaultIcon"
            :show-loading="false"
          />
          <span v-if="matchDetail.matches > 1" class="bo">{{ `BO${matchDetail.matches}` }}</span>
          <span class="vertical" :style="{ opacity: matchDetail.matches > 1 ? 'unset' : 0 }" />
          <span class="game-name van-ellipsis">{{
            matchDetail.event_name
          }}</span>
        </div>
        <div>
          <img v-if="videoHas" :src="videoIcon" @click.stop="showVideoHnadle">
          <img
            v-if="animationHas"
            :src="animationIcon"
            @click.stop="showAnimateHnadle"
          >
        </div>
      </div>
      <div class="game-info-content">
        <div class="game-info-content-l">
          <van-image
            width="32"
            height="32"
            :src="matchDetail.team_logo_1"
            :error-icon="defaultIcon"
            :show-loading="false"
          />
          <span class="team-name">{{ matchDetail.team_name_1 }}</span>
        </div>
        <div class="game-info-content-m">
          <div>
            <span>{{ matchDetail.score_1 }} - {{ matchDetail.score_2 }}</span>
            <span v-if="matchDetail.game_start_time" class="game-md">
              {{
                parseTime(
                  Number(
                    String(
                      matchDetail.game_start_time
                        ? matchDetail.game_start_time
                        : 0,
                    ).padEnd(13, "0"),
                  ),
                  "{m} - {d}",
                )
              }}
            </span>
          </div>
          <div class="game-hm">
            <span v-if="matchDetail.game_start_time">
              {{
                parseTime(
                  Number(
                    String(
                      matchDetail.game_start_time
                        ? matchDetail.game_start_time
                        : 0,
                    ).padEnd(13, "0"),
                  ),
                  "{h}:{i}",
                )
              }}
            </span>
          </div>
        </div>
        <div class="game-info-content-r">
          <van-image
            width="32"
            height="32"
            :src="matchDetail.team_logo_2"
            :error-icon="defaultIcon"
            :show-loading="false"
          />
          <span class="team-name">{{ matchDetail.team_name_2 }}</span>
        </div>
      </div>
    </div>
    <div id="detailHeaderBottom" />
  </div>
</template>

<style lang="scss" scoped>
#detailHeaderBottom {
  height: 1px;
  width: 100%;
  display: none;
}
.video-animate-box {
  background: #262d34;
  border-radius: 8px;
  width: calc(100% - 36px);
  margin: 8px auto auto;
  overflow: hidden;
  position: relative;
  box-shadow: 0 10px 5px -5px rgba(0 0 0 / 50%);

  .close-icon {
    background-color: #00000020;
    display: flex;
    justify-content: center;
    align-items: center;
    width: 36px;
    height: 36px;
    border-radius: 50%;
    position: absolute;
    top: 12px;
    right: 12px;
    z-index: 2400;
  }

  .live-box-info {
    display: flex;
    justify-content: space-between;
    padding: 17px 12px;
    align-items: center;

    .live-box-left {
      display: flex;
      flex-direction: column;
      width: 50%;

      & > div {
        &:nth-child(1) {
          opacity: 0.6;
          font-family: PingFangSC-Regular;
          font-size: 14px;
          color: #fff;
          margin-top: 8px;
        }
      }
    }

    .live-box-right {
      display: flex;
      align-items: center;

      span {
        font-family: Gotham-Medium;
        font-size: 18px;
        color: #fff;
        text-align: center;
        font-weight: 500;
        margin: 0 12px;
      }

      :deep(.van-image__error, .van-image__loading) {
        background: transparent;

        img {
          width: 32px;
          height: 32px;
        }
      }
    }
  }
}

.game-mid {
  width: 100%;
  background: #181c22;
  z-index: 1000;
  // overflow: hidden;
  flex-shrink: 0;
  // min-height: 105px;
  // padding-bottom: 5px;
  .top-header {
    background: #0e1519;
    height: 8px;
    width: 100%;
    margin-bottom: 10px;
  }
}

.header-bg-1 {
  background-image: url("@/assets/hederBg/image_pkbg_lol.png") !important;
}
.header-bg-2 {
  background-image: url("@/assets/hederBg/image_pkbg_dota2.png") !important;
}
.header-bg-3 {
  background-image: url("@/assets/hederBg/image_pkbg_csgo.png") !important;
}
.header-bg-16 {
  background-image: url("@/assets/hederBg/image_pkbg_wzry.png") !important;
}
.header-bg-28 {
  background-image: url("@/assets/hederBg/image_pkbg_jdqs.png") !important;
}
.header-bg-44 {
  background-image: url("@/assets/hederBg/image_pkbg_lol.png") !important;
}
.header-bg-36 {
  background-image: url("@/assets/hederBg/image_pkbg_mobileLegends.png") !important;
}
.header-bg-35 {
  background-image: url("@/assets/hederBg/image_pkbg_arenaofvalor.png") !important;
}
.header-bg-47 {
  background-image: url("@/assets/hederBg/image_pkbg_jdqs.png") !important;
}
.header-bg-8 {
  background-image: url("@/assets/hederBg/image_pkbg_fifa.png") !important;
}
.header-bg-9 {
  background-image: url("@/assets/hederBg/image_pkbg_beasktball.png") !important;
}
.header-bg-43 {
  background-image: url("@/assets/hederBg/image_pkbg_val.png") !important;
}
.header-bg-24 {
  background-image: url("@/assets/hederBg/image_pkbg_cf.png") !important;
}
.header-bg-26 {
  background-image: url("@/assets/hederBg/image_pkbg_rainsix.png") !important;
}
.header-bg-21 {
  background-image: url("@/assets/hederBg/image_pkbg_overwatch.png") !important;
}
.header-bg-4 {
  background-image: url("@/assets/hederBg/image_pkbg_starcraft.png") !important;
}
.header-bg-23 {
  background-image: url("@/assets/hederBg/image_pkbg_starcraft.png") !important;
}
.header-bg-37 {
  background-image: url("@/assets/hederBg/image_pkbg_warcraft.png") !important;
}
.header-bg-30 {
  background-image: url("@/assets/hederBg/image_pkbg_callofduty.png") !important;
}
.header-bg-32 {
  background-image: url("@/assets/hederBg/image_pkbg_callofduty.png") !important;
}
.header-bg-34 {
  background-image: url("@/assets/hederBg/image_pkbg_rocketleague.png") !important;
}
.header-bg-31 {
  background-image: url("@/assets/hederBg/image_pkbg_fifa.png") !important;
}
.header-bg-42 {
  background-image: url("@/assets/hederBg/image_pkbg_nba.png") !important;
}
.header-bg-7 {
  background-image: url("@/assets/hederBg/image_pkbg_age.png") !important;
}
.header-bg-10 {
  background-image: url("@/assets/hederBg/image_pkbg_brawlstars.png") !important;
}
.header-bg-41 {
  background-image: url("@/assets/hederBg/image_pkbg_boxing.png") !important;
}

.game-info {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: calc(100% - 32px);
  height: 160px;
  border-radius: 16px;
  background-image: url("@/assets/hederBg/image_pkbg_lol.png");
  background-size: 100%;
  background-repeat: no-repeat;
  margin: auto;
  // transition: all 0.1s ease-in-out;
  overflow: hidden;

  .game-md,
  .game-hm,
  .team-name {
    animation: all 0.1s linear;
  }
  .team-name {
    width: calc(100% - 8px);
    white-space: pre-wrap;
    word-break: break-all;
  }

  &-header {
    display: flex;
    justify-content: space-between;
    width: calc(100% - 32px);
    height: 40px;
    flex-shrink: 0;

    & > div:nth-child(1) {
      display: flex;
      align-items: center;
      flex-grow: 1;

      .game-logo {
        width: 16px;
        height: 16px;

        :deep(.van-image__error, .van-image__loading) {
          background: transparent;
        }
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
        font-size: 12px;
        color: rgba(255 255 255 / 60%);
        font-weight: 400;
        width: calc(100vw - 170px);
        overflow: hidden;
      }
    }

    div:nth-child(2) {
      display: flex;
      align-items: center;
      flex-shrink: 0;

      img {
        width: 16px;
        height: 16px;
        margin-left: 10px;
      }
    }
  }

  &-content {
    display: flex;
    // align-items: center;
    margin-top: 24px;
    width: 100%;
    transition: all 0.1s ease-in-out;

    :deep(.van-image__error, .van-image__loading) {
      background: transparent;

      img {
        width: 32px;
        height: 32px;
      }
    }

    &-l {
      display: flex;
      flex-direction: column;
      align-items: center;
      width: calc(50% - 38px);

      img {
        width: 32px;
        height: 32px;
      }

      span {
        font-size: 14px;
        color: rgba(255 255 255 / 60%);
        text-align: center;
        font-weight: 500;
        margin-top: 18px;
      }
    }

    &-m {
      display: flex;
      flex-direction: column;
      width: 76px;

      div:nth-child(1) {
        display: flex;
        flex-direction: column;
        align-items: center;
        white-space: nowrap;

        span:nth-child(1) {
          font-size: 18px;
          color: #fff;
          font-weight: 500;
          font-family: Gotham-Medium;
        }

        span:nth-child(2) {
          font-size: 12px;
          color: #fe5e00;
          font-weight: 500;
          margin-top: 4px;
        }
      }

      div:nth-child(2) {
        display: flex;
        margin-top: 12px;

        span {
          display: flex;
          justify-content: center;
          align-items: center;
          width: 72px;
          height: 20px;
          background: rgba(255 255 255 / 10%);
          border-radius: 18px;
          font-size: 12px;
          color: rgba(255 255 255 / 60%);
          font-weight: 500;
        }
      }
    }

    &-r {
      display: flex;
      flex-direction: column;
      align-items: center;
      width: calc(50% - 38px);

      img {
        width: 32px;
        height: 32px;
      }

      span {
        font-size: 14px;
        color: rgba(255 255 255 / 60%);
        text-align: center;
        font-weight: 500;
        margin-top: 18px;
      }
    }
  }
}

.game-shadow {
  .game-info {
    height: 80px;
    box-shadow: 0 8px 5px -3px rgba(0 0 0 / 50%);
  }

  .game-info-content {
    margin-top: 0;
  }
  .game-info-content-m {
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .game-md,
  .game-hm,
  .team-name {
    display: none !important;
    opacity: 0;
  }
}
</style>

<!-- eslint-disable @typescript-eslint/no-use-before-define -->
<script setup lang="ts" name="MatchDetail">
import DetailPageHeader from './components/DetailPageHeader.vue'
import detailHeader from './components/detailHeader.vue'
import ItemDetail from './components/itemDetail.vue'
import matchDetailHook from '@/hooks/matchDetailHook'
// import homeGameIcon from '@/assets/home/home_game.png'
import MatchDetailSkeleton from '@/components/MatchDetailSkeleton/index.vue'
import Ct_more_up from '@/assets/home/Ct_ more_up.png'
import { globalApiConfigStore } from '@/store/globalApiConfig'
// import Dis_logo from '@/assets/home/xiangqing_icon_01.png'
import Daxiao_av from '@/assets/home/xiangqing_daxiao_01.png'
import Rangfen_av from '@/assets/home/xiangqing_rangfen_01.png'
// import Rangfen_dis_zh from '@/assets/home/xiangqing_rangfen_04.png'
import Rangfen_av_zh from '@/assets/home/xiangqing_rangfen_02.png'
// import Rangfen_dis_en from '@/assets/home/xiangqing_rangfen_05.png'
import Rangfen_av_en from '@/assets/home/xiangqing_rangfen_03.png'
// import Daxiao_dis_zh from '@/assets/home/xiangqing_daxiao_04.png'
import Daxiao_av_zh from '@/assets/home/xiangqing_daxiao_02.png'
// import Daxiao_dis_en from '@/assets/home/xiangqing_daxiao_05.png'
import Daxiao_av_en from '@/assets/home/xiangqing_daxiao_03.png'
import EndRoundIcon from '@/assets/home/home_ startmurder_03.png'
import FixRoundIcon from '@/assets/home/home_ startmurder_02.png'
import LiveRoundIcon from '@/assets/home/home_ startmurder_01.png'
import EndFolIcon from '@/assets/home/home_ turnend.png'
import { getLocal } from '@/utils/storage'

const {
  matchDetail,
  tabIndex,
  init,
  roundList,
  detailScroll,
  headerStyle,
  tabsRef,
  showAnimateHandle,
  showVideoHandle,
  clickTab,
  currentTop,
  itemDetailGroupRef,
  intersectionObserverRef,
  filterValue,
  emitChangeFilterValue,
} = matchDetailHook()

const is_zh = +(getLocal('lang') || 1) === 1

const filterList = [
  {
    code: 'handicap',
    color: '#4986F9',
    // dis_logo: Dis_logo,
    av_logo: Rangfen_av,
    // dis_text: is_zh ? Rangfen_dis_zh : Rangfen_dis_en,
    av_text: is_zh ? Rangfen_av_zh : Rangfen_av_en,
  },
  {
    code: 'over',
    color: '#DFB162',
    // dis_logo: Dis_logo,
    av_logo: Daxiao_av,
    // dis_text: is_zh ? Daxiao_dis_zh : Daxiao_dis_en,
    av_text: is_zh ? Daxiao_av_zh : Daxiao_av_en,
  },
]

function getListForStatus(list: any[], status: 'yes' | 'no' = 'no'): any[] {
  const tempArr: any = []
  if (filterValue.value === 'handicap') {
    list = list.filter((play) => {
      return [1, 3].includes(+play.ext_type)
    })
  }
  if (filterValue.value === 'over') {
    list = list.filter((play) => {
      return [4, 5, 11, 13].includes(+play.ext_type)
    })
  }
  if (status === 'yes') {
    if (+matchDetail.value.winner_team_id) {
      return list.sort(
        (a: any, b: any) => (a.play_count || 0) - (b.play_count || 0),
      )
    }
    else {
      for (const play of list) {
        if (play.team_points && Array.isArray(play.team_points)) {
          const allNot = play.team_points.some((pointD: any) => {
            return !pointD.win_loss_status
          })
          !allNot || tempArr.push(play)
        }
      }
      return tempArr.sort((a: any, b: any) => {
        if (b.play_count === a.play_count) {
          if (
            +a.ext_type === +b.ext_type
                && [1, 3, 4, 5, 11, 13].includes(a.ext_type)
          ) {
            const extContentA = JSON.parse(a.play_type_ext)
            const extContentB = JSON.parse(b.play_type_ext)
            if ([1, 3, 11, 13].includes(a.ext_type)) {
              if (
                extContentA.team_id
                    && extContentB.team_id
                    && extContentA.number
                    && extContentB.number
                    && +extContentA.team_id === +extContentB.team_id
              ) {
                return extContentA.number - extContentB.number
              }
            }
            if ([4, 5].includes(a.ext_type)) {
              if (extContentA && extContentB) {
                return extContentA - extContentB
              }
            }
          }
          return a.id - b.id
        }
        else if (b.play_count || a.play_count) {
          return (a.play_count || 0) - (b.play_count || 0)
        }
        else if (!b.play_count && !a.play_count) {
          return a.id - b.id
        }
        else {
          return (a.play_count || 0) - (b.play_count || 0)
        }
      })
    }
  }
  else {
    if (+matchDetail.value.winner_team_id) {
      return []
    }
    else {
      for (const play of list) {
        if (play.team_points && Array.isArray(play.team_points)) {
          const allNot = play.team_points.every((pointD: any) => {
            return pointD.win_loss_status
          })
          !allNot || tempArr.push(play)
        }
      }
      return tempArr.sort((a: any, b: any) => {
        if (b.play_count === a.play_count) {
          if (
            +a.ext_type === +b.ext_type
                && [1, 3, 4, 5, 11, 13].includes(a.ext_type)
          ) {
            const extContentA = JSON.parse(a.play_type_ext)
            const extContentB = JSON.parse(b.play_type_ext)
            if ([1, 3, 11, 13].includes(a.ext_type)) {
              if (
                extContentA.team_id
                    && extContentB.team_id
                    && extContentA.number
                    && extContentB.number
                    && +extContentA.team_id === +extContentB.team_id
              ) {
                return extContentA.number - extContentB.number
              }
            }
            if ([4, 5].includes(a.ext_type)) {
              if (extContentA && extContentB) {
                return extContentA - extContentB
              }
            }
          }
          return a.id - b.id
        }
        else if (b.play_count || a.play_count) {
          return (a.play_count || 0) - (b.play_count || 0)
        }
        else if (!b.play_count && !a.play_count) {
          return a.id - b.id
        }
        else {
          return (a.play_count || 0) - (b.play_count || 0)
        }
      })
    }
  }
}

const showNotList = reactive<any>({})

function showNotListHandle(keyL: string, roundVal: any) {
  showNotList[keyL] = !showNotList[keyL]
}

const { isFullscreen } = storeToRefs(globalApiConfigStore())

function leftAndRightIcon(child_plays: any[]) {
  if (matchDetail.value && +matchDetail.value.winner_team_id) {
    return {
      icon: EndRoundIcon,
      isFinish: true,
    }
  }
  let isFinish = false
  if (child_plays.length > 0) {
    isFinish = child_plays.every((play: any) => {
      return +play.winner_point_extra_id
    })
  }
  if (isFinish) {
    return {
      icon: EndRoundIcon,
      isFinish: true,
    }
  }
  if (matchDetail.value && +matchDetail.value.category_id === 3) {
    return {
      icon: LiveRoundIcon,
      isFinish: false,
    }
  }
  else {
    return {
      icon: FixRoundIcon,
      isFinish: false,
    }
  }
}
</script>

<template>
  <div class="detail-box">
    <MatchDetailSkeleton :loading="!init" />
    <template v-if="init">
      <DetailPageHeader
        :is-bind-ant-info="!!matchDetail.is_bind_ant_before_game_info"
      />
      <van-tabs
        ref="tabsRef"
        v-model:active="tabIndex"
        scrollspy
        :line-width="20"
        background="#181c22"
        title-inactive-color="#FFFFFF99"
        title-active-color="#FFFFFF"
        color="#FE5E00"
        @click-tab="clickTab"
      >
        <van-tab
          v-for="round in roundList"
          :key="round.val"
          :title="round.label"
        />
      </van-tabs>
      <detailHeader
        :match-detail="matchDetail"
        :header-style="headerStyle"
        :current-top="currentTop"
        @show-animate-emit="showAnimateHandle"
        @show-video-emit="showVideoHandle"
      />
      <div class="handicap-over-box">
        <div
          v-for="filter in filterList"
          :key="filter.code"
          :style="{
            borderColor: filter.color,
            opacity: filterValue === filter.code ? 1 : 0.5,
            background:
              filterValue === filter.code
                ? 'rgba(0, 0, 0, 0.2)'
                : 'rgba(0, 0, 0, 0)',
          }"
          @click="emitChangeFilterValue(filter.code as any)"
        >
          <img
            class="filter-logo"
            :src="
              filter.av_logo
            "
            alt=""
          >
          <img
            class="filter-text"
            :src="
              filter.av_text
            "
            alt=""
          >
        </div>
      </div>
      <div
        ref="itemDetailGroupRef"
        class="item-detail-group"
        @scroll="detailScroll"
      >
        <div
          v-for="(round, index) in roundList"
          :key="round.val"
          ref="intersectionObserverRef"
          :title="round.label"
          :tabIndex="index"
        >
          <div class="game-num">
            <img :src="leftAndRightIcon(round.list).icon">
            <span>{{ round.label }}</span>
          </div>
          <div class="game-card">
            <div
              v-for="item in getListForStatus(round.list, 'yes')"
              :key="`${item.id}-${item.game_start_time}-${item.event_name}`"
              class="game-card-row"
            >
              <div class="game-card-row-title">
                <span>{{ item.name }}</span>
              </div>
              <ItemDetail
                :play-info="
                  Object.assign(item, {
                    event_name: matchDetail.event_name,
                    game_logo: matchDetail.game_type_logo,
                    team_name_1: matchDetail.team_name_1,
                    team_name_2: matchDetail.team_name_2,
                    is_parlay: matchDetail.is_parlay,
                    game_lang: matchDetail.game_lang,
                  })
                "
              />
            </div>
            <div
              v-show="getListForStatus(round.list, 'no').length > 0"
              class="show-not-bet-btn"
              :class="{
                'show-btn': showNotList[`bo${round.val}`],
              }"
              @click="showNotListHandle(`bo${round.val}`, round.val)"
            >
              <img :src="Ct_more_up" alt="">
              <div>
                {{
                  showNotList[`bo${round.val}`] ? $t("fold") : $t("display_all")
                }}
              </div>
              <div class="status">
                {{ $t("clearinged") }}
              </div>
              <div>{{ $t("handicap") }}</div>
              <img
                v-show="leftAndRightIcon(round.list).isFinish"
                :src="EndFolIcon"
                alt=""
                class="finish-icon"
              >
            </div>
            <transition name="list">
              <div v-show="showNotList[`bo${round.val}`]">
                <div
                  v-for="item in getListForStatus(round.list, 'no')"
                  :key="`${item.id}-${item.game_start_time}-${item.event_name}`"
                  class="game-card-row"
                >
                  <div class="game-card-row-title">
                    <span>{{ item.name }}</span>
                  </div>
                  <ItemDetail
                    :play-info="
                      Object.assign(item, {
                        event_name: matchDetail.event_name,
                        game_logo: matchDetail.game_logo,
                        team_name_1: matchDetail.team_name_1,
                        team_name_2: matchDetail.team_name_2,
                        is_parlay: matchDetail.is_parlay,
                        game_lang: matchDetail.game_lang,
                      })
                    "
                  />
                </div>
              </div>
            </transition>
          </div>
        </div>
        <div class="bottom-box" />
        <BackTop
          v-if="itemDetailGroupRef && !isFullscreen"
          :target="itemDetailGroupRef"
          style="z-index: 2002"
        />
      </div>
    </template>
  </div>
</template>

<style lang="scss" scoped>
.bottom-box {
  width: 100%;
  height: calc(100% - 126px);
  flex-shrink: 0;
}

.detail-box {
  height: 100%;
  width: 100%;
  overflow: hidden;
  background: #181c22;
  display: flex;
  flex-direction: column;
}

:deep(.van-tabs) {
  .van-tabs__nav {
    background: #181c22;
  }
}

.game-num {
  display: flex;
  padding: 12px 18px;
  font-size: 14px;
  color: #fff;
  font-weight: 500;

  img {
    width: 16px;
    height: 16px;
    margin-right: 8px;
  }
}

.game-card {
  display: flex;
  flex-direction: column;
  width: calc(100% - 72px);
  padding: 14px 18px;
  background: #262d34;
  border-radius: 16px;
  margin: 0 auto;

  &-row {
    display: flex;
    flex-direction: column;

    &-title {
      display: flex;
      justify-content: center;
      font-size: 12px;
      color: #fff;
      font-weight: 400;
      margin: 4px 0 12px;
    }

    &-content {
      display: flex;
      flex: 2;
      flex-wrap: wrap;
      justify-content: space-between;
    }
  }
}

.show-not-bet-btn {
  display: flex;
  width: 100%;
  justify-content: center;
  align-items: center;
  height: 22px;
  font-size: 12px;
  color: #ffffff;

  & > * + * {
    margin-left: 12px;
  }

  div {
    opacity: 0.6;
  }

  img {
    height: 16px;
    width: 16px;
    transition: all 0.2s ease-in-out;
    transform: rotateZ(180deg);
  }
}

.show-btn {
  img {
    transform: rotateZ(0);
  }
}
.finish-icon {
  height: 24px !important;
  width: 24px !important;
  transform: none !important;
}

.handicap-over-box {
  width: calc(100% - 52px);
  padding: 10px 26px 4px;
  flex-shrink: 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  & > div {
    height: 24px;
    border-radius: 13px;
    width: 148px;
    border: 1px solid #ffffff;
    display: flex;
    justify-content: center;
    align-items: center;
    position: relative;
    &:active {
      transform: scale(0.9);
    }
    .filter-logo {
      height: 24px;
      width: 24px;
      border-radius: 50%;
      position: absolute;
      top: 0;
      left: 0;
    }

    .filter-text {
      height: 24px;
      transform: translateX(8px);
    }
  }
}

.item-detail-group {
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  overflow-y: auto;
  position: relative;

  .intersection-observer {
    height: 0.5px;
    width: 100%;
  }
}

// :deep(.van-tabs__line) {
//   transition-delay: 0.02s;
//   -webkit-transition-delay: 0.02s;
// }
// :deep(.van-tab) {
//   transition-delay: 0.02s;
//   -webkit-transition-delay: 0.02s;
// }
:deep(.back-top) {
  z-index: 2002;
}
</style>

<script setup lang="ts" name="RaceVsInfo">
import setIconsHook from '../hook'
import { parseTime } from '@/utils'
import shuju_vs_small from '@/assets/matchData/shuju_vs.png'
import shuju_time from '@/assets/matchData/shuju_time.png'
import home_liansai from '@/assets/matchData/home_liansai.png'
import defaultIcon from '@/assets/home/default.png'
import home_shujuteam from '@/assets/matchData/home_shujuteam.png'

const props = defineProps({
  vsInfo: {
    type: Object,
    default: () => {},
  },
  teamInfo: {
    type: Object,
    default: () => {},
  },
  info: {
    type: Object,
    default: () => {},
  },
})
const { icons } = setIconsHook()

const isHistory = inject('isHistory', false)

const wayVsInfo = computed(() => {
  if (isHistory && props.info.length === 2) {
    const theMatch = props.info[1].race_stats.find((stat: any) => {
      return +props.vsInfo.match_id === +stat.match_id
    })
    if (theMatch && props.vsInfo.stats.length === theMatch.stats.length) {
      return Object.assign({}, props.vsInfo, {
        competitor_stats: theMatch.stats,
      })
    }
    return Object.assign({}, props.vsInfo, { stats: [] })
  }
  else {
    return Object.assign({}, props.vsInfo, { stats: [] })
  }
})

function dealTime(dataC: number) {
  return `${Math.floor(dataC / 60)}'${Math.floor(dataC % 60)}`
}
</script>

<template>
  <div class="match-vs-info">
    <div class="event-info">
      <div>
        <van-image
          height="24"
          width="24"
          style="margin-right: 12px"
          :src="home_liansai"
          :error-icon="defaultIcon"
          :show-loading="false"
        />
        {{ vsInfo.league?.abbr || "" }}
      </div>
      <div>
        <span v-if="isHistory" style="font-size: 12px">{{
          parseTime(vsInfo.start_time, "{y}-{m}-{d}")
        }}</span>
      </div>
    </div>
    <div v-if="!isHistory" class="team-vs-info">
      <div style="margin-right: 8px">
        <van-image
          height="24"
          width="24"
          :src="shuju_vs_small"
          :error-icon="defaultIcon"
          :show-loading="false"
          style="margin-right: 12px"
        />
        <span class="abbr-info">{{ teamInfo.abbr || "" }}</span>
        <span style="margin: 0 12px; color: #fff">VS</span>
        <span class="abbr-info">{{ vsInfo.competitor?.abbr || "" }}</span>
      </div>
      <div>
        <span v-if="vsInfo.start_time" style="font-size: 12px">{{
          parseTime(vsInfo.start_time, "{y}-{m}-{d}")
        }}</span>
        <span v-else>--</span>
      </div>
    </div>
    <template v-if="!isHistory">
      <div
        v-for="(item, index) in vsInfo.stats || []"
        :key="index"
        class="vs-info"
      >
        <div>
          <van-image
            height="24"
            width="24"
            :src="shuju_time"
            :error-icon="defaultIcon"
            :show-loading="false"
            style="margin-right: 8px"
          />
          <span class="time-box">{{ dealTime(+item.duration || 0) }}</span>
        </div>
        <div class="score-box">
          <span :class="{ 'is-win': +item.kill > +item.competitor_kill }">{{
            item.kill
          }}</span>:
          <span :class="{ 'is-win': +item.kill < +item.competitor_kill }">{{
            item.competitor_kill
          }}</span>
        </div>
        <div class="icons-show">
          <van-image
            v-for="icon in icons"
            :key="icon.key"
            :src="icon.icon"
            :error-icon="defaultIcon"
            :show-loading="false"
            class="lazy-image"
            :class="{ has: +item[icon.key] || 0 }"
          />
        </div>
      </div>
    </template>
    <template v-else>
      <div
        v-for="(item, index) in wayVsInfo.stats || []"
        :key="index"
        class="vs-info-history"
      >
        <div class="vs-info-top">
          <div class="shuju-time">
            <van-image
              :src="shuju_time"
              :error-icon="defaultIcon"
              :show-loading="false"
              class="lazy-image"
            />
            <span>{{ dealTime(+item.duration || 0) }}</span>
          </div>
          <div class="team-score">
            <span
              :class="{
                'is-win': +item.kill > +item.competitor_kill,
              }"
            >{{ item.kill }}</span>
            :
            <span
              :class="{
                'is-win': +item.kill < +item.competitor_kill,
              }"
            >{{ item.competitor_kill }}</span>
          </div>
        </div>
        <div class="history-vs-box">
          <van-image
            :src="home_shujuteam"
            :error-icon="defaultIcon"
            :show-loading="false"
            class="lazy-image-vs"
          />
          <div class="history-vs-box-item">
            <div class="team-name">
              {{ teamInfo.abbr }}
            </div>
            <div class="icons-show">
              <van-image
                v-for="icon in icons"
                :key="icon.key"
                :src="icon.icon"
                :error-icon="defaultIcon"
                class="lazy-image"
                :show-loading="false"
                :class="{ has: +item[icon.key] || 0 }"
              />
            </div>
          </div>
          <div class="history-vs-box-item">
            <div class="team-name">
              {{ vsInfo.competitor.abbr }}
            </div>
            <div class="icons-show">
              <van-image
                v-for="icon in icons"
                :key="icon.key"
                :src="icon.icon"
                :error-icon="defaultIcon"
                class="lazy-image"
                :show-loading="false"
                :class="{
                  has: +wayVsInfo.competitor_stats[index][icon.key] || 0,
                }"
              />
            </div>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<style scoped lang="scss">
.history-vs-box {
  width: calc(100% - 36px);
  font-size: 14px;
  color: rgba(255, 255, 255, 0.6);
  position: relative;
  .lazy-image-vs{
    height: 24px;
    width: 24px;
    position: absolute;
    top: 0;
    left: -36px;
  }
  .history-vs-box-item {
    display: flex;
    justify-content: space-between;
    flex-grow: 1;
    & + .history-vs-box-item {
      margin-top: 4px;
    }
    .team-name {
      line-height: 20px;
      max-width: 80px;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    }

    .icons-show {
      display: flex;
      align-items: center;
      .lazy-image {
        opacity: 0.4;
        height: 20px;
        width: 20px;
        flex-shrink: 0;
        & + .lazy-image {
          margin-left: 6px;
        }
      }
      .has {
        opacity: 1;
      }
    }
  }
}
.vs-info-history {
  display: flex;
  height: 82px;
  width: calc(100% - 32px);
  margin: 0 auto;
  color: rgba(255, 255, 255, 0.6);
  align-items: flex-end;
  flex-direction: column;
  & + .vs-info-history {
    border-top: 1px solid rgba(255, 255, 255, 0.1);
  }
  .vs-info-top {
    display: flex;
    height: 30px;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    .team-score {
      flex-shrink: 0;
      font-size: 14px;
      color: #ffffff;

      .is-win {
        color: #fe5e00;
      }
    }
  }
  .shuju-time {
    display: flex;
    align-items: center;
    margin-right: 8px;
    width: 70px;
    flex-shrink: 0;
    .lazy-image {
      height: 24px;
      width: 24px;
      flex-shrink: 0;
      margin-right: 8px;
    }
  }
  .lazy-image {
    height: 20px;
    width: 20px;
    flex-shrink: 0;
  }
}
.match-vs-info {
  .vs-info {
    display: flex;
    align-items: center;
    width: calc(100% - 32px);
    margin: 0 auto;
    height: 40px;
    align-items: center;
    font-size: 14px;
    color: rgba(255, 255, 255, 0.6);
    .is-win {
      color: #fe5e00;
    }
    .time-box {
      min-width: 44px;
    }
    .score-box {
      position: relative;
      padding: 0 12px;
      &::before {
        content: "";
        height: 10px;
        width: 2px;
        border-radius: 2px;
        position: absolute;
        top: 3px;
        left: 0;
        background: rgba(255, 255, 255, 0.1);
      }
    }
    .icons-show {
      flex-grow: 1;
      justify-content: flex-end;
      .lazy-image {
        height: 20px;
        width: 20px;
        margin-left: 6px;
        opacity: 0.4;
      }
      .has {
        opacity: 1 !important;
      }
    }
    & > div {
      display: flex;
      align-items: center;
      &:nth-child(1) {
        width: 80px;
        flex-shrink: 0;
      }
      &:nth-child(2) {
        width: 80 !important;
        flex-shrink: 0;
      }
    }
  }

  .event-info {
    background: rgba(0, 0, 0, 0.1);
    height: 34px;
    padding: 0 16px;
    display: flex;
    align-items: center;
    font-size: 14px;
    color: rgba(255, 255, 255, 0.6);
    justify-content: space-between;
    & > div:first-child {
      display: flex;
      align-items: center;
    }
  }

  .team-vs-info {
    display: flex;
    height: 34px;
    padding: 0 16px;
    align-items: center;
    justify-content: space-between;
    background: rgba(0, 0, 0, 0.04);
    font-size: 14px;
    color: rgba(255, 255, 255, 0.6);
    & > div:first-child {
      display: flex;
      align-items: center;
    }
    .abbr-info {
      display: inline-block;
      max-width: 88px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }
}
</style>

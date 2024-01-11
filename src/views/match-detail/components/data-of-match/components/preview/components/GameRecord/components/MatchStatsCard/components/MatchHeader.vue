<script setup lang="ts" name="MatchHeader">
import type { PropType } from 'vue'
import winTextIcon from '@/assets/matchData/hmoe_win_02.png'
import loseTextIcon from '@/assets/matchData/hmoe_lose_02.png'
import hmoeBaifen from '@/assets/matchData/home_baifen.png'
import defaultIcon from '@/assets/home/default.png'
import shuju_vs from '@/assets/matchData/shuju_vs.png'
const props = defineProps({
  teamInfo: {
    type: Object,
    default: () => {},
  },
  index: {
    type: Number,
    default: 0,
  },
  allTeamInfo: {
    type: Array as PropType<any[]>,
    default: () => {},
  },
})

const isHistory = inject('isHistory', false)

function dealRate(rate: any) {
  if (!Number.isNaN(Number(rate))) {
    return `${(+rate * 100).toFixed(0)}%`
  }
  else {
    return '--'
  }
}
</script>

<template>
  <div v-if="!isHistory" class="match-header" :class="{ 'is-away': index }">
    <div class="team-name">
      <van-image
        :src="teamInfo.logo"
        height="24"
        width="24"
        :error-icon="defaultIcon"
        :show-loading="false"
        style="margin-left: 16px"
      />
      <div class="text">
        {{ teamInfo.abbr }}
      </div>
    </div>
    <div class="team-lose-win">
      <div>
        <van-image
          :src="winTextIcon"
          height="12"
          width="26"
          :error-icon="defaultIcon"
          :show-loading="false"
        />
        <div class="win-text">
          {{ teamInfo.win }}
        </div>
      </div>
      <div>
        <van-image
          :src="loseTextIcon"
          height="12"
          width="26"
          :error-icon="defaultIcon"
          :show-loading="false"
        />
        <div class="win-text">
          {{ teamInfo.lose }}
        </div>
      </div>
      <div>
        <van-image
          :src="hmoeBaifen"
          height="12"
          width="12"
          :error-icon="defaultIcon"
          :show-loading="false"
        />
        <div class="win-text">
          {{ dealRate(teamInfo.win_rate) }}
        </div>
      </div>
    </div>
  </div>
  <div v-else class="match-header-all">
    <div class="match-header-team-vs">
      <div v-for="team in allTeamInfo" :key="team.id" class="team-name">
        {{ team.abbr }}
      </div>
      <van-image
        :src="shuju_vs"
        height="24"
        width="24"
        :error-icon="defaultIcon"
        :show-loading="false"
        class="vs-icon"
      />
    </div>
    <div class="team-lose-win-vs">
      <div v-for="team in allTeamInfo" :key="team.id" class="team-lose-win">
        <div>
          <van-image
            :src="winTextIcon"
            height="12"
            width="26"
            :error-icon="defaultIcon"
            :show-loading="false"
          />
          <div class="win-text">
            {{ team.win }}
          </div>
        </div>
        <div>
          <van-image
            :src="loseTextIcon"
            height="12"
            width="26"
            :error-icon="defaultIcon"
            :show-loading="false"
          />
          <div class="win-text">
            {{ team.lose }}
          </div>
        </div>
        <div>
          <van-image
            :src="hmoeBaifen"
            height="12"
            width="12"
            :error-icon="defaultIcon"
            :show-loading="false"
          />
          <div class="win-text">
            {{ dealRate(team.win_rate) }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.match-header-all {
  height: 74px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  & > div {
    display: flex;
  }
  .team-lose-win-vs {
    justify-content: space-between;
    height: 34px;
    width: 100%;
    align-items: center;
    .team-lose-win {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 50%;
      & > div {
        display: flex;
        align-items: center;
        & + div {
          margin-left: 6px;
        }
      }
      .win-text {
        margin-left: 2px;
        font-size: 14px;
        color: #ffffff;
      }
    }
  }
  .match-header-team-vs {
    background: rgba(17, 81, 128, 0.2);
    height: 40px;
    width: 100%;
    justify-content: center;
    position: relative;
    overflow: hidden;
    .vs-icon {
      position: absolute;
      top: 8px;
      left: calc(50% - 12px);
    }

    .team-name {
      width: calc(50% - 12px);
      font-size: 14px;
      color: rgba(255, 255, 255, 0.6);
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      padding: 0 12px;
      line-height: 40px;
      text-align: center;
    }
  }
}
.is-away {
  background: rgba(158, 39, 56, 0.2) !important;
}
.match-header {
  width: 100%;
  height: 38px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: rgba(17, 81, 128, 0.2);
  overflow: hidden;
  .team-lose-win {
    display: flex;
    align-items: center;
    flex-shrink: 0;
    margin-right: 16px;
    & > div {
      display: flex;
      align-items: center;
      & + div {
        margin-left: 6px;
      }
    }
    .win-text {
      margin-left: 2px;
      font-size: 14px;
      color: #ffffff;
    }
  }
  .team-name {
    display: flex;
    align-items: center;
    flex-grow: 1;
    overflow: hidden;
    .text {
      font-size: 14px;
      color: #ffffff;
      margin-left: 10px;
      max-width: calc(100% - 60px);
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }
}
</style>

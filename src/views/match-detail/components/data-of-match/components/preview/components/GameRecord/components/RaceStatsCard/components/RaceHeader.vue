<script setup lang="ts" name="RaceHeader">
import type { PropType } from 'vue'
import shuju_vs_small from '@/assets/matchData/shuju_vs.png'
import defaultIcon from '@/assets/home/default.png'

const props = defineProps({
  teamInfo: {
    type: Object,
    default: () => {},
  },
  allTeamInfo: {
    type: Array as PropType<any[]>,
    default: () => [],
  },
})

const isHistory = inject('isHistory', false)
</script>

<template>
  <div v-if="!isHistory" class="match-header">
    <div class="team-name">
      <van-image
        :src="teamInfo.logo"
        height="24"
        width="24"
        :error-icon="defaultIcon"
        :show-loading="false"
      />
      <div class="text">
        {{ teamInfo.abbr }}
      </div>
    </div>
    <div class="team-lose-win" />
  </div>
  <div v-else class="match-header-all">
    <div class="match-header-team-vs">
      <div v-for="team in allTeamInfo" :key="team.id" class="team-name">
        {{ team.abbr }}
      </div>
      <van-image
        :src="shuju_vs_small"
        height="24"
        width="24"
        :error-icon="defaultIcon"
        class="vs-icon"
        :show-loading="false"
      />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.match-header {
  width: 100%;
  height: 40px;
  padding: 0 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: rgba(0, 0, 0, 0.04);
  overflow: hidden;
  .team-name {
    display: flex;
    align-items: center;
    .text {
      font-size: 14px;
      color: #ffffff;
      margin-left: 12px;
    }
  }
}
.match-header-all {
  height: 40px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  & > div {
    display: flex;
  }
  .match-header-team-vs {
    background: rgba(17, 81, 128, 0.2);
    height: 40px;
    width: 100%;
    justify-content: center;
    align-items: center;
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
      text-align: center;
    }
  }
}
</style>

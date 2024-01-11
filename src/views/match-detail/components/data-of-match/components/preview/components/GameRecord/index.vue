<script setup lang="ts" name="GameRecord">
import MatchStatsCard from './components/MatchStatsCard/index.vue'
import RaceStatsCard from './components/RaceStatsCard/index.vue'
import home_shujudown from '@/assets/matchData/home_shujudown.png'
import defaultIcon from '@/assets/home/default.png'

const props = defineProps({
  aginstData: {
    type: Object,
    default: () => {},
  },
})

const emit = defineEmits(['toCurrentTopEmit'])

const carouselIndex = ref(0)

function changeCarouselItem(index: number) {
  if (carouselIndex.value === index) {
    return
  }
  carouselIndex.value = index
}

const matchStats = computed(() => {
  if (
    !props.aginstData.match_id
    || !props.aginstData.teams
    || props.aginstData.teams.length !== 2
  ) {
    return []
  }
  return [
    {
      team_info: Object.assign({}, props.aginstData.teams[0].team, {
        win: props.aginstData?.teams[0].stats.win || 0,
        lose: props.aginstData?.teams[0].stats.lose || 0,
        win_rate: props.aginstData?.teams[0].stats.win_rate || 0,
      }),
      match_stats: props.aginstData.teams[0].match_stats,
    },
    {
      team_info: Object.assign({}, props.aginstData.teams[1].team, {
        win: props.aginstData?.teams[1].stats.win || 0,
        lose: props.aginstData?.teams[1].stats.lose || 0,
        win_rate: props.aginstData?.teams[1].stats.win_rate || 0,
      }),
      match_stats: props.aginstData.teams[1].match_stats,
    },
  ]
})

const raceStats = computed(() => {
  if (
    !props.aginstData.match_id
    || !props.aginstData.teams
    || props.aginstData.teams.length !== 2
  ) {
    return []
  }
  return [
    {
      team_info: Object.assign({}, props.aginstData.teams[0].team, {
        win: props.aginstData?.teams[0].stats.race_win || 0,
        lose: props.aginstData?.teams[0].stats.race_lose || 0,
        win_rate: props.aginstData?.teams[0].stats.race_win_rate || 0,
      }),
      race_stats: props.aginstData.teams[0].race_stats,
    },
    {
      team_info: Object.assign({}, props.aginstData.teams[1].team, {
        win: props.aginstData?.teams[1].stats.race_win || 0,
        lose: props.aginstData?.teams[1].stats.race_lose || 0,
        win_rate: props.aginstData?.teams[1].stats.race_win_rate || 0,
      }),
      race_stats: props.aginstData.teams[1].race_stats,
    },
  ]
})

const initRaceStats = ref(false)

function toCurrentTop() {
  emit('toCurrentTopEmit')
}
</script>

<template>
  <div class="game-record">
    <div
      class="data-header"
      :style="{ '--left-item': carouselIndex ? '50%' : 0 }"
    >
      <div class="header-label">
        {{ $t('match_record') }}
      </div>
      <div class="change-box">
        <div class="item-change">
          <div
            :class="{ 'item-active': !carouselIndex }"
            @click="changeCarouselItem(0)"
          >
            {{ $t('overall') }}
          </div>
          <div
            :class="{ 'item-active': carouselIndex }"
            @click="changeCarouselItem(1)"
            @mouseenter="initRaceStats = true"
          >
            {{ $t('single_game') }}
          </div>
        </div>
        <van-image
          :src="home_shujudown"
          height="24"
          width="24"
          :error-icon="defaultIcon"
          :show-loading="false"
          style="margin-right: 16px"
          @click="toCurrentTop"
        />
      </div>
    </div>
    <div class="game-record-carousel">
      <MatchStatsCard v-if="carouselIndex === 0" :info="matchStats" />
      <RaceStatsCard v-if="initRaceStats && carouselIndex === 1" :info="raceStats" />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.game-record {
  width: 100%;
  .game-record-carousel {
    width: 100%;
  }
  .data-header {
    background: rgba(255, 255, 255, 0.04);
    height: 40px;
    width: 100%;
    margin: 0 auto;
    display: flex;
    align-items: center;
    justify-content: space-between;

    .item-change {
      display: flex;
      background: rgba(255, 255, 255, 0.05);
      margin-right: 8px;
      border-radius: 15px;
      position: relative;
      .item-active {
        color: #fff;
      }
      div {
        line-height: 24px;
        width: 60px;
        text-align: center;
        font-size: 12px;
        z-index: 2;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        color: rgba(255, 255, 255, 0.6);
      }
      &::before {
        content: "";
        position: absolute;
        width: 60px;
        height: 24px;
        top: 0;
        left: var(--left-item);
        border-radius: 15px;
        background: rgba(216, 216, 216, 0.05);
        z-index: 0;
        transition: all 0.3s ease-in-out;
      }
    }
    .header-label {
      font-size: 14px;
      color: #ffffff;
      display: flex;
      align-items: center;
      &::before {
        content: "";
        width: 2px;
        height: 12px;
        background: #fe5e00;
        margin: 0 16px;
        border-radius: 2px;
      }
    }
    .change-box{
      display: flex;
      align-items: center;
    }
  }
}
</style>

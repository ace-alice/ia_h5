<script lang="ts" setup name="NearData">
import type { PropType } from 'vue'
import { useI18n } from 'vue-i18n'
import NearDataItem from '@/components/UniversalBetItem/components/NearDataItem.vue'
import nearDataHook from '@/hooks/nearDataHook'
import defaultIcon from '@/assets/home/default.png'
import winTextIcon from '@/assets/matchData/hmoe_win_02.png'
import loseTextIcon from '@/assets/matchData/hmoe_lose_02.png'
import home_shujudown from '@/assets/matchData/home_shujudown.png'
import shuju_murder from '@/assets/matchData/shuju_murder.png'
import shuju_time from '@/assets/matchData/shuju_time.png'

const props = defineProps({
  dataBase: {
    type: Array as PropType<any[]>,
    default: () => [],
  },
  teamInfo: {
    type: Array as PropType<any[]>,
    default: () => [],
  },
})

const emit = defineEmits(['nextEmit'])

const { t } = useI18n()

const isHistory = inject('isHistory', false)

const gameType: any = inject('gameType', 1)

const { useTemplate, useWinLoseTemplate, useHistoryTemplate } = nearDataHook(
  gameType.value,
)

const displayLoseWin = computed(() => {
  if (!useWinLoseTemplate.value) {
    return []
  }
  return useWinLoseTemplate.value.map((temp: any, index: number) => {
    return Object.assign({}, temp, {
      win:
        props.dataBase.length === 2
          ? Number(props.dataBase[index][temp.win_key])
          : 0,
      lose:
        props.dataBase.length === 2
          ? Number(props.dataBase[index][temp.lose_key])
          : 0,
    })
  })
})

const displayHistory = computed(() => {
  if (!useHistoryTemplate.value) {
    return []
  }
  return useHistoryTemplate.value.map((temp: any) => {
    return Object.assign({}, temp, {
      value:
        props.dataBase.length > 0
          ? Number(props.dataBase[0][temp.data_key])
          : 0,
    })
  })
})

function setDominant(team1: number, team2: number) {
  if (team1 > team2) {
    return 0
  }
  else if (team1 < team2) {
    return 1
  }
  else {
    return -1
  }
}

function dealData(index: number, temp: any): any[] {
  if (
    props.dataBase.length !== 2
    || !props.dataBase[index]
    || !Object.keys(props.dataBase[index]).includes(temp.data_key)
  ) {
    return [0, t('none')]
  }
  const dataC1 = Number(props.dataBase[0][temp.data_key]) || 0
  const dataC2 = Number(props.dataBase[1][temp.data_key]) || 0
  const dataC = Number(props.dataBase[index][temp.data_key]) || 0
  if (temp) {
    if (temp.is_percentage) {
      return [Math.floor(dataC * 100), `${Math.floor(dataC * 100)}%`]
    }
    else if (temp.is_time) {
      return [
        Math.floor((dataC / (dataC1 + dataC2)) * 100),
        `${Math.floor(dataC / 60)}'${Math.floor(dataC % 60)}`,
      ]
    }
    else {
      return [
        Math.floor((dataC / (dataC1 + dataC2)) * 100),
        Number(dataC.toFixed(1)),
      ]
    }
  }
  else {
    return [0, 0]
  }
}

const displayData = computed(() => {
  if (!useTemplate.value) {
    return []
  }
  return useTemplate.value.map((temp: any) => {
    const data1 = dealData(0, temp)
    const data2 = dealData(1, temp)
    return Object.assign({}, temp, {
      dominant_index: setDominant(data1[0], data2[0]),
      team1: data1[0],
      team2: data2[0],
      team1_value: data1[1],
      team2_value: data2[1],
    })
  })
})

function nextCard() {
  emit('nextEmit')
}

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
  <div class="near-data">
    <div class="near-data-header">
      <div class="header-label">
        {{ $t('all_recent_data') }}
      </div>
      <div class="game-logo-info">
        <van-image
          v-for="team in teamInfo"
          :key="team.id"
          :src="team.logo"
          class="team-logo-image"
          :error-icon="defaultIcon"
          :show-loading="false"
        />
        <van-image
          :src="home_shujudown"
          height="24"
          width="24"
          :error-icon="defaultIcon"
          :show-loading="false"
          style="margin-right: 16px"
          @click="nextCard"
        />
      </div>
    </div>
    <div class="match-info-content">
      <NearDataItem
        v-for="data in displayData"
        :key="data.data_key"
        :data-info="data"
      />
    </div>
    <div class="lose-win-box" :class="{ 'is-history': isHistory }">
      <div
        v-for="(item, index) in displayLoseWin"
        :key="index"
        class="lose-win-item"
      >
        <div class="lose-win-item-box">
          <div class="lose-win-value">
            {{ item.win }}
          </div>
          <van-image
            :src="winTextIcon"
            class="win-lose-image"
            :error-icon="defaultIcon"
            :show-loading="false"
          />
        </div>
        <div class="lose-win-item-box">
          <div class="lose-win-value">
            {{ item.lose }}
          </div>
          <van-image
            :src="loseTextIcon"
            class="win-lose-image"
            :error-icon="defaultIcon"
            :show-loading="false"
          />
        </div>
      </div>
    </div>
    <div v-if="isHistory" class="history-box">
      <div
        v-for="(item, index) in displayHistory"
        :key="index"
        class="history-item"
      >
        <van-image
          :src="index ? shuju_time : shuju_murder"
          class="win-lose-image"
          :error-icon="defaultIcon"
          :show-loading="false"
          height="24"
          width="24"
        />
        <div class="history-item-box">
          <div class="history-value">
            {{ dealRate(item.value) }}
          </div>
          <div class="data-name">
            {{ item.data_name }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.near-data {
  width: 100%;
  .match-info-content {
    width: calc(100% - 32px);
    margin: 12px auto;
  }
  .near-data-header {
    background: rgba(255, 255, 255, 0.04);
    height: 40px;
    width: 100%;
    margin: 0 auto;
    display: flex;
    align-items: center;
    justify-content: space-between;
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
    .game-logo-info {
      display: flex;
      align-items: center;
      & > div + div {
        margin-left: 8px;
      }
      .team-logo-image {
        height: 24px;
        width: 24px;
        background: rgba(255, 255, 255, 0.1);
        border-radius: 50%;
        padding: 1px;
      }
    }
  }
  .lose-win-box {
    background: rgba(0, 0, 0, 0.2);
    border-radius: 6px;
    height: 60px;
    width: calc(100% - 48px);
    margin: 14px auto;
    display: flex;
    align-items: center;
    backdrop-filter: blur(20px);

    .lose-win-item {
      display: flex;
      .lose-win-item-box {
        display: flex;
        align-items: center;
        flex-direction: column;
      }
      .win-lose-image {
        width: 26px;
        height: 12px;
      }
      .lose-win-value {
        font-family: Gotham-Medium;
        font-size: 14px;
        color: #ffffff;
        font-weight: 600;
      }
      .image-box {
        background: rgba(0, 0, 0, 0.2);
        border: 1px solid rgba(255, 255, 255, 0.1);
        border-radius: 6px;
        height: 32px;
        width: 32px;
        display: flex;
        justify-content: center;
        align-items: center;
      }
      & > div + div {
        margin-left: 18px;
      }
    }

    & > div {
      width: 50%;
      position: relative;
      display: flex;
      align-items: center;
      justify-content: center;
      & + div {
        &::before {
          content: "";
          width: 1px;
          height: 20px;
          position: absolute;
          top: 2px;
          left: 0;
          background-color: rgba(255, 255, 255, 0.09);
          border-radius: 1px;
        }
      }
    }
  }
}
.history-box {
  height: 60px;
  width: calc(100% - 48px);
  margin: 0 auto 14px;
  display: flex;
  align-items: center;
  background: rgba(0, 0, 0, 0.2);
  border-radius: 8px;
  & > div {
    width: 50%;
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    & + div {
      &::before {
        content: "";
        width: 1px;
        height: 20px;
        position: absolute;
        top: 2px;
        left: 0;
        background-color: rgba(255, 255, 255, 0.09);
        border-radius: 1px;
      }
    }
  }
  .history-item {
    display: flex;
    .history-item-box {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      color: #9b9b9b;
      font-size: 12px;
      .history-value {
        font-size: 14px;
        color: #ffffff;
        font-weight: 500;
        margin-bottom: 2px;
      }
      .data-name {
        max-width: 96px;
        word-break: break-all;
      }
    }
  }
}
.is-history {
  background: rgba(0, 0, 0, 0) !important;
  margin: 0 auto !important;
  height: 20px !important;
  margin-bottom: 12px !important;
  .lose-win-item {
    &:nth-child(2) {
      &::before {
        height: 10px !important;
        top: 4px;
      }
    }
    .lose-win-item-box {
      flex-direction: row-reverse !important;
      font-family: Gotham-Medium;
      .lose-win-value {
        margin-left: 4px;
      }
    }
  }
}
</style>

<script lang="ts" setup name="NearData">
import { useI18n } from 'vue-i18n'
import NearDataItem from './NearDataItem.vue'
import nearDataHook from '@/hooks/nearDataHook'
import LolLogo from '@/assets/matchData/home_lol.png'
import dotaLogo from '@/assets/matchData/hmoe_dota2.png'
import csgoLogo from '@/assets/matchData/hmoe_csgo.png'
import aovLogo from '@/assets/matchData/hmoe_wangzhe.png'
import { getAntBeforeGameDataApi } from '@/api/ant-match-info'
import defaultIcon from '@/assets/home/default.png'
import winTextIcon from '@/assets/matchData/hmoe_win_02.png'
import loseTextIcon from '@/assets/matchData/hmoe_lose_02.png'
import lolBg from '@/assets/matchData/shuju_bg_lol.png'
import { globalApiConfigStore } from '@/store/globalApiConfig'

const props = defineProps({
  gameType: {
    type: Number,
    default: 1,
  },
  gameId: {
    type: Number,
    default: 0,
  },
  swipeIndex: {
    type: Number,
    default: 0,
  },
})

const { t } = useI18n()

const logos: any = {
  lolNearTemplate: [LolLogo, lolBg],
  dotaNearTemplate: [dotaLogo, lolBg],
  aovNearTemplate: [aovLogo, lolBg],
  csgoNearTemplate: [csgoLogo, lolBg],
}

const { useTemplate, useWinLoseTemplate, gameTypeForListCode } = nearDataHook(
  props.gameType,
)

const { pullRefreshDisabled } = storeToRefs(globalApiConfigStore())

const gameTypeClass = gameTypeForListCode[props.gameType] || ''

const gameTypeImage
  = logos[gameTypeForListCode[props.gameType]] || logos.lolNearTemplate

const gameTypeBg = {
  backgroundImage: `url(${gameTypeImage[1]})`,
}

const dataBase = ref<any[]>([])

const teamInfo = ref<any[]>([])

function getMatchData() {
  if (dataBase.value && dataBase.value.length > 0) {
    return
  }
  getAntBeforeGameDataApi({ game_id: props.gameId }).then((res: any) => {
    if (+res.data.code === 1 && res.data.data.match_id && res.data.data.teams) {
      dataBase.value = res.data.data.teams.map((team: any) => team.stats)
      teamInfo.value = res.data.data.teams.map((team: any) => team.team)
    }
  })
}

watch(
  () => props.swipeIndex,
  (newVal) => {
    if (newVal === 1) {
      getMatchData()
    }
  },
)

const displayLoseWin = computed(() => {
  return useWinLoseTemplate.value.map((temp: any, index: number) => {
    return Object.assign({}, temp, {
      win:
        dataBase.value.length === 2
          ? Number(dataBase.value[index][temp.win_key])
          : 0,
      lose:
        dataBase.value.length === 2
          ? Number(dataBase.value[index][temp.lose_key])
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
    dataBase.value.length !== 2
    || !dataBase.value[index]
    || !Object.keys(dataBase.value[index]).includes(temp.data_key)
  ) {
    return [0, t('none')]
  }
  const dataC1 = Number(dataBase.value[0][temp.data_key])
  const dataC2 = Number(dataBase.value[1][temp.data_key]) || 0
  const dataC = Number(dataBase.value[index][temp.data_key]) || 0
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
        Number(dataC.toFixed(2)),
      ]
    }
  }
  else {
    return [0, 0]
  }
}

const displayData = computed(() => {
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
// onMounted(() => {
//   getMatchData()
// })
</script>

<template>
  <div
    class="near-data"
    @touchstart="pullRefreshDisabled = true"
    @touchend="pullRefreshDisabled = false"
  >
    <div class="near-data-box" :style="gameTypeBg">
      <div class="near-data-header">
        <van-image
          :src="gameTypeImage[0]"
          :error-icon="defaultIcon"
          :show-loading="false"
          class="game-logo-image"
        />
        <div class="game-logo-info">
          <van-image
            v-for="team in teamInfo"
            :key="team.id"
            :src="team.logo"
            class="team-logo-image"
            :error-icon="defaultIcon"
            :show-loading="false"
          />
          <div class="header-label">
            {{ $t("last_ten_games") }}
          </div>
        </div>
      </div>
      <div class="match-info-box">
        <div class="match-info-content">
          <NearDataItem
            v-for="data in displayData"
            :key="data.data_key"
            :data-info="data"
          />
        </div>
        <div class="lose-win-box">
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
        <div class="match-info-box-shadow" />
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.near-data {
  height: 164px;
  width: 100%;
  transition: all 0.3s ease-in-out;

  .near-data-box {
    height: 100%;
    width: 100%;
    background: #262d34;
    border-radius: 16px;
    background-size: 100% 100%;
    background-repeat: no-repeat;
    overflow: hidden;
    .match-info-box {
      height: calc(100% - 58px);
      width: calc(100% - 32px);
      margin: 0 auto;
      overflow: auto;
    }
    .match-info-box-shadow {
      position: absolute;
      bottom: 10px;
      left: 16px;
      width: calc(100% - 32px);
      height: 12px;
      background-image: linear-gradient(
        180deg,
        rgba(2, 40, 43, 0.15) 0%,
        rgba(2, 40, 43, 1) 100%
      );
    }
    .near-data-header {
      height: 46px;
      width: calc(100% - 32px);
      margin: 0 auto;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
    .game-logo-image {
      height: 24px;
      width: 56px;
      flex-shrink: 0;
    }
    .game-logo-info {
      display: flex;
      align-items: center;
      & > div + div {
        margin-left: 8px;
      }
    }
    .team-logo-image {
      height: 24px;
      width: 24px;
      background: rgba(0, 0, 0, 0.4);
      border-radius: 50%;
      padding: 1px;
    }
    .header-label {
      background: rgba(255, 255, 255, 0.1);
      border-radius: 15px;
      line-height: 24px;
      padding: 0 10px;
      font-size: 12px;
      color: #ffffff;
    }
  }
  .lose-win-box {
    background: rgba(0, 0, 0, 0.2);
    border-radius: 6px;
    height: 60px;
    width: calc(100% - 16px);
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
</style>

<script setup lang="ts" name="ChampionBetItem">
import ChTeamBox from './components/ChTeamBox.vue'
import { parseTime } from '@/utils'
import defaultIcon from '@/assets/home/default.png'
import amountIcon from '@/assets/home/home_jiangjin.png'
import teamIcon from '@/assets/home/home_participating.png'
const props = defineProps({
  matchInfo: {
    type: Object,
    default: () => {
      return {}
    },
  },
})

const isPackUp = ref(true)

function changePackStatus() {
  isPackUp.value = !isPackUp.value
}

const singleHeight = computed(() => {
  return (44 * document.body.clientWidth) / 375
})

const teamPoints = computed(() => {
  if (
    props.matchInfo.recommend_play
    && props.matchInfo.recommend_play.team_points
  ) {
    return props.matchInfo.recommend_play.team_points
  }
  else {
    return []
  }
})
</script>

<template>
  <div
    class="champion-bet-item"
    :style="{
      '--content-height': isPackUp
        ? teamPoints.length > 4
          ? singleHeight * 3
          : teamPoints.length > 2
            ? singleHeight * 2
            : singleHeight
        : Math.ceil(teamPoints.length / 2) * singleHeight,
    }"
  >
    <div class="champion-left">
      <div>
        <!-- <img :src="defaultIcon"> -->
        <van-image
          class="img"
          width="16"
          height="16"
          :src="matchInfo.game_type_logo"
          :error-icon="defaultIcon"
          :show-loading="false"
        />
        <span>{{ matchInfo.event_name }}</span>
      </div>
      <div>
        {{
          parseTime(
            Number(
              String(
                matchInfo.game_start_time ? matchInfo.game_start_time : 0,
              ).padEnd(13, "0"),
            ),
            "{y}-{m}-{d}",
          )
        }}
      </div>
    </div>
    <div class="champion-middle">
      <div>
        <span>{{ $t("bonus_pool") }}</span>
        <img :src="amountIcon">
        <span>{{ matchInfo.bonus_pool }}</span>
      </div>
      <div>
        <span>{{ $t("game_teams") }}</span>
        <img :src="teamIcon">
        <span>{{
          matchInfo.recommend_play.id
            ? matchInfo.recommend_play?.team_points.length
            : 0
        }}</span>
      </div>
    </div>
    <div class="champion-right">
      <template v-for="(match, index) in teamPoints || []" :key="index">
        <ChTeamBox
          :index="index"
          :item-info="
            Object.assign({}, match, {
              event_name: matchInfo.event_name,
              game_id: matchInfo.id,
              category_id: 4,
              game_logo: matchInfo.game_type_logo,
              is_champion: 1,
              play_info_id: matchInfo.recommend_play?.id,
              name: $t('champion_bet'),
            })
          "
        />
      </template>
    </div>
    <div v-if="teamPoints.length > 6" class="expand">
      <span class="expand-group" @click.stop="changePackStatus">
        <span class="up" :class="{ down: !isPackUp }" />
        {{ isPackUp ? $t("unfold") : $t("fold") }}
      </span>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.champion-bet-item {
  width: calc(100% - 64px);
  margin: 0 auto 12px;
  padding: 14px 16px;
  background: #262d34;
  border-radius: 16px;
  min-height: 60px;

  .champion-left {
    display: flex;
    justify-content: space-between;
    align-items: center;

    div:nth-child(1) {
      display: flex;
      align-items: center;
      font-size: 12px;
      color: #fff;
      font-weight: 400;
      flex-grow: 1;
      overflow: hidden;

      .img {
        width: 16px;
        height: 16px;
        margin-right: 9px;
        flex-grow: 0;
        flex-shrink: 0;
      }
      span{
        overflow: hidden;
        // white-space: nowrap;
        text-overflow: ellipsis;
        padding-right: 12px;
      }
    }

    div:nth-child(2) {
      font-size: 12px;
      color: rgba(255 255 255 / 60%);
      font-weight: 500;
      flex-shrink: 0;
    }
  }

  .champion-middle {
    display: flex;
    align-items: center;
    height: 36px;
    background: rgba(255 255 255 / 15%);
    border-radius: 4px;
    margin: 16px 0 0;

    div {
      display: flex;
      align-items: center;
      width: 50%;
      padding-left: 8px;

      span:nth-child(1) {
        font-size: 12px;
        color: rgba(255 255 255 / 60%);
        font-weight: 400;
      }

      span:nth-child(3) {
        font-size: 14px;
        color: #fff;
        font-weight: 500;
      }

      img {
        width: 16px;
        height: 16px;
        margin: 0 6px;
      }
    }
  }

  .champion-right {
    display: flex;
    flex-flow: row wrap;
    overflow: hidden;
    height: calc(var(--content-height) * 1px);
    transition: all 0.2s ease-in-out;

    > div {
      display: flex;
      justify-content: space-between;
      align-items: center;
      width: calc(50% - 22px);
      height: 36px;
      background: rgba(255 255 255 / 6%);
      border-radius: 4px;
      margin: 8px 12px 0 0;
      padding: 0 8px;
      font-weight: 500;

      span:nth-child(1) {
        font-size: 12px;
        color: rgba(255 255 255 / 60%);
      }

      span:nth-child(2) {
        font-size: 14px;
        color: #fff;
      }
    }

    div:nth-child(2n) {
      margin-right: 0;
    }
  }

  .max-140 {
    max-height: 140px;
  }

  .max-auto {
    max-height: auto;
  }

  .expand {
    display: flex;
    width: 100%;
    height: 30px;
    justify-content: center;
    align-items: flex-end;
    background: none;
    font-size: 12px;
    color: rgba(255 255 255 / 60%);

    .expand-group {
      display: flex;
      align-items: center;

      > span {
        margin: 0 5px;
      }

      .up {
        display: inline-block;
        width: 16px;
        height: 16px;
        background-image: url("@/assets/home/Ct_ more_down.png");
        background-size: 100%;
        transition: all 0.2s ease-in-out;
      }

      .down {
        transform: rotate(180deg);
      }
    }
  }
}
</style>

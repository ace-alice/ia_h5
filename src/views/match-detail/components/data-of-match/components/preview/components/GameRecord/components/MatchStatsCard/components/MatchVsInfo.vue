<script setup lang="ts" name="MatchVsInfo">
import { parseTime } from '@/utils'
import winIcon from '@/assets/matchData/hmoe_win_02.png'
import defaultIcon from '@/assets/home/default.png'
import home_liansai from '@/assets/matchData/home_liansai.png'

const props = defineProps({
  vsInfo: {
    type: Object,
    default: () => {},
  },
})

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
  <div class="match-vs-info">
    <div class="event-info">
      <van-image
        height="24"
        width="24"
        style="margin: 0 12px 0 16px"
        :src="home_liansai"
        class="show-image"
        :error-icon="defaultIcon"
        :show-loading="false"
      />
      <div> {{ vsInfo.leagues?.abbr || "" }}</div>
    </div>
    <div
      v-for="item in vsInfo.matches || []"
      :key="item.match_id"
      class="vs-info"
    >
      <div class="match-bo-time-box">
        <div class="bo-box">
          BO{{ item.bo || "" }}
        </div>
        <div class="time-box">
          {{ parseTime(item.start_time, "{y}-{m}-{d}") }}
        </div>
      </div>
      <div class="team-info-box">
        <div v-for="team in item.teams" :key="team.team_id" class="team-info">
          <div class="team-info-name">
            <van-image
              :src="team.team_info.logo"
              height="20"
              width="20"
              :error-icon="defaultIcon"
              :show-loading="false"
            />
            <div
              class="team-name"
              :class="{ 'win-team': +item.win_team === +team.team_id }"
            >
              {{ team.team_info.abbr }}
            </div>
          </div>
          <div class="team-win-lose-info">
            <div
              class="team-score"
              :class="{ 'win-team': +item.win_team === +team.team_id }"
            >
              {{ team.score }}
            </div>
            <div class="team-win-icon">
              <van-image
                v-if="+item.win_team === +team.team_id"
                :src="winIcon"
                height="12"
                width="26"
                :error-icon="defaultIcon"
                :show-loading="false"
                style="margin: 0 4px"
              />
            </div>
            <div class="team-win-rate">
              {{ dealRate(team.win_rate) }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.match-vs-info {
  .vs-info {
    display: flex;
    align-items: center;
    width: calc(100% - 32px);
    margin: 0 auto;
    padding: 6px 0;

    & + .vs-info {
      border-top: 1px solid rgba(255, 255, 255, 0.09);
    }

    .team-info-box {
      flex-grow: 1;
      .team-info {
        display: flex;
        align-items: center;
        justify-content: space-between;
       &+.team-info{
        margin-top: 4px;
       }
        .team-win-lose-info {
          display: flex;
          align-items: center;
          color: #ffffff;
          & > div + div {
            margin-left: 12px;
          }
          .team-score {
            min-width: 14px;
            font-size: 14px;
            text-align: center;
          }
          .team-win-icon {
            height: 18px;
            width: 26px;
          }
          .team-win-rate {
            min-width: 36px;
            text-align: right;
            font-size: 14px;
            color: rgba(255, 255, 255, 0.6);
          }
        }
        .team-info-name {
          display: flex;
          align-items: center;
          .team-name {
            font-size: 14px;
            color: rgba(255, 255, 255, 0.6);
            margin-left: 12px;
            max-width: 86px;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }
        }
        .win-team {
          color: #fe5e00 !important;
        }
      }
    }
    .match-bo-time-box {
      display: flex;
      flex-direction: column;
      justify-content: center;
      margin-right: 10px;
      .bo-box {
        background: rgba(0, 0, 0, 0.2);
        border: 1px solid rgba(255, 255, 255, 0.1);
        border-radius: 4px;
        width: 52px;
        height: 24px;
        font-family: Gotham-Medium;
        font-size: 14px;
        color: #0095ff;
        font-weight: 600;
        display: flex;
        justify-content: center;
        align-items: center;
      }
      .time-box {
        font-size: 12px;
        color: rgba(255, 255, 255, 0.6);
        margin-top: 4px;
      }
    }
  }
  .event-info {
    background: rgba(0, 0, 0, 0.1);
    height: 34px;
    width: 100%;
    display: flex;
    align-items: center;
    font-size: 14px;
    color: rgba(255, 255, 255, 0.6);
  }
}
</style>

<script setup name="SelectEventItem" lang="ts">
// import { showToast } from 'vant'
// import { useI18n } from 'vue-i18n'
import homeRulesofplayIcon from '@/assets/home/home_rulesofplay.png'
import closedIcon from '@/assets/home/com_closed.png'
import homeEaguescreeningIcon from '@/assets/home/home_leaguescreening.png'
import { globalApiConfigStore } from '@/store/globalApiConfig'
// import { userInfoStore } from '@/store/userInfo'
// import notifyIcon from '@/assets/home/pop_high.png'
import { gameInfoStore } from '@/store/gameInfo'
import homePopdown01 from '@/assets/home/home_popdown01.png'
import homePopdown02 from '@/assets/home/home_popdown02.png'

const { showRule, showLeagueScreen } = storeToRefs(globalApiConfigStore())
// const { isLogin } = storeToRefs(userInfoStore())
const { checkedEvenList, gameList, currentGameId } = storeToRefs(
  gameInfoStore(),
)

const currentGameList = computed(() => {
  if (+currentGameId.value) {
    return gameList.value.filter((game) => {
      return +game.id === +currentGameId.value
    })
  }
  else {
    return gameList.value.filter((game) => {
      return (
        game.events_count
        && game.events_count?.events
        && game.events_count?.events?.length > 0
      )
    })
  }
})
// const i18n = useI18n()

const tempCheckedEventIds = ref([...checkedEvenList.value])

function showBetListFun() {
  showRule.value = true
  // if (isLogin.value) {
  //   showBetList.value = true
  // }
  // else {
  //   showToast({
  //     icon: notifyIcon,
  //     className: 'bet-toast-content bet-err',
  //     message: i18n.t('you_not_login_now'),
  //   })
  // }
}

function showLeagueScreenFun() {
  tempCheckedEventIds.value = [...checkedEvenList.value]
  showLeagueScreen.value = true
}

function initList() {
  tempCheckedEventIds.value = []
  gameList.value.forEach((game: any) => {
    game.open = false
  })
}

function setHeight(length: number) {
  return (window.document.body.clientWidth / 375) * length * 42
}

function setCheckEvent(eventId: string) {
  if (tempCheckedEventIds.value.includes(eventId)) {
    tempCheckedEventIds.value = tempCheckedEventIds.value.filter((event) => {
      return event !== eventId
    })
  }
  else {
    tempCheckedEventIds.value.push(eventId)
  }
}

function setCheckEventAll(events: any[], hasCheck: boolean) {
  const eventIds = events.map(eve => String(eve.event_id))
  if (hasCheck) {
    tempCheckedEventIds.value = tempCheckedEventIds.value.filter((event) => {
      return !eventIds.includes(event)
    })
  }
  else {
    tempCheckedEventIds.value = [...tempCheckedEventIds.value, ...eventIds]
  }
}

function hasChecked(events: any[]) {
  const eventIds = events.map(eve => String(eve.event_id))
  return eventIds.every((eve) => {
    return tempCheckedEventIds.value.includes(eve)
  })
}
function hasGameChecked(events: any[]) {
  const eventIds = events.map(eve => String(eve.event_id))
  return eventIds.some((eve) => {
    return tempCheckedEventIds.value.includes(eve)
  })
}

function submit() {
  checkedEvenList.value = [...tempCheckedEventIds.value]
  showLeagueScreen.value = false
}
</script>

<template>
  <div class="icon-box">
    <van-image
      width="24"
      height="24"
      :src="homeEaguescreeningIcon"
      @click="showLeagueScreenFun"
    />
    <van-image
      width="24"
      height="24"
      style="margin-left: 12px"
      :src="homeRulesofplayIcon"
      @click="showBetListFun"
    />
  </div>
  <van-popup
    v-model:show="showLeagueScreen"
    position="bottom"
    :style="{ height: '80%' }"
    teleport="body"
  >
    <div class="league-screen">
      <van-image
        class="closed-icon"
        :src="closedIcon"
        @click="showLeagueScreen = false"
      />
      <div class="screen-header">
        {{ $t("league-screening") }}
      </div>
      <div class="screen-m" />
      <div class="screen-bottom">
        <div
          v-for="game in currentGameList"
          :key="game.id"
          class="game-box"
          :style="{ '--height': (game as any).open ? setHeight((game.events_count?.events?.length || 0) + 1) : 0 }"
        >
          <div
            class="game-tab"
            :class="{ 'game-tab-active': (game as any).open }"
            @click="(game as any).open = !(game as any).open"
          >
            <div>
              <van-image
                width="24"
                height="24"
                style="margin-right: 12px"
                :src="game.logo"
              />
              <div class="game-name">
                {{ game.game_name }}
              </div>
            </div>
            <div :class="{ 'checked-game': hasGameChecked(game.events_count?.events || []) }">
              <span>{{ game.events_count?.total || 0 }}</span>
              <van-image
                v-show="(game as any).open"
                width="24"
                height="24"
                style="margin-left: 24px"
                :src="homePopdown02"
              />
              <van-image
                v-show="!(game as any).open"
                width="24"
                height="24"
                style="margin-left: 24px"
                :src="homePopdown01"
              />
            </div>
          </div>
          <div
            v-if="
              game.events_count
                && game.events_count?.events
                && game.events_count?.events?.length > 0
            "
            class="events-box"
          >
            <div
              class="event-item"
              :class="{ checked: hasChecked(game.events_count?.events || []) }"
              @click.stop="
                setCheckEventAll(
                  game.events_count?.events || [],
                  hasChecked(game.events_count?.events || []),
                )
              "
            >
              <div class="game-name">
                {{ $t("select_all") }}
              </div>
              <div class="event-count">
                <div>{{ game.events_count.total }}</div>
                <div class="check-box">
                  <div />
                </div>
              </div>
            </div>
            <div
              v-for="event in game.events_count.events"
              :key="event.event_id"
              class="event-item"
              :class="{
                checked: tempCheckedEventIds.includes(String(event.event_id)),
              }"
              @click.stop="setCheckEvent(String(event.event_id))"
            >
              <div class="game-name">
                {{ event.event_name }}
              </div>
              <div class="event-count">
                <div>{{ event.match_amount }}</div>
                <div class="check-box">
                  <div />
                </div>
              </div>
            </div>
          </div>
        </div>
        <!-- <div class="shadow" /> -->
      </div>
      <div class="screen-footer">
        <div @click="initList">
          {{ $t("reset") }}
        </div>
        <div @click="submit">
          {{ $t("submit") }}
        </div>
      </div>
    </div>
  </van-popup>
</template>

<style lang="scss" scoped>
.events-box {
  height: calc(var(--height) * 1px);
  width: 100%;
  transition: all 0.2s ease-in-out;
  overflow: hidden;
  background: #1f262d;
  font-size: 14px;
  color: rgba(255, 255, 255, 0.6);
  text-align: center;
  .event-item {
    height: 42px;
    width: calc(100% - 48px);
    margin: 0 24px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    .event-count {
      display: flex;
      align-items: center;
      font-family: Gotham-Medium;
      font-size: 14px;
      color: rgba(255, 255, 255, 0.6);
    }
  }
}
.check-box {
  height: 12px;
  width: 12px;
  border: 2px solid rgba(255, 255, 255, 0.6);
  border-radius: 50%;
  position: relative;
  margin: 0 2px 0 26px;
}
.checked {
  .game-name {
    color: #fff;
  }
  .event-count {
    color: #fe5e00 !important;
  }
  .check-box {
    border: 2px solid #fe5e00;
    div {
      position: absolute;
      height: 8px;
      width: 8px;
      top: 2px;
      left: 2px;
      border-radius: 50%;
      background-color: #fe5e00;
    }
  }
}
.icon-box {
  margin: 0 18px;
}
.league-screen {
  height: 100%;
  width: 100%;
  overflow: hidden;
  background: #262d34;
  border-radius: 16px 16px 0px 0px;
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  .screen-bottom {
    flex-grow: 1;
    width: 100%;
    overflow: auto;
    position: relative;
    .shadow {
      position: fixed;
      bottom: 84px;
      left: 0;
      height: 12px;
      width: 100%;
      background-image: linear-gradient(0deg, #00000040 0%, #00000000 94%);
    }
    .game-box {
      .game-tab-active {
        background-color: rgba(255, 255, 255, 0.03);
      }
      .game-tab {
        height: 48px;
        width: calc(100% - 48px);
        margin: auto;
        padding: 0 24px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        .checked-game{
          color: #fe5e00 !important;
        }
        .game-name {
          max-width: calc(100vw - 156px);
          word-break: break-all;
        }
        & > div {
          display: flex;
          align-items: center;
          &:nth-child(1) {
            font-size: 14px;
            color: #ffffff;
            text-align: center;
          }
          &:nth-child(2) {
            font-family: Gotham-Medium;
            font-size: 14px;
            color: rgba(255, 255, 255, 0.6);
            text-align: center;
          }
        }
      }
    }
  }
  .screen-footer {
    height: 84px;
    width: 100%;
    flex-shrink: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0px -8px 6px 0px rgba(24, 28, 34, 0.8);
    div {
      width: calc(50% - 18px);
      height: 48px;
      display: flex;
      justify-content: center;
      align-items: center;
      font-size: 16px;
      color: #ffffff;
      &:nth-child(1) {
        background: rgba(255, 255, 255, 0.06);
        border-radius: 4px 0px 0px 4px;
      }
      &:nth-child(2) {
        background-image: linear-gradient(90deg, #f16720 0%, #fd8908 94%);
        border-radius: 0px 4px 4px 0px;
      }
    }
  }
  .closed-icon {
    position: absolute;
    height: 20px;
    width: 20px;
    top: 25px;
    right: 38px;
  }
  .screen-header {
    height: 70px;
    width: calc(100% - 140px);
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 16px;
    color: #ffffff;
    font-weight: 500;
    flex-shrink: 0;
  }
  .screen-m {
    width: calc(100% - 28px);
    background: rgba(255, 255, 255, 0.06);
    height: 1px;
    border-radius: 1px;
    margin-bottom: 12px;
  }
}
</style>

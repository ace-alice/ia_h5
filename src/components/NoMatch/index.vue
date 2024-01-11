<script setup lang="ts" name="NoMatch">
import { gameInfoStore } from '@/store/gameInfo'
// import searchImg from '@/assets/home/que_sousuo_02.png'
const props = defineProps({
  isLive: {
    type: Boolean,
    default: false,
  },
})

const { toSearch, searchTeamName, currentHandicap, gameList } = storeToRefs(
  gameInfoStore(),
)

const hotSearch = computed(() => {
  const gameArr = [2, 1, 3, 16]
  const needGame = gameList.value.filter(game => gameArr.includes(+game.id))
  const temp: any[] = []
  needGame.forEach((game) => {
    if (
      game.events_count
      && game.events_count.events
      && game.events_count.events.length > 0
    ) {
      for (const event of game.events_count.events) {
        temp.push(event.event_name)
      }
    }
  })
  return temp
})

const goLink = () => {
  toSearch.value = false
  searchTeamName.value = ''
  currentHandicap.value = 'live'
}
</script>

<template>
  <div v-if="toSearch" class="search-no-match">
    <div class="header">
      <!-- <img class="search-img" :src="searchImg"> -->
      <div class="search-warn-text">
        {{ $t('searchTip1') }}"{{ searchTeamName }}"{{ $t('relatedInformation') }}
      </div>
      <div class="to-see">
        {{ $t("go") }}
        <span @click="goLink">{{ $t("live_bet") }}</span>
        {{ $t("takeLook") }}
      </div>
    </div>
    <div class="search-box">
      <div class="hot-search">
        {{ $t("hotSearch") }}
      </div>
      <div class="search-box-item">
        <div
          v-for="event in hotSearch"
          :key="event"
          @click="searchTeamName = event"
        >
          {{ event }}
        </div>
      </div>
    </div>
  </div>
  <div v-else class="no-match">
    {{ $t("no_data_now") }}
  </div>
</template>

<style lang="scss" scoped>
.no-match {
  height: calc(100vh - 240px);
  opacity: 0.6;
  font-size: 14px;
  color: #ffffff;
  letter-spacing: 0;
  font-weight: 400;
  text-align: center;
  padding: 120px 16px 0;
  width: calc(100vw - 32px);
}
.search-no-match {
  height: calc(100vh - 180px);
  padding: 40px 16px;
  background: #181c22;
  position: relative;
  &::after {
    position: absolute;
    content: "";
    top: 0;
    left: 0;
    width: 100%;
    height: 8px;
    background: #0e1519;
  }
  .search-box {
    .hot-search {
      font-size: 14px;
      color: #ffffff;
      font-weight: 500;
      position: relative;
      &::before {
        content: "";
        position: absolute;
        top: 2px;
        left: -6px;
        height: 12px;
        width: 2px;
        background: #fe5e00;
        border-radius: 1.5px;
      }
    }
    .search-box-item{
      display: flex;
      flex-wrap: wrap;
      div{
        background: rgba(255,255,255,0.07);
        font-size: #ffffff;
        opacity: 0.6;
        border-radius: 20px;
        padding: 8px 16px;
        border: 20px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        margin: 6px;
      }
    }
  }
  .header {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-bottom: 52px;
    .search-img {
      height: 234px;
      width: 234px;
      margin: auto;
    }
    .search-warn-text {
      opacity: 0.6;
      font-size: 14px;
      color: #ffffff;
      text-align: center;
      font-weight: 400;
      word-break: break-all;
    }
    .to-see {
      display: flex;
      align-items: center;
      font-size: 12px;
      color: rgba(255 255 255 / 60%);
      justify-content: center;
      margin-top: 8px;
      padding: 0 12px;

      span {
        display: flex;
        justify-content: center;
        align-items: center;
        // width: 42px;
        flex-shrink: 0;
        padding: 0 8px;
        height: 22px;
        margin: 0 6px;
        background-image: linear-gradient(90deg, #f16720 0%, #fd8908 94%);
        border-radius: 16px;
        color: #fff;
      }
    }
  }
}
</style>

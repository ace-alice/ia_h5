<script setup name="UniversallBox" lang="ts">
import DateSelectBox from './DateSelectBox.vue'
import getMatchListByAnyHook from '@/hooks/getMatchListByAnyHook'
import { gameInfoStore } from '@/store/gameInfo'

const props = defineProps({
  handicap: {
    type: String,
    default: 'code',
  },
})

const hasDateSelect = computed(() => {
  return ['fix', 'parlay', 'live'].includes(props.handicap)
})

const { currentGameId, currentHandicap } = storeToRefs(gameInfoStore())

const {
  matchListData,
  currentDate,
  weekDateOptions,
  changeCurrentDate,
  loadList,
} = getMatchListByAnyHook(props.handicap as any)
</script>

<template>
  <div class="list-box">
    <template v-if="hasDateSelect && currentHandicap === handicap ">
      <DateSelectBox
        :week-date-options="weekDateOptions"
        :current-date="currentDate"
        @change="changeCurrentDate"
      />
    </template>
    <template v-if="matchListData.length > 0 || loadList">
      <UniversalBetItem
        v-for="match in matchListData"
        :key="`${match.id}-${
          match.recommend_play?.id || 'recommend_play_id'
        }-${currentGameId}-${currentDate}`"
        :item-info="match"
      />
      <div class="off-height" />
    </template>
    <NoMatch v-else />
  </div>
</template>

<style lang="scss" scoped>
.off-height {
  height: calc(100vh - 140px);
  width: 100%;
}
</style>

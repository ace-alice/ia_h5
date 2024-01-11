<script setup name="ChampionBox" lang="ts">
import getChampionListByAnyHook from '@/hooks/getChampionListByAnyHook'
import { gameInfoStore } from '@/store/gameInfo'

const props = defineProps({
  handicap: {
    type: String,
    default: 'code',
  },
})

const { matchListData, loadList } = getChampionListByAnyHook()

const { currentGameId } = storeToRefs(gameInfoStore())
</script>

<template>
  <div class="list-box">
    <template v-if="matchListData.length > 0 || loadList">
      <ChampionBetItem
        v-for="match in matchListData"
        :key="`${match.id}-${currentGameId}`"
        :match-info="match"
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

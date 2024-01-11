<script lang="ts" setup name="GameListItem">
import GameSwipeItem from './components/GameSwipeItem.vue'
import GameTabsItem from './components/GameTabsItem.vue'
import { gameInfoStore } from '@/store/gameInfo'

const { toSearch } = storeToRefs(gameInfoStore())
</script>

<template>
  <div class="game-list-item" :class="{ 'to-search-item': toSearch }">
    <GameSwipeItem />
    <GameTabsItem />
  </div>
</template>

<style lang="scss" scoped>
.game-list-item {
  position: relative;
  height: 206px;
  transition: all 0.4s ease-in-out;
  overflow: hidden;
}

.to-search-item {
  height: 0 !important;
}
</style>

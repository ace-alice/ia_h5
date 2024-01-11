<script setup lang="ts" name="LeagueList">
import type { PropType } from 'vue'
import LeagueEmpty from './LeagueEmpty.vue'

const props = defineProps({
  matchList: {
    type: Array as PropType<any[]>,
    default: () => [],
  },
  gameId: {
    type: Number,
    default: 0,
  },
  loading: {
    type: Boolean,
    default: false,
  },
})
const heightTo = computed(() => {
  return ((+props.gameId ? 112 : 102) * document.body.clientWidth) / 375
})
</script>

<template>
  <div class="league-list" :style="{ '--box-height': heightTo }">
    <div class="league-list-main">
      <template v-if="matchList?.length > 0 || loading">
        <div class="to-box" />
        <UniversallSkeleton v-if="loading" :row="6" style="width: 100%" />
        <template v-else>
          <UniversalBetItem
            v-for="match in matchList"
            :key="`${match.id}-${
              match.recommend_play?.id || 'recommend_play_id'
            }`"
            :item-info="match"
          />
        </template>
        <div style="width: 100%; height: 112px" />
      </template>
      <LeagueEmpty v-else />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.league-list {
  min-height: 100vh;
  display: flex;
  justify-content: flex-end;

  .league-list-main {
    display: flex;
    overflow: hidden;
    width: calc(100% - 76px);
    flex-direction: column;
    align-items: flex-end;
    .to-box {
      width: 100%;
      height: calc(var(--box-height) * 1px);
    }
  }
  .universal-bet-item {
    margin: 0 12px 12px 12px;
  }
  &:deep(.UniversallSkeleton) {
    transform: translateX(3px);
  }
}
</style>

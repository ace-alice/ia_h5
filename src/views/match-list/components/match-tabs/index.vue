<script setup name="MatchTabs" lang="ts">
import UniversallBox from './components/UniversallBox.vue'
import EndBox from './components/EndBoxTemp.vue'
import ChampionBox from './components/ChampionBox.vue'
import { gameInfoStore } from '@/store/gameInfo'
const { toSearch } = storeToRefs(gameInfoStore())

const { handicapList, currentHandicap, currentGame } = storeToRefs(
  gameInfoStore(),
)
const { setInitHandicap } = gameInfoStore()

const offsetTop = computed(() => {
  return toSearch.value
    ? (49 * document.body.clientWidth) / 375
    : (89 * document.body.clientWidth) / 375
})

const vanTabsRef = ref<any>()

watch(() => currentGame.value, () => {
  vanTabsRef.value && vanTabsRef.value.resize()
})
</script>

<template>
  <van-tabs
    id="match-tabs"
    ref="vanTabsRef"
    v-model:active="currentHandicap"
    :offset-top="offsetTop"
    sticky
    swipeable
    :style="{ '--off-setTop': offsetTop }"
    @change="setInitHandicap"
  >
    <template #nav-bottom>
      <div id="match-nav-bottom" />
    </template>
    <van-tab
      v-for="handicap in handicapList"
      :key="handicap.code"
      :name="handicap.code"
    >
      <template #title>
        <div class="tabs-box">
          <span>{{ handicap.name }}</span>
          <span
            v-if="handicap.code !== 'favorite' && handicap.code !== 'end'"
            class="game-tabs-num"
          >
            {{ currentGame?.tag_count[handicap.code] || 0 }}
          </span>
        </div>
      </template>
      <template v-if="currentHandicap === handicap.code">
        <UniversallBox
          v-if="!['end', 'champion'].includes(handicap.code)"
          :handicap="handicap.code"
        />
        <ChampionBox
          v-if="'champion' === handicap.code"
          :handicap="handicap.code"
        />
        <EndBox v-if="'end' === handicap.code" :handicap="handicap.code" />
      </template>
      <template v-else>
        <UniversallSkeleton v-if="!['end', 'champion'].includes(handicap.code)" />
        <EndSkeleton v-if="'end' === handicap.code" />
        <ChampionSkeleton v-if="'champion' === handicap.code" />
      </template>
    </van-tab>
  </van-tabs>
</template>

<style lang="scss" scoped>
:deep(.van-tabs__wrap) {
  height: 50px;
}

:deep(.van-tabs__nav) {
  background: #181c2200;
}

:deep(.van-tabs__line) {
  bottom: 20px;
  width: 20px;
  background: #fe5e00;
  z-index: 0;
}

:deep(.van-tab) {
  opacity: 0.6;
  font-size: 14px;
  color: #fff;
  font-weight: 400;

  .game-tabs-num {
    margin-left: 4px;
    font-family: Gotham-Medium;
    flex-shrink: 0;
  }
}

:deep(.van-tab--active) {
  opacity: 1;
  font-size: 16px;
  color: #fff;
  font-weight: 500;

  .game-tabs-num {
    color: #fe5e00;
    margin-left: 4px;
  }
}

:deep(.van-sticky--fixed) {
  box-shadow: 0 20px 15px -15px rgba(0 0 0 / 70%);
  background: #181c22;
  .van-tabs__nav {
    background-image: url("@/assets/home/image_bg.png");
    background-size: 100%;
    background-repeat: no-repeat;
    background-position: 0 calc(var(--off-setTop) * -1px);
  }
}
</style>

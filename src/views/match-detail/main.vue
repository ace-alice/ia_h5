<script setup lang="ts" name="MatchDetailMain">
import matchDetailCom from './index.vue'
import { globalApiConfigStore } from '@/store/globalApiConfig'
const { matchDetailQuery } = storeToRefs(globalApiConfigStore())
const showMatchDetailCom = ref(false)
</script>

<template>
  <van-popup
    v-model:show="matchDetailQuery.show"
    :style="{ height: '100%', width: '100%', padding: 0, margin: 0, maxWidth: 'unset' }"
    teleport="body"
    z-index="1000"
    position="right"
    lazy-render
    @open="showMatchDetailCom = true"
    @closed="showMatchDetailCom = false"
  >
    <div class="match-detail-main">
      <matchDetailCom v-if="showMatchDetailCom" :key="matchDetailQuery.game_id" />
    </div>
  </van-popup>
</template>

<style scoped lang="scss">
.match-detail-main {
  height: 100%;
  width: 100%;
}
</style>

<script setup lang="ts" name="LeagueSidebar">
import { gameInfoStore } from '@/store/gameInfo'

const emit = defineEmits(['change'])

const gameActive = ref(-1)

const { gameList } = storeToRefs(gameInfoStore())

function sidebarChange(game: any) {
  window.scrollTo({ top: 0 })
  emit('change', game.id)
}
</script>

<template>
  <van-sidebar v-model="gameActive" class="league-sidebar">
    <template v-for="item in gameList" :key="item.id">
      <van-sidebar-item
        v-if="+item.id !== 0"
        :title="item.game_name"
        @click="sidebarChange(item)"
      />
    </template>
    <div style="display: flex; height: 12vh" />
  </van-sidebar>
</template>

<style lang="scss" scoped>
.league-sidebar {
  position: fixed;
  height: calc(100vh - 50px);
  top: 47px;
  left: 0;
  z-index: 200;
  background: #262d34 !important;
  width: 84px !important;

  &:deep(.van-sidebar-item__text) {
    max-height: 42px;
    overflow: hidden;
  }
  .van-sidebar-item {
    display: flex;
    align-items: center;
    width: 100%;
    height: 52px;
    background: #262d34;
    opacity: 0.6;
    font-size: 14px;
    color: #fff;
  }
  .van-sidebar-item--select {
    background: rgba(0 0 0 / 30%);
    opacity: 1;
    color: #fff;
    font-weight: 500;
  }

  .van-sidebar-item--select::before {
    height: 100%;
    width: 4px;
    background: #fe5e00;
    border-radius: 2px;
  }
}
</style>

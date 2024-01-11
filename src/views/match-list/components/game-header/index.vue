<script setup lang="ts" name="GameHeader">
import UserInfoItem from './components/UserInfoItem.vue'
import SelectEventItem from './components/SelectEventItem.vue'
import { gameInfoStore } from '@/store/gameInfo'
const { toSearch } = storeToRefs(gameInfoStore())
</script>

<template>
  <div class="game-header" :class="{ 'to-search': toSearch }">
    <div class="game-header-box">
      <SelectEventItem v-if="!toSearch" />
      <UserInfoItem />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.game-header {
  width: 100%;
  height: 50px;
  position: relative;
  z-index: 255;
  .game-header-box {
    position: absolute;
    display: flex;
    width: 100%;
    height: 50px;
    top: 0;
    left: 0;
    align-items: center;
    justify-content: space-between;
    overflow: hidden;
  }
}
.to-search {
  .game-header-box {
    position: fixed;
    z-index: 100;
    background: #181c22;
    background-image: url("@/assets/home/image_bg.png");
    background-size: 100vw;
    background-repeat: no-repeat;
  }
}
</style>

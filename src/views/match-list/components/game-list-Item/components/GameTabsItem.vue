<script setup lang="ts" name="GameTabsItem">
import { gameInfoStore } from '@/store/gameInfo'
import defaultIcon from '@/assets/home/default.png'
import moreIcon from '@/assets/home/tab_game_nor.png'
import allIcon from '@/assets/home/all.png'
const isShowTabs = inject('isShowTabs', false)
const opacityValue = inject('opacityValue', 1)
const gameTabActive = ref(0)
const { currentGameId, sortGameList } = storeToRefs(gameInfoStore())
const { setCurrentGameId } = gameInfoStore()
const expand = () => {
  const appDom = document.querySelector('#app')
  appDom && appDom.scrollTo({ top: 0, behavior: 'smooth' })
}
</script>

<template>
  <div
    class="game-tabs-item" :class="{ 'not-show-tabs': !isShowTabs }"
    :style="{ opacity: opacityValue > 0.48 ? 1 : opacityValue + 0.2 }"
  >
    <div class="game-tabs-item-box">
      <van-tabs v-model:active="gameTabActive">
        <van-tab v-for="(item, index) in sortGameList" :key="index">
          <template #title>
            <div class="game-icon" @click.stop="setCurrentGameId(String(item.id))">
              <van-image
                class="game-image" fit="contain" :class="{ 'tabs-image-active': item.id === +currentGameId }"
                :src="item.id === 0 ? allIcon : item.logo" :error-icon="defaultIcon" :show-loading="false"
              />
              <span
                :style="{
                  opacity: item.id === +currentGameId ? 1 : 0.6,
                  color: item.id === +currentGameId ? '#fe5e00' : '',
                }" class="van-ellipsis"
              >{{ item.game_name }}</span>
            </div>
          </template>
        </van-tab>
        <div class="more" @click.stop="expand">
          <img :src="moreIcon" :alt="$t('More_and_more')">
          <span>{{ $t("More_and_more") }}</span>
        </div>
      </van-tabs>
    </div>
  </div>
</template>

<style scoped lang="scss">
.not-show-tabs {
  opacity: 0 !important;
  z-index: 10;
  display: none !important;
}

.game-tabs-item {
  width: 100%;
  position: fixed;
  top: 0;
  left: 0;
  height: 90px;
  background: #181c22;
  background-image: url("@/assets/home/image_bg.png");
  background-size: 100%;
  background-repeat: no-repeat;
  opacity: 1;
  z-index: 20;
  display: flex;
  align-items: flex-end;
}

.game-tabs-item-box {
  width: calc(100% - 32px);
  margin: 0 auto;
  height: 78px;
  border-radius: 16px;
  box-sizing: border-box;
  overflow: hidden;
  background-color: #262d34;
  transition: all 0.4s ease-in-out;

  .game-image {
    width: 24px;
    height: 24px;
  }

  :deep(.tabs-image-active::before) {
    content: "";
    background: rgba(0 0 0 / 20%);
    position: absolute;
    width: 32px;
    height: 32px;
    left: -4px;
    top: -4px;
    border-radius: 6px;
  }

  :deep(.van-image__error, .van-image__loading) {
    background: transparent;

    img {
      width: 32px;
      height: 32px;
    }
  }

  :deep(.van-tab) {
    font-size: 12px;
    color: rgba(255 255 255 / 60%);
    font-weight: 400;
  }

  :deep(.van-tabs__wrap) {
    width: calc(100% - 48px);
    height: 84px;

    .van-tabs__nav {
      background: url("@/assets/home/image_zz.png");
      background-size: cover;
    }

    .van-tab--grow {
      padding: 0 8px;
    }

    .van-tab--active {
      font-size: 12px;
      color: #fff;
      font-weight: 500;
    }

    .game-icon {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      width: 48px;
      height: 84px;

      span {
        width: 70px;
        margin-top: 10px;
        color: #fff;
        text-align: center;
      }
    }

    .game-icon:active {
      span {
        transform: scale(1.1);
      }
    }
  }

  :deep(.van-tabs__line) {
    display: none;
  }

  .more {
    position: absolute;
    z-index: 100;
    height: 84px;
    width: 48px;
    top: 0;
    right: 0;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    background-color: #262d34;
    border-top-right-radius: 16px;
    border-bottom-right-radius: 16px;

    img {
      width: 24px;
      height: 24px;
    }

    span {
      margin-top: 8px;
      font-size: 12px;
      color: rgba(255 255 255 / 60%);
      font-weight: 400;
    }
  }

  .more::before {
    position: absolute;
    top: 0;
    left: -30px;
    content: "";
    width: 30px;
    height: 100%;
    background-image: url("../../../assets/home/image_zz.png");
    background-size: 100% 100%;
    background-repeat: no-repeat;
  }
}
</style>

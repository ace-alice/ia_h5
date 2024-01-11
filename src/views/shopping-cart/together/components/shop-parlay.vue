<script lang="ts">
import { defineComponent } from 'vue'
import { shopCartStore } from '@/store/shopCart'
import defaultIcon from '@/assets/home/default.png'
import deleteColIcon from '@/assets/home/home_delete.png'
import { fixedKeep, setItemName } from '@/utils'
import LockIcon from '@/assets/home/home_odds_lock.png'
export default defineComponent({
  name: 'ShopParlay',
  props: {
    betInfo: {
      type: Object,
      default: () => {},
    },
  },
  setup(props: any) {
    const { changeShopCartElement } = shopCartStore()
    function closeCart() {
      changeShopCartElement(String(props.betInfo.shop_id), 'parlay')
    }
    const isLock = computed(() => {
      return Boolean(+props.betInfo.status !== 1 || +(props.betInfo.is_hide || 0))
    })
    return { defaultIcon, deleteColIcon, closeCart, setItemName, isLock, LockIcon, fixedKeep }
  },
})
</script>

<template>
  <div
    class="together-main-row-game" :class="{
      'lock-disabled': isLock,
    }"
  >
    <div class="together-main-row-game-icon">
      <van-image
        class="game-logo-icon"
        width="16"
        height="16"
        :src="betInfo.game_logo"
        :error-icon="defaultIcon"
        :show-loading="false"
      />
    </div>
    <div class="together-main-row-game-info">
      <span>{{ betInfo.event_name }}</span>
      <span>{{
        `${
          betInfo.is_champion
            ? ""
            : setItemName(+betInfo.match, betInfo.stage_name).label
        } - ${betInfo.play_name} - ${betInfo.desc}`
      }}</span>
      <div>{{ betInfo.team_name_1 }} VS {{ betInfo.team_name_2 }}</div>
    </div>
    <div class="together-main-row-game-odds">
      <span v-show="!isLock">x{{ betInfo.odd.toFixed(fixedKeep) }}</span>
      <van-image
        v-show="isLock"
        :src="LockIcon"
        class="lock-image"
      />
      <img :src="deleteColIcon" @click.stop="closeCart">
    </div>
  </div>
</template>

<style scoped lang="scss">
.together-main-row-game {
  display: flex;
  justify-content: space-between;
  width: calc(100% - 36px);
  padding: 0 18px;
  height: 90px;

  &-icon {
    display: flex;
    width: 26px;

    :deep(.game-logo-icon) {
      img {
        width: 16px;
        height: 16px;
        margin-top: 16px;
      }
    }

    :deep(.van-image__error, .van-image__loading) {
      background: transparent;

      img {
        width: 16px;
        height: 16px;
        margin-top: 16px;
      }
    }
  }

  &-info {
    display: flex;
    flex-direction: column;
    justify-content: center;
    width: calc(100% - 100px);

    span:nth-child(1) {
      font-size: 14px;
      color: #fff;
      font-weight: 500;
    }

    span:nth-child(2) {
      margin: 6px 0;
      font-size: 12px;
      color: rgba(255 255 255 / 60%);
      font-weight: 400;
    }

    span:nth-child(3) {
      font-size: 12px;
      color: rgba(255 255 255 / 60%);
      font-weight: 400;
    }

    > div {
      font-family: PingFangSC-Regular;
      font-size: 12px;
      color: rgba(255 255 255 / 60%);
      font-weight: 400;
    }
  }

  &-odds {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    justify-content: center;
    width: 74px;
    font-size: 16px;
    color: #fff;
    line-height: 19px;
    font-weight: 500;

    img {
      width: 16px;
      height: 16px;
      margin-top: 24px;
    }
  }
}

.together-main-row-bg {
  background: rgba(254 94 0 / 10%);

  div,
  span {
    font-family: PingFangSC-Medium;
    font-size: 14px !important;
    color: #fe5e00 !important;
    font-weight: 500 !important;
  }
}

.lock-image {
  height: 20px;
  width: 20px;
  opacity: 0.2;
}

.lock-disabled {
  background: rgb(254 94 0 / 10%);
}
</style>

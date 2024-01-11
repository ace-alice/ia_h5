<!-- eslint-disable @typescript-eslint/no-use-before-define -->
<script lang="ts">
import { defineComponent, ref, watch } from 'vue'
import { fixedKeep, setItemName, toFixedNumber } from '@/utils'
import { shopCartStore } from '@/store/shopCart'
import defaultIcon from '@/assets/home/default.png'
import deleteColIcon from '@/assets/home/home_delete.png'
import LockIcon from '@/assets/home/home_odds_lock.png'
export default defineComponent({
  name: 'ShopSingle',
  props: {
    singleItem: {
      type: Object,
      default: () => {},
    },
    shopAmount: {
      type: [Number],
      default: () => 0,
    },
    showKey: {
      type: Boolean,
      default: false,
    },
  },
  emits: ['changeAmountEmit', 'activeIndex'],
  setup(props: any, { emit }) {
    const { changeShopCartElement } = shopCartStore()
    const betCount = ref(props.shopAmount)
    function closeCart() {
      changeShopCartElement(String(props.singleItem.shop_id), 'single')
    }
    const betCalcClick = () => {
      if (+props.singleItem.status !== 1) {
        return
      }
      selfShowKey.value = true
      emit('activeIndex')
    }
    watch(
      () => betCount.value,
      (newVal) => {
        if ((betCount.value || 0) > Number(props.singleItem.money_max)) {
          betCount.value = Number(props.singleItem.money_max)
          return
        }
        emit('changeAmountEmit', {
          cartId: props.singleItem.shop_id,
          amount: toFixedNumber(newVal),
        })
      },
    )

    const isLock = computed(() => {
      return Boolean(
        +props.singleItem.status !== 1 || +(props.singleItem.is_hide || 0),
      )
    })

    const selfShowKey = ref(false)

    watch(
      () => props.shopAmount,
      (newVal) => {
        betCount.value = newVal
      },
    )

    return {
      defaultIcon,
      deleteColIcon,
      betCount,
      setItemName,
      closeCart,
      betCalcClick,
      toFixedNumber,
      isLock,
      LockIcon,
      selfShowKey,
      fixedKeep,
    }
  },
})
</script>

<template>
  <div
    class="ordinary-main-row"
    :class="{
      'lock-disabled': isLock,
    }"
  >
    <div class="ordinary-main-row-game">
      <div class="ordinary-main-row-game-icon">
        <van-image
          class="game-logo-icon"
          width="16"
          height="16"
          :src="singleItem.game_logo"
          :error-icon="defaultIcon"
          :show-loading="false"
        />
      </div>
      <div class="ordinary-main-row-game-info">
        <span>{{ singleItem.event_name }}</span>
        <span>{{
          `${
            singleItem.is_champion
              ? ""
              : setItemName(+singleItem.match, singleItem.game_lang).label
          } - ${singleItem.play_name} - ${singleItem.desc}`
        }}</span>
        <div v-if="!singleItem.is_champion">
          <span>{{ singleItem.team_name_1 }} VS {{ singleItem.team_name_2 }}</span>
        </div>
      </div>
      <div class="ordinary-main-row-game-odds">
        <span v-show="!isLock">x{{ toFixedNumber(singleItem.odd).toFixed(fixedKeep) }}</span>
        <van-image v-show="isLock" :src="LockIcon" class="lock-image" />
        <img
          :src="deleteColIcon"
          style="z-index: 2000"
          @click.stop="closeCart"
        >
      </div>
    </div>
    <div class="ordinary-main-row-price">
      <div class="ordinary-main-row-price-text">
        <div>
          <span />
          <span>{{ $t("single_bet") }}</span>
        </div>
        <div>
          <span>{{ $t("expected_profit") }}</span>
          <span>{{ toFixedNumber(betCount * singleItem.odd).toFixed(fixedKeep) }}</span>
        </div>
      </div>
      <div class="ordinary-main-row-price-value">
        <div @click="betCalcClick">
          <span v-if="betCount" class="val-show">{{ betCount.toFixed(fixedKeep) }}</span>
          <span v-else class="val-hide">{{ singleItem.money_min }}-{{ singleItem.money_max }}</span>
        </div>
      </div>
    </div>
    <div
      v-if="betCount > 0 && betCount < singleItem.money_min"
      class="ordinary-min-amount"
    >
      {{ $t("minAmount") }}{{ singleItem.money_min }}
    </div>
    <SoftKeyboard
      :show="showKey && +singleItem.status === 1 && selfShowKey"
      :value="betCount"
      :money-max="singleItem.money_max"
      :money-min="singleItem.money_min"
      @change="(value) => (betCount = value)"
      @confirm="selfShowKey = false"
    />
  </div>
</template>

<style scoped lang="scss">
.ordinary-main {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: calc(100% - 190px);
  overflow-y: auto;
  overflow-x: hidden;

  &-row {
    &-game {
      display: flex;
      justify-content: space-between;
      width: calc(100% - 36px);
      padding: 0 18px;
      min-height: 90px;

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

    &-price {
      display: flex;
      align-items: center;
      width: calc(100% - 36px);
      padding: 0 18px;
      height: 54px;
      background: rgba(255 255 255 / 3%);

      &-text {
        display: flex;
        flex-direction: column;
        width: calc(100% - 132px);

        div:nth-child(1) {
          display: flex;
          align-items: center;
          font-size: 14px;
          color: #fff;
          font-weight: 500;

          span:nth-child(1) {
            width: 2px;
            height: 12px;
            background: #fecb00;
            border-radius: 1.5px;
            margin-right: 8px;
          }
        }

        div:nth-child(2) {
          margin-top: 4px;
          font-size: 12px;

          span:nth-child(1) {
            margin: 0 8px 0 10px;
            color: rgba(255 255 255 / 60%);
            font-weight: 400;
          }

          span:nth-child(2) {
            color: #fecb00;
            font-weight: 500;
          }
        }
      }

      &-value {
        display: flex;
        align-items: center;
        width: 132px;

        :deep(.van-cell) {
          align-items: center;
          text-align: right;
          height: 36px;
          padding-top: 0;
          padding-bottom: 0;
          background: #262d34;
          border-radius: 8px;
        }

        :deep(.van-field__control) {
          text-align: right;
          font-size: 14px;
          color: #fff;
          font-weight: 500;
        }

        ::placeholder {
          font-size: 14px;
          color: #ffffff19;
          font-weight: 500;
          text-align: right;
        }

        div {
          display: flex;
          align-items: center;
          padding: 0 14px;
          width: 104px;
          height: 36px;
          background: #262d34;
          border-radius: 8px;

          .val-hide {
            font-family: Gotham-Medium;
            font-size: 14px;
            color: #ffffff19;
            font-weight: 500;
          }

          .val-show {
            font-family: Gotham-Medium;
            font-size: 14px;
            color: #ffff;
            font-weight: 500;
          }
        }
      }
    }
  }

  &-disabled {
    background: rgba(254 94 0 / 10%);

    :deep(.van-cell) {
      background: rgba(60 50 47 / 100%);
    }
  }

  .lock-image {
    height: 21px;
    width: 21px;
    opacity: 0.2;
  }
}

.lock-disabled {
  position: relative;

  &::before {
    position: absolute;
    left: 0;
    top: 0;
    content: "";
    height: 100%;
    width: 100%;
    background: rgb(254 94 0 / 10%);
  }
}
.ordinary-min-amount {
  display: flex;
  width: 100%;
  height: 32px;
  line-height: 32px;
  background: rgba(254 94 0 / 10%);
  font-family: PingFangSC-Regular;
  font-size: 12px;
  color: #fe5e00;
  letter-spacing: 0;
  font-weight: 400;
  padding-left: 26px;
  animation: show 0.8s ease-in-out;
  overflow: hidden;
}
@keyframes show {
  0% {
    height: 0;
  }
  60% {
    height: 0;
  }
  100% {
    height: 32px;
  }
}
</style>

<script lang="ts">
import { defineComponent, ref, watch } from 'vue'
import { showToast } from 'vant'
import { userInfoStore } from '@/store/userInfo'
import { shopCartStore } from '@/store/shopCart'
import lingImg from '@/assets/home/pop_high.png'
import messageIcon from '@/assets/home/pop_high_01.png'
import { i18n } from '@/locale'
export default defineComponent({
  name: 'SingleBetBox',
  props: {
    totalBet: {
      type: Number,
      default: 0,
    },
    totalBonus: {
      type: Number,
      default: 0,
    },
    disabled: {
      type: Boolean,
      default: true,
    },
  },
  emits: ['toBet', 'acceptChange'],
  setup(props: any, { emit }: any) {
    const warnMessage = i18n.global.t('betTip1')

    const hasChange = ref(false)

    const { balanceInfo } = storeToRefs(userInfoStore())

    const { oddDelivery, singleCartList } = storeToRefs(shopCartStore())

    let oldShopCartList: any = JSON.parse(JSON.stringify(singleCartList.value))

    watch(
      () => singleCartList.value,
      (newVal) => {
        switch (oddDelivery.value) {
          case 2:
            hasChange.value = false
            break
          case 1:
            hasChange.value = newVal.some((_shop: any) => {
              const oldData = oldShopCartList.find((shop: any) => {
                return +shop.shop_id === +_shop.shop_id
              })
              if (oldData && +oldData.odd > +_shop.odd) {
                return true
              }
              else {
                return false
              }
            })
            break
          case 0:
            hasChange.value = newVal.some((_shop: any) => {
              const oldData = oldShopCartList.find((shop: any) => {
                return +shop.shop_id === +_shop.shop_id
              })
              if (oldData && oldData && +oldData.odd !== +_shop.odd) {
                return true
              }
              else {
                return false
              }
            })
            break
        }
        oldShopCartList = JSON.parse(JSON.stringify(newVal))
      },
      { deep: true },
    )

    const betMessage = () => {
      if (+props.totalBet > +(balanceInfo.value.amount || 0)) {
        showToast({
          icon: messageIcon,
          className: 'bet-toast-message message-width1 bet-pop',
          message: i18n.global.t('balance_short'),
        })
      }
    }

    function toBet() {
      if (hasChange.value) {
        hasChange.value = false
        return
      }
      if (props.disabled) {
        return betMessage()
      }
      emit('toBet')
    }
    watch(
      () => props.totalBet,
      (newVal) => {
        if (newVal) {
          betMessage()
        }
      },
    )
    return { toBet, hasChange, warnMessage, betMessage, lingImg, messageIcon }
  },
})
</script>

<template>
  <div class="ordinary-footer">
    <div class="messages-box">
      <!--      <div v-show="betMessage" class="warn-box"> -->
      <!--        <img :src="lingImg" alt=""> -->
      <!--        <span> -->
      <!--          {{ betMessage }} -->
      <!--        </span> -->
      <!--      </div> -->
      <div v-show="hasChange" class="warn-box">
        <img :src="lingImg" alt="">
        <span>
          {{ warnMessage }}
        </span>
      </div>
    </div>
    <div class="ordinary-footer-sum">
      <div>
        <span>{{ $t("tot_bet") }}：</span>
        <span>{{ totalBet }}</span>
      </div>
      <div>
        <span>{{ $t("expected_profit") }}：</span>
        <span>{{ totalBonus }}</span>
      </div>
    </div>
    <div class="ordinary-footer-button" @click="toBet">
      <span :class="{ 'checked': !disabled, 'has-change': hasChange }">{{
        hasChange ? $t("acceptChange") : $t("bet_now")
      }}</span>
    </div>
  </div>
</template>

<style scoped lang="scss">
.ordinary-footer {
  position: absolute;
  left: 0;
  bottom: 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: calc(100% - 36px);
  height: 76px;
  padding: 0 18px;
  background: #262d34;
  border-radius: 0 0 16px 16px;
  .messages-box {
    position: absolute;
    bottom: 76px;
    width: calc(100% - 36px);

    & > div {
      background: #3b4045;
      border-radius: 8px;
      min-height: 48px;
      display: flex;
      padding: 0 24px;
      align-items: center;
      font-size: 12px;
      color: #e1a100;
      font-weight: 500;
      img {
        height: 24px;
        width: 24px;
        margin-right: 24px;
      }
      span {
        white-space: pre-wrap;
        word-break: break-all;
      }
      & + div {
        margin-top: 12px;
      }
    }
  }
  &-sum {
    display: flex;
    flex-direction: column;
    div {
      display: flex;
      font-size: 12px;
      font-weight: 500;
      color: #ffffff;
      span:nth-child(2) {
        font-family: Gotham-Medium;
      }
    }
    div:nth-child(2) {
      margin-top: 6px;
      span:nth-child(2) {
        color: #fecb00;
      }
    }
  }
  &-button {
    span {
      display: flex;
      justify-content: center;
      align-items: center;
      width: 162px;
      height: 40px;
      border-radius: 4px;
      font-size: 16px;
      color: #ffffff;
      letter-spacing: 0;
      font-weight: 500;
      background: rgba(255, 255, 255, 0.06);
    }
    .checked {
      background-image: linear-gradient(90deg, #f16720 0%, #fd8908 94%);
      border-radius: 4px;
      transition: all 0.2s linear;
      &:active {
        transform: scale(0.8);
        opacity: 0.6;
      }
    }
  }
}
</style>

<script lang="ts">
import { computed, defineAsyncComponent, getCurrentInstance, ref } from 'vue'
import { storeToRefs } from 'pinia'
import parlayCartHook from '@/hooks/parlayCartHook'
import { userInfoStore } from '@/store/userInfo'
import { shopCartStore } from '@/store/shopCart'
import {
  fixedKeep,
  toFixedNumber,
} from '@/utils'
import deleteIcon from '@/assets/home/recycle bin-01.png'
import deleteColIcon from '@/assets/home/home_delete.png'
import carSettIcon from '@/assets/home/my_ home_set.png'
import defaultIcon from '@/assets/home/default.png'
import expandIcon from '@/assets/home/com_combinations_01.png'
import packIcon from '@/assets/home/com_combinations_02.png'
import emptyImg from '@/assets/home/empty.png'
// 投注列表
const shopParlay = defineAsyncComponent(
  () => import('./components/shop-parlay.vue'),
)
// 投注
const parlayBetBox = defineAsyncComponent(
  () => import('./components/parlay-bet-box.vue'),
)
const OddsModal = defineAsyncComponent(
  () => import('../components/odds-modal/index.vue'),
)

export default {
  name: 'TogetherCart',
  components: { ShopParlay: shopParlay, ParlayBetBox: parlayBetBox, OddsModal },
  setup() {
    const { balanceInfo } = storeToRefs(userInfoStore())
    const { clearShopCart } = shopCartStore()
    const { oddDeliveryInfo } = storeToRefs(shopCartStore())
    const fastBetChecked = ref(false)
    const { singleIds, parlayIds } = storeToRefs(shopCartStore())
    const indexList = [
      0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20,
      21, 22, 23, 24, 25,
    ]
    const activeIndex = ref(-1)
    const visiable = ref(false)
    const showAll = ref(false)
    const togetherShow = ref(false)
    const carType = ref(2)
    const { proxy } = getCurrentInstance() as any
    const {
      parlayCartList,
      betOptions,
      totalBet,
      totalPrice,
      toBet,
      isAllowToBet,
      messages,
      setShoppingCarCount,
    } = parlayCartHook()
    const clearAllShopping = () => {
      clearShopCart('parlay')
    }
    const parleyLen = computed(() => {
      return parlayIds.value.length > 0 && singleIds.value.length === 0
    })
    const betTogetherClick = (index: number) => {
      togetherShow.value = true
      activeIndex.value = index
      setTimeout(() => {
        proxy.$refs.togetherIndexBar.scrollTo(index)
      }, 200)
    }
    const singleChangeKeyboard = (val: any) => {
      if (activeIndex.value === -1) {
        activeIndex.value = val
      }
      else {
        activeIndex.value = -1
        togetherShow.value = false
      }
    }
    const close = () => {
      visiable.value = false
    }

    const changeDragx = (el: any) => {
      proxy.mittBus.emit('dragShopping', el)
    }

    return {
      deleteIcon,
      expandIcon,
      packIcon,
      deleteColIcon,
      carSettIcon,
      defaultIcon,
      emptyImg,
      fastBetChecked,
      parlayCartList,
      balanceInfo,
      totalBet,
      totalPrice,
      betOptions,
      isAllowToBet,
      visiable,
      showAll,
      toBet,
      toFixedNumber,
      clearAllShopping,
      close,
      oddDeliveryInfo,
      messages,
      parleyLen,
      betTogetherClick,
      activeIndex,
      singleChangeKeyboard,
      indexList,
      togetherShow,
      setShoppingCarCount,
      carType,
      changeDragx,
      fixedKeep,
    }
  },
}
</script>

<template>
  <div
    class="together"
    :style="{ margin: parleyLen ? '0 5px 0 18px' : '0 18px 0 5px' }"
  >
    <div class="together-header">
      <div class="together-header-l">
        <span>{{ $t("parlay_game") }}</span>
        <span>{{ parlayCartList.length }}</span>
      </div>
      <div class="together-header-c" @touchstart="changeDragx($event)">
        <span />
      </div>
      <div class="together-header-r">
        <div>
          <span>{{ $t("v_balance") }}</span>
          <span>{{ toFixedNumber(balanceInfo.amount).toFixed(fixedKeep) }}</span>
        </div>
        <img :src="deleteIcon" @click.stop="clearAllShopping">
      </div>
    </div>
    <div class="together-subheader">
      <div class="together-subheader-l">
        <span>{{ $t("defaultOddsSettings") }}</span>
      </div>
      <div class="together-subheader-r" @click="visiable = !visiable">
        <span>{{ oddDeliveryInfo }}</span>
        <img :src="carSettIcon">
      </div>
    </div>
    <div class="together-main">
      <div v-if="parlayCartList.length > 0" class="together-main-row">
        <ShopParlay
          v-for="betInfo in parlayCartList"
          :key="betInfo.shop_id"
          :bet-info="betInfo"
        />
        <div class="together-main-row-price">
          <!--          :style="{ height: mainHeight }" -->
          <div class="together-main-row-price-text">
            <div>
              <span />
              <span>{{ $t("passOption") }}</span>
            </div>
            <div v-if="betOptions.length > 1" @click="showAll = !showAll">
              <div v-show="!showAll" class="more-options">
                {{ $t('more_combo') }}
              </div>
              <img
                v-show="!showAll"
                :src="expandIcon"
              >
              <img
                v-show="showAll"
                :src="packIcon"
              >
            </div>
          </div>
          <van-index-bar
            v-if="betOptions.length > 0"
            ref="togetherIndexBar"
            :index-list="indexList"
          >
            <div
              v-for="(subItem, index) in betOptions"
              :key="subItem.name"
              class="together-main-row-price-value"
            >
              <van-index-anchor :index="index" />
              <div
                v-if="(!showAll && index === 0) || showAll"
                class="value-main"
              >
                <div class="text">
                  <div>
                    <span>{{ subItem.name }}</span>
                    <span v-show="+subItem.point > 0">
                      x{{ toFixedNumber(subItem.point) }}
                    </span>
                  </div>
                  <div>
                    <span>{{ $t("expected_profit") }}</span>
                    <span>{{ subItem.price() }}</span>
                  </div>
                </div>
                <div class="field-input">
                  <span class="field-input-span">{{ subItem.num }}x</span>
                  <div @click="betTogetherClick(index)">
                    <span v-if="subItem.amount" class="val-show">{{
                      subItem.amount
                    }}</span>
                    <span v-else class="val-hide">{{ subItem.money_min() }}-{{ subItem.money_max() }}</span>
                  </div>
                </div>
              </div>
              <div
                v-if="
                  (subItem.amount || 0) > 0
                    && (subItem.amount || 0) < subItem.money_min()
                "
                class="ordinary-min-amount"
              >
                {{ $t("minAmount") }}{{ subItem.money_min() }}
              </div>
              <SoftKeyboard
                :value="subItem.amount || 0"
                :show="activeIndex === index && togetherShow"
                :money-max="subItem.money_max()"
                :money-min="subItem.money_min()"
                @confirm="togetherShow = false"
                @change="(value:any) => (subItem.amount = value)"
              />
            </div>
          </van-index-bar>
        </div>
      </div>
      <div v-else>
        <van-empty :image="emptyImg" :image-size="234" />
      </div>
    </div>
    <ParlayBetBox
      :total-bet="totalBet"
      :total-price="totalPrice"
      :disabled="!isAllowToBet"
      :messages="messages"
      @toBet="toBet"
    />
  </div>
  <OddsModal :show-model="visiable" @on-close="close" />
</template>

<style lang="scss" scoped>
.together {
  position: relative;
  height: 100%;
  background: #262d34;
  margin: 0 18px 0 5px;
  border-radius: 16px;

  &-header {
    display: flex;
    justify-content: space-between;
    height: 72px;
    padding: 0 18px;

    &-l {
      display: flex;
      align-items: center;
      width: 40%;
      height: 72px;
      font-size: 16px;
      font-weight: 500;

      span:nth-child(1) {
        color: #fff;
      }

      span:nth-child(2) {
        color: #fecb00;
        margin-left: 8px;
        font-family: Gotham-Medium;
      }
    }

    &-c {
      display: flex;
      justify-content: center;
      width: 20%;

      span {
        width: 32px;
        height: 3px;
        opacity: 0.2;
        background: #fff;
        border-radius: 3px;
        margin-top: 12px;
      }
    }

    &-r {
      display: flex;
      height: 72px;
      width: 40%;
      align-items: center;
      justify-content: flex-end;

      div {
        display: flex;
        flex-direction: column;
        align-items: flex-end;
        font-size: 12px;
        font-weight: 500;

        span:nth-child(1) {
          color: #fff;
        }

        span:nth-child(2) {
          color: #fecb00;
          font-family: Gotham-Medium;
        }
      }

      img {
        width: 20px;
        height: 20px;
        margin-left: 17px;
      }
    }
  }

  &-subheader {
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 42px;
    padding: 0 18px;
    background: rgba(255 255 255 / 3%);

    &-l {
      display: flex;
      align-items: center;

      span {
        margin-right: 16px;
        font-size: 12px;
        color: #fff;
        font-weight: 400;
      }
    }

    &-r {
      display: flex;
      align-items: center;

      span {
        margin-right: 16px;
        font-size: 12px;
        color: rgba(255 255 255 / 60%);
        font-weight: 400;
      }

      img {
        width: 16px;
        height: 16px;
      }
    }
  }

  &-main {
    display: flex;
    flex-direction: column;
    height: calc(100% - 190px);
    overflow: scroll;

    :deep(.van-empty__description) {
      opacity: 0.6;
      font-family: PingFangSC-Regular;
      font-size: 14px;
      color: #fff;
      letter-spacing: 0;
      font-weight: 400;
    }

    &-row {
      :deep(.van-index-bar__sidebar) {
        display: none;
      }

      :deep(.van-index-anchor) {
        height: 0;
        opacity: 0;
      }

      &-price {
        background: rgba(255 255 255 / 3%);
        transition: all 0.2s ease-in-out;

        &-text {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin: auto;
          width: calc(100% - 36px);
          height: 32px;

          div:nth-child(1) {
            display: flex;
            align-items: center;
            font-size: 14px;
            color: #fff;
            font-weight: 500;

            span:nth-child(1) {
              width: 2px;
              height: 12px;
              background: #fe5e00;
              border-radius: 1.5px;
              margin-right: 8px;
            }
          }

          div:nth-child(2) {
            display: flex;
            align-items: center;
            .more-options {
              background: rgba(254, 94, 0, 0.2);
              border-radius: 2px;
              line-height: 20px;
              margin-right: 4px;
              font-size: 12px;
              color: #fe5e00;
              padding: 0 6px;
              font-weight: 400;
            }
            img {
              width: 16px;
              height: 16px;
            }
          }
        }

        &-value {
          display: flex;
          align-items: center;
          flex-direction: column;

          .value-main {
            display: flex;
            justify-content: space-between;
            width: calc(100% - 36px);
            margin-top: 8px;
            margin-bottom: 8px;
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

          .text {
            display: flex;
            flex-direction: column;
            width: calc(100% - 132px);
            justify-content: space-between;

            div:nth-child(1) {
              display: flex;
              color: #fff;

              span:nth-child(1) {
                width: 56px;
                font-size: 14px;
                font-weight: 400;
              }

              span:nth-child(2) {
                font-size: 16px;
                font-weight: 500;
              }
            }

            div:nth-child(2) {
              display: flex;
              font-size: 12px;

              span:nth-child(1) {
                width: 56px;
                color: rgba(255 255 255 / 60%);
                font-weight: 400;
              }

              span:nth-child(2) {
                color: #fecb00;
                font-weight: 500;
              }
            }
          }

          .field-input {
            position: relative;
            display: flex;
            align-items: center;
            width: 132px;

            &-span {
              position: absolute;
              left: 4px;
              font-size: 14px;
              color: rgba(255 255 255 / 60%);
              font-weight: 500;
            }

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
              justify-content: flex-end;

              span {
                width: calc(100% - 30px);
                text-align: right;
                overflow: hidden;
              }

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

      &-keyboard {
        display: none;
      }
    }

    &-disabled {
      background: rgba(254 94 0 / 10%);

      :deep(.van-cell) {
        background: rgba(60 50 47 / 100%);
      }
    }
  }
}
</style>

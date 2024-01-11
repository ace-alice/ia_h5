<script lang="ts">
import { defineAsyncComponent, defineComponent, getCurrentInstance, onMounted, ref } from 'vue'
import { storeToRefs } from 'pinia'
import singleCartHook from '@/hooks/singleCartHook'
import { fixedKeep, setItemName, toFixedNumber } from '@/utils'
import { userInfoStore } from '@/store/userInfo'
import { shopCartStore } from '@/store/shopCart'
import emptyImg from '@/assets/home/empty.png'
import deleteIcon from '@/assets/home/recycle bin-01.png'
import deleteColIcon from '@/assets/home/home_delete.png'
import carSettIcon from '@/assets/home/my_ home_set.png'
import defaultIcon from '@/assets/home/default.png'
const OddsModal = defineAsyncComponent(
  () => import('../components/odds-modal/index.vue'),
)
const ShopSingle = defineAsyncComponent(
  () => import('./components/shop-single.vue'),
)
const SingleBetBox = defineAsyncComponent(
  () => import('./components/single-bet-box.vue'),
)
export default defineComponent({
  name: 'OrdinaryCart',
  components: {
    ShopSingle,
    SingleBetBox,
    OddsModal,
  },
  setup(props: any) {
    const isShow = ref(false)
    const { clearShopCart } = shopCartStore()
    const { delivery, oddDelivery, oddDeliveryInfo } = storeToRefs(
      shopCartStore(),
    )
    const { balanceInfo } = storeToRefs(userInfoStore())
    const activeIndex = ref(-1)
    const calcPrice = ref(0)
    const { proxy } = getCurrentInstance() as any
    const carType = ref(1)
    const indexList = [
      0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20,
      21, 22, 23, 24, 25,
    ]
    const {
      singleBetAmount,
      singleCartList,
      totalBet,
      totalPrice,
      toBet,
      acceptChange,
      setShoppingCarCount,
      isAllowToBet,
    } = singleCartHook()
    const clearAllShopping = () => {
      clearShopCart('single')
    }
    const close = () => {
      isShow.value = false
    }
    const getActiveIndex = (index: number) => {
      activeIndex.value = index
      setTimeout(() => {
        proxy.$refs.ordinaryIndexBar.scrollTo(index)
      }, 160)
    }
    const changeDragx = (el: any) => {
      proxy.mittBus.emit('dragShopping', el)
    }
    onMounted(() => {})
    return {
      emptyImg,
      deleteIcon,
      deleteColIcon,
      carSettIcon,
      defaultIcon,
      singleCartList,
      singleBetAmount,
      totalBet,
      totalPrice,
      balanceInfo,
      isShow,
      toBet,
      acceptChange,
      setItemName,
      setShoppingCarCount,
      clearAllShopping,
      close,
      indexList,
      activeIndex,
      getActiveIndex,
      calcPrice,
      delivery,
      oddDelivery,
      oddDeliveryInfo,
      isAllowToBet,
      carType,
      changeDragx,
      toFixedNumber,
      fixedKeep,
    }
  },
})
</script>

<template>
  <div class="ordinary">
    <div class="ordinary-header">
      <div class="ordinary-header-l">
        <span>{{ $t("single_bet") }}</span>
        <span>{{ singleCartList.length }}</span>
      </div>
      <div class="ordinary-header-c" @touchstart="changeDragx($event)">
        <span />
      </div>
      <div class="ordinary-header-r">
        <div>
          <span>{{ $t("v_balance") }}</span>
          <span>{{ toFixedNumber(balanceInfo.amount).toFixed(fixedKeep) }}</span>
        </div>
        <img :src="deleteIcon" @click="clearAllShopping">
      </div>
    </div>
    <div class="ordinary-subheader">
      <div class="ordinary-subheader-l">
        <span>{{ $t("quickBet") }}</span>
        <van-switch
          v-model="delivery"
          size="14px"
          active-color="rgba(254,94,0,0.80)"
          inactive-color="rgba(255,255,255,0.20)"
        />
      </div>
      <div class="ordinary-subheader-r" @click.stop="isShow = !isShow">
        <span>{{ oddDeliveryInfo }}</span>
        <img :src="carSettIcon">
      </div>
    </div>
    <div class="ordinary-main">
      <div v-if="singleCartList.length > 0" class="shop-single-list">
        <van-index-bar ref="ordinaryIndexBar" :index-list="indexList">
          <div v-for="(car, index) in singleCartList" :key="car.shop_id">
            <van-index-anchor :index="index" />
            <ShopSingle
              :single-item="car"
              :shop-amount="singleBetAmount[`single${car.shop_id}`] || 0"
              :show-key="index === activeIndex"
              @change-amount-emit="setShoppingCarCount"
              @activeIndex="getActiveIndex(index)"
            />
          </div>
        </van-index-bar>
        <div class="top-box" />
      </div>
      <div v-else>
        <van-empty :image="emptyImg" :image-size="234" />
      </div>
    </div>
    <SingleBetBox
      :total-bet="totalBet"
      :total-bonus="totalPrice"
      :disabled="!isAllowToBet"
      @toBet="toBet"
    />
  </div>
  <OddsModal :show-model="isShow" @on-close="close" />
</template>

<style lang="scss" scoped>
.top-box {
  height: calc(100% - 144px);
  width: 100%;
}
.ordinary {
  position: relative;
  height: 100%;
  background: #262d34;
  margin: 0 5px 0 18px;
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
        margin-top: 2px;
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

      :deep(.van-switch) {
        width: 36px;
        height: 21px;
      }

      :deep(.van-switch__node) {
        top: 4px;
        left: 4px;
      }

      :deep(.van-switch--on) {
        .van-switch__node {
          transform: translate(
            calc(var(--van-switch-width) - var(--van-switch-node-size) - 2px)
          );
        }
      }

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
    overflow: auto;

    .shop-single-list {
      width: 100%;
      height: 100%;
      overflow-x: hidden;
      overflow-y: scroll;
    }

    :deep(.van-empty__description) {
      opacity: 0.6;
      font-family: PingFangSC-Regular;
      font-size: 14px;
      color: #fff;
      letter-spacing: 0;
      font-weight: 400;
    }

    :deep(.van-index-bar__sidebar) {
      display: none;
    }

    :deep(.van-index-anchor) {
      height: 0;
      opacity: 0;
    }

    &-row {
      &-game {
        display: flex;
        justify-content: space-between;
        width: calc(100% - 36px);
        padding: 0 18px;
        height: 90px;

        &-icon {
          display: flex;
          width: 26px;

          img {
            width: 16px;
            height: 16px;
            margin-top: 16px;
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
        }
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

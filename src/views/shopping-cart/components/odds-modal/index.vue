<script lang="ts">
import { defineComponent, ref } from 'vue'
import activeIcon from '@/assets/home/com_choose_on.png'
import inactiveIcon from '@/assets/home/com_choose_nor.png'
import closeIcon from '@/assets/home/com_delete.png'
import expandIcon from '@/assets/home/home_more_right.png'
import { shopCartStore } from '@/store/shopCart'
import { gameInfoStore } from '@/store/gameInfo'
import { i18n } from '@/locale'
import { globalApiConfigStore } from '@/store/globalApiConfig'
export default defineComponent({
  name: 'OddsModal',
  components: {},
  props: {
    showModel: {
      type: Boolean,
      default: false,
    },
  },
  emits: ['onClose'],
  setup(props: any, { emit }: any) {
    const { oddDelivery } = storeToRefs(shopCartStore())

    const { shoppingShow } = storeToRefs(globalApiConfigStore())

    const { setHandicapValue } = gameInfoStore()

    const showModelValue = ref(props.showModel)

    watch(
      () => props.showModel,
      () => {
        showModelValue.value = props.showModel
      },
    )

    const list = ref<{ text: string; value: 1 | 2 | 0 }[]>([
      { text: i18n.global.t('automaticallyEewOdds'), value: 2 },
      { text: i18n.global.t('automaticallyBetterOdds'), value: 1 },
      { text: i18n.global.t('doNotChanges'), value: 0 },
    ])
    const closeOverlay = () => {
      emit('onClose')
      return false
    }
    const closeModal = () => {
      emit('onClose')
    }
    const goLink = () => {
      emit('onClose')
      setHandicapValue('parlay')
      shoppingShow.value = false
    }
    return {
      activeIcon,
      inactiveIcon,
      closeIcon,
      expandIcon,
      list,
      closeModal,
      closeOverlay,
      goLink,
      showModelValue,
      oddDelivery,
    }
  },
})
</script>

<template>
  <van-popup
    v-model:show="showModelValue"
    z-index="5500"
    teleport="#app"
    position="bottom"
    @click-overlay="closeOverlay"
  >
    <div class="ordinary-odds-modal">
      <div class="odds-modal-top">
        <span>{{ $t("goCheckItOut") }}</span>
        <div class="expand" @click.stop="goLink">
          <van-image :src="expandIcon" />
        </div>
      </div>
      <div class="odds-modal-bottom">
        <div class="odds-title">
          <span>{{ $t("defaultOddsSettings") }}</span>
          <img
            :src="closeIcon"
            width="24"
            height="24"
            @click.stop="closeModal"
          >
        </div>
        <div class="odds-bottom">
          <div
            v-for="item in list"
            :key="item.value"
            class="odds-item"
            :class="{ active: oddDelivery === item.value }"
            @click="oddDelivery = item.value"
          >
            <span> {{ item.text }}</span>
            <img
              class="check-image"
              :src="oddDelivery === item.value ? activeIcon : inactiveIcon"
            >
          </div>
        </div>
      </div>
    </div>
  </van-popup>
</template>

<style lang="scss">
.ordinary-odds-modal {
  background: rgba(11, 13, 15);
  .odds-modal-top {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 24px;
    width: calc(100% - 36px);
    margin: 0 auto 14px;
    border-radius: 8px;
    height: 48px;
    box-sizing: border-box;
    background: url("@/assets/home/image_push1.png") no-repeat;
    background-size: contain;
    > span {
      font-size: 14px;
      color: #ffffff;
      font-weight: 400;
    }
    .expand {
      width: 24px;
      height: 24px;
      background: rgba(255, 255, 255, 0.2);
      border-radius: 50%;
    }
  }
  .odds-modal-bottom {
    background: #373e46;
    border-radius: 32px 32px 0px 0px;
    padding: 18px 32px 28px;
    .odds-title {
      display: flex;
      align-items: center;
      justify-content: space-between;
      span:nth-child(1) {
        font-size: 16px;
        color: #ffffff;
        font-weight: 500;
      }
    }
    .odds-bottom {
      display: flex;
      flex-direction: column;
      margin-top: 28px;
      .odds-item {
        display: flex;
        align-items: center;
        justify-content: space-between;
        height: 40px;
        padding: 0 42px;
        opacity: 0.5;
        background: rgba(255, 255, 255, 0.1);
        border-radius: 8px;
        margin-bottom: 8px;
        .check-image {
          width: 16px;
          height: 16px;
        }
        span:nth-child(1) {
          opacity: 0.6;
          font-size: 14px;
          color: #ffffff;
          font-weight: 400;
        }
        &:last-child {
          margin-bottom: 0;
        }
      }
      .active {
        opacity: 1;
        font-weight: 500;
        color: #ffffff !important;
        span:nth-child(1) {
          opacity: 1;
        }
      }
    }
  }
}
</style>

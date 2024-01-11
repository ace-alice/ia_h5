<script lang="ts">
import { defineComponent, inject } from 'vue'
import teamPointHook from '@/hooks/teamPointHook'
import type { BetType } from '@/interface/shopCart'
import { fixedKeep, toFixedNumber } from '@/utils'
export default defineComponent({
  name: 'UniversalBox',
  components: {},
  props: {
    teamInfo: {
      type: Object,
      default: () => {},
    },
    index: {
      type: Number,
      default: () => 0,
    },
  },
  setup(props: any) {
    const betType: BetType = inject('betType', 'single')
    const {
      currentTeamPointInfo,
      teamName,
      teamLogo,
      toAddShopCart,
      hasAdd,
      animateType,
      currentPlayInfo,
      isNotAllowAdd,
      statusIcon,
    } = teamPointHook(props.teamInfo as any, betType, props.index)
    return {
      currentTeamPointInfo,
      teamName,
      teamLogo,
      toAddShopCart,
      hasAdd,
      animateType,
      currentPlayInfo,
      isNotAllowAdd,
      statusIcon,
      toFixedNumber,
      fixedKeep,
    }
  },
})
</script>

<template>
  <div
    v-if="currentTeamPointInfo"
    class="odds"
    :class="{
      'not-allowed': isNotAllowAdd,
      'right-to-left': index % 2,
      'cart-active': hasAdd,
      [animateType]: true,
      [`${animateType}-border`]: true,
    }"
    @click.stop="toAddShopCart"
  >
    <div v-if="currentPlayInfo && currentTeamPointInfo">
      <span v-if="!isNotAllowAdd" class="point"> {{ toFixedNumber(currentTeamPointInfo.point).toFixed(fixedKeep) }}</span>
      <span v-else class="point">
        <van-image
          :src="statusIcon.length === 2 ? statusIcon[0] : ''"
          class="lazy-image"
          :class="{
            'lock-image': statusIcon.length === 2 ? statusIcon[1] : false,
          }"
        />
      </span>
    </div>
    <div v-else />
  </div>
</template>

<style scoped lang="scss">
.odds {
  display: flex;
  width: calc(50% - 15px);
  height: 36px;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.06);
  border: 1px solid #00000000;
  border-radius: 4px;
  font-size: 14px;
  color: #ffffff;
  font-weight: 500;
}

.lazy-image {
  width: 24px;
  height: 24px;
}
.lock-image {
  width: 16px;
  height: 16px;
  margin-top: 2px;
}

.cart-active {
  background-image: linear-gradient(90deg, #f98442 0%, #fd8908 94%) !important;
  border: 1px solid rgba(255, 255, 255, 0);
  box-shadow: none;
}
.smaller,.bigger{
  .point{
    &:before{
      left: -16px;
    }
  }
}
</style>

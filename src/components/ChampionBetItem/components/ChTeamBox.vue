<script lang="ts">
import { defineComponent } from 'vue'
import championTeamPointHook from '@/hooks/championTeamPointHook'
import { fixedKeep, toFixedNumber } from '@/utils'
import defaultIcon from '@/assets/home/default.png'
export default defineComponent({
  name: 'ChTeamBox',
  props: {
    index: {
      type: Number,
      default: 0,
    },
    itemInfo: {
      type: Object,
      default: () => {},
    },
  },
  setup(props: any) {
    const {
      currentTeamPoint,
      isAllowAddCart,
      hasAdd,
      toAddCart,
      statusIcon,
      animateType,
    } = championTeamPointHook(props.itemInfo)
    return {
      currentTeamPoint,
      isAllowAddCart,
      hasAdd,
      toAddCart,
      toFixedNumber,
      statusIcon,
      animateType,
      defaultIcon,
      fixedKeep,
    }
  },
})
</script>

<template>
  <div
    class="ch-team-box"
    :class="{
      'active': hasAdd,
      'cart-active': hasAdd,
      [animateType]: true,
      [`${animateType}-border`]: true,
    }"
    @click.stop="toAddCart"
  >
    <span>{{ itemInfo.desc }}</span>
    <span v-if="statusIcon.length === 0" class="point">
      {{
        toFixedNumber(currentTeamPoint ? currentTeamPoint.point : "").toFixed(fixedKeep)
      }}
    </span>
    <span v-else>
      <van-image
        height="16"
        width="16"
        :src="statusIcon.length === 2 ? statusIcon[0] : defaultIcon"
        :error-icon="defaultIcon"
        :show-loading="false"
      />
    </span>
  </div>
</template>

<style scoped lang="scss">
.ch-team-box {
  display: flex;
  justify-content: space-between;
  align-items: center;

  span:nth-child(1) {
    font-size: 12px;
    color: rgba(255 255 255 / 60%);
  }

  span:nth-child(2) {
    font-size: 14px;
    color: #fff;
  }
}

.active {
  background-image: linear-gradient(90deg, #f98442 0%, #fd8908 94%) !important;
}
</style>

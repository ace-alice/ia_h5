<script lang="ts">
import { defineComponent } from 'vue'
// import championTeamPointHook from "@/hooks/championTeamPointHook";
import detailTeamPointHook from '@/hooks/DetailTeamPointHook'
import { fixedKeep, toFixedNumber } from '@/utils'
export default defineComponent({
  name: 'TeamBox',
  props: {
    itemInfo: {
      type: Object,
      default: () => {},
    },
    index: {
      type: Number,
      default: 0,
    },
  },
  setup(props: any) {
    const {
      currentTeamPointInfo,
      hasAdd,
      toAddShopCart,
      isDisabled,
      statusIcon,
      animateType,
    } = detailTeamPointHook(props.itemInfo, props.index)

    const filterValue = inject('filterValue', 'all')

    return {
      currentTeamPointInfo,
      hasAdd,
      toAddShopCart,
      isDisabled,
      statusIcon,
      animateType,
      toFixedNumber,
      filterValue,
      fixedKeep,
    }
  },
})
</script>

<template>
  <div
    v-if="currentTeamPointInfo"
    class="team"
    :class="{
      [index % 2 ? 'team-right' : 'team-left']: true,
      [index % 2 ? 'team-right-bg' : 'team-left-bg']: filterValue !== 'all',
      'cart-active': hasAdd,
      [animateType]: !isDisabled,
      [`${animateType}-border`]: !isDisabled,
      'disabled': isDisabled,
    }"
    @click.stop="toAddShopCart"
  >
    <span class="desc">{{ currentTeamPointInfo.desc }}</span>
    <span
      class="point"
      :class="{ [index % 2 ? 'box-right' : 'box-normal']: true }"
    >
      <span v-if="!isDisabled">
        {{ toFixedNumber(currentTeamPointInfo.point).toFixed(fixedKeep) }}
      </span>
      <span v-else>
        <van-image
          :src="statusIcon.length === 2 ? statusIcon[0] : ''"
          class="lazy-image"
          :class="{ 'lock-image': statusIcon.length === 2 ? statusIcon[1] : false }"
        /></span>
    </span>
  </div>
</template>

<style scoped lang="scss">
.team.smaller {
  background-color: unset;
}

.team.bigger {
  background-color: unset;
}

.team {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: calc(50% - 6px);
  flex-shrink: 0;
  box-sizing: border-box;
  background: rgba(255 255 255 / 6%);
  border-radius: 4px;
  height: 36px;
  padding: 0 8px;
  font-weight: 500;
  margin-bottom: 8px;
  border: 1px solid rgba(255 255 255 / 0%);

  .point {
    font-family: Gotham-Medium, PingFangSC-Medium, monospace;
    font-size: 14px;
    color: #fff;
    font-weight: 500;

    .lazy-image {
      height: 24px;
      width: 24px;
    }

    .lock-image {
      height: 16px;
      width: 16px;
      margin-top: 2px;
    }
  }

  .desc {
    white-space: nowrap;
    max-height: 36px;
    overflow: hidden;
    text-overflow: ellipsis;
    font-size: 12px;
    color: #fff;
    opacity: 0.6;
  }

  .box-right {
    padding: 0;
  }

  .box-normal {
    padding: 0;
  }
}

.team-right {
  flex-direction: row-reverse;

  .point {
    padding-right: 12px;
  }
}

.team-left {
  .point {
    padding-left: 12px;
  }
}

.team-right-bg {
  background: rgba(250, 134, 0, 0.10);
  border: 1px solid rgba(250, 134, 0, 0.2);
}

.team-left-bg {
  background: rgba(54, 122, 255, 0.1);
  border: 1px solid rgba(54, 122, 255, 0.2);
}

.cart-active {
  background-image: linear-gradient(90deg, #f98442 0%, #fd8908 94%);
  border: 1px solid rgba(255 255 255 / 0%);
  box-shadow: none;
}

.disabled {
  cursor: not-allowed;
}
</style>

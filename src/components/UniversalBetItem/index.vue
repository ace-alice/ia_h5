<script lang="ts" setup name="UniversalBetItem">
import UnMain from './main.vue'
import NearData from './components/NearData.vue'
import home_Swipeleft from '@/assets/matchData/home_Swipeleft.png'
import videoAndAnimationHook from '@/hooks/videoAndAnimationHook'
import type { BetType } from '@/interface/shopCart'
import { globalApiConfigStore } from '@/store/globalApiConfig'

const props = defineProps({
  itemInfo: {
    type: Object,
    default: () => {},
  },
})
const { matchDetailQuery } = storeToRefs(globalApiConfigStore())
const initNearData = ref(false)

const route = useRoute()

const isLeaguePage = route.name === 'LeaguePage'

const swipeIndex = ref(0)

function swipeDragStart() {
  initNearData.value = true
}

function swipeIndexChange(index: number) {
  swipeIndex.value = index
}

const swipeRef = ref<any>()

function changeSwipe(index: number) {
  initNearData.value = true
  swipeRef.value && swipeRef.value.swipeTo(index)
}

const { videoHas, animationHas } = videoAndAnimationHook(props.itemInfo)

const betType: BetType = inject('betType', 'single')

const hasPlayInfo = computed(() => {
  return (
    !Array.isArray(props.itemInfo.recommend_play)
    && props.itemInfo.recommend_play?.id
  )
})

function toMatchDetail(params?: 'video' | 'animate' | null) {
  const query: any = {
    game_id: props.itemInfo.id,
    betType,
    show: true,
  }
  if (hasPlayInfo.value) {
    query.match = props.itemInfo.recommend_play?.match
  }
  if (params) {
    Object.assign(query, { type: params })
  }
  matchDetailQuery.value = query
}
</script>

<template>
  <div
    class="universal-bet-item"
    :style="{ '--header-width': videoHas || animationHas ? 30 : 0 }"
    @click="toMatchDetail(null)"
  >
    <van-image
      v-if="!!itemInfo.is_bind_ant_before_game_info && !isLeaguePage"
      :src="home_Swipeleft"
      class="swipe-image"
      :class="{ 'swipe-image-left': swipeIndex === 1 }"
      :show-loading="false"
      @click.stop="changeSwipe(swipeIndex === 1 ? 0 : 1)"
    />
    <van-swipe
      v-if="!!itemInfo.is_bind_ant_before_game_info && !isLeaguePage"
      ref="swipeRef"
      :loop="false"
      indicator-color="#fff"
      @change="swipeIndexChange"
      @drag-start="swipeDragStart"
    >
      <van-swipe-item>
        <UnMain :item-info="itemInfo" />
      </van-swipe-item>
      <van-swipe-item>
        <NearData
          v-if="initNearData"
          :game-type="itemInfo.game_type_id"
          :game-id="itemInfo.id"
          :swipe-index="swipeIndex"
        />
      </van-swipe-item>
    </van-swipe>
    <UnMain v-else :item-info="itemInfo" />
  </div>
</template>

<style lang="scss" scoped>
.bet-main-header-right-list {
  display: flex;
  flex-shrink: 0;
  padding-left: 8px;
  img {
    height: 16px;
    width: 16px;
    & + img {
      margin-left: 8px;
    }
  }
}
:deep(.van-swipe-item) {
  height: 100%;
}
:deep(.van-swipe__indicators) {
  transform: translateX(-50%) translateY(7px) !important;
}
.swipe-image {
  position: absolute;
  width: 32px;
  height: 24px;
  padding: 12px;
  top: calc(50% - 24px);
  right: -24px;
  transition: all 0.3s ease-in-out;
  animation: swipeLeft 1s ease-in-out infinite;
  z-index: 200;
}

.swipe-image-left {
  right: unset !important;
  left: -24px;
  animation: swipeRight 1s ease-in-out infinite;
}

@keyframes swipeLeft {
  0% {
    transform: translateX(0);
  }
  10% {
    transform: translateX(0);
  }
  50% {
    transform: translateX(-6px);
  }
  100% {
    transform: translateX(0);
  }
}
@keyframes swipeRight {
  0% {
    transform: translateX(0) rotateZ(180deg);
  }
  10% {
    transform: translateX(0) rotateZ(180deg);
  }
  50% {
    transform: translateX(-6px) rotateZ(180deg);
  }
  100% {
    transform: translateX(0) rotateZ(180deg);
  }
}
.universal-bet-item {
  width: calc(100% - 32px);
  height: 164px;
  margin: 0 auto 12px;
  background: #262d34;
  border-radius: 16px;
  position: relative;
  // overflow: hidden;
}
</style>

<style>
.game-popover {
  background: transparent;
}

.van-popup {
  background: transparent;
}

.van-popover__content {
  height: 36px;
  border: 1px solid rgba(255 255 255 / 20%);
  border-radius: 6px;
  background: rgba(0 0 0 / 60%) !important;
  backdrop-filter: blur(3px);
}

.game-popover-main {
  display: flex;
  align-items: center;
  height: 36px;
  padding: 0 20px;
}

.game-popover-main img {
  width: 16px;
  height: 16px;
}

.game-popover-main img:nth-child(1) {
  margin-right: 24px;
}
</style>

<script lang="ts">
import {
  defineComponent,
  getCurrentInstance,
  onMounted,
  onUnmounted,
} from 'vue'
import { useRouter } from 'vue-router'
import ShoppingCart from './views/shopping-cart/index.vue'
import { socketServiceHook } from '@/service/webSocket'
import { globalApiConfigStore } from '@/store/globalApiConfig'
import { userInfoStore } from '@/store/userInfo'
import { gameInfoStore } from '@/store/gameInfo'
import { GetParam } from '@/utils/getCommonInfo'
import { parseTime } from '@/utils'
import LoadingPage from '@/components/LodingPage/index-fu.vue'
import dialogImage from '@/assets/home/dialog-image.png'
import xImage from '@/assets/home/com_closed.png'
import unCheckImage from '@/assets/home/gouxuan_01.png'
import checkImage from '@/assets/home/gouxuan_02.png'
import BetListItem from '@/views/betting-history/index.vue'
import NoticeItem from '@/views/notice/index.vue'
import RuleItem from '@/views/game-rule/index.vue'
import AvatorItem from '@/views/avatar/index.vue'
const MatchDetailMain = defineAsyncComponent(
  () => import('@/views/match-detail/main.vue'),
)
const PersonalCom = defineAsyncComponent(() => import('@/views/personal/index.vue'))

export default defineComponent({
  name: 'App',
  components: {
    ShoppingCart,
    LoadingPage,
    BetListItem,
    NoticeItem,
    RuleItem,
    AvatorItem,
    MatchDetailMain,
    PersonalCom,
  },
  setup() {
    const { openTimer, closeTimer } = globalApiConfigStore()

    const {
      showShopCart,
      showAvator,
      showBetList,
      showNotice,
      showRule,
      isFullscreen,
      matchDetailQuery,
    } = storeToRefs(globalApiConfigStore())

    const { doGetUserInfo, initLangAction, getCurrencyInfo } = userInfoStore()
    const { initGameInfo } = gameInfoStore()
    const { currentGameId, checkedEvenList } = storeToRefs(gameInfoStore())
    const router = useRouter()

    const { proxy } = getCurrentInstance() as any

    const { leaveRoom } = socketServiceHook(proxy)

    const checkStatus = ref(false)

    const dialogStatus = ref(false)

    const state = reactive({
      transitionName: 'slide',
    })

    // 是否跳转
    function isJump() {
      const game_id
        = GetParam(window.location.href, 'id')
        || GetParam(window.location.href, 'game_id')
      const teamPointIds: any = GetParam(window.location.href, 'teamPointIds') || ''
      const game_type_id: string = GetParam(window.location.href, 'game_type_id') || ''
      const event_id: string = GetParam(window.location.href, 'event_id') || ''
      if (game_type_id) {
        currentGameId.value = game_type_id
        if (event_id) {
          checkedEvenList.value = event_id.split(',')
        }
      }
      if (game_id) {
        if (teamPointIds) {
          matchDetailQuery.value = {
            game_id: +game_id,
            betType: 'single',
            show: true,
            teamPointIds,
          }
        }
        else {
          matchDetailQuery.value = {
            game_id: +game_id,
            betType: 'single',
            show: true,
          }
        }
      }
    }

    /**
     * 给路由加过渡动画
     */
    watch(
      () => router.currentRoute.value,
      (to: any, from: any) => {
        if (to.meta.index > from.meta.index) {
          state.transitionName = 'slide-left' // 向左滑动
        }
        else if (to.meta.index < from.meta.index) {
          // 由次级到主级
          state.transitionName = 'slide-right'
        }
        else {
          state.transitionName = '' // 同级无过渡效果
        }
      },
    )

    const loadingPageRef: any = ref(null)

    onMounted(() => {
      // nextTick(() => {
      //   if (loadingPageRef.value) {
      //     setTimeout(() => {
      //       loadingPageRef.value.loading()
      //     }, 20)
      //     setTimeout(() => {
      //       if (loadingPageRef.value) {
      //         loadingPageRef.value.end()
      //       }
      //     }, 300)
      //   }
      // })
      initGameInfo()
      // 开启全局计时器获取当前时间
      openTimer()
      // 初始化会员信息
      doGetUserInfo()
      // 初始化语言
      initLangAction()
      // 尝试跳转
      isJump()

      getCurrencyInfo()
    })

    onUnmounted(() => {
      closeTimer()
      leaveRoom('room_type_index_content_push')
    })
    return {
      ...toRefs(state),
      dialogImage,
      xImage,
      unCheckImage,
      checkImage,
      checkStatus,
      parseTime,
      dialogStatus,
      showShopCart,
      showAvator,
      showBetList,
      showNotice,
      showRule,
      isFullscreen,
      loadingPageRef,
    }
  },
})
</script>

<template>
  <LoadingPage ref="loadingPageRef" />
  <router-view v-slot="{ Component, route }">
    <transition :name="transitionName" mode="out-in">
      <component :is="Component" :key="route.name" />
    </transition>
  </router-view>
  <ShoppingCart v-if="showShopCart && !isFullscreen" />
  <BetListItem />
  <NoticeItem />
  <RuleItem />
  <AvatorItem />
  <PersonalCom />
  <MatchDetailMain />
</template>

<style lang="scss" scoped>
.slide-right-enter-active,
.slide-right-leave-active,
.slide-left-enter-active,
.slide-left-leave-active {
  width: 100%;
  height: 100%;
  will-change: transform;
  transition: all 300ms;
  backface-visibility: hidden;
}

.slide-right-enter-from {
  opacity: 1;
  transform: translate3d(-100%, 0, 0);
}

.slide-right-leave-active {
  opacity: 0;
  transform: translate3d(0, 0, 0);
}

.slide-left-enter-from {
  opacity: 0;
  transform: translate3d(0, 0, 0);
}

.slide-left-leave-active {
  opacity: 1;
  transform: translate3d(-100%, 0, 0);
}
</style>

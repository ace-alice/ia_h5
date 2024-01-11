<script lang="ts" setup>
import dayjs from 'dayjs'
import NoLoginCard from './components/no-login-card/index.vue'
import GameHeader from './components/game-header/index.vue'
import GameListItem from './components/game-list-Item/index.vue'
import MatchTabs from './components/match-tabs/index.vue'
import { gameInfoStore } from '@/store/gameInfo'
import { globalApiConfigStore } from '@/store/globalApiConfig'
import { socketCacheStore } from '@/store/socketCache'

const { currentHandicap } = storeToRefs(gameInfoStore())

const { toGetGameList } = gameInfoStore()

const currentScrollTop = ref(0)

const { endFinish, matchListTop, pullRefreshDisabled, noLoginCardShow, showLeagueScreen } = storeToRefs(
  globalApiConfigStore(),
)

const { initOddRoom } = socketCacheStore()

provide(
  'isShowTabs',
  computed(() => {
    return noLoginCardShow.value
      ? currentScrollTop.value > (140 * document.body.clientWidth) / 375
      : currentScrollTop.value > (90 * document.body.clientWidth) / 375
  }),
)

provide(
  'opacityValue',
  computed(() => {
    return noLoginCardShow.value
      ? (currentScrollTop.value - (90 * document.body.clientWidth) / 375)
          / 110
          - 0.5
      : (currentScrollTop.value - (55 * document.body.clientWidth) / 375)
          / 110
          - 0.5
  }),
)

const scrollLock = ref(false)

watch(
  () => currentScrollTop.value,
  (newVal, oldVal) => {
    matchListTop.value = newVal
    const minLimit = noLoginCardShow.value
      ? (135 * document.body.clientWidth) / 375
      : (85 * document.body.clientWidth) / 375
    const MaxLimit = noLoginCardShow.value
      ? (205 * document.body.clientWidth) / 375
      : (166 * document.body.clientWidth) / 375
    if (newVal > oldVal && !scrollLock.value) {
      if (
        currentScrollTop.value > minLimit
        && currentScrollTop.value < MaxLimit
      ) {
        scrollLock.value = true
        setTimeout(() => {
          if (currentScrollTop.value < MaxLimit) {
            topBack(MaxLimit)
          }
          scrollLock.value = false
        }, 260)
      }
    }
    if (newVal < oldVal && !scrollLock.value) {
      if (
        currentScrollTop.value > minLimit
        && currentScrollTop.value
          < MaxLimit - (30 * document.body.clientWidth) / 375
      ) {
        scrollLock.value = true
        setTimeout(() => {
          topBack(0)
          scrollLock.value = false
        }, 260)
      }
    }
  },
)

const refreshing = ref(false)

const loading = ref(false)

const isNew = ref(true)

const lastRefreshTime = ref(dayjs().unix())

const { proxy }: any = getCurrentInstance()

watch(
  () => currentHandicap.value,
  (newVal) => {
    const limit = noLoginCardShow.value
      ? (205 * document.body.clientWidth) / 375
      : (166 * document.body.clientWidth) / 375
    if (currentScrollTop.value > limit) {
      setTimeout(() => {
        topBack(limit - 1)
        topBack(limit + 0.5)
      }, 60)
    }
    refreshing.value = false
    loading.value = false
  },
)

function onLoad() {
  proxy.mittBus.emit(`${currentHandicap.value}UpdateBus`, {
    pushType: 'loading_list',
    data: {},
  })
  initOddRoom()
  setTimeout(() => {
    loading.value = false
  }, 500)
}

function onRefresh() {
  const nowTime = dayjs().unix()
  if (nowTime - lastRefreshTime.value > 10) {
    isNew.value = false
    proxy.mittBus.emit(`${currentHandicap.value}UpdateBus`, {
      pushType: 'refresh_list',
      data: {},
    })
    toGetGameList()
    lastRefreshTime.value = nowTime
    refreshing.value = false
    loading.value = false
  }
  setTimeout(() => {
    refreshing.value = false
    isNew.value = true
  }, 800)
}

const appDom = document.querySelector('#app')

function topBack(top: number) {
  appDom?.scrollTo({ top, behavior: 'smooth' })
}

onMounted(() => {
  appDom?.addEventListener('scroll', (e: any) => {
    currentScrollTop.value = e.target.scrollTop || 0
  })
})
onUnmounted(() => {
  appDom?.removeEventListener('scroll', (e: any) => {
    currentScrollTop.value = e.target.scrollTop || 0
  })
})
</script>

<template>
  <van-pull-refresh
    v-model="refreshing"
    :disabled="pullRefreshDisabled || showLeagueScreen"
    @refresh="onRefresh"
  >
    <template #pulling>
      <div>
        <svga-player />
      </div>
    </template>

    <!-- 释放提示 -->
    <template #loosing>
      <div>
        <svga-player />
      </div>
    </template>

    <template #loading>
      <div v-if="isNew" class="is-new">
        <span>{{ $t("newTips") }}</span>
      </div>
      <div v-else>
        <svga-player />
      </div>
    </template>
    <!-- :disabled="currentHandicap !== 'end'" -->
    <van-list
      v-model:loading="loading"
      :finished="endFinish"
      :finished-text="$t('no_more')"
      offset="800"
      @load="onLoad"
    >
      <template #finished>
        <div class="off-height" />
      </template>
      <div class="match-list">
        <NoLoginCard
          v-if="noLoginCardShow"
          @close-login-emit="noLoginCardShow = false"
        />
        <GameHeader />
        <GameListItem />
        <MatchTabs />
      </div>
    </van-list>
    <BackTop />
    <LangSelect />
  </van-pull-refresh>
</template>

<style lang="scss" scoped>
.is-new {
  background: rgba(254, 94, 0, 0.2);
  height: 100%;
  text-align: center;
  transition: all 0.2s ease-in-out;
  span {
    opacity: 0.6;
    font-size: 12px;
    color: #ffffff;
    text-align: center;
    font-weight: 400;
  }
  @keyframes ani {
    from {
      width: 0;
    }
    to {
      width: 100%;
    }
  }
  span:before {
    position: absolute;
    top: 0;
    left: 50%;
    transform: translate(-50%);
    content: "";
    width: 100%;
    height: 100%;
    font-size: 12px;
    color: #ffffff;
    background: rgba(254, 94, 0, 0.2);
    animation-name: ani;
    animation-duration: 0.5s;
    animation-fill-mode: forwards;
    animation-direction: alternate;
  }
}
.match-list {
  background-image: url("@/assets/home/image_bg.png");
  background-size: 100%;
  background-repeat: no-repeat;
  background-attachment: fixed;
}
.off-height {
  // height: calc(100vh - 310px);
  width: 100%;
}
</style>

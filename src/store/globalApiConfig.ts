import { defineStore } from 'pinia'
import type { Ref } from 'vue'
import { ref } from 'vue'
import { userInfoStore } from './userInfo'

export const globalApiConfigStore = defineStore('globalApiConfig', () => {
  let timer: any = null

  const { isLogin } = storeToRefs(userInfoStore())

  const noLoginCardShow = ref(!isLogin.value)

  const showLeagueScreen = ref(false)

  const currentTime: Ref<number> = ref(0)

  const route = useRoute()

  function openTimer() {
    timer = setInterval(() => {
      currentTime.value = new Date().getTime()
    }, 1000)
  }
  function closeTimer() {
    clearInterval(timer)
    timer = null
    currentTime.value = 0
  }

  const endFinish = ref(false)

  const showNotice = ref(false)

  const showAvator = ref(false)

  const showBetList = ref(false)

  const showRule = ref(false)

  const shoppingShow = ref(false)

  const hasMatchOfData = ref(false)

  const showShopCart = computed(() => {
    return (
      !showNotice.value
      && !showAvator.value
      && !showBetList.value
      && !showRule.value
      && ['MatchList', 'LeaguePage', 'MatchDetail'].includes(route.name as any)
      && isLogin.value
    )
  })

  const isFullscreen = ref(false)

  const matchListTop = ref(0)

  const pullRefreshDisabled = ref(false)

  const showPersonalCenter = ref(false)

  interface matchDetailQueryType {
    game_id: number
    betType?: 'single' | 'parlay'
    match?: number
    show: boolean
    is_end?: boolean
    type?: 'video' | 'animate'
    teamPointIds?: string
  }

  const matchDetailQuery = ref<matchDetailQueryType>({
    game_id: 0,
    betType: 'single',
    show: false,
  })

  return {
    currentTime,
    openTimer,
    closeTimer,
    endFinish,
    showShopCart,
    showNotice,
    showAvator,
    showBetList,
    showRule,
    matchListTop,
    shoppingShow,
    hasMatchOfData,
    pullRefreshDisabled,
    isFullscreen,
    matchDetailQuery,
    showPersonalCenter,
    noLoginCardShow,
    showLeagueScreen,
  }
})

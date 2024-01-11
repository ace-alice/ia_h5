/* eslint-disable @typescript-eslint/no-use-before-define */
// noinspection JSUnusedGlobalSymbols

import { defineStore } from 'pinia'
import type { Ref } from 'vue'
import { computed, ref } from 'vue'
import { getGameInfo, getHandicapList } from '@/api/store-game-info'
import type {
  GameItemType,
  HandicapItemType,
  HandicapType,
} from '@/interface/gameInfo'
import { getCurrentEventName, getCurrentGameName } from '@/utils'

export const gameInfoStore = defineStore('gameInfo', () => {
  /**
   * @description 盘口列表
   * */
  const handicapList: Ref<HandicapItemType[]> = ref([])

  /**
   * @description 搜索内容
   * */
  const searchTeamName = ref<string> ('')
  /**
   * @description 是否搜索
   * */
  const toSearch = ref<boolean> (false)

  const currentHandicap = ref('today')

  /**
   * @description 获取盘口列表
   * */
  function toGetHandicapList() {
    return getHandicapList().then((res: any) => {
      if (+res.data.code === 1) {
        handicapList.value = res.data.data
      }
    })
  }

  /**
   *  @description 接受推送盘口数量
   * **/
  function foreGroundTabCount(data: any[]) {
    const tempData = data.map((gameData) => {
      const events = gameData.events_count.events.map((eventsData: any) => {
        return {
          event_id: eventsData.event_id,
          event_name: getCurrentEventName(eventsData),
          match_amount: eventsData.match_amount,
        }
      })

      const events_count = {
        total: gameData.events_count.total,
        events,
      }
      return {
        tag_count: gameData.tag_count,
        sort: gameData.sort,
        id: gameData.id,
        logo: gameData.logo,
        game_name: getCurrentGameName(gameData),
        events_count,
      }
    })
    tempData.forEach((td) => {
      const idx = gameList.value.findIndex((game) => {
        return +game.id === +td.id
      })
      if (idx !== -1) {
        gameList.value.splice(idx, 1, td)
      }
    })
  }

  const hasInitHandicap: Ref<string[]> = ref(['today'])

  function setInitHandicap(handicap: HandicapType) {
    if (!hasInitHandicap.value.includes(handicap)) {
      hasInitHandicap.value.push(handicap)
    }
  }

  function setHandicapValue(type: string) {
    currentHandicap.value = type
  }

  /**
   * @description 游戏列表
   * */
  const gameList: Ref<GameItemType[]> = ref([])

  /**
   * @description 获取游戏列表
   * */
  function toGetGameList() {
    return getGameInfo().then((res: any) => {
      if (+res.data.code === 1) {
        gameList.value = res.data.data
      }
    })
  }

  /**
   *@description 当前选中的游戏id
   * **/
  const currentGameId: Ref<string> = ref('0')

  /**
   *@description 当前游戏
   * **/
  const currentGame = computed(() => {
    return gameList.value.find((game) => {
      return String(game.id) === String(currentGameId.value)
    })
  })
  /**
   *@description 设置当前选中的游戏id
   * **/
  function setCurrentGameId(id: string) {
    if (currentGameId.value !== id) {
      currentGameId.value = id
      checkedEvenList.value = []
    }
  }

  /**
   *@description 选中的赛事id
   * **/
  const checkedEvenList: Ref<string[]> = ref([])

  /**
   *@description 设置选中的赛事id
   *@param id 点击的赛事id
   * **/
  function setCheckedEvenList(id: string) {
    if (id === 'clear') {
      checkedEvenList.value = []
      return
    }
    if (checkedEvenList.value.includes(id)) {
      checkedEvenList.value.splice(checkedEvenList.value.indexOf(id), 1)
    }
    else {
      if (id === 'all') {
        if (
          currentGame.value
          && currentGame.value.events_count
          && currentGame.value.events_count.events
        ) {
          if (
            checkedEvenList.value.length
            === currentGame.value.events_count.events?.length
          ) {
            checkedEvenList.value = []
            return
          }
          currentGame.value.events_count.events.forEach((detail: any) => {
            if (!checkedEvenList.value.includes(String(detail.event_id))) {
              checkedEvenList.value.push(String(detail.event_id))
            }
          })
        }
      }
      else {
        checkedEvenList.value.push(id)
      }
    }
  }

  /**
   *@description 初始化选中的赛事id
   * **/
  function initCheckedEvenList() {
    checkedEvenList.value = []
  }

  /**
   *@description 初始化游戏相关数据
   * **/
  function initGameInfo() {
    return Promise.all([toGetHandicapList(), toGetGameList()])
  }

  /**
   * @description 排序后的游戏列表
   * */
  const sortGameList = computed(() => {
    return gameList.value.sort((a: any, b: any) => {
      if (
        Number([0, 1, 2, 3, 16].includes(a.id))
        && Number([0, 1, 2, 3, 16].includes(b.id))
      ) {
        return 0
      }
      else if (
        Number([0, 1, 2, 3, 16].includes(a.id))
        && !Number([0, 1, 2, 3, 16].includes(b.id))
      ) {
        return 0
      }
      else if (
        !Number([0, 1, 2, 3, 16].includes(a.id))
        && Number([0, 1, 2, 3, 16].includes(b.id))
      ) {
        return 1
      }
      else {
        return (b.events_count?.total || 0) - (a.events_count?.total || 0)
      }
    })
  })

  return {
    initGameInfo,
    currentGameId,
    setCurrentGameId,
    checkedEvenList,
    setCheckedEvenList,
    initCheckedEvenList,
    gameList,
    toGetGameList,
    hasInitHandicap,
    setInitHandicap,
    handicapList,
    currentHandicap,
    setHandicapValue,
    toGetHandicapList,
    currentGame,
    searchTeamName,
    toSearch,
    sortGameList,
    foreGroundTabCount,
  }
})

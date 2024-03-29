import { storeToRefs } from 'pinia'
import type { ComputedRef, Ref } from 'vue'
import { computed, getCurrentInstance, onMounted, reactive, ref } from 'vue'
import { gameInfoStore } from '@/store/gameInfo'
import { getMatchList } from '@/api/store-game-info'
import type { HandicapType } from '@/interface/gameInfo'
import { getCurrentEventName, getCurrentPlayName, getCurrentPointName, getCurrentStageName } from '@/utils'
import { globalApiConfigStore } from '@/store/globalApiConfig'
import { socketCacheStore } from '@/store/socketCache'

export default function getChampionListHook(
  handicap: HandicapType = 'champion',
) {
  const { currentGameId, checkedEvenList, searchTeamName, currentHandicap } = storeToRefs(
    gameInfoStore(),
  )

  const { setInitHandicap } = gameInfoStore()

  const { proxy }: any = getCurrentInstance()

  /**
   * @description 盘口比赛列表
   * */
  const matchList: Ref<any[]> = ref([])

  /**
   * @description 目前展示的盘口比赛列表
   * */
  const matchListData: ComputedRef<any[]> = computed(() => {
    return matchList.value.filter((match: any) => {
      let hasTeam = true
      let hasEvent = true
      if (searchTeamName.value && match.recommend_play?.id) {
        hasTeam = match.recommend_play?.team_points.some((team: any) => {
          return team.desc
            .toLocaleLowerCase()
            .includes(searchTeamName.value.toLocaleLowerCase())
        })
      }
      if (searchTeamName.value) {
        hasEvent = match.event_name
          .toLocaleLowerCase()
          .includes(searchTeamName.value.toLocaleLowerCase())
      }
      return (
        (+currentGameId.value === 0
          || +currentGameId.value === +match.game_type_id)
        && (checkedEvenList.value.length === 0
          || checkedEvenList.value.includes(String(match.event_id)))
        && match.recommend_play
        && (hasTeam || hasEvent)
        && match.recommend_play?.id
        && Array.isArray(match.recommend_play.team_points)
        && match.recommend_play.team_points.length > 0
      )
    })
  })

  /**
   * @description 根据获取的数据更新比赛列表
   * @param newList MatchListType 获取的列表数据
   * */
  function toUpdateList(newList: any[]) {
    if (newList.length > 0) {
      matchList.value = [...matchList.value, ...newList].sort(
        (a: any, b: any) => {
          return a.game_start_time - b.game_start_time
        },
      )
    }
  }

  const loadList = ref(false)

  /**
   * @description 获取列表的参数
   * */
  const formData = reactive({
    page: 0,
    nav_code: handicap,
  })

  const { endFinish }: any = storeToRefs(globalApiConfigStore())

  /**
   * @description 获取比赛列表数据
   * */
  function getList() {
    if (currentHandicap.value !== handicap) {
      return
    }
    loadList.value = true
    const form: any = {}
    formData.page++
    getMatchList(Object.assign({}, formData, form))
      .then((res: any) => {
        if (+res.data.code === 1) {
          formData.page === 1
            ? (matchList.value = res.data.data.data)
            : toUpdateList(res.data.data.data)
          // 是否已经加载完该条件下的所有数据
          if (formData.page * 30 >= +(res.data.data.total || 0)) {
            return
          }
          getList()
        }
      })
      .catch(() => {
        formData.page--
      })
      .finally(() => {
        loadList.value = false
      })
  }

  const { matchListAccIds } = storeToRefs(socketCacheStore())

  const acceptcChangePointIds = computed(() => {
    const ids: string[] = []
    matchList.value.forEach((match: any) => {
      (match.recommend_play?.team_points || []).forEach((childD: any) => {
        ids.push(String(childD.id))
      })
    })
    return [...new Set(ids)]
  })

  watch(() => acceptcChangePointIds.value, (newVal) => {
    matchListAccIds.value = newVal
  }, { deep: true })

  /**
   * @description 重新加载数据
   * */
  function refreshList() {
    formData.page = 0
    endFinish.value = false
    getList()
  }

  watch(() => currentHandicap.value, () => {
    if (currentHandicap.value === handicap) {
      refreshList()
    }
  })

  function handicap_display(data: any) {
    const idx = matchList.value.findIndex((match) => {
      return +match.id === +data.game_id
    })
    if (idx === -1 && !data.show) {
      return
    }
    let tempData: any = {}
    if (data.list && !Array.isArray(data.list)) {
      const event_name = getCurrentEventName(data.list)
      let recommend_play = data.list.recommend_play
      if (!Array.isArray(data.list.recommend_play) && data.list.recommend_play.id) {
        const teamPoints = data.list.recommend_play.team_points.map((teamPoint: any) => {
          return Object.assign({}, teamPoint, {
            desc: getCurrentPointName(teamPoint),
          })
        })
        recommend_play = Object.assign({}, data.list.recommend_play, {
          name: getCurrentPlayName(data.list.recommend_play),
          team_points: teamPoints,
          stage_name: getCurrentStageName(data.list.recommend_play),
        })
      }
      tempData = Object.assign({}, data.list, { event_name, recommend_play })
    }
    if (data.show && idx === -1) {
      toUpdateList([tempData])
    }
    if (!data.show && idx !== -1) {
      matchList.value.splice(idx, 1)
    }
    if (data.show && idx !== -1) {
      matchList.value.splice(idx, 1)
      toUpdateList([tempData])
    }
  }

  function point_display_on(data: any) {
    const idx = matchList.value.findIndex((match) => {
      return (
        +match.id === +data.game_id
        && +match.recommend_play?.id === +data.play_id
      )
    })
    if (idx !== -1) {
      if (data.show) {
        if (data.play_info?.id) {
          const hasId = matchList.value[
            idx
          ].recommend_play.team_points.findIndex((point1: any) => {
            return +point1.id === +data.play_info?.id
          })
          if (hasId === -1) {
            matchList.value[idx].recommend_play.team_points.push(
              Object.assign(data.play_info, {
                desc: getCurrentPointName(data.play_info),
              }),
            )
          }
          else {
            matchList.value[idx].recommend_play.team_points.splice(
              hasId,
              1,
              Object.assign(data.play_info, {
                desc: getCurrentPointName(data.play_info),
              }),
            )
          }
        }
      }
      else {
        const inx = matchList.value[idx].recommend_play.team_points.findIndex(
          (point: any) => {
            return +data.point_id === +point.id
          },
        )
        if (inx !== -1) {
          matchList.value[idx].recommend_play.team_points.splice(inx, 1)
        }
      }
    }
  }

  /**
   * @description 数据是否已经全部初始化（是否在游戏类型为全部是加载全部数据）
   * */
  let isInit = false

  onActivated(() => {
    if (isInit) {
      refreshList()
    }
  })

  onMounted(() => {
    /**
     * @description socket推送时触发的方法
     * @param gameId string socket推送的需要更新的赛事id
     * */
    setInitHandicap(handicap)
    proxy.mittBus.on(
      'championUpdateBus',
      ({
        pushType,
        data,
      }: {
        pushType: 'handicap_display' | 'point_display_on' | 'refresh_list'
        data: any
      }) => {
        switch (pushType) {
          case 'handicap_display':
            handicap_display(data)
            break
          case 'point_display_on':
            point_display_on(data)
            break
          case 'refresh_list':
            refreshList()
            break
        }
      },
    )
    if (!isInit) {
      getList()
      setTimeout(() => {
        isInit = true
      }, 100)
    }
  })

  return { matchListData, loadList }
}

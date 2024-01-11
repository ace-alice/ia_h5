/* eslint-disable @typescript-eslint/no-use-before-define */
import type { Ref } from 'vue'
import {
  computed,
  getCurrentInstance,
  onMounted,
  onUnmounted,
  provide,
  ref,
} from 'vue'
import type { TabsInstance } from 'vant'
import type { MatchDetailType } from '@/interface/matchList'
import { toMatchDetailFun } from '@/api/store-game-info'
import { getCurrentPlayName, getCurrentPointName, setItemName } from '@/utils'
import { socketCacheStore } from '@/store/socketCache'
import { globalApiConfigStore } from '@/store/globalApiConfig'

/**
 * @description 获取比赛详情的接口参数
 * */
interface GetDetailFormType {
  game_id: number | string
  category_id: 1 | 2 | 3
}

export default function matchDetailHook() {
  const { hasMatchOfData, matchDetailQuery } = storeToRefs(
    globalApiConfigStore(),
  )

  const matchDetail: Ref<MatchDetailType> | Ref<any> = ref({})

  /**
   * @description 获取赛事详情
   * @param form GetDetailFormType 获取比赛详情的接口参数
   * */
  function getMatchDetail(form: GetDetailFormType) {
    matchDetailAccIds.value = []
    toMatchDetailFun(form)
      .then((res: any) => {
        if (+res.data.code === 1) {
          matchDetail.value = res.data.data
          hasMatchOfData.value
            = !!matchDetail.value.is_bind_ant_before_game_info
          if (+(matchDetailQuery.value.match || 0)) {
            const ind = roundList.value.findIndex((round: any) => {
              return +(matchDetailQuery.value.match || 0) === +round.val
            })
            if (ind === -1 || ind === 0) {
              return
            }
            const timerr = setTimeout(() => {
              tabIndex.value = ind
              clickTab({ name: ind })
              clearTimeout(timerr)
            }, 360)
          }
        }
      })
      .finally(() => {
        init.value = true
        matchDetailAccIds.value = acceptcChangePointIds.value
      })
  }

  const { matchDetailAccIds } = storeToRefs(socketCacheStore())

  const acceptcChangePointIds = computed(() => {
    if (!matchDetailQuery.value.show) {
      return []
    }
    const ids: string[] = [];
    (matchDetail.value.plays || []).forEach((boD: any) => {
      boD.child_plays.forEach((childD: any) => {
        childD.team_points.forEach((teamD: any) => {
          ids.push(String(teamD.id))
        })
      })
    })
    return [...new Set(ids)]
  })

  watch(
    () => acceptcChangePointIds.value,
    (newVal) => {
      matchDetailAccIds.value = newVal
    },
    { deep: true },
  )

  const roundList = computed(() => {
    if (matchDetail.value.plays) {
      return matchDetail.value.plays
        .filter((play: any) => play.child_plays.length > 0)
        .map((play: any) => {
          return Object.assign({}, setItemName(+play.bo, play.stage_name), {
            list: play.child_plays,
          })
        })
    }
    return []
  })

  let timerr: any = null
  watch(
    () => roundList.value.length,
    () => {
      clearTimeout(timerr)
      timerr = null
      timerr = setTimeout(() => {
        tabsRef.value && tabsRef.value.resize()
        if (currentTop.value > 10) {
          itemDetailGroupRef.value
            && itemDetailGroupRef.value.scrollTo({
              top: currentTop.value + 10,
              behavior: 'smooth',
            })
        }
        clearTimeout(timerr)
        timerr = null
      }, 200)
    },
  )

  const tabIndex = ref(0)

  const showVideo = ref(matchDetailQuery.value.type === 'video' || false)

  function showVideoHandle(tag = true) {
    if (tag) {
      showVideo.value = !showVideo.value
    }
    else {
      showVideo.value = false
    }
  }

  const showAnimate = ref(matchDetailQuery.value.type === 'animate' || false)

  function showAnimateHandle(tag = true) {
    if (tag) {
      showAnimate.value = !showAnimate.value
    }
    else {
      showAnimate.value = false
    }
  }

  const filterValue = ref<'all' | 'handicap' | 'over'>('all')

  provide('filterValue', computed(() => filterValue.value))

  function emitChangeFilterValue(status: 'all' | 'handicap' | 'over') {
    if (filterValue.value === status) {
      filterValue.value = 'all'
    }
    else {
      filterValue.value = status
    }
    itemDetailGroupRef.value
    && itemDetailGroupRef.value?.scrollTo({ top: 0, behavior: 'instant' } as any)
  }

  provide(
    'showVideo',
    computed(() => showVideo.value),
  )

  provide(
    'showAnimate',
    computed(() => showAnimate.value),
  )

  provide(
    'team_logo_1',
    computed(() => matchDetail.value.team_logo_1 || ''),
  )

  provide(
    'team_logo_2',
    computed(() => matchDetail.value.team_logo_2 || ''),
  )

  provide(
    'gameType',
    computed(() => matchDetail.value.game_type_id || 0),
  )

  const init = ref(false)

  const { proxy }: any = getCurrentInstance()

  const { pushOddInfo } = socketCacheStore()

  function team_score_set(data: any) {
    matchDetail.value.score_1 = data.score_1
    matchDetail.value.score_2 = data.score_2
  }

  function bet_item_all_lock(data: any) {
    if (data.action === 'play') {
      (matchDetail.value.plays || []).forEach((matchBo: any) => {
        const playInfo = matchBo.child_plays.find((play: any) => {
          return +play.id === +data.play_id
        })
        if (playInfo) {
          playInfo.team_points.forEach((team: any) => {
            pushOddInfo({ point_id: team.id, status: data.status })
          })
        }
      })
      return
    }
    if (data.action === 'warning') {
      return
    }
    if (matchDetailQuery.value.game_id) {
      getMatchDetail({
        game_id: matchDetailQuery.value.game_id,
      } as any)
    }
  }

  function point_display_on(data: any) {
    if (data.isAdd || !data.is_hide) {
      if (
        data.play_info
        && Array.isArray(data.play_info.child_plays)
        && data.play_info.child_plays.length > 0
      ) {
        const childPlays = data.play_info.child_plays.map((child: any) => {
          const teamPoints = child.team_points.map((teamPoint: any) => {
            return Object.assign({}, teamPoint, {
              desc: getCurrentPointName(teamPoint),
            })
          })
          return Object.assign({}, child, {
            name: getCurrentPlayName(child),
            team_points: teamPoints,
          })
        })

        const idx = (matchDetail.value.plays || []).findIndex((playBo: any) => {
          return +playBo.bo === data.play_info.bo
        })

        if (idx === -1) {
          const indx = (matchDetail.value.plays || []).findIndex(
            (playBo: any) => {
              return +playBo.bo < data.play_info.bo
            },
          );
          (matchDetail.value.plays || []).splice(
            indx === -1 ? 0 : indx,
            0,
            Object.assign({}, data.play_info, { child_plays: childPlays }),
          )
        }
        else {
          (matchDetail.value.plays || [])[idx].child_plays = [
            ...matchDetail.value.plays[idx].child_plays,
            ...childPlays,
          ]
        }
      }
    }
    else {
      if (Array.isArray(matchDetail.value.plays)) {
        matchDetail.value.plays.forEach((element: any, index: number) => {
          if (Array.isArray(element.child_plays)) {
            element.child_plays.forEach((ele: any, idx: number) => {
              if (+ele.id === +data.play_id) {
                matchDetail.value.plays[index].child_plays.splice(idx, 1)
              }
            })
          }
        })
      }
    }
  }

  function handicap_to_live() {
    matchDetail.value.category_id = 3
  }

  function message_type_game_play_edit(data: any) {
    matchDetail.value.game_start_time = data.game_start_time
  }

  const itemDetailGroupRef = ref<HTMLDivElement>()

  const tabsRef = ref<TabsInstance>()

  const headerStyle = ref('')

  const currentTop = ref(0)

  const clickTabing = ref(false)

  let clickTabingTimer: any = null

  function clickTab({ name }: { name: string | number }) {
    clearTimeout(clickTabingTimer)
    clickTabingTimer = null
    clickTabing.value = true
    let heightTemp = 0
    intersectionObserverRef.value
      && intersectionObserverRef.value
        .sort((a, b) => a.tabIndex - b.tabIndex)
        .forEach((RefDom, index) => {
          if (+name > index) {
            heightTemp += RefDom.clientHeight
          }
        })
    itemDetailGroupRef.value?.scrollTo({
      top: heightTemp + 2,
      behavior: 'smooth',
    })
    clickTabingTimer = setTimeout(() => {
      clickTabing.value = false
      clearTimeout(clickTabingTimer)
      clickTabingTimer = null
    }, 1200)
  }

  function detailScroll(e: any) {
    currentTop.value = e.target.scrollTop
    if (currentTop.value > 10) {
      headerStyle.value = 'game-shadow'
    }
    else {
      headerStyle.value = ''
    }
    if (clickTabing.value) {
      return
    }
    let heightTemp = 0
    if (intersectionObserverRef.value) {
      const intersectionObserverArr = intersectionObserverRef.value.sort(
        (a, b) => a.tabIndex - b.tabIndex,
      )
      for (let j = 0; j < (intersectionObserverArr?.length || 0); j++) {
        heightTemp += intersectionObserverArr[j].clientHeight || 0
        if (heightTemp > currentTop.value) {
          tabIndex.value = j
          return
        }
      }
    }
  }

  onMounted(() => {
    if (matchDetailQuery.value.game_id) {
      getMatchDetail({
        game_id: matchDetailQuery.value.game_id,
      } as any)
    }

    proxy.mittBus.on(
      'changeMatchDetailBus',
      ({
        pushType,
        data,
      }: {
        pushType:
        | 'team_score_set'
        | 'bet_item_all_lock'
        | 'point_display_on'
        | 'handicap_to_live'
        | 'message_type_game_play_edit'
        data: any
      }) => {
        switch (pushType) {
          case 'team_score_set':
            team_score_set(data)
            break
          case 'bet_item_all_lock':
            bet_item_all_lock(data)
            break
          case 'point_display_on':
            point_display_on(data)
            break
          case 'handicap_to_live':
            handicap_to_live()
            break
          case 'message_type_game_play_edit':
            message_type_game_play_edit(data)
            break
        }
      },
    )
  })

  const intersectionObserverRef = ref<HTMLDivElement[]>()

  // const intersectionObserverRefTemp = ref<HTMLDivElement[]>()

  // const io = new IntersectionObserver((entries) => {
  //   console.log('fa sheng change', entries)
  //   entries.forEach((entry) => {
  //     if (entry.isIntersecting) {
  //       // tabIndex.value = (entry.target as any).tabIndex
  //       tabsRef.value && tabsRef.value.scrollTo((entry.target as any).tabIndex)
  //       console.log(tabIndex.value)
  //     }
  //   })
  // }, {
  //   root: document.querySelector('#detailHeaderBottom'),
  // })

  onUnmounted(() => {
    proxy.mittBus.off('changeMatchDetailBus')
    hasMatchOfData.value = false
    matchDetailAccIds.value = []
    // io.disconnect()
  })

  return {
    matchDetail,
    roundList,
    tabIndex,
    init,
    showVideo,
    showVideoHandle,
    showAnimate,
    showAnimateHandle,
    detailScroll,
    headerStyle,
    tabsRef,
    currentTop,
    itemDetailGroupRef,
    intersectionObserverRef,
    clickTab,
    filterValue,
    emitChangeFilterValue,
  }
}

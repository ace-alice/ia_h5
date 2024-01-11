<script lang="ts" setup name="LeaguePage">
import LeagueSidebar from './components/LeagueSidebar.vue'
import LeagueDropdownMenu from './components/LeagueDropdownMenu.vue'
import LeagueList from './components/LeagueList.vue'
import { getGameListByGameIdFun } from '@/api/store-game-schedule'
import { getMatchList } from '@/api/store-game-info'
import type { MatchListType } from '@/interface/matchList'
import { socketCacheStore } from '@/store/socketCache'
import {
  getCurrentEventName,
  getCurrentPlayName,
  getCurrentPointName,
  getCurrentStageName,
  getCurrentTeam1Name,
  getCurrentTeam2Name,
} from '@/utils'

const gameId = ref(0)

function sidebarChange(game_id: number) {
  gameId.value = game_id
  getLeagueList()
}

const matchList = ref<MatchListType>([])

const checked = ref<any[]>([])

function eventChange(checkedArr: any[]) {
  checked.value = checkedArr
}

const loading = ref(false)

const page = ref<number>(0)

const finished = ref(false)

function refresh(load = true) {
  page.value++
  loading.value = load
  getGameListByGameIdFun({ game_type_id: gameId.value, page: page.value })
    .then((res: any) => {
      if (res.data.code === 1) {
        if (page.value === 1) {
          matchList.value = res.data.data.data
        }
        else {
          matchList.value = [...matchList.value, ...res.data.data.data]
        }
        if (res.data.data.total <= page.value * 30) {
          finished.value = true
        }
      }
      else {
        page.value--
        refresh(false)
      }
    })
    .finally(() => {
      loading.value = false
    })
    .catch(() => page.value--)
}

function getMatchListInit(load = true) {
  page.value++
  loading.value = load
  getMatchList({ page: page.value, nav_code: 'hot' })
    .then((res: any) => {
      if (res.data.code === 1) {
        if (page.value === 1) {
          matchList.value = res.data.data.data
        }
        else {
          matchList.value = [...matchList.value, ...res.data.data.data]
        }
        if (res.data.data.total <= page.value * 30) {
          finished.value = true
        }
      }
      else {
        page.value--
        getMatchListInit(false)
      }
    })
    .finally(() => {
      loading.value = false
    })
    .catch(() => page.value--)
}

function getLeagueList() {
  page.value = 0
  finished.value = false
  if (gameId.value === 0) {
    getMatchListInit()
  }
  else {
    refresh()
  }
}

const showMatchList = computed(() => {
  return matchList.value
    .filter((match) => {
      return (
        checked.value.length === 0 || checked.value.includes(match.event_id)
      )
    })
    .sort((a: any, b: any) => {
      return +a.category_id === +b.category_id
        ? a.game_start_time - b.game_start_time
        : b.category_id - a.category_id
    })
})

const { proxy }: any = getCurrentInstance()

type PushType =
  | 'bet_item_all_lock'
  | 'team_score_set'
  | 'point_display_on'
  | 'game_play_set_recommend'
  | 'handicap_to_live'
  | 'message_type_game_play_edit'
  | 'handicap_display'

const { pushOddInfo } = socketCacheStore()

function bet_item_all_lock(data: any) {
  const match = matchList.value.find((match) => {
    return +match.id === +data.game_id
  })
  if (
    match
    && data.action === 'play'
    && match?.recommend_play?.id
    && +data.play_id === +match?.recommend_play?.id
  ) {
    match?.recommend_play.team_points?.forEach((element: any) => {
      pushOddInfo({ point_id: element.id, status: data.status })
    })
  }
  if (
    match
    && data.action === 'match'
    && match?.recommend_play?.id
    && +data.match === match?.recommend_play?.match
  ) {
    match?.recommend_play.team_points?.forEach((element: any) => {
      pushOddInfo({ point_id: element.id, status: data.status })
    })
  }
  if (match && data.action === 'game' && match?.recommend_play?.id) {
    match?.recommend_play.team_points?.forEach((element: any) => {
      pushOddInfo({ point_id: element.id, status: data.status })
    })
  }
}

function team_score_set(data: any) {
  const idx = matchList.value.findIndex((match) => {
    return +match.id === +data.game_id
  })
  if (idx !== -1) {
    matchList.value[idx].score_1 = +data.score_1
    matchList.value[idx].score_2 = +data.score_2
  }
}

function point_display_on(data: any) {
  if (!data.is_hide) {
    if (
      data.play_info
      && Array.isArray(data.play_info.child_plays)
      && data.play_info.child_plays.length > 0
    ) {
      const idx = matchList.value.findIndex((match) => {
        return +match.id === +data.game_id
      })
      if (idx !== -1) {
        data.play_info.child_plays.forEach((element: any) => {
          if (element.is_recommend) {
            const teamPoints = element.team_points.map((teamPoint: any) => {
              return Object.assign({}, teamPoint, {
                desc: getCurrentPointName(teamPoint),
              })
            })
            matchList.value[idx].recommend_play = Object.assign({}, element, {
              name: getCurrentPlayName(element),
              team_points: teamPoints,
            })
          }
        })
      }
    }
  }
  else {
    const idx = matchList.value.findIndex((match) => {
      return (
        +match.id === +data.game_id
        && match.recommend_play?.id
        && +match.recommend_play?.id === +data.play_id
      )
    })
    if (idx !== -1) {
      matchList.value[idx].recommend_play = {}
    }
  }
}

function game_play_set_recommend(data: any) {
  if (!+data.is_recommend) {
    const idx = matchList.value.findIndex((match) => {
      return (
        +match.id === +data.game_id
        && match.recommend_play?.id
        && +match.recommend_play?.id === +data.play_id
      )
    })
    if (idx !== -1) {
      matchList.value[idx].recommend_play = {}
    }
  }
  if (+data.is_recommend) {
    const idx = matchList.value.findIndex((match) => {
      return +match.id === +data.game_id
    })
    if (idx !== -1 && data.play_info.id) {
      const teamPoints = data.play_info.team_points.map((teamPoint: any) => {
        return Object.assign({}, teamPoint, {
          desc: getCurrentPointName(teamPoint),
        })
      })
      matchList.value[idx].recommend_play = Object.assign({}, data.play_info, {
        name: getCurrentPlayName(data.play_info),
        team_points: teamPoints,
        stage_name: getCurrentStageName(data.play_info),
      })
    }
  }
}

function handicap_to_live(data: any) {
  const idx = matchList.value.findIndex((match) => {
    return +match.id === +data.game_id
  })
  if (idx !== -1) {
    matchList.value[idx].category_id = 3
  }
}

function message_type_game_play_edit(data: any) {
  const idx = matchList.value.findIndex((match) => {
    return +match.id === +data.game_id
  })
  if (idx !== -1) {
    matchList.value[idx].game_start_time = data.game_start_time
  }
}

function handicap_display(data: any) {
  if (gameId.value) {
    return
  }
  const idx = matchList.value.findIndex((match) => {
    return +match.id === +data.game_id
  })
  if (idx === -1 && !data.show) {
    return
  }
  let gameDetail: any = null
  if (data.list && data.list.id) {
    const team_name_1 = getCurrentTeam1Name(data.list)
    const team_name_2 = getCurrentTeam2Name(data.list)
    const event_name = getCurrentEventName(data.list)
    let recommend_play = data.list.recommend_play
    if (
      !Array.isArray(data.list.recommend_play)
      && data.list.recommend_play.id
    ) {
      const teamPoints = data.list.recommend_play.team_points.map(
        (teamPoint: any) => {
          return Object.assign({}, teamPoint, {
            desc: getCurrentPointName(teamPoint),
          })
        },
      )
      recommend_play = Object.assign({}, data.list.recommend_play, {
        name: getCurrentPlayName(data.list.recommend_play),
        team_points: teamPoints,
        stage_name: getCurrentStageName(data.list.recommend_play),
      })
    }
    gameDetail = Object.assign(data.list, {
      team_name_1,
      team_name_2,
      event_name,
      recommend_play,
    })
  }
  if (data.show && idx === -1) {
    matchList.value.push(gameDetail)
  }
  if (!data.show && idx !== -1) {
    matchList.value.splice(idx, 1)
  }
  if (data.show && idx !== -1) {
    matchList.value.splice(idx, 1)
    matchList.value.push(gameDetail)
  }
}

onMounted(() => {
  getLeagueList()
  proxy.mittBus.on(
    'leagueUpdateBus',
    ({ pushType, data }: { pushType: PushType; data: any }) => {
      switch (pushType) {
        case 'bet_item_all_lock':
          bet_item_all_lock(data)
          break
        case 'team_score_set':
          team_score_set(data)
          break
        case 'point_display_on':
          point_display_on(data)
          break
        case 'game_play_set_recommend':
          game_play_set_recommend(data)
          break
        case 'handicap_to_live':
          handicap_to_live(data)
          break
        case 'message_type_game_play_edit':
          message_type_game_play_edit(data)
          break
        case 'handicap_display':
          handicap_display(data)
          break
      }
    },
  )
})

onUnmounted(() => {
  proxy.mittBus.off('leagueUpdateBus')
})
</script>

<template>
  <div class="competition">
    <HeadTitle :title="$t('theLeague')" path="MatchList" class="head-title" />
    <LeagueSidebar @change="sidebarChange" />
    <LeagueDropdownMenu :game-id="gameId" @change="eventChange" />
    <van-list
      v-model:loading="loading"
      :finished="finished"
      finished-text=""
      @load="refresh"
    >
      <LeagueList
        :match-list="showMatchList"
        :game-id="gameId"
        :loading="loading"
      />
    </van-list>
    <BackTop />
  </div>
</template>

<style lang="scss" scoped>
.head-title {
  position: fixed;
  top: 0;
  left: 0;
  z-index: 200;
  width: 100%;
  height: 46px;
  box-shadow: 1px 1px rgba(255, 255, 255, 0.1);
}
</style>

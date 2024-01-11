import service from '@/service'

export interface ZonesType {
  [key: string]: any
}
export interface EventsType {
  zone_id: string | number | null
}

// 获取赛程分类
export function getGameScheduleFun(data?: ZonesType) {
  return service({
    url: '/api/game/schedule/zones',
    method: 'post',
    data,
  })
}

// 获取赛事列表
export function getEventsInfoFun(data?: EventsType) {
  return service({
    url: '/api/game/schedule/events',
    method: 'post',
    data,
  })
}
// 获取赛事详情
export function getEventDetailFun(data?: { event_id: string | number | null }) {
  return service({
    url: '/api/game/schedule/eventDetail',
    method: 'post',
    data,
  })
}
// 获取参赛队伍
export function getTeamListFun(data?: { event_id: string | number | null }) {
  return service({
    url: '/api/game/schedule/eventTeams',
    method: 'post',
    data,
  })
}
// 获取赛事列表
export function getEventTabsFun(data?: { event_id: string | number | null }) {
  return service({
    url: '/api/game/schedule/eventZones',
    method: 'post',
    data,
  })
}
// 获取赛况的赛事详情
export function getScheduleDetailFun(data?: {
  event_id: string | number | null
  schedule_id: string | number | null
}) {
  return service({
    url: '/api/game/schedule/scheduleDetail',
    method: 'post',
    data,
  })
}

export function getGameListByGameIdFun(data?: {
  game_type_id: number
  page: number
  nav_code?: string
  event_id?: number[]
  start_time?: number
  end_time?: number
}) {
  return service({
    url: '/api/game/game/getGameListByGameTypeId/',
    method: 'post',
    data,
  })
}

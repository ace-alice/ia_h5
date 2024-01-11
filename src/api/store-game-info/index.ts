import service from '@/service'

// 获取游戏列表
export function getGameInfo(data?: any) {
  return service({
    url: '/api/game/game/getGameTypeDict/',
    method: 'post',
    data,
  })
}

// 获取游戏的比赛数量以及比赛类型列表
// export function getGameInfoMatchList(data?: any) {
//   return service({
//     url: "/api/game/gameTypeCountV2Split/",
//     method: "post",
//     data,
//   });
// }

// 获取盘口信息
export function getHandicapList(data?: any) {
  return service({
    url: '/api/game/game/getGameTopDictSplit/',
    method: 'post',
    data,
  })
}

// 获取会员投注列表
export function getBetList(data?: { page: number }) {
  return service({
    url: '/api/user/getUserHistory/',
    method: 'post',
    data,
  })
}

// 获取比赛列表
export function getMatchList(data?: {
  page: number
  nav_code: string
  game_type_id?: number
  prePage?: number
  game_id?: string
}) {
  return service({
    url: '/api/game/game/gameListPageSplit/',
    method: 'post',
    data,
  })
}

// 获取比赛赔率
export function getParlayOddInfoList(data: any) {
  return service({
    url: '/api/game/game/getParlayLimitInfo/',
    method: 'post',
    data,
  })
}

// 获取比赛赔率
export function getSingleOddInfoList(data: any) {
  return service({
    url: '/api/game/game/getOrdinaryLimitInfo/',
    method: 'post',
    data,
  })
}

// 进行投注
export function toBetFun(data: any) {
  return service({
    url: '/api/game/user/playMore/',
    method: 'post',
    data,
  })
}

// 设置是否收藏
export function toSetKeepFun(data: any) {
  return service({
    url: '/api/game/addFavorite',
    method: 'post',
    data,
  })
}

// 获取比赛的详情
export function toMatchDetailFun(data: any) {
  return service({
    url: '/api/game/game/getPointsListSplit',
    method: 'post',
    data,
  })
}

export interface PointFromType {
  game_id: number | string
  category_id: number | string
}

// 获取公告信息
export function getNewAllPointsFun(data: PointFromType) {
  return service({
    url: '/api/game/getNewAllPointsSplit/',
    method: 'post',
    data,
  })
}

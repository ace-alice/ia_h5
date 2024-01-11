import type { RouteRecordRaw } from 'vue-router'
import { createRouter, createWebHistory } from 'vue-router'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    redirect: '/list',
  },
  {
    path: '/list',
    name: 'MatchList',
    component: () =>
      import(
        /* webpackChunkName: "MatchList" */ '../views/match-list/index.vue'
      ),
    meta: {
      keepAlive: true,
      index: 1,
    },
  },
  // {
  //   path: '/personal',
  //   name: 'PersonalCenter',
  //   component: () =>
  //     import(
  //       /* webpackChunkName: "PersonalCenter" */ '../views/personal/index.vue'
  //     ),
  //   meta: {
  //     keepAlive: true,
  //     index: 2,
  //   },
  // },
  // {
  //   path: '/league',
  //   name: 'LeaguePage',
  //   component: () =>
  //     import(/* webpackChunkName: "LeaguePage" */ '../views/league/index.vue'),
  //   meta: {
  //     keepAlive: true,
  //     index: 2,
  //   },
  // },
  // {
  //   path: '/detail',
  //   name: 'MatchDetail',
  //   component: () =>
  //     import(
  //       /* webpackChunkName: "MatchDetail" */ '../views/match-detail/index.vue'
  //     ),
  //   meta: {
  //     keepAlive: false,
  //     index: 3,
  //   },
  // },
  // ip限制
  {
    path: '/ip-limit',
    name: 'IpLimit',
    component: () =>
      import(
        /* webpackChunkName: "IpLimit" */ '../views/error-page/ip-limit.vue'
      ),
  },
  // ip限制
  {
    path: '/404',
    name: 'NotPage',
    component: () =>
      import(
        /* webpackChunkName: "NotPage" */ '../views/error-page/not-find-404.vue'
      ),
  },
  // 错误路由处理
  {
    path: '/:catchAll(.*)',
    name: 'NotFound',
    redirect: '/404',
  },
]

function scrollBehavior(to: any, from: any, savedPosition: any) {
  if (savedPosition) {
    return savedPosition
  }
  else {
    return { x: 0, y: 0 }
  }
}

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior,
})

export default router

/* eslint-disable prefer-promise-reject-errors */
// noinspection JSIgnoredPromiseFromCall
import axios from 'axios'
import { showToast } from 'vant'
import { i18n } from '@/locale'
import router from '@/router'
import { GetParam } from '@/utils/getCommonInfo'
import { getLocal } from '@/utils/storage'
import { userInfoStore } from '@/store/userInfo'
import { shopCartStore } from '@/store/shopCart'
import notifyIcon from '@/assets/home/pop_high.png'

let baseURL = window.location.origin
if (window.__WUJIE_PUBLIC_PATH__) {
  baseURL = window.__WUJIE_PUBLIC_PATH__.substring(0, window.__WUJIE_PUBLIC_PATH__.length - 1)
}

// 配置新建一个 axios 实例
const service = axios.create({
  baseURL,
  withCredentials: false, // send cookies when cross-domain requests
  timeout: 50000,
})

// 添加请求拦截器
service.interceptors.request.use(
  (config: any) => {
    if (config.method === 'get') {
      Object.assign(config.headers, {
        'X-Requested-With': 'XMLHttpRequest',
        'Accept': 'application/json',
        'Content-Type': 'application/json; charset=UTF-8',
        'visid': GetParam(window.location.href, 'uuid'),
      })
    }
    else {
      Object.assign(config.headers, {
        // 'X-Requested-With': 'XMLHttpRequest',
        // 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
        // 'visid': GetParam(window.location.href, 'visid'),
        // 'token': 'ceshitoken',
      })
    }
    if (config.headers) {
      config.headers.token = getLocal('token') || 'ia e-sport'
    }
    if (config.data) {
      config.data.lang = getLocal('lang')
    }
    else {
      config.data = {
        lang: getLocal('lang'),
      }
    }
    // config.data = qs.stringify(config.data)
    return config
  },
  (error) => {
    // 对请求错误做些什么
    return Promise.reject(error)
  },
)

// 添加响应拦截器
service.interceptors.response.use(
  (response) => {
    const code = response.status
    if (code < 200 || code > 300) {
      showToast({
        icon: notifyIcon,
        className: 'bet-toast-content bet-err',
        message: i18n.global.t('network_connection_failed'),
      })
      return Promise.reject('error')
    }
    else if (
      +parseInt(response.data.status) === 0
      && (+parseInt(response.data.error_code) === 18
        || +parseInt(response.data.error_code) === 17
        || +parseInt(response.data.error_code) === 15)
    ) {
      showToast({
        icon: notifyIcon,
        className: 'bet-toast-content bet-err',
        message: response.data.message,
      })

      // noinspection JSIgnoredPromiseFromCall
      router.push({
        name: 'NotPage',
        query: {
          message: response.data.message,
        },
      })
      return Promise.reject('error')
    }
    else if (
      +parseInt(response.data.status) === 0
      && +parseInt(response.data.error_code) === 14
    ) {
      showToast({
        icon: notifyIcon,
        className: 'bet-toast-content bet-err',
        message: response.data.message,
      })
      return Promise.reject('error')
    }
    else if (
      parseInt(response.data.code) === 602
      || parseInt(response.data.code) === 604
    ) {
      const { loginExit } = userInfoStore()
      loginExit()
      const { clearShopCart } = shopCartStore()
      clearShopCart('parlay')
      clearShopCart('single')
      showToast({
        icon: notifyIcon,
        className: 'bet-toast-content bet-err',
        message: response.data.message || response.data.msg,
      })
      return response
    }
    else {
      return response
    }
  },
  (error) => {
    // 对响应错误做点什么
    showToast({
      icon: notifyIcon,
      className: 'bet-toast-content bet-err',
      message: i18n.global.t('network_connection_failed'),
    })
    return Promise.reject(error)
  },
)

export default service

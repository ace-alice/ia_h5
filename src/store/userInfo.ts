// noinspection JSUnusedGlobalSymbols

import { defineStore } from 'pinia'
import type { Ref } from 'vue'
import { computed, reactive, ref } from 'vue'
import { getLocal, setLocal } from '@/utils/storage'
import {
  currencyInfoFn,
  getUserInfo,
  setLangFn,
} from '@/api/store-user-info'
import type {
  BalanceInfosType,
  CurrencyInfoType,
} from '@/interface/userInfo'

export const userInfoStore = defineStore('userInfo', () => {
  const balanceInfo: BalanceInfosType = reactive({
    amount: '',
    nickname: '',
    currency_id: '',
  })

  const currencyInfo: Ref<CurrencyInfoType[]> = ref([])

  const token = ref<string>(getLocal('token') || '')

  function loginExit() {
    Object.assign(balanceInfo, {
      amount: '',
      nickname: '',
      currency_id: '',
    })
    token.value = ''
    setLocal('token', '')
  }

  getLocal('avatarId') || setLocal('avatarId', 1)

  const avatarId = ref(getLocal('avatarId'))

  function changeAvatarId(id: number) {
    if (id > 0 && id < 16) {
      avatarId.value = id
      setLocal('avatarId', id)
    }
  }

  const isLogin = computed(() => {
    if (token.value) {
      return true
    }
    return false
  })

  const langConfig = ref<number>(getLocal('lang') || 1)

  const canChangeLang = ref(true)

  function getCurrencyInfo() {
    currencyInfoFn().then((res: any) => {
      if (+res.data.code === 1) {
        currencyInfo.value = res.data.data
      }
    })
  }

  const currentCurrencyInfo = computed(() => {
    return currencyInfo.value.find((currency) => {
      return String(currency.id) === String(balanceInfo.currency_id)
    })
  })

  // 获取会员信息
  function doGetUserInfo() {
    // eslint-disable-next-line no-async-promise-executor
    return new Promise(async (resolve) => {
      if (!isLogin.value) {
        return resolve(true)
      }
      getUserInfo()
        .then(({ data }: any) => {
          if (data.code === 1) {
            Object.assign(balanceInfo, data.data)
          }
          else {
            loginExit()
          }
        }).catch(() => {
          loginExit()
        })
        .finally(() => {
          resolve(true)
        })
    })
  }

  function updateBalanceInfo(amount: string) {
    balanceInfo.amount = amount
  }

  // 切换语言
  function changLangAction(data: { lang: number }) {
    // eslint-disable-next-line no-async-promise-executor
    return new Promise(async (resolve) => {
      setLangFn(data)
        .then((res: any) => {
          if (+res.data.code === 1) {
            resolve(true)
          }
          else {
            loginExit()
          }
        })
        .catch(() => {
          loginExit()
        })
    })
  }

  function updateLangConfig(lg: number) {
    langConfig.value = lg
    setLocal('lang', langConfig.value)
    document.title = +langConfig.value === 1 ? '小艾电竞' : 'IA ESPORTS'
  }

  function initLangAction() {
    // if (!isLogin.value) {
    //   return
    // }
    // getLangFn()
    //   .then((res: any) => {
    //     if (res.data.code === 1) {
    //       updateLangConfig(res.data.data.lang)
    //       canChangeLang.value = !!res.data.data.change_lang
    //     }
    //     else {
    //       updateLangConfig(getLocal('lang') || 1)
    //       loginExit()
    //     }
    //   })
    //   .catch(() => {
    //     updateLangConfig(getLocal('lang') || 1)
    //     loginExit()
    //   })
  }

  const setBalanceInfo = (row: any) => {
    Object.assign(balanceInfo, row)
  }

  async function initUserInfo() {
    await doGetUserInfo()
    await initLangAction()
  }

  return {
    balanceInfo,
    isLogin,
    langConfig,
    doGetUserInfo,
    updateLangConfig,
    changLangAction,
    initLangAction,
    avatarId,
    currencyInfo,
    changeAvatarId,
    currentCurrencyInfo,
    getCurrencyInfo,
    updateBalanceInfo,
    initUserInfo,
    canChangeLang,
    setBalanceInfo,
    loginExit,
  }
})

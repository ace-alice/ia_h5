/* eslint-disable import/order */
import '@/utils/initEnterData'
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { createPinia } from 'pinia'
import { i18n } from '@/locale'

import 'normalize.css/normalize.css'
import './assets/fonts/index.scss'

// 引入event-bus方法
import mitt from 'mitt'

// 引入全局样式
import '@/theme/index.scss'

// 1. 引入你需要的组件
// eslint-disable-next-line import/no-duplicates
import Vant from 'vant'
// eslint-disable-next-line import/no-duplicates
import { Lazyload } from 'vant'
// 2. 引入组件样式
import 'vant/lib/index.css'
import 'vant/es/toast/style'

// 引入数据管理工具
const pinia = createPinia()

if (window.__POWERED_BY_WUJIE__) {
  let instance: any
  // 引入数据管理工具
  window.__WUJIE_MOUNT = () => {
    instance = createApp(App)
    // 注册全局 event mitt方法
    instance.config.globalProperties.mittBus = mitt()

    instance.use(pinia).use(router).use(Vant).use(i18n).use(Lazyload).mount('#app')
  }
  window.__WUJIE_UNMOUNT = () => {
    instance.unmount()
  }
  /*
    由于vite是异步加载，而无界可能采用fiber执行机制
    所以mount的调用时机无法确认，框架调用时可能vite
    还没有加载回来，这里采用主动调用防止用没有mount
    无界mount函数内置标记，不用担心重复mount
  */
  window.__WUJIE.mount()
}
else {
  const app: any = createApp(App)
  // 注册全局 event mitt方法
  app.config.globalProperties.mittBus = mitt()

  app.use(pinia).use(router).use(Vant).use(i18n).use(Lazyload).mount('#app')
}

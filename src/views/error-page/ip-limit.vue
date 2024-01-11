<script setup lang="ts">
import err404Icon from '@/assets/home/que_xianzhi.png'
const ipc = ref('...')

const cityname = ref('...')

const script = document.createElement('script')

script.src = 'https://pv.sohu.com/cityjson?ie=utf-8'

document.getElementsByTagName('head')[0].appendChild(script)

setTimeout(() => {
  const script2 = document.createElement('script')
  const data2 = 'const Ip = returnCitySN.cip;const cityname = returnCitySN.cname;localStorage.setItem(\'Ip\', Ip);localStorage.setItem(\'cityname\', cityname)'

  script2.innerHTML = data2

  document.getElementsByTagName('head')[0].appendChild(script2)

  ipc.value = localStorage.getItem('Ip') || '...'
  cityname.value = localStorage.getItem('cityname') || '...'
}, 2000)
</script>

<template>
  <div class="ip-limit">
    <img :src="err404Icon">
    <span class="tip">{{ $t('error_info_1') }}</span>
    <div class="ip">
      IP:
      <span>{{ ipc }}</span>
      ({{ cityname }})
    </div>
  </div>
</template>

<style lang="scss" scoped>
.ip-limit {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  img {
    width: 234px;
    height: 234px;
    margin-top: 200px;
  }

  .tip {
    width: 80%;
    font-size: 12px;
    color: rgba(255 255 255 / 60%);
    letter-spacing: 0;
    font-weight: 400;
    text-align: center;
  }

  .ip {
    font-size: 12px;
    color: rgba(255 255 255 / 60%);
    letter-spacing: 0;
    line-height: 34px;
    font-weight: 400;

    span {
      color: #fe5e0099;
    }
  }
}
</style>

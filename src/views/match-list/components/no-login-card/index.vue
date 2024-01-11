<script setup lang="ts" name="NoLoginCard">
import closeIcon from '@/assets/home/com_delete.png'
import { gameInfoStore } from '@/store/gameInfo'
const emit = defineEmits(['closeLoginEmit'])

const { toSearch } = storeToRefs(gameInfoStore())

const closeLogin = () => {
  emit('closeLoginEmit')
}
const toLogin = () => {
  window.parent.postMessage('login', '*')
}
</script>

<template>
  <div v-show="!toSearch" class="no-login-card">
    <div class="no-login-title">
      {{ $t("noLoginTip") }}
    </div>
    <div class="no-login-button">
      <span @click="toLogin">{{ $t("toLogIn") }}</span>
      <img :src="closeIcon" @click="closeLogin">
    </div>
  </div>
</template>

<style lang="scss" scoped>
.no-login-card {
  height: 40px;
  width: 100%;
  background: rgba(254, 94, 0, 0.2);
  display: flex;
  justify-content: space-between;
  padding: 0 16px;
  width: calc(100% - 32px);

  .no-login-title {
    display: flex;
    align-items: center;
    height: 40px;
    font-family: PingFangSC-Regular;
    font-size: 12px;
    color: #fe5e00;
    font-weight: 400;
    flex-grow: 1;
  }
  .no-login-button {
    display: flex;
    align-items: center;
    span {
      display: flex;
      justify-content: center;
      align-items: center;
      width: 52px;
      height: 22px;
      background-image: linear-gradient(90deg, #f16720 0%, #fd8908 94%);
      border-radius: 16px;
      font-family: PingFangSC-Regular;
      font-size: 12px;
      color: #ffffff;
      text-align: right;
      font-weight: 400;
    }
    img {
      width: 16px;
      height: 16px;
      margin-left: 12px;
      flex-shrink: 0;
    }
  }
}
</style>

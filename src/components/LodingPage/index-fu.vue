<script lang="ts" setup name="GlobalLoading">
import { ref } from 'vue'
import IaloadingIcon from '@/assets/home/ialoading.png'

const sourceLoad = ref(true)

function done() {
  setTimeout(() => {
    sourceLoad.value = false
  }, 1200)
}

onMounted(() => {
  done()
})
</script>

<template>
  <Teleport to="body">
    <div
      v-show="sourceLoad"
      class="index_load_page"
    >
      <div class="loading-box">
        <div class="loading-bg" />
        <img class="loading-icon" :src="IaloadingIcon" alt="">
      </div>
    </div>
  </Teleport>
</template>

<style lang="scss" scoped>
.index_load_page {
  position: absolute;
  z-index: 10000;
  top: 0;
  left: 0;
  height: 100vh;
  width: 100vw;
  background-color: #181c22;
  background-size: 100% 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  .loading-box {
    height: 64px;
    width: 64px;
    position: relative;
  }
  .loading-bg {
    height: 52px;
    width: 52px;
    border-radius: 50%;
    border: 6px solid rgba(255, 255, 255, 0.8);
    position: absolute;
    animation: bgShow 1s ease-in-out;
  }
  .loading-icon {
    height: 56px;
    width: 56px;
    position: absolute;
    top: 3px;
    left: 3px;
    animation: iconShow 1s ease-in-out;
  }
}

@keyframes bgShow {
 0%{
  opacity: 0;
 }
 60%{
  opacity: 0;
 }
 100% {
  opacity: 1;
 }
}

@keyframes iconShow {
 0%{
  opacity: 0.2;
  transform: scale(0) rotateZ(180deg);
 }
 60%{
  opacity: 1;
  transform: scale(1) rotateZ(0);
 }
 80%{
  opacity: 0.6;
  transform: scale(0.8) rotateZ(0);
 }
 100%{
  opacity: 1;
  transform: scale(1) rotateZ(0);
 }
}
</style>

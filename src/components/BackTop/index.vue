<script lang="ts" setup name="BackTop">
import backTopIcon from '@/assets/home/home_top.png'
const props = defineProps(['target'])
</script>

<template>
  <van-back-top :target="target || '#app'" class="back-top" right="18px" bottom="80px">
    <template #default>
      <img :src="backTopIcon">
    </template>
  </van-back-top>
</template>

<style lang="scss" scoped>
.back-top {
  width: 40px;
  height: 40px;
  img {
    width: 40px;
    height: 40px;
  }
}
</style>

<style>
.van-back-top {
  background-color: transparent !important;
}
</style>

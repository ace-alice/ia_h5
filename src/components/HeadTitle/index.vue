<script lang="ts">
import { defineComponent } from 'vue'
import { useRouter } from 'vue-router'
import backIcon from '@/assets/home/com_back.png'
import { globalApiConfigStore } from '@/store/globalApiConfig'
export default defineComponent({
  name: 'HeadTitle',
  components: {},
  props: {
    title: {
      type: String,
      default: '',
    },
    path: {
      type: String,
      default: '',
    },
  },
  setup(props: any) {
    const router = useRouter()
    const { showBetList, showNotice, showRule, showAvator } = storeToRefs(
      globalApiConfigStore(),
    )
    const goBack = () => {
      if (props.path) {
        router.push({ name: props.path })
      }
      showBetList.value = false
      showNotice.value = false
      showRule.value = false
      showAvator.value = false
    }
    return { backIcon, router, goBack }
  },
})
</script>

<template>
  <div class="header">
    <van-nav-bar :title="title">
      <template #left>
        <img :src="backIcon" @click="goBack">
      </template>
    </van-nav-bar>
  </div>
</template>

<style lang="scss" scoped>
.header {
  :deep(.van-nav-bar) {
    z-index: 9999;
    background: #181c22;
  }
  :deep(.van-nav-bar__content) {
    background: #181c22;
  }
  :deep(.van-nav-bar__title) {
    font-size: 16px;
    font-weight: 500;
    color: #ffffff;
  }
  :deep(.van-haptics-feedback:active) {
    opacity: 1;
  }
  :deep(.van-hairline--bottom:after) {
    border-bottom-width: 0;
  }
  img {
    width: 24px;
    height: 24px;
  }
}
</style>

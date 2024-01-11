<script lang="ts">
import { defineComponent } from 'vue'
import HeadTitle from '@/components/HeadTitle/index.vue'
import useNoticeHook from '@/hooks/useNoticeHook'
import EllipsisText from '@/components/EllipsisText/index.vue'
import { globalApiConfigStore } from '@/store/globalApiConfig'
export default defineComponent({
  name: 'IaNotice',
  components: { HeadTitle, EllipsisText },
  setup() {
    const { noticeList, getNotices } = useNoticeHook()

    const { showNotice } = storeToRefs(globalApiConfigStore())

    return {
      noticeList,
      showNotice,
      getNotices,
    }
  },
})
</script>

<template>
  <van-popup
    v-model:show="showNotice"
    class="bet-popup"
    position="right"
    close-on-popstate
    @open="getNotices"
  >
    <div class="page-notice">
      <HeadTitle :title="$t('announcementRecord')" />
      <div class="container">
        <div v-for="item in noticeList" :key="item.id" class="item">
          <div class="title">
            {{ item.title }}
          </div>
          <EllipsisText :group-item="item" />
        </div>
      </div>
    </div>
  </van-popup>
</template>

<style lang="scss" scoped>
.page-notice {
  height: 100%;
  background: #262d34;
  .container {
    height: calc(100% - 48px);
    overflow: auto;
    .item {
      position: relative;
      width: calc(100% - 36px);
      margin: auto;
      padding: 17px 0;
      border-bottom: 1px solid rgba(255, 255, 255, 0.06);
      overflow: hidden;
      .title {
        font-size: 14px;
        color: #ffffff;
        font-weight: 500;
        word-break: break-all;
      }
    }
  }
}
</style>

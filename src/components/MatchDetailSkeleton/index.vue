<script setup lang="ts" name="MatchDetailSkeleton">
import { useRouter } from 'vue-router'
import backIcon from '@/assets/home/com_back.png'
const props = defineProps({
  row: {
    type: Number,
    default: 7,
  },
  loading: {
    type: Boolean,
    default: false,
  },
})
const router = useRouter()

function toMatchList() {
  router.push({ name: 'MatchList' })
}
</script>

<template>
  <div>
    <van-skeleton class="MatchDetailSkeleton" :loading="loading">
      <template #template>
        <div class="skeleton-box">
          <div class="detail-page-header">
            <div>
              <img :src="backIcon" alt="" @click="toMatchList">
              <div>{{ $t("gameQuiz") }}</div>
              <div />
            </div>
          </div>
          <div class="detail-skeleton-tab">
            <div class="detail-skeleton-tab-item" />
          </div>
          <div class="detail-skeleton-dev" />
          <div class="detail-skeleton-card">
            <div />
            <div>
              <div>
                <div />
                <div />
              </div>
              <div>
                <div />
                <div />
              </div>
            </div>
          </div>
          <template v-for="num in row" :key="num">
            <div class="bottom-box">
              <div />
              <div>
                <div v-for="num2 in 4" :key="num2" class="skeleton-desc" />
              </div>
            </div>
          </template>
        </div>
      </template>
    </van-skeleton>
  </div>
</template>

<style lang="scss" scoped>
.item-class {
  border-radius: 2px;
  background: #ffffff;
  opacity: 0.06;
}
.detail-skeleton-card {
  width: calc(100% - 36px);
  background: #262d34;
  border-radius: 16px;
  padding: 16px 0;
  margin: 12px auto;
  & > div {
    &:nth-child(1) {
      height: 18px !important;
      margin: auto;
      width: calc(100% - 36px) !important;
      @extend .item-class;
    }
    &:nth-child(2) {
      margin: auto;
      width: calc(100% - 36px) !important;
      display: flex;
      justify-content: space-between;
      & > div {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        & > div {
          &:nth-child(1) {
            @extend .item-class;
            height: 40px;
            width: 40px;
            border-radius: 50%;
            margin-top: 26px;
          }
          &:nth-child(2) {
            @extend .item-class;
            height: 18px;
            width: 112px;
            margin-top: 26px;
          }
        }
      }
    }
  }
}
.detail-page-header {
  height: 50px;
  width: 100%;
  background: #181c22;
  & > div {
    display: flex;
    width: calc(100% - 36px);
    margin: auto;
    height: 100%;
    justify-content: space-between;
    align-items: center;
    font-size: 16px;
    color: #ffffff;
    text-align: center;
    font-weight: 600;
    img {
      height: 24px;
      width: 24px;
    }
  }
}
.detail-skeleton-tab {
  height: 45px;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  .detail-skeleton-tab-item {
    height: 18px !important;
    width: calc(100% - 36px) !important;
    @extend .item-class;
  }
}
.detail-skeleton-dev {
  height: 10px;
  width: 100%;
  background: #0e1519;
}
.MatchDetailSkeleton {
  width: 100vw;
  height: 100vh;
  padding: 0;
  .skeleton-box {
    width: 100%;
    height: 100%;
    overflow: hidden;
  }
  .bottom-box {
    width: calc(100% - 36px);
    background: #262d34;
    border-radius: 16px;
    padding: 18px 0;
    margin: 12px auto;
    & > div {
      &:nth-child(1) {
        width: calc(100% - 36px);
        @extend .item-class;
        height: 18px;
        margin: auto;
      }
      &:nth-child(2) {
        width: calc(100% - 36px);
        display: flex;
        margin: auto;
        flex-wrap: wrap;
        justify-content: space-between;
      }
    }

    .skeleton-desc {
      @extend .item-class;
      width: calc(50% - 6px);
      height: 32px;
      border-radius: 4px;
      margin-top: 16px;
    }
  }
}
</style>

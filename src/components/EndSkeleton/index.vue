<script setup lang="ts" name="EndSkeleton">
const props = defineProps({
  row: {
    type: Number,
    default: 4,
  },
})
</script>

<template>
  <div>
    <van-skeleton v-for="num in row" :key="num" class="EndSkeleton">
      <template #template>
        <div class="skeleton-box">
          <van-skeleton-paragraph />
          <div class="res-box">
            <div class="bottom-box">
              <div>
                <div class="skeleton-logo" />
                <div class="skeleton-desc" />
              </div>
              <div>
                <div class="skeleton-logo" />
                <div class="skeleton-desc" />
              </div>
            </div>
            <div class="skeleton-res" />
          </div>
        </div>
      </template>
    </van-skeleton>
  </div>
</template>

<style lang="scss" scoped>
.EndSkeleton {
  width: calc(100% - 68px);
  height: 140px;
  padding: 12px 16px;
  border-radius: 16px;
  background: #262d34;
  margin: 0 auto 12px;
  .van-skeleton-paragraph {
    background: #ffffff !important;
    opacity: 0.06;
    border-radius: 2px;
    height: 18px;
  }
  .skeleton-box {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }

  .res-box {
    display: flex;
    width: 100%;
    height: 80px;
    justify-content: space-between;
  }

  .skeleton-res {
    height: 80px;
    width: 58px;
    background: #ffffff !important;
    opacity: 0.06;
  }
  .bottom-box {
    width: calc(100% - 68px);
    display: flex;
    flex-direction: column;
    justify-content: space-between;

    & > div {
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: space-between;
      &+div{
        margin-top: 3px;
      }
      .skeleton-logo {
        height: 40px;
        width: 40px;
        background: #ffffff !important;
        opacity: 0.06;
        border-radius: 50%;
      }
      .skeleton-desc {
        width: calc(100% - 64px);
        border-radius: 4px;
        height: 36px;
        background: #ffffff !important;
        opacity: 0.06;
      }
    }
  }
}
</style>

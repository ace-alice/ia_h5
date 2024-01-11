<script setup lang="ts" name="UniversallSkeleton">
const props = defineProps({
  row: {
    type: Number,
    default: 4,
  },
})
</script>

<template>
  <div>
    <van-skeleton
      v-for="num in row"
      :key="num"
      class="UniversallSkeleton"
    >
      <template #template>
        <div class="skeleton-box">
          <van-skeleton-paragraph />
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
        </div>
      </template>
    </van-skeleton>
  </div>
</template>

<style lang="scss" scoped>
.UniversallSkeleton {
  width: calc(100% - 64px);
  height: 140px;
  padding: 12px 16px;
  border-radius: 16px;
  background: #262d34;
  margin:0  auto 12px;
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
  .bottom-box {
    width: 100%;
    display: flex;
    justify-content: space-between;
    & > div {
      width: calc(50% - 16px);
      display: flex;
      flex-direction: column;
      align-items: center;
      .skeleton-logo {
        height: 40px;
        width: 40px;
        margin-bottom: 20px;
        background: #ffffff !important;
        opacity: 0.06;
        border-radius: 50%;
      }
      .skeleton-desc {
        width: 100%;
        border-radius: 4px;
        height: 36px;
        background: #ffffff !important;
        opacity: 0.06;
      }
    }
  }
}
</style>

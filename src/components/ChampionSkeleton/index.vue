<script setup lang="ts" name="ChampionSkeleton">
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
      class="ChampionSkeleton"
    >
      <template #template>
        <div class="skeleton-box">
          <van-skeleton-paragraph />
          <van-skeleton-paragraph style="height:36px;" />
          <div class="bottom-box">
            <div class="skeleton-desc" />
            <div class="skeleton-desc" />
            <div class="skeleton-desc" />
            <div class="skeleton-desc" />
          </div>
        </div>
      </template>
    </van-skeleton>
  </div>
</template>

<style lang="scss" scoped>
.ChampionSkeleton {
  width: calc(100% - 64px);
  height: 156px;
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
    flex-wrap: wrap;
    .skeleton-desc{
      width: calc(50% - 6px);
      height: 36px;
      border-radius: 4px;
      background: #ffffff;
      opacity: 0.06;
      margin-top: 8px;
    }
  }
}
</style>

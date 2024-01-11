<script setup lang="ts" name="LeagueEmpty">
import emptyImg from '@/assets/home/que_bisai.png'
import { gameInfoStore } from '@/store/gameInfo'

const { currentHandicap } = storeToRefs(gameInfoStore())

const router = useRouter()
const goLink = () => {
  router.push({ name: 'MatchList' })
  currentHandicap.value = 'live'
}
</script>

<template>
  <div class="league-empty">
    <van-empty
      image-size="234"
      :image="emptyImg"
      :description="$t('no_data_now')"
    >
      <template #description>
        <span>{{ $t("noRelatedEvents") }}</span>
      </template>
      <template #default>
        <div>
          {{ $t("go") }}
          <span @click="goLink">{{ $t("live_bet") }}</span>
          <div>{{ $t("takeLook") }}</div>
        </div>
      </template>
    </van-empty>
  </div>
</template>

<style lang="scss" scoped>
.league-empty {
  margin-top: 200px;
  height: calc(100% - 200px);
  width: 100%;

  :deep(.van-empty__description) {
    font-family: PingFangSC-Regular;
    font-size: 12px;
    color: rgba(255 255 255 / 60%);
    letter-spacing: 0;
    font-weight: 400;
    margin-top: 0;
    line-height: 1;
  }

  :deep(.van-empty__bottom) {
    margin-top: 0;
    width: calc(100% - 24px);

    & > div {
      display: flex;
      align-items: center;
      justify-content: center;
      font-family: PingFangSC-Regular;
      font-size: 12px;
      color: rgba(255 255 255 / 60%);
      letter-spacing: 0;
      font-weight: 400;
      padding: 0 6px;
      width: 100%;

      span {
        display: flex;
        justify-content: center;
        align-items: center;
        // width: 42px;
        height: 22px;
        margin: 0 6px;
        flex-shrink: 0;
        padding: 0 8px;
        background-image: linear-gradient(90deg, #f16720 0%, #fd8908 94%);
        border-radius: 16px;
        color: #fff;
      }

      div {
        // flex-grow: 1;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
    }
  }
}
</style>

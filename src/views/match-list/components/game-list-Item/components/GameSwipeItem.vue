<script setup lang="ts" name="GameSwipeItem">
import { gameInfoStore } from '@/store/gameInfo'
import allIcon from '@/assets/home/all.png'
import errImg from '@/assets/home/default.png'
import useNoticeHook from '@/hooks/useNoticeHook'
// import moreRight from '@/assets/home/home_more_right.png'
import { globalApiConfigStore } from '@/store/globalApiConfig'

const router = useRouter()
const { currentGameId, sortGameList } = storeToRefs(gameInfoStore())
const { showNotice } = storeToRefs(globalApiConfigStore())

const isShowTabs = inject('isShowTabs', false)

const opacityValue = inject('opacityValue', 1)

const { getNotices, noticeText } = useNoticeHook()

const { setCurrentGameId } = gameInfoStore()

const getSwiperList = computed(() => {
  const arr: any = []
  if (!sortGameList.value.length) {
    return
  }
  for (let i = 0; i < sortGameList.value.length; i++) {
    const num: any = parseInt(String(i / 10))
    if (!arr[num]) {
      arr[num] = []
    }
    arr[num].push(sortGameList.value[i])
  }
  return arr
})
const handleClick = (id: string) => {
  setCurrentGameId(id)
}

function goNotice() {
  showNotice.value = true
}

// function goLeaguePage() {
//   router.push({ name: 'LeaguePage' })
// }

onMounted(() => {
  nextTick(() => {
    getNotices()
  })
})
</script>

<template>
  <div
    class="game-swipe" :class="{ 'not-show-swipe': isShowTabs }"
    :style="{ opacity: 1.5 - opacityValue > 0 ? 1 - opacityValue : 0 }"
  >
    <van-swipe indicator-color="#fff">
      <van-swipe-item v-for="item in getSwiperList" :key="item.id">
        <div class="game-swipe-item">
          <div
            v-for="subItem in item" :key="subItem.id" class="game-swipe-item-main van-haptics-feedback"
            @click.stop="handleClick(String(subItem.id))"
          >
            <van-image
              class="game-image" :src="subItem.id === 0 ? allIcon : subItem.logo" :error-icon="errImg"
              :show-loading="false" :class="{ 'tabs-image-active': subItem.id === +currentGameId }"
            />
            <span
              class="van-ellipsis" :style="{
                opacity: subItem.id === +currentGameId ? 1 : 0.6,
                color: subItem.id === +currentGameId ? '#fe5e00' : '',
              }"
            >{{ subItem.game_name }}</span>
          </div>
        </div>
      </van-swipe-item>
    </van-swipe>
    <div class="game-swipe-notice">
      <van-notice-bar color="#1989fa" speed="40">
        <template #left-icon>
          <span class="game-swipe-notice-left" @click="goNotice">{{
            $t("the_announcement")
          }}</span>
        </template>
        <template #default>
          <span class="game-swipe-notice-title" @click="goNotice">{{
            noticeText
          }}</span>
        </template>
        <!-- <template #right-icon>
          <span class="game-swipe-notice-right" @click.stop="goLeaguePage">
            {{ $t("theLeague") }}
            <van-image width="16" height="16" :src="moreRight" />
          </span>
        </template> -->
      </van-notice-bar>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.not-show-swipe {
  opacity: 0;
  z-index: 10 !important;
}

.van-skeleton {
  display: inline-block;
  width: 24px;
  margin: 0 5px;

  .van-skeleton__content {
    width: 24px;
  }

  .van-skeleton__row {
    height: 24px;
    //margin: 5px 0;
  }
}

:deep(.van-skeleton-paragraph) {
  width: 32px !important;
  height: 32px;
}

:deep(.van-swipe__indicator:not(:last-child)) {
  margin-right: 10px;
}

:deep(.van-swipe__indicator--active) {
  transform: scale(1.2);
}

.game-swipe {
  position: absolute;
  transition: all 0.4s ease-in-out;
  top: 0;
  left: 16px;
  width: calc(100% - 32px);
  margin: 0 auto;
  background: linear-gradient(180deg, rgba(38, 45, 52, 0.4), #262d34);
  height: 206px;
  border-radius: 16px;
  padding: 0 14px;
  box-sizing: border-box;
  overflow: hidden;
  z-index: 20;

  &-notice {
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.1);

    :deep(.van-notice-bar) {
      background: transparent;
    }

    :deep(.van-notice-bar__wrap) {
      margin-left: 10px;
    }

    &-left {
      width: 34px;
      height: 16px;
      line-height: 16px;
      font-size: 12px;
      color: #e1a100;
      font-weight: 400;
      background: rgba(225, 161, 0, 0.1);
      border: 0.5px solid rgba(225, 161, 0, 1);
      border-radius: 2px;
      text-align: center;
    }

    &-title {
      opacity: 0.6;
      font-size: 12px;
      color: #ffffff;
      font-weight: 400;
    }

    &-right {
      display: flex;
      justify-content: center;
      align-items: center;
      font-size: 14px;
      color: #ffffff;
      font-weight: 500;
    }
  }
}

.game-swipe-item {
  display: flex;
  flex-flow: wrap;
  //width: calc(100% - 28px);
  height: 134px;
  padding-bottom: 20px;
  font-size: 12px;
  color: #fff;
  font-weight: 400;
  margin: 14px 0 0 0;

  &-main {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    flex-direction: column;
    width: 20%;
    padding-top: 8px;

    .game-image {
      width: 24px;
      height: 24px;
    }

    :deep(.tabs-image-active:before) {
      content: "";
      background: rgba(0, 0, 0, 0.2);
      position: absolute;
      width: 32px;
      height: 32px;
      left: -4px;
      top: -4px;
      border-radius: 6px;
    }

    :deep(.van-image__error, .van-image__loading) {
      background: transparent;
    }

    :deep(.van-icon__image) {
      width: 32px;
      height: 32px;
    }

    span {
      width: 100%;
      margin-top: 10px;
      text-align: center;
    }
  }

  &-main:active {
    span {
      transform: scale(1.1);
    }
  }
}
</style>

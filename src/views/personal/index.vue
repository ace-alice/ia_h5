<script lang="ts">
import { defineComponent, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import { userInfoStore } from '@/store/userInfo'
import backIcon from '@/assets/home/com_back.png'
import rightIcon from '@/assets/home/home_more_right.png'
import refreshIcon from '@/assets/home/com_refresh.png'
import logTouzhu01 from '@/assets/home/log_touzhu_01.png'
import logNotice from '@/assets/home/log_notice.png'
import logWanfa from '@/assets/home/log_wanfa.png'
import defaultIcon from '@/assets/home/default.png'
import { i18n } from '@/locale'
import { globalApiConfigStore } from '@/store/globalApiConfig'
import avatar1 from '@/assets/avatar/image-1.png'
import avatar2 from '@/assets/avatar/image-2.png'
import avatar3 from '@/assets/avatar/image-3.png'
import avatar4 from '@/assets/avatar/image-4.png'
import avatar5 from '@/assets/avatar/image-5.png'
import avatar6 from '@/assets/avatar/image-6.png'
import avatar7 from '@/assets/avatar/image-7.png'
import avatar8 from '@/assets/avatar/image-8.png'
import avatar9 from '@/assets/avatar/image-9.png'
import avatar10 from '@/assets/avatar/image-10.png'
import avatar11 from '@/assets/avatar/image-11.png'
import avatar12 from '@/assets/avatar/image-12.png'
import avatar13 from '@/assets/avatar/image-13.png'
import avatar14 from '@/assets/avatar/image-14.png'
import avatar15 from '@/assets/avatar/image-15.png'
import { fixedKeep, toFixedNumber } from '@/utils'
export default defineComponent({
  name: 'PersonalCenter',
  setup() {
    const avatarObj: any = {
      a1: avatar1,
      a2: avatar2,
      a3: avatar3,
      a4: avatar4,
      a5: avatar5,
      a6: avatar6,
      a7: avatar7,
      a8: avatar8,
      a9: avatar9,
      a10: avatar10,
      a11: avatar11,
      a12: avatar12,
      a13: avatar13,
      a14: avatar14,
      a15: avatar15,
    }
    const { balanceInfo, avatarId } = storeToRefs(userInfoStore())
    const {
      showAvator,
      showBetList,
      showRule,
      showNotice,
      showPersonalCenter,
    } = storeToRefs(globalApiConfigStore())
    const { doGetUserInfo } = userInfoStore()
    const refresh = ref(false)
    const router = useRouter()
    const startVal = ref(0)
    const personalIconList = [
      {
        icon: logTouzhu01,
        title: i18n.global.t('bettingHistory'),
        rightIcon,
        jump: () => {
          showBetList.value = true
        },
      },
      {
        icon: logNotice,
        title: i18n.global.t('announcementRecord'),
        rightIcon,
        jump: () => {
          showNotice.value = true
        },
      },
      {
        icon: logWanfa,
        title: i18n.global.t('egame_rule'),
        rightIcon,
        jump: () => {
          showRule.value = true
        },
      },
    ]

    const changeAvatar = () => {
      showAvator.value = true
    }
    const jumpClick = (val: any) => {
      setTimeout(() => {
        val.jump()
      }, 200)
    }
    const getBalanceInfo = () => {
      doGetUserInfo().finally(() => {
        refresh.value = true
        setTimeout(() => {
          refresh.value = false
        }, 1000)
      })
    }
    const goBack = () => {
      showPersonalCenter.value = false
    }
    const avatarImage = (id: number) => {
      return avatarObj[`a${id > 0 && id < 16 ? id : 1}`]
    }

    watch(
      () => balanceInfo.value.amount,
      (newVal, oldVal) => {
        startVal.value = (oldVal as any) || 0
      },
    )
    return {
      backIcon,
      personalIconList,
      rightIcon,
      refreshIcon,
      balanceInfo,
      avatarId,
      startVal,
      refresh,
      avatarImage,
      changeAvatar,
      getBalanceInfo,
      goBack,
      jumpClick,
      logTouzhu01,
      logNotice,
      logWanfa,
      defaultIcon,
      showPersonalCenter,
      fixedKeep,
      toFixedNumber,
    }
  },
})
</script>

<template>
  <van-popup
    v-model:show="showPersonalCenter"
    :style="{
      height: '100%',
      width: '100%',
      padding: 0,
      margin: 0,
      maxWidth: 'unset',
      background: '#181c22',
    }"
    teleport="body"
    z-index="1000"
    position="right"
    lazy-render
  >
    <div class="personal-center">
      <div class="personal-center-header">
        <img class="header-back" :src="backIcon" @click="goBack">
        <span>{{ $t("personalCenter") }}</span>
        <div style="width: 32px; height: 1px" />
        <!--      <div /> -->
      </div>
      <div class="personal-center-info">
        <div class="avatar">
          <van-image
            width="62"
            height="62"
            fit="contain"
            :error-icon="defaultIcon"
            :show-loading="false"
            :src="avatarImage(avatarId)"
          />
          <div class="avatar-msg">
            <span>{{ balanceInfo.nickname ? balanceInfo.nickname : "" }}</span>
            <span @click="changeAvatar">{{ $t("changeAvatarImage") }}</span>
          </div>
        </div>
        <div class="refresh">
          <span>{{ $t("blance") }}</span>
          <img
            :src="refreshIcon"
            :class="{ rotate: refresh }"
            @click="getBalanceInfo"
          >
        </div>
        <div class="balance">
          <span>{{ toFixedNumber(balanceInfo.amount).toFixed(fixedKeep) }}</span>
        </div>
      </div>
      <div class="personal-center-row">
        <van-cell
          v-for="(item, index) in personalIconList"
          :key="index"
          @click="jumpClick(item)"
        >
          <template #icon>
            <img class="icon-left" :src="item.icon">
          </template>
          <template #title>
            <span>{{ item.title }}</span>
          </template>
          <template #right-icon>
            <img class="icon-right" :src="item.rightIcon">
          </template>
        </van-cell>
      </div>
    </div>
  </van-popup>
</template>

<style lang="scss" scoped>
.personal-center {
  background-image: url("../../assets/home/my_account.png");
  background-repeat: no-repeat;
  background-size: 100%;
  height: 258px;

  &-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: calc(100% - 36px);
    height: 48px;
    margin: 0 auto;

    .header-back {
      width: 24px;
      height: 24px;
    }

    span {
      font-size: 16px;
      color: #fff;
      font-weight: 500;
    }
  }

  &-info {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    width: calc(100% - 72px);
    height: 162px;
    margin: 65px auto 0;
    background: #262d34;
    border-radius: 16px;
    padding: 16px;

    .avatar {
      display: flex;

      :deep(.van-image) {
        width: 62px;
        height: 62px;
        border-radius: 62px;
        overflow: hidden;
      }

      &-msg {
        display: flex;
        flex-direction: column;
        justify-content: center;
        margin-left: 16px;
        color: #fff;

        span:nth-child(1) {
          font-size: 16px;
          font-weight: 500;
        }

        span:nth-child(2) {
          display: flex;
          justify-content: center;
          height: 18px;
          line-height: 20px;
          margin-top: 8px;
          opacity: 0.6;
          font-size: 12px;
          font-weight: 400;
          padding: 1px 8px;
          background: rgba(255 255 255 / 4%);
          border: 1px solid rgba(255 255 255 / 20%);
          border-radius: 14px;
        }
      }
    }

    .refresh {
      display: flex;
      align-items: center;
      justify-content: space-between;
      height: 54px;
      border-bottom: 1px solid rgba(255 255 255 / 6%);
      font-size: 16px;
      color: #fff;
      font-weight: 500;

      img {
        width: 24px;
        height: 24px;
        margin-top: 12px;
      }

      span {
        font-size: 12px;
        color: rgba(255 255 255 / 60%);
        font-weight: 400;
        margin-top: 12px;
      }
    }

    .rotate {
      transform: rotate(360deg);
      transition: all 1s;
    }

    .balance {
      display: flex;
      flex-direction: column;

      span {
        font-family: Gotham-Medium;
        font-size: 16px;
        color: #fff;
        font-weight: 500;
      }
    }
  }

  &-row {
    width: calc(100% - 36px);
    margin: 16px auto;
    background: #262d34;
    border-radius: 16px;
    padding: 10px 0;
    overflow: hidden;

    :deep(.van-cell) {
      align-items: center;
      background: #262d34;
      font-size: 14px;
      font-weight: 400;
      color: #ccc;
    }

    :deep(.van-cell:active) {
      background: rgba(255 255 255 / 4%);
    }

    :deep(.van-cell::after) {
      border-bottom: 0;
    }

    :deep(.van-cell__title) {
      display: flex;
      align-items: center;
      margin-left: 12px;
      color: rgba(255 255 255 / 60%);
    }

    .icon-left {
      width: 32px;
      height: 32px;
    }

    .icon-right {
      width: 16px;
      height: 16px;
    }
  }
}

.lang-container {
  width: 100%;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  flex-direction: column;
  padding: 24px 0;

  .title {
    width: calc(100% - 48px);
    margin: auto;
    font-size: 16px;
    color: #fff;
    font-weight: 500;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 24px;
    .close-icon {
      height: 20px;
      width: 20px;
      flex-shrink: 0;
    }
  }

  .devel {
    margin: 24px auto;
    background: rgba(255, 255, 255, 0.06);
    height: 1px;
    width: calc(100% - 28px);
  }

  .lang-text {
    font-size: 14px;
    color: #fff;
    text-align: justify;
    font-weight: 400;
    opacity: 0.6;
    height: 44px;
    display: flex;
    justify-content: flex-end;
    align-items: center;
    width: 100%;
    .lang-icon {
      width: 32px;
      flex-shrink: 0;
      margin: 0 24px;
    }
    .lang-name {
      width: 52%;
      flex-shrink: 0;
    }
  }

  .lang-active {
    font-size: 14px;
    color: #fe5e00;
    text-align: justify;
    font-weight: 500;
    opacity: 1;
    background: rgba(255, 255, 255, 0.04);
  }

  .submit {
    width: 272px;
    height: 40px;
    line-height: 40px;
    text-align: center;
    background-image: linear-gradient(90deg, #f16720 0%, #fd8908 94%);
    border-radius: 4px;
    font-size: 14px;
    color: #fff;
    letter-spacing: 0;
    font-weight: 500;
  }
}
</style>

<script setup lang="ts" name="UserInfoItem">
import { userInfoStore } from '@/store/userInfo'
import defaultIcon from '@/assets/home/default.png'
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
const { isLogin } = storeToRefs(userInfoStore())
const { showPersonalCenter } = storeToRefs(globalApiConfigStore())
const avatarImage = (id: number) => {
  return avatarObj[`a${id > 0 && id < 16 ? id : 1}`]
}
const { balanceInfo, avatarId } = storeToRefs(userInfoStore())

const userCenter = () => {
  if (!isLogin.value) {
    return
  }
  showPersonalCenter.value = true
}
</script>

<template>
  <div class="user-info-item">
    <div v-if="isLogin" class="user-info-item-name">
      <span>{{ balanceInfo.nickname ? balanceInfo.nickname : "" }}</span>
      <span>{{ toFixedNumber(balanceInfo.amount).toFixed(fixedKeep) }}</span>
    </div>
    <div
      class="user-info-item-phone"
      :class="{ 'is-login': !isLogin }"
      @click="userCenter"
    >
      <van-image
        width="36"
        height="36"
        fit="contain"
        :error-icon="defaultIcon"
        :show-loading="false"
        :src="avatarImage(avatarId)"
      />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.user-info-item {
  padding: 0 20px;
  display: flex;
  flex-shrink: 0;
  align-items: center;
  overflow: hidden;

  .user-info-item-name {
    display: flex;
    flex-direction: column;

    span:nth-child(1) {
      display: inline-block;
      line-height: 17px;
      font-size: 12px;
      color: #fff6;
      font-weight: 400;
      text-align: right;
    }

    span:nth-child(2) {
      font-size: 14px;
      color: #fff;
      font-weight: 500;
      font-family: Gotham-Medium;
    }
  }

  .user-info-item-phone {
    display: flex;
    margin-left: 10px;

    :deep(.van-image) {
      img {
        border-radius: 50%;
      }
    }
  }

  .is-login {
    filter: grayscale(1);
  }
}
</style>

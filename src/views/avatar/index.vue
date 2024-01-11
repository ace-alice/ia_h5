<script lang="ts">
import { defineComponent, ref } from 'vue'
import { storeToRefs } from 'pinia'
import HeadTitle from '@/components/HeadTitle/index.vue'
import { userInfoStore } from '@/store/userInfo'
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

export default defineComponent({
  name: 'IaAvatar',
  components: { HeadTitle },
  setup() {
    const { avatarId } = storeToRefs(userInfoStore())
    const { changeAvatarId } = userInfoStore()
    const { showAvator } = storeToRefs(globalApiConfigStore())

    const selectAvatarId = ref(avatarId.value)

    function changeAccount(num: number) {
      selectAvatarId.value = num
      changeAvatarId(selectAvatarId.value)
      showAvator.value = false
    }

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

    const getAvatarImage = (id: number) => {
      return avatarObj[`a${id > 0 && id < 16 ? id : 1}`]
    }
    return { changeAccount, getAvatarImage, avatarId, selectAvatarId, showAvator }
  },
})
</script>

<template>
  <van-popup
    v-model:show="showAvator"
    class="bet-popup"
    position="right"
    close-on-popstate
  >
    <div class="avatar">
      <HeadTitle :title="$t('changeAvatarImage')" />
      <div class="avatar-empty" />
      <div class="container">
        <div class="grid">
          <span
            v-for="item in 15"
            :key="item"
            class="avatar-box"
            :class="{ 'active-avatar': item === +selectAvatarId }"
            @click.stop="changeAccount(item)"
          >
            <img :src="getAvatarImage(item)">
          </span>
        </div>
      </div>
    </div>
  </van-popup>
</template>

<style lang="scss" scoped>
.avatar {
  display: flex;
  flex-direction: column;
  height: 100%;

  .avatar-empty {
    width: 100%;
    height: 8px;
    background: #0e1519;
  }

  .container {
    flex-grow: 1;
    background: #181c22;
    padding: 0 6px;

    .grid {
      display: flex;
      flex-wrap: wrap;

      .avatar-box {
        display: flex;
        justify-content: center;
        flex: 25%;
        flex-grow: initial;
        margin-top: 28px;

        img {
          width: 68px;
          height: 68px;
          border-radius: 50%;
        }
      }

      .active-avatar {
        position: relative;

        &::after {
          content: "";
          position: absolute;
          height: 68px;
          width: 68px;
          border: 2px solid rgba(254 95 0 / 100%);
          top: -2px;
          left: 10px;
          border-radius: 50%;
        }
      }
    }
  }
}
</style>

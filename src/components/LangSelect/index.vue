<script setup lang="ts" name="LangSelect">
import { userInfoStore } from '@/store/userInfo'
import langIcon from '@/assets/home/com_world.png'
import closeIcon from '@/assets/home/com_closed.png'
import { globalApiConfigStore } from '@/store/globalApiConfig'
import lang1 from '@/assets/home/lang-1.png'
import lang2 from '@/assets/home/lang-2.png'
import lang3 from '@/assets/home/lang-3.png'
import lang4 from '@/assets/home/lang-4.png'
import lang5 from '@/assets/home/lang-5.png'
import lang6 from '@/assets/home/lang-6.png'
import lang7 from '@/assets/home/lang-7.png'
import lang8 from '@/assets/home/lang-8.png'

const langObj: any = {
  lang1,
  lang2,
  lang3,
  lang4,
  lang5,
  lang6,
  lang7,
  lang8,
}

const { langConfig } = storeToRefs(userInfoStore())

const { updateLangConfig } = userInfoStore()

const langDialogShow = ref(false)

const changeLang = () => {
  langDialogShow.value = true
}

const langImage = (id: number) => {
  // return new URL(
  //   `../../assets/home/lang-${id > 0 && id < 9 ? id : 1}.png`,
  //   import.meta.url,
  // ).href
  return langObj[`lang${id > 0 && id < 9 ? id : 1}`]
}

const changeLangIndex = (index: number) => {
  if (index + 1 === +langConfig.value) {
    return
  }
  updateLangConfig(index + 1)
  setTimeout(() => {
    window.location.reload()
  }, 50)
}

const langList = [
  '简体中文',
  'English',
  '繁體中文',
  'ไทย',
  'Tiếng việt',
  'Indonesia',
  '日本',
  '한국어',
]
const { matchListTop } = storeToRefs(globalApiConfigStore())

const showBack = ref(false)

watch(() => matchListTop.value, (newVal, oldVal) => {
  if (newVal > oldVal && newVal >= 200) {
    showBack.value = true
  }
  if (newVal < oldVal && newVal < 200) {
    showBack.value = false
  }
})
</script>

<template>
  <div class="header-lang" :class="{ 'header-top': showBack }" @click="changeLang">
    <img :src="langIcon">
  </div>
  <van-popup
    v-model:show="langDialogShow"
    teleport="#app"
    :round="true"
    position="bottom"
    style="background: #262d34"
  >
    <div class="lang-container">
      <div class="title">
        <div style="height: 20px; width: 20px" />
        <div>{{ $t("pleaseSelectLanguage") }}</div>
        <img
          class="close-icon"
          :src="closeIcon"
          @click="langDialogShow = false"
        >
      </div>
      <div class="devel" />
      <div
        v-for="(item, index) in langList"
        :key="index"
        class="lang-text"
        :class="{ 'lang-active': +langConfig === index + 1 }"
        @click="changeLangIndex(index)"
      >
        <img class="lang-icon" :src="langImage(index + 1)">
        <div class="lang-name">
          {{ item }}
        </div>
      </div>
    </div>
  </van-popup>
</template>

<style lang="scss" scoped>
.header-top{
  transform: translateY(-48px);
}
.header-lang {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 38px;
  height: 38px;
  border-radius: 8px;
  border: 1px solid rgba(254, 115, 0, 0.5);
  background: rgba(254,94,0,0.15);
  position: fixed;
  right: 18px;
  bottom: 80px;
  transition: var(--van-duration-base) cubic-bezier(.25,.8,.5,1);
  img {
    width: 24px;
    height: 24px;
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
}
</style>

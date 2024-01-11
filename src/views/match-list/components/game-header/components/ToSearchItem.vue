<script setup lang="ts" name="ToSearchItem">
import { gameInfoStore } from '@/store/gameInfo'
import leftIcon from '@/assets/home/home_search.png'
import clearIcon from '@/assets/home/com_delete.png'
import homeEaguescreeningIcon from '@/assets/home/home_leaguescreening.png'
const { searchTeamName, toSearch } = storeToRefs(gameInfoStore())
const gameSearchRef = ref<any>(null)
const handleCancel = () => {
  toSearch.value = false
  searchTeamName.value = ''
  window.scrollTo({ top: 0, behavior: 'smooth' })
}
</script>

<template>
  <div class="to-search-item" :class="{ 'to-search': toSearch }">
    <van-image v-show="!toSearch" width="24" height="24" :src="homeEaguescreeningIcon" @click="toSearch = true" />
    <template v-if="toSearch">
      <van-search
        ref="gameSearchRef"
        v-model="searchTeamName"
        :placeholder="$t('search_team')"
        :clear-icon="clearIcon"
      >
        <template #left-icon>
          <van-image width="16" height="16" :src="leftIcon" />
        </template>
      </van-search>
      <div v-if="toSearch" class="cancel" @click="handleCancel">
        {{ $t("cancel") }}
      </div>
    </template>
  </div>
</template>

<style scoped lang="scss">
.to-search {
  width: calc(100% - 32px) !important;
  :deep(.van-search) {
    width: calc(100% - 48px) !important;
  }
}
.to-search-item {
  width: 50%;
  flex-shrink: 0;
  transition: all 0.4s ease-in-out;
  display: flex;
  width: 148px;
  height: 36px;
  padding: 0 16px;
  overflow: hidden;
  align-items: center;

  :deep(.van-search) {
    background: rgba(255 255 255 / 10%);
    border-radius: 20px;
    padding: 0 0 0 5px;
    width: 100%;
    overflow: hidden;
  }

  :deep(.van-field__control) {
    font-size: 14px;
    color: #ffffff4c;
    font-weight: 400;
    caret-color: #fe5e00;
  }

  :deep(.van-search__content) {
    background: transparent;
  }

  :deep(.van-field__left-icon) {
    display: flex;
    margin-right: 10px;
  }

  ::placeholder {
    opacity: 0.3;
    font-size: 14px;
    color: #fff;
    font-weight: 400;
  }
  .cancel {
    width: 58px;
    font-size: 16px;
    color: #fff;
    text-align: right;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    font-weight: 500;
    animation: show 0.4s ease-in-out;
  }
  @keyframes show {
    0% {
      width: 0;
    }
    100% {
      width: 58px;
    }
  }
}
</style>

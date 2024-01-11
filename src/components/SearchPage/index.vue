<script lang="ts">
import { defineComponent } from 'vue'
import { storeToRefs } from 'pinia'
import searchImg from '@/assets/home/que_sousuo_02.png'
import { gameInfoStore } from '@/store/gameInfo'
export default defineComponent({
  name: 'SearchPage',
  props: {
    inputVal: {
      type: String,
      default: '',
    },
  },
  emits: ['onSearch'],
  setup(props: any, { emit }: any) {
    const { searchTeamName } = storeToRefs(gameInfoStore())
    const hotList = [
      '奥数大师之下夏',
      '热刺',
      'LMF',
      '夏季赛',
      'VCT韩国挑战者',
    ]
    const onClick = (value: string) => {
      emit('onSearch', value)
    }
    return { searchImg, searchTeamName, hotList, onClick }
  },
})
</script>

<template>
  <div class="search-page">
    <div class="page-content">
      <van-image :src="searchImg" width="234" height="234" />
      <div class="result">
        <p>{{ $t('searchTip1') }}{{ `“${searchTeamName}”` }}{{ $t('relatedInformation') }}</p>
        <p>{{ $t('go') }}<span>{{ $t('live_bet') }}</span>{{ $t('takeLook') }}</p>
      </div>
      <div class="hot">
        <div class="hot-title">
          <span />
          {{ $t('hotSearch') }}
        </div>
        <div class="hot-main">
          <span
            v-for="item in hotList"
            :key="item"
            :class="{ active: inputVal === item }"
            @click="onClick(item)"
          >{{ item }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.page-content {
  display: flex;
  align-items: center;
  flex-direction: column;

  .result {
    width: 100%;
    text-align: center;

    p {
      font-size: 14px;
      color: rgba(255 255 255 / 60%);
      font-weight: 400;

      > span {
        display: inline-block;
        position: relative;
        width: 56px;
        height: 24px;
        line-height: 24px;
        background-image: linear-gradient(90deg, #f16720 0%, #fd8908 94%);
        border-radius: 16px;
        color: #fff;
        margin: 0 3px;
      }
    }
  }

  .hot {
    width: calc(100% - 36px);

    &-title {
      font-size: 14px;
      color: #fff;
      font-weight: 500;

      span {
        display: inline-block;
        width: 2px;
        height: 12px;
        background: #fe5e00;
        border-radius: 1.5px;
        margin-right: 8px;
      }
    }

    &-main {
      margin-top: 12px;

      span {
        display: inline-block;
        background: rgb(255 255 255 / 4%);
        border-radius: 20px;
        opacity: 0.6;
        font-size: 12px;
        color: #fff;
        font-weight: 400;
        padding: 8px 16px;
        margin-right: 10px;
        margin-bottom: 12px;
      }

      .active {
        background: rgba(254 94 0 / 20%);
        color: #fe5e00;
      }
    }
  }
}
</style>

<script setup lang="ts" name="Preview">
import AginstDataCard from './components/AginstDataCard/index.vue'
import defaultIcon from '@/assets/home/default.png'
import home_liansai from '@/assets/matchData/home_liansai.png'
import closeIcon from '@/assets/matchData/shuju_spread.png'
import home_Sessions from '@/assets/matchData/home_Sessions.png'
import warning_01 from '@/assets/matchData/warning_01.png'
import { globalApiConfigStore } from '@/store/globalApiConfig'

const { matchDetailQuery } = storeToRefs(globalApiConfigStore())

const form = reactive({
  game_id: matchDetailQuery.value.game_id || '',
  match_num: 3,
  current_league_only: false,
})

const showWarn = ref(false)

const activeIndex = ref(0)
</script>

<template>
  <div class="preview" @click.stop>
    <van-tabs
      v-model:active="activeIndex"
      swipeable
      title-inactive-color="rgba(255,255,255,0.60)"
      title-active-color="#fff"
      class="van-tabs-pre"
      background="rgba(255,255,255,0.03)"
      color="#FE5E00"
      line-width="20px"
    >
      <template #nav-bottom>
        <div class="form-box">
          <div style="justify-content: space-between">
            <div class="match-num-label">
              <van-image
                height="24"
                width="24"
                style="margin: 0 8px 0 8px"
                :src="home_Sessions"
                class="show-image"
                :error-icon="defaultIcon"
                :show-loading="false"
              />
              <div>
                {{ $t('statistics') }}
              </div>
            </div>
            <div class="match-num-value">
              <div
                class="value-box"
                :class="{ 'value-active': +form.match_num === 3 }"
                @click="form.match_num = 3"
              >
                3
              </div>
              <div
                class="value-box"
                :class="{ 'value-active': +form.match_num === 6 }"
                @click="form.match_num = 6"
              >
                6
              </div>
              <div
                class="value-box"
                :class="{ 'value-active': +form.match_num === 10 }"
                @click="form.match_num = 10"
              >
                10
              </div>
              <van-image
                height="24"
                width="24"
                style="margin: 0 8px"
                :src="warning_01"
                class="show-image"
                :error-icon="defaultIcon"
                :show-loading="false"
                @click="showWarn = !showWarn"
              />
            </div>
          </div>
          <div>
            <div
              class="is-current"
              :class="{ 'is-current-only': form.current_league_only }"
              @click="form.current_league_only = !form.current_league_only"
            >
              <van-image
                height="24"
                width="24"
                style="margin-right: 8px"
                :src="home_liansai"
                class="show-image"
                :error-icon="defaultIcon"
                :show-loading="false"
              />
              {{ $t('current_league_only') }}
              <van-image
                v-if="form.current_league_only"
                height="16"
                width="16"
                style="margin-left: 4px"
                :src="closeIcon"
                class="show-image"
                :error-icon="defaultIcon"
                :show-loading="false"
              />
            </div>
          </div>
          <div v-if="showWarn" class="warning-box">
            <div>{{ $t('display_rules_1') }}</div>
            <div>
              {{ $t('display_rules_2') }}
            </div>
            <div>
              {{ $t('display_rules_3') }}
            </div>
            <div style="color: #fff">
              {{ $t('display_rules_4') }}
            </div>
            <div class="dev" />
            <div class="i-know" @click="showWarn = !showWarn">
              {{ $t('me_know') }}
            </div>
          </div>
        </div>
      </template>
      <van-tab :title="$t('recent_data')">
        <AginstDataCard :form="form" />
      </van-tab>
      <van-tab :title="$t('history_vs')">
        <AginstDataCard :form="form" :is-history="true" />
      </van-tab>
    </van-tabs>
  </div>
</template>

<style lang="scss">
.form-box {
  .warning-box {
    position: absolute;
    width: 260px;
    top: 82px;
    right: 0px;
    padding: 16px;
    background: #3b4045;
    border-radius: 8px;
    z-index: 9000;
    font-size: 12px;
    color: rgba(255, 255, 255, 0.6);
    overflow: hidden;
    height: unset !important;
    display: block;
    box-shadow: 0 0 2px rgba(0, 0, 0, 0.1);
    div {
      line-height: 18px;
    }
    .i-know {
      text-align: center;
      color: #FE5E00;
      font-size: 14px;
    }
    .dev {
     line-height: 1px;
     height: 1px;
     background: #ffffff;
     opacity: 0.06;
     border-radius: 1px;
     margin: 16px auto;
    }
  }
  .match-num-label {
    display: flex;
    align-items: center;
    font-size: 12px;
    color: rgba(255, 255, 255, 0.6);
    position: relative;
  }
  .match-num-value {
    display: flex;
    align-items: center;
    .value-box {
      padding: 0 13px;
      font-size: 12px;
      color: rgba(255, 255, 255, 0.6);
      font-weight: 600;
      & + .value-box {
        position: relative;
        &::before {
          content: "";
          width: 2px;
          border-radius: 2px;
          height: 10px;
          position: absolute;
          left: -1px;
          background-color: rgba(255, 255, 255, 0.11);
          top: 3px;
        }
      }
    }
    .value-active {
      color: #ffffff !important;
    }
  }
  & > div {
    height: 40px;
    display: flex;
    align-items: center;
    width: calc(100% - 32px);
    margin: auto;
  }
  .is-current {
    background: rgba(255, 255, 255, 0.04);
    border-radius: 15px;
    height: 28px;
    display: flex;
    align-items: center;
    padding: 0 8px;
    font-size: 12px;
    color: #ffffff;
    transition: all 0.2s ease-in-out;
  }
  .is-current-only {
    background: rgba(254, 94, 0, 0.2) !important;
    color: #fe5e00 !important;
  }
}
.preview {
  height: 100%;
  overflow: hidden;
}
.van-tabs-pre {
  height: 100%;
  .van-tabs__nav {
    background: rgba(255, 255, 255, 0.03) !important;
  }
  .van-tabs__content {
    height: calc(100% - 126px);
    .van-tab__panel {
      height: 100%;
    }
  }
}
</style>

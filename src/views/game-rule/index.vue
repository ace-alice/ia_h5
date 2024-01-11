<script setup lang="ts" name="GameRule">
import { useI18n } from 'vue-i18n'
import ruleHook from './ruleHook'
import HeadTitle from '@/components/HeadTitle/index.vue'
// import { getGameRuleApi } from '@/api/tools-api'
import { globalApiConfigStore } from '@/store/globalApiConfig'

const { showRule } = storeToRefs(globalApiConfigStore())

const { currentRules } = ruleHook()

const tabActive = ref(0)

const { t } = useI18n()

const ruleLabel = [
  { label: t('basic_rules'), com: 'rule0' },
  { label: t('settlement_rules'), com: 'rule1' },
  { label: t('live_rules'), com: 'rule2' },
  { label: t('parlay_rules'), com: 'rule3' },
  { label: t('play_rules'), com: 'rule4' },
]

const offTop = ref(document.body.clientWidth * 46 / 375)
const tabKey = ref(0)

watch(() => showRule.value, () => {
  setTimeout(() => {
    tabKey.value++
  }, 600)
})
</script>

<template>
  <van-popup
    v-model:show="showRule"
    class="bet-popup"
    position="right"
    close-on-popstate
  >
    <div :key="tabKey" class="game-rule-page">
      <van-sticky>
        <HeadTitle :title="$t('egame_rule')" />
      </van-sticky>
      <!-- @click-tab="tableClick" -->
      <van-tabs
        v-model:active="tabActive"
        animated
        sticky
        :offset-top="offTop"
        swipeable
        :ellipsis="false"
      >
        <template #nav-bottom>
          <div class="empty" />
        </template>
        <van-tab v-for="tab in ruleLabel" :key="tab.com" :title="tab.label">
          <component :is="currentRules[tab.com]" />
        </van-tab>
      </van-tabs>
    </div>
  </van-popup>
</template>

<style scoped lang="scss">
.game-rule-page {
  height: 100%;
  background: #262d34;
  overflow: auto;

  :deep(.van-tabs__nav) {
    align-items: center;
    background: #181c22;
    font-size: 14px;
    color: rgba(255 255 255 / 60%);
    font-weight: 400;
  }

  :deep(.van-tab--active) {
    span {
      font-size: 14px;
      color: #fff;
      font-weight: 500;
      opacity: 1;
    }
  }

  :deep(.van-tabs__line) {
    width: 20px;
    height: 3px;
    background: #fe5e00;
    border-radius: 1.5px;
  }

  :deep(.van-tab__text) {
    font-size: 14px;
    color: #fff;
    text-align: center;
    font-weight: 400;
    opacity: 0.6;
  }

  .empty {
    width: 100%;
    height: 8px;
    background: #0e1519;
  }

  .game-body {
    padding: 0 18px;
    margin: 0 auto 20px;
    height: calc(100% - 100px);
    overflow: auto;
    background: #181c22;

    .body-content {
      color: #fff9 !important;
    }
  }
}
</style>

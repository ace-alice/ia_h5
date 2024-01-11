<script setup lang="ts" name="LeagueDropdownMenu">
import { showToast } from 'vant'
import { useI18n } from 'vue-i18n'
import { gameInfoStore } from '@/store/gameInfo'
import activeIcon from '@/assets/home/com_choose_on.png'
import inactiveIcon from '@/assets/home/com_choose_nor.png'
import notifyIcon from '@/assets/home/pop_high.png'

const props = defineProps({
  gameId: {
    type: Number,
    default: 0,
  },
})

const emit = defineEmits(['change'])

const i18n = useI18n()

const { gameList } = storeToRefs(gameInfoStore())

const eventList = computed(() => {
  const theGame = gameList.value.find((game) => {
    return +game.id === +props.gameId
  })
  if (
    theGame
    && theGame.events_count
    && theGame.events_count?.events
    && Array.isArray(theGame.events_count?.events)
  ) {
    return theGame.events_count?.events
  }
  else {
    return []
  }
})

const checkboxRefs = ref<any[]>([])

const dropdownRef = ref<any>(null)

const checkboxGroup: any = ref(null)

const checked = ref<any[]>([])

watch(
  () => props.gameId,
  () => {
    checked.value = []
  },
)

watch(
  () => checked.value,
  () => {
    emit('change', checked.value)
  },
  { deep: true },
)

// 取消
const reset = () => {
  checked.value = []
  dropdownRef.value?.toggle()
}
// 确认
const confirm = () => {
  dropdownRef.value?.toggle()
}
const toggle = (item: any, index: number) => {
  if (!checked.value.includes(item.event_id)) {
    showToast({
      icon: notifyIcon,
      className: 'notify-content notify-color',
      message: `${item.event_name}    ${i18n.t('addedSuccessfully')}`,
    })
  }
  checkboxRefs.value[index]?.toggle()
}
const checkedAll = () => {
  if (checked.value.length === eventList.value?.length) {
    checkboxGroup.value.toggleAll()
  }
  else {
    showToast({
      icon: notifyIcon,
      className: 'notify-content notify-color',
      message: `${i18n.t('allAddedSuccessfully')}`,
    })
    checkboxGroup.value.toggleAll(true)
  }
}
</script>

<template>
  <van-dropdown-menu v-if="gameId !== 0" class="league-main-head">
    <van-dropdown-item ref="dropdownRef" :title="$t('filter')">
      <template #title>
        <div class="selected">
          <span>{{ $t("selected") }}</span>
          <span>{{ checked.length }}</span>
        </div>
        <div>{{ $t("filter") }}</div>
      </template>
      <van-checkbox-group ref="checkboxGroup" v-model="checked">
        <van-cell-group inset>
          <div class="van-cell van-cell-all" @click.stop="checkedAll">
            <div class="cell-top">
              <span>{{ $t("select_all") }}</span>
              <span>{{ eventList?.length }}</span>
            </div>
            <img
              class="check-image"
              :src="
                checked.length === eventList?.length ? activeIcon : inactiveIcon
              "
            >
          </div>
          <van-cell
            v-for="(item, index) in eventList"
            :key="index"
            clickable
            @click.stop="toggle(item, index)"
          >
            <template #title>
              <span
                :class="checked.includes(item.event_id) ? 'check-label' : ''"
              >{{ item.event_name }}</span>
            </template>
            <template #right-icon>
              <van-checkbox
                :ref="(el) => (checkboxRefs[index] = el)"
                :name="item.event_id"
                disabled
                @click.stop="toggle(item, index)"
              >
                <template #icon>
                  <span
                    class="check-num"
                    :class="
                      checked.includes(item.event_id) ? 'check-active' : ''
                    "
                  >{{ item.match_amount }}</span>
                  <img
                    class="check-image"
                    :src="
                      checked.includes(item.event_id)
                        ? activeIcon
                        : inactiveIcon
                    "
                  >
                </template>
              </van-checkbox>
            </template>
          </van-cell>
        </van-cell-group>
      </van-checkbox-group>
      <div class="checkButton">
        <span @click="reset">{{ $t("cancel") }}</span>
        <span @click="confirm">{{ $t("confirm") }}</span>
      </div>
    </van-dropdown-item>
  </van-dropdown-menu>
  <div v-else class="hot-match">
    {{ $t("hotMatches") }}
  </div>
</template>

<style lang="scss" scoped>
.hot-match {
  position: fixed;
  width: calc(100vw - 84px);
  top: 46px;
  left: 84px;
  right: 0;
  z-index: 1;
  width: 100%;
  height: 52px;
  line-height: 52px;
  background: #181c22;
  font-size: 14px;
  color: #ffffff;
  font-weight: 500;
  padding: 0 20px;
}
:deep(.van-dropdown-item) {
  width: calc(100vw - 84px);
  left: 84px;
  overflow: hidden;
  .van-overlay {
    backdrop-filter: blur(1px);
  }
  .van-dropdown-item__content {
    width: calc(100vw - 84px);
    left: 84px;
    background: #181c22;
  }
}
:deep(.van-checkbox-group) {
  max-height: 240px;
  overflow-y: auto;
  .check-label {
    color: #fff;
    font-size: 14px;
    // font-weight: 500;
  }
}

:deep(.van-checkbox-group) {
  max-height: 240px;
  overflow-y: auto;
}

:deep(.van-cell-group) {
  background: transparent;
  margin-left: 0;
  padding-top: 52px;
}

:deep(.van-cell) {
  background: transparent;
  text-align: left;
  color: rgba(255 255 255 / 60%);
  font-size: 14px;
  font-weight: 400;
  height: 46px;
  align-items: center;
}

:deep(.van-cell::after) {
  border-bottom: 0;
}

.van-cell-all {
  position: absolute;
  top: 12px;
  left: 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-family: PingFangSC-Regular;
  font-size: 14px;
  font-weight: 400;
  color: #fff !important;
  background: #181c22 !important;
  padding-right: 32px;
  z-index: 999;

  span:nth-child(2) {
    font-family: Gotham-Medium;
    margin-left: 18px;
  }
}

.check-image {
  width: 16px;
  height: 16px;
}

.check-num {
  font-size: 14px;
  font-weight: 500;
  color: rgba(255 255 255 / 60%);
  vertical-align: bottom;
  margin-right: 18px;
}

.check-active {
  color: #fe5e00;
}

:deep(.van-checkbox) {
  position: absolute;
  right: 16px;
  z-index: 99;
}

:deep(.van-cell__title) {
  span {
    float: left;
    width: 180px;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
}

.check-label {
  color: #fff;
  font-size: 14px;
}

.league-main-head {
  position: fixed;
  width: calc(100vw - 84px);
  top: 46px;
  left: 84px;
  right: 0;
  z-index: 1;
  &:deep(.van-dropdown-menu__bar) {
    width: 100%;
    height: 52px;
    background: rgba(38, 45, 52, 0.8);
    backdrop-filter: blur(50px);

    .van-dropdown-menu__item {
      .van-ellipsis {
        display: flex;
        width: 100%;
        justify-content: space-between;
      }
    }

    .van-dropdown-menu__title {
      font-size: 14px;
      color: #fff;
      font-weight: 500;
      padding: 0 16px;
      width: 100%;
      .selected {
        color: #fe5e00;

        span:nth-child(2) {
          margin-left: 18px;
        }
      }
    }
    .van-dropdown-menu__title::after {
      display: none;
    }
  }

  &-title {
    display: flex;
    width: 100%;
    justify-content: space-between;
    font-family: Gotham-Medium;
    font-size: 14px;
    text-align: center;
    font-weight: 500;

    div:nth-child(1) {
      color: #fe5e00;

      span:nth-child(2) {
        margin-left: 18px;
      }
    }

    div:nth-child(2) {
      font-size: 14px;
      color: #fff;
      font-weight: 500;
    }
  }
}
.checkButton {
  display: flex;
  height: 44px;
  width: 100%;
  border-top: 1px solid rgba(255 255 255 / 10%);

  span {
    display: flex;
    height: 44px;
    justify-content: center;
    align-items: center;
    width: 50%;
    font-size: 14px;
    font-weight: 400;
  }

  span:nth-child(1) {
    background: rgba(255 255 255 / 3%);
    color: rgba(255 255 255 / 60%);
  }

  span:nth-child(2) {
    background: rgba(254 94 0 / 20%);
    color: #fff;
  }
}
</style>

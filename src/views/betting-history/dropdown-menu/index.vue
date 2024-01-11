<script lang="ts">
import { reactive, ref, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { useRouter } from 'vue-router'
import dayjs from 'dayjs'
import DatePicker from '@/components/datePicker/index.vue'
import { gameInfoStore } from '@/store/gameInfo'
import dateIcon from '@/assets/home/find_ date_nor (2).png'
import { i18n } from '@/locale'
export default {
  name: 'DropdownMenu',
  components: { DatePicker },
  emits: ['search'],
  setup(props: any, { emit }: any) {
    const show = ref(true)
    const showDate = ref(true)
    const dateOps: any = ref({})
    const gameVal = ref(0)
    const typeVal = ref(0)
    const betVal = ref(0)
    const betTitle = ref(i18n.global.t('allBets'))
    const typeTitle = ref(i18n.global.t('allTypes'))
    const gameTitle = ref(i18n.global.t('allGames'))
    const allGameRef: any = ref(null)
    const allBetRef: any = ref(null)
    const allTypeRef: any = ref(null)
    const dateRef: any = ref(null)
    const { gameList } = storeToRefs(gameInfoStore())
    const router = useRouter()
    const formData = reactive({
      start_time: '',
      end_time: '',
      is_prize: -1, // 注单
      is_parlay: -1, // 类型
      game_type_id: -1, // 游戏
    }) as any
    // 注单
    const getprizeOptions = [
      {
        label: i18n.global.t('all'),
        value: -1,
      },
      {
        label: i18n.global.t('v_not_yet_settled'),
        value: 0,
      },
      {
        label: i18n.global.t('clearinged'),
        value: 1,
      },
    ]
    // 类型
    const betTypeOptions = [
      {
        label: i18n.global.t('all'),
        value: -1,
      },
      {
        label: i18n.global.t('single_bet'),
        value: 0,
      },
      {
        label: i18n.global.t('parlay_game'),
        value: 1,
      },
    ]
    const handleClick = (
      key: string | number,
      value: string | number,
      row: any,
    ) => {
      if (key === 'is_prize') {
        if (row.label === i18n.global.t('all')) {
          betTitle.value = i18n.global.t('allBets')
        }
        else {
          betTitle.value = row.label
        }
        allBetRef.value.toggle()
      }
      if (key === 'is_parlay') {
        if (row.label === i18n.global.t('all')) {
          typeTitle.value = i18n.global.t('allTypes')
        }
        else {
          typeTitle.value = row.label
        }
        allTypeRef.value.toggle()
      }
      if (key === 'game_type_id') {
        if (row.game_name === i18n.global.t('all')) {
          gameTitle.value = i18n.global.t('allGames')
        }
        else {
          gameTitle.value = row.game_name
        }
        allGameRef.value.toggle()
      }
      formData[`${key}`] = value
      emit('search', formData)
    }
    const onConfirm = (item: any) => {
      showDate.value = false
      if (item.length === 0) {
        dateOps.value = []
        formData.start_time = null
        formData.end_time = null
      }
      else {
        dateOps.value = item.map((dataValue: any, index: number) => {
          if (index === 0) {
            return dayjs.unix(dataValue).startOf('date').unix()
          }
          else {
            return dayjs.unix(dataValue).endOf('date').unix()
          }
        })
        if (item.length === 1) {
          dateOps.value.push(dayjs().endOf('date').unix())
        }
        formData.start_time = dateOps.value[0]
        formData.end_time = dateOps.value[1]
      }

      dateRef.value.toggle()
      emit('search', formData)
    }
    watch(() => router.currentRoute.value.name, (val: any) => {
      if (val !== 'BettingHistory') {
        dateRef.value.toggle(false)
        allGameRef.value.toggle(false)
        allBetRef.value.toggle(false)
        allTypeRef.value.toggle(false)
      }
    })
    return {
      dateIcon,
      show,
      showDate,
      dateRef,
      dateOps,
      gameList,
      formData,
      getprizeOptions,
      betTypeOptions,
      handleClick,
      onConfirm,
      gameVal,
      gameTitle,
      allGameRef,
      allBetRef,
      allTypeRef,
      typeVal,
      betVal,
      betTitle,
      typeTitle,
      dayjs,
    }
  },
}
</script>

<template>
  <div class="dropdown-menu">
    <van-dropdown-menu>
      <van-dropdown-item
        ref="dateRef"
        title-class="dropdown-menu-icon"
      >
        <template #title>
          <div class="dropdown-menu-icon-info">
            <img v-if="showDate" :src="dateIcon">
            <div v-else class="time-group">
              <div class="time-group-item">
                <span>{{ $t('rise') }}</span>
                <span v-if="dateOps[0]">{{ dayjs.unix(dateOps[0]).format('MM - DD') }}</span>
              </div>
              <div class="time-group-item">
                <span>{{ $t('hEnd') }}</span>
                <span v-if="dateOps[1]">{{ dayjs.unix(dateOps[1]).format('MM - DD') }}</span>
              </div>
            </div>
          </div>
        </template>
        <template #default>
          <div id="dropdownMain" class="dropdown-menu-time">
            <div class="title">
              {{ $t('selectLast30Days') }}
            </div>
            <DatePicker @on-confirm="onConfirm" />
          </div>
        </template>
      </van-dropdown-item>
      <van-dropdown-item ref="allBetRef">
        <template #title>
          <div :class="betTitle === $t('allBets') ? 'dropdown-title-now' : 'dropdown-title-active van-ellipsis'">
            {{ betTitle }}
          </div>
        </template>
        <template #default>
          <div class="dropdown-menu-empty" />
          <div class="dropdown-menu-main">
            <div class="dropdown-menu-main-title">
              {{ $t('betType') }}
            </div>
            <div class="dropdown-menu-main-type">
              <span
                v-for="item in getprizeOptions"
                :key="item.value"
                :class="{
                  'dropdown-active': formData.is_prize === item.value,
                }"
                @click.stop="handleClick('is_prize', item.value, item)"
              >{{ item.label }}</span>
            </div>
          </div>
        </template>
      </van-dropdown-item>
      <van-dropdown-item ref="allTypeRef">
        <template #title>
          <div :class="typeTitle === $t('allTypes') ? 'dropdown-title-now' : 'dropdown-title-active van-ellipsis'">
            {{ typeTitle }}
          </div>
        </template>
        <template #default>
          <div class="dropdown-menu-empty" />
          <div class="dropdown-menu-main">
            <div class="dropdown-menu-main-title">
              {{ $t('betType') }}
            </div>
            <div class="dropdown-menu-main-type">
              <span
                v-for="item in betTypeOptions"
                :key="item.value"
                :class="{
                  'dropdown-active': formData.is_parlay === item.value,
                }"
                @click.stop="handleClick('is_parlay', item.value, item)"
              >{{ item.label }}</span>
            </div>
          </div>
        </template>
      </van-dropdown-item>
      <van-dropdown-item ref="allGameRef">
        <template #title>
          <div :class="gameTitle === $t('allGames') ? 'dropdown-title-now' : 'dropdown-title-active van-ellipsis'">
            {{ gameTitle }}
          </div>
        </template>
        <template #default>
          <div class="dropdown-menu-empty" />
          <div class="dropdown-menu-game">
            <div class="dropdown-menu-main-title">
              {{ $t('allGames') }}
            </div>
            <div class="dropdown-menu-game-type">
              <span
                v-for="item in gameList"
                :key="item.id"
                :class="{
                  'dropdown-active': formData.game_type_id === item.id,
                }"
                @click.stop="handleClick('game_type_id', item.id, item)"
              >{{ item.game_name }}</span>
            </div>
          </div>
        </template>
      </van-dropdown-item>
    </van-dropdown-menu>
  </div>
</template>

<style lang="scss" scoped>
.dropdown-menu {
  background: #181c22;

  :deep(.van-dropdown-menu__item:nth-child(1)) {
    margin-left: -14px;
  }

  .dropdown-title-now {
    font-family: PingFangSC-Medium;
    font-size: 14px;
    letter-spacing: 0;
    font-weight: 500;
    width: 68px;
    text-align: right;
    color: rgba(255 255 255 / 60%);
  }

  .dropdown-title-active {
    font-family: PingFangSC-Medium;
    font-size: 14px;
    color: #fff;
    letter-spacing: 0;
    font-weight: 500;
    width: 68px;
    text-align: right;
  }

  :deep(.van-dropdown-menu__bar) {
    height: 40px;
    padding-right: 18px;
    background: #181c22;
  }

  :deep(.van-dropdown-menu__title) {
    color: #ccc;
    font-size: 14px;
    letter-spacing: 0;
    font-weight: 400;
  }

  :deep(.dropdown-menu-icon::after) {
    display: none;
  }

  :deep(.van-dropdown-menu__title::after) {
    width: 12px;
    height: 12px;
    border: 0;
    right: -6px;
    transform: rotate(0deg);
    background-image: url("../../../assets/home/Ct_ more_up.png");
    background-size: 100% 100%;
    background-repeat: no-repeat;
    margin-top: -6px;
  }

  :deep(.van-dropdown-menu__title--down::after) {
    transform: rotate(180deg);
  }

  .dropdown-menu-icon-info {
    display: flex;
    align-items: center;

    img {
      width: 24px;
      height: 24px;
    }

    .time-group {
      display: flex;
      flex-direction: column;

      &-item {
        height: 17px;
        line-height: 17px;

        span {
          font-family: PingFangSC-Medium;
          font-size: 12px;
          color: #fff;
          font-weight: 500;

          &:nth-child(2) {
            font-size: 12px;
            color: #fe5e00;
            font-weight: 500;
            margin-left: 6px;
          }
        }
      }
    }
  }

  &-time {
    background: #0e1519;
    padding-top: 8px;

    .title {
      text-align: center;
      height: 10.4vw;
      line-height: 10.4vw;
      background: rgba(255 255 255 / 10%);
      font-family: PingFangSC-Regular;
      font-size: 3.2vw;
      color: #fff;
      font-weight: 400;
    }
  }

  &-empty {
    width: 100%;
    height: 8px;
    background: #0e1519;
  }

  &-main {
    background: #181c22;
    padding: 18px 18px 10px;

    &-title {
      display: flex;
      font-size: 12px;
      color: #fff;
      text-align: center;
      font-weight: 400;
      padding-bottom: 5px;
    }

    &-type {
      display: flex;
      flex-flow: row wrap;
      margin-top: 12px;
      max-height: 136px;
      overflow: auto;

      span {
        display: flex;
        justify-content: center;
        align-items: center;
        width: 76px;
        height: 32px;
        background: rgba(255 255 255 / 4%);
        border-radius: 20px;
        font-size: 12px;
        color: rgba(255 255 255 / 60%);
        font-weight: 400;
        margin-right: 11px;
        margin-bottom: 8px;
      }

      span:nth-child(4n) {
        margin-right: 0;
      }

      .dropdown-active {
        background: rgba(254 94 0 / 20%);
        color: #fe5e00;
      }
    }
  }

  &-game {
    background: #181c22;
    box-shadow: inset 0 -16px 30px #181c22;
    padding: 18px 18px 10px;
    box-sizing: border-box;

    &-title {
      display: flex;
      font-size: 12px;
      color: #fff;
      text-align: center;
      font-weight: 400;
    }

    &-type {
      display: flex;
      flex-flow: row wrap;
      max-height: 124px;
      overflow: auto;
      margin-top: 12px;

      span {
        display: flex;
        justify-content: center;
        align-items: center;
        padding: 0 16px;
        height: 32px;
        background: rgba(255 255 255 / 4%);
        border-radius: 20px;
        font-size: 12px;
        color: rgba(255 255 255 / 60%);
        font-weight: 400;
        margin-right: 11px;
        margin-bottom: 8px;
      }

      span:nth-child(4n) {
        margin-right: 0;
      }

      .dropdown-active {
        background: rgba(254 94 0 / 20%);
        color: #fe5e00;
      }
    }
  }
}
</style>

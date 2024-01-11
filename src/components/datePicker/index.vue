<!-- eslint-disable @typescript-eslint/no-use-before-define -->
<script lang="ts">
import { defineComponent, ref } from 'vue'
import dayjs from 'dayjs'
import isBetween from 'dayjs/plugin/isBetween'
import MonthItem from './components/MonthItem.vue'
import timeLf from '@/assets/home/time_left.png'
import timeRi from '@/assets/home/time_right.png'
import { i18n } from '@/locale'
dayjs.extend(isBetween)

interface DayListType {
  text: number
  value: number
  disabled: boolean
}
export default defineComponent({
  name: 'DatePicker',
  emits: ['onConfirm'],
  setup(props: any, { emit }) {
    const weeksOption = [i18n.global.t('week_days'), i18n.global.t('one'), i18n.global.t('two'),
      i18n.global.t('three'), i18n.global.t('four'), i18n.global.t('five'), i18n.global.t('six')]

    const selectData = ref<number[]>([])

    const currentDate = ref(dayjs())

    const dayList = computed(() => {
      const list: DayListType[] = []
      const daysOff = currentDate.value.date(1).day()
      for (let i = 0; i < daysOff; i++) {
        list.push({
          text: 0,
          value: 0,
          disabled: false,
        })
      }
      const dayNums = currentDate.value.daysInMonth()
      for (let i = 1; i <= dayNums; i++) {
        list.push({
          text: i,
          value: currentDate.value.date(i).unix(),
          disabled: !currentDate.value.date(i).isBetween(dayjs().subtract(90, 'day').startOf('date'), dayjs().endOf('date')),
        })
      }
      return list
    })

    const selectDataValue = computed(() => selectData.value.sort())

    const currentYearMonth = computed(() => {
      return currentDate.value.format('YYYY-MM')
    })

    const reset = () => {
      selectData.value = []
      emit('onConfirm', [])
    }
    const onConfirm = () => {
      emit('onConfirm', selectDataValue.value)
    }

    const prevDisabled = computed(() => {
      return dayList.value.filter((dayValue) => {
        return dayValue.value
      })[0]?.disabled || false
    })

    const nextDisabled = computed(() => {
      return dayList.value[dayList.value.length - 1]?.disabled || false
    })

    const prev = () => {
      if (!prevDisabled.value) {
        currentDate.value = currentDate.value.month(currentDate.value.month() - 1)
      }
    }
    const next = () => {
      if (!nextDisabled.value) {
        currentDate.value = currentDate.value.month(currentDate.value.month() + 1)
      }
    }

    function selectDateEmit(dayValue: number) {
      if (selectData.value.length < 2 && !selectData.value.includes(dayValue)) {
        return selectData.value.push(dayValue)
      }
      if (selectData.value.length === 2) {
        selectData.value = []
        selectData.value.push(dayValue)
      }
    }

    return {
      timeLf,
      timeRi,
      next,
      prev,
      reset,
      onConfirm,
      weeksOption,
      dayList,
      selectDataValue,
      currentYearMonth,
      prevDisabled,
      nextDisabled,
      selectDateEmit,
    }
  },
})
</script>

<template>
  <div class="date-picker">
    <div class="calendar-header">
      <div class="time">
        <span>{{ currentYearMonth }}</span>
      </div>
      <div class="expand">
        <van-image :class="{ 'expand-disabled': prevDisabled }" :src="timeLf" @click="prev" />
        <van-image :class="{ 'expand-disabled': nextDisabled }" :src="timeRi" @click="next" />
      </div>
    </div>
    <div class="calendar-content">
      <ul class="week">
        <li v-for="week in weeksOption" :key="week">
          {{ week }}
        </li>
      </ul>
      <MonthItem :day-list="dayList" :select-data="selectDataValue" @selectDate="selectDateEmit" />
    </div>
    <div class="calendar-footer">
      <span @click="reset">{{ $t('cancel') }}</span>
      <span @click="onConfirm">{{ $t('confirm') }}</span>
    </div>
  </div>
</template>

<style scoped lang="scss">
.date-picker {
  background: #181c22;
  padding-top: 26px;

  .calendar-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 28px;

    .time {
      font-family: PingFangSC-Semibold;
      font-size: 16px;
      color: #fff;
      line-height: 24px;
      font-weight: 600;
    }

    .expand {
      display: flex;
      align-items: center;

      :deep(.van-image) {
        width: 24px;
        height: 24px;
      }

      :deep(.van-image:nth-child(1)) {
        margin-right: 8px;
      }
    }
  }

  .calendar-content {
    padding: 0 28px;

    .week {
      overflow: hidden;
      margin: 8px auto 14px;

      li {
        width: 32px;
        height: 18px;
        line-height: 18px;
        text-align: center;
        float: left;
        margin-right: 15px;
        font-size: 13px;
        color: #ebebf54c;
        font-weight: 600;

        &:nth-of-type(7) {
          margin-right: 0;
        }
      }
    }
  }

  .calendar-footer {
    display: flex;
    align-items: center;
    border-top: 1px solid rgb(255 255 255 / 6%);
    margin-top: 12px;

    > span {
      display: inline-block;
      width: 50%;
      height: 46px;
      line-height: 46px;
      text-align: center;
      font-size: 14px;
      font-weight: 400;

      &:nth-child(1) {
        font-family: PingFangSC-Regular;
        color: rgba(255 255 255 / 60%);
        background: rgb(255 255 255 / 3%);
      }

      &:nth-child(2) {
        font-family: PingFangSC-Regular;
        color: #fff;
        background: rgb(254 94 0 / 20%);
      }
    }
  }

  .expand-disabled {
    opacity: 0.4;
  }
}
</style>

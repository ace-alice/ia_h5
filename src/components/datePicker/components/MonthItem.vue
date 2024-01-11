<script lang="ts" setup name="MonthItem">
import type { PropType } from 'vue'

const props = defineProps({
  dayList: {
    type: Array as PropType<any[]>,
    default: () => [],
  },
  selectData: {
    type: Array as PropType<number[]>,
    default: () => [],
  },
})

const emit = defineEmits(['selectDate'])
function selectDate(dayValue: any) {
  if (!dayValue.disabled) {
    emit('selectDate', dayValue.value)
  }
}
</script>

<template>
  <div class="month-box">
    <div
      v-for="(dayValue, index) in dayList"
      :key="index"
      class="day-box"
      :class="{
        'start-box': selectData[0] && selectData[0] === dayValue.value,
      }"
    >
      <div
        :end-text="$t('hEnd')"
        :start-text="$t('rise')"
        :class="{
          'checked-bg':
            selectData.length === 2
            && dayValue.value <= selectData[1]
            && dayValue.value >= selectData[0],
          'disabled': dayValue.disabled,
          'radius-left': index % 7 === 0,
          'radius-right': index % 7 === 6,
          'start': selectData[0] && selectData[0] === dayValue.value,
          'end': selectData[1] && selectData[1] === dayValue.value,
        }"
        @click="selectDate(dayValue)"
      >
        <div>
          {{ dayValue.text || "" }}
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.month-box {
  display: flex;
  flex-wrap: wrap;

  .day-box {
    flex-shrink: 0;
    width: calc(100% / 7);
    margin: 6px 0;
    text-align: center;
    line-height: 32px;
    font-size: 16px;
    color: #ebebf599;
    font-weight: 400;

    & > div {
      width: 100%;
      display: flex;
      justify-content: center;
    }
  }

  .start-box {
    display: flex;
    justify-content: flex-end;
  }

  .disabled {
    color: #ebebf533;
  }

  .checked-bg {
    background: rgba(254, 94, 0, 0.2);

    span {
      color: #fff !important;
      opacity: 1;
    }
  }

  .start {
    border-top-left-radius: 16px;
    border-bottom-left-radius: 16px;
    color: #ff3b30 !important;
    width: calc(50% + 16px) !important;
    justify-content: flex-start !important;

    & > div {
      background-color: rgba(254, 94, 0, 0.2);
      width: 32px;
      border-radius: 50%;
    }

    position: relative;

    &::before {
      content: attr(start-text);
      position: absolute;
      top: -4px;
      width: 20px;
      right: -12px;
      font-family: PingFangSC-Regular;
      font-size: 12px;
      color: #fe5e00;
      text-align: center;
      font-weight: 400;
    }

    &::after {
      content: ".";
      position: absolute;
      bottom: 16px;
      right: -4px;
      font-size: 32px;
      color: #fe5e00;
      text-align: center;
      font-weight: 400;
      line-height: 2px;
    }
  }

  .end {
    border-top-right-radius: 16px;
    border-bottom-right-radius: 16px;
    color: #ff3b30 !important;
    width: calc(50% + 16px) !important;
    justify-content: flex-end !important;

    & > div {
      background-color: rgba(254, 94, 0, 0.2);
      width: 32px;
      border-radius: 50%;
    }

    position: relative;

    &::before {
      content: attr(end-text);
      position: absolute;
      top: -4px;
      width: 20px;
      right: -18px;
      font-family: PingFangSC-Regular;
      font-size: 12px;
      color: #fe5e00;
      text-align: center;
      font-weight: 400;
    }

    &::after {
      content: ".";
      position: absolute;
      bottom: 16px;
      right: -12px;
      font-size: 32px;
      color: #fe5e00;
      text-align: center;
      font-weight: 400;
      line-height: 2px;
    }
  }

  .radius-left {
    border-top-left-radius: 16px;
    border-bottom-left-radius: 16px;
  }

  .radius-right {
    border-top-right-radius: 16px;
    border-bottom-right-radius: 16px;
  }
}
</style>

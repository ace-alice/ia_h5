<script lang="ts" setup name="SoftKeyboard">
import keyboardDelete from '@/assets/home/keyboard_delete.png'

const props = defineProps({
  moneyMax: {
    type: Number,
    default: 0,
  },
  moneyMin: {
    type: Number,
    default: 0,
  },
  value: {
    type: Number,
    default: 0,
  },
  show: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['change', 'confirm'])

const cValue = ref('')

watch(
  () => props.value,
  (newVal) => {
    cValue.value = String(newVal)
  },
)

watch(
  () => cValue.value,
  (newVal) => {
    emit('change', Number(newVal) || 0)
  },
)

function addValue(av: number, isMax: boolean) {
  if (isMax) {
    cValue.value = String(av)
  }
  else {
    const amount = Number.isNaN(Number(cValue.value || 0))
      ? av
      : Number(cValue.value || 0) + av
    cValue.value = String(
      props.moneyMax < amount ? Math.floor(props.moneyMax) : amount,
    )
  }
}

function changeValue(cv: string, isH = false) {
  if (isH && !cValue.value) {
    return
  }
  const amount = Number(`${cValue.value}${cv}`)
  cValue.value = String(
    props.moneyMax < amount ? Math.floor(props.moneyMax) : amount,
  )
}

function delValue() {
  cValue.value = String(
    Math.floor(
      (Number.isNaN(Number(cValue.value || 0))
        ? 0
        : Number(cValue.value || 0)) / 10,
    ),
  )
}

function confirm() {
  emit('confirm')
  if (props.value && props.value < props.moneyMin) {
    emit('change', props.moneyMin)
  }
  if (props.value && props.value > props.moneyMax) {
    emit('change', props.moneyMax)
  }
}

const leftKey = [
  { label: '+10', value: 10, isMax: false },
  { label: '+100', value: 100, isMax: false },
  { label: '+500', value: 500, isMax: false },
  { label: 'MAX', value: props.moneyMax, isMax: true },
]

const enterKey = [
  { label: '1', value: '1' },
  { label: '2', value: '2' },
  { label: '3', value: '3' },
  { label: '4', value: '4' },
  { label: '5', value: '5' },
  { label: '6', value: '6' },
  { label: '7', value: '7' },
  { label: '8', value: '8' },
  { label: '9', value: '9' },
  { label: '00', value: '00', isH: true },
  { label: '0', value: '0', isH: true },
  { label: '000', value: '000', isH: true },
]
</script>

<template>
  <div class="soft-keyboard" :class="{ show }">
    <div class="key-left">
      <div
        v-for="leftK in leftKey"
        :key="leftK.label"
        @click.stop="addValue(leftK.value, leftK.isMax)"
      >
        {{ leftK.label }}
      </div>
    </div>
    <div class="key-enter">
      <div
        v-for="(enterK, index) in enterKey"
        :key="enterK.label"
        :class="{ 'has-top': index > 2 }"
        @click.stop="changeValue(enterK.value, enterK.isH)"
      >
        {{ enterK.label }}
      </div>
    </div>
    <div class="key-right">
      <div @click.stop="delValue">
        <img :src="keyboardDelete" alt="">
      </div>
      <div @click.stop="confirm">
        {{ $t("confirm") }}
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.show {
  height: 186px !important;
  padding: 8px 8px !important;
}
.custome-key {
  border-radius: 4px;
  height: 42px;
  line-height: 42px;
  text-align: center;
  font-family: PingFangSC-Medium;
  font-size: 16px;
  color: #ffffff;
  font-weight: 500;
  &:active {
    background: rgba(255, 255, 255, 0.4);
  }
}
.soft-keyboard {
  display: flex;
  background: #262d34;
  height: 0;
  width: calc(100% - 16px);
  overflow: hidden;
  padding: 0 8px;
  transition: all 0.15s ease-in-out;
  .key-left {
    flex-shrink: 0;
    margin-right: 6px;
    & > div {
      background: rgba(255, 255, 255, 0.1);
      width: 60px;
      @extend .custome-key;
      & + div {
        margin-top: 6px;
      }
    }
  }
  .key-enter {
    flex-grow: 1;
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
    & > div {
      width: calc(100% / 3 - 4px);
      background: rgba(255, 255, 255, 0.2);
      @extend .custome-key;
    }
    .has-top {
      margin-top: 6px;
    }
  }
  .key-right {
    margin-left: 6px;
    display: flex;
    flex-direction: column;
    img {
      height: 24px;
      width: 24px;
    }
    & > div {
      background: rgba(255, 255, 255, 0.1);
      width: 60px;
      display: flex;
      justify-content: center;
      align-items: center;
      overflow: hidden;
      white-space: pre-wrap;
      word-break: break-all;
      &:nth-child(1) {
        @extend .custome-key;
        margin-bottom: 6px;
      }
      &:nth-child(2) {
        flex-grow: 1;
        font-family: PingFangSC-Medium;
        font-size: 16px;
        color: #ffffff;
        font-weight: 500;
        &:active {
          background: rgba(255, 255, 255, 0.4);
        }
        border-radius: 4px;
      }
    }
  }
}
</style>

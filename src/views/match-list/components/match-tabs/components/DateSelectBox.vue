<script setup lang="ts" name="DateSelectBox">
const props = defineProps({
  weekDateOptions: {
    type: Object,
    default: () => {
      return {}
    },
  },
  currentDate: {
    type: [String, Number],
    default: '',
  },
})

const emit = defineEmits(['change'])

const handicap = inject('handicap', 'today')

function changeCurrentDate(item: any) {
  emit('change', item)
}

const bodyEle: any = document.querySelector('#match-nav-bottom')
</script>

<template>
  <Teleport :to="bodyEle">
    <div class="DateSelectBox">
      <div class="time-list">
        <template v-for="item in weekDateOptions" :key="item.label">
          <div
            v-show="handicap !== 'fix' || !item.isToday"
            class="time-item"
            :class="{ active: currentDate === item.dataValue }"
            @click="changeCurrentDate(item)"
          >
            <div class="label">
              {{ item.label }}
            </div>
            <div class="value">
              {{ item.data }}
            </div>
          </div>
        </template>
      </div>
    </div>
  </Teleport>
</template>

<style lang="scss" scoped>
:deep(.van-sticky){
  transform: none !important;
}
.DateSelectBox {
  width: 100%;
  flex-shrink: 0;
  background: #181c22;
  border-radius: 8px;
  padding-bottom: 12px;
  .time-list {
    display: flex;
    width: calc(100% - 32px);
    margin: auto;
    justify-content: space-evenly;
    background: #262d34;
    border-radius: 16px;
    height: 54px;
    align-items: center;
    color: #ffffff;
    font-size: 14px;
    .time-item {
      text-align: center;
      transition: all 0.2s ease-in-out;
      .label {
        opacity: 0.6;
        font-weight: 200;
      }
      .value {
        position: relative;
        font-family: Gotham-Medium;
        margin-top: 2px;
        font-weight: 500;
        transition: all 0.2s ease-in-out;
      }
    }
    .active {
      .label,
      .value {
        transform: scale(1.05) translateY(2px);
        font-weight: 400;
        opacity: 1;
      }
      .value {
        color: #FE5E00;
      }
    }
  }
}
</style>

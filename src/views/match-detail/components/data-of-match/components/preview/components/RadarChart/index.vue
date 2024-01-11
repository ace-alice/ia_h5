<script setup lang="ts" name="AginstRadarChart">
import type { PropType } from 'vue'
import * as echarts from 'echarts'
import { useI18n } from 'vue-i18n'
import nearDataHook from '@/hooks/nearDataHook'
import home_shujudown from '@/assets/matchData/home_shujudown.png'
import defaultIcon from '@/assets/home/default.png'

const props = defineProps({
  dataBase: {
    type: Array as PropType<any[]>,
    default: () => [],
  },
  teamInfo: {
    type: Array as PropType<any[]>,
    default: () => [],
  },
})

const emit = defineEmits(['toCurrentTopEmit'])

const gameType: any = inject('gameType', 1)

const { useTemplate } = nearDataHook(gameType.value)

function setDominant(team1: number, team2: number) {
  if (team1 > team2) {
    return 0
  }
  else if (team1 < team2) {
    return 1
  }
  else {
    return -1
  }
}

const { t } = useI18n()

function dealData(index: number, temp: any): any[] {
  if (
    props.dataBase.length !== 2
    || !props.dataBase[index]
    || !Object.keys(props.dataBase[index]).includes(temp.data_key)
  ) {
    return [0, t('none')]
  }
  const dataC1 = Number(props.dataBase[0][temp.data_key]) || 0
  const dataC2 = Number(props.dataBase[1][temp.data_key]) || 0
  const dataC = Number(props.dataBase[index][temp.data_key]) || 0
  if (temp) {
    if (temp.is_percentage) {
      return [Math.floor(dataC * 100), `${Math.floor(dataC * 100)}%`]
    }
    else if (temp.is_time) {
      return [
        Math.floor((dataC / (dataC1 + dataC2)) * 100),
        `${Math.floor(dataC / 60)}'${Math.floor(dataC % 60)}`,
      ]
    }
    else {
      return [
        Math.floor((dataC / (dataC1 + dataC2)) * 100),
        Number(dataC.toFixed(1)),
      ]
    }
  }
  else {
    return [0, 0]
  }
}

const displayData = computed(() => {
  if (!useTemplate.value) {
    return []
  }
  return useTemplate.value.map((temp: any) => {
    const data1 = dealData(0, temp)
    const data2 = dealData(1, temp)
    return Object.assign({}, temp, {
      dominant_index: setDominant(data1[0], data2[0]),
      team1: data1[0],
      team2: data2[0],
      team1_value: data1[1],
      team2_value: data2[1],
    })
  })
})

const chartContainerRef = ref<HTMLDivElement | any>()

const myChart: any = ref<echarts.ECharts | undefined>()
// const app = {}

const option = ref({})

onMounted(() => {
  nextTick(() => {
    const indicator = []
    const avidData = displayData.value.filter((data: any) => {
      return data.team1_value !== -1 && data.team2_value !== -1 && data.is_percentage
    })
    for (let i = 0; i < avidData.length; i++) {
      indicator.push({
        text: `${avidData[i].data_name}`,
        max: 100,
        min: -50,
      })
    }
    myChart.value = echarts.init(chartContainerRef.value)
    option.value = {
      color: ['rgba(49,168,255,0.40)', 'rgba(158,39,56,1)'],
      tooltip: {
        trigger: 'axis',
      },
      legend: {
        show: false,
      },
      radar: [
        {
          indicator,
          center: ['50%', '56%'],
          radius: 66,
          shape: 'circle',
          splitArea: {
            areaStyle: {
              color: [
                'rgba(255, 255, 255, 0.05)',
                'rgba(255, 255, 255, 0)',
                'rgba(255, 255, 255, 0.05)',
                'rgba(255, 255, 255, 0)',
              ],
            },
          },
          axisLine: {
            lineStyle: {
              color: 'rgba(255, 255, 255, 0.2)',
            },
          },
          splitLine: {
            lineStyle: {
              color: 'rgba(255, 255, 255, 0.2)',
              shadowBlur: 10,
            },
          },
          axisName: {
            color: 'rgba(255,255,255,0.60)',
          },
        },
      ],
      series: [
        {
          type: 'radar',
          data: [
            {
              name: props.teamInfo[0]?.abbr || '',
              value: avidData.map((data: any) => +data.team1 || 0),
              symbol: 'none',
              areaStyle: {
                color: 'rgba(49,168,255,0.40)',
              },
              lineStyle: {
                color: 'rgba(49,168,255,0)',
                cap: 'round',
              },
            },
            {
              name: props.teamInfo[1]?.abbr || '',
              value: avidData.map((data: any) => +data.team2 || 0),
              symbol: 'none',
              lineStyle: {
                type: 'dashed',
                cap: 'round',
              },
              areaStyle: {
                color: '#00000000',
              },
            },
          ],
        },
      ],
    }

    if (option.value && typeof option.value === 'object') {
      myChart.value.setOption(option.value)
    }
    window.addEventListener('resize', myChart.resize)
  })
})
onUnmounted(() => {
  window.removeEventListener('resize', myChart.resize)
})

function toCurrentTop() {
  emit('toCurrentTopEmit')
}
</script>

<template>
  <div class="aginst-radar-chart-min">
    <div class="data-header">
      <div class="header-label">
        数据对比
      </div>
      <van-image
        :src="home_shujudown"
        height="24"
        width="24"
        :error-icon="defaultIcon"
        :show-loading="false"
        style="margin-right: 16px"
        @click="toCurrentTop"
      />
    </div>
    <div
      id="chartContainerRef"
      ref="chartContainerRef"
      style="height: 260px; width: 80%; margin: auto"
    />
  </div>
</template>

<style lang="scss" scoped>
.aginst-radar-chart-min {
  width: 100%;
  margin: 0 auto;
  position: relative;
  .data-header {
    background: rgba(255, 255, 255, 0.04);
    height: 40px;
    width: 100%;
    margin: 0 auto;
    display: flex;
    align-items: center;
    justify-content: space-between;
    .header-label {
      font-size: 14px;
      color: #ffffff;
      display: flex;
      align-items: center;
      &::before {
        content: "";
        width: 2px;
        height: 12px;
        background: #fe5e00;
        margin: 0 16px;
        border-radius: 2px;
      }
    }
  }
}
</style>

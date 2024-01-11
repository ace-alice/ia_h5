<script setup lang="ts" name="AginstDataCard">
import DataComparison from '../DataComparison/index.vue'
import RadarChart from '../RadarChart/index.vue'
import GameRecord from '../GameRecord/index.vue'
import {
  getAntBeforeGameDataApi,
  getAntBeforeGameHistoryDataApi,
} from '@/api/ant-match-info'

const props = defineProps({
  form: {
    type: Object,
    default: () => {
      return {
        match_num: 3,
        current_league_only: false,
      }
    },
  },
  isHistory: {
    type: Boolean,
    default: false,
  },
})

provide('isHistory', props.isHistory)

const aginstData = ref<any>({})

const init = ref(false)

const api = props.isHistory
  ? getAntBeforeGameHistoryDataApi
  : getAntBeforeGameDataApi

function getMatchData() {
  api(props.form).then((res: any) => {
    if (+res.data.code === 1 && res.data.data.match_id && res.data.data.teams) {
      aginstData.value = res.data.data
      init.value = true
    }
  })
}

watch(
  () => props.form,
  () => {
    getMatchData()
  },
  { deep: true },
)

const overviewData = computed(() => {
  if (
    aginstData.value.match_id
    && aginstData.value.teams
    && aginstData.value.teams.length === 2
  ) {
    return [
      aginstData.value.teams[0].stats || {},
      aginstData.value.teams[1].stats || {},
    ]
  }
  else {
    return []
  }
})

const teamInfo = computed(() => {
  if (
    aginstData.value.match_id
    && aginstData.value.teams
    && aginstData.value.teams.length === 2
  ) {
    return [
      aginstData.value.teams[0].team || {},
      aginstData.value.teams[1].team || {},
    ]
  }
  else {
    return [{}, {}]
  }
})

const isDown = ref(false)

const aginstDataCardRef = ref<HTMLDivElement>()

const aginstDataCardBoxRef = ref<HTMLDivElement>()

const cardLeftRef = ref<HTMLDivElement>()

const gameRecordRef = ref<HTMLDivElement>()

const aginstRadarChart = ref<HTMLDivElement>()

const cuurentTop = ref(0)

function scrollHandle(e: any) {
  cuurentTop.value = e.target.scrollTop
  if (aginstDataCardBoxRef.value && aginstDataCardRef.value) {
    const offSet
      = aginstDataCardBoxRef.value.clientHeight
      - aginstDataCardRef.value.clientHeight
    if (offSet - e.target.scrollTop < 10) {
      isDown.value = true
    }
    else {
      isDown.value = false
    }
  }
}

function toNext() {
  if (cardLeftRef.value && aginstDataCardRef.value) {
    aginstDataCardRef.value.scrollTo({
      top: cardLeftRef.value.clientHeight || 0,
      behavior: 'smooth',
    })
  }
}

function toNextOrCurrent() {
  const offset = cardLeftRef.value?.clientHeight || 0
  if (cuurentTop.value - offset > -5) {
    if (aginstDataCardRef.value) {
      const toTop
        = (cardLeftRef.value?.clientHeight || 0)
        + (gameRecordRef.value?.clientHeight || 0)
      aginstDataCardRef.value.scrollTo({
        top: toTop,
        behavior: 'smooth',
      })
    }
  }
  else {
    if (aginstDataCardRef.value) {
      aginstDataCardRef.value.scrollTo({
        top: cardLeftRef.value?.clientHeight || 0,
        behavior: 'smooth',
      })
    }
  }
}

function toCurrentTop() {
  if (isDown.value && aginstDataCardRef.value) {
    aginstDataCardRef.value.scrollTo({
      top: 0,
      behavior: 'smooth',
    })
  }
  if (!isDown.value && aginstDataCardRef.value && aginstDataCardBoxRef.value) {
    const offSet
      = aginstDataCardBoxRef.value.clientHeight
      - aginstDataCardRef.value.clientHeight

    aginstDataCardRef.value.scrollTo({
      top: offSet || 0,
      behavior: 'smooth',
    })
  }
}

onMounted(() => {
  getMatchData()
})
</script>

<template>
  <div ref="aginstDataCardRef" class="aginst-data-card" @scroll="scrollHandle">
    <div ref="aginstDataCardBoxRef" class="aginst-data-card-box">
      <div ref="cardLeftRef" class="card-comparison">
        <DataComparison
          :data-base="overviewData"
          :team-info="teamInfo"
          @next-emit="toNext"
        />
      </div>
      <div ref="gameRecordRef" class="card-comparison">
        <GameRecord
          :aginst-data="aginstData"
          :team-info="teamInfo"
          @to-current-top-emit="toNextOrCurrent"
        />
      </div>
      <div ref="aginstRadarChart" class="card-comparison">
        <RadarChart
          v-if="overviewData.length > 0"
          :data-base="overviewData"
          :team-info="teamInfo"
          @to-current-top-emit="toCurrentTop"
        />
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.aginst-data-card {
  height: 100%;
  width: 100%;
  overflow: auto;
  .aginst-data-card-box {
    width: 100%;
    .card-comparison {
      width: 100%;
    }
  }
}
</style>

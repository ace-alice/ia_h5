<script lang="ts" setup name="NearDataItem">
const prop = defineProps({
  dataInfo: {
    type: Object,
    default: () => {},
  },
})
</script>

<template>
  <div class="near-data-item">
    <div class="team-value left-value">
      {{ dataInfo.team1_value }}
    </div>
    <div class="progress left-progress">
      <div
        class="progress-value"
        :style="{ width: `${dataInfo.team1}%` }"
        :class="{ dominant_0_color: dataInfo.dominant_index === 0 }"
      />
    </div>
    <div class="data-label">
      {{ dataInfo.data_name }}
    </div>
    <div class="progress">
      <div
        class="progress-value"
        :style="{ width: `${dataInfo.team2}%` }"
        :class="{ dominant_1_color: dataInfo.dominant_index === 1 }"
      />
    </div>
    <div class="team-value right-value">
      {{ dataInfo.team2_value }}
    </div>
  </div>
</template>

<style lang="scss" scoped>
.near-data-item {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 20px;
  .team-value {
    font-size: 12px;
    color: #ffffff;
    width: 40px;
    flex-shrink: 0;
  }
  .left-value {
    margin-right: 6px;
    text-align: right;
  }
  .right-value {
    margin-left: 6px;
  }
  .data-label {
    flex-shrink: 0;
    width: 64px;
    padding: 0 6px;
    font-size: 12px;
    opacity: 0.6;
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
    text-align: center;
  }
  .left-progress {
    .progress-value {
      right: 0;
      background-image: linear-gradient(270deg, #9b9b9b 0%, #d8d8d8 100%);
    }
  }
  .progress {
    background: rgba(0, 0, 0, 0.4);
    border-radius: 4px;
    height: 6px;
    flex-grow: 1;
    position: relative;
    .progress-value {
      background-image: linear-gradient(270deg, #d8d8d8 0%, #9b9b9b 100%);
      border-radius: 4px;
      height: 6px;
      position: absolute;
      transition: all 1s ease-in-out;
    }
    .dominant_0_color {
      background-image: linear-gradient(
        270deg,
        #2390e2 2%,
        #6fcfe5 100%
      ) !important;
    }
    .dominant_1_color {
      background-image: linear-gradient(
        270deg,
        #ea7460 1%,
        #c50138 100%
      ) !important;
    }
  }
}
</style>

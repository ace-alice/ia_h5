<script lang="ts">
import err404Icon from '@/assets/home/que_404.png'
export default {
  name: 'NotFind404',
  components: {},
  props: {},
  setup() {
    return {
      err404Icon,
    }
  },
}
</script>

<template>
  <div class="not-find-404">
    <img :src="err404Icon">
    <span class="tip">{{ $t('error_info_2') }}</span>
    <div class="ip">
      您的IP来自：
      <span>122.122.122.122</span>
      (国家归属地)
    </div>
  </div>
</template>

<style lang="scss" scoped>
.not-find-404 {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  img {
    width: 234px;
    height: 234px;
    margin-top: 200px;
  }

  .tip {
    font-size: 12px;
    color: rgba(255 255 255 / 60%);
    letter-spacing: 0;
    font-weight: 400;
  }

  .ip {
    font-size: 12px;
    color: rgba(255 255 255 / 60%);
    letter-spacing: 0;
    line-height: 34px;
    font-weight: 400;

    span {
      color: #fe5e0099;
    }
  }
}
</style>

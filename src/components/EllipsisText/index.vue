<script lang="ts">
import { nextTick, onBeforeMount, reactive, toRefs } from 'vue'
import { parseTime } from '@/utils'

export default {
  name: 'EllipsisText',
  props: {
    groupItem: {
      type: Object,
      required: true,
    },
  },
  setup(props: any) {
    const state = reactive({
      textOver: false,
      foldBtn: false,
    })
    onBeforeMount(async () => {
      // eslint-disable-next-line vue/valid-next-tick
      await nextTick(() => {
        const domRef = document.getElementById(`room_id_${props.groupItem.id}`)
        if (domRef) {
          const h = window.getComputedStyle(domRef).height.replace('px', '')
          state.textOver = +h > 20
        }
      })
    })
    return {
      ...toRefs(state),
      parseTime,
    }
  },
}
</script>

<template>
  <div class="notice-bottom">
    <div class="content">
      <span
        :id="`room_id_${groupItem.id}`"
        :class="
          textOver && !foldBtn ? 'room-intro show-ellipsis' : 'room-intro'
        "
      >{{ groupItem.content }}</span>
    </div>
    <div class="bottom">
      <span>{{ parseTime(groupItem.create_time, "{m}-{d} {h}:{i}") }}</span>
      <div v-if="textOver" class="btn-wrap" @click="foldBtn = !foldBtn">
        <span v-if="foldBtn">{{ $t('fold') }}</span>
        <span v-else>{{ $t('More_and_more') }}</span>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.notice-bottom {
  position: relative;
  .content {
    .room-intro {
      display: -webkit-box;
      font-size: 12px;
      color: #ffffff;
      font-weight: 400;
      opacity: 0.6;
      margin: 8px 0;
      padding-left: 8px;
      word-break: break-all;
    }
    .show-ellipsis {
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-line-clamp: 1;
      line-clamp: 1;
      -webkit-box-orient: vertical;
    }
  }
  .bottom {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-family: PingFangSC-Regular;
    span {
      opacity: 0.4;
      font-size: 10px;
      color: #ffffff;
      font-weight: 400;
      text-indent: 8px;
    }
    .btn-wrap {
      span {
        opacity: 1;
        font-size: 12px;
        color: #fe5e00;
        font-weight: 400;
      }
    }
  }
}
</style>

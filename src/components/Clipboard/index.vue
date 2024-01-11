<script lang="ts">
import { defineComponent, getCurrentInstance, nextTick, onMounted } from 'vue'
import Clipboard from 'clipboard'
import { showFailToast, showSuccessToast } from 'vant'
import { i18n } from '@/locale'

export default defineComponent({
  name: 'ClipboardBox',
  props: ['content'],
  setup(props) {
    const { proxy }: any = getCurrentInstance()
    function copyHandle() {
      const clipboard = new Clipboard(proxy.$refs.copy, {
        text: () => {
          return props.content
        },
      })

      clipboard.on('success', () => {
        showSuccessToast(i18n.global.t('copySuccess'))
      })
      clipboard.on('error', () => {
        showFailToast(i18n.global.t('copyErrpr'))
      })
    }
    onMounted(() => {
      nextTick(() => {
        copyHandle()
      })
    })
    return { copyHandle }
  },
})
</script>

<template>
  <span
    ref="copy"
    type="text"
    class="clipboard"
    data-clipboard-action="copy"
    :data-clipboard-text="content"
    @click.stop="copyHandle"
  >
    <slot name="label" />
  </span>
</template>

<style lang="scss" scoped>
.clipboard {
  cursor: pointer;
  &:hover {
    color: #fe5e00;
  }
}
</style>

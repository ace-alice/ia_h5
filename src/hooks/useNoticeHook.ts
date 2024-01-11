import { computed, reactive, ref } from 'vue'
import { getNoticeInfo } from '@/api/tools-api'

export default function useNoticeHook() {
  const noticeList: any = ref([])
  const formData = reactive({
    start_date: null,
    end_date: null,
    keywords: null,
    page: 1,
    limit: 10,
  })

  const getNotices = () => {
    getNoticeInfo(formData).then(({ data }: any) => {
      if (data.code === 1) {
        noticeList.value = data.data.data
      }
      else {
        noticeList.value = []
      }
    })
  }

  const noticeText = computed(() => {
    if (noticeList.value.length > 0) {
      const result: any = []
      noticeList.value.forEach((item: any) => {
        result.push(item.title)
      })
      return result.join('')
    }
    else {
      return ''
    }
  })

  return {
    noticeList,
    noticeText,
    getNotices,
  }
}

import { showToast } from 'vant'
import message from '@/assets/home/pop_high_01.png'
import { i18n } from '@/locale'

export default function (num: number) {
  showToast({
    icon: message,
    className: 'bet-toast-message message-width2 bet-pop',
    message: num === 10 ? i18n.global.t('mostSelectedOrders10') : i18n.global.t('mostSelectedOrders15'),
  })
}

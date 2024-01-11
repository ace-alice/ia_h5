import { GetParam } from './getCommonInfo'
import { getLocal, setLocal } from './storage'

if (GetParam(window.location.href, 'token')) {
  setLocal('token', GetParam(window.location.href, 'token') || '')
}

const lang = getLocal('lang') || GetParam(window.location.href, 'lang') || 1

setLocal('lang', lang)

const hiddenProperty: string = 'hidden' in document ? 'hidden' : 'webkitHidden' in document ? 'webkitHidden' : 'mozHidden' in document ? 'mozHiddent' : ''

const visibilityChangeEvent = hiddenProperty?.replace(/hidden/i, 'visibilitychange')

let visibilityTime = 0

const onVisibilityChange = function () {
  if (!hiddenProperty) {
    return
  }
  if (!(document as any)[hiddenProperty]) {
    if (visibilityTime) {
      if (new Date().getTime() - visibilityTime > 299999) {
        window.location.reload()
      }
    }
  }
  else {
    visibilityTime = new Date().getTime()
  }
}

document.addEventListener(visibilityChangeEvent, onVisibilityChange)

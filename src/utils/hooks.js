// 倒计时

import { computed, ref } from 'vue'

export const useCountdown = () => {
  const s = ref(0)
  let interval = null
  const showS = computed(() => {
    if (s.value > 0) {
      if (s.value < 3600) {
        const m = Math.floor(s.value / 60)
        const sec = s.value % 60
        return `${m >= 10 ? m : `0${m}`}:${sec >= 10 ? sec : `0${sec}`}`
      }
      const h = Math.floor(s.value / 3600)
      const m = Math.floor((s.value % 3600) / 60)
      const sec = s.value % 60
      return `${h}:${m >= 10 ? m : `0${m}`}:${sec >= 10 ? sec : `0${sec}`}`
    }
    return '--'
  })
  const startCountDown = max => {
    // eslint-disable-next-line no-param-reassign
    if (!max || max <= 0) max = 0
    s.value = max
    interval && clearInterval(interval)
    interval = setInterval(() => {
      s.value -= 1
      if (s.value == 0) {
        clearInterval(interval)
      }
    }, 1000)
  }
  const stop = () => clearInterval(interval)

  const dispatch = (type, value) => {
    switch (type) {
      case 'start':
        startCountDown(value)
        break
      case 'stop':
        stop()
        break
    }
  }
  return [showS, dispatch]
}

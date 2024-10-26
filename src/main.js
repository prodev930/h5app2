import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import '@vant/touch-emulator'
import 'vant/lib/index.css'
import i18n from './i18'
// import { initVoice } from "./utils/voice"

const app = createApp(App)
app.config.errorHandler = (err, instance, info) => {
  // 向追踪服务报告错误
  console.error('err', err)
  console.error('info', info)
}
app.use(store).use(router).use(i18n).mount('#app')
// initVoice()

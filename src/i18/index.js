import { createI18n } from 'vue-i18n'

// 设置语言资源包
const messages = {
  en: {
    // 语言包
  },
  zh: {
    // 语言包
  },
}

// 设置语言
const locale = 'zh'

const i18n = createI18n({
  // 使用 composition API
  legacy: false,
  // 全局使用 t 函数
  globalInjection: true,
  locale,
  messages,
  missingWarn: false, // 关闭缺失键的警告
  fallbackWarn: false, // 关闭回退键的警告
})

export default i18n

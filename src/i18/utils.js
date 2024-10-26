import { Locale } from 'vant'
// 引入英文语言包
// 简体中文	zh-CN
// 繁體中文（港）	zh-HK
import en from 'vant/es/locale/lang/en-US'
import zh from 'vant/es/locale/lang/zh-CN'
import ch from 'vant/es/locale/lang/zh-HK'
import store from '@/store'
import i18n from '.'

export const setLocale = () => {
  i18n.global.locale.value = store.state.i18Data.locale
  const useL = { en, zh, ch }
  Locale.use('en-US', useL[store.state.i18Data.locale])
}

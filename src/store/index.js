import { computed } from 'vue'
import { createStore } from 'vuex'
import createPersistedState from 'vuex-persistedstate'
import { _listAccount, _sessionToken, _userinfo } from '@/api/api'
import assets from './assets'
import market from './market'
import trade from './trade'

const store = createStore({
  state: {
    fullscreen: false, // 是否是全屏状态
    pageLoading: true, // 页面加载状态
    theme: '',
    transitionName: '', // 页面过渡动画名字
    token: '',
    userInfo: {}, // 用户详情
    accountList: [], // 收款方式列表
    sessionToken: '', // 关键请求token
    isLoginOpen: false, // 登录弹窗开关
    i18Data: { name: '中文简体', locale: 'zh', icon: '/static/img/common/cn.png' },
    bottomTabBarValue: '',
    ...market.state,
    ...trade.state,
    ...assets.state,
  },
  mutations: {
    setFullscreen(state, data) {
      state.fullscreen = data
    },
    setPageLoading(state, data) {
      state.pageLoading = data
    },
    setTheme(state, data) {
      state.theme = data
    },
    setTransitionName(state, data) {
      state.transitionName = data
    },
    setToken(state, data) {
      state.token = data
    },
    setUserInfo(state, data) {
      state.userInfo = data
    },
    setAccountList(state, data) {
      state.accountList = data
    },
    setSessionToken(state, data) {
      state.sessionToken = data
    },
    setIsLoginOpen(state, data) {
      state.isLoginOpen = data
    },
    setI18Data(state, data) {
      state.i18Data = data
    },
    setBottomTabBarValue(state, data) {
      state.bottomTabBarValue = data
    },
    ...market.mutations,
    ...trade.mutations,
    ...assets.mutations,
  },
  actions: {
    reset({ commit }) {
      // 重置相关数据
      commit('setToken', '')
      commit('setUserInfo', {})
      commit('setMarketWatchList', [])
      commit('setPositionsList', [])
      commit('setContractPositionsList', [])
      commit('setAiPositionsList', [])
      commit('setIpoDataList', [])
      commit('setIpoStockList', [])
      commit('setInquireList', [])
      commit('setContractInquireList', [])
      commit('setAiInquireList', [])
      // commit('setMarketSearch', {
      //   search: '',
      //   market: '',
      //   list: []
      // })
    },
    updateUserInfo({ commit }) {
      // 更新个人信息
      return new Promise(resolve => {
        _userinfo()
          .then(res => {
            // console.error('--用户信息', res.data)
            if (res.code == 200 && res.data) {
              res.data.kycl2 = res.data.kyc || res.data.kycl2
              commit('setUserInfo', res.data || {})
              resolve(res.data)
            } else {
              resolve(false)
            }
          })
          .catch(() => resolve(false))
      })
    },
    updateAccountList({ commit }) {
      // 更新收款方式列表
      return new Promise(resolve => {
        _listAccount()
          .then(res => {
            if (res.code == 200 && res.data) {
              commit('setAccountList', res.data || {})
              resolve(res.data)
            } else {
              resolve(false)
            }
          })
          .catch(() => resolve(false))
      })
    },
    updateSessionToken({ commit }) {
      // 更新sessionToken
      return new Promise(resolve => {
        _sessionToken()
          .then(res => {
            if (res.code == 200 && res.data) {
              commit('setSessionToken', res.data || '')
              resolve(res.data)
            } else {
              resolve(false)
            }
          })
          .catch(() => resolve(false))
      })
    },
    ...market.actions,
    ...trade.actions,
    ...assets.actions,
  },
  getters: {
    ...market.getters
  },
  plugins: [
    createPersistedState({
      key: 'sunx',
    }),
  ],
})
export const useMapState = arr => {
  if (!Array.isArray(arr)) return new Error('useMapState参数必须为数组')
  const result = arr.reduce((acc, cur) => {
    acc[cur] = computed(() => store.state[cur])
    return acc
  }, {})
  return result
}
export default store

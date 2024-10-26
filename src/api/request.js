import axios from 'axios'
import { showToast } from 'vant'
import store from '@/store/index'
import router from '@/router/index'
import { BASE_ADDRESS } from '@/config'

const instance = axios.create({
  // baseURL: process.env.NODE_ENV === 'development' ? "/api" : BASE_ADDRESS,
  baseURL: BASE_ADDRESS,
  timeout: 15000,
  transformRequest: [
    function (data, headers) {
      if (headers['Content-Type'] == 'multipart/form-data') return data
      return JSON.stringify(data)
    },
  ],
})

// 添加请求拦截器
instance.interceptors.request.use(
  function (config) {
    config.sslVerify = false
    // config.headers["deviceId"] = store.state.deviceId;
    const { token } = store.state
    if (token) {
      config.headers.auth = token
    }
    if (config?.custom?.auth && !token) {
      // router.replace({
      //   name: 'login',
      //   query: {
      //     reurl: router.currentRoute.value.name
      //   }
      // })
      router.replace({
        name: 'user',
      })
      store.commit('setIsLoginOpen', true)
      console.error(config)
      throw {
        message: '当前 token 已失效，请重新登录',
      }
      return
    }
    config.headers.lang = 'EN'
    config.headers['Content-Type'] = 'application/json'
    if (config && config.custom && config.custom['Content-Type']) {
      config.headers['Content-Type'] = config.custom['Content-Type']
    }
    if (config && config.custom && config.custom.responseType) {
      config.headers.responseType = config.custom.responseType
    }
    // console.log(`--- 请求 ${config.url} 参数 ---`);
    return config
  },
  function (error) {
    return Promise.reject(error)
  }
)

// 添加响应拦截器
instance.interceptors.response.use(
  function (response) {
    // console.log(`--- 请求 ${response.config.url} 返回 ---`, response.data);
    const res = response.data
    const custom = response.config?.custom
    if (res.code != 200) {
      if (res.code == 401) {
        if (location.href.includes('/login')) {
          return
        }
        store.dispatch('reset')
        // router.push({
        //   name: 'login',
        //   query: {
        //     reurl: router.currentRoute.value.name
        //   }
        // })
        router.replace({
          name: 'user',
        })
        store.commit('setIsLoginOpen', true)
        return
      }
      const newShowToast = params => {
        setTimeout(() => {
          showToast(params)
        }, 300)
      }
      switch (res.code) {
        case '400':
          newShowToast('请求无法被服务器理解。请检查您的输入是否有误，并尝试再次提交。')
          break
        case '401':
          newShowToast('您尚未登录。请先登录后再尝试此操作。')
          break
        case '403':
          newShowToast('您没有权限执行此操作。请联系管理员获取更多权限。')
          break
        case '422':
          newShowToast('请求无法被处理，因为存在验证错误。请检查您的输入并尝试再次提交。')
          store.dispatch('updateSessionToken')
          break
        case '500':
          newShowToast('服务器遇到了意外情况，无法完成您的请求。请稍后再试，或联系技术支持。')
          break
        case '510':
          newShowToast('请求参数有误。请检查您的输入并确保所有必填项都已填写。')
          break
        case '1001':
          newShowToast('图片验证码输入错误。请重新输入正确的验证码。')
          break
        case '1002':
          newShowToast('您尚未完成实名验证。请前往个人中心完成实名验证后再次尝试。')
          break
        case '1003':
          newShowToast('您尚未绑定谷歌验证器。请前往个人中心绑定谷歌验证器后再次尝试。')
          break
        default:
          newShowToast('发生了未知错误。请稍后再试，或联系技术支持。')
          break
      }
      if (custom.toast) {
        setTimeout(() => {
          showToast(res.message || '服务端异常')
        }, 600)
      }
      return Promise.reject(res)
    }
    return res || {}
  },
  async function (error) {
    if (error?.config?.custom?.retry) {
      if (!error.config) return Promise.reject(error)
      error.config._retryTimes = error.config._retryTimes ? error.config._retryTimes + 1 : 1
      if (error.config._retryTimes > 3) return Promise.reject(error) // 重试3次
      try {
        error.config.data = JSON.parse(error.config.data)
      } catch {}
      return instance(error.config)
    }
    showToast(error.message || '网络异常,请重试')
    return Promise.reject(error)
  }
)

export default instance

// 市场
import { _assets, _balance, _accountHint, _currency,accountCurrency, _cryptoCoin } from '@/api/api'

export default {
  state: {
    assets: {}, // 总资产
    wallet: [], // 现金钱包
    elseWallet: [], // 其他账户钱包
    currencyList: [], // 币种列表
    accountCurrencyMap:{},
    deWeightCurrencyList: [], // 去重币种列表
    rechargeAmount: '', // 充值金额
    hintNum: 0, // 待处理的订单笔数
    loanNum: 0, // 借贷重的订单数
    coinMap: {}, // 币种 网络 map
  },
  mutations: {
    setAssets(state, data) {
      state.assets = data || {}
    },
    setWallet(state, data) {
      state.wallet = data
    },
    setElseWallet(state, data) {
      state.elseWallet = data
    },
    setCurrencyList(state, data) {
      state.currencyList = data
    },
    setAccountCurrencyMap(state, data) {
      state.accountCurrencyMap = data
    },
    setRechargeAmount(state, data) {
      state.rechargeAmount = data
    },
    setHintNum(state, data) {
      state.hintNum = data
    },
    setLoadNum(state, data) {
      state.loanNum = data
    },
    setCoinMap(state, data) {
      const obj = {}
      data.map(item => {
        if (obj[item.name]) {
          obj[item.name].push(item)
        } else {
          obj[item.name] = [item]
        }
      })
      state.coinMap = obj
    },
    setDeWeightCurrencyList(state, data) {
      state.deWeightCurrencyList = data
    },
  },
  actions: {
    updateAssets({ commit }) {
      // 更新资产
      return new Promise(resolve => {
        _assets()
          .then(res => {
            if (res.code == 200 && res.data) {
              commit('setAssets', res.data || {})
              resolve(res.data)
            } else {
              resolve(false)
            }
          })
          .catch(() => resolve(false))
      })
    },
    updateWallet({ commit }) {
      // 更新钱包
      _balance() // 现金账户
        .then(res => {
          if (res && res.code == 200 && res.data) {
            commit('setWallet', res.data || [])
          }
        })
      _currency() // 其他账户
        .then(res => {
          if (res && res.code == 200 && res.data) {
            commit('setElseWallet', res.data || [])
          }
        })
    },
    updateCurrency({ commit }) {
      
      accountCurrency().then(res=>{
        if (res.code == 200 && res.data) {
          commit('setAccountCurrencyMap', res.data || {})
        }
      })

      // 获取账户对应货币 其它账户对应货币
      _cryptoCoin({ dedup: false }).then(res => {
        if (res.code == 200 && res.data) {
          commit('setCurrencyList', res.data || {})
          commit(
            'setDeWeightCurrencyList',
            res.data.reduce((acc, item) => {
              if (!acc.some(accItem => accItem.name === item.name)) {
                acc.push(item)
              }
              return acc
            }, [])
          )
        }
      })
    },
    updateOrderHint({ commit }) {
      // 更新待处理订单笔数
      return new Promise(resolve => {
        _accountHint()
          .then(res => {
            if (res.code == 200 && res.data) {
              let count = 0
              if (res.data.deposit) count += res.data.deposit
              if (res.data.deposit) count += res.data.withdraw
              commit('setHintNum', count)
              commit('setLoadNum', res.data.loan || 0)
              resolve(res.data)
            } else {
              resolve(false)
            }
          })
          .catch(() => resolve(false))
      })
    },
  },
}

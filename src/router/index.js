import { createRouter, createWebHashHistory } from 'vue-router'
import store from '@/store'
import Home from '../views/Home/Home.vue'

const routes = [
  {
    // 首页
    path: '/',
    name: 'home',
    component: Home,
    meta: {
      keepAlive: true,
      pageType: 'tab',
    },
  },
  {
    // 用户
    path: '/user',
    name: 'user',
    component: () => import('../views/User/NewUser.vue'),
    meta: {
      keepAlive: true,
      pageType: 'tab',
    },
  },
  {
    // 安全
    path: '/safety',
    name: 'safety',
    component: () => import('../views/User/Safety.vue'),
    meta: {
      keepAlive: false,
      pageType: 'child',
    },
  },
  {
    // 修改登录密码
    path: '/password',
    name: 'password',
    component: () => import('../views/User/LoginPassword.vue'),
    meta: {
      keepAlive: false,
      pageType: 'child',
    },
  },
  {
    // 修改交易密码
    path: '/fund',
    name: 'fund',
    component: () => import('../views/User/FundPassword.vue'),
    meta: {
      keepAlive: false,
      pageType: 'child',
    },
  },
  {
    // 操作成功
    path: '/success',
    name: 'success',
    component: () => import('../views/User/Success.vue'),
    meta: {
      keepAlive: false,
      pageType: 'child',
    },
  },
  {
    // 谷歌验证码绑定
    path: '/google',
    name: 'google',
    component: () => import('../views/User/Google/Google.vue'),
    meta: {
      keepAlive: false,
      pageType: 'child',
    },
  },
  {
    // 谷歌验证码 - 已绑定
    path: '/googleCode',
    name: 'googleCode',
    component: () => import('../views/User/Google/GoogleCode.vue'),
    meta: {
      keepAlive: false,
      pageType: 'child',
    },
  },
  {
    // 用户认证
    path: '/kyc',
    name: 'kyc',
    component: () => import('../views/User/Kyc/Index.vue'),
    meta: {
      keepAlive: false,
      pageType: 'child',
    },
  },
  {
    // 提交成功
    path: '/submit',
    name: 'submit',
    component: () => import('../views/User/Kyc/Submit.vue'),
    meta: {
      keepAlive: false,
      pageType: 'child',
    },
  },
  {
    // 认证成功
    path: '/kycSuccess',
    name: 'kycSuccess',
    component: () => import('../views/User/Kyc/KycSuccess.vue'),
    meta: {
      keepAlive: false,
      pageType: 'child',
    },
  },
  {
    // 收款账户
    path: '/account',
    name: 'account',
    component: () => import('../views/User/Account/Account.vue'),
    meta: {
      keepAlive: false,
      pageType: 'child',
    },
  },
  {
    // 认证检测
    path: '/check',
    name: 'check',
    component: () => import('../views/User/Account/Check.vue'),
    meta: {
      keepAlive: false,
      pageType: 'child',
    },
  },
  {
    // 添加银行卡
    path: '/bank',
    name: 'bank',
    component: () => import('../views/User/Account/Bank.vue'),
    meta: {
      keepAlive: false,
      pageType: 'child',
    },
  },
  {
    // 添加加密货币
    path: '/crypto',
    name: 'crypto',
    component: () => import('../views/User/Account/Crypto.vue'),
    meta: {
      keepAlive: false,
      pageType: 'child',
    },
  },
  {
    // 市场
    path: '/market',
    name: 'market',
    component: () => import('../views/Market/Market.vue'),
    meta: {
      keepAlive: true,
      pageType: 'tab',
    },
  },
  {
    // 安全
    path: '/deal',
    name: 'deal',
    component: () => import('../views/Market/buyCoin/Deal.vue'),
    meta: {
      keepAlive: false,
      pageType: 'child',
    },
  },
  {
    // 买币-订单详情
    path: '/orderDetails',
    name: 'orderDetails',
    component: () => import('../views/Market/buyCoin/orderDetails.vue'),
    meta: {
      keepAlive: false,
      pageType: 'child',
    },
  },
  {
    // 搜索
    path: '/search',
    name: 'search',
    component: () => import('../views/Market/Search.vue'),
    meta: {
      keepAlive: false,
      pageType: 'child',
    },
  },
  {
    // 市场详情
    path: '/market_info',
    name: 'market_info',
    component: () => import('../views/Market/MarketInfo.vue'),
    meta: {
      keepAlive: false,
      pageType: 'child',
    },
  },
  {
    // 产品详情
    path: '/financial_info',
    name: 'financial_info',
    component: () => import('../views/Market/FinancialInfo.vue'),
    meta: {
      keepAlive: false,
      pageType: 'child',
    },
  },

  {
    // 交易规则
    path: '/trading_rules',
    name: 'trading_rules',
    component: () => import('../views/Market/TradingRules.vue'),
    meta: {
      keepAlive: false,
      pageType: 'child',
    },
  },
  {
    // 登录
    path: '/login',
    name: 'login',
    component: () => import('../views/Public/Login.vue'),
    meta: {
      keepAlive: false,
      pageType: 'login',
    },
  },
  {
    // 忘记密码
    path: '/fogot',
    name: 'fogot',
    component: () => import('../views/Public/Fogot.vue'),
    meta: {
      keepAlive: false,
      pageType: 'login',
    },
  },
  {
    // 注册
    path: '/register',
    name: 'register',
    component: () => import('../views/Public/Register.vue'),
    meta: {
      keepAlive: false,
      pageType: 'login',
    },
  },
  {
    // 注册
    path: '/safePassword',
    name: 'safePassword',
    component: () => import('../views/Public/SafePassword.vue'),
    meta: {
      keepAlive: false,
      pageType: 'login',
    },
  },
  {
    // 注册成功
    path: '/registerSuccess',
    name: 'registerSuccess',
    component: () => import('../views/Public/RegisterSuccess.vue'),
    meta: {
      keepAlive: false,
      pageType: 'child',
    },
  },
  {
    // 注册成功
    path: '/registerSuccess2',
    name: 'registerSuccess2',
    component: () => import('../views/Public/RegisterSuccess2.vue'),
    meta: {
      keepAlive: false,
      pageType: 'child',
    },
  },
  {
    // 语言
    path: '/language',
    name: 'language',
    component: () => import('../views/Public/Language.vue'),
    meta: {
      keepAlive: false,
      pageType: 'child',
    },
  },
  {
    // 客服
    path: '/chat',
    name: 'chat',
    component: () => import('../views/Chat/Index.vue'),
    meta: {
      keepAlive: false,
      pageType: 'child',
    },
  },
  {
    // 交易
    path: '/trade2',
    name: 'trade2',
    component: () => import('../views/trade/trade.vue'),
    meta: {
      keepAlive: true,
      pageType: 'tab',
    },
  },
  {
    // 交易
    path: '/trade',
    name: 'trade',
    component: () => import('../views/Trade2/trade.vue'),
    meta: {
      keepAlive: true,
      pageType: 'tab',
    },
  },
  {
    // 日期查询
    path: '/date',
    name: 'date',
    component: () => import('../views/trade/Deta.vue'),
    meta: {
      keepAlive: false,
      pageType: 'tab',
    },
  },
  {
    // IPO 详情
    path: '/ipodetail',
    name: 'ipodetail',
    component: () => import('../views/trade/IPODetail.vue'),
    meta: {
      keepAlive: false,
      pageType: 'tab',
    },
  },
  {
    // 中签 IPO 详情
    path: '/winningIPODetail',
    name: 'winningIPODetail',
    component: () => import('../views/trade/winningIPODetail.vue'),
    meta: {
      keepAlive: false,
      pageType: 'tab',
    },
  },
  {
    // 资产
    path: '/assets',
    name: 'assets',
    component: () => import('../views/assets/Assets.vue'),
    meta: {
      keepAlive: true,
      pageType: 'tab',
    },
  },
  {
    // 划转
    path: '/transfer',
    name: 'transfer',
    component: () => import('../views/assets/Transfer.vue'),
    meta: {
      keepAlive: false,
      pageType: 'child',
    },
  },
  {
    // 划转
    path: '/transferRecord',
    name: 'transferRecord',
    component: () => import('../views/assets/TransferRecord.vue'),
    meta: {
      keepAlive: false,
      pageType: 'child',
    },
  },
  {
    // 兑换
    path: '/swap',
    name: 'swap',
    component: () => import('../views/assets/Swap.vue'),
    meta: {
      keepAlive: false,
      pageType: 'child',
    },
  },
  {
    // 兑换记录
    path: '/swapRecord',
    name: 'swapRecord',
    component: () => import('../views/assets/SwapRecord.vue'),
    meta: {
      keepAlive: false,
      pageType: 'child',
    },
  },
  {
    // 借贷
    path: '/loanList',
    name: 'loanList',
    component: () => import('../views/assets/LoanList.vue'),
    meta: {
      keepAlive: false,
      pageType: 'child',
    },
  },
  {
    // 借贷
    path: '/loan',
    name: 'loan',
    component: () => import('../views/assets/Loan.vue'),
    meta: {
      keepAlive: false,
      pageType: 'child',
    },
  },
  {
    // 提现
    path: '/withdraw',
    name: 'withdraw',
    component: () => import('../views/assets/Withdraw.vue'),
    meta: {
      keepAlive: false,
      pageType: 'child',
    },
  },
  {
    // 提现记录
    path: '/withdrawRecord',
    name: 'withdrawRecord',
    component: () => import('../views/assets/WithdrawRecord.vue'),
    meta: {
      keepAlive: false,
      pageType: 'child',
    },
  },
  {
    // 提现详情
    path: '/withdrawInfo',
    name: 'withdrawInfo',
    component: () => import('../views/assets/WithdrawRecordInfo.vue'),
    meta: {
      keepAlive: false,
      pageType: 'child',
    },
  },
  {
    // 充值
    path: '/topUp',
    name: 'topUp',
    component: () => import('../views/assets/TopUp.vue'),
    meta: {
      keepAlive: false,
      pageType: 'child',
    },
  },
  {
    // 充值-虚拟货币
    path: '/topUpCrypto',
    name: 'topUpCrypto',
    component: () => import('../views/assets/TopUpCrypto.vue'),
    meta: {
      keepAlive: false,
      pageType: 'child',
    },
  },
  {
    // 充值中
    path: '/recharging',
    name: 'recharging',
    component: () => import('../views/assets/Recharging.vue'),
    meta: {
      keepAlive: false,
      pageType: 'child',
    },
  },
  {
    // 充值详情
    path: '/topUpItem',
    name: 'topUpItem',
    component: () => import('../views/assets/TopUpItem.vue'),
    meta: {
      keepAlive: false,
      pageType: 'child',
    },
  },
  {
    // 充值列表
    path: '/topUpRecord',
    name: 'topUpRecord',
    component: () => import('../views/assets/TopUpRecord.vue'),
    meta: {
      keepAlive: false,
      pageType: 'child',
    },
  },
  {
    // 充值详情
    path: '/rechargeInfo',
    name: 'rechargeInfo',
    component: () => import('../views/assets/RechargeInfo.vue'),
    meta: {
      keepAlive: false,
      pageType: 'child',
    },
  },
  {
    // 记录列表
    path: '/recordList',
    name: 'recordList',
    component: () => import('../views/assets/RecordList.vue'),
    meta: {
      keepAlive: false,
      pageType: 'child',
    },
  },
  {
    // 认购
    path: '/subscription',
    name: 'subscription',
    // component: () => import("../views/trade/Subscription.vue"),
    component: () => import('../views/Market/IpoSubscription.vue'),
    meta: {
      keepAlive: false,
      pageType: 'child',
    },
  },
  {
    path:'/ipo/detail',
    name:'ipoDetail',
    component: () => import('../views/Market/IpoDetail.vue'),
    meta: {
      keepAlive: false,
      pageType: 'child',
    },
  },
  {
    path:'/ipo/orderDetail',
    name:'ipoOrderDetail',
    component: () => import('../views/Market/IpoOrderDetail.vue'),
    meta: {
      keepAlive: false,
      pageType: 'child',
    },
  },
  {
    // 认购成功
    path: '/subscriptionSuccess',
    name: 'subscriptionSuccess',
    component: () => import('../views/trade/components/Success.vue'),
    meta: {
      keepAlive: false,
      pageType: 'child',
    },
  },
  {
    // 关于
    path: '/about',
    name: 'about',
    component: () => import('../views/User/About.vue'),
    meta: {
      keepAlive: false,
      pageType: 'child',
    },
  },
  {
    // 充值
    path: '/verification',
    name: 'verification',
    component: () => import('../views/assets/Verification.vue'),
    meta: {
      keepAlive: false,
      pageType: 'child',
    },
  },
  {
    // 找不到路由时
    path: '/:pathMatch(.*)*',
    redirect: '/',
  },
]

const router = createRouter({
  history: createWebHashHistory(process.env.BASE_URL),
  routes,
})

router.beforeEach((to, from) => {
  if (from.meta.pageType == 'tab' && to.meta.pageType == 'child') {
    store.commit('setTransitionName', 'slide-right')
    return
  }

  if (from.meta.pageType == 'child' && to.meta.pageType == 'tab') {
    store.commit('setTransitionName', 'slide-right')
    return
  }

  if (from.meta.pageType == 'child' && to.meta.pageType == 'child') {
    store.commit('setTransitionName', 'slide-right')
    return
  }

  if (to.meta.pageType == 'login') {
    store.commit('setTransitionName', 'slide-bottom')
    return
  }
  if (from.meta.pageType == 'login') {
    store.commit('setTransitionName', 'slide-top')
    return
  }

  store.commit('setTransitionName', '')
  // if ((from.meta.pageType == "tab" && to.meta.pageType == "tab") || (from.meta.pageType != "tab" && to.meta.pageType != "tab")) {
  //   if (to.meta.index > from.meta.index) {
  //     // 从右往左动画
  //     transitionName.value = 'slide-left';
  //   } else if (to.meta.index < from.meta.index) {
  //     // 从左往右动画
  //     transitionName.value = 'slide-right';
  //   } else {
  //     transitionName.value = '';
  //   }
  // }
})

export default router

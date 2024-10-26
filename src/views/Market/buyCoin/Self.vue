<!-- 自选区 -->
<template>
  <div class="buycoin_self">
    <!-- 一层容器 tab -->
    <div class="tabs-buy">
      <div class="tab" :class="{ active_tab: offset == 'buy' }" @click="changeTab('buy')">{{ $t('买入') }}</div>
      <div class="tab" :class="{ active_tab: offset == 'sell' }" @click="changeTab('sell')">{{ $t('卖出') }}</div>
    </div>
    <!-- 二层容器 -->
    <div class="tabs mb-4">
      <div>
        <div class="mr-[0.28rem] flex h-[0.6rem] w-[1.64rem] items-center justify-center rounded-[0.6rem] bg-[#f5f7fc] p-2 text-12" @click="showDialog = true">
          <span class="mr-[0.2rem]">{{ currCurrency.name }}</span>
          <div class="sizi-16 mr-1">
            <img src="/static/img/assets/more.png" alt="img" />
          </div>

          <div class="sizi-16">
            <img src="/static/img/market/trans.png" alt="img" />
          </div>
        </div>
      </div>

      <div class="w-full overflow-hidden">
        <Tabs :active="currCrypto.name" class="encryption w-full" line-height="0.06rem" line-width="0.32rem" @click-tab="cryptoChange">
          <Tab v-for="(item, index) in dryptoWallet" :key="item.name + index" :title="item.name" :name="item.name" />
        </Tabs>
      </div>
    </div>

    <!-- 三层容器 list -->
    <div class="list">
      <div v-for="(item, i) in list" :key="i" class="item">
        <div class="top">
          <div class="avatar">
            {{ item.merchant.slice(0, 1) }}
          </div>
          <div class="top_content">
            <div class="name">{{ item.merchant }}</div>
            <div class="info">
              <span>{{ $t('成交量') }} {{ item.volume }}</span>
              <span>|</span>
              <span>{{ $t('成交率') }} {{ item.volumerate }}%</span>
              <span>|</span>
              <IconSvg name="clock" class="sizi-[0.25rem] mr-1" />
              <span>{{ item.avetime }}{{ $t('分钟') }}</span>
            </div>
          </div>
        </div>
        <div class="bottom">
          <div class="price">
            <div class="amount">
              {{ item.price }}
              <span class="text-12 font-normal">{{ currCurrency.name }}</span>
            </div>
            <div class="text-14 text-[#8F92A1]">订单限额&nbsp;{{ item.limitmin }}-{{ item.limitmax }}</div>
          </div>
          <div v-if="token" class="btn" @click="goBuy(item)">{{ offset == 'buy' ? t('购买') : t('出售') }}</div>
        </div>
      </div>
      <NoData v-if="!loading && !list.length" />
      <LoadingMore v-if="(finish && list.length) || !finish" class-n="buycoin_buss" :loading="loading" :finish="finish" />
    </div>
  </div>

  <!-- 表单提交 -->
  <Popup v-model:show="showFormDialog" teleport="body" round position="bottom" closeable>
    <div class="buycoin_form_dialog">
      <div class="title">{{ offset == 'buy' ? t('买入') : t('卖出') }}{{ currCrypto.name }}</div>

      <div class="form">
        <div class="item form_item" :class="{ focus_item: amountFocus }">
          <div v-show="offset == 'sell'" v-if="!(!amountFocus && amount !== '')" class="tip_text">≤ {{ maxAmount }} {{ offset == 'sell' ? currCrypto.name : currCurrency.name }}</div>
          <input v-model="amount" type="number" class="ipt" @blur="amountFocus = false" @focus="amountFocus = true" />
          <div class="all" @click="amount = currWallet.amount">{{ $t('全部') }}</div>
        </div>
        <div class="tip">{{ $t('订单限额') }}：{{ currItem.limitmin }}-{{ currItem.limitmax }} {{ offset == 'sell' ? currCrypto.name : currCurrency.name }}</div>
        <div v-if="offset == 'sell'" class="tip">{{ $t('预计收到') }}：{{ showAmount }} {{ currCurrency.name }}</div>

        <div class="btn" @click="preSubmit">{{ $t('确认') }}{{ offset == 'buy' ? t('买入') : t('卖出') }}</div>
      </div>
    </div>
  </Popup>

  <!-- 订单弹窗 -->
  <Popup v-model:show="showPopupInfo" teleport="body" round position="bottom" closeable>
    <div class="buycoin_orderinfo_dialog">
      <div class="orderinfo_dialog_title">{{ $t('订单详情') }}</div>
      <OrderInfo />
    </div>
  </Popup>

  <!-- 法币币种 -->
  <Popup v-model:show="showDialog" :safe-area-inset-top="true" :safe-area-inset-bottom="true" class="self_van_popup" position="bottom" teleport="body">
    <div class="withdraw_accounr_dialog">
      <div class="close_icon" @click="showDialog = false">
        <img src="/static/img/common/close.png" alt="x" />
      </div>
      <div class="title">{{ $t('币种选择') }}</div>
      <div v-for="(item, i) in fiatWallet" :key="i" class="swap_dialog_item" :class="{ swap_dialog_item_active: currCurrency.name == item.name }" @click="clickItem(item)">
        <div class="icon">
          <img :src="handleUrl(item.name)" alt="currency" />
        </div>
        <span>{{ item.name.toUpperCase() }}</span>
        <Icon v-if="currCurrency.name == item.name" class="check_icon" name="success" />
      </div>
    </div>
  </Popup>
  <!-- 加密币种 -->
  <!-- <Popup v-model:show="showDialog2" :safe-area-inset-top="true" :safe-area-inset-bottom="true" class="self_van_popup" position="bottom" teleport="body">
    <div class="withdraw_accounr_dialog">
      <div class="close_icon" @click="showDialog2 = false">
        <img src="/static/img/common/close.png" alt="x" />
      </div>
      <div class="title">{{ $t('币种选择') }}</div>
      <div v-for="(item, i) in dryptoWallet" :key="i" class="swap_dialog_item" :class="{ swap_dialog_item_active: currCrypto.name == item.name }" @click="clickCrypto(item)">
        <div class="icon">
          <img :src="`/static/img/crypto/${item.name.toUpperCase()}.png`" alt="currency" />
        </div>
        <span>{{ item.name.toUpperCase() }}</span>
        <Icon v-if="currCrypto.name == item.name" class="check_icon" name="success" />
      </div>
    </div>
  </Popup> -->

  <!-- 账户选择弹窗 -->
  <Popup v-model:show="showAccountDialog" :safe-area-inset-top="true" :safe-area-inset-bottom="true" class="self_van_popup" position="bottom" teleport="body">
    <div class="withdraw_accounr_dialog">
      <div class="close_icon" @click="showAccountDialog = false">
        <img src="/static/img/common/close.png" alt="x" />
      </div>
      <div class="title">{{ $t('账户选择') }}</div>
      <div class="list">
        <div class="add_item" @click="goAddAccount">
          <Icon style="font-size: 0.48rem" name="add-o" />
          <span style="margin-left: 0.2rem; color: #999999; font-size: 0.24rem">{{ $t('添加收款账户') }}</span>
        </div>
        <div v-for="(item, i) in bankList" :key="i" :class="{ dialog_account_item_active: currAccount.id == item.id }" class="dialog_account_item" @click="clickAccountItem(item)">
          <div class="card_icon">
            <img v-if="item.bankName" src="/static/img/user/card_type_b.png" alt="img" />
            <img v-else src="/static/img/user/card_type_c.png" alt="img" />
          </div>
          <div class="card">
            <div class="code">{{ _hiddenAccount(item.bankCardNumber || item.address) }}</div>
            <div class="name">{{ item.symbol ? `${item.symbol}-${item.network}` : `${item.bankName}` }}</div>
          </div>
          <div v-if="currAccount.id == item.id" class="checked" style="background-image: url('/static/img/user/check_bg.png')">
            <img src="/static/img/common/ok.png" alt="img" />
          </div>
        </div>
      </div>
    </div>
  </Popup>

  <!-- 安全密码弹窗 -->
  <SafePassword ref="safeRef" @submit="submitSell" />
</template>

<script setup>
import { Popup, Icon, showToast, showConfirmDialog, Tabs, Tab } from 'vant'
import Decimal from 'decimal.js'
import OrderInfo from './OrderInfo.vue'
import NoData from '@/components/NoData.vue'
import LoadingMore from '@/components/LoadingMore.vue'
import { _adList, _buysell } from '@/api/api'
import store, { useMapState } from '@/store'
import router from '@/router'
import { _hiddenAccount } from '@/utils/index'
import SafePassword from '@/components/SafePassword.vue'
import IconSvg from '@/components/IconSvg.vue'
import { useBuyCoinState } from './state'

const { userInfo, token, deWeightCurrencyList: currencyList, accountList, sessionToken } = useMapState(['userInfo', 'token', 'deWeightCurrencyList', 'accountList', 'sessionToken'])
const buycoinScrollTop1 = useSessionStorage('buycoinScrollTop1')
const { active, handleUrl } = useBuyCoinState()
const scrollData = inject('scrollData')
const { t } = useI18n()
const safeRef = ref()
const showPopupInfo = ref(false)
const showDialog = ref(false)
const showDialog2 = ref(false)
const wallet = computed(() => (token.value ? store.state.wallet : currencyList.value)) // 所有钱包
const fiatWallet = computed(() => currencyList.value.filter(item => item.type == 'fiat')) // 法币钱包
const dryptoWallet = computed(() => currencyList.value.filter(item => item.type == 'crypto')) // 加密钱包
const bankList = computed(() => accountList.value.filter(item => item.channel == 'bank')) // 银行账号列表

const currWallet = computed(() => {
  if (offset.value == 'buy') {
    return wallet.value.find(item => item.name == currCurrency.value.name)
  }
  return wallet.value.find(item => item.name == currCrypto.value.name)
})

// 表单
const offset = ref(sessionStorage.getItem('buycoin_offset') || 'buy')
const currCurrency = ref({}) // 计价货币
if (fiatWallet.value[0]) currCurrency.value = fiatWallet.value[0]
const currCrypto = ref({}) // 加密货币

// 表单弹窗
const showFormDialog = ref(false)
const currItem = ref({})
const amountFocus = ref(false)
const amount = ref('')

// 列表
const loading = ref(false)
const finish = ref(false)
const list = ref([])
// 账户选择
const showAccountDialog = ref(false)
const currAccount = ref({})
// 监听
const totalHeight = window.innerHeight || document.documentElement.clientHeight
let moreDom = null
try {
  list.value = JSON.parse(sessionStorage.getItem('deal_list') || '[]')
  currCrypto.value = JSON.parse(sessionStorage.getItem('buycoin_currCrypto') || '{}')
} catch {}
if (dryptoWallet.value[0] && !currCrypto.value.name) {
  const target = dryptoWallet.value.find(item => item.name == 'USDT')
  currCrypto.value = target || dryptoWallet.value[0]
}

const clickItem = item => {
  currCurrency.value = item
  showDialog.value = false
  list.value = []
  init()
}
const clickCrypto = item => {
  currCrypto.value = item
  // currCurrency.value = item
  showDialog2.value = false
  list.value = []
  init()
}
const changeTab = name => {
  offset.value = name
  sessionStorage.setItem('buycoin_offset', name)
  list.value = []
  init()
}
const maxAmount = computed(() => {
  if (!currWallet.value.amount || !currItem.value.price) return 0
  if (offset.value == 'buy') {
    return new Decimal(currWallet.value.amount).div(currItem.value.price)
  }
  return currWallet.value.amount
})
const showAmount = computed(() => {
  if (!amount.value || amount.value <= 0) return '--'
  if (offset.value == 'buy') {
    return new Decimal(amount.value).div(currItem.value.price)
  }
  return new Decimal(amount.value).mul(currItem.value.price)
})
const goBuy = item => {
  router.push({
    name: 'deal',
    query: {
      ...item,
      offset: offset.value,
      currCrypto: currCrypto.value.name,
      currWallet: currCurrency.value.name,
    },
  })
  if (offset.value) return
  amount.value = ''
  currItem.value = item
  showFormDialog.value = true
}

// 提交表单
const preSubmit = () => {
  if (!amount.value || amount.value < currItem.value.limitmin || amount.value > currItem.value.limitmax) return showToast(`限额：${currItem.value.limitmin}-${currItem.value.limitmax}`)
  showFormDialog.value = false
  setTimeout(() => {
    if (offset.value == 'buy') {
      safeRef.value.open()
    } else {
      showAccountDialog.value = true
    }
  }, 0)
}
const submitSell = s => {
  const params = {
    ad_id: currItem.value.id,
    volume: amount.value,
    account_id: offset.value == 'buy' ? null : currAccount.value.id,
    token: sessionToken.value,
    safeword: s,
  }
  if (loading.value) return
  loading.value = true
  _buysell(params)
    .then(res => {
      if (res.code == 200) {
        showToast(t('下单成功'))
      }
    })
    .finally(() => {
      loading.value = false
      getSessionToken()
    })
}

const page = ref(0)
const getData = () => {
  if (loading.value || finish.value) return
  loading.value = true
  page.value += 1
  const req = {
    offset: offset.value,
    crypto: currCrypto.value.currency,
    currency: currCurrency.value.currency,
  }
  _adList({
    page: page.value,
    ...req,
  })
    .then(res => {
      if (req.offset != offset.value || req.crypto != currCrypto.value.currency || req.currency != currCurrency.value.currency) return
      loading.value = false
      if (page.value == 1) {
        list.value = res.data || []
      } else {
        list.value.push(...(res.data || []))
      }
      if (!res.data?.length) {
        finish.value = true
      }
      setTimeout(() => {
        sessionStorage.setItem('deal_list', JSON.stringify(list.value))
      }, 100)
    })
    .catch(() => {
      loading.value = false
    })
}
const init = () => {
  page.value = 0
  loading.value = false
  finish.value = false
  setTimeout(() => {
    getData()
  }, 0)
  setTimeout(() => {
    moreDom = document.querySelector('.buycoin_buss')
  }, 500)
}

const scrollHandle = bottom => {
  if (!moreDom) return
  if (active.value !== '1') return
  // 加载更多
  if (bottom) getData()
}
watch(() => scrollData.arrivedState.bottom, scrollHandle)

onActivated(() => {
  setTimeout(() => {
    moreDom = document.querySelector('.buycoin_buss')
    if (active.value !== '1') return
    nextTick(() => {
      const page2 = document.querySelector('.page')
      page2.scrollTop = buycoinScrollTop1.value
    })
  }, 500)
})
onMounted(() => {
  init()
  setTimeout(() => {
    moreDom = document.querySelector('.buycoin_buss')
  }, 500)
})

const clickAccountItem = item => {
  currAccount.value = item
  showAccountDialog.value = false
  safeRef.value.open()
}
// 跳转添加
const goAddAccount = () => {
  // google检测
  if (!userInfo.value.googlebind) {
    return showConfirmDialog({
      title: t('谷歌验证器'),
      message: t('你还未绑定谷歌验证器，是否去绑定?'),
    }).then(() => {
      jump('google')
    })
  }
  router.push({
    name: 'account',
  })
}

const getSessionToken = () => {
  store.dispatch('updateSessionToken')
}
if (token.value) {
  getSessionToken()
}

// 跳转
const jump = name => {
  router.push({
    name,
  })
}
function cryptoChange({ name: item }) {
  const result = dryptoWallet.value.find(i => i.name == item)
  sessionStorage.setItem('buycoin_currCrypto', JSON.stringify(result))
  clickCrypto(result)
}

defineExpose({
  init,
})
</script>

<style lang="less" scoped>
.buycoin_self {
  width: 7.5rem;
  padding: 0 0.32rem;
  margin-top: -0.32rem;
  .tabs-buy {
    display: flex;
    align-items: center;
    justify-content: space-between;
    line-height: 0.68rem;
    margin: 0.4rem 0 0.2rem;
    border: 0.5px solid #d0d8e2;
    width: 47%;
    border-radius: 0.68rem;

    .tab {
      color: #666d80;
      margin: 0;
      width: 1.6rem;
      text-align: center;
      border-radius: 0.68rem;
    }

    .active_tab {
      font-weight: bold;
      color: white;
      background: var(--main-color);
      text-align: center;
    }
  }
  .tabs {
    height: 0.8rem;
    padding-top: 0.2rem;
    display: flex;
    align-items: center;
    justify-content: space-between;
    // border-bottom: 1px solid rgba(59, 130, 246, 0.3);

    .tab {
      margin-right: 0.24rem;
      min-width: 1rem;
      color: #9ea3ae;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .active_tab {
      font-weight: bold;
      color: var(--main-text-color);
    }
    .encryption {
      > :deep(.van-tabs__wrap) {
        border-bottom: 1px solid #f0f3f8;
        padding-right: 0;
        .van-tabs__line {
          background-color: var(--main-color) !important;
        }
        .van-tabs__nav,
        .van-tab--grow {
          padding-right: 0 !important;
          padding-left: 0 !important;
          margin-right: 14px !important;
        }
        .van-tabs__nav:last-child {
          margin-right: 0 !important;
        }
      }
    }
  }

  .subtabs2 {
    margin: 0.2rem 0;
    padding: 0 0.1rem;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .subtabs {
    overflow-x: auto;
    white-space: nowrap;
    margin: 0.2rem 0;
    padding-left: 0.1rem;

    .subtab {
      display: inline-block;
      margin-right: 0.4rem;
      color: #9ea3ae;
    }

    .active_subtab {
      color: #000;
      font-weight: bold;
    }
  }

  .list {
    .item {
      padding: 0.24rem 0.32rem;
      color: #666;
      background-color: #f5f7fc;
      border-radius: 0.32rem;
      border-bottom: 1px solid #e8e8e8;
      margin-bottom: 0.2rem;

      .top {
        display: flex;
        align-items: flex-start;

        .avatar {
          width: 0.64rem;
          height: 0.64rem;
          border-radius: 50%;
          background-color: var(--main-color);
          margin-right: 0.24rem;
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.48rem;
          color: #fff;
          line-height: 0;

          .avatar_status {
            position: absolute;
            width: 0.13rem;
            height: 0.13rem;
            border-radius: 50%;
            background-color: #30bf87;
            bottom: 0.04rem;
            right: 0.04rem;
          }
        }

        .top_content {
          // padding-top: 0.16rem;

          .name {
            margin-bottom: 0.2rem;
            font-style: 0.32rem;
            color: var(--main-text-color);
          }

          .info {
            font-size: 0.24rem;
            display: flex;
            align-items: center;
            color: #8f92a1;
            span {
              margin-right: 0.1rem;
            }

            .time_icon {
              width: 0.24rem;
              height: 0.24rem;
              margin-right: 0.1rem;
            }
          }
        }
      }

      .bottom {
        margin-top: 0.4rem;
        display: flex;
        align-items: center;
        justify-content: space-between;

        .price {
          .amount {
            color: var(--main-text-color);
            font-weight: bold;
            font-size: 0.48rem;
            margin-bottom: 0.2rem;
          }
        }

        .btn {
          width: 1.6rem;
          height: 0.72rem;
          border-radius: 0.64rem;
          background-color: var(--main-color);
          color: #fff;
          display: flex;
          align-items: center;
          justify-content: center;
        }
      }
    }
  }
}
</style>

<style lang="less">
.buycoin_form_dialog {
  position: relative;

  .title {
    font-size: 0.32rem;
    line-height: 0.6rem;
    text-align: center;
    margin-bottom: 0.2rem;
    margin-top: 0.2rem;
    font-weight: bold;
  }

  .form {
    padding: 0.32rem;

    .form_item {
      border: 1px solid #d0d8e2;
      height: 0.96rem;
      display: flex;
      align-items: center;
      padding: 0 0.24rem;
      position: relative;
      border-radius: 0.24rem;
      margin-bottom: 0.12rem;

      .ipt {
        flex: 1;
        height: 100%;
      }

      .all {
        color: var(--main-color);
      }

      .tip_text {
        font-size: 0.28rem;
        color: #a4acb9;
        position: absolute;
        left: 0.24rem;
        pointer-events: none;
      }
    }

    .focus_item {
      height: 1.12rem;
      padding-top: 0.2rem;

      .tip_text {
        transform: translateY(-0.36rem);
        font-size: 0.24rem;
      }
    }

    .tip {
      color: #333;
    }

    .btn {
      margin-top: 0.32rem;
      height: 0.96rem;
      background-color: var(--main-color);
      border-radius: 0.96rem;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #fff;
    }
  }
}

.buycoin_orderinfo_dialog {
  position: relative;

  .orderinfo_dialog_title {
    font-size: 0.32rem;
    line-height: 0.6rem;
    text-align: center;
    margin-bottom: 0.2rem;
    margin-top: 0.2rem;
    font-weight: bold;
  }
}
</style>
<style lang="less" scoped>
.withdraw_accounr_dialog {
  background-color: #fff;
  border-top-left-radius: 0.4rem;
  border-top-right-radius: 0.4rem;
  overflow: hidden;
  padding: 1.2rem 0.32rem 0.8rem 0.32rem;
  position: relative;

  .title {
    height: 1rem;
    position: absolute;
    top: 0.2rem;
    left: 0;
    text-align: center;
    line-height: 1rem;
    font-size: 0.32rem;
    width: 100%;
    color: #121826;
    pointer-events: none;
    font-weight: bold;
  }

  .close_icon {
    position: absolute;
    width: 0.4rem;
    height: 0.4rem;
    top: 0.24rem;
    right: 0.32rem;
  }

  .swap_dialog_item {
    height: 1.12rem;
    line-height: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    border-bottom: 1px solid #f5f5f5;
    overflow: hidden;
    position: relative;

    .icon {
      width: 0.4rem;
      height: 0.4rem;
      margin-right: 0.24rem;
    }
  }

  .swap_dialog_item_active {
    color: var(--main-color);
    font-weight: 600;

    .check_icon {
      position: absolute;
      right: 0.24rem;
      color: var(--main-color);
      font-size: 0.28rem;
    }
  }

  .search_box {
    height: 0.8rem;
    background-color: #f5f5f5;
    border-radius: 0.4rem;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 0.32rem;
    padding: 0 0.4rem;

    input {
      flex: 1;
      color: #121826;
    }
  }

  .tabs {
    display: flex;
    align-items: center;
    justify-content: flex-start;
    margin-bottom: 0.4rem;

    .tab {
      height: 0.72rem;
      border-radius: 0.72rem;
      display: flex;
      align-items: center;
      padding: 0 0.4rem;
      color: #061023;
      font-size: 0.32rem;
      font-weight: 400;
    }

    .active_tab {
      background-color: #f6f8ff;
      color: var(--main-color);
      font-weight: 500;
    }
  }

  .list {
    max-height: 70vh;
    overflow-y: auto;

    .add_account {
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 0.4rem 0;
    }
  }

  .add_item {
    margin-bottom: 0.36rem;
    border: 1px dashed #ccd7fd;
    border-radius: 0.12rem;
    height: 1.44rem;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .dialog_account_item {
    border-radius: 0.12rem;
    height: 1.44rem;
    display: flex;
    align-items: center;
    justify-content: space-between;
    position: relative;
    background-color: #f6f7fa;
    padding: 0 0.4rem 0 0.36rem;
    overflow: hidden;
    margin-bottom: 0.36rem;

    .card_icon {
      background-color: #d9e4ff;
      width: 0.96rem;
      height: 0.96rem;
      border-radius: 0.16rem;
      display: flex;
      align-items: center;
      justify-content: center;

      > img {
        width: 0.64rem !important;
        height: 0.64rem !important;
      }
    }

    .card {
      flex: 1;
      margin: 0 0.2rem 0 0.36rem;
      text-align: left;
      font-size: 0.24rem;
      color: #061023;
      font-weight: 500;
      line-height: 1;

      .code {
        font-size: 0.28rem;
        margin-bottom: 0.1rem;
        font-weight: 400;
      }
    }
  }

  .dialog_account_item_active {
    border: 1px solid #1a59f6;

    .checked {
      position: absolute;
      top: -0.04rem;
      right: -0.04rem;
      background-size: 100% 100%;
      width: 0.46rem;
      height: 0.42rem;

      > img {
        width: 0.18rem !important;
        height: 0.12rem !important;
        position: absolute;
        right: 0.06rem;
        top: 0.08rem;
      }
    }
  }
}
</style>

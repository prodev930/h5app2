<!-- 自选买卖 二级页面 -->
<template>
  <div class="page-deal">
    <Top :title="title" />

    <!-- 买入 -->
    <div v-if="info.offset == 'buy'" class="form">
      <!-- 信息 -->
      <div class="info" style="margin-bottom: 0.32rem">
        <div class="flex items-center">
          <div class="avatar">
            {{ info.merchant?.slice(0, 1) }}
          </div>
          {{ info.merchant }}
        </div>
        <div class="info_item">
          {{ info.price }}
          <span class="text-12 font-normal">{{ info.currWallet }}</span>
        </div>
        <div class="text-14 text-[#8F92A1]">{{ $t('订单限额') }} {{ info.limitmin }}-{{ info.limitmax }}</div>
      </div>

      <div class="mb-[0.12rem] text-14">{{ $t('数量') }}</div>
      <div class="item form_item">
        <input v-model="amount" type="number" class="ipt" />
        <span>{{ info.currCrypto }}</span>
      </div>
      <div class="tip">{{ $t('预计支付') }} {{ showAmount }} {{ info.currWallet }}</div>

      <Button size="large" class="btn" round :loading="loading" color="var(--main-color)" @click="goSubmit">{{ $t('买入') }}</Button>
    </div>

    <!-- 卖出 -->
    <div v-if="info.offset == 'sell'" class="form">
      <!-- 信息 一层容器 -->
      <div class="info" style="margin-bottom: 0.32rem">
        <div class="flex items-center">
          <div class="avatar">
            {{ info.merchant?.slice(0, 1) }}
          </div>
          {{ info.merchant }}
        </div>
        <div class="info_item">{{ info.price }} {{ info.currWallet }}</div>
        <div class="text-14 text-[#8F92A1]">{{ $t('订单限额') }} {{ info.limitmin }}-{{ info.limitmax }}</div>
      </div>
      <!-- 二层容器 -->
      <div style="margin-bottom: 0.12rem; display: flex; align-items: center; justify-content: space-between">
        <span>{{ $t('数量') }}</span>
      </div>
      <div class="item form_item">
        <input v-model="amount" type="number" :placeholder="`≤${currWallet.amount}`" class="ipt" />
        <div class="all" @click="amount = currWallet.amount">{{ $t('全部') }}</div>
      </div>
      <!-- 三层容器 -->
      <div class="tip">{{ $t('预计收到') }} {{ showAmount }} {{ info.currWallet }}</div>

      <!-- 银行卡 -->
      <div class="leading-18" style="margin-bottom: 0.12rem; margin-top: 0.32rem">{{ $t('账户') }}</div>
      <div v-if="bankList.length" class="card_box" @click="showAccountDialog = true">
        <div class="card_icon">
          <img v-if="bank.symbol" id="img" class="rounded-50" :src="`/static/img/crypto/${bank.symbol.toUpperCase()}.png`" alt="currency" />
          <img v-else class="!size-[0.68rem]" src="/static/img/user/card_type_b.png" alt="img" />
        </div>
        <div class="card">
          <div class="code">{{ _hiddenAccount(bank.bankCardNumber || bank.address) }}</div>
          <div class="name">{{ bank.bankName || bank.symbol }}</div>
        </div>

        <div class="text-12 text-my" @click="goAddAccount">{{ $t('更改') }}</div>
      </div>
      <div v-else class="flex h-18 w-full flex-col items-center justify-center rounded-3 bg-[#F5F7FC] text-my" @click="showAccountDialog = true">
        <div class="mb-1 size-6 rounded-50 border-[0.03rem] border-my text-center text-20">+</div>
        <span class="text-12 leading-22">{{ $t('添加收款账户') }}</span>
      </div>
      <Button size="large" style="margin-top: 0.8rem" class="btn" round :loading="loading" color="var(--main-color)" @click="goSubmit">{{ $t('卖出') }}</Button>
    </div>
    <!-- 安全密码弹窗 -->
    <SafePassword ref="safeRef" @submit="submitSell" />
    <!-- 账户选择弹窗 -->
    <AccountSelectionPopUp v-model:show="showAccountDialog" :bank="bank" currency-type="bank" @on-add-collection="clickAccountItem" />
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'
import { Button, showToast } from 'vant'
import Decimal from 'decimal.js'
import Top from '@/components/Top.vue'
import store, { useMapState } from '@/store'
import SafePassword from '@/components/SafePassword.vue'
import router from '@/router'
import { _buysell } from '@/api/api'
import { _hiddenAccount } from '@/utils/index'
import AccountSelectionPopUp from './components/AccountSelectionPopUp.vue'
import { useBuyCoinState } from './state'
// 收款方式列表 所有钱包
const { accountList, wallet, sessionToken } = useMapState(['accountList', 'wallet', 'sessionToken'])
const { t } = useI18n()
const { onChange } = useBuyCoinState()

const bankList = computed(() => accountList.value.filter(item => item.channel == 'bank')) // 银行账号列表
const safeRef = ref()

const route = useRoute()
const title = ref(route.query.offset == 'buy' ? t('买入') : t('卖出'))

// 表单
const loading = ref(false)
const info = ref(route.query || {})
const amount = ref('')
const showAmount = computed(() => {
  if (!amount.value || amount.value <= 0) return '--'
  if (info.value.offset == 'buy') {
    return new Decimal(amount.value).mul(info.value.price)
  }
  return new Decimal(amount.value).mul(info.value.price)
})
const currWallet = computed(() => {
  return wallet.value.find(item => item.name == info.value.currCrypto) || {}
})

// 账户
const showAccountDialog = ref(false)
const bank = ref(bankList.value[0] || {})
const clickAccountItem = item => {
  bank.value = item
  showAccountDialog.value = false
}

const goSubmit = () => {
  if (!amount.value || amount.value <= 0) return showToast(t('请输入金额'))
  if (amount.value < info.value.limitmin || amount.value > info.value.limitmax) return showToast(`限额：${info.value.limitmin}-${info.value.limitmax}`)
  if (info.value.offset == 'sell') {
    const cueeWallet = wallet.value.find(item => item.name == info.value.currCrypto)
    if (amount.value > cueeWallet.amount) return showToast(t('余额不足'))
    if (!bank.value.id) return showToast(t('请选择先添加收款账户'))
  }
  // 打开密码
  safeRef.value.open()
}

const submitSell = s => {
  const params = {
    ad_id: info.value.id,
    volume: amount.value,
    account_id: info.value.offset == 'buy' ? null : bank.value.id,
    token: sessionToken.value,
    safeword: s,
  }
  if (loading.value) return
  loading.value = true
  _buysell(params)
    .then(res => {
      if (res.code == 200) {
        showToast(t('下单成功'))
        setTimeout(() => {
          router.back()
          onChange('2')
        }, 500)
      }
    })
    .finally(() => {
      setTimeout(() => {
        loading.value = false
      }, 1000)
      getSessionToken()
    })
}
const getSessionToken = () => {
  store.dispatch('updateSessionToken')
}
getSessionToken()
</script>

<style lang="less" scoped>
.page-deal {
  padding-top: 1.12rem;

  .form {
    padding: 0 0.32rem 0.32rem 0.32rem;

    .card_box {
      border-radius: 0.12rem;
      height: 1.44rem;
      display: flex;
      align-items: center;
      // justify-content: space-between;
      position: relative;
      // background-color: #f6f7fa;
      border: 1px solid #d0d8e2;
      padding: 0 0.4rem 0 0.36rem;
      overflow: hidden;
      margin-bottom: 0.36rem;
      border-width: 1px;
      .card_icon {
        background-color: #f5f7fc;
        width: 0.96rem;
        height: 0.96rem;
        border-radius: 2rem;
        display: flex;
        align-items: center;
        justify-content: center;

        > #img {
          width: 0.96rem !important;
          height: 0.96rem !important;
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

    .no_card {
      padding: 0.32rem;
      border-radius: 0.12rem;
      border: 1px dashed #d0d8e2;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .tip {
      color: #b7b7b7;
      font-size: 0.24rem;
      margin-top: 0.24rem;
      margin-bottom: 0.8rem;
    }

    .form_item {
      border: 1px solid #d0d8e2;
      height: 0.96rem;
      display: flex;
      align-items: center;
      padding: 0 0.24rem;
      position: relative;
      border-radius: 0.24rem;

      .ipt {
        flex: 1;
        height: 100%;
      }

      .all {
        color: #014cfa;
      }

      .tip_text {
        font-size: 0.28rem;
        color: #a4acb9;
        position: absolute;
        left: 0.24rem;
        pointer-events: none;
      }
    }

    .info {
      padding: 0.32rem;
      border-radius: 0.32rem;
      background-color: #f5f7fc;
      font-size: 0.32rem;
      .avatar {
        width: 0.4rem;
        height: 0.4rem;
        border-radius: 50%;
        background-color: var(--main-color);
        margin-right: 0.16rem;
        position: relative;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 0.24rem;
        color: #fff;
        line-height: 0;
      }
      .info_item {
        font-weight: bold;
        margin: 0.48rem 0 0.16rem;
        font-size: 0.48rem;
      }
    }

    .btn {
      height: 0.96rem;
      color: #fff;
    }
  }
}
</style>

<template>
  <div class="orderDetails">
    <Top :title="statusEnum[form.status]?.title" :back-func="goBack" />
    <!-- 一层容器 tab -->
    <div class="tabs-buy !mb-5">
      <div class="tab" :class="{ active_tab: ['buy', 'sell'].includes(tabsValue) }" @click="changeTab('buy')">{{ offsetEnum[form.offset] }}</div>
      <div class="tab" :class="{ active_tab: tabsValue == 'contactTheMerchant' }" @click="changeTab('contactTheMerchant')">
        {{ $t('联系商家') }}
        <div v-if="form.unread" class="absolute right-[40px] top-[3px] flex size-4 items-center justify-center rounded-50 bg-[#e8503a] text-8 text-white">
          {{ form.unread > 99 ? '+99' : form.unread }}
        </div>
      </div>
    </div>
    <template v-if="tabsValue !== 'contactTheMerchant'">
      <!-- 二层容器 -->
      <div class="mb-[0.2rem] w-full rounded-2xl border border-[#d0d8e2] bg-[#f5f7fc] pt-[0.28rem]">
        <template v-if="['waitpayment', 'waitconfirm'].includes(form.status)">
          <div class="flex items-center px-4">
            <div class="mr-2 text-15 font-semibold leading-25 text-black">{{ $t('等待') }}{{ form.status === 'waitpayment' ? t('买家付款') : t('卖家确认') }}</div>
            <div class="text-base font-semibold text-[#e8503a]">{{ countState }}</div>
          </div>
          <div class="mb-[0.14rem] w-full px-4 text-xs leading-25 text-[#8f92a1]">{{ $t('请根据总价') }}，{{ $t('向商家提供的银行卡转账') }}</div>
        </template>
        <div v-else class="mb-[0.22rem] text-center text-15 leading-25" :style="{ color: statusEnum[form.status]?.color }">{{ statusEnum[form.status]?.name }}</div>

        <!-- 三层容器 rounded-2xl border border-[#d0d8e2]-->
        <div class="box-3 relative h-[4.26rem] w-full rounded-2xl bg-white px-4 py-[0.2rem]">
          <div class="mb-1 flex items-center">
            <div class="mr-[0.12rem] w-6 rounded-full bg-[#a6bef4] text-center text-xs font-semibold leading-24 text-[#014cfa]">{{ form.merchant_name ? form.merchant_name.slice(0, 1) : '' }}</div>
            <div class="text-base text-[#061023]">{{ form.merchant_name }}</div>
          </div>
          <div class="mb-[0.2rem] flex pl-[0.62rem] text-xs leading-17 text-[#8f92a1]">
            <span>{{ $t('成交量') }} {{ form.volume || '0' }}</span>
            <span class="px-[0.12rem]">|</span>
            <span>{{ $t('成交率') }} {{ form.volumerate || '0' }}%</span>
            <template v-if="form.merchant_avetime">
              <span class="px-[0.12rem]">|</span>
              <IconSvg name="clock" class="sizi-[0.25rem] mr-1" />
              <span>{{ form.merchant_avetime }}{{ $t('分钟') }}</span>
            </template>
          </div>

          <div class="dashed-my -ml-4 mb-4 h-[0.02rem] w-[6.86rem]" />
          <!-- 银行卡 -->
          <template v-if="form.bank_status === 'done'">
            <div class="mb-1 flex text-center">
              <div class="mr-1 w-[1.96rem] rounded-tl-2xl bg-[#f5f7fc] leading-35">
                <div class="text-sm text-[#666d80]">{{ $t('银行卡') }}</div>
              </div>
              <div class="w-52 rounded-tr-2xl bg-[#f5f7fc] leading-35">
                <div class="text-sm text-[#061023]">{{ form.bank_name }}</div>
              </div>
            </div>
            <div class="mb-1 flex text-center">
              <div class="mr-1 w-[1.96rem] bg-[#f5f7fc] leading-35">
                <div class="text-sm text-[#666d80]">{{ $t('卡号') }}</div>
              </div>
              <div class="w-52 bg-[#f5f7fc] leading-35">
                <div class="flex items-center justify-center text-sm text-[#061023]" @click="copy(form.bank_card_number)">
                  {{ form.bank_card_number }}
                  <img class="ml-1 !size-[0.2rem]" src="/static/img/trade/copy.png" alt="" />
                </div>
              </div>
            </div>
            <div class="flex text-center">
              <div class="mr-1 w-[1.96rem] rounded-bl-2xl bg-[#f5f7fc] leading-35">
                <div class="text-sm text-[#666d80]">{{ $t('账号') }}</div>
              </div>
              <div class="w-52 rounded-br-2xl bg-[#f5f7fc] leading-35">
                <div class="text-sm text-[#061023]">{{ form.account_name }}</div>
              </div>
            </div>
          </template>
          <div v-else class="flex flex-col items-center justify-center">
            <img class="mb-[0.2rem] !h-18 !w-[1.8rem]" src="/static/img/market/waitFor.svg" alt="" />
            <div class="text-xs text-[#8f92a1]">{{ $t('请等待商家提供银行卡') }}</div>
          </div>
        </div>
      </div>

      <!-- 四层容器 -->
      <div class="h-[2.3rem] w-[6.86rem] rounded-2xl bg-[#f5f7fc]">
        <div class="flex h-[0.68rem] items-center justify-between border border-transparent border-b-[#EFF3F8] px-4 text-sm leading-34 text-[#666666]">
          <div class="flex items-center" @click="copy(form.order_no)">
            {{ form.order_no }}
            <img class="ml-1 !size-[0.2rem]" src="/static/img/trade/copy.png" alt="" />
          </div>
          <div class="text-12 text-[#8f92a1]">{{ form.date }}</div>
        </div>

        <div class="flex h-20 items-center justify-between px-4 text-center text-sm text-[#666d80]">
          <div class="">
            <div class="mb-[0.2rem] w-[1.64rem] text-base font-semibold leading-none text-[#061023]">{{ form.totalprice }}</div>
            <div class="w-[1.9rem] leading-14">{{ $t('总价') }}({{ form.currency }})</div>
          </div>
          <div class="">
            <div class="mb-[0.2rem] w-[1.64rem] text-base font-semibold leading-none text-[#061023]">{{ form.price }}</div>
            <div class="w-[1.9rem] leading-14">{{ $t('价格') }}({{ form.currency }})</div>
          </div>
          <div class="">
            <div class="mb-[0.2rem] w-[1.64rem] text-base font-semibold leading-none text-[#061023]">{{ form.volume }}</div>
            <div class="w-[1.9rem] leading-14">{{ $t('数量') }}({{ form.crypto }})</div>
          </div>
        </div>
      </div>
      <!-- 底部button -->
      <div v-if="['waitpayment', 'waitconfirm'].includes(form.status)" class="van-safe-area-bottom absolute inset-x-4 bottom-0 mb-5 flex justify-between text-16 text-[#666D80]">
        <div class="mr-4 flex-1 cursor-pointer rounded-3xl border border-[#d0d8e2] text-center leading-48" @click="handleBotton('cancel')">{{ $t('取消订单') }}</div>
        <div
          class="flex-1 cursor-pointer rounded-3xl border border-transparent bg-my text-center leading-48 text-white"
          :class="{ 'disabled-btn': ['waitconfirm'].includes(form.status) }"
          @click="handleBotton('payment')"
        >
          {{ $t('我已付款') }}
        </div>
      </div>
    </template>

    <!-- <ContactTheMerchant v-else /> -->
    <Chat v-else :curr-item="form" class="size-full" />
    <!-- 安全密码弹窗 -->
    <SafePassword ref="safeRef" @submit="apiSetOrderStatus" />
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue'
import { closeToast, showLoadingToast, showToast } from 'vant'
import Top from '@/components/Top.vue'
import { _c2cOrderInfo, _c2cOrderStatus } from '@/api/api'
import IconSvg from '@/components/IconSvg.vue'
import { _copyTxt } from '@/utils'
import store, { useMapState } from '@/store'
import SafePassword from '@/components/SafePassword.vue'
import { useCountdown } from '@/utils/hooks'
import Chat from './Chat.vue'
import router from '@/router'

const { sessionToken } = useMapState(['sessionToken'])
const [countState, countDispatch] = useCountdown()
const { t } = useI18n()
const statusEnum = {
  waitpayment: { name: t('待付款'), title: t('待付款'), color: 'var(--main-color)' },
  waitconfirm: { name: t('待确认'), title: t('待确认'), color: 'var(--main-color)' },
  done: { name: t('交易完成'), title: t('交易完成'), color: '#18B762' },
  cancel: { name: t('交易已取消'), title: t('交易完成'), color: '#8F92A1' },
}
const offsetEnum = {
  buy: t('买入'),
  sell: t('卖出'),
}
// eslint-disable-next-line prefer-const
let statusApiValue = null
const form = reactive({
  order_no: '', // 订单号
  offset: '', // 方向
  crypto: '', // 加密货币
  currency: '', // 计价货币
  price: 0, // 价格
  volume: 0, // 数量
  totalprice: 0, // 总价
  status: '', // 状态
  date: '', // 订单时间，格式：MM-dd hh:mm
  endtime: '', // 结束时间
  bank_status: '', // 银行状态
  bank_name: '', // 银行
  bank_card_number: '', // 银行卡号
  account_name: '', // 账户
  merchant_name: '', // 商户-名称
  merchant_volume: 0, // 商户-成交量
  merchant_volumerate: 0, // 商户-成交率
  merchant_avetime: '', // 商户-平均时效
  unread: 0, // 对话未读消息数
})
const list = reactive([])
const loading = ref(false)
const tabsValue = ref('buy')
const safeRef = ref(null)
// eslint-disable-next-line no-undef
const route = useRoute()
const changeTab = name => {
  tabsValue.value = name
  list.length = 0
  if (name === 'buy') {
    getInfo()
  }
}
const getInfo = async () => {
  showLoadingToast({ duration: 0, loadingType: 'spinner' })
  try {
    const res = await _c2cOrderInfo({
      order_no: route.query.order_no,
    })
    if (res.data) {
      Object.assign(form, res.data)
      countDispatch('start', form.endtime)
    }
  } finally {
    setTimeout(closeToast, 500)
  }
}

const apiSetOrderStatus = async safeword => {
  showLoadingToast({ duration: 0, loadingType: 'spinner' })
  try {
    await _c2cOrderStatus({
      order_no: form.order_no,
      token: sessionToken.value,
      status: statusApiValue, // 我已付款  [ payment ]放行  [ confirm ]取消  [ cancel ]
      safeword,
    })
    setTimeout(() => showToast(statusApiValue === 'payment' ? t('付款成功') : t('取消成功')), 300)
    getInfo()
  } catch (e) {
    loading.value = false
    setTimeout(closeToast, 500)
  }
}

function handleBotton(val) {
  if (val === 'payment' && !form.bank_card_number) {
    getInfo()
    return showToast(t('请等待商家提供银行卡'))
  }
  statusApiValue = val
  safeRef.value.open()
}
const goBack = () => {
  if (tabsValue.value === 'contactTheMerchant') {
    tabsValue.value = form.offset
  } else {
    router.back()
  }
}
//  复制
const copy = text => {
  _copyTxt(text)
  showToast(t('已复制'))
}

onUnmounted(() => {
  countDispatch('stop')
})
function onInit() {
  store.dispatch('updateSessionToken')
  getInfo()
}
onInit()
</script>

<style lang="less" scoped>
.orderDetails {
  width: 7.5rem;
  padding: 1.12rem 0.32rem 0;
  height: 100vh;
  display: flex;
  flex-direction: column;
  position: relative;

  // margin-top: -0.32rem;

  .tabs-buy {
    display: flex;
    align-items: center;
    justify-content: space-between;
    line-height: 0.68rem;
    margin: 0 0 0.2rem;
    border: 0.5px solid #d0d8e2;
    width: 100%;
    border-radius: 0.68rem;

    .tab {
      color: #666d80;
      margin: 0;
      width: 100%;
      // width: 80px;
      text-align: center;
      border-radius: 0.68rem;
      position: relative;
    }

    .active_tab {
      font-weight: bold;
      color: white;
      background: var(--main-color);
      text-align: center;
    }
  }
  .box-3 {
    &::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 0.34rem;
      border: 1px solid #d0d8e2;
      border-top-left-radius: 0.34rem;
      border-top-right-radius: 0.34rem;
      border-bottom-color: transparent;
    }
  }
  .dashed-my {
    background: linear-gradient(to left, transparent 0%, transparent 50%, #eff3f8 50%, #eff3f8 100%);
    background-size: 0.36rem 0.02rem;
    background-repeat: repeat-x;
  }
  .disabled-btn {
    background: #f5f7fa;
    border-color: #f5f7fa;
    color: #c0c4cc;
    cursor: not-allowed;
    pointer-events: none;
  }
}
</style>

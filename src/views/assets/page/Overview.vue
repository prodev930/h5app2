<!-- 资产总览 -->
<template>
  <div class="page_assets_overview">
    <!-- 总览 -->
    <OverviewCard>
      <div class="top">
        <div class="title">{{ $t('总资产') }}<span>(USDT)</span></div>
        <div class="eyes" @click="hidden = !hidden">
          <img src="/static/img/assets/eye_o.svg" v-show="!hidden" />
          <img src="/static/img/assets/closed_eye.svg" v-show="hidden" />
        </div>
      </div>
      <div class="money">
        <span>{{ hidden ? '********' : assets.total || '0' }}</span>
      </div>
      <div class="navs">
        <div class="nav">
            <div class="nav_label">{{ $t('现金账户合计') }}</div>
            <div class="num">{{ hidden ? '********' : assets.money || '0' }}</div>
        </div>
        <div class="line" />
        <div class="nav">
          <div class="nav_label">{{ $t('持仓金额') }}</div>
          <div class="num">{{ hidden ? '********' : assets.ordervalue || '0' }}</div>
        </div>
      </div>
    </OverviewCard>
    

    <!-- 按钮 -->
    <Btns :money="assets.money" />
    
    <!-- 列表 -->
    <div class="tabs">
      <div ref="tab1" :key="1" class="tab" :class="{ open_tab: rightSwitch1 == true }" @click="rightSwitch1 = !rightSwitch1">
        <div class="tab_icon">
          <img src="/static/img/assets/cash_icon.svg" alt="img" />
        </div>
        <div class="name">{{ $t('现金账户') }}</div>
        <div class="amount">{{ assets.money || '0' }}</div>
        <div class="more">
          <img src="/static/img/common/menu.png?20241022" alt="img" />
        </div>
        <div class="rights">
          <div class="right" @click="jump('topUp', true)">
            {{ $t('充值') }}
          </div>
          <div class="right right--yellow" @click="jump('withdraw', true)">
            {{ $t('提现') }}
          </div>
          <div class="right right--green"  @click="jump('transfer', false, { from: 'stock', to: 'money' })">
            {{ $t('转入') }}
          </div>
          <div class="right right--red" @click="jump('transfer')">
            {{ $t('转出') }}
          </div>
        </div>
      </div>
      <div ref="tab2" :key="2" class="tab" :class="{ open_tab: rightSwitch2 == true }" @click="rightSwitch2 = !rightSwitch2">
        <div class="tab_icon">
          <img src="/static/img/assets/stock_icon.svg" alt="img" />
        </div>
        <div class="name">{{ $t('股票') }}</div>
        <div class="amount">{{ new Decimal(assets && assets.stock ? assets.stock : 0).add(assets && assets.stock_value ? assets.stock_value : 0) }}</div>
        <div class="more">
          <img src="/static/img/common/menu.png" alt="img" />
        </div>
        <div class="rights">
          <div class="right"  @click="jump('topUp', true)">
            {{ $t('充值') }}
          </div>
          <div class="right right--yellow" @click="jump('withdraw', true)">
            {{ $t('提现') }}
          </div>
        </div>
      </div>
      <div ref="tab3" :key="3" class="tab" :class="{ open_tab: rightSwitch3 == true }" @click="rightSwitch3 = !rightSwitch3">
        <div class="tab_icon">
          <img src="/static/img/assets/contract_icon.svg" alt="img" />
        </div>
        <div class="name">{{ $t('合约') }}</div>
        <div class="amount">
          {{ new Decimal(assets && assets.futures ? assets.futures : 0).add(assets && assets.futures_value ? assets.futures_value : 0) }}
        </div>
        <div class="more">
          <img src="/static/img/common/menu.png" alt="img" />
        </div>
        <div class="rights">
          <div class="right" @click="jump('topUp', true)">
            {{ $t('充值') }}
          </div>
          <div class="right right--yellow" @click="jump('withdraw', true)">
            {{ $t('提现') }}
          </div>
        </div>
      </div>
      <div ref="tab5" :key="5" class="tab" :class="{ open_tab: rightSwitch5 == true }" @click="rightSwitch5 = !rightSwitch5">
        <div class="tab_icon">
          <img src="/static/img/assets/out_icon.svg" alt="img" />
        </div>
        <div class="name">{{ $t('外汇') }}</div>
        <div class="amount">
          {{ new Decimal(assets && assets.forex ? assets.forex : 0).add(assets && assets.forex_value ? assets.forex_value : 0) }}
        </div>
        <div class="more">
          <img src="/static/img/common/menu.png" alt="img" />
        </div>
        <div class="rights">
          <div class="right" @click="jump('topUp', true)">
            {{ $t('充值') }}
          </div>
          <div class="right right--yellow" @click="jump('withdraw', true)">
            {{ $t('提现') }}
          </div>
        </div>
      </div>
    </div>
    
    <!-- 类型选择弹窗 -->
    <ActionSheet v-model:show="showAS" teleport="body" :actions="actions" :title="$t('记录列表')" @select="onSelect" />
  </div>
</template>

<script setup>
import { Icon, ActionSheet } from 'vant'
import { ref, computed, onMounted } from 'vue'
import { useClickAway } from '@vant/use'
import Decimal from 'decimal.js'
import { useI18n } from 'vue-i18n'
import { _assets } from '@/api/api'
import store from '@/store'
import router from '@/router'
import AccountCheck from '@/components/AccountCheck.vue'
import Btns from './components/Btns'
import OverviewCard from './components/OverviewCard'

const { t } = useI18n()
const hintNum = computed(() => store.state.hintNum || 0)

const showAS = ref(false)
const actions = computed(() => {
  return [
    { name: t('充值记录'), value: '0' },
    { name: t('提现记录'), value: '1' },
    { name: t('划转记录'), value: '2' },
  ]
})
const onSelect = item => {
  showAS.value = false
  router.push({
    name: 'recordList',
    query: {
      tab: item.value,
    },
  })
}

const emits = defineEmits(['setLoading', 'openRecordPopup'])
const token = computed(() => store.state.token || '')
const hidden = ref(false) // 隐藏数字

const openRecordPopup = () => {
  emits('openRecordPopup')
}

// 功能区域控制
const tab1 = ref()
const tab2 = ref()
const tab3 = ref()
const tab5 = ref()
const rightSwitch1 = ref(false)
const rightSwitch2 = ref(false)
const rightSwitch3 = ref(false)
const rightSwitch5 = ref(false)
useClickAway(tab1, () => {
  rightSwitch1.value = false
})
useClickAway(tab2, () => {
  rightSwitch2.value = false
})
useClickAway(tab3, () => {
  rightSwitch3.value = false
})
useClickAway(tab5, () => {
  rightSwitch5.value = false
})

// 刷新总资产
const assets = computed(() => store.state.assets || {})
const getAssets = () => {
  if (!token.value) return
  store.dispatch('updateAssets').finally(() => {
    emits('setLoading', false)
  })
  store.dispatch('updateWallet')
}

onMounted(() => {
  getAssets()
})

const refresh = () => {
  getAssets()
}

defineExpose({
  refresh,
})

const jump = (name, check = false, query) => {
  router.push({
    name,
    query,
  })
}
</script>

<style lang="less" scoped>
.page_assets_overview {
  padding: 0.32rem 0;
  .top {
    font-size: 0.28rem;
    font-weight: 400;
    display: flex;
    align-items: center;
    height: 0.32rem;
    .title {
      color: #fff;
      margin-right: 0.08rem;
      font-size: 0.3rem;
      span{
        font-size: 0.24rem;
      }
    }

    .eyes {
      width: 0.32rem;
      height: 0.32rem;
      color: #fff;
    }
  }

  .money {
    color: #FFF;
    font-family: "PingFang SC";
    font-size: 0.52rem;
    font-style: normal;
    font-weight: 600;
    line-height: 0.52rem; 
    margin-top: 0.26rem;
  }

  .navs {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 1.32rem;
    background-color: #fff;
    border-radius: 0.32rem;
    margin-top: 0.34rem;
    .line {
      width: 1px;
      height: 0.76rem;
      background-color: #EFF3F8;
    }
    .nav{
      flex: 1;
      display: flex;
      justify-content: center;
      align-items: center;
      flex-direction: column;
    }
    .nav_label{
      color: #8F92A1;
      font-size: 0.28rem;
      line-height: 100%;
    }

    .num {
      color: #061023;
      font-size: 0.3rem;
      font-weight: 600;
      line-height: 0.3rem; 
      margin-top: 0.2rem;

    }
  }

  .tabs {
    position: relative;
    padding: 0 0.32rem;
    .tab {
      padding: 0 0.32rem;
      overflow: hidden;
      height: 1.04rem;
      margin-top: 0.12rem;
      border-radius: 0.32rem;
      background: #F5F7FC;
      position: relative;
      display: flex;
      align-items: center;
      justify-content: space-between;
      
      .name{
        font-size: 0.3rem;
      }
      &:active {
        background-color: rgba(237, 237, 237, 0.87);
      }

      .tab_icon {
        width: 0.52rem;
        height: 0.52rem;
        margin-right: 0.16rem;
        background-color: #fff;
        border-radius: 50%;
        box-sizing: border-box;
        padding: 0.1rem;
      }
      
      .more {
        width: 0.3rem;
        height: 0.3rem;
      }

      .amount {
        flex: 1;
        text-align: right;
        padding: 0 0.2rem;
        font-size: 0.32rem;
        font-weight: 600;
        transition: .3s;
      }

      .rights {
        display: flex;
        height: 100%;
        position: absolute;
        right:-100%;
        top:0;
        transition: .3s;
        .right {
          height: 100%;
          width: 1.04rem;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          font-size: 0.3rem;
          font-weight: 400;
          text-align: center;
          color: #fff;
          background-color: #014CFA;
        }
        .right--yellow{
          background-color: #FFAF2A;
        }
        .right--green{
          background-color: #00AF70;
        }
        .right--red{
          background-color: #E8503A;
        }
        .right:first-child{
          border-radius: 0.32rem 0rem 0rem 0.32rem;
        }
        .right:last-child{
          border-radius: 0rem 0.32rem 0.32rem 0rem;
        }
      }
    }
    .tab:first-child{
      margin-top:0px;
    }

    .open_tab {
      .name{
        display: none;
      }
      .amount {
        text-align: left;
        padding:0px;
      }
      .rights{
        right: 0;
      }
    }
  }
}
</style>

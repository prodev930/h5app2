<!-- 现金账户 -->
<template>
  <div class="page_assets_cash">
    <!-- 总览 -->

    <OverviewCard>
      <div class="top">
        <div class="title">{{ $t('现金账户') }}<span>(USDT)</span></div>
        <div class="eyes" @click="hidden = !hidden">
          <img src="/static/img/assets/eye_o.svg" v-show="!hidden" />
          <img src="/static/img/assets/closed_eye.svg" v-show="hidden" />
        </div>
      </div>
      <div class="money">
        <span>{{ hidden ? '********' : mainWallet.amount || '0.00' }}</span>
      </div>
      <div class="navs">
        <div class="nav">
            <div class="nav_label">{{ $t('现金') }}</div>
            <div class="num">{{ hidden ? '********' : assets.money || '0' }}</div>
        </div>
        <div class="line" />
        <div class="nav">
          <div class="nav_label">{{ $t('冻结') }}</div>
          <div class="num">{{ hidden ? '********' :  '--' }}</div>
        </div>
      </div>
    </OverviewCard>

    <!-- 按钮 -->
    <Btns :money="assets.money" />

    <div class="tabs">
      <div class="tab_title">
        <Switch v-model="show0" size="0.24rem" />
        <span class="tab_title_desc">{{ show0 ? $t('已隐藏余额为0的币种') : $t('已展示余额为0的币种') }}</span>
      </div>
      <div v-for="(item, i) in showList" :key="i" class="tab" :class="{ open_tab: switchs[i] == true }" @click="switchOpen(i, $event)">
        <div class="tab_icon">
          <img :src="`/static/img/crypto/${item.name}.png`" alt="img" />
        </div>
        <div class="name">{{ item.name }}</div>
        <div class="amount">{{ item.amount }}</div>
        <div class="more">
          <img src="/static/img/common/menu.png?20241022" alt="img" />
        </div>
        <div class="rights">
          <div class="right" @click="goTopUp(item.currency.toUpperCase())">
            {{ $t('充值') }}
          </div>
          <div class="right right--yellow">
            {{ $t('提现') }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { Icon, Switch } from 'vant'
import store from '@/store'
import router from '@/router'
import { _cryptoCoin } from '@/api/api'
import Btns from './components/Btns'
import OverviewCard from './components/OverviewCard'

const emits = defineEmits(['setLoading'])
const token = computed(() => store.state.token || '')
const hidden = ref(false)

// 刷新现金钱包
const assets = computed(() => store.state.assets || {})
const wallet = computed(() => store.state.wallet || []) // 钱包
const mainWallet = computed(() => (store.state.wallet || []).find(a => a.currency == 'main') || {}) // 主钱包
const getAssets = () => {
  if (!token.value) return
  // emits('setLoading', true)
  store.dispatch('updateWallet').finally(() => {
    emits('setLoading', false)
  })
  // store.dispatch('updateOrderHint')
}
const show0 = ref(false) // 是否隐藏余额为0的钱包
const coinMap = computed(() => store.state.coinMap || {})
const showList = computed(() => {
  const arr = [...wallet.value]
  for (const key in coinMap.value) {
    const target = wallet.value.find(item => item.currency == key)
    if (target) {
      if (!arr.find(item => item.currency == key)) {
        arr.push(target)
      }
    } else {
      arr.push({
        currency: key,
        name: key,
        amount: 0,
      })
    }
  }
  if (show0.value) return arr.filter(item => item.amount)
  return arr
})
_cryptoCoin({ dedup: false }).then(res => {
  store.commit('setCoinMap', res.data || [])
})

// 展开状态
const switchs = ref([])
const switchOpen = (i, e) => {
  switchs.value[i] = !switchs.value[i]
  switchs.value = switchs.value.map((item, index) => {
    return i == index ? item : false
  })
  e.stopPropagation()
}

// 跳转充值
const goTopUp = name => {
  router.push({
    name: 'topUp',
    query: {
      currency: name,
    },
  })
}

const removeSwitch = () => {
  switchs.value = switchs.value.map(() => {
    return false
  })
}

onMounted(() => {
  getAssets()
  document.querySelector('.page').addEventListener('click', removeSwitch)
})
onUnmounted(() => {
  try {
    document.querySelector('.page').removeEventListener('click', removeSwitch)
  } catch {}
})

const refresh = () => {
  getAssets()
}
defineExpose({
  refresh,
})

</script>

<style lang="less" scoped>
.page_assets_cash {
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

  .tab_title{
    height: 0.52rem;
    display: flex;
    align-items: center;
    &_desc{
      color:#8F92A1;
      font-size: 0.24rem;
      margin-left: 0.12rem;
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

<!-- 市场 -->
<template>
  <div v-if="activatedIncludes" ref="marketPageRef" class="page page_market">
    <IPODetail v-if="detail == '1'" @close-open-detail="closeOpenDetail" />
    <Subscription v-else-if="detail == '2'" @close-open-detail="closeOpenDetail" />
    <div class="boder-[#D0D8E2] absolute right-4 top-[0.25rem] z-20 flex size-[0.6rem] items-center justify-center rounded-50 border" @click="jump('search')">
      <Iconfonts name="icon-sousuo" :size="0.32" color="#666D80" />
    </div>
    <div class="absolute right-15 top-[0.25rem] z-10 h-[0.5rem] w-[1rem] bg-gradient-to-r from-transparent to-white" />
    <Tabs v-if="!pageLoading" v-model:active="active" type="card" class="tab_content tabs" :class="[openTab ? 'open_tabs' : 'close_tabs']" :swipeable="false" animated shrink @change="changeTab">
      <Tab class="optional" style="padding-left: 0px" name="option">
        <Optional v-if="activated && active == 'option'" ref="OptionalRef" />
        <template #title>
          <div class="tab_item">
            <span>自选</span>
          </div>
        </template>
      </Tab>
      <Tab name="buy">
        <template #title>
          <div class="tab_item">
            <div v-show="openTab" class="tab_item_icon">
              <img v-show="active != 'buy'" src="/static/img/market/buy.svg" alt="icon" />
              <img v-show="active == 'buy'" src="/static/img/market/buy2.svg" alt="icon" />
            </div>
            <span>买币</span>

            <div v-if="store.state.c2cUnreadTotal > 0" class="nav_num">{{ store.state.c2cUnreadTotal }}</div>
          </div>
        </template>
      </Tab>
      <Tab name="stock">
        <Stock v-if="active == 'stock'" />
        <template #title>
          <div class="tab_item">
            <div v-show="openTab" class="tab_item_icon">
              <img v-show="active != 'stock'" src="/static/img/market/stock.svg" alt="icon" />
              <img v-show="active == 'stock'" src="/static/img/market/stock2.svg" alt="icon" />
            </div>
            <span>股票</span>
          </div>
        </template>
      </Tab>
      <Tab name="contract">
        <Constract v-if="active == 'contract'" />
        <template #title>
          <div class="tab_item">
            <div v-show="openTab" class="tab_item_icon">
              <img v-show="active != 'contract'" src="/static/img/market/constract.svg" alt="icon" />
              <img v-show="active == 'contract'" src="/static/img/market/constract2.svg" alt="icon" />
            </div>
            <span>合约</span>
          </div>
        </template>
      </Tab>
      <Tab>
        <Foreign v-if="active == 5" />
        <template #title>
          <div class="tab_item">
            <div v-show="openTab" class="tab_item_icon">
              <img v-show="active != 5" src="/static/img/market/out.svg" alt="icon" />
              <img v-show="active == 5" src="/static/img/market/out2.svg" alt="icon" />
            </div>
            <span>外汇</span>
          </div>
        </template>
      </Tab>
      <Tab>
        <Foreign v-if="active == 5" />
        <template #title>
          <div class="tab_item">
            <div v-show="openTab" class="tab_item_icon">
              <img v-show="active != 5" src="/static/img/market/out.svg" alt="icon" />
              <img v-show="active == 5" src="/static/img/market/out2.svg" alt="icon" />
            </div>
            <span>黄金</span>
          </div>
        </template>
      </Tab>
    </Tabs>
    <buyCoin v-if="active === 'buy'" />

    <!-- </PullRefresh> -->
    <!-- </transition> -->
  </div>
</template>

<script setup>
import { Tab, Tabs, PullRefresh } from 'vant'
import { ref, onDeactivated, computed, onActivated, watch } from 'vue'
import router from '@/router'
import Optional from './components/Optional.vue'
import Stock from './components/Stock.vue'
import Financial from './components/Financial.vue'
import Foreign from './components/Foreign.vue'
import IPO from './components/IPO.vue'
import store from '@/store'
import { useSocket } from '@/utils/ws'
import IPODetail from '@/views/trade/IPODetail.vue'
import Subscription from '@/views/trade/Subscription.vue'
import NoData from '@/components/NoData.vue'
import Constract from './components/Constract.vue'
import Ai from './components/Ai.vue'
import buyCoin from './buyCoin/index.vue'
import Iconfonts from '@/components/Iconfonts.vue'
import { useBuyCoinState } from './buyCoin/state'

const { setScrollData } = useBuyCoinState()
const marketPageRef = ref()
const scrollData = useScroll(marketPageRef, {
  throttle: 400,
  onScroll: scrollHandler,
})
const openTab = ref(false)

const active = ref(sessionStorage.getItem('market_active') || 'option')
const OptionalRef = ref()
const StockRef = ref()
const IPORef = ref()
const reloading = ref(false)
const detail = ref(null)
const detailTransition = ref('slide-right')
provide('scrollData', scrollData)
setScrollData(scrollData)
const changeTab = key => {
  active.value = key
  sessionStorage.setItem('market_active', key)
  openTab.value = false
  setTimeout(() => {
    switch (key) {
      case 'option':
        OptionalRef.value && OptionalRef.value.init()
        break
      case 'stock':
        // StockRef.value && StockRef.value.init()
        break
      case 'ipo':
        IPORef.value && IPORef.value.init()
        break
    }
  }, 100)
}

// 预加载页面
const pageLoading = computed(() => store.state.pageLoading)
store.commit('setPageLoading', true)
Promise.all([import('@/views/Market/MarketInfo.vue'), import('@/views/Market/Search.vue'), import('@/views/Market/IpoSubscription.vue')]).finally(() => {
  store.commit('setPageLoading', false)

  setTimeout(() => {
    changeTab(active.value)
  }, 0)
})

const { startSocket } = useSocket()
const activated = ref(false)
const activatedIncludes = computed(() => {
  // 需要缓存的页面
  return ['option', 'stock', 'contract', '4', '5'].includes(active.value) ? activated.value : true
})
function scrollHandler(e) {
  if (openTab.value) {
    openTab.value = false
  }
}
onActivated(() => {
  activated.value = true
  setTimeout(() => {
    if (active.value == 'option') {
      OptionalRef.value && OptionalRef.value.init()
    }
  }, 100)
})
onDeactivated(() => {
  setTimeout(() => {
    activated.value = false
  }, 100)
  // 取消订阅
  const socket = startSocket(() => {
    socket && socket.emit('realtime', '') // 价格变化
    socket && socket.emit('snapshot', '') // 快照数据
    socket && socket.off('realtime')
    socket && socket.off('snapshot')
  })
})
// 跳转
const jump = name => {
  router.push({
    name,
  })
}
</script>

<style lang="less" scoped>
.page_market {
  padding-bottom: 1.4rem;
  height: 100%;
  overflow-y: auto;
  position: relative;
  width: 7.5rem;
  &:has(.open_tabs) {
    :deep(.addBtn) {
      top: 1.76rem;
    }
  }

  :deep(.van-sticky) {
    background-color: #fff;
    padding-top: 0.2rem;
  }

  .mytab_title {
    display: flex;
    align-items: center;
    transition: all ease 0.3s;

    > span {
      margin-left: 0.08rem;
    }

    .mytab_title_icon {
      width: 0.32rem;
      height: 0.32rem;
      line-height: 1;
      position: relative;
      top: -0.02rem;
    }
  }

  .mytab_title_active {
    .mytab_title_icon {
      width: 0.28rem;
      height: 0.28rem;
    }
  }

  .title {
    padding: 0 0.24rem 0 0.32rem;
    height: 1.12rem;
    font-weight: 600;
    color: #0d0d12;
    line-height: 0.5rem;
    font-size: 0.5rem;
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 0.1rem;
    position: relative;
  }

  .search_block {
    background-color: #fff;
    border: 1px solid #eeeff1;
    height: 0.8rem;
    border-radius: 0.2rem;
    display: flex;
    align-items: center;
    justify-content: flex-start;
    padding: 0 0.32rem;
    font-size: 0.28rem;
    color: #9ea3ae;
    margin: 0 0.32rem 0.12rem 0.32rem;

    .search_icon {
      width: 0.4rem;
      height: 0.4rem;
      margin-right: 0.2rem;
    }
  }

  .search_box {
    position: absolute;
    z-index: 9;
    top: 0.2rem;
    right: 0.24rem;
    width: 0.64rem;
    height: 0.64rem;
  }

  .tabs {
    position: relative;
    overflow-x: auto;

    :deep(.tab_item) {
      display: flex;
      align-items: center;
      justify-content: center;
      line-height: 0;
      position: relative;

      .tab_item_icon {
        width: 0.3rem;
        height: 0.3rem;
        margin-right: 0.04rem;
        font-size: 0.3rem;
      }

      .nav_num {
        width: 0.28rem;
        height: 0.28rem;
        display: flex;
        align-items: center;
        justify-content: center;
        background-color: #ff3b30;
        font-size: 0.2rem;
        color: #fff;
        font-weight: 400;
        border-radius: 50%;
        position: absolute;
        top: -0.3rem;
        right: -0.12rem;
      }
    }

    .tab_icon {
      width: 100%;
      height: 100%;
      line-height: 0;
      position: absolute;
      top: 0;
      left: 0;
      padding: 0.1rem;
    }

    :deep(.my_icon) {
      position: absolute;
      top: 0;
      right: 1rem;
      padding-right: 0 !important;
      padding-left: 0 !important;
      border-radius: 50%;
      border: 1px solid #edf2f7;
      width: 0.6rem;
      height: 0.6rem;
      display: flex;
      align-items: center;
      justify-content: center;
      background-color: #fff;
    }

    :deep(.my_icon2) {
      position: absolute;
      top: 0;
      right: 0.2rem;
      padding-right: 0 !important;
    }

    :deep(.van-tabs__nav--card) {
      border: none;
    }

    :deep(.van-tab--card) {
      border-right: none;
      color: #666d80;
    }

    :deep(.van-tab--card.van-tab--active) {
      background-color: transparent;
      color: #08090e;
      font-weight: 600;
      font-size: 0.5rem;
      position: relative;
      // border-bottom: 3px solid #014cfa;
      // border-width: 10px;
      .tab_item {
        z-index: 1;
      }
      &::after {
        content: '';
        position: absolute;
        width: 0.6rem;
        height: 0.2rem;
        background-color: var(--main-color);
        border-radius: 0.2rem;
        position: absolute;
        bottom: 0.06rem;
        padding-left: 0;
      }
    }

    :deep(.van-tab--shrink) {
      padding-left: 0;
      padding-right: 0.4rem;
    }

    :deep(.van-tabs__wrap) {
      height: 0.8rem;
      border-bottom: 1px solid rgba(0, 0, 0, 0);
      position: relative;
      padding-right: 1.7rem;
      // 源14 多8
      margin-top: 0.12rem;
      margin-bottom: 0.24rem;
    }

    :deep(.van-tabs__nav--card) {
      height: 0.8rem;
      width: 100%;
      position: static;
    }

    :deep(.van-tab) {
      line-height: 0.6rem;
      font-size: 0.28rem;
    }
  }

  .open_tabs {
    z-index: 999;
    position: relative;

    :deep(.my_icon) {
      right: 0.2rem;
    }

    :deep(.van-sticky) {
      height: 1.6rem !important;
      border-bottom-left-radius: 0.6rem;
      border-bottom-right-radius: 0.6rem;
      // position: relative;
      top: 0;
      left: 0;
      width: 100%;
      z-index: 9999;
    }

    :deep(.van-tabs__wrap) {
      height: 1.4rem;
      padding-right: 1.2rem;
    }

    :deep(.van-tabs__nav--card) {
      height: 1.2rem;
      flex-wrap: wrap;
      overflow: hidden;
    }
  }
}
</style>

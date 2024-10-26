<!-- 买币 -->
<template>
  <div class="page-buycoin">
    <Tabs v-if="!pageLoading" v-model:active="active" class="tabs" :swipeable="false" animated color="#014CFA" shrink @change="e => onChange(e)">
      <Tab :title="$t('快捷区')" name="0">
        <Faster />
      </Tab>
      <Tab :title="$t('自选区')" name="1">
        <Self ref="selfRef" />
      </Tab>
      <Tab :title="$t('我的订单')" name="2">
        <List ref="listRef" />
        <template #title>
          <div class="tab_item">
            <span>{{ $t('我的订单') }}</span>
            <div v-if="store.state.c2cUnreadTotal > 0" class="nav_num">{{ store.state.c2cUnreadTotal }}</div>
          </div>
        </template>
      </Tab>
    </Tabs>
  </div>
</template>

<script>
export default { name: 'Buycoin' }
</script>

<script setup>
/* eslint-disable */
import { Tab, Tabs } from 'vant'
import { ref, onMounted, onUnmounted, computed, nextTick } from 'vue'
import { useSocket } from '@/utils/ws'
import Faster from './Faster.vue'
import List from './List.vue'
import Self from './Self.vue'
import store from '@/store'
import { useBuyCoinState } from './state'
/* eslint-enable */
const { startSocket } = useSocket()
const token = computed(() => store.state.token)
const scrollData = inject('scrollData')
const positionValue = ref('relative')
// 订阅
const currLoading = ref(false)
const buycoinScrollTop1 = useSessionStorage('buycoinScrollTop1')
const buycoinScrollTop2 = useSessionStorage('buycoinScrollTop2')
const { active, selfRef, listRef, onChange } = useBuyCoinState()

const subs = () => {
  const socket = startSocket(() => {
    socket && socket.off('user')
    socket && socket.off('c2corder')
    socket && socket.emit('user', token.value)
    socket && socket.emit('c2corder', '#all')
    currLoading.value = true
    store.commit('setC2cList', [])
    socket.on(
      'c2corder',
      useThrottleFn(res => {
        store.commit('setC2cList', res.data || [])
        currLoading.value = false
      }, 500)
    )
  })
}
// 取消订阅
const cancelSubs = () => {
  const socket = startSocket(() => {
    socket && socket.off('user')
    socket && socket.off('c2corder')
    socket && socket.emit('user', '')
    socket && socket.emit('c2corder', '')
  })
}

const pageLoading = ref(true)

// watch(
//   () => active.value,
//   newValue => {
//     if (newValue !== active2) onChange(active.value)
//   }
// )
watch(
  () => store.state.bottomTabBarValue,
  newValue => {
    if (newValue === 'market') {
      onChange(active.value)
    }
  }
)
watch(
  () => scrollData.y.value,
  (val, oldVal) => {
    if (val > 100) {
      if (val > oldVal) {
        // 向下滚动
        positionValue.value = 'relative'
      } else {
        // 向上滚动
        positionValue.value = 'sticky'
      }
    } else {
      positionValue.value = 'relative'
    }
    switch (active.value) {
      case '1':
        buycoinScrollTop1.value = val
        break
      case '2':
        buycoinScrollTop2.value = val
        break
    }
  }
)
onMounted(() => {
  setTimeout(() => {
    pageLoading.value = false
  }, 300)
  if (token.value) {
    subs()
  }
})
onUnmounted(() => {
  buycoinScrollTop1.value = null
  buycoinScrollTop2.value = null
  cancelSubs()
})
</script>

<style lang="less" scoped>
.page-buycoin {
  width: 7.5rem;
  .tabs {
    > :deep(.van-tabs__wrap) {
      box-sizing: unset;
      background: #fff;
      margin: 0 0.32rem;
      height: 0.8rem;
      padding: 0.2rem 0 0.12rem !important;
      position: v-bind(positionValue) !important;
      top: 0;
      left: 0;
      z-index: 999;
      margin: 0 0.32rem 0.2rem;
      .van-tabs__nav--complete {
        overflow: visible;
        padding: 0;
      }
      > .van-tabs__nav {
        border-radius: 0.32rem;
        background: #eff3f8 !important;
        position: relative;
        display: flex;
        justify-content: space-between;
        background: initial;
        .van-tabs__line {
          display: none;
        }
        .van-tab {
          width: 33%;
          color: #666d80;
        }
        .van-tab--active {
          box-shadow: 0px -2px 5px 0px #014cfa1a;
          background: white;
          padding: 0;
          border-radius: 0.32rem;
          height: 120%;
          transform: translateY(-10%);
          color: #014cfa;
          &:first-child {
            border-end-end-radius: 0;
          }

          &:nth-child(2) {
            border-end-start-radius: 0;
            border-end-end-radius: 0;
          }

          &:nth-child(3) {
            border-end-start-radius: 0;
          }
        }
        .van-tab__text {
          font-size: 0.32rem;
        }
        // &::after {
        //     content: '';
        //     width: 100%;
        //     height: 0.02rem;
        //     background-color: #3B82F6;
        //     position: absolute;
        //     bottom: 0.32rem;
        //     left: 0;
        //     opacity: 0.3;
        // }
      }
    }
  }
}
</style>

<!-- 底部导航 -->
<template>
  <div class="max-width bottom_nav">
    <div v-for="(item, i) in navs" :key="i" class="bottom_nav_item" :class="[checkActive(item) ? 'bottom_nav_active' : '']" @touchstart="handleClick(item, $event)" @click="handleClick(item)">
      <div class="bottom_nav_icon">
        <iconpark-icon v-if="!checkActive(item)" :name="item.icon" />
        <iconpark-icon v-if="checkActive(item)" :name="item.icon2" />
      </div>

      <div class="bottom_nav_name">{{ item.name }}</div>

      <!-- c2c角标 -->
      <div v-if="item.route == 'market' && store.state.c2cUnreadTotal > 0" class="nav_num">{{ store.state.c2cUnreadTotal }}</div>
      <!-- 角标 -->
      <div v-if="item.route == 'user' && storeChat.state.messageNum > 0" class="nav_num">{{ storeChat.state.messageNum }}</div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'
import router from '@/router'
// import { _playVoice } from "@/utils/voice"
import eventBus from '@/utils/eventBus'

import store from '@/store'
import storeChat from '@/store/chat'

const route = useRoute()
const activeRoute = computed(() => route.name)
const token = computed(() => store.state.token)

const navs = ref([
  { name: '首页', route: 'home', icon: 'shouye1', icon2: 'shouye2' },
  { name: '市场', route: 'market', children: ['market_info', 'financial_info', 'trading_rules'], icon: 'shichang1', icon2: 'shichang2' },
  { name: '交易', route: 'trade', icon: 'jiaoyi1', icon2: 'jiaoyi2' },
  { name: '资产', route: 'assets', children: ['transfer'], icon: 'zichan1', icon2: 'zichan2', needLogin: true },
  { name: '用户', route: 'user', children: ['account'], icon: 'yonghu1', icon2: 'yonghu2' },
])

const touchLoading = ref(false)
const handleClick = (item, e) => {
  if (!item.route) return
  if (touchLoading.value) return
  touchLoading.value = true
  setTimeout(() => {
    touchLoading.value = false
  }, 300)
  // _playVoice()
  if (item.needLogin && !token.value) {
    // return router.push({
    //     name: 'login',
    //     query: {
    //         reurl: route.name
    //     }
    // })
    eventBus.on('loginSuccess', () => {
      // 登录成功后继续跳转
      router.push({
        name: item.route,
      })
    })
    eventBus.on('loginFail', () => {
      // 关闭弹窗后移除监听
      eventBus.off('loginSuccess')
      eventBus.off('loginFail')
    })
    store.commit('setIsLoginOpen', true)
    return
  }
  store.commit('setBottomTabBarValue', item.route)
  router.push({
    name: item.route,
  })
  if (item.route == 'assets') {
    store.dispatch('updateAssets')
  }
}

const checkActive = item => {
  if (activeRoute.value == item.route || (item.children && item.children.includes(activeRoute.value))) return true
  return false
}
</script>

<style scoped lang="less">
.bottom_nav {
  border-top: 1px solid #eaeef3;
  background-color: #fff;
  display: flex;
  position: fixed;
  overflow: hidden;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 1.4rem;
  left: 50%;
  transform: translateX(-50%);
  z-index: 999;

  .bottom_nav_item {
    flex: 1;
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    color: #636468;
    position: relative;

    .bottom_nav_name {
      font-size: 0.24rem;
      line-height: 0.32rem;
      margin-top: 0.1rem;
    }

    .bottom_nav_icon {
      width: 0.48rem;
      height: 0.48rem;
      font-size: 0.48rem;
      object-fit: contain;
    }

    .nav_num {
      width: 0.32rem;
      height: 0.32rem;
      display: flex;
      align-items: center;
      justify-content: center;
      background-color: #ff3b30;
      font-size: 0.2rem;
      color: #fff;
      font-weight: 400;
      border-radius: 50%;
      position: absolute;
      top: 0.26rem;
      right: 0.3rem;
    }
  }

  .bottom_nav_active {
    color: #014cfa;
  }
}
</style>

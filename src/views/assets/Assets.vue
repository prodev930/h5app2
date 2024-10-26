<!-- 资产页 -->
<template>
  <div class="page page_assets">
    
    <!-- 头部 -->
    <HeaderTabs v-model:active="activeTab" :tabs="[$t('总资产'),$t('现金账户'),$t('股票'),$t('合约'),$t('交易机器人'),'IPO',$t('理财')]" @change="changeActiveTab(activeTab,true)" />
   

    <Swipe :autoplay="0" :initial-swipe="initialSwipe" :show-indicators="false" ref="swipe" @change="swipeChange">
        <SwipeItem>
            <div class="assets_body" v-if="loadedTab.indexOf(0) > -1">
                <Overview ref="overviewRef" @openRecordPopup="openRecordPopup" @setLoading="val => (loading = val)" />
            </div>
        </SwipeItem>
        <SwipeItem>
            <div class="assets_body" v-if="loadedTab.indexOf(1) > -1">
                <Cash ref="cashRef" @setLoading="val => (loading = val)" />
            </div>
        </SwipeItem>
        <SwipeItem>
            <div class="assets_body" v-if="loadedTab.indexOf(2) > -1">
                <Stock ref="stockRef" @setLoading="val => (loading = val)" />
            </div>
        </SwipeItem>
        <SwipeItem>
            <div class="assets_body" v-if="loadedTab.indexOf(3) > -1">
                <IpoBlock />
            </div>
        </SwipeItem>
        <SwipeItem>
            <div class="assets_body" v-if="loadedTab.indexOf(4) > -1">
                <Contract />
            </div>
        </SwipeItem>
        <SwipeItem>
            <div class="assets_body" v-if="loadedTab.indexOf(5) > -1">
                
            </div>
        </SwipeItem>
        <SwipeItem>
            <div class="assets_body" v-if="loadedTab.indexOf(6) > -1">
                <IPO  ref="ipoRef" @setLoading="val => (loading = val)" />
            </div>
        </SwipeItem>
        <SwipeItem>
            <div class="assets_body" v-if="loadedTab.indexOf(7) > -1">
                
            </div>
        </SwipeItem>
    </Swipe>

    
    <!-- 记录弹窗 -->
    <RecordList ref="RecordListRef" />

    <!-- 充提记录 -->
    <!-- <HintBlock v-if="route.name == 'assets' && hintNum" /> -->
  </div>
</template>

<script setup>
import { Tab, Tabs, PullRefresh,Swipe, SwipeItem } from 'vant'
import { ref, onMounted, computed, onActivated } from 'vue'
import { useRoute } from 'vue-router'
import Overview from './page/Overview.vue'
import Cash from './page/Cash.vue'
import Stock from './page/Stock.vue'
import IPO from './page/IPO.vue'
import Contract from './page/Contract.vue'
import RecordList from '@/components/RecordList.vue'
import store from '@/store'
import router from '@/router'
import HeaderTabs from '@/components/HeaderTabs.vue'

// import HintBlock from "@/components/HintBlock.vue"

const route = useRoute()
const hintNum = computed(() => store.state.hintNum || 0)

const RecordListRef = ref()
const activeTab = ref(0)
const initialSwipe = ref(activeTab.value)
const loadedTab = ref([activeTab.value])
const swipe = ref(null)
const changeActiveTab = (val,slideSwipe=false)=>{
    activeTab.value = val
    if(loadedTab.value.indexOf(val) == -1){
        loadedTab.value.push(val)
    }
    localStorage.tradeActiveTab = val
    if(slideSwipe && swipe.value){
        swipe.value.swipeTo(val)
    }
}
const swipeChange = (val)=>{
   changeActiveTab(val)
}


const loading = ref(false)
const disabled = ref(false)
const pageLoading = ref(false)

const openRecordPopup = () => {
  router.push({
    name: 'recordList',
    query: {
      tab: 0,
    },
  })
}

const overviewRef = ref()
const cashRef = ref()
const onRefresh = () => {
  switch (active.value) {
    case 'overview':
      overviewRef.value && overviewRef.value.refresh()
      break
    case 'cash':
      cashRef.value && cashRef.value.refresh()
      break
  }
}

onMounted(() => {
  // 下拉刷新状态监听
  setTimeout(() => {
    // const bodys = document.querySelectorAll('.tab_body')
    // bodys.forEach(item => {
    // item.addEventListener('scroll', (e) => {
    //     if (e.target.scrollTop > 0) {
    //         disabled.value = true
    //     } else {
    //         disabled.value = false
    //     }
    // })
    // })
  }, 500)
})

// 预加载页面
store.commit('setPageLoading', true)
const loadingList = [import('@/views/assets/Loan.vue'), import('@/views/assets/TopUp.vue'), import('@/views/assets/Transfer.vue'), import('@/views/assets/Withdraw.vue'), import('@/views/assets/Swap.vue')]
Promise.all(loadingList).finally(() => {
  store.commit('setPageLoading', false)
  setTimeout(() => {
    pageLoading.value = true
  }, 100)
})

onActivated(() => {
  // store.dispatch('updateOrderHint')
})
</script>

<style lang="less" scoped>
.page_assets {

  .assets_body {
      overflow-y: auto;
      height: calc(100vh - 2.52rem);
  }

}
</style>

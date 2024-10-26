<!-- 自选 -->
<template>
    <StockTable :scroll-box="'.optional'" class="market_optional" :loading="loading" :list="watchList" :type="type" />
</template>

<script setup>
import StockTable from "@/components/StockTable.vue"
// import router from "@/router"
import store from "@/store";
import { computed, ref } from "vue"
import { _watchlist, _del } from "@/api/api"
import { showLoadingToast, closeToast, showToast } from 'vant'
import { useSocket } from '@/utils/ws'
const { startSocket } = useSocket()

const type = ref('trade')


const token = computed(() => store.state.token || '')
const loading = ref(false)
const subs = () => { // 订阅 ws
    store.dispatch('subList', {
        commitKey: 'setMarketWatchList',
        listKey: 'marketWatchList',
        // proxyListValue: watchList.value
    })
}


const watchList = computed(() => store.state.marketWatchList || [])
const getWatchList = () => { // 获取订阅列表
    if (loading.value) return
    loading.value = true
    // if (watchList.value.length) {
    //     subs()
    // }
    _watchlist().then(res => {
        if (res.code == 200) {
            if (watchList.value.length) { // 有历史数据就更新
                const rs = res.data.map(item => {
                    const target = watchList.value.find(a => a.symbol == item.symbol)
                    if (target) {
                        Object.assign(target, item)
                        item = target
                    }
                    return item
                })
                store.commit('setMarketWatchList', rs || [])
            } else { // 没有就直接提交
                store.commit('setMarketWatchList', res.data || [])
            }

            setTimeout(() => {
                subs()
            }, 1000)
        }
    }).finally(() => {
        loading.value = false
    })
}

const init = () => {
    getWatchList()
}

defineExpose({
    init
})


// 移除收藏
const removeLoading = ref(false)
const remove = item => {
    if (removeLoading.value) return
    removeLoading.value = true
    showLoadingToast({
        duration: 0,
        loadingType: 'spinner',
    })
    _del({
        symbol: item.symbol
    }).then(res => {
        if (res.code == 200) {
            setTimeout(() => {
                showToast('移除成功')
            }, 300)
            const i = watchList.value.findIndex(a => a.symbol == item.symbol)
            if (i >= 0) {
                watchList.value.splice(i, 1)
                store.commit('setMarketWatchList', watchList.value)
                init()
                // 这里要移除监听，否则数据没同步会多出来
                const socket = startSocket(() => {
                    socket && socket.off('realtime')
                })
            }
        }
    }).finally(() => {
        closeToast();
        removeLoading.value = false
    })
}
</script>

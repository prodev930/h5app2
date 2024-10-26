<!-- 记录列表 -->
<template>
    <div class="page page_record_list">
        <Top :title="title" />

        <!-- 充值列表 -->
        <div ref="list_0" v-if="active == 0" class="list active_list">
            <NoData v-if="!loading && !list.length" />
            <template v-if="active == 0">
                <div v-for="(item, i) in list" :key="i" class="list_0_item">
                    <div class="date" v-if="i == 0 || getDate(item.date) != getDate(list[i - 1].date)">{{
                        getDate(item.date) }}</div>
                    <RechargeItem @close="showBottom = false" :item="item" />
                </div>
            </template>
            <LoadingMore class="active_more" :loading="loading" :finish="finish"
                v-if="((finish && list.length) || (!finish)) && active == 0" />
        </div>

        <!-- 提现列表 -->
        <div ref="list_1" class="list active_list" v-if="active == 1">
            <NoData v-if="!loading && !list.length" />
            <template v-if="active == 1">
                <div v-for="(item, i) in list" :key="i">
                    <WithdrawItem :item="item" />
                </div>
            </template>
            <LoadingMore class="active_more" :loading="loading" :finish="finish"
                v-if="((finish && list.length) || (!finish)) && active == 1" />
        </div>

        <!-- 划转记录 -->
        <div ref="list_2" class="list active_list" v-if="active == 2">
            <NoData v-if="!loading && !list.length" />
            <template v-if="active == 2">
                <div v-for="(item, i) in list" :key="i">
                    <TransferItem :item="item" />
                </div>
            </template>
            <LoadingMore class="active_more" :loading="loading" :finish="finish"
                v-if="((finish && list.length) || (!finish)) && active == 2" />
        </div>

        <!-- 兑换记录 -->
        <div ref="list_3" class="list active_list" v-if="active == 3">
            <NoData v-if="!loading && !list.length" />
            <template v-if="active == 3">
                <div v-for="(item, i) in list" :key="i">
                    <!-- <SwapItem :item="item" /> -->
                    <TransferItem :item="item" />
                </div>
            </template>
            <LoadingMore class="active_more" :loading="loading" :finish="finish"
                v-if="((finish && list.length) || (!finish)) && active == 3" />
        </div>
    </div>
</template>

<script setup>
import Top from '@/components/Top.vue';
import { Tab, Tabs } from 'vant';
import { ref, computed, onMounted, onBeforeUnmount } from "vue"
import { _depositList, _withdrawList, _transferLog, _converterLog } from "@/api/api"
import NoData from '@/components/NoData.vue';
import LoadingMore from "@/components/LoadingMore.vue"
import RechargeItem from "@/components/RecordItem/RechargeItem.vue"
import WithdrawItem from "@/components/RecordItem/WithdrawItem.vue"
import TransferItem from "@/components/RecordItem/TransferItem.vue"
import SwapItem from "@/components/RecordItem/SwapItem.vue"
import { useRoute } from "vue-router"

const route = useRoute()




const titles = ['充值记录', '提现记录', '划转记录', '兑换记录']
const active = ref(route.query.tab || 0)
const title = computed(() => titles[active.value])
const reqs = {
    0: _depositList,
    1: _withdrawList,
    2: _transferLog,
    // 3: _converterLog,
    3: _transferLog
}

// 初始化
const loading = ref(false)
const finish = ref(false)
const page = ref(0)
const list = ref([])
const init = () => {
    loading.value = false
    finish.value = false
    page.value = 0
    list.value = []
    initWatch()
    getData()
    setTimeout(() => {
        lastTop.value = 0
    }, 100)
}
const getData = () => { // 获取数据
    if (loading.value || finish.value) return
    loading.value = true
    page.value++
    // 先从缓存拿值
    if (page.value == 1) {
        try {
            list.value = JSON.parse(sessionStorage.getItem('popup_record_' + active.value) || '[]')
        } catch {

        }
    }
    const saveActive = active.value
    reqs[active.value]({
        page: page.value
    }).then(res => {
        if (saveActive != active.value) return // 不是当前列表的请求返回
        if (!res.data?.length) {
            finish.value = true
        }
        if (page.value == 1) { // 缓存首页数据
            list.value = res.data || []
            sessionStorage.setItem('popup_record_' + active.value, JSON.stringify(res.data || []))
        } else {
            list.value.push(...(res.data || []))
        }
    }).finally(() => {
        loading.value = false
    })
}

const lastTop = ref(0)
const scrollHandle = (event) => {
    // 获取当前滚动位置
    let scrollTop = event.target.scrollTop;
    // 更新上一次滚动位置
    lastTop.value = scrollTop;
    const rect = moreDom.getBoundingClientRect()
    if (rect.top <= totalHeight) {
        // 加载更多
        getData()
    }
}

let moreDom = ''
const totalHeight = window.innerHeight || document.documentElement.clientHeight;
// 滚动监听
const initWatch = () => {
    setTimeout(() => {
        destoryWatch()
        moreDom = document.querySelector('.active_more');
        document.querySelector('.page_record_list').addEventListener('scroll', scrollHandle)
    }, 300)
}
const destoryWatch = () => {
    document.querySelector('.page_record_list').removeEventListener('scroll', scrollHandle)
}

onMounted(() => {
    setTimeout(() => {
        init()
    }, 0)
})
onBeforeUnmount(() => {
    boforeClose()
})
const boforeClose = () => {
    destoryWatch()
}


// 获取日期
const getDate = str => {
    if (str) {
        return str.split(' ')[0] || str
    }
    return str
}
</script>

<style lang="less">
.page_record_list {
    padding-top: 1.12rem;
    height: 100%;
    overflow-y: auto;

    .rsl_tabs {
        .van-tabs__nav--card {
            border: none;
            margin: 0 0.76rem 0 0.32rem;
        }

        .van-tab--card {
            border-right: none;
            color: #061023;
            // background-color: #f5f5f5;
        }

        .van-tab--card.van-tab--active {

            background-color: #F6F8FF;
            border-radius: 0.3rem;
            color: #014CFA;
            font-weight: 500
        }

        .van-tab--shrink {
            padding: 0 0.24rem;
        }

        .van-tabs__wrap {
            height: 0.8rem;
            padding-bottom: 0.34rem;
        }

        .van-tabs__nav--card {
            height: 0.6rem;
        }

        .van-tab {
            line-height: 0.6rem;
            font-size: 0.28rem;
        }
    }

    &:has(.list_down) {
        border-top-left-radius: 0;
        border-top-right-radius: 0;
    }

    .close_icon {
        width: 0.32rem;
        height: 0.32rem;
        position: absolute;
        right: 0.24rem;
        top: 0.2rem;
        z-index: 999;
    }

    .list {
        padding: 0 0.32rem 0.32rem 0.32rem;
        transition: all ease .3s;
    }

    .list_down {
        height: calc(var(--app-height) - 1.2rem);
    }

    .list_0_item {
        .date {
            color: #343434;
            font-size: 0.28rem;
            font-weight: 600;
            line-height: 0.48rem;
            padding: 0.36rem 0;
        }
    }
}
</style>
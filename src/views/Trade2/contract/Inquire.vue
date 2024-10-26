<!-- 查询 -->
<template>
    <div class="inquire" v-if="token">
        <div class="tr th">
            <div class="td td-5">合约/状态</div>
            <div class="td td-4">开仓/可售</div>
            <div class="td td-4">现价/成本</div>
            <div class="td td-4">盈亏/盈亏比</div>
        </div>
        <NoData v-if="!loading && !contractInquireList.length" />

        <SwipeCell ref="items" v-for="(item, i) in contractInquireList" :key="i" disabled>
            <div class="tr">
                <div class="td td-5">
                    <div class="name">{{ item.symbol }}</div>
                    <div class="lever">
                        <div class="status">{{ item.lever }}X</div>
                        <div class="status" :class="'status-' + item.status">{{ statusMap[item.status] || '--' }}</div>
                    </div>
                </div>
                <div class="td td-4">
                    <div class="state" :class="'state-' + item.offset">{{ offsetMap[item.offset] || '--' }}</div>
                    <div class="amount">{{ item.unsold_volume || '--' }}</div>
                </div>
                <div class="td td-4">
                    <div class="price">{{ item.settled_price || '--' }}</div>
                    <div class="price">{{ item.open_price || '--' }}</div>
                </div>
                <div class="td td-4">
                    <div class="num" :class="!item.profit ? '' : (item.profit > 0 ? 'up' : 'down')">{{ item.profit ||
                        '--' }}</div>
                    <div class="num" :class="!item.ratio ? '' : (item.ratio > 0 ? 'up' : 'down')">{{
                        getRatio(item.ratio) }}</div>
                </div>
            </div>
        </SwipeCell>
        <LoadingMore :loading="loading" :finish="finish" v-if="(finish && contractInquireList.length) || (!finish)" />
    </div>

    <UnLogin @loginfinish="loginfinish" v-show="!token" />
</template>

<script setup>
import { computed, ref, onMounted, onUnmounted } from 'vue'
import { SwipeCell } from "vant"
import store from "@/store"
import NoData from '@/components/NoData.vue';
import LoadingMore from "@/components/LoadingMore.vue"
import { _futuresList } from "@/api/api"
import UnLogin from "@/components/UnLogin.vue"
import Decimal from 'decimal.js';


const loginfinish = () => {
    setTimeout(() => {
        init()
    }, 100)
}

const contractInquireList = computed(() => store.state.contractInquireList || [])
const token = computed(() => store.state.token)

const statusMap = ref({ // 仓位状态
    'none': '开仓',
    'lock': '锁定',
    'open': '持仓',
    'done': '平仓',
    'fail': '失败',
    'cancel': '已取消'
})
const offsetMap = ref({ // 涨跌状态
    'long': '买涨',
    'short': '买跌'
})
const leverTypeap = ref({ // 仓位
    'cross': '全仓',
    'isolated': '逐仓'
})
const priceTypeMap = ref({ // 价格类型
    'market': '市价',
    'limit': '限价'
})
const stopMap = ref({ // 止损类型
    'price': '价格',
    'amount': '金额',
    'ratio': '百分比'
})
const getRatio = (num) => {
    if (!num) return '--'
    return new Decimal(num).mul(100) + '%'
}


const page = ref(0)
const loading = ref(false)
const finish = ref(false)
const timeMap = ref({
    start_time: null,
    end_time: null
})
const init = (times) => {
    if (token.value) {
        if (times) {
            timeMap.value = times
        }
        page.value = false
        loading.value = false
        finish.value = false
        setTimeout(() => {
            getList()
        }, 0)
    }
}
const getList = () => {
    if (loading.value || finish.value) return
    page.value++
    const params = {
        ...timeMap.value,
        page: page.value
    }
    loading.value = true
    _futuresList(params).then(res => {
        if (page.value == 1) {
            store.commit('setContractInquireList', res.data || [])
        } else {
            const arr = contractInquireList.value
            arr.push(...LoadingMore(res.data || []))
            store.commit('setContractInquireList', arr)
        }
        if (!res.data?.length) {
            finish.value = true
        }
    }).finally(() => {
        loading.value = false
    })
}


let moreDom = null
const totalHeight = window.innerHeight || document.documentElement.clientHeight;
const scrolHandle = () => {
    const rect = moreDom.getBoundingClientRect()
    if (rect.top <= totalHeight) {
        // 加载更多
        getList()
    }
}
onMounted(() => {
    setTimeout(() => {
        try {
            moreDom = document.querySelector('.loading_more')
            document.querySelector('.page').addEventListener('scroll', scrolHandle)
        } catch {
        }
    }, 500)
})
onUnmounted(() => {
    try {
        document.querySelector('.page').removeEventListener('scroll', scrolHandle)
    } catch { }
})

defineExpose({
    init
})
</script>

<style lang="less" scoped>
.inquire {
    padding:0 0 1.6rem 0;
    .tr {
        padding: 0.2rem;
        background-color: #F5F7FC;
        display: flex;
        align-items: stretch;
        border-radius: 0.32rem;
        margin-top: 0.2rem;
    }
   

    .th {
        color: #8F92A1;
        font-size: 0.22rem;
        border-bottom: 1px solid #EFF3F8;
        padding: 0.48rem 0 0.24rem 0;
        background: none;
        margin-top:0px;
        
    }

    .td {
        text-align: center;
        flex-shrink: 0;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        line-height: 0.3rem;

        .name {
            font-size: 0.32rem;
            color: #061023;
            line-height: 0.32rem;
            margin-bottom: 0.18rem;
        }

        .lever {
            display: flex;
            align-items: center;
            
        }

        .status {
            color: #014CFA;
            height: 0.3rem;
            padding: 0 0.08rem;
            border-radius: 0.3rem;
            border:1px solid #014CFA;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 0.22rem;
            margin-right: 0.08rem;
        }
        

        .status-open {
            color: #18B762;
            border-color: #18B762;
        }

        .status-fail,
        .status-lock{
            color:#E8503A;
            border-color: #E8503A;
        }
        .status-none{
            color:#7E99D6;
            border-color:#7E99D6;
        }
 

        .state {
            width: 0.68rem;
            height: 0.36rem;
            color: #E8503A;
            border-radius: 0.12rem;
            background: rgba(232, 80, 58, 0.10);
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 0.24rem;
            margin:0 auto;
        }

        .state-short {
            color: #18B762;
            background-color: rgba(24, 183, 98, 0.08);
        }

        .amount {
            color: #061023;
            font-size: 0.28rem;
        }

        .price {
            color: #666D80;
            font-size: 0.24rem;
            
        }
        .price:first-child{
            color:#061023;
            font-size: 0.28rem;
            font-weight: 600;
            line-height: 0.36rem;
        }
        .num {
            color: #6C7B90;
            font-weight: 600;
            font-size: 0.24rem;
            text-align: right;
        }
        .num:first-child{
            font-size: 0.28rem;
            line-height: 0.36rem;
        }
    }

    .td-5 {
        flex: 5;
        text-align: left;
    }

    .td-4 {
        flex: 4;
    }
}
</style>
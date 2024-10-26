<!-- 兑换记录 -->
<template>
    <div class="page page_swap_record">
        <Top :title="'兑换记录'" />

        <div class="list">
            <NoData v-if="!loading && !list.length" />
            <div class="item" v-for="(item, i) in list" :key="i">
                <div class="date">{{ item.created || '--' }}</div>
                <div class="item_box" v-if="item.from">
                    <div class="top">
                        <div class="currency_icon">
                            <img :src="`/static/img/crypto/${item.from.toUpperCase()}.png`" alt="currency">
                        </div>
                        <span>{{ item.from.toUpperCase() }}</span>
                    </div>
                    <div class="amount">{{ item.amount_to }}</div>
                </div>
                <div>→</div>
                <div class="item_box">
                    <div class="top" style="justify-content: flex-end;">
                        <div class="currency_icon">
                            <img :src="`/static/img/crypto/${item.to.toUpperCase()}.png`" alt="currency">
                        </div>
                        <span>{{ item.to.toUpperCase() }}</span>
                    </div>
                    <div class="amount">{{ item.amount_from }}</div>
                </div>
            </div>
            <LoadingMore :loading="loading" :finish="finish" v-if="(finish && list.length) || (!finish)" />
        </div>
    </div>
</template>

<script setup>
import Top from '@/components/Top.vue';
import NoData from '@/components/NoData.vue';
import LoadingMore from "@/components/LoadingMore.vue"
import { ref, onMounted, onUnmounted } from 'vue'
import { _converterLog } from "@/api/api"
import { _accountMap } from "@/utils/dataMap"

const loading = ref(false)
const finish = ref(false)
const list = ref([])

const page = ref(0)
const getData = () => {
    if (loading.value || finish.value) return
    loading.value = true
    page.value++
    _converterLog({
        page: page.value
    }).then(res => {
        list.value.push(...(res.data || []))
        if (!res.data?.length) {
            finish.value = true
        }
    }).finally(() => {
        loading.value = false
    })
}

getData()

let moreDom = null
const totalHeight = window.innerHeight || document.documentElement.clientHeight;
const scrolHandle = () => {
    const rect = moreDom.getBoundingClientRect()
    if (rect.top <= totalHeight) {
        // 加载更多
        getData()
    }
}

onMounted(() => {
    setTimeout(() => {
        try {
            moreDom = document.querySelector('.loading_more')
            document.querySelector('.list').addEventListener('scroll', scrolHandle)
        } catch { }
    }, 300)
})
onUnmounted(() => {
    try {
        document.querySelector('.list').removeEventListener('scroll', scrolHandle)
    } catch { }
})
</script>

<style lang="less" scoped>
.page_swap_record {
    height: 100%;
    display: flex;
    flex-direction: column;
    padding: 1.2rem 0.32rem 0.2rem 0.32rem;

    .list {
        flex: 1;
        overflow-y: auto;

        .item {
            height: 2rem;
            border-bottom: 1px dashed #CBCBCB;
            display: flex;
            justify-content: space-between;
            align-items: center;
            flex-wrap: wrap;
            padding: 0.2rem 0 0.2rem 0;
            color: #343434;
            font-size: 0.32rem;

            .item_box {
                flex: 1;
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;

                .top {
                    display: flex;
                    align-items: center;
                    width: 100%;

                    .currency_icon {
                        width: 0.4rem;
                        height: 0.4rem;
                        margin-right: 0.1rem;
                    }
                }
            }

            .amount {
                font-size: 0.4rem;
                line-height: 0.48rem;
                color: #000000;
                font-weight: 700;
                margin-top: 0.2rem;
            }

            .date {
                width: 100%;
                font-size: 0.28rem;
                color: #919193;
                line-height: 0.36rem;
                font-weight: 400;
                margin-bottom: 0.2rem
            }
        }
    }
}
</style>
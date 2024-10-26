<!-- 划转记录 -->
<template>
    <div class="page page_transfer_record">
        <Top :title="'划转记录'" />

        <div class="list">
            <NoData v-if="!loading && !list.length" />
            <div class="item" v-for="(item, i) in list" :key="i">
                <div class="top">
                    <span>{{ _accountMap[item.from] || '--' }}</span>
                    <span>→</span>
                    <span>{{ _accountMap[item.to] || '--' }}</span>
                </div>
                <div class="amount">{{ item.amount }}</div>
                <div class="date">{{ item.created || '--' }}</div>
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
import { _transferLog } from "@/api/api"
import { _accountMap } from "@/utils/dataMap"

const loading = ref(false)
const finish = ref(false)
const list = ref([])

const page = ref(0)
const getData = () => {
    if (loading.value || finish.value) return
    loading.value = true
    page.value++
    _transferLog({
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


const scrollHandle = () => {
    const rect = moreDom.getBoundingClientRect()
    if (rect.top <= totalHeight) {
        // 加载更多
        getData()
    }
}

onMounted(() => {
    const moreDom = document.querySelector('.loading_more')
    const totalHeight = window.innerHeight || document.documentElement.clientHeight;
    document.querySelector('.list').addEventListener('scroll', scrollHandle)
})
onUnmounted(() => {
    document.querySelector('.list').removeEventListener('scroll', scrollHandle)
})
</script>

<style lang="less" scoped>
.page_transfer_record {
    height: 100%;
    display: flex;
    flex-direction: column;
    padding: 1.2rem 0.32rem 0.2rem 0.32rem;

    .list {
        flex: 1;
        overflow-y: auto;

        .item {
            height: 2.2rem;
            border-bottom: 1px dashed #CBCBCB;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            padding: 0.2rem 0 0.28rem 0;

            .top {
                display: flex;
                align-items: center;
                justify-content: space-between;
                color: #343434;
                font-size: 0.32rem;
            }

            .amount {
                flex: 1;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 0.4rem;
                line-height: 0.48rem;
                color: #000000;
                font-weight: 700;
                padding-top: 0.2rem;
            }

            .date {
                font-size: 0.28rem;
                color: #919193;
                line-height: 0.36rem;
                font-weight: 400;
            }
        }
    }
}
</style>
<!-- 充值记录 -->
<template>
    <div class="page page_topup_record">
        <Top :title="'充值记录'" />

        <div class="list">
            <NoData v-if="!loading && !list.length" />
            <RechargeItem :item="item" v-for="(item, i) in list" :key="i" />
            <LoadingMore :loading="loading" :finish="finish" v-if="(finish && list.length) || (!finish)" />
        </div>
    </div>
</template>

<script setup>
import Top from '@/components/Top.vue';
import NoData from '@/components/NoData.vue';
import LoadingMore from "@/components/LoadingMore.vue"
import { ref, onMounted, onUnmounted } from 'vue'
import RechargeItem from "./page/components/RechargeItem.vue"
import { _depositList } from "@/api/api"


const loading = ref(false)
const finish = ref(false)
const list = ref([])

const page = ref(0)
const getData = () => {
    if (loading.value || finish.value) return
    loading.value = true
    page.value++
    _depositList({
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
    const moreDom = document.querySelector('.loading_more')
    const totalHeight = window.innerHeight || document.documentElement.clientHeight;
    const rect = moreDom.getBoundingClientRect()
    if (rect.top <= totalHeight) {
        // 加载更多
        getData()
    }
}

onMounted(() => {
    document.querySelector('.list').addEventListener('scroll', scrollHandle)
})
onUnmounted(() => {
    document.querySelector('.list').removeEventListener('scroll', scrollHandle)
})
</script>

<style lang="less" scoped>
.page_topup_record {
    height: 100%;
    display: flex;
    flex-direction: column;
    padding: 1.2rem 0.32rem 0.2rem 0.32rem;

    .list {
        flex: 1;
        overflow-y: auto;

    }
}
</style>
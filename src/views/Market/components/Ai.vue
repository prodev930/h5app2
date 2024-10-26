<!-- AI量化 -->
<template>
    <div class="page_ai">

        <Tabs class="van-tabs--sub" v-if="!pageLoading" @change="changeTab"
            v-model:active="active" :swipeable="false" animated shrink>
            <Tab :title="'默认'">
                <div class="list">
                    <Loaidng :loading="loading" v-if="!marketAiList.length && loading" />
                    <AiItem @clickItems="clickItem" v-for="(item, i) in marketAiList" :key="i" :item="item" />
                    <NoData v-if="(!loading && marketAiList.length == 0)" />
                </div>
            </Tab>
            <Tab :title="'历史高收益率'">
                <div class="list">
                    <Loaidng :loading="loading" v-if="!marketAiHisList.length && loading" />
                    <AiItem @clickItems="clickItem" v-for="(item, i) in marketAiHisList" :key="i" :item="item" />
                    <NoData v-if="(!loading && marketAiHisList.length == 0)" />
                </div>
            </Tab>
            <Tab :title="'24小时高收益率'">
                <div class="list">
                    <Loaidng :loading="loading" v-if="!marketAi24List.length && loading" />
                    <AiItem @clickItems="clickItem" v-for="(item, i) in marketAi24List" :key="i" :item="item" />
                    <NoData v-if="(!loading && marketAi24List.length == 0)" />
                </div>
            </Tab>
            <Tab :title="'高杠杆'">
                <div class="list">
                    <Loaidng :loading="loading" v-if="!marketAiGridList.length && loading" />
                    <AiItem @clickItems="clickItem" v-for="(item, i) in marketAiGridList" :key="i" :item="item" />
                    <NoData v-if="(!loading && marketAiGridList.length == 0)" />
                </div>
            </Tab>
        </Tabs>

    </div>
</template>

<script setup>
import { ref, onMounted, computed } from "vue"
import { Tabs, Tab } from "vant"
import AiItem from "./AiItem.vue"
import { _aiquant } from "@/api/api"
import Loaidng from "@/components/Loaidng.vue"
import NoData from "@/components/NoData.vue"
import store from "@/store/index"

const emits = defineEmits('clickItem')
const clickItem = item => {
    emits('clickItems', item)
}


const marketAiList = computed(() => store.state.marketAiList || []) // ai量化默认列表
const marketAiHisList = computed(() => store.state.marketAiHisList || []) // ai量化历史收益率列表
const marketAi24List = computed(() => store.state.marketAi24List || []) // ai量化24小时收益率列表
const marketAiGridList = computed(() => store.state.marketAiGridList || []) // ai量化最大网格(杠杆)列表

const active = ref(0)
const orderby = ref('')
const changeTab = (val) => {
    switch (val) {
        case 0:
            orderby.value = ''
            break
        case 1:
            orderby.value = 'ratereturn'
            break
        case 2:
            orderby.value = 'ratereturn24h'
            break
        case 3:
            orderby.value = 'maxgrid'
            break
    }
    getList()
}


const loading = ref(false)
const getList = () => {
    loading.value = true
    const by = orderby.value
    _aiquant({
        orderby: by,
    }).then(res => {
        const list = res.data || []
        switch (by) {
            case 'ratereturn':
                store.commit('setMarketAiHisList', list)
                setTimeout(() => {
                    store.dispatch('subList', {
                        commitKey: 'setMarketAiHisList',
                        listKey: 'marketAiHisList',
                    })
                }, 500)
                break
            case 'ratereturn24h':
                store.commit('setMarketAi24List', list)
                setTimeout(() => {
                    store.dispatch('subList', {
                        commitKey: 'setMarketAi24List',
                        listKey: 'marketAi24List',
                    })
                }, 500)
                break
            case 'maxgrid':
                store.commit('setMarketAiGridList', list)
                setTimeout(() => {
                    store.dispatch('subList', {
                        commitKey: 'setMarketAiGridList',
                        listKey: 'marketAiGridList',
                    })
                }, 500)
                break
            default:
                store.commit('setMarketAiList', list)
                setTimeout(() => {
                    store.dispatch('subList', {
                        commitKey: 'setMarketAiList',
                        listKey: 'marketAiList',
                    })
                }, 500)
                break
        }
    }).finally(() => {
        loading.value = false
    })
}
getList()


const pageLoading = ref(true)
onMounted(() => {
    setTimeout(() => {
        pageLoading.value = false
    }, 300)
})
</script>

<style lang="less" scoped>
.page_ai {
    .list{
        padding:0.2rem 0;
    }
}
</style>
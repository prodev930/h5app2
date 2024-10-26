<!-- 股票 -->
<template>
    <div class="stock_block">
        <!-- 日期 -->
        <!-- <div class="date_box" v-show="active == 2" @click="openDate">
            <div class="date_icon">
                <img src="/static/img/trade/time.png" alt="img">
            </div>
        </div> -->
        <Tabs v-if="!pageLoading" type="custom-card" v-model:active="active" :swipeable="false" animated :color="'#014CFA'"
            shrink @change="onChange">
            <Tab title="开仓" name="0">
                <div class="stock_tab-body">
                    <Opening @showNavDialog="showNavDialog" ref="OpeningRef" />
                </div>
            </Tab>
            <Tab title="持仓" name="1">
                <div class="stock_tab-body">
                    <Positions />
                </div>
            </Tab>
            <Tab title="查询" name="2">
                <div class="stock_tab-body">
                    <Inquire ref="InquireRef" />
                </div>
            </Tab>
        </Tabs>
        <div style="height:50vh" v-else></div>


        <!-- 日期选择 -->
        <DateArea @submit="submitDate" ref="dateAreaRef" />
    </div>
</template>

<script setup>
import { Tab, Tabs } from "vant";
import { ref, onMounted } from "vue"
import Opening from "../components/Opening.vue"
import Positions from "../components/Positions.vue"
import Inquire from "../components/Inquire.vue"
import DateArea from "@/components/DateArea.vue"


const emits = defineEmits(['showNavDialog'])
const showNavDialog = () => {
    emits('showNavDialog', 'stock')
}

const active = ref(sessionStorage.getItem('trade_stock_tab') || 0)
const InquireRef = ref()
const onChange = async (val) => {
    console.log(val)
    active.value = val;
    sessionStorage.setItem('trade_stock_tab', val)
    if (val == 2) {
        setTimeout(() => {
            InquireRef.value && InquireRef.value.init()
        }, 0)
    }
};
const submitDate = times => {
    setTimeout(() => {
        InquireRef.value && InquireRef.value.init(times)
    }, 0)
}

const pageLoading = ref(true)
const OpeningRef = ref()

// 选择某个股票
const choose = item => {
    active.value = 0
    OpeningRef.value && OpeningRef.value.choose(item)
}

onMounted(() => {
    setTimeout(() => {
        pageLoading.value = false
        setTimeout(() => {
            onChange(active.value)
        }, 300)
    }, 300)
})

defineExpose({
    choose
})

// 日期选择
const dateAreaRef = ref()
const openDate = () => {
    dateAreaRef.value && dateAreaRef.value.open()
}
</script>

<style lang="less" scoped>
.stock_block {
    position: relative;
    padding: 0.24rem 0  0.32rem 0;
    :deep(.van-tabs__nav){
        margin:0 0.32rem;
    }

    .tabs {

        :deep(.van-tabs__wrap) {
            background: #EFF3F8;
            margin: 0 .32rem;
            border-radius: 16px;
            height: 40px;
            
            .van-tabs__nav {
                padding-left: 0.32rem;
                position: relative;
                display: flex;
                justify-content: space-between;
                .van-tab {
                    width: 33%;
                }
        
            }
            
        }
    }
}
</style>
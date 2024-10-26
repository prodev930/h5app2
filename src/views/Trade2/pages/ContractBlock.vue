<!-- 合约 -->
<template>
    <div class="stock_block">
        <Tabs v-if="!pageLoading"  type="oval-card"  v-model:active="active" :swipeable="false" animated :color="'#014CFA'"
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
    </div>
</template>

<script setup>
import { Tab, Tabs } from "vant";
import { ref, onMounted } from "vue"
import Opening from "../contract/Opening.vue"
import Positions from "../contract/Positions.vue"
import Inquire from "../contract/Inquire.vue"


const emits = defineEmits(['showNavDialog'])
const showNavDialog = () => {
    emits('showNavDialog', 'contract')
}

const active = ref(sessionStorage.getItem('trade_contract_tab') || 0)
const InquireRef = ref()
const onChange = async (val) => {
    active.value = val;
    sessionStorage.setItem('trade_contract_tab', val)
    if (val == 2) {
        setTimeout(() => {
            InquireRef.value && InquireRef.value.init()
        }, 0)
    }
};

const pageLoading = ref(true)
const OpeningRef = ref()

// 选择某个合约
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

</script>


<style lang="less" scoped>
.stock_block {
    position: relative;
    padding:0.16rem 0 0.32rem 0;
    :deep(.van-tabs__nav){
        margin:0 0.32rem;
    }
    .stock_tab-body{
        padding:0 0.32rem;
    }
    
}
</style>
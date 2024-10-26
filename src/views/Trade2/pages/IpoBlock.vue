<!-- ipo相关 -->
<template>
    <Tabs class="tabs" @change="ipoOnChange" v-model:active="ipoActive" :swipeable="false" animated type="oval-card"
        shrink>
        <Tab :title="'IPO'" class="optional">
            <IPO  v-if="ipoActive == 0" :type="'trade'" ref="IPORef" />
        </Tab>
        <Tab :title="'订单'">
            <IPOStock v-if="ipoActive == 1" ref="IPOStockRef" />
        </Tab>
    </Tabs>
</template>

<script setup>
import IPO from "../../Market/components/IPO.vue"
import IPOStock from "./IPOStock.vue";
import { Tab, Tabs } from "vant";
import { ref } from "vue"

const IPOStockRef = ref()
const IPORef = ref()

const ipoActive = ref(0)
const ipoOnChange = (val) => {
    ipoActive.value = val
    setTimeout(() => {
        switch (val) {
            case 0:
                IPORef.value && IPORef.value.init()
                break
            case 1:
                IPOStockRef.value && IPOStockRef.value.init()
                break
        }
    }, 500)
}

</script>

<style lang="less" scoped>

.tabs :deep(> .van-tabs__wrap){
    padding:0.16rem 0.32rem 0 0.32rem;
}
</style>
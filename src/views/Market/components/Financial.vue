<!-- 理财 -->
<template>
    <div class="market_financial">
        <FinancialItem @handleClick="goInfo(item)" :item="item" v-for="(item, i) in list" :key="i" />
    </div>
</template>

<script setup>
import FinancialItem from "@/components/FinancialItem.vue"
import { ref } from "vue"
import router from "@/router"

const list = ref([
    {},
    {},
    {},
    {},
    {},
    {},
    {},
    {},
    {},
    {},
    {},
    {},
])

const goInfo = item => {
    router.push({
        name: 'financial_info'
    })
}
</script>

<style lang="less" scoped>
.market_financial {
    padding: 0 0.32rem 0.2rem 0.32rem;
}
</style>
<!-- 充值 -->
<template>
    <div class="page page-topup">
        <Top :title="'充值'"></Top>

        <div class="navs">
            <div @click="router.push({ name: 'topUpCrypto' })">虚拟货币充值</div>
            <div>银行卡充值</div>
        </div>
    </div>
</template>

<script setup>
import Top from "@/components/Top.vue"
import router from "@/router"
import { onMounted } from "vue"

onMounted(() => {
    setTimeout(() => {
        router.replace({ name: 'topUpCrypto' })
    }, 0)
})

</script>

<style lang="less" scoped>
.page-topup {
    padding: 1.4rem 0.32rem 1.5rem 0.32rem;

    .navs {

        >div {
            height: 1rem;
            border-bottom: 1px solid #eee;
            display: flex;
            align-items: center;
            justify-content: center;
        }
    }

}
</style>
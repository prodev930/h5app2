<!-- 关于 -->
<template>
    <div class="page page_about">
        <Top :title="'关于'" />

        
    </div>
</template>

<script setup>
import Top from "@/components/Top.vue"
import { Checkbox, CheckboxGroup } from "vant"
import { ref } from "vue"
import router from "@/router"


</script>

<style lang="less" scoped>
.page_about {
    padding-top: 1.12rem;
    height: 100%;
}
</style>
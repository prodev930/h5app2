<!-- 操作成功 -->
<template>
    <div class="page page_success">
        <div class="icon">
            <img src="/static/img/user/success.png" alt="√">
        </div>
        <div class="title">操作成功</div>

        <Button @click="router.back()" round color="#014CFA" class="submit" type="primary">关闭</Button>
    </div>
</template>

<script setup>
import { Button } from 'vant'
import router from "@/router"
</script>

<style lang="less" scoped>
.page_success {
    display: flex;
    align-items: center;
    flex-direction: column;
    justify-content: center;
    text-align: center;
    padding: 0 0.32rem;

    .icon {
        width: 2.8rem;
        height: 2.8rem;
    }

    .title {
        margin: 1.12rem 0 1.68rem 0;
        color: #000;
        font-size: 0.32rem;
        line-height: 0.56rem;
    }

    .submit {
        width: 100%;
    }
}
</style>
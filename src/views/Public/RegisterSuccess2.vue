<!-- 模拟账户-注册成功 -->
<template>
    <div class="page page_register_success">
        <div class="icon">
            <img src="/static/img/user/success2.png" alt="√">
        </div>
        <div class="title">注册成功 <br> 模拟交易金 <span>1000</span> 已到账！</div>

        <Button round color="#014CFA" class="submit" type="primary" @click="next">完成</Button>
    </div>
</template>

<script setup>
import { Button } from 'vant'
import router from "@/router"

const next = () => {
    router.replace({
        name: 'user',
    })
}
</script>

<style lang="less" scoped>
.page_register_success {
    display: flex;
    align-items: center;
    flex-direction: column;
    justify-content: center;
    text-align: center;
    padding: 0 0.32rem;

    .icon {
        width: 5.22rem;
        height: 4.04rem;
    }

    .title {
        margin: 0.84rem 0;
        color: #000;
        font-size: 0.32rem;
        line-height: 0.56rem;
        text-align: center;

        span {
            color: #014CFA;
        }
    }

    .submit {
        width: 100%;
    }
}
</style>
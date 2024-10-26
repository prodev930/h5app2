<!-- 提交成功 -->
<template>
    <div class="page page_submit">

        <div class="icon">
            <img src="/static/img/user/submit.png" alt="√">
        </div>

        <div class="info">身份认证已提交审核，请耐心等待</div>
        <Button @click="router.back()" round color="#014CFA" class="submit" type="primary">关闭</Button>
    </div>
</template>

<script setup>
import { Button } from 'vant'
import router from "@/router"
</script>

<style lang="less" scoped>
.page_submit {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 0 0.32rem;

    .icon {
        width: 3.84rem;
        height: 3.84rem;
        margin-bottom: 0.6rem;
    }

    .info {
        font-weight: 400;
        font-size: 0.28rem;
        line-height: 0.56rem;
        color: #333333;
        margin-bottom: 3.2rem;
    }

    .submit {
        width: 100%;
    }
}
</style>
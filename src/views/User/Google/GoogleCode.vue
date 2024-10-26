<!-- 谷歌验证码-已绑定 -->
<template>
    <div class="page page-gged">
        <Top :title="'谷歌验证器'" />
        <div class="gged_box">
            <div class="icon">
                <img src="/static/img/user/google.png" alt="√">
            </div>
            <div class="title">已绑定</div>
            <div style="flex:1"></div>
            <div class="server_icon">
                <img src="/static/img/common/server.png" alt="server">
            </div>
            <div class="server">if you have questions contact <br /><span>customer service</span></div>
            <Button @click="router.back()" round color="#F2F2F2" class="submit" type="primary">
                <span style="color: #8E8E8E;">关闭</span>
            </Button>
        </div>
    </div>
</template>

<script setup>
import Top from '@/components/Top.vue';
import { Button } from "vant"
import router from '@/router';
</script>

<style lang="less" scoped>
.page-gged {
    padding-top: 1.12rem;

    .gged_box {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: space-between;
        padding: 1.4rem 0.32rem 0.4rem 0.32rem;
        height: 100%;

        .icon {
            width: 2.96rem;
            height: 2.96rem;
            margin-bottom: 0.9rem;
        }

        .title {
            font-weight: 400;
            font-size: 0.48rem;
            line-height: 0.64rem;
            color: #121212;
        }

        .server_icon {
            width: 0.8rem;
            height: 0.8rem;
            margin-bottom: 0.28rem;
        }

        .server {
            font-size: 0.28rem;
            font-weight: 400;
            line-height: 0.32rem;
            margin-bottom: 0.9rem;
            color: #333333;
            text-align: center;

            span {
                color: #014CFA;
            }
        }

        .submit {
            width: 100%;
            margin-bottom: 1.1rem;
        }
    }
}
</style>
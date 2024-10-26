<!-- 充值详情 -->
<template>
    <div class="page page_topup_item">
        <Top :title="'充值详情'">
            <template #right>
                <div class="top-record" @click="goRecord">
                    <img src="/static/img/user/server.png" alt="img">
                </div>
            </template>
        </Top>

        <div class="top_box">
            <div class="amount">+210 USDT</div>
            <div class="status">
                <div class="status_icon">
                    <img src="/static/img/common/ok.png" alt="ok">
                </div>
                <span>成功</span>
            </div>
            <div class="tip">为什么我的充值未到账？</div>
        </div>

        <div class="bottom_box">
            <div class="bottom_item">
                <span>币种</span>
                <div class="value">USDT</div>
            </div>
            <div class="bottom_item">
                <span>状态</span>
                <div class="value status status_review">充值中</div>
            </div>
            <div class="bottom_item">
                <span>时间</span>
                <div class="value">2024-04-18 22:44:29</div>
            </div>
        </div>
    </div>
</template>

<script setup>
import Top from "@/components/Top.vue"
import { _depositInfo } from "@/api/api"
import { useRoute } from "vue-router"

const route = useRoute()

const getInfo = () => {
    _depositInfo({
        order_no: route.query.order_no
    }).then(res => {

    })
}
getInfo()
</script>

<style lang="less" scoped>
.page_topup_item {
    padding: 1.4rem 0.32rem 0.2rem 0.32rem;

    position: relative;

    .top-record {
        width: 0.4rem;
        height: 0.4rem;
    }

    .top_box {
        display: flex;
        flex-direction: column;
        text-align: center;
        align-items: center;
        justify-content: center;
        border-bottom: 1px solid #F1F3F7;

        .amount {
            font-size: 0.52rem;
            color: #000000;
            line-height: 0.73rem;
            margin-bottom: 0.1rem;
        }

        .status {
            display: flex;
            align-items: center;
            color: #014CFA;
            font-size: 0.28rem;
            line-height: 0.44rem;
            font-weight: 600;

            .status_icon {
                width: 0.36rem;
                height: 0.36rem;
                margin-right: 0.2rem;
                border-radius: 50%;
                background-color: #014CFA;
                padding: 0.07rem;
                line-height: 0;
                display: flex;
                align-items: center;
                justify-content: center;
            }
        }

        .tip {
            font-weight: 400;
            font-size: 0.24rem;
            line-height: 0.34rem;
            color: #014CFA;
            text-align: center;
            margin: 0.4rem 0 0.6rem 0;
        }
    }

    .bottom_box {
        padding-top: 0.8rem;

        .bottom_item {
            display: flex;
            align-items: center;
            justify-content: space-between;
            height: 0.44rem;
            margin-bottom: 0.4rem;
            font-size: 0.28rem;
            color: #8F92A1;
            font-weight: 400;

            .value {
                color: #121826;
            }

            .status {
                font-weight: 500;
                padding: 0 0.16rem;
                height: 100%;
                display: flex;
                align-items: center;
                justify-content: center;
            }

            .status_review {
                color: #F89A29;
                background-color: rgba(248, 154, 41, 0.08);
            }

            .status_success {
                color: #014CFA;
                background-color: rgba(1, 76, 250, 0.08);
            }

            .status_failed {
                color: #FF3B30;
                background-color: rgba(255, 59, 48, 0.08);
            }
        }
    }
}
</style>
<!-- 充值详情 -->
<template>
    <div class="recharge_record_info">
        <Top :title="'充值详情'"></Top>

        <div class="top_info">
            <div class="num">{{ orderData.amount }} {{ orderData.currency }}</div>
            <div class="status" v-if="orderData.status == 'success'">
                <div class="status_icon">
                    <img src="/static/img/assets/status_success.png" alt="img">
                </div>
                <span>完成</span>
            </div>
            <div class="status" v-if="orderData.status == 'failure'">
                <div class="status_icon">
                    <img src="/static/img/assets/status_error.png" alt="img">
                </div>
                <span style="color:#E84235">失败</span>
            </div>
            <div class="tip">请联系平台索取您的交易数据</div>
            <div class="link">为什么我的提现未到账？</div>
        </div>
        <div class="bottom_info">
            <div class="bottom_item">
                <div class="name">订单号</div>
                <div class="value">{{ orderData.order_no }}</div>
            </div>
            <div class="bottom_item">
                <div class="name">充值网络</div>
                <div class="value">{{ orderData.network }}</div>
            </div>
            <div class="bottom_item">
                <div class="name">充值地址</div>
                <div class="value">{{ orderData.address }}</div>
            </div>
            <div class="bottom_item">
                <div class="name">充值时间</div>
                <div class="value">{{ orderData.date }}</div>
            </div>
        </div>
    </div>
</template>

<script setup>
import Top from "@/components/Top.vue"
import { ref } from "vue"
import { _depositGet } from "@/api/api"
import { useRoute } from "vue-router"
const route = useRoute()


const loading = ref(false)
const order_no = ref(route.query.order_no) // 订单编号

// 获取订单详情
const orderData = ref({})
const getOrderInfo = () => {
    loading.value = true
    _depositGet({
        order_no: order_no.value
    }).then(res => {
        if (res.data) {
            orderData.value = res.data
        }
    }).finally(() => {
        loading.value = false
    })
}

getOrderInfo()
</script>

<style lang="less" scoped>
.recharge_record_info {
    padding: 1.4rem 0.32rem 1.5rem 0.32rem;

    .top_info {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        padding-bottom: 0.6rem;
        border-bottom: 1px solid #F1F3F7;

        .num {
            font-size: 0.52rem;
            font-weight: 600;
            color: #000000;
            margin-bottom: 0.2rem;
        }

        .status {
            display: flex;
            align-items: center;
            color: #014CFA;
            font-weight: 600;
            font-size: 0.28rem;
            margin-bottom: 0.4rem;

            .status_icon {
                width: 0.36rem;
                height: 0.36rem;
                margin-right: 0.2rem;
            }
        }

        .tip {
            font-size: 0.24rem;
            font-weight: 400;
            line-height: 0.36rem;
        }

        .link {
            color: #014CFA;
            font-size: 0.24rem;
            font-weight: 400;
            line-height: 0.36rem;
        }
    }

    .bottom_info {
        padding: 0.8rem 0 0 0;

        .bottom_item {
            margin-bottom: 0.4rem;
            display: flex;
            align-items: flex-start;
            justify-content: space-between;
            font-size: 0.28rem;
            color: #8F92A1;
            line-height: 0.44rem;
            font-weight: 400;

            .value {
                max-width: 60%;
                word-break: break-all;
                color: #000000;
                text-align: right;
            }
        }
    }
}
</style>
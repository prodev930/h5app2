<!-- 充值记录-元素 -->
<template>
    <div class="recgarge_item" @click="goInfo">
        <div class="icon_box">
            <div class="icon">
                <img src="/static/img/account/crypto_icon.png" alt="img">
            </div>
        </div>
        <div class="content">
            <div class="item_title">{{ item.currency }}</div>
            <!-- <div class="address">{{ item.address }}</div> -->
            <div class="time">{{ item.date ? (item.date.split(' ')[1] || item.date) : '--' }}</div>
        </div>
        <div class="right">
            <div class="amount">{{ item.amount }}</div>
            <div class="status" :class="['status_' + item.status]">{{ _topUpStatusMap[item.status] || '未知' }}</div>
        </div>
    </div>
</template>

<script setup>
import router from "@/router"
import { _topUpStatusMap } from "@/utils/dataMap"

const props = defineProps({
    item: {
        type: Object,
        default: () => { }
    }
})

const emits = defineEmits(['close'])
const goInfo = () => {
    emits('close')
    if (props.item.status == 'success' || props.item.status == 'failure') {
        router.push({
            name: 'rechargeInfo',
            query: {
                order_no: props.item.order_no
            }
        })
    } else {
        router.push({
            name: 'recharging',
            query: {
                order_no: props.item.order_no
            }
        })
    }
}
</script>

<style lang="less" scoped>
.recgarge_item {
    display: flex;
    align-items: stretch;
    padding: 0.24rem 0;
    border-bottom: 1px dashed #CBCBCB;

    .icon_box {
        width: 0.96rem;
        height: 0.96rem;
        background-color: #D9E4FF;
        border-radius: 0.16rem;
        padding: 0.16rem;

        .icon {
            width: 100%;
            height: 100%;
        }
    }

    .content {
        padding: 0.0.16rem;
        flex: 1;
        text-align: left;
        line-height: 1.2;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        align-items: flex-start;

        .item_title {
            width: 100%;
            color: #343434;
            font-weight: 600;
            font-size: 0.28rem;
            text-align: left;
        }

        .address {
            color: #121212;
            font-weight: 400;
            font-size: 0.28rem;
        }

        .time {
            color: #A3A3A7;
            font-size: 0.28rem;
        }
    }

    .right {
        height: 100%;
        // padding-top: 0.2rem;
        text-align: right;

        .amount {
            font-size: 0.32rem;
            color: #000000;
            font-weight: 700;
        }

        .status {
            color: rgba(136, 136, 136, 1);
            background-color: rgba(136, 136, 136, 0.08);
            padding: 0 0.3rem;
            border-radius: 0.04rem;
            display: flex;
            align-items: center;
            font-size: 0.24rem;
            margin-top: 0.1rem;
            height: 0.42rem;
        }

        .status_success {
            color: rgba(10, 178, 125, 1);
            background-color: rgba(10, 178, 125, 0.08);
        }

        .status_failed {
            color: rgba(232, 80, 58, 1);
            background-color: rgba(232, 80, 58, 0.08);
        }
    }
}
</style>
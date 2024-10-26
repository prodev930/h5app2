<!-- 提现记录-元素 -->
<template>
    <div class="withdraw_item">
        <div class="icon_box">
            <div class="icon">
                <img v-if="item.symbol" :src="`/static/img/crypto/${item.symbol}.png`" alt="img">
                <img v-else src="/static/img/crypto/MAIN.png" alt="img">
            </div>
        </div>
        <div class="content">
            <div class="item_title">{{ item.symbol ? `${item.symbol} ${item.network}` : item.bank_name }}</div>
            <div class="address">{{ item.symbol ? item.address : item.bank_card_number }}</div>
            <div class="time">{{ item.date }}</div>
        </div>
        <div class="right">
            <div class="amount">{{ item.amount }}</div>
            <div class="status" :class="['status_' + item.status]">{{ _withdrawStatusMap[item.status] || '未知' }}</div>
        </div>
    </div>
</template>

<script setup>
import { _withdrawStatusMap } from "@/utils/dataMap"
const props = defineProps({
    item: {
        type: Object,
        default: () => { }
    }
})
</script>

<style lang="less" scoped>
.withdraw_item {
    display: flex;
    align-items: flex-start;
    padding: 0.24rem 0;
    border-bottom: 1px dashed #CBCBCB;

    .icon_box {
        width: 0.96rem;
        height: 0.96rem;
        border-radius: 0.16rem;
        padding: 0.12rem;
    }

    .content {
        padding: 0.0.16rem;
        flex: 1;
        text-align: left;

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
        padding-top: 0.2rem;
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
<!-- 提现记录-元素 -->
<template>
    <div class="withdraw_item">
        <div class="top">
            <div>{{ item.order_no }}</div>
            <div class="status">{{ _withdrawStatusMap[item.status] || '--' }}</div>
        </div>
        <div class="item_content">
            <div class="left">
                <div class="item_info">
                    <span>手续费: </span>
                    <span class="num">{{ item.fee }}</span>
                </div>
                <div class="item_info" v-if="!item.symbol">
                    <span>银行名称: </span>
                    <span class="num">{{ item.bank_name }}</span>
                </div>
                <div class="item_info" v-if="!item.symbol">
                    <span>卡号: </span>
                    <span class="num">{{ item.bank_card_number }}</span>
                </div>
                <div class="item_info" v-if="item.symbol">
                    <span>网络: </span>
                    <span class="num">{{ item.network }}</span>
                </div>
                <div class="item_info" v-if="item.symbol">
                    <span>地址: </span>
                    <span class="num">{{ item.address }}</span>
                </div>
            </div>
            <div class="right">{{ item.amount }}{{ item.currency.toUppercase() }}</div>
        </div>
        <div class="date">{{ item.date }}</div>
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
    width: 100%;
    border-bottom: 1px solid #EAEAEA;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-weight: 400;
    padding: 0.2rem 0 0.28rem 0;

    .top {
        display: flex;
        align-items: center;
        justify-content: space-between;
        color: #343434;
        font-size: 0.24rem;
    }

    .item_content {
        display: flex;
        align-items: center;
        justify-content: center;
        margin: 0.12rem 0;

        .left {
            flex: 1;

            .item_info {
                font-size: 0.28rem;
                color: #919193;
                line-height: 400;
                line-height: 0.48rem;

                .num {
                    color: #333333;
                }
            }
        }

        .right {
            font-size: 0.36rem;
            color: #000000;
            font-weight: 700;
        }
    }

    .date {
        color: #919193;
        font-size: 0.24rem;
        font-weight: 400;
    }

    .status_1 {
        color: rgba(1, 76, 250, 1);
        background-color: rgba(1, 76, 250, 0.08);
    }

    .status_2 {
        color: rgba(232, 80, 58, 1);
        background-color: rgba(232, 80, 58, 0.08);
    }

    .status_3 {
        color: rgba(25, 192, 154, 1);
        background-color: rgba(25, 192, 154, 0.08);
    }
}
</style>
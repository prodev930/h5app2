<!-- 充值记录-元素 -->
<template>
    <div class="recharge_item">
        <div class="top">
            <div>{{ item.order_no }}</div>
            <div class="status">{{ _topUpStatusMap[item.status] || '--' }}</div>
        </div>
        <div class="item_content">
            <div class="left">
            </div>
            <div class="right">{{ item.amount }}{{ item.currency }}</div>
        </div>
        <div class="date">{{ item.date }}</div>
    </div>
</template>

<script setup>
import { _topUpStatusMap } from "@/utils/dataMap"

const props = defineProps({
    item: {
        type: Object,
        default: () => { }
    }
})
</script>

<style lang="less" scoped>
.recharge_item {
    width: 100%;
    border-bottom: 1px solid #EAEAEA;
    flex-direction: column;
    justify-content: space-between;
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
}
</style>
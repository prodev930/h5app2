<!-- 理财元素 -->
<template>
    <div class="financial_item" @click="handleClick"
        :style="{ borderBottom: props.borderBottom ? '1px solid #EEF0F4' : '' }">
        <div class="title">稳健回报6号稳健回报6号稳健回报6号回报6号稳健回报6号稳健回报6号稳健回报6号回报6号</div>
        <div class="content">

            <div class="left">
                <div class="tags">
                    <div class="percent">88.31%</div>
                    <div class="tag">锁定十天</div>
                </div>

                <div>近一年收益率</div>
                <div style="margin-top: 0.14rem;">成立日：<span class="date">2024-5-20</span></div>
            </div>

            <div class="right">
                <div class="start">1000起购</div>
                <div class="btn">立即购买</div>
            </div>

        </div>
    </div>
</template>

<script setup>

const props = defineProps({
    borderBottom: {
        type: Boolean,
        default: true
    }
})
const emits = defineEmits(['handleClick'])
const handleClick = () => {
    emits('handleClick')
}
</script>


<style lang="less" scoped>
.financial_item {
    padding: 0.24rem 0;

    .title {
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        font-weight: 600;
        color: #0D0D12;
        font-size: 0.28rem;
        line-height: 0.45rem;
        margin-bottom: 0.12rem;
    }

    .content {
        display: flex;
        align-items: stretch;

        .left {
            flex: 1;
            color: #8F92A1;
            font-size: 0.28rem;
            font-weight: 400;
            line-height: 0.34rem;

            .date {

                color: #202124;
            }

            .tags {
                display: flex;
                align-items: center;
                margin-bottom: 0.12rem;

                .percent {
                    color: #F03C3C;
                    font-size: 0.36rem;
                    line-height: 0.56rem;
                    font-weight: 600;
                    margin-right: 0.32rem;
                }

                .tag {
                    color: #014CFA;
                    font-size: 0.24rem;
                    font-weight: 400;
                    height: 0.4rem;
                    display: flex;
                    align-items: center;
                    padding: 0 0.09rem;
                    background-color: #E8F0FF;
                    margin-right: 0.1rem;
                    border-radius: 0.04rem;
                }
            }
        }

        .right {
            padding-top: 0.1rem;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: space-between;

            .start {
                font-size: 0.28rem;
                color: #000;
                line-height: 0.48rem;
                font-weight: 500;
            }

            .btn {
                height: 0.56rem;
                padding: 0 0.36rem;
                border-radius: 0.3rem;
                background-color: #E7E7E7;
                color: #9EA3AE;
                font-size: 0.24rem;
                font-weight: 400;
                display: flex;
                align-items: center;
            }
        }
    }
}
</style>
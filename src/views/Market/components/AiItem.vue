<!-- ai交易元素 -->
<template>
    <div class="ai_item">

        <div class="head">
            <div>
                <div class="title">
                    {{ props.item.name }}
                </div>
                <div class="tip">
                    <div class="tip_member">
                        <div class="tip_icon">
                            <img src="/static/img/common/member.png" alt="icon">
                        </div>
                        <span>{{ props.item.numpeople || '--' }}</span>
                    </div>
                    <div class="tip_text">最大网格{{ props.item.maxgrid }}</div>
                </div>
            </div>
            <div>
                <div class="time_title">运行时间</div>
                <div class="time_desc">{{ formatSec(props.item.runtime) }}</div>
            </div>
        </div>
        
        <div class="cont">
            <div class="income">
                <div>
                    <div class="income_label">盈亏（USDT）</div>
                    <div class="income_amount" :class="[props.item.income > 0 ? 'up' : 'down']">{{ props.item.income }}</div>
                </div>
                <!-- 图表 -->
                <div class="canvas">
                    <SparkLine v-if="item.points" :polyline-stroke-width="3" :points="props.item.points"
                        :ratio="props.item.ratio" />
                </div>
            </div>
            

            <div class="table">
                <div class="td">
                    <div class="td_title">历史收益率</div>
                    <div class="td_val">{{ props.item.ratereturn }}</div>
                </div>
                <div class="td">
                    <div class="td_title">24小时收益率</div>
                    <div class="td_val">{{ props.item.ratereturn24h }}</div>
                </div>
                <div class="td">
                    <div class="td_title">最小投资金额</div>
                    <div class="td_val">{{ props.item.minamount }}</div>
                </div>
            
            </div>
        </div>
        
        <div class="btns">
            <div class="btn" @click="goTrade">交易</div>
        </div>

       
    </div>
</template>

<script setup>
import router from "@/router";
import { formatSec } from "@/utils/time"
import SparkLine from "@/components/SparkLine.vue"
import store from "@/store"
import { useRoute } from "vue-router"

const emits = defineEmits('click')

const route = useRoute()
const props = defineProps({
    item: {
        type: Object,
        default: () => { }
    }
})

const goTrade = () => {
    store.commit('setCurrAi', props.item)
    router.push({
        name: 'trade',
        query: {
            to: 'ai',
            name: props.item.name,
            symbol: props.item.symbol,
        }
    })
    if (route.name == 'trade') {
        emits('clickItems', props.item)
    }
}

</script>

<style lang="less" scoped>
.ai_item {
    border-radius: 0.32rem;
    border: 1px solid #EFF3F8;
    font-size: 0.28rem;
    color: #0D0D12;
    margin-top: 0.2rem;
    background-color: #F5F7FC;
    position: relative;
    .head{
        padding:0.24rem 0.32rem;
        display: flex;
        justify-content: space-between;
        .time_title{
            color: #6C7B90;
            font-size: 0.28rem;
            font-style: normal;
            font-weight: 400;
            line-height: 140%;
        }
        .time_desc{
            text-align: right;
            font-size: 0.28rem;
            font-style: normal;
            font-weight: 400;
            line-height: 140%; 
            margin-top: 0.1rem;
        }
    }
    .canvas {
        width: 2.32rem;
        height: 1.22rem;
    }

    .income{
        display: flex;
        justify-content: space-between;
        padding: 0.32rem 0.4rem;
        align-items: center;
    }
    .cont{
        background-color: #fff;
        border-radius: 0.32rem;
        border: 1px solid #EFF3F8;
        position: relative;
        width: calc(100% + 2px);
        box-sizing: border-box;
        left:-1px;
    }

    .title {
        color: #0D0D12;
        font-size: 0.36rem;
        font-weight: 600;
        display: flex;
        align-items: center;
        justify-content: space-between;
        line-height: 140%; 
    }

    .tip {
        display: flex;
        align-items: center;
        justify-content: flex-start;
        color: #8F8F8F;
        font-weight: 400;
        font-size: 0.28rem;

        .tip_member {
            display: flex;
            align-items: center;
            height: 0.36rem;
            padding: 0 0.1rem;
            font-size: 0.2rem;
            color: #F89A29;
            margin-right: 0.16rem;
            border-radius: 0.04rem;
            background: rgba(248, 154, 41, 0.08);
            .tip_icon {
                width: 0.2rem;
                height: 0.2rem;
                margin-right: 0.06rem;
            }
        }
        .tip_text{
            color: #8F8F8F;
            font-size: 0.24rem;
            line-height: 140%;
        }
    }

    .income_label{
        color: #333;
        font-size: 0.24rem;
        font-weight: 400;
        line-height: 0.24rem; 
    }
    .income_amount {
        margin-top:0.2rem;
        font-size: 0.56rem;
        font-weight: 600;
        line-height: 0.56rem; 
    }

    .table {
        display: flex;
        border-top: 1px dashed #EFF3F8;
        padding: 0.32rem 0;

        .td {
            flex: 1;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            position: relative;
            .td_title {
                color: #8F92A1;
                font-size: 0.24rem;
                font-style: normal;
                line-height: 0.44rem;
            }
            .td_val{
                color: #061023;
                font-size: 0.3rem;
                font-weight: 600;
                line-height: 0.44rem; 
                margin-top: 0.12rem;
            }
        }
        .td + .td::after{
            content: '';
            width: 1px;
            height: 0.9rem;
            position: absolute;
            left:0;
            top:50%;
            margin-top:-0.45rem;
            background-color: #EFF3F8;
        }

    }
    .btns {
        padding: 0.2rem 0.4rem;

        .btn {
            height: 0.64rem;
            color: #fff;
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 0.5rem;
            height: 0.8rem;
            font-size: 0.3rem;
            font-weight: 600;
            background-color: #014CFA;
        }
    }
}
</style>
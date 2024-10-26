<!-- 市场分布图 -->
<template>
    <div class="distribution_map">
        <div class="title">
            <span>市场涨跌分布</span>
            <span class="total">总计 7.425</span>
        </div>
        <div class="subtitle">
            <span class="up">
                <Icon style="transform: rotate(-90deg);" name="play" />
                65.63 (76,23%)
            </span>
            <span class="date">今天</span>
        </div>
        <!-- 图表 -->

    </div>
</template>

<script setup>
import { Icon } from "vant"
import { ref } from "vue"


const list = ref([
    { name: '涨停', val: 41, bgColor: '#F4AEAD', color: '#E8503A' },
    { name: '>7%', val: 41, bgColor: '#F4AEAD', color: '#7E879C' },
    { name: '7~5%', val: 41, bgColor: '#F08685', color: '#7E879C' },
    { name: '5~2%', val: 41, bgColor: '', color: '#7E879C' },
    { name: '2~0%', val: 41, bgColor: '', color: '#7E879C' },
])
</script>

<style scoped lang="less">
.distribution_map {
    margin-bottom: 0.4rem;

    .title {
        font-size: 0.32rem;
        color: #9EA3AE;
        line-height: 0.48rem;
        font-weight: 400;
        margin-bottom: 0.2rem;

        .total {
            color: #121826;
            margin-left: 0.2rem;
        }
    }

    .subtitle {
        font-size: 0.24rem;
        line-height: 0.48rem;
        font-weight: 400;

        .date {
            color: #9EA3AE;
            margin-left: 0.15rem;
        }
    }
}
</style>
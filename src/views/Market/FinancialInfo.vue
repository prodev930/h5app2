<!-- 理财产品详情 -->
<template>
    <div class="page page_financial_info">
        <Top :title="'产品详情'" />
        <FinancialItem :borderBottom="false" />

        <div class="chart_box"></div>

        <div class="intro">
            基金简称：交银趋势C 成立日期：2021-08-27<br />
            基金代码： 013430(C类)<br />
            风险等级：中等<br />
            基金托管行：中国工商银行股份有限公司<br />
            业绩比较基准：<br />
            75%沪深300指数收益率+25%中证综合债券指数收益率<br />
            投资范围：<br />
            本基金的投资范围为具有良好流动性的金融工具，包括国内依法发行上市的股票（含存托凭证）、债券、货币市场工具、权证、资产支持证券以及法律法规或中国证监会允许基金投资的其他金融工具。
            如法律法规或监管机构以后允许本基金投资其他品种，基金管理人在履行
        </div>
    </div>
</template>

<script setup>
import Top from "@/components/Top.vue"
import FinancialItem from "@/components/FinancialItem.vue"
</script>

<style lang="less" scoped>
.page_financial_info {
    padding: 1.52rem 0.32rem 1.9rem 0.32rem;

    .chart_box {
        width: 100%;
        height: 4.28rem;
        border: 1px solid #ddd;
        margin: 0.48rem 0 0.3rem 0;
    }

    .intro {
        font-size: 0.28rem;
        color: #121826;
        font-weight: 400;
        line-height: 0.54rem;
    }
}
</style>
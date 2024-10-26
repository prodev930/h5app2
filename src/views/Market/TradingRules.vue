<!-- 交易规则 -->
<template>
    <div class="page page_tdrs">

        <Top :title="'交易规则'" />

        <div class="table">
            <div class="tr">
                <div class="left">认购规则</div>
                <div class="right">
                    ●本产品认购期为-。管理人可能延长或提前结束认购期，亦可能调整发行规模上限和下限。若本产品自开始认购至成
                    立日之前，本产品认购金额未达下限，管理人有权宣布理财产品不成立。详情请查阅产品文件并注意管理人不时发出的公告。<br />
                    ●认购期内每个交易日可认购，认购净值均相同，具体确认净值和份额最终以管理人确认为准。认购期内可撤单，即认购期结束日下午3点前可撤单，之后不可撤单。认购结束后产品可能会有一段时间的封闭期，封闭期间您无法提出申购、赎回的申请。具体申赎规则请仔细阅读《产品说明书》。
                </div>
            </div>
            <div class="tr">
                <div class="left">申购规则</div>
                <div class="right">
                    ●本产品每日为申购开放日，若遇非交易日则顺延至下一交易日。开放日T日北京时间下午3点前的申购申请，T日下午3
                    点前可撤单，份额以T日净值确认;3点后的申购申请，下一申购开放日下午3点前可撤单，份额将以下一申购开放日净值确认。
                    <br />●具体确认净值和份额最终以管理人确认为准，具体申购规则请您仔细阅读《产品说明书》。
                </div>
            </div>
            <div class="tr">
                <div class="left">赎回规则</div>
                <div class="right">
                    ●本产品设有180个自然日的最短持有期，每笔认/申购自产品成立日或申购申请日对应的交易日起，需最短持有满180
                    个自然日后方可赎回，赎回开放日为每个交易日，即每个交易日可赎回，若遇非交易日则顺延，即最短持有期实际可能长于180个自然日，具体可赎回日期以管理人确认为准。赎回开放日T日北京时间下午3点前提交的赎回申请，T日下午3点前可撤销，赎回申请以T日净值确认;下午3点后提交的赎回申请视为在下一个开放日提交。赎回资金将最晚于赎回份额确认后的2个交易日内到账。具体产品净值和份额最终以管理人确认为准，具体申赎规则详见《产品说明书》。
                </div>
            </div>
        </div>

    </div>
</template>

<script setup>
import Top from "@/components/Top.vue"
</script>

<style lang="less" scoped>
.page_tdrs {
    padding: 1.52rem 0.32rem 1.9rem 0.32rem;

    .table {
        border: 1px solid #CAC3C3;

        .tr {
            border-bottom: 1px solid #CAC3C3;
            display: flex;
            align-items: stretch;
            word-wrap: break-word;
            white-space: wrap;
            word-break: break-all;

            .left {
                flex: 1;
                display: flex;
                align-items: center;
                justify-content: center;
                background-color: #F3F3F3;
                padding: 0.1rem;
                line-height: 0.34rem;
                font-size: 0.28rem;
                color: #000;
                font-weight: 400;
                border-right: 1px solid #CAC3C3;
            }

            .right {
                flex: 4;
                padding: 0.1rem;
                line-height: 0.5rem;
                font-size: 0.24rem;
                color: #000;
                font-weight: 400;
            }
        }
    }
}
</style>
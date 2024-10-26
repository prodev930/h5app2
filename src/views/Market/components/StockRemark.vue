<!-- 原股票-备份 弃用 -->
<template>
    <div class="market_stock">
        <!-- 折线图 -->
        <div class="padding_block stock_chatsline">
            <div class="title">$38,552.62</div>
            <div class="subtitle up">+$1,439.58(3.88%)</div>
            <!-- <AreaChart /> -->
        </div>
        <!-- tabs -->
        <div class="padding_block stock_tabs_box">
            <Tabs class="stock_tabs" v-model:active="active" shrink sticky>
                <Tab v-for="(item, i) in list" :key="i">
                    <template #title>
                        <div class="stock_tab">
                            <div class="tab_title">AMZN</div>
                            <div class="tab_subtitle">Amazon, Inc</div>
                            <div class="tab_num">8440.85</div>
                            <div class="tab_num down">-0.05%</div>

                            <div class="tab_line">
                                <SparkLine style="width:100%;height:100%"
                                    :points="`0.00,16.79 0.22,25.00 0.44,2.29 0.66,17.03 0.87,14.98 1.09,0.97 1.31,18.12 1.53,16.18 1.75,17.27 1.97,14.01 2.18,17.39 2.40,14.86 2.62,18.24 2.84,17.39 3.06,18.36 3.28,15.70 3.49,0.00 3.71,18.36 3.93,0.36 4.15,19.93 4.37,18.60 4.59,2.29 4.80,21.50 5.02,17.15 5.24,14.98 5.46,0.00 5.68,18.12 5.90,13.41 6.11,17.27 6.33,15.22 6.55,3.99 6.77,16.67 6.99,15.34 7.21,18.72 7.42,16.67 7.64,17.87 7.86,15.46 8.08,1.09 8.30,17.03 8.52,1.81 8.73,18.84 8.95,17.03 9.17,15.46 9.39,17.39 9.61,18.48 9.83,2.42 10.04,17.03 10.26,14.73 10.48,17.27 10.70,14.98 10.92,18.00 11.14,16.91 11.35,0.36 11.57,18.48 11.79,14.98 12.01,18.24 12.23,1.45 12.45,19.57 12.66,17.15 12.88,1.69 13.10,16.79 13.32,16.30 13.54,3.14 13.76,18.12 13.97,12.68 14.19,1.69 14.41,17.27 14.63,15.22 14.85,16.91 15.07,15.70 15.28,18.60 15.50,17.51 15.72,1.33 15.94,18.24 16.16,15.94 16.38,19.20 16.59,16.67 16.81,2.29 17.03,16.55 17.25,1.21 17.47,18.12 17.69,15.34 17.91,2.17 18.12,17.63 18.34,2.54 18.56,19.57 18.78,16.79 19.00,2.29 19.22,17.15 19.43,13.53 19.65,2.42 19.87,18.36 20.09,16.67 20.31,17.39 20.53,15.22 20.74,18.00 20.96,15.22 21.18,18.72 21.40,17.03 21.62,18.84 21.84,17.03 22.05,18.24 22.27,16.30 22.49,17.87 22.71,1.93 22.93,22.34 23.15,17.27 23.36,16.91 23.58,0.97 23.80,17.75 24.02,17.63 24.24,16.30 24.46,14.49 24.67,3.62 24.89,17.03 25.11,14.49 25.33,19.20 25.55,16.79 25.77,16.79 25.98,2.90 26.20,19.08 26.42,17.15 26.64,0.97 26.86,17.15 27.08,14.73 27.29,18.36 27.51,16.43 27.73,3.14 27.95,17.27 28.17,15.10 28.39,18.00 28.60,15.22 28.82,18.36 29.04,17.39 29.26,0.60 29.48,18.60 29.70,15.82 29.91,18.60 30.13,16.06 30.35,0.00 30.57,18.60 30.79,0.72 31.01,21.62 31.22,17.39 31.44,16.91 31.66,3.99 31.88,18.00 32.10,15.10 32.32,2.78 32.53,16.43 32.75,15.58 32.97,16.55 33.19,14.73 33.41,18.48 33.63,18.60 33.84,1.33 34.06,17.87 34.28,15.58 34.50,16.67 34.72,14.01 34.94,18.72 35.16,16.91 35.37,18.48 35.59,15.58 35.81,1.81 36.03,18.36 36.25,1.45 36.47,19.32 36.68,16.79 36.90,3.14 37.12,16.79 37.34,14.25 37.56,1.69 37.78,16.79 37.99,14.73 38.21,16.91 38.43,14.98 38.65,17.27 38.87,15.10 39.09,18.48 39.30,16.18 39.52,2.78 39.74,18.72 39.96,15.94 40.18,1.09 40.40,19.32 40.61,16.30 40.83,16.91 41.05,1.21 41.27,22.22 41.49,17.03 41.71,13.04 41.92,2.66 42.14,17.27 42.36,16.67 42.58,16.67 42.80,14.73 43.02,3.62 43.23,19.08 43.45,16.91 43.67,2.29 43.89,18.00 44.11,15.46 44.33,18.60 44.54,1.45 44.76,19.32 44.98,16.91 45.20,1.45 45.42,16.79 45.64,15.82 45.85,18.12 46.07,15.46 46.29,2.29 46.51,17.39 46.73,15.34 46.95,18.00 47.16,15.46 47.38,18.12 47.60,15.82 47.82,18.84 48.04,16.91 48.26,18.84 48.47,16.06 48.69,1.93 48.91,17.51 49.13,1.81 49.35,22.22 49.57,17.27 49.78,16.18 50.00,3.14 50.22,17.51 50.44,16.55 50.66,1.33 50.88,16.67 51.09,14.98 51.31,17.03 51.53,14.49 51.75,17.63 51.97,16.30 52.19,17.15 52.41,14.61 52.62,17.87 52.84,12.92 53.06,18.00 53.28,16.91 53.50,18.12 53.72,16.55 53.93,1.33 54.15,17.87 54.37,0.72 54.59,19.32 54.81,16.55 55.03,3.02 55.24,17.27 55.46,15.22 55.68,1.81 55.90,17.39 56.12,13.53 56.34,17.27 56.55,15.22 56.77,3.50 56.99,17.39 57.21,15.82 57.43,18.72 57.65,18.00 57.86,18.60 58.08,15.94 58.30,1.33 58.52,19.93 58.74,17.15 58.96,1.69 59.17,17.27 59.39,1.81 59.61,20.77 59.83,17.15 60.05,15.22 60.27,1.81 60.48,16.79 60.70,15.22 60.92,17.51 61.14,12.68 61.36,18.36 61.58,17.63 61.79,1.57 62.01,18.36 62.23,16.18 62.45,17.87 62.67,1.69 62.89,19.20 63.10,16.30 63.32,1.33 63.54,17.03 63.76,12.92 63.98,17.15 64.20,15.82 64.41,3.62 64.63,16.18 64.85,15.82 65.07,17.39 65.29,14.61 65.51,18.48 65.72,16.91 65.94,2.66 66.16,18.60 66.38,15.22 66.60,19.81 66.82,16.43 67.03,2.29 67.25,17.63 67.47,0.97 67.69,21.26 67.91,17.03 68.13,15.34 68.34,17.39 68.56,15.70 68.78,1.09`"
                                    :ratio="`0.0332541568`" />
                            </div>
                        </div>
                    </template>
                </Tab>
            </Tabs>
        </div>

        <!-- 总览 -->
        <div class="padding_block rank_box">
            <div class="rank_title"><span>市场总览</span></div>
            <!-- <DistributionMap /> -->
        </div>

        <!-- 排行 -->
        <div class="rank_box">
            <div class="padding_block  rank_title">
                <span>最活跃</span>
                <span class="rannk_more">
                    更多
                    <Icon name="arrow" />
                </span>
            </div>
            <div class="padding_block  tr th">
                <div class="td td5">名称</div>
                <div class="td td2">行情</div>
                <div class="td td2 td_r">涨跌幅</div>
            </div>
            <div class="tr" v-for="i in 5" :key="i">
                <!-- <StockItem :item="{}" /> -->
            </div>
        </div>
    </div>
</template>

<script setup>
import { Tab, Tabs, Icon } from 'vant';
import { ref } from "vue"
import SparkLine from "@/components/SparkLine.vue"
import StockItem from "@/components/StockItem.vue"
import DistributionMap from "@/components/DistributionMap.vue"
import AreaChart from "@/components/KlineCharts/AreaChart.vue"

const active = ref(0)
const list = ref([
    {},
    {},
    {},
    {},
    {},
])

</script>

<style lang="less" scoped>
.market_stock {
    padding: 0;

    .padding_block {
        padding-left: 0.3rem;
        padding-right: 0.3rem;
    }

    .stock_chatsline {
        width: 100%;
        height: 4.32rem;
        position: relative;

        .title {
            position: absolute;
            top: 0;
            left: 0.3rem;
            font-size: 0.6rem;
            letter-spacing: -0.5px;
            color: #111111;
        }

        .subtitle {
            position: absolute;
            top: 0.64rem;
            left: 0.3rem;
            font-size: 0.28rem;
            color: #18B762;
        }
    }

    .stock_tabs_box {
        margin: 0.4rem 0;
        height: 1.90rem;

        .stock_tabs {
            height: 1.90rem;

            :deep(.van-tab) {
                margin: 0 0.24rem 0 0 !important;
                padding: 0;
            }

            :deep(.van-tabs__nav) {
                &::after {
                    display: none;
                }
            }

            :deep(.van-tabs__wrap) {
                height: 100%;

                .van-tabs__nav {
                    height: 100%;
                    padding: 0;
                }
            }

            :deep(.van-tabs__line) {
                display: none;
            }

            :deep(.van-tab--active) {
                .stock_tab {
                    border: 1px solid #014CFA;
                }
            }
        }

        .stock_tab {
            width: 2.97rem;
            height: 1.90rem;
            border: 1px solid #EAEAEA;
            border-radius: 0.08rem;
            padding: 0.17rem;
            position: relative;

            .tab_title {
                font-weight: 700;
                font-size: 0.2rem;
                color: #0D0D12;
                line-height: 0.274rem;
                margin-bottom: 0.06rem;
            }

            .tab_subtitle {
                color: #818898;
                font-weight: 400;
                font-size: 0.17rem;
                margin-bottom: 0.14rem;
            }

            .tab_num {
                color: #0D0D12;
                font-weight: 600;
                font-size: 0.17rem;
                line-height: 0.25rem;
            }

            .tab_line {
                position: absolute;
                bottom: 0;
                right: 0;
                width: 1.6rem;
                height: 0.9rem;
            }
        }
    }

    .rank_box {
        .rank_title {
            display: flex;
            align-items: center;
            justify-content: space-between;
            font-size: 0.36rem;
            color: #000;
            line-height: 0.48rem;
            margin-bottom: 0.4rem;

            .rannk_more {
                font-weight: 400;
                color: #666666;
                font-size: 0.28rem;
            }
        }

        .tr {
            display: flex;
            align-items: center;

            .td {
                flex: 1;
            }

            .td5 {
                flex: 5;
            }

            .td2 {
                flex: 2;
            }
        }

        .th {
            padding-bottom: 0.16rem;
            height: 0.64rem;
            color: #9EA3AE;
            font-size: 0.28rem;
            font-weight: 400;
            border-bottom: 1px solid #E8E8E8;

            .td_r {
                text-align: right;
            }
        }
    }
}
</style>
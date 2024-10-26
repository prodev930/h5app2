<!-- 首页推荐数据 -->
<template>
    <div class="recommend_box">
        <!--  tabs-->
        <!-- <div class="recommend_tabs">
                <div class="recommend_tab" :class="{ 'active_tab': active == 1 }" @click="active = 1">数据</div>
                <div class="recommend_tab" :class="{ 'active_tab': active == 2 }" @click="active = 2">新闻</div>
            </div> -->

        <transition :name="'slide-right'">
            <!-- 图表 -->
            <div v-if="active == 1" class="recommend_charts">
                <!-- 折线图 -->
                <div class="padding_block stock_chatsline" v-if="!pageLoading && marketRecommndList.length">
                    <div class="title" v-if="activeStockSymbol.price">{{ activeStockSymbol.price.toFixed(2) }}</div>
                    <div class="subtitle" v-if="activeStockSymbol.ratio && !isNaN(activeStockSymbol.ratio)"
                        :class="[(activeStockSymbol.ratio > 0 ? 'up' : 'down')]">{{
                            activeStockSymbol.ratio > 0 ? '+' : '' }}{{ (activeStockSymbol.ratio * 100).toFixed(2) }}%
                    </div>
                    <AreaChart :symbol="activeStockSymbol.symbol"
                        :color="activeStockSymbol.ratio > 0 ? '#18B762' : '#E8503A'" />
                </div>
                <!-- 横向滚动 -->
                <div class="padding_block stock_tabs_box">
                    <Loading v-if="!marketRecommndList.length && loading" :loading="loading" />
                    <Tabs v-if="marketRecommndList.length && !loading" class="stock_tabs" v-model:active="activeStock"
                        shrink sticky>
                        <Tab v-for="(item, i) in marketRecommndList" :key="i">
                            <template #title>
                                <div class="stock_tab">
                                    <div class="tab_title">{{ item.symbol || '--' }}</div>
                                    <!-- <div class="tab_subtitle">{{ item.name || '--' }}</div> -->
                                    <div style="display: flex;align-items: center;justify-content: space-between;">
                                        <div class="tab_num" v-if="item.price">{{ item.price ?
                                            (item.price).toFixed(2) : '--' }}</div>
                                        <div class="tab_num" v-if="item.ratio"
                                            :class="[(item.ratio > 0 ? 'up' : 'down')]">
                                            {{ isNaN(item.ratio) ? '--' : (item.ratio * 100).toFixed(2) }}%</div>
                                    </div>

                                    <div class="tab_line">
                                        <SparkLine style="width:100%;height:100%" :points="item.points"
                                            :ratio="item.ratio" />
                                    </div>
                                </div>
                            </template>
                        </Tab>
                    </Tabs>
                </div>
            </div>

            <!-- 新闻 -->
            <div v-else class="news_list">
                <div class="news_item" v-for="i in 10" :key="i">
                    <div class="title">Bitcoin Analyst Explain Why Price is Rallying AgainBitcoin Analyst Explain
                        Why
                        Price is
                        Rallying Again</div>
                    <div class="time">
                        06:28
                        <span>PM</span>
                    </div>
                </div>
            </div>
        </transition>

    </div>

</template>

<script setup>
import { ref, computed, onMounted } from "vue"
import { Tab, Tabs } from 'vant';
import store from "@/store"
import Loading from "@/components/Loaidng.vue";
import SparkLine from "@/components/SparkLine.vue"
import AreaChart from "@/components/KlineCharts/AreaChart.vue"
import { _news } from "@/api/api"


const emits = defineEmits(['ready'])
const active = ref(1)
const activeStock = ref(0)
const activeStockSymbol = computed(() => {
    const target = marketRecommndList.value[activeStock.value]
    if (target) return target
    return {}
})

const rs = JSON.parse(`[{"market":"NSE","symbol":"CHENNPETRO","name":"CHENNAI PETRO CP","ratio":"+12.01%"},{"market":"NSE","symbol":"HDFCBANK","name":"HDFC BANK","ratio":"−0.20%"},{"market":"NSE","symbol":"IREDA","name":"INDIAN RENEWABLE ENERGY","ratio":"−6.02%"},{"market":"NSE","symbol":"RVNL","name":"RAIL VIKAS NIGAM","ratio":"−0.32%"}]`)


const loading = ref(true)
const pageLoading = ref(true)
const marketRecommndList = computed(() => store.state.marketRecommndList || [])

onMounted(() => {
    setTimeout(() => {
        pageLoading.value = false
    }, 300)
})
setTimeout(() => {
    loading.value = false
    store.commit('setMarketRecommndList', rs)
    setTimeout(() => {
        emits('ready')
    }, 0)
}, 500)



// 新闻
const news = ref([])
// _news().then(res => {
//     if (res.code == 200) {
//         news.value = res.data || []
//     }
// })
</script>

<style lang="less" scoped>
.recommend_box {
    padding: 0.2rem 0.34rem 0.4rem 0.34rem;

    .recommend_tabs {
        display: flex;
        align-items: center;
        justify-content: flex-start;
        margin-bottom: .4rem;

        .recommend_tab {
            font-size: 0.28rem;
            color: #061023;
            padding: 0 0.4rem;
            height: 0.6rem;
            border-radius: 0.48rem;
            display: flex;
            align-items: center;
        }

        .active_tab {
            color: #014CFA;
            background-color: #F6F8FF;
        }
    }

    .recommend_charts {
        .stock_chatsline {
            width: 100%;
            height: 4.32rem;
            position: relative;

            .title {
                position: absolute;
                top: 0;
                left: 0rem;
                font-size: 0.6rem;
                letter-spacing: -0.5px;
                color: #111111;
            }

            .subtitle {
                position: absolute;
                top: 0.64rem;
                left: 0rem;
                font-size: 0.28rem;
            }
        }

        .stock_tabs_box {
            height: 1.60rem;

            .stock_tabs {
                height: 1.5rem;


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
                height: 1.60rem;
                border: 1px solid #F8F9FB;
                border-radius: 0.08rem;
                padding: 0.17rem;
                position: relative;
                background-color: #F8F9FB;

                .tab_title {
                    font-weight: 700;
                    font-size: 0.24rem;
                    color: #0D0D12;
                    line-height: 0.274rem;
                    margin-bottom: 0.06rem;
                }

                .tab_subtitle {
                    color: #818898;
                    font-weight: 400;
                    font-size: 0.2rem;
                    margin-bottom: 0.14rem;
                }

                .tab_num {
                    color: #0D0D12;
                    font-weight: 600;
                    font-size: 0.2rem;
                    line-height: 0.25rem;
                }

                .tab_line {
                    position: absolute;
                    bottom: 0;
                    left: 50%;
                    width: 1.4rem;
                    transform: scaleX(2) translateX(-50%);
                    transform-origin: 0 0;
                    height: 0.6rem;
                }
            }
        }
    }

    .news_list {
        .news_item {
            height: 1.92rem;
            padding: 0.32rem 0;
            border-bottom: 1px solid #B9C1D9;
            line-height: 0.4rem;
            font-weight: 400;

            .title {
                height: 0.8rem;
                margin-bottom: 0.12rem;
                overflow: hidden;
                display: -webkit-box;
                text-overflow: ellipsis;
                -webkit-line-clamp: 2;
                -webkit-box-orient: vertical;
                font-size: 0.28rem;
                color: #121212;
            }

            .time {
                font-size: 0.24rem;
                color: #B8B8B8;

                span {
                    color: #3F8CFF;
                    margin-left: 0.12rem;
                }
            }
        }
    }
}
</style>
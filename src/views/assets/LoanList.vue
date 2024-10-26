<!--借贷记录 -->
<template>
    <div class="page page_loan_record">
        <Top :title="'借贷'" />
        <Tabs class="loan_tabs" type="card" shrink v-if="!pageLoading" @change="changeTab" v-model:active="active"
            :lazy-render="false" animated>
            <Tab :title="'借贷'">
                <div class="loan_box">
                    <Loan />
                </div>
            </Tab>
            <Tab :title="'订单'">
                <div class="list">
                    <NoData v-if="!loading && !list.length" />
                    <div class="item" v-for="(item, i) in list" :key="i">
                        <div class="item_box top">
                            <div class="title">股票账户</div>
                            <div class="status" :class="['status_' + item.status]">{{ _loanStatusMap[item.status ||
                                'open'] ||
                                '--' }}</div>
                        </div>

                        <div class="item_box mid">
                            <div class="left">
                                <div class="date">{{ item.created }}</div>
                                <div>
                                    <span>杠杆</span>
                                    <span class="value">{{ item.lever }}x</span>
                                    <span style="margin: 0 0.2rem">|</span>
                                    <span>期限</span>
                                    <span class="value">{{ item.days }}天</span>
                                </div>
                                <div><span>利息</span>
                                    <span class="value">{{ item.interest }}</span>
                                </div>
                            </div>
                            <div class="amount">+ {{ item.amount }}</div>
                        </div>

                        <div class="item_box bottom">
                            <div>
                                <div class="btn" v-if="item.status == 'open'">提前还款</div>
                            </div>
                            <div class="return">
                                <div style="margin-bottom: 0.12rem">
                                    <span>冻结本金</span>
                                    <span class="value">{{ item.frozen }}</span>
                                </div>
                                <div>
                                    <span class="value" style="font-weight: 600">{{ item.deadline }}</span>
                                    <span>归还</span>
                                    <span class="value" style="font-weight: 600">{{ item.repayment }}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <LoadingMore :loading="loading" :finish="finish" v-if="(finish && list.length) || (!finish)" />
                </div>
            </Tab>
        </Tabs>

    </div>
</template>

<script setup>
import Top from '@/components/Top.vue';
import NoData from '@/components/NoData.vue';
import LoadingMore from "@/components/LoadingMore.vue"
import { ref, onMounted, onUnmounted } from 'vue'
import { _loanLog } from "@/api/api"
import { _loanStatusMap } from "@/utils/dataMap"
import Loan from "./Loan.vue"
import { Tab, Tabs } from 'vant';
import { useRoute } from "vue-router"

const route = useRoute()
const loading = ref(false)
const finish = ref(false)
const list = ref([])
const active = ref(Number(route.query.tab) || 0)
const pageLoading = ref(true)

const page = ref(0)
const getData = () => {
    if (loading.value || finish.value) return
    try {
        list.value = JSON.parse(sessionStorage.getItem('loan_list') || '[]')
    } catch {

    }
    loading.value = true
    page.value++
    _loanLog({
        page: page.value
    }).then(res => {
        if (page.value == 1) {
            list.value = res.data || []
            sessionStorage.setItem('loan_list', JSON.stringify(res.data || []))
        } else {
            list.value.push(...(res.data || []))
        }
        if (!res.data?.length) {
            finish.value = true
        }
    }).finally(() => {
        loading.value = false
    })
}

getData()

let moreDom = null
const totalHeight = window.innerHeight || document.documentElement.clientHeight;
const scrolHandle = () => {
    const rect = moreDom.getBoundingClientRect()
    if (rect.top <= totalHeight) {
        // 加载更多
        getData()
    }
}

const changeTab = (val) => {
    if (val == 1) {
        setTimeout(() => {
            moreDom = document.querySelector('.loading_more')
        }, 300)
    }
}
onMounted(() => {
    setTimeout(() => {
        pageLoading.value = false
    }, 200)
    setTimeout(() => {
        try {
            moreDom = document.querySelector('.loading_more')
            document.querySelector('.list').addEventListener('scroll', scrolHandle)
        } catch {
        }
    }, 500)
})
onUnmounted(() => {
    try {
        document.querySelector('.list').removeEventListener('scroll', scrolHandle)
    } catch { }
})

</script>

<style lang="less" scoped>
.page_loan_record {
    height: 100%;
    display: flex;
    flex-direction: column;
    padding: 1.2rem 0 0.2rem 0;

    .tabs {
        position: absolute;
        height: 0.8rem;
        display: flex;
        align-items: center;
        top: 1.2rem;

        .tab {
            padding: 0 0.6rem;
            font-size: 0.28rem;
            color: #061023;
            font-weight: 400;
            height: 0.64rem;
            display: flex;
            align-items: center;
            border-radius: 0.48rem;
        }

        .active_tab {
            background-color: #F6F8FF;
            color: #014CFA;
            font-weight: 600;
        }
    }

    .loan_tabs {
        :deep(.van-tabs__nav--card) {
            border: none;
        }

        :deep(.van-tab--card) {
            border-right: none;
            color: #061023;
            // background-color: #f5f5f5;
        }

        :deep(.van-tab--card.van-tab--active) {

            background-color: #F6F8FF;
            border-radius: 0.3rem;
            color: #014CFA;
            font-weight: 500
        }

        :deep(.van-tab--shrink) {
            padding: 0 0.5rem;
        }

        :deep(.van-tabs__wrap) {
            height: 0.8rem;
            padding-bottom: 0.34rem;
        }

        :deep(.van-tabs__nav--card) {
            height: 0.6rem;
        }

        :deep(.van-tab) {
            line-height: 0.6rem;
            font-size: 0.28rem;
        }
    }

    .loan_box {
        overflow-y: auto;
        width: 100%;
        height: calc(var(--app-height) - 2.2rem);
    }

    .list {
        overflow-y: auto;
        height: calc(var(--app-height) - 2.4rem);
        padding: 0 0.32rem;

        .item {
            border-bottom: 1px dashed #CBCBCB;
            padding: 0.2rem 0;
            font-size: 0.28rem;
            font-weight: 400;
            color: rgba(139, 139, 139, 1);

            .item_box {
                display: flex;
                align-items: center;
                justify-content: space-between;
            }

            .top {
                margin-bottom: 0.2rem;
            }

            .title {
                color: #343434;
                font-weight: 600;
            }

            .status {
                height: 0.44rem;
                padding: 0 0.16rem;
                color: rgba(18, 24, 38, 1);
                background-color: rgba(18, 24, 38, 0.08);
                font-size: 0.24rem;
                display: flex;
                align-items: center;
            }

            .status_open {
                color: rgba(232, 80, 58, 1);
                background-color: rgba(232, 80, 58, 0.08);
            }

            .status_done {
                color: rgba(1, 76, 250, 1);
                background-color: rgba(1, 76, 250, 0.08);
            }

            .left {
                >div {
                    margin-bottom: 0.16rem;
                }
            }

            .date {
                color: rgba(145, 145, 147, 1);
                font-weight: 400;
            }

            .value {
                color: rgba(51, 51, 51, 1);
                font-weight: 500;
                margin: 0 0.04rem;
            }

            .amount {
                font-size: 0.32rem;
                color: rgba(0, 0, 0, 1);
                font-weight: 600;
            }

            .return {
                text-align: right;
            }

            .bottom {
                margin-top: 0.2rem;
            }

            .btn {
                height: 0.6rem;
                border-radius: 0.5rem;
                padding: 0 0.4rem;
                color: #fff;
                font-weight: 500;
                font-size: 0.24rem;
                background-color: #014CFA;
                display: flex;
                align-items: center;
            }
        }
    }
}
</style>
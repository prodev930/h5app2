<!-- 股票账户 -->
<template>
    <div class="page_assets_stock">
        <!-- 总览 -->
        <div class="overview">
            <div class="top">
                <div class="title">股票资产</div>
                <div class="eyes" @click="hidden = !hidden">
                    <Icon v-show="!hidden" name="eye-o" />
                    <Icon v-show="hidden" name="closed-eye" />
                </div>
            </div>
            <div class="money">
                <span>{{ hidden ? '****' : new Decimal(assets.stock).add(assets.stock_value) }}</span>
            </div>
            <div class="navs">
                <div class="nav">
                    <div>股票账户余额</div>
                    <div class="num">{{ hidden ? '***' : assets.stock }}</div>
                </div>
                <div class="line"></div>
                <div class="nav" @click="jump('loanList', { tab: 1 })">
                    <div>
                        <span>股票持仓金额</span>

                        <div class="hint" v-if="loanNum">{{ loanNum }}</div>
                    </div>
                    <div class="num">{{ hidden ? '***' : assets.stock_value }}</div>
                </div>
            </div>

            <!-- 借贷按钮 -->
            <!-- <div class="loan_btn" @click="jump('loanList')">借贷申请</div>
            <div class="loan_max">可借资金 {{ hidden ? '***' : maxLoan }}</div> -->
        </div>

        <div class="subtitle">持仓</div>
        <Positions />
    </div>
</template>

<script setup>
import { ref, computed } from "vue"
import { Icon } from "vant"
import router from "@/router"
import store from "@/store"
import Decimal from 'decimal.js';
import { _loanPara } from '@/api/api'
import Positions from "../../Trade2/components/Positions.vue"

// store.dispatch('updateOrderHint')

const hidden = ref(false)
const assets = computed(() => store.state.assets || {})
const mainWallet = computed(() => (store.state.wallet || []).find(a => a.currency == 'main') || {}) // 主钱包
const maxLoan = computed(() => {
    if (lever.value.length) {
        const x = lever.value[lever.value.length - 1]
        return new Decimal(mainWallet.value.amount).mul(x)
    } else {
        return '--'
    }
})
const loanNum = computed(() => store.state.loanNum || 0)

const jump = (name, query) => {
    router.push({
        name,
        query
    })
}



// 获取借贷配置
const lever = ref([])
try {
    lever.value = JSON.parse(sessionStorage.getItem('lever') || '[]')
} catch { }
const getConfig = () => {
    // _loanPara().then(res => {
    //     if (res.code == 200) {
    //         lever.value = res.data.lever.split(',')
    //         sessionStorage.setItem('lever', JSON.stringify(lever.value))
    //     }
    // })
}
getConfig()
</script>

<style lang="less" scoped>
.page_assets_stock {
    padding-bottom: 1.6rem;

    .overview {
        background-size: 100% 100%;
        margin: 0 0.32rem 0.36rem 0.32rem;
        padding: 0.4rem 0.3rem 0.24rem 0.3rem;
        background-color: #1A59F6;
        border-radius: 0.32rem;
        position: relative;

        .loan_btn {
            position: absolute;
            top: 0.4rem;
            right: 0.6rem;
            height: 0.52rem;
            color: #fff;
            font-size: 0.24rem;
            border-radius: 0.3rem;
            padding: 0 0.4rem;
            display: flex;
            align-items: center;
            background-color: #000;

            &:active {
                background-color: #0B1E4A;
            }
        }

        .loan_max {
            position: absolute;
            top: 1.04rem;
            right: 0.2rem;
            color: #fff;
            font-size: 0.24rem;
            font-weight: 400;
            text-align: center;
            min-width: 2.4rem;
        }

        .top {
            font-size: 0.28rem;
            font-weight: 400;
            padding-left: 0.32rem;
            display: flex;
            align-items: center;
            justify-content: flex-start;

            .title {
                color: #fff;
                margin-right: 0.32rem;
            }

            .eyes {
                width: 0.32rem;
                height: 0.32rem;
                color: #fff;
                font-size: 0.32rem;
            }

        }

        .money {
            padding-left: 0.32rem;
            font-size: 0.68rem;
            font-weight: 500;
            color: #fff;
            margin-top: 0.3rem;
            margin-bottom: 0.25rem;
        }

        .navs {
            display: flex;
            align-items: center;
            justify-content: center;
            line-height: 0.44rem;
            padding: 0.1rem 0;

            .line {
                width: 1px;
                height: 0.44rem;
                background-color: rgba(255, 255, 255, 0.4);
            }

            .nav {
                color: #fff;
                font-weight: 400;
                flex: 1;
                font-size: 0.24rem;
                text-align: center;
                border-radius: 0.26rem;
                position: relative;

                &:active {
                    background-color: #5045BD;
                }

                .hint {
                    background-color: #fff;
                    height: 0.24rem;
                    font-size: 0.2rem;
                    line-height: 0.24rem;
                    font-weight: 200;
                    padding: 0 0.1rem;
                    border-radius: 0.2rem;
                    position: absolute;
                    top: -0.1rem;
                    right: -0.08rem;
                    color: #000
                }
            }
        }
    }

    .subtitle {
        border-bottom: 1px solid #EAEAEA;
        line-height: 0.48rem;
        padding: 0 0 0.2rem 0.32rem;
        color: #121826;
        font-size: 0.28rem;
        margin-bottom: 0.1rem;
    }

}
</style>
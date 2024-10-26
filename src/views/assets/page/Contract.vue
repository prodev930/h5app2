<!-- 合约账户 -->
<template>
    <div class="page_assets_contract">
        <!-- 总览 -->
        <div class="overview">
            <div class="top">
                <div class="title">持仓资金</div>
                <div class="eyes" @click="hidden = !hidden">
                    <Icon v-show="!hidden" name="eye-o" />
                    <Icon v-show="hidden" name="closed-eye" />
                </div>
            </div>
            <div class="money">
                <span>{{ hidden ? '****' : (assets.futures_value || '0') }}</span>
            </div>
        </div>

    </div>
</template>

<script setup>
import { ref, computed } from "vue"
import { Icon } from "vant"
import store from "@/store"

const hidden = ref(false)

const assets = computed(() => store.state.assets || {})
</script>

<style lang="less" scoped>
.page_assets_contract {
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

}
</style>
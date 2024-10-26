<!-- 收款账户 -->
<template>
    <div class="page page_account">
        <Top :title="'收款账户'"></Top>

        <!-- Tabs -->
        <Tabs type="card" class="tab_content tabs" v-if="!pageLoading" @change="changeTab" v-model:active="active"
            :swipeable="false" animated shrink>
            <Tab :title="'银行卡'">
                <div class="list">
                    <div class="add_item" @click="goAddAccount">
                        <Icon style="font-size:0.48rem;" name="add-o" />
                        <span style="margin-left: 0.2rem;color:#999999;font-size: 0.24rem;">添加收款账户</span>
                    </div>
                    <div class="item" v-for="(item, i) in bankList" :key="i">
                        <div class="address">{{ _hiddenAccount(item.bankCardNumber) }}</div>
                        <div class="title">{{ item.bankName }}</div>
                        <div class="icon_box">
                            <img src="/static/img/user/card_type_b.png" alt="img">
                        </div>
                    </div>
                </div>
            </Tab>
            <Tab :title="'加密货币'">
                <div class="list">
                    <div class="add_item" @click="goAddAccount">
                        <Icon style="font-size:0.48rem;" name="add-o" />
                        <span style="margin-left: 0.2rem;color:#999999;font-size: 0.24rem;">添加收款账户</span>
                    </div>
                    <div class="item" v-for="(item, i) in cryptoList" :key="i">
                        <div class="address">{{ _hiddenAccount(item.address) }}</div>
                        <span class="title">{{ item.symbol }}-{{ item.network }}</span>
                        <div class="icon_box">
                            <img src="/static/img/user/card_type_c.png" alt="img">
                        </div>
                    </div>
                </div>
            </Tab>
        </Tabs>

        <!-- 类型选择弹窗 -->
        <ActionSheet v-model:show="showAS" :actions="actions" @select="onSelect" />
    </div>
</template>

<script setup>
import { Tabs, Tab, Icon, ActionSheet, showConfirmDialog } from "vant"
import Top from "@/components/Top.vue"
import store from "@/store"
import { computed, ref, onMounted } from "vue"
import router from "@/router";
import { _hiddenAccount } from "@/utils/index"

store.dispatch('updateAccountList')

const userInfo = computed(() => store.state.userInfo || {})
const accountList = computed(() => store.state.accountList || []) // 收款方式列表
const bankList = computed(() => accountList.value.filter(item => item.channel == 'bank')) // 银行卡
const cryptoList = computed(() => accountList.value.filter(item => item.channel == 'crypto')) // 加密货币

// tabs
const active = ref(0)
const changeTab = key => {
    active.value = key
}

// 打开添加类型选择弹窗
const showAS = ref(false)
const actions = [
    { name: '银行卡', value: 'bank' },
    { name: '加密货币', value: 'crypto' },
];
const goAddAccount = async () => {
    // google检测
    if (!userInfo.value.googlebind) {
        return showConfirmDialog({
            title: '谷歌验证器',
            message:
                '你还未绑定谷歌验证器，是否去绑定?',
        }).then(() => {
            jump('google')
        })
    }
    showAS.value = true
}
const onSelect = async item => {
    showAS.value = false
    if (item.value == 'bank') { // 银行卡
        if (userInfo.value.kycl2 != 2) {
            return showConfirmDialog({
                title: '身份认证',
                message:
                    '你还未完成身份认证，是否去认证?',
            }).then(() => {
                jump('kyc')
            })
        }
    }
    jump(item.value)
}

// 添加
const jump = (name) => {
    router.push({
        name
    })
}

const pageLoading = ref(true)
onMounted(() => {
    setTimeout(() => {
        pageLoading.value = false
    }, 500)
})

Promise.all([
    import('@/views/User/Account/Bank.vue'),
    import('@/views/User/Account/Crypto.vue'),
])
</script>

<style lang="less" scoped>
.page_account {
    padding: 1.12rem 0.32rem 1.4rem 0.32rem;
    overflow-y: auto;
    height: 100%;

    :deep(.van-action-sheet__content) {
        padding: 0.4rem 0 1rem 0;

        .van-action-sheet__item {
            padding: 0.32rem;
            border-bottom: 1px solid #f5f5f5;
        }
    }

    .tabs {
        overflow: hidden;

        :deep(.van-tab__panel) {
            // height: calc(var(--app-height) - 3.4rem);
            // overflow-y: auto;
        }

        :deep(.van-tabs__nav--card) {
            border: none;
        }

        :deep(.van-tab--card) {
            border-right: none;
            color: #061023;
            // background-color: #f5f5f5;
            // border-radius: 0.3rem;
            // margin-left: 0.1rem;
            // transition: all ease .2s;
        }

        :deep(.van-tab--card.van-tab--active) {
            // background-color: #014CFA;
            // color: #fff;

            background-color: #F6F8FF;
            border-radius: 0.3rem;
            color: #014CFA;
            font-weight: 500
        }

        :deep(.van-tab--shrink) {
            padding: 0 0.3rem;
        }

        :deep(.van-tabs__wrap) {
            height: 0.8rem;
            border-bottom: 1px solid rgba(0, 0, 0, 0);
            padding-bottom: 0.2rem;
        }

        :deep(.van-tabs__nav--card) {
            height: 0.6rem;
        }

        :deep(.van-tab) {
            line-height: 0.6rem;
            font-size: 0.28rem;
        }
    }

    .list {
        padding-top: 0.5rem;

        .add_item {
            border: 1px dashed #CCD7FD;
            border-radius: 0.24rem;
            margin-bottom: 0.2rem;
            height: 1.44rem;
            display: flex;
            align-items: center;
            justify-content: center;
        }

        .subtitle {
            margin-bottom: 0.2rem;
            margin-top: 0.4rem;
            font-size: 0.28rem;
            line-height: 0.44rem;
            color: #111111;
            display: flex;
            align-items: center;
            justify-content: space-between;

            .add_box {
                display: flex;
                align-items: center;
                justify-content: center;
                font-weight: 400;
                font-size: 0.28rem;
                color: #000000;

                .add_icon {
                    width: 0.44rem;
                    height: 0.44rem;
                    margin-right: 0.08rem;
                }
            }
        }

        .item {
            background-color: #F6F7FA;
            padding: 0.24rem 0.24rem 0.24rem 1.44rem;
            border-radius: 0.24rem;
            margin-bottom: 0.2rem;
            height: 1.44rem;
            color: #061023;
            font-size: 0.28rem;
            line-height: 0.48rem;
            position: relative;

            .icon_box {
                width: 0.96rem;
                height: 0.96rem;
                background-color: #D9E4FF;
                border-radius: 0.24rem;
                padding: 0.16rem;
                position: absolute;
                left: 0.24rem;
                top: 0.24rem;
            }
        }
    }




}
</style>

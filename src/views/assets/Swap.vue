<!-- 兑换 -->
<template>
    <div class="page page_swap">
        <Top :title="'兑换'">
            <template #right>
                <div class="top-record" @click="goRecord">
                    <div class="top-record-icon">
                        <img src="/static/img/user/withdraw_record_icon.png" alt="img">
                    </div>
                    <!-- <span>
                        记录
                    </span> -->
                </div>
            </template>
        </Top>

        <!-- 表单 -->
        <div class="form">
            <div class="subtitle">支付</div>
            <div class="item_box">
                <div class="item account_item" @click="openDialog('from')">
                    <div class="currency" v-if="form.from">
                        <div class="currency_icon">
                            <img :src="`/static/img/crypto/${form.from.toUpperCase()}.png`" alt="currency">
                        </div>
                        <span>{{ form.fromName }}</span>
                    </div>
                    <div class="more">
                        <img src="/static/img/assets/more.png" alt="more">
                    </div>
                </div>
                <div class="item ipt_item" :class="{ 'err_ipt': errStatus }">
                    <div class="item_content">
                        <div class="ipt_tip" v-show="form.amount === '' || focus">≤ <span>{{ balance }}</span></div>
                        <input @focus="focus = true" @blur="errStatus = focus = false" class="ipt" @input="changeAmount"
                            type="number" v-model="form.amount" placeholder="">
                        <span class="all" @click="maxIpt">全部</span>
                    </div>
                </div>
            </div>

            <div class="trans">
                <div class="line"></div>
                <div class="trans_icon" @click="transAccount" :class="[transing ? 'transing_icon' : 'transing_stop']">
                    <img src="/static/img/assets/transfer.png" alt="img">
                </div>
                <div class="line" style="flex:12"></div>
            </div>

            <div class="subtitle">预计收到</div>
            <div class="item_box">
                <div class="item account_item" @click="openDialog('to')">
                    <div class="currency">
                        <div class="currency_icon">
                            <img :src="`/static/img/crypto/${form.to.toUpperCase()}.png`" alt="currency">
                        </div>
                        <span>{{ form.toName }}</span>
                    </div>
                    <div class="more">
                        <img src="/static/img/assets/more.png" alt="more">
                    </div>
                </div>
                <div class="item ipt_item no_tip_ipt" :class="{ 'err_ipt': errStatus }"
                    style="background-color: #f5f5f5">
                    <div class="item_content">
                        {{ form.toAmount || '--' }}
                    </div>
                </div>
            </div>

            <div class="tip">
                <span>1 {{ form.from.toUpperCase() }} ≈ </span>
                <span class="num">{{ rate || '--' }} {{ form.to.toUpperCase() }}</span>

                <!-- <span v-if="!rate">--</span>
                <template v-if="rate">
                    <span>1{{ form.from.toUpperCase() }}≈</span>
                    <span class="num">{{ rate }}{{ form.to.toUpperCase() }}</span>

                    <div class="refresh_box" v-show="!loading">{{ timeDown }}s后更新</div>
                </template> -->
            </div>

        </div>

        <Button @click="openSafePass" :loading="loading" round color="#014CFA" class="submit" type="primary">确定</Button>

        <!-- 账户选择弹窗 -->
        <Popup :safe-area-inset-top="true" :safe-area-inset-bottom="true" class="self_van_popup"
            v-model:show="showDialog" position="bottom" teleport="body">
            <div class="swap_accounr_dialog">
                <div class="close_icon" @click="showDialog = false">
                    <img src="/static/img/common/close.png" alt="x">
                </div>
                <div @click="clickItem(item)" class="swap_dialog_item"
                    :class="{ 'swap_dialog_item_active': (clickKey == 'from' ? (form.from == item.currency) : (form.to == item.currency)) }"
                    v-for="(item, i) in wallet" :key="i">
                    <div class="icon">
                        <img :src="`/static/img/crypto/${item.currency.toUpperCase()}.png`" alt="currency">
                    </div>
                    <span>{{ item.name }}</span>

                    <Icon v-if="(clickKey == 'from' ? (form.from == item.currency) : (form.to == item.currency))"
                        class="check_icon" name="success" />
                </div>
            </div>
        </Popup>

        <!-- 安全密码弹窗 -->
        <SafePassword @submit="submit" ref="safeRef">
            <template #top>
                <div
                    style="position: absolute;width:100%;font-size: 0.32rem;text-align: center;pointer-events: none;top:0.32rem">
                    兑换确认</div>
            </template>
            <!-- <template #top>
                <div class="swap_comfirm_box">
                    <div class="comfirm_title">兑换确认</div>
                    <div class="confirm_box">
                        <div class="confirm_box_item">
                            <div>支付</div>
                            <div class="num">{{ form.amount }}{{ form.from.toUpperCase() }}</div>
                        </div>
                        <div class="confirm_icon">
                            <img src="/static/img/assets/transfer.png" alt="img">
                        </div>
                        <div class="confirm_box_item">
                            <div>收到</div>
                            <div class="num">{{ form.toAmount || '--' }}{{ form.to.toUpperCase() }}</div>
                        </div>
                    </div>
                    <div class="comfirn_tip">实际到账以实时汇率为准</div>
                </div>
            </template> -->
        </SafePassword>

        <!-- 充提记录 -->
        <RecordList ref="RecordListRef" />
    </div>
</template>

<script setup>
import Top from "@/components/Top.vue"
import { Button, Popup, Icon, showToast } from "vant"
import { ref, computed, onBeforeUnmount } from "vue"
import store from "@/store"
import SafePassword from "@/components/SafePassword.vue"
import { _converter, _swapRate } from "@/api/api"
import router from "@/router"
import Decimal from 'decimal.js';
import RecordList from "@/components/RecordList.vue"
import { useRoute } from "vue-router"

const focus = ref(false)
const route = useRoute()

const wallet = computed(() => store.state.wallet || [])
const balance = computed(() => { // main钱包余额
    let b = 0
    const main = wallet.value.find(item => item.currency == form.value.from)
    if (main) b = main.amount
    return b
})

// 表单
const loading = ref(false)
const form = ref({
    from: wallet.value[0] ? wallet.value[0].currency : '--',
    fromName: wallet.value[0] ? wallet.value[0].name : '--',
    to: wallet.value[1] ? wallet.value[1].currency : '--',
    toName: wallet.value[1] ? wallet.value[1].name : '--',
    amount: "",
})
const maxIpt = () => {
    form.value.amount = balance.value
    changeAmount()
}
const changeAmount = () => { // 改变from金额
    if (!rate.value || !form.value.amount) return form.value.toAmount = ""
    form.value.toAmount = new Decimal(rate.value).mul(form.value.amount).toFixed(2);
}
const changeToAmount = () => { // 改变to金额
    if (!rate.value || !form.value.toAmount) return form.value.amount = ""
    form.value.amount = new Decimal(form.value.toAmount).div(rate.value).toFixed(2);
}

// 表单提交
const safeRef = ref()
const errStatus = ref(false)
const openSafePass = () => {
    if (!form.value.amount || form.value.amount <= 0) {
        errStatus.value = true
        return showToast('请输入金额')
    }
    // if (balance.value < form.value.amount) {
    //     return showToast('余额不足')
    // }
    safeRef.value.open()
}
const submit = s => {
    const params = {
        ...form.value,
        safeword: s,
        // token: sessionToken.value
    }
    if (loading.value) return
    loading.value = true
    _converter(params).then(res => {
        if (res.code == 200) {
            showToast('兑换成功');
            form.value.amount = ''
            form.value.toAmount = ''
            store.dispatch('updateWallet') // 更新钱包
            setTimeout(() => {
                router.back()
            }, 500)
        }
    }).finally(() => {
        // getSessionToken()
        loading.value = false
    })
}

// 汇率
const rate = ref('')
let timeout = null
let interval = null
const timeDown = ref(10)
const getRate = () => {
    if (loading.value) return
    if (timeout) clearTimeout(timeout)
    if (interval) clearInterval(interval)
    timeDown.value = 10
    _swapRate({
        from: form.value.from,
        to: form.value.to,
        amount: form.value.amount || 0
    }).then(res => {
        if (res.code == 200) {
            rate.value = res.data.exchange_rate
            if (form.value.amount) {
                form.value.toAmount = new Decimal(rate.value).mul(form.value.amount).toFixed(4);
            }
            if (route.name == 'swap') {
                interval = setInterval(() => {
                    timeDown.value--
                    if (timeDown.value <= 0) {
                        getRate()
                    }
                }, 1000)
            }

        }
    })
}
getRate()

// 弹窗
const transing = ref(false) // 转换动画中
const goTransing = () => {
    transing.value = true
    rate.value = ''
    setTimeout(() => {
        transing.value = false
    }, 500)
}
const transAccount = () => {
    goTransing()
    const to = form.value.to
    form.value.to = form.value.from
    form.value.from = to
    setTimeout(() => {
        getRate()
    }, 0)
}
const showDialog = ref(false)
const clickKey = ref('from') // 从哪里点开弹窗
const openDialog = key => {
    clickKey.value = key
    showDialog.value = true
}
const clickItem = item => { // 选择账户
    if (clickKey.value == 'from') {
        if (item.currency == form.value.to) {
            form.value.to = form.value.from
            goTransing()
        }
        form.value.from = item.currency
        form.value.fromName = item.name
    } else if (clickKey.value == 'to') {
        if (item.currency == form.value.from) {
            form.value.from = form.value.to
            goTransing()
        }
        form.value.to = item.currency
        form.value.toName = item.name
    }
    showDialog.value = false
    setTimeout(() => {
        getRate()
    }, 0)
}




// sessionToken
const sessionToken = computed(() => store.state.sessionToken || '')
const getSessionToken = () => {
    loading.value = true
    store.dispatch("updateSessionToken").finally(() => {
        loading.value = false
    })
}
// getSessionToken()


onBeforeUnmount(() => {
    if (interval) clearInterval(interval)
})

// 跳转记录
const RecordListRef = ref()
const goRecord = () => {
    router.push({
        name: 'recordList',
        query: {
            tab: 3
        }
    })
}
</script>

<style lang="less" scoped>
.page_swap {
    padding: 1.4rem 0.32rem 1.5rem 0.32rem;

    position: relative;

    .top-record {
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        color: #0953fa;
        font-size: 0.24rem;

        .top-record-icon {
            background-color: #EDEDED;
            width: 0.52rem;
            height: 0.52rem;
            padding: 0.06rem;
            border-radius: 50%;
            margin-right: 0.04rem;
        }

    }

    .form {
        .item_box {
            display: flex;
            align-items: center;
            justify-content: space-between;
            height: 0.88rem;

            &:has(.ipt:focus) {
                height: 1.12rem;
            }
        }

        .item {
            width: 100%;
            height: 100%;
            border: 1px solid #D0D8E2;
            border-radius: 0.12rem;
            display: flex;
            align-items: center;
            justify-content: space-between;
            font-weight: 400;

            &:has(.ipt:focus) {
                padding-top: 0.3rem;
                border: 1px solid #014CFA;
            }

            .item_pre {
                width: 1rem;
                font-size: 0.32rem;
                color: #707070;
            }

            .item_content {
                display: flex;
                align-items: center;
                justify-content: space-between;
                flex: 1;
                font-size: 0.28rem;
                color: #000;
                position: relative;
                line-height: 0.28rem;
                height: 100%;

                .all {
                    color: #1A59F6;
                    position: absolute;
                    right: 0;
                }
            }

            .currency {
                display: flex;
                align-items: center;
                margin-right: 0.24rem;
                line-height: 0;

                .currency_icon {
                    width: 0.4rem;
                    height: 0.4rem;
                    margin-right: 0.12rem;
                }
            }

            .more {
                width: 0.32rem;
                height: 0.32rem;
            }

            .ipt {
                flex: 1;
                color: #292929;
                font-size: 0.28rem;
                width: 2rem;
            }

            .btn {
                color: #1A59F6;
                font-size: 0.28rem;
                margin-left: 0.4rem;
            }
        }

        .ipt_item {
            flex: 7;
            position: relative;
            padding: 0 0.24rem 0 0.36rem;

            &:has(.ipt:focus) {
                .ipt_tip {
                    transform: translateY(-200%);
                    font-size: 0.2rem;

                    span {
                        color: #A4ACB9;
                    }
                }
            }

            .ipt_tip {
                position: absolute;
                font-size: 0.24rem;
                font-weight: 400;
                color: #A4ACB9;
                left: 0rem;
                top: 50%;
                transform: translateY(-50%);
                pointer-events: none;
                transition: all ease .2s;

                span {
                    // color: #111111;
                }
            }


        }

        .err_ipt {
            border: 1px solid #E8503A;
        }

        .no_tip_ipt {
            &:has(.ipt:focus) {
                padding-top: 0;
            }
        }

        .account_item {
            padding: 0 0.24rem;
            height: 100% !important;
            flex: 4;
            margin-right: 0.2rem;
        }

        .trans {
            margin: 0.7rem 0 0.5rem 0;
            padding: 0 0.2rem;
            display: flex;
            align-items: center;

            .trans_icon {
                width: 0.8rem;
                height: 0.8rem;
                margin: 0 0.48rem;
            }

            .transing_icon {
                transition: all ease .5s;
                transform: rotate(360deg);
            }

            .transing_stop {
                transition: none;
                transform: rotate(0deg);
            }

            .line {
                flex: 1;
                height: 1px;
                background-color: rgba(59, 130, 246, 0.1);
            }
        }

        .subtitle {
            font-size: 0.28rem;
            color: #333333;
            font-weight: 400;
            line-height: 0.36rem;
            margin: 0rem 0 0.12rem 0;
        }

        .tip {
            display: flex;
            align-items: center;
            justify-content: flex-start;
            font-weight: 400;
            font-size: 0.24rem;
            color: #707070;
            line-height: 0.4rem;
            margin-top: 0.12rem;

            .num {
                color: #333333;
                margin-left: 0.04rem;
                font-weight: 500;
            }

            .subtip {
                font-weight: 400;
                font-size: 0.2rem;
                color: #707070;
            }

            .refresh_box {
                padding: 0 0.08rem;
                border: 1px solid #014CFA;
                color: #014CFA;
                height: 0.36rem;
                border-radius: 0.04rem;
                display: flex;
                align-items: center;
                font-size: 0.2rem;
                line-height: 0.2rem;
                margin-left: 0.16rem;
            }
        }

    }

    .submit {
        width: 100%;
        height: 1.12rem;
        margin: 2.2rem 0 0.4rem 0;
    }
}
</style>

<style lang="less" scoped>
.swap_accounr_dialog {
    background-color: #fff;
    border-top-left-radius: 0.4rem;
    border-top-right-radius: 0.4rem;
    overflow: hidden;
    padding: 0.86rem 0.32rem 0.8rem 0.32rem;
    position: relative;

    .close_icon {
        position: absolute;
        width: 0.4rem;
        height: 0.4rem;
        top: 0.24rem;
        right: 0.32rem;
    }

    .swap_dialog_item {
        height: 1.12rem;
        display: flex;
        align-items: center;
        justify-content: center;
        border-bottom: 1px solid #F5F5F5;
        overflow: hidden;
        position: relative;

        .icon {
            width: 0.4rem;
            height: 0.4rem;
            margin-right: 0.24rem;
        }
    }

    .swap_dialog_item_active {
        color: #014CFA;
        font-weight: 600;

        .check_icon {
            position: absolute;
            right: 0.24rem;
            color: #014CFA;
            font-size: 0.28rem;
        }
    }


}
</style>

<style lang="less">
.swap_comfirm_box {
    margin-bottom: 0.4rem;

    .comfirm_title {
        text-align: center;
        font-size: 0.32rem;
        line-height: 0.44rem;
        color: #061023;
        margin-bottom: 0.4rem;
    }

    .confirm_box {
        display: flex;
        align-items: center;
        justify-content: space-between;
        border-bottom: 1px dashed #CBCBCB;
        padding-bottom: 0.2rem;
        margin-bottom: 0.1rem;

        .confirm_box_item {
            flex: 1;
            text-align: center;
            line-height: 0.4rem;
            color: #8F92A1;

            .num {
                color: #121826;
                font-weight: 600;
                font-size: 0.32rem;
                margin-top: 0.2rem;
            }
        }

        .confirm_icon {
            width: 0.8rem;
            height: 0.8rem;
            margin: 0 0.2rem;
        }
    }

    .comfirn_tip {
        text-align: right;
        font-size: 0.24rem;
        color: #666;
        line-height: 0.4rem;
    }


}
</style>
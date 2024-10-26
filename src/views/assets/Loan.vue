<!-- 借贷 -->
<template>
    <div class="page page_loadn">
        <!-- <Top :title="'借贷'"></Top> -->

        <!-- 表单 -->
        <div class="form">
            <div class="subtitle">
                <span>抵押</span>
            </div>
            <div class="item2">
                <div class="border_item account_box" style="background-color: #f5f5f5">
                    <div class="item_icon">
                        <img src="/static/img/assets/cash_icon.svg" alt="img">
                    </div>
                    <span>现金账户</span>
                </div>
                <div class="border_item ipt_box" :class="{ 'err_ipt': errStatus }">
                    <div class="ipt_tip" v-show="bj === '' || focus">可抵押 <span>{{ mainWallet.amount || '--' }}</span>
                    </div>
                    <input @focus="focus = true" @blur="focus = errStatus = false" @input="inputNum('bj')" v-model="bj"
                        class="ipt" type="number" placeholder="">
                    <span class="all" @click="putAll">全部</span>
                </div>
            </div>
            <div class="subtitle">
                <span>杠杆</span>
            </div>
            <!-- 滑块 -->
            <div class="slider_box" @mousedown="startMove = true" @mousemove="mousemove" @touchmove="sliderMove">
                <div class="slider">
                    <div class="slider_inner" :style="{ width: `${moveWith ? moveWith + 'px' : sliderWidth + '%'}` }">
                        <div class="slider_ball"></div>
                    </div>
                </div>
                <div class="slider_bottom">
                    <div @click="sliderTo(i)" class="slider_item" v-for="(item, i) in lever" :key="item"
                        :class="{ 'slider_item_avtive': leverIndex == i }">
                        <span class="text">{{ item }}X</span>
                    </div>
                </div>
            </div>
            <div class="subtitle">
                <span>借款账户</span>
            </div>
            <div class="item2">
                <div class="border_item account_box" @click="showDialog = true" style="padding-right:0.24rem">
                    <div class="item_icon">
                        <img src="/static/img/assets/stock_icon.svg" alt="img">
                    </div>
                    <span>股票账户</span>
                    <div class="more_icon"><img src="/static/img/assets/more.png" alt="img"></div>
                </div>
                <div class="border_item ipt_box" style="background-color: #f5f5f5">
                    <div class="ipt">
                        <span>{{ amount || '--' }}</span>
                    </div>
                    <!-- <input @input="inputNum('amount')" v-model="amount" class="ipt" type="number" placeholder="借款金额"> -->
                </div>
            </div>
            <div class="subtitle">期限</div>
            <!-- 期限 -->
            <div class="dates">
                <div class="date" @click="changeDate(i)" v-for="(item, i) in days"
                    :class="{ 'date_active': currDayIndex == i }" :key="i">{{
                        item
                    }}天
                </div>
            </div>
            <!-- <div class="tip">
                <span>手续费</span>
                <span class="num">{{ loading ? '--' : showFee }}</span>
            </div>
            <div class="tip">
                <span>隔夜利息</span>
                <span class="num">{{ loading ? '--' : showInterest }}</span>
            </div>
            <div class="tip">
                <span>{{ returnDate }} 归还</span>
                <span class="num">{{ loading ? '--' : returnAmount }}</span>
            </div> -->
        </div>

        <Button @click="openSafePass" :loading="loading" round color="#014CFA" class="submit" type="primary">确定</Button>


        <!-- 账户选择弹窗 -->
        <Popup :safe-area-inset-top="true" :safe-area-inset-bottom="true" class="self_van_popup"
            v-model:show="showDialog" position="bottom" teleport="body">
            <div class="swap_accounr_dialog">
                <div class="close_icon" @click="showDialog = false">
                    <img src="/static/img/common/close.png" alt="x">
                </div>
                <div @click="showDialog = false" class="swap_dialog_item swap_dialog_item_active">
                    <span>股票账户</span>
                    <Icon class="check_icon" name="success" />
                </div>
                <!-- <div @click="clickItem(item)" class="swap_dialog_item"
                    :class="{ 'swap_dialog_item_active': (clickKey == 'from' ? (form.from == item.currency) : (form.to == item.currency)) }"
                    v-for="(item, i) in wallet" :key="i">
                    <div class="icon">
                        <img :src="`/static/img/crypto/${item.currency.toUpperCase()}.png`" alt="currency">
                    </div>
                    <span>{{ item.currency.toUpperCase() }}</span>

                    <Icon v-if="(clickKey == 'from' ? (form.from == item.currency) : (form.to == item.currency))"
                        class="check_icon" name="success" />
                </div> -->
            </div>
        </Popup>

        <!-- 安全密码弹窗 -->
        <SafePassword @submit="submit" ref="safeRef" :closeable="false">
            <template #top>
                <div class="loan_comfirm_box">
                    <div class="loan_comfirm_title">
                        <span>借款确认</span>
                        <div class="close_icon" @click="closeSafeRef">
                            <img src="/static/img/common/close.png" alt="x">
                        </div>
                    </div>
                    <div class="loan_confirm_item">
                        <span>借款金额</span>
                        <div class="loan_confirm_amount">{{ amount }}</div>
                    </div>

                    <!-- <div class="loan_confirm_item">
                        <span>冻结</span>
                        <span class="value">
                            <span class="tag" style="margin-right:0.2rem">现金账户</span>
                            <span>{{ bj }}</span>
                        </span>
                    </div> -->
                    <!-- <div class="loan_confirm_item">
                        <span>杠杆</span>
                        <span class="value">
                            <span class="tag">{{ lever[leverIndex] }}x</span>
                        </span>
                    </div> -->
                    <div class="loan_confirm_item">
                        <span>还款日期</span>
                        <span class="value">
                            <span>{{ returnDate }}</span>
                            <!-- <span style="margin-left: 0.2rem">{{ days[currDayIndex] }}天</span> -->
                        </span>
                    </div>
                    <!-- <div class="loan_confirm_item">
                        <span>手续费</span>
                        <span class="value">{{ showFee }}</span>
                    </div> -->
                    <div class="loan_confirm_item">
                        <span>隔夜利息</span>
                        <span class="value">
                            <span>{{ showInterest }}</span>
                            <span style="margin-left: 0.2rem" class="tag">{{ showInterestNum }}</span>
                        </span>
                    </div>
                    <!-- <div class="loan_confirm_tip">
                        <span class="value">{{ returnAmount }}</span>
                    </div> -->
                </div>
            </template>
        </SafePassword>
    </div>
</template>

<script setup>
import Top from "@/components/Top.vue"
import { _loanPara, _loanRate, _loan } from "@/api/api"
import { ref, computed, onMounted, onBeforeUnmount } from "vue"
import { Button, showToast, Icon, Popup } from "vant"
import store from "@/store"
import Decimal from 'decimal.js';
import SafePassword from "@/components/SafePassword.vue"
import router from "@/router"


const focus = ref(false)
const loading = ref(false)
const mainWallet = computed(() => (store.state.wallet || []).find(a => a.currency == 'main') || {}) // 主钱包

// 滑块配置
const lever = ref([])
const leverIndex = ref(0)
const moveWith = ref(0)
const sliderWidth = computed(() => {
    const val = leverIndex.value * 20
    return val <= 3 ? 3 : (val >= 99 ? 99 : val) // 两边收边
})
const sliderTo = i => { // 点击滑块
    if (leverIndex.value != i) {
        leverIndex.value = i
        setTimeout(() => {
            inputNum('bj')
            getRate()
        }, 0)
    }
}
const totalWidth = ref(window.innerWidth || document.documentElement.clientWidth)
if (totalWidth.value > 750) totalWidth.value = 375
const leverWidthArr = ref([]) // 滑块位置数组
const startMove = ref(false)
const cancelListen = () => {
    startMove.value = false
    if (!moveWith.value) return
    const x = moveWith.value / totalWidth.value
    let i = 0
    leverWidthArr.value.forEach((item, index) => {
        if (x > item) {
            i = index
        }
    })
    moveWith.value = 0
    sliderTo(i)
}
const mousemove = e => { // pc 拖动
    if (!startMove.value) return
    moveWith.value = e.offsetX
}
const sliderMove = e => { // 滑动
    const x = e.targetTouches[0].clientX / totalWidth.value
    let i = 0
    leverWidthArr.value.forEach((item, index) => {
        if (x > item) {
            i = index
        }
    })
    sliderTo(i)
}

// 日期配置
const days = ref([])
const currDayIndex = ref(0)
const changeDate = i => {
    currDayIndex.value = i
    setTimeout(() => {
        getRate()
    }, 0)
}


// 借款金额
const errStatus = ref(false)
const amount = ref('') // 借款金额
const bj = ref("") // 本金
const putAll = () => {
    bj.value = mainWallet.value.amount
    setTimeout(() => {
        inputNum('bj')
    }, 0)
}
const inputNum = key => {
    if (key == 'bj') { //输入本金
        if (bj.value) {
            amount.value = new Decimal(bj.value).mul(lever.value[leverIndex.value]).toFixed(2)
        } else {
            amount.value = ''
        }
    }
    if (key == 'amount') { // 输入借款
        if (amount.value) {
            bj.value = new Decimal(amount.value).div(lever.value[leverIndex.value]).toFixed(2)
        } else {
            bj.value = ''
        }
    }
}
// 最大可借 mainWallet.value.amount

// 手续费
const fee = ref(0)
const showFee = computed(() => {
    if (!amount.value) return '--'
    return new Decimal(amount.value).mul(fee.value)
})

// 隔夜利息
const interest = ref(0)
const showInterest = computed(() => {
    if (!amount.value) return '--'
    return new Decimal(interest.value).mul(100) + '%'
})
const showInterestNum = computed(() => {
    if (!amount.value) return '--'
    return new Decimal(interest.value).mul(bj.value)
})

// 归还
const returnAmount = computed(() => {
    if (!amount.value) return '--'
    return new Decimal(amount.value).mul(interest.value).plus(showFee.value).plus(amount.value)
})

const returnDate = computed(() => {
    const today = new Date(); // 获取今天的日期
    today.setDate(today.getDate() + (Number(days.value[currDayIndex.value]) || 0));
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
})

// 获取借贷配置
const getConfig = () => {
    loading.value = true
    _loanPara().then(res => {
        if (res.code == 200) {
            lever.value = res.data.lever.split(',')
            leverWidthArr.value = lever.value.map((item, i) => {
                const n = (i / (lever.value.length - 1)) - (1 / (lever.value.length - 1) / 2)
                return n <= 0 ? 0 : n
            })
            days.value = res.data.days.split(',')

            getRate()
        }
    }).finally(() => {
        loading.value = false
    })
}
getConfig()

// 获取汇率
let getRateTimeout = null
const getRate = () => {
    if (getRateTimeout) clearTimeout(getRateTimeout)
    getRateTimeout = setTimeout(() => {
        loading.value = true
        _loanRate({
            lever: lever.value[leverIndex.value],
            days: days.value[currDayIndex.value]
        }).then(res => {
            if (res.code == 200) {
                fee.value = res.data.fee || 0
                interest.value = res.data.interest || 0
            }
        }).finally(() => {
            loading.value = false
        })
    }, 300)
}


// 表单提交
const showDialog = ref(false)
const safeRef = ref()
const closeSafeRef = () => {
    safeRef.value.close()
}
const openSafePass = () => {
    if (!bj.value || bj.value <= 0) {
        errStatus.value = true
        return showToast('请输入金额')
    }
    if (mainWallet.value.amount < bj.value) {
        return showToast('余额不足')
    }
    safeRef.value.open()
}
const submit = s => {
    const params = {
        lever: Number(lever.value[leverIndex.value]),
        days: Number(days.value[currDayIndex.value]),
        amount: Number(amount.value),
        safeword: s,
        token: sessionToken.value
    }
    if (loading.value) return
    loading.value = true
    _loan(params).then(res => {
        if (res.code == 200) {
            showToast('借贷成功');
            amount.value = ''
            bj.value = ''
            leverIndex.value = 0
            currDayIndex.value = 0
            store.dispatch('updateWallet') // 更新钱包
            setTimeout(() => {
                router.back()
            }, 500)
        }
    }).finally(() => {
        getSessionToken()
        loading.value = false
    })
}



// sessionToken
const sessionToken = computed(() => store.state.sessionToken || '')
const getSessionToken = () => {
    store.dispatch("updateSessionToken")
}
getSessionToken()

onMounted(() => {
    document.body.addEventListener('mouseup', cancelListen)
    setTimeout(() => {
        totalWidth.value = document.querySelector('.form').clientWidth
    }, 500)
})
onBeforeUnmount(() => {
    document.body.removeEventListener('mouseup', cancelListen)
})
</script>

<style lang="less" scoped>
.page_loadn {
    padding: 0.4rem 0.38rem 0 0.38rem;
    position: relative;
    overflow: hidden;

    .top-record {
        width: 0.64rem;
        height: 0.64rem;
        border-radius: 50%;
        background-color: #EDEDED;
        display: flex;
        align-items: center;
        justify-content: center;

        img {
            width: 0.36rem !important;
            height: 0.36rem !important;
        }
    }

    .form {
        width: 100%;

        .subtitle {
            color: #333333;
            font-size: 0.28rem;
            font-weight: 400;
            margin-bottom: 0.24rem;
            display: flex;
            align-items: center;
            justify-content: flex-start;

        }

        .money {
            font-size: 0.6rem;
            color: #000000;
            margin-bottom: 0.4rem;
        }

        .dates {
            margin-bottom: 0.4rem;
            display: flex;
            align-items: stretch;

            .date {
                height: 0.8rem;
                flex: 1;
                margin-right: 0.14rem;
                border-radius: 0.1rem;
                background-color: #F7F7F7;
                display: flex;
                align-items: center;
                justify-content: center;
                text-align: center;
                font-weight: 400;
                font-size: 0.28rem;
                color: #000000;
                transition: all ease .2s;

                &:last-child {
                    margin-right: 0;
                }
            }

            .date_active {
                color: #0066FF;
                border: 1px solid #0066FF;
                background-color: #EEF3FF;
            }
        }

        .item2 {
            display: flex;
            align-items: center;
            justify-content: space-between;
            margin-bottom: 0.4rem;
            height: 0.88rem;

            &:has(.ipt:focus) {
                height: 1.12rem;
            }

            .account_box {
                width: 2.4rem;
                margin-right: 0.2rem;
                color: #000000;
                font-size: 0.28rem;
                position: relative;
                display: flex;
                align-items: center;
                justify-content: center;

                .more_icon {
                    width: 0.3rem;
                    height: 0.3rem;
                    position: absolute;
                    right: 0.16rem;
                }
            }

            .ipt_box {
                flex: 1;
                padding: 0 0 0 0.2rem;
                display: flex;
                align-items: center;

                position: relative;

                .ipt {
                    height: 100%;
                    display: flex;
                    align-items: center;
                }

                &:has(.ipt:focus) {
                    padding-top: 0.3rem;

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
                    left: 0.4rem;
                    top: 50%;
                    transform: translateY(-50%);
                    pointer-events: none;
                    transition: all ease .2s;

                    span {
                        // color: #111111;
                    }
                }

                .all {
                    color: #1A59F6;
                    position: absolute;
                    right: 0.32rem;
                }
            }

            .border_item {
                border: 1px solid #D0D8E2;

                border-radius: 0.12rem;
                height: 100%;

                .item_icon {
                    width: 0.26rem;
                    height: 0.26rem;
                    margin-right: 0.08rem;
                    position: relative;
                    top: -0.02rem;
                }

                &:has(.ipt:focus) {
                    border: 1px solid #014CFA;
                }
            }

            .err_ipt {
                border: 1px solid #E8503A;
            }
        }

        .tip {
            font-size: 0.24rem;
            line-height: 0.4rem;
            color: #999;
            font-weight: 400;

            .num {
                color: #181818;
                margin-left: 0.08rem;
                font-size: 0.28rem;
                font-weight: 500
            }
        }

        .slider_box {
            padding: 0.2rem 0 0.5rem 0;


            .slider {
                width: 100%;
                height: 0.16rem;
                background-color: #EEEEEE;
                border-radius: 0.32rem;
                cursor: pointer;

                .slider_inner {
                    position: relative;
                    height: 100%;
                    background-color: #0066FF;
                    border-radius: 0.32rem;
                    transition: all ease .1s;
                    pointer-events: none;

                    .slider_ball {
                        width: 0.36rem;
                        height: 0.36rem;
                        border-radius: 50%;
                        background-color: #fff;
                        border: 0.1rem solid #0066FF;
                        position: absolute;
                        right: -0.09rem;
                        top: -0.09rem;
                    }
                }
            }

            .slider_bottom {
                display: flex;
                align-items: center;
                justify-content: space-between;
                color: #A2A2A7;
                font-weight: 400;
                font-size: 0.28rem;
                margin-top: 0.24rem;
                height: 0.36rem;

                .slider_item {
                    width: 0;
                    height: 100%;
                    position: relative;
                    text-align: center;

                    .text {
                        position: absolute;
                        left: 0;
                        transform: translateX(-50%);
                        pointer-events: none;
                    }

                    &:nth-child(1) {
                        .text {
                            transform: translateX(0%);
                        }
                    }

                    &:last-child {
                        .text {
                            transform: translateX(-100%);
                        }
                    }
                }

                .slider_item_avtive {
                    color: #1E1E2D;
                }
            }
        }
    }

    .submit {
        width: 100%;
        height: 1.12rem;
        margin: 1.2rem 0 0.4rem 0;
    }
}
</style>

<style lang="less" scoped>
.loan_comfirm_box {
    padding-bottom: 0.6rem;

    .loan_comfirm_title {
        color: #061023;
        font-size: 0.32rem;
        text-align: center;
        margin-bottom: 0.4rem;
        position: relative;
        justify-content: center;
        top: -0.3rem;
        display: flex;
        align-items: center;
        width: 100%;

        .close_icon {
            position: absolute;
            right: 0;
            width: 0.3rem;
            height: 0.3rem;
        }
    }

    .loan_confirm_amount {
        font-size: 0.64rem;
        color: #000000;
        font-weight: 700;
        margin: 0.1rem 0 0.4rem 0;
        text-align: center;
    }

    .loan_confirm_item {
        display: flex;
        align-items: center;
        justify-content: space-between;
        font-size: 0.28rem;
        color: #8F92A1;
        height: 1rem;
        padding-top: 0.12rem;
        font-weight: 400;
        border-bottom: 1px solid #F5F5F5;

        .value {
            color: #000000;
            font-weight: 500;
            display: flex;
            align-items: center;

            .tag {
                height: 0.44rem;
                color: #014CFA;
                background-color: rgba(1, 76, 250, 0.08);
                border-radius: 0.04rem;
                padding: 0 0.2rem;
                display: flex;
                align-items: center;
                font-size: 0.24rem;
            }
        }
    }

    .loan_confirm_tip {
        border-top: 1px dashed #CBCBCB;
        padding-top: 0.1rem;
        margin-top: 0.05rem;
        margin-bottom: 0.2rem;
        text-align: right;
        color: #8F92A1;
        font-size: 0.24rem;

        .value {
            color: #000000;
            margin-left: 0.2rem;
        }
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
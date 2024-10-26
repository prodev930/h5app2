<!-- 提现 -->
<template>
    <div class="page page_withdraw">
        <Top :title="'提现'">
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
            <div class="subtitle">金额</div>
            <div class="item2" :class="{ 'active_item': focus }">

                <div class="item_box item_currency" @click="showDialog = true">
                    <div class="currency" v-if="form.from">
                        <div class="currency_icon">
                            <img :src="`/static/img/crypto/${form.from.toUpperCase()}.png`" alt="currency">
                        </div>
                        <span>{{ form.from.toUpperCase() }}</span>
                    </div>
                    <div class="more">
                        <img src="/static/img/assets/more.png" alt="more">
                    </div>
                </div>

                <div class="item_box item_content" :class="{ 'err_ipt': errStatus }">
                    <span class="item_tip" v-show="form.amount === '' || focus">≤ <span>{{ balance }}</span></span>
                    <input class="ipt" @focus="focus = true" @blur="errStatus = focus = false" @change="changeAmount"
                        type="number" v-model="form.amount" placeholder="">
                    <span class="all" @click="maxIpt">全部</span>
                </div>

            </div>
            <div class="tip">
                <div>
                    <span>手续费</span>
                    <span class="num">{{ loading ? '--' : fee }}</span>
                </div>
            </div>


            <!-- 提款方式 -->
            <div class="subtitle" style="margin-top:0.24rem">收款账户</div>
            <div class="account_box">

                <div v-if="showAccount.length">
                    <div class="card_box" @click="showAccountDialog = true">
                        <div class="card_icon">
                            <img v-show="form.from.toUpperCase() == 'MAIN'" src="/static/img/user/card_type_b.png"
                                alt="img">
                            <img v-show="form.from.toUpperCase() != 'MAIN'" src="/static/img/user/card_type_c.png"
                                alt="img">
                        </div>
                        <div class="card">
                            <div class="code">{{ _hiddenAccount(currAccount.bankCardNumber || currAccount.address)
                                }}
                            </div>
                            <div class="name">{{ currAccount.symbol ? `${currAccount.symbol}-${currAccount.network}`
                                :
                                `${currAccount.bankName}` }}</div>

                        </div>
                        <div class="more_card">更改</div>


                    </div>
                </div>
                <div v-else>
                    <div class="add_account" @click="showAccountDialog = true">
                        <Icon style="font-size:0.48rem;" name="add-o" />
                        <span style="margin-left: 0.28rem;color:#014CFA;font-size: 0.24rem;">添加收款方式</span>
                    </div>
                </div>

            </div>
        </div>

        <Button @click="openSafePass" :loading="loading" round color="#014CFA" class="submit" type="primary">提现</Button>


        <!-- 账户种类选择弹窗 -->
        <Popup :safe-area-inset-top="true" :safe-area-inset-bottom="true" class="self_van_popup"
            v-model:show="showDialog" position="bottom" teleport="body">
            <div class="withdraw_accounr_dialog">
                <div class="close_icon" @click="showDialog = false">
                    <img src="/static/img/common/close.png" alt="x">
                </div>
                <div class="title">币种选择</div>
                <div @click="clickItem(item)" class="swap_dialog_item"
                    :class="{ 'swap_dialog_item_active': form.from == item.name }" v-for="(item, i) in wallet" :key="i">
                    <div class="icon">
                        <img :src="`/static/img/crypto/${item.name.toUpperCase()}.png`" alt="currency">
                    </div>
                    <span>{{ item.name.toUpperCase() }}</span>


                    <Icon v-if="form.from == item.name" class="check_icon" name="success" />
                </div>
            </div>
        </Popup>

        <!-- 账户选择弹窗 -->
        <Popup :safe-area-inset-top="true" :safe-area-inset-bottom="true" class="self_van_popup"
            v-model:show="showAccountDialog" position="bottom" teleport="body">
            <div class="withdraw_accounr_dialog">
                <div class="close_icon" @click="showAccountDialog = false">
                    <img src="/static/img/common/close.png" alt="x">
                </div>
                <div class="title">账户选择</div>
                <!-- <div class="search_box">
                    <input v-model.trim="searchStr" type="text" placeholder="搜索" />
                    <Icon name="search" />
                </div> -->
                <!-- <div class="tabs">
                    <div class="tab" :class="{ 'active_tab': form.from.toUpperCase() != 'MAIN' }">加密货币</div>
                    <div class="tab" :class="{ 'active_tab': form.from.toUpperCase() == 'MAIN' }">银行卡</div>
                </div> -->
                <div class="list">
                    <div class="add_item" @click="goAddAccount">
                        <Icon style="font-size:0.48rem;" name="add-o" />
                        <span style="margin-left: 0.2rem;color:#999999;font-size: 0.24rem;">添加收款账户</span>
                    </div>
                    <div @click="clickAccountItem(item)"
                        :class="{ 'dialog_account_item_active': currAccount.id == item.id }" class="dialog_account_item"
                        v-for="(item, i) in searchList" :key="i">
                        <div class="card_icon">
                            <img v-if="item.bankName" src="/static/img/user/card_type_b.png" alt="img">
                            <img v-else src="/static/img/user/card_type_c.png" alt="img">
                        </div>
                        <div class="card">
                            <div class="code">{{ _hiddenAccount(item.bankCardNumber || item.address) }}
                            </div>
                            <div class="name">{{ item.symbol ? `${item.symbol}-${item.network}` :
                                `${item.bankName}` }}</div>

                        </div>
                        <div v-if="currAccount.id == item.id" class="checked"
                            style="background-image: url('/static/img/user/check_bg.png');">
                            <img src="/static/img/common/ok.png" alt="img">
                        </div>
                    </div>
                </div>
            </div>
        </Popup>

        <!-- 安全密码弹窗 -->
        <SafePassword @submit="submit" ref="safeRef">
        </SafePassword>

        <!-- 充提记录 -->
        <RecordList ref="RecordListRef" />

        <!-- 账号验证 -->
        <AccountCheck ref="AccountCheckRef" />
    </div>
</template>

<script setup>
import Top from "@/components/Top.vue"
import { ref, computed, onMounted } from "vue"
import store from "@/store"
import { Icon, Button, Popup, showToast, showConfirmDialog } from "vant"
import router from "@/router"
import { _withdrawFee, _withdraw } from "@/api/api"
import SafePassword from "@/components/SafePassword.vue"
import { _hiddenAccount } from "@/utils/index"
import RecordList from "@/components/RecordList.vue"
import AccountCheck from "@/components/AccountCheck.vue"

const RecordListRef = ref()
const userInfo = computed(() => store.state.userInfo || {})

const focus = ref(false)
const loading = ref(false)
// 表单
const form = ref({
    amount: '',
    from: '',
    account: '',
})
const maxIpt = () => {
    form.value.amount = balance.value
    setTimeout(() => {
        getFee()
    }, 0)
}
const changeAmount = () => {
    setTimeout(() => {
        getFee()
    }, 0)
}

// 提交
const safeRef = ref()
const errStatus = ref(false)
const AccountCheckRef = ref()
const openSafePass = () => {
    if (!form.value.amount || form.value.amount <= 0) {
        errStatus.value = true
        return showToast('请输入金额')
    }
    if (form.value.amount > balance.value) {
        return showToast('余额不足')
    }
    if (!showAccount.value.length) {
        return showToast('请添加收款账户')
    }
    safeRef.value.open()

}
const submit = s => {
    if (loading.value) return
    loading.value = true
    _withdraw({
        currency: form.value.from,
        amount: form.value.amount,
        account_id: currAccount.value.id,
        safeword: s,
        token: sessionToken.value,
    }).then(res => {
        if (res.code == 200) {
            showToast('操作成功');
            form.value.amount = ''
            store.dispatch('updateWallet') // 更新钱包
            router.push({
                name: 'withdrawInfo'
            })
        }
    }).finally(() => {
        getSessionToken()
        loading.value = false
    })
}

// 手续费
const fee = ref(0)
const getFee = () => {
    if (!form.value.amount) return
    loading.value = true
    _withdrawFee({
        currency: form.value.from,
        amount: form.value.amount,
    }).then(res => {
        if (res.code == 200) {
            fee.value = res.data
        }
    }).finally(() => {
        loading.value = false
    })
}


// 钱包
const wallet = computed(() => { // 可选钱包列表
    return store.state.wallet || []
})
if (wallet.value[0]) {
    form.value.from = wallet.value[0].name
}
const balance = computed(() => { // main钱包余额
    let b = 0
    const main = store.state.wallet.find(item => item.name == form.value.from)
    if (main) b = main.amount
    return b
})

// 收款方式
store.dispatch('updateAccountList')
const accountList = computed(() => store.state.accountList || []) // 收款方式列表
// 可用钱包列表
const showAccount = computed(() => {
    if (form.value.from.toUpperCase() == 'MAIN') { // 银行卡
        return accountList.value.filter(item => !item.symbol) || []
    } else { // 虚拟货币
        return accountList.value.filter(item => item.symbol == form.value.from) || []
    }
})
// 当前钱包
const currAccount = computed(() => {
    if (form.value.account) {
        return showAccount.value.find(item => item.id == form.value.account)
    } else {
        return showAccount.value[0] || {}
    }
})
const showAccountDialog = ref(false)
const searchStr = ref('') // 账号搜索
const searchList = computed(() => {
    return showAccount.value.filter(item => {
        return (item.accountName && item.accountName.includes(searchStr.value))
            || (item.address && item.address.includes(searchStr.value))
            || (item.bankCardNumber && item.bankCardNumber.includes(searchStr.value))
            || (item.bankName && item.bankName.includes(searchStr.value))
            || (item.network && item.network.includes(searchStr.value))
            || (item.symbol && item.symbol.includes(searchStr.value))
    })
})
const clickAccountItem = item => {
    form.value.account = item.id
    showAccountDialog.value = false
}


// 账户弹窗
const showDialog = ref(false)
const clickItem = item => {
    form.value.from = item.name
    form.value.account = ''
    form.value.amount = ''
    showDialog.value = false
}




// sessionToken
const sessionToken = computed(() => store.state.sessionToken || '')
const getSessionToken = () => {
    store.dispatch("updateSessionToken")
}


// 跳转记录
const goRecord = () => {
    router.push({
        name: 'recordList',
        query: {
            tab: 1
        }
    })
}
// 跳转添加
const goAddAccount = () => {
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
    const target = wallet.value.find(a => a.name == form.value.from)
    if (target.type == 'fiat') {
        if (userInfo.value.kycl2 != 2) {
            return showConfirmDialog({
                title: '身份认证',
                message:
                    '你还未完成身份认证，是否去认证?',
            }).then(() => {
                jump('kyc')
            })
        }
        router.push({
            name: 'bank'
        })
    } else {
        router.push({
            name: 'crypto',
            query: {
                currency: form.value.from
            }
        })
    }
}


onMounted(() => {
    if (AccountCheckRef.value.check()) {
        getSessionToken()
    }
})

// 添加
const jump = (name) => {
    router.push({
        name
    })
}

Promise.all([
    import('@/views/User/Account/Bank.vue'),
    import('@/views/User/Account/Crypto.vue'),
])
</script>

<style lang="less" scoped>
.page_withdraw {
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
        .item2 {
            width: 100%;
            height: 0.88rem;
            border-radius: 0.32rem;
            display: flex;
            align-items: center;
            justify-content: space-between;
            font-weight: 400;
            transition: all ease .3s;

            div {
                transition: all ease .3s;
            }

            .item_box {
                height: 100%;
                display: flex;
                align-items: center;
                border-radius: 6px;
                border: 1px solid #D0D8E2;
            }

            .err_ipt {
                border: 1px solid #E8503A;
            }

            .item_currency {
                padding: 0 0.16rem 0 0.34rem;
                margin-right: 0.2rem;
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
                padding: 0 0.2rem;

                .ipt {
                    font-size: 0.24rem;
                    height: 100%;
                }

                .item_tip {
                    font-size: 0.24rem;
                    font-weight: 400;
                    color: #A4ACB9;
                    pointer-events: none;
                    white-space: nowrap;
                    position: absolute;
                    left: 0.2rem;
                    top: 50%;
                    transform: translateY(-50%);
                    transition: all ease .2s;

                }

                .all {
                    color: #1A59F6;
                    position: absolute;
                    right: 0.24rem;
                    font-size: 0.24rem;
                }
            }

            .currency {
                display: flex;
                align-items: center;
                line-height: 0;
                color: #061023;
                font-weight: 500;
                font-size: 0.26rem;

                .currency_icon {
                    width: 0.4rem;
                    height: 0.4rem;
                    margin-right: 0.12rem;
                }
            }

            .more {
                width: 0.28rem;
                height: 0.28rem;
                margin-left: 0.12rem;
            }

            .ipt {
                flex: 1;
                color: #292929;
                font-size: 0.28rem;
            }

            .btn {
                color: #1A59F6;
                font-size: 0.28rem;
                margin-left: 0.4rem;
            }
        }

        .active_item {
            height: 1rem;

            .item_content {
                border: 1px solid #014CFA;
                padding-top: 0.2rem;

                .ipt {
                    font-size: 0.28rem;
                }

                .item_tip {
                    top: 0.24rem;
                    left: 0.36rem;
                    font-size: 0.2rem;

                    span {
                        color: #A4ACB9;
                    }
                }
            }
        }



        .subtitle {
            font-size: 0.28rem;
            color: #061023;
            font-weight: 400;
            line-height: 0.5rem;
            margin: 0 0 0.2rem 0;
        }

        .tip {
            display: flex;
            align-items: center;
            justify-content: flex-end;
            font-weight: 400;
            font-size: 0.24rem;
            color: rgba(24, 24, 24, 0.5);
            line-height: 0.4rem;
            margin-top: 0.12rem;

            .num {
                color: #333333;
                margin-left: 0.2rem;
                font-weight: 500;
            }

        }

        .account_box {
            // padding-right: 0.24rem;

            .add_account {
                background-color: #F6F7FA;
                border-radius: 0.16rem;
                display: flex;
                align-items: center;
                justify-content: flex-start;
                height: 1.44rem;
                padding-left: 0.5rem;
            }

            .card_box {
                border-radius: 0.12rem;
                height: 1.44rem;
                display: flex;
                align-items: center;
                justify-content: space-between;
                position: relative;
                background-color: #F6F7FA;
                padding: 0 0.4rem 0 0.36rem;
                overflow: hidden;

                .card_icon {
                    background-color: #D9E4FF;
                    width: 0.96rem;
                    height: 0.96rem;
                    border-radius: 0.16rem;
                    display: flex;
                    align-items: center;
                    justify-content: center;

                    >img {
                        width: 0.64rem !important;
                        height: 0.64rem !important;
                    }
                }

                .card {
                    flex: 1;
                    margin: 0 0.2rem 0 0.36rem;
                    text-align: left;
                    font-size: 0.24rem;
                    color: #061023;
                    font-weight: 500;

                    .code {
                        font-size: 0.28rem;
                        margin-bottom: 0.1rem;
                        font-weight: 400;
                    }
                }

                .more_card {
                    color: #1A59F6;
                    font-size: 0.24rem;
                    font-weight: 400;
                }


            }
        }
    }

    .submit {
        width: calc(100% - 0.64rem);
        height: 1.12rem;
        position: absolute;
        bottom: 1rem;
        left: 50%;
        transform: translateX(-50%);
    }
}
</style>
<style lang="less" scoped>
.withdraw_accounr_dialog {
    background-color: #fff;
    border-top-left-radius: 0.4rem;
    border-top-right-radius: 0.4rem;
    overflow: hidden;
    padding: 1.2rem 0.32rem 0.8rem 0.32rem;
    position: relative;

    .title {
        height: 1rem;
        position: absolute;
        top: 0.2rem;
        left: 0;
        text-align: center;
        line-height: 1rem;
        font-size: 0.32rem;
        width: 100%;
        color: #121826;
        pointer-events: none;
        font-weight: bold;
    }

    .close_icon {
        position: absolute;
        width: 0.4rem;
        height: 0.4rem;
        top: 0.24rem;
        right: 0.32rem;
    }

    .swap_dialog_item {
        height: 1.12rem;
        line-height: 0;
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

    .search_box {
        height: 0.8rem;
        background-color: #F5F5F5;
        border-radius: 0.4rem;
        display: flex;
        align-items: center;
        justify-content: space-between;
        font-size: 0.32rem;
        padding: 0 0.4rem;

        input {
            flex: 1;
            color: #121826;
        }
    }

    .tabs {
        display: flex;
        align-items: center;
        justify-content: flex-start;
        margin-bottom: 0.4rem;

        .tab {
            height: 0.72rem;
            border-radius: 0.72rem;
            display: flex;
            align-items: center;
            padding: 0 0.4rem;
            color: #061023;
            font-size: 0.32rem;
            font-weight: 400;
        }

        .active_tab {
            background-color: #F6F8FF;
            color: #014CFA;
            font-weight: 500;
        }
    }

    .list {
        max-height: 70vh;
        overflow-y: auto;

        .add_account {
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 0.4rem 0;
        }
    }

    .add_item {
        margin-bottom: 0.36rem;
        border: 1px dashed #CCD7FD;
        border-radius: 0.12rem;
        height: 1.44rem;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .dialog_account_item {
        border-radius: 0.12rem;
        height: 1.44rem;
        display: flex;
        align-items: center;
        justify-content: space-between;
        position: relative;
        background-color: #F6F7FA;
        padding: 0 0.4rem 0 0.36rem;
        overflow: hidden;
        margin-bottom: 0.36rem;

        .card_icon {
            background-color: #D9E4FF;
            width: 0.96rem;
            height: 0.96rem;
            border-radius: 0.16rem;
            display: flex;
            align-items: center;
            justify-content: center;

            >img {
                width: 0.64rem !important;
                height: 0.64rem !important;
            }
        }

        .card {
            flex: 1;
            margin: 0 0.2rem 0 0.36rem;
            text-align: left;
            font-size: 0.24rem;
            color: #061023;
            font-weight: 500;
            line-height: 1;

            .code {
                font-size: 0.28rem;
                margin-bottom: 0.1rem;
                font-weight: 400;
            }
        }


    }

    .dialog_account_item_active {
        border: 1px solid #1A59F6;

        .checked {
            position: absolute;
            top: -0.04rem;
            right: -0.04rem;
            background-size: 100% 100%;
            width: 0.46rem;
            height: 0.42rem;

            >img {
                width: 0.18rem !important;
                height: 0.12rem !important;
                position: absolute;
                right: 0.06rem;
                top: 0.08rem;
            }
        }
    }

}
</style>
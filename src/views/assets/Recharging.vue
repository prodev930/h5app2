<!-- 充值中 -->
<template>
    <div class="page page_recharge">
        <Top :title="'充值'">
            <template #right>
                <div class="top-record" @click="goRecord">
                    <img src="/static/img/user/server.png" alt="img">
                </div>
            </template>
        </Top>

        <div class="form">
            <div class="amount">

                <div class="num" @click="copyPrice">
                    <span style="border-bottom:1px dashed #D0D2D6">{{ form.amount }}<b
                            style="font-size: 0.48rem;color:#333">{{
                                form.name
                            }}</b></span>
                    <div class="copy_icon" v-if="form.amount">
                        <img src="/static/img/common/copy2.png" alt="img">
                    </div>
                </div>
                <div v-if="rate" style="margin: 0 auto 0.32rem auto;width: 3.34rem;text-align: right;">{{
                    ratePrice }}
                    USDT</div>
                <div v-else style="height: 0.8rem;"></div>

                <div v-if="form.name"
                    style="background-color: #F6F6F6;color: #3830DD;display: inline-block;padding: 0 0.2rem;margin-bottom:0.04rem">
                    {{
                        form.name
                    }} · {{
                        form.network }}</div>
            </div>

            <div v-if="!form.amount" style="height: 1rem;"></div>
            <div class="qrcode_box">
                <Loading :loading="loading" v-show="loading" />
                <div id="qrcode" ref="qrcodeRef" v-show="!loading"></div>

                <!-- 已过期  -->
                <div v-if="s == 0 && !loading" style="width:100%;height:100%;position: absolute;top:0;left:0;z-index:1">
                    <img src="/static/img/assets/Expired.png" alt="Expired">
                </div>
                <div class="timeout_box" v-if="s == 0 && !loading">
                    <div class="warning_icon">
                        <img src="/static/img/common/warning.png" alt="img">
                    </div>
                    <div>二维码已过期</div>
                </div>
            </div>
            <div class="address" @click="copy" v-if="address">
                <span>{{ address }}</span>
                <div class=" copy_icon">
                    <img src="/static/img/common/copy2.png" alt="img">
                </div>
            </div>
        </div>

        <div class="circle_box">
            <Circle class="circle" :start-position="'right'" :stroke-linecap="'butt'" :stroke-width="150"
                :layer-color="'#E5E5E5'" :color="'#014CFA'" size="40px" v-if="s && !loading"
                v-model:current-rate="currentRate" :rate="0" :text="''" />
            <div class="time_box" v-if="s && !loading">
                <div class="time">{{ showS }}</div>
                <div>截至时间</div>
            </div>
        </div>
        <div class="tip">
            <div>提示：请在<span style="color:#FD4938">截至时间</span>内完成充值</div>
            <div>订单到期作废</div>
        </div>
        <div class="btns">
            <!-- <Button round color="#EFF6FF" class="submit" type="info" @click="router.back()">
                <span style="color:#014CFA">取消</span>
            </Button>
            <Button @click="openSure" :loading="loading" round color="#014CFA" class="submit" type="primary">确定</Button> -->

            <Button v-if="orderStatus == 'success'" @click="router.back()" :loading="loading" round color="#18B762"
                style="width:100%" class="submit" type="info"><span style="color:#fff">成功</span></Button>
            <Button v-else-if="orderStatus == 'failure'" @click="router.back()" :loading="loading" round color="#E8503A"
                style="width:100%" class="submit" type="info"><span style="color:#fff">失败</span></Button>
            <Button v-else @click="router.back()" :loading="loading" round color="#014CFA" style="width:100%"
                class="submit" type="info"><span style="color:#fff">完成</span></Button>
        </div>

    </div>
</template>

<script setup>
import Top from "@/components/Top.vue"
import { useRoute } from "vue-router"
import { ref, computed } from "vue"
import { Button, showToast, Circle } from "vant"
import { _copyTxt } from "@/utils/index.js"
import Loading from "@/components/Loaidng.vue"
import { _deposit1, _deposit, _depositGet, _swapRate } from "@/api/api"
import store from "@/store"
import router from "@/router"
import Decimal from "decimal.js"

const route = useRoute()

// sessionToken
const sessionToken = computed(() => store.state.sessionToken || '')
const getSessionToken = () => {
    loading.value = true
    return store.dispatch("updateSessionToken")
}


// 表单
const orderStatus = ref('') // 状态
const loading = ref(false)
const order_no = ref(route.query.order_no) // 订单编号
const form = ref({
    name: route.query.name,
    amount: Number(route.query.amount),
    currency: route.query.currency,
    network: route.query.network,
    // swap: route.query.swap ? JSON.parse(route.query.swap) : false
})
const address = ref('')


// 获取充值地址
const getAddress = () => {
    loading.value = true
    _deposit1({
        currency: form.value.currency,
        network: form.value.network,
        amount: form.value.amount,
        token: sessionToken.value,
        swap: form.value.swap
    }).then(res => {
        if (res.code == 200) {
            address.value = res.data?.address || ''
            drawQrcode()
            startCountDown(res.data?.timeout || 60)
            order_no.value = res.data?.order_no

            setTimeout(() => {
                getRate()
                router.replace({
                    name: 'recharging',
                    query: {
                        order_no: order_no.value
                    }
                })
            }, 200)
        }
    }).finally(() => {
        loading.value = false
    })
}

// 获取订单详情
const getOrderInfo = () => {
    loading.value = true
    _depositGet({
        order_no: order_no.value
    }).then(res => {
        if (res.data) {
            orderStatus.value = res.data.status
            form.value = {
                amount: res.data.amount,
                currency: res.data.currency,
                network: res.data.network,
                swap: false
            }
            address.value = res.data.address
            drawQrcode()
            startCountDown(res.data?.timeout || 60)

            setTimeout(() => {
                getRate()
            }, 200)
        }
    }).finally(() => {
        loading.value = false
    })
}

if (order_no.value) { // 查看订单详情
    getOrderInfo()
} else { // 获取充值地址
    getSessionToken().then(res => {
        getAddress()
    })
}


// 倒计时
const s = ref(0)
const showS = computed(() => {
    if (s.value > 0) {
        if (s.value < 3600) {
            const m = Math.floor(s.value / 60)
            const sec = s.value % 60
            return `${m >= 10 ? m : '0' + m}:${sec >= 10 ? sec : '0' + sec}`
        } else {
            const h = Math.floor(s.value / 3600)
            const m = Math.floor(s.value % 3600 / 60)
            const sec = s.value % 60
            return `${h}:${m >= 10 ? m : '0' + m}:${sec >= 10 ? sec : '0' + sec}`
        }
    }
    return '--'
})
const currentRate = computed(() => {
    return s.value * 100 / timeoutMax.value
})
let interval = null
const timeoutMax = ref(1)
const startCountDown = (max) => {
    if (!max || max <= 0) max = 0
    timeoutMax.value = max
    s.value = max
    interval && clearInterval(interval)
    interval = setInterval(() => {
        s.value--
        if (s.value == 0) {
            clearInterval(interval)
        }
    }, 1000);
}

// 生成二维码
const qrcodeRef = ref()
const drawQrcode = () => {
    setTimeout(() => {
        if (!qrcodeRef.value || !address.value) return
        new QRCode(qrcodeRef.value, {
            text: address.value,
            width: 128,
            height: 128,
        });
    }, 100)
}

const rate = ref(0)
const rateLoading = ref(false)
const ratePrice = computed(() => {
    if (!rate.value || rateLoading.value) return '--'
    return new Decimal(form.value.amount).mul(rate.value)
})
const getRate = () => { // 获取汇率
    rateLoading.value = true
    _swapRate({
        from: form.value.currency,
        to: 'USDT',
        amount: 0
    }).then(res => {
        if (res.code == 200) {
            rate.value = res.data.exchange_rate
        }
    }).finally(() => {
        rateLoading.value = false
    })
}



// 复制
const copy = () => {
    _copyTxt(address.value)
    showToast('已复制');
}
const copyPrice = () => {
    _copyTxt(form.value.amount)
    showToast('已复制');
}



</script>

<style lang="less" scoped>
.page_recharge {
    padding: 1.4rem 0.32rem 0.2rem 0.32rem;

    position: relative;

    .top-record {
        width: 0.4rem;
        height: 0.4rem;
    }

    .form {
        .amount {
            text-align: center;
            color: #000000;
            font-size: 0.28rem;
            line-height: 0.48rem;
            font-weight: 400;

            .num {
                font-weight: 600;
                font-size: 0.8rem;
                line-height: 0.9rem;
                word-break: break-all;
                display: flex;
                align-items: center;
                justify-content: center;

                .copy_icon {
                    width: 0.4rem;
                    height: 0.4rem;
                    line-height: 0;
                    position: relative;
                    left: 0.2rem;
                }
            }
        }

        .subtitle {
            font-weight: 400;
            font-size: 0.28rem;
            color: #323235;
            line-height: 0.44rem;
            margin-bottom: 0.4rem;
        }

        .qrcode_box {
            border: 1px solid #DFE2E4;
            background-color: #fff;
            width: 3rem;
            height: 3rem;
            margin: 0 auto;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 0.1rem;
            position: relative;

            .timeout_box {
                width: 100%;
                height: 100%;
                display: flex;
                align-items: center;
                flex-direction: column;
                justify-content: center;
                position: absolute;
                z-index: 9;
                top: 0;
                left: 0;
                background-color: rgba(255, 255, 255, 0.8);

                .warning_icon {
                    width: 1rem;
                    height: 1rem;
                    margin-bottom: 0.4rem;
                }
            }

            #qrcode {
                width: 100%;
                height: 100%;

                img {
                    width: 100%;
                    height: 100%;
                }
            }
        }

        .address {
            border-radius: 0.08rem;
            padding: 0 0.4rem 0 0.24rem;
            display: flex;
            align-items: center;
            justify-content: center;
            margin-top: 0.1rem;

            >span {
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
                color: #121212;
                font-weight: 400;
                font-size: 0.28rem;
            }

            .copy_icon {
                width: 0.36rem;
                height: 0.36rem;
                margin-left: 0.1rem;
                overflow: hidden;
            }
        }
    }

    .circle_box {
        margin: 0.32rem auto 0.24rem auto;
        display: flex;
        align-items: center;
        justify-content: center;

        .circle {
            display: block;
        }

        .time_box {
            margin-left: 0.12rem;
            color: #666;
            font-size: 0.24rem;
            font-weight: 400;
            text-align: left;

            .time {
                color: #E8503A;
                font-size: 0.32rem;
                font-weight: 500;
                margin-bottom: 0.07rem;
            }
        }
    }


    .tip {
        font-weight: 400;
        color: #191B1E;
        font-size: 0.24rem;
        line-height: 0.32rem;
        margin: 0 auto 0.4rem auto;
        text-align: center;
        background-color: #F2F1F9;
        width: 75vw;
        color: #333;
        padding: 0.12rem 0.5rem;
        line-height: 0.4rem;
        border-radius: 0.04rem;
    }

    .btns {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin: 0.68rem 0 0.4rem 0;

        .submit {
            width: 47%;
            height: 1.12rem;
        }
    }

}
</style>
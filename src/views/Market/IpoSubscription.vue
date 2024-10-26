<!-- IPO认购 -->
<template>
    <div class="page page_ipo_subs">
        <Top title="IPO认购" />

        <!-- tabs -->
        <!-- <div class="tabs">
            <div class="tab" :class="{ 'active_tab': avtiveTab == 1 }" @click="changeTab(1)">
                <span>普通认购</span>
            </div>
            <div class="tab" :class="{ 'active_tab': avtiveTab == 2 }" @click="changeTab(2)">
                <span>VIP认购</span>
                <div class="tag_tag">{{ lever }}X</div>
            </div>
        </div> -->

        <div class="ipo_info" @click="ipoDetail">
            <div class="ipo_info_lt">
                <div class="ipo_info_name">{{ currIpo.company_name }}</div>
                <div class="ipo_info_price">
                   认购价格 <span>${{ currIpo.issue_price_max }}</span>
                </div>
                <div v-show="avtiveTab == 2" class="ipo_info_price">
                    认购杠杆 <span class="blue">{{ currIpo.lever }}X</span>
                </div>
            </div>
            <Icon class="ipo_info_arrow" name="arrow" size="0.4rem" color="#666D80" />
        </div>

        <div class="form">
           
            <div class="subtitle">
                <span>认购数量</span>
                <span style="color:#666D80;">最大认购 {{ maxNum }}</span>
            </div>
            <div class="item item_box" :class="{ 'err_ipt': errStatus }">
                
                <input @change="inputNum" @focus="focus = true" @blur="focus = errStatus = false;amountBlur()"
                    v-model="form.volume" class="ipt" type="number" placeholder="">
                <span class="put_all" :style="{ opacity: focus ? '1' : '0', visibility: focus ? '' : 'hidden' }" @click="onSliderChange(100)">全部</span>
            </div>
            
            
            <div style="height:0.47rem;"></div>
            <!-- 拖动 -->
            <SlideContainer v-model="sliderValue" @change="onSliderChange" />

            <div v-if="form.volume > 0">
                <div>
                    <div class="subtitle">订购数量</div>
                    <div class="item item_box disabled_item">{{ form.volume }}</div>
                </div>
                <div  v-show="avtiveTab == 2">
                    <div class="subtitle">冻结金额</div>
                    <div class="item item_box disabled_item">{{ freezeNum }}</div>
                </div>
                <div  v-show="avtiveTab == 2">
                    <div class="subtitle">借贷金额</div>
                    <div class="item item_box disabled_item">{{ loanNum }}</div>
                </div>
                <div v-show="avtiveTab == 2">
                    <div class="subtitle">借贷手续费</div>
                    <div class="item item_box disabled_item">{{ feeNum }}</div>
                </div>
            </div>

            <div class="subtitle" v-show="avtiveTab == 2">VIP认购码</div>
            <div class="item item_box" v-show="avtiveTab == 2" :class="{ 'err_ipt': errStatus2 }">
                <input @blur="errStatus2 = false" v-model="form.keyword" type="text" class="ipt2" placeholder="">
        
            </div>


        </div>


        <Button @click="openSafe" :loading="loading" round  size="large" color="#014CFA" class="submit" type="primary">认购</Button>

        <!-- 安全密码弹窗 -->
        <SafePassword @submit="submit" ref="safeRef">
            
        </SafePassword>
    </div>
</template>

<script setup>

import Top from '@/components/Top.vue';
import { ref, computed, nextTick } from "vue"
import { useRoute } from "vue-router"
import { Button, showToast, Slider,Icon } from "vant"
import SafePassword from "@/components/SafePassword.vue"
import SlideContainer from "@/components/SlideContainer.vue"
import store from '@/store';
import { _orderBuy, _orderPara, _basic } from "@/api/api"

import Decimal from 'decimal.js';
import router from '@/router'

const currency = computed(() => (store.state.accountCurrencyMap.ipo || '') )
const mainWallet = computed(() => (store.state.wallet || []).find(a => a.currency == currency.value) || {}) // 主钱包
const route = useRoute()

const currIpo = ref(route.query)
const avtiveTab = ref(1)
const lever = currIpo.value.lever
if(lever > 1){
    avtiveTab.value = 2
}
const loading = ref(false)
const safeRef = ref()


const changeTab = key => {
    sliderValue.value = 0
    form.value = {
        volume: '',
        keyword: '',
    }
    avtiveTab.value = key
}
// 最大值
const maxNum = computed(() => { 
    if(!mainWallet.value.amount){
        return 0
    }
    const amount = (avtiveTab.value == 2) ? (new Decimal(mainWallet.value.amount).mul(lever)) : new Decimal(mainWallet.value.amount)
    return amount.div(currIpo.value.issue_price_max).toNumber()
})
const ipoDetail = ()=>{
    router.push('/ipo/detail?id='+currIpo.value.id)
}
const form = ref({
    volume: '',
    keyword: '',
})
const sliderValue = ref(0);
const onSliderChange = (newValue) => {
    errStatus.value = false
    sliderValue.value = newValue;
    nextTick(()=>{
        const val = new Decimal(maxNum.value).mul(newValue).div(100).toFixed(2)
        if (!Number(val)) {
            sliderValue.value = 0
            form.value.volume = ''
        } else {
            form.value.volume = Number(val)
            inputLimit()
        }
        if (form.value.volume == 0 ) {
            sliderValue.value = 0
        }
    })
};
const inputLimit = () => {
    if (form.value.volume <= volumeMap.value.min) { // 最小购买
        form.value.volume = volumeMap.value.min
    } else { // 步长限制
        const diff = new Decimal(form.value.volume).sub(volumeMap.value.min)
        const more = diff.mod(volumeMap.value.step)
        form.value.volume = new Decimal(form.value.volume).sub(more)
    }

    setTimeout(() => {
        sliderValue.value = parseInt(form.value.volume * 100 / maxNum.value)
        if (sliderValue.value > 100) sliderValue.value = 100
    }, 50)
}


const amountBlur = ()=>{
    nextTick(()=>{
        if(form.value.volume > maxNum.value){
            form.value.volume = maxNum.value
        }
    })
}

const inputNum = () => {
    setTimeout(() => {
        if (form.value.volume) {
            inputLimit()
        } else {
            sliderValue.value = 0
        }
    }, 0)
}

const focus = ref(false)
const errStatus = ref(false)
const errStatus2 = ref(false)
const openSafe = () => {
    if (!form.value.volume || form.value.volume <= 0) {
        errStatus.value = true
        return showToast('请输入认购数量')
    }
    if (avtiveTab.value == 2 && !form.value.keyword) {
        errStatus2.value = true
        return showToast('请输入VIP认购码')
    }
    safeRef.value.open()
}
// 提交表单
const submit = (s) => {
    if (loading.value) return
    const params = {
        volume: form.value.volume,
        keyword: avtiveTab.value == 2 ? form.value.keyword : '',
        ipoid: currIpo.value.id,
        safeword: s,
        token: sessionToken.value
    }
    loading.value = true
    _orderBuy(params).then(res => {
        if (res.code == 200) {
            router.replace({
                name: 'subscriptionSuccess'
            });
        }
    }).finally(() => {
        getSessionToken()
        setTimeout(() => {
            loading.value = false
        }, 500)
    })
}

// sessionToken
const sessionToken = computed(() => store.state.sessionToken || '')
const getSessionToken = () => {
    loading.value = true
    store.dispatch("updateSessionToken").finally(() => {
        loading.value = false
    })
}
getSessionToken()

// 手续费
const fee = ref(0)
const freezeNum = computed(() => {
    if (!form.value.volume) return 0
    return new Decimal(form.value.volume).div(lever).mul(currIpo.value.issue_price_max).toFixed(2)
})
const loanNum = computed(() => {
    if (!form.value.volume) return 0
    let _freezeNum = freezeNum.value || 0
    return new Decimal(form.value.volume).mul(currIpo.value.issue_price_max).sub(_freezeNum).toFixed(2)
})
const feeNum = computed(() => {
    if (!form.value.volume) return 0
    return new Decimal(loanNum.value).mul(fee.value).toFixed(2)
})
const volumeMap = ref({
    min: 0, // 最小值
    step: 1, // 步长
})
const getFee = () => {
    _orderPara().then(res => {
        if (res.code == 200) {
            fee.value = res.data.fee
            try {
                const arr = res.data.volume.split(',')
                volumeMap.value.min = arr[0]
                volumeMap.value.step = arr[1]
            } catch { }
            inputLimit()
        }
    })
}
//getFee()
</script>

<style lang="less" scoped>
.page_ipo_subs {
    padding: 1.12rem 0.32rem 1.6rem 0.32rem;

    position: relative;

    .tabs {
        display: flex;
        align-items: stretch;
        justify-content: flex-start;
        border-bottom: 1px solid #3B82F6;
        height: 0.54rem;
        padding-left: 0.4rem;
        margin-bottom: 0.4rem;

        .tab {
            color: #9EA3AE;
            font-size: 0.28rem;
            font-weight: 400;
            margin-right: 0.44rem;
            position: relative;

            .tag_tag {
                position: absolute;
                width: 0.36rem;
                height: 0.34rem;
                border-radius: 50%;
                background-color: #FFA800;
                color: #fff;
                font-size: 0.16rem;
                display: flex;
                align-items: center;
                justify-content: center;
                right: -0.3rem;
                top: -0.2rem;
            }
        }

        .active_tab {
            color: #121826;
            font-weight: 500;
            border-bottom: 3px solid #014CFA;

        }
    }

    .ipo_info{
        border-radius: 0.32rem;
        border: 1px solid  #EFF3F8;
        background: #F5F7FC;
        padding:0.28rem 0.32rem;
        display: flex;
        justify-content: space-between;
        margin-top: 0.28rem;
        &_lt{
            flex: 1;
        }
        &_arrow{
            margin-top: 0.32rem;
        }
        &_name{
            color: #061023;
            font-size: 0.32rem;
            font-weight: 600;
            line-height: 0.36rem; /* 112.5% */
        }
        &_price{
            color: #8F92A1;
            font-size: 0.3rem;
            font-weight: 400;
            line-height: 0.36rem;
            margin-top: 0.2rem;
            span{
                margin-left: 0.12rem;
                color: #E8503A;
            }
            .blue{
                color:#014CFA;
            }
        }
        
    }
    
     .put_all{
        color: #014CFA;
        position: absolute;
        right: 0.32rem;
        font-size: 0.3rem;
        z-index:9;
        transition: all ease .3s;
    }
    .subtitle {
        color: #061023;
        font-size: 0.28rem;
        margin-bottom: 0.12rem;
        line-height: 0.36rem;
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-top:0.4rem;
    }
    .item {
        display: flex;
        align-items: center;
        justify-content: space-between;
        position: relative;
        .ipt {
            flex: 1;
            height: 100%;
            width: 2rem;
            font-size: 0.28rem;
            padding: 0;
            position: relative;
            z-index: 1;
        }
        .ipt_tip {
            color: #b7b7b7;
            font-size: 0.24rem;
            position: absolute;
            left: 0.24rem;
            transition: all ease .3s;
        }
    }

    .item_box {
        position: relative;
        height: 0.92rem;
        border-radius: 0.32rem;
        border: 1px solid #d0d8e2;
        padding: 0 0.24rem;

    }
    .item_focus {
        height: 1.12rem;
        border: 1px solid #034cfa;

        .ipt_tip {
            font-size: 0.2rem;
            transform: translateY(-0.36rem);
        }
    }
    .disabled_item {
        background-color: #F5F7FC;
    }


    .error_border {
        border: 1px solid #e8503a !important;
    }

    .submit {
        margin-top: 0.8rem;
    }
}

</style>
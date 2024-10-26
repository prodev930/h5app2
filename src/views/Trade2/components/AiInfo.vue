<!-- ai量化-订单详情 -->
<template>
    <Popup teleport="body" lazy-render v-model:show="showModel" position="right" style="width:100%;height:100%;">
         <Top title="订单详情" :backFunc="backFunc" />
         <div class="ai_order_info">
            
            <!-- 盈利 -->
            <div class="win" :style="{backgroundImage:currItem.profit >= 0 ? 'url(/static/img/trade/profit_bg.png)' : 'url(/static/img/trade/loss_bg.png)'}" v-if="currItem.status == 'close'">
                <div class="win-animate-bg"></div>
                <div class="win_name">盈利</div>
                <div class="amount" :class="[currItem.profit < 0 ? 'down' : 'up']">{{ currItem.profit >= 0 ? '+'
                    : ''
                    }}{{ currItem.profit }}</div>
            </div>
           
            <div class="win-box" v-else>
                 <!-- 加载 -->
               
                    <div class="circle-wrap">
                        <div class="circle-mid">
                            <div class="time">{{ formatSec2(currItem.endtime,true) }}</div>
                            <div class="text">倒计时</div>
                        </div>
                        <Circle v-if="currItem.status == 'open'" start-position="bottom"
                            stroke-linecap="round" stroke-width="142" layer-color="#F5F7FC" :color="gradientColor"
                            size="182" :rate="100" :current-rate="100-rate" />
                    </div>

                    <div class="time_bg" >
                        <strong>{{currItem.time}}</strong>
                        <span class="unit">{{_dateUnitMap[currItem.unit]}}</span>
                    </div>

                    <div class="time_tip" >
                        {{currItem.time + _dateUnitMap[currItem.unit]}}交易结束
                    </div>
            </div>

             <div class="stock-info">
                <div class="stock-info__symbol">{{ currItem.name || '--' }}</div>
                <div class="stock-info__order_no">
                    <span>订单号 {{ currItem.order_no || '--' }}</span>
                    <div class="stock-info__copy_icon" @click="copy(currItem.order_no)">
                        <img src="/static/img/trade/copy.png" alt="copy">
                    </div>
                </div>
            </div>
            <div class="info_boxs">
               
                <div class="info_box" v-if="currItem.status == 'close'">
                    <div>时间区域</div>
                    <div class="amount">
                        {{ currItem.time }}{{ currItem.unit }}
                    </div>
                </div>
                <div class="info_box info_box--line" v-if="currItem.status == 'close'">
                    <div>网格数量</div>
                    <div class="amount">
                        {{ currItem.lever }}
                    </div>
                </div>
                <div class="split-line" v-if="currItem.status == 'close'"></div>
                <div class="info_box">
                    <div>投资额(USDT)</div>
                    <div class="amount">
                       {{ currItem.amount }}
                    </div>
                </div>
                <div class="info_box info_box--line">
                    <div>预期盈亏金额(USDT)</div>
                    <div class="amount">
                       {{ getRange() }}
                    </div>
                </div>
            </div>

        </div>
    </Popup>
</template>

<script setup>
import { Button, Popup, Circle,showToast } from "vant"
import { _copyTxt } from "@/utils/index"
import { ref, computed, onBeforeUnmount } from "vue"
import { _aiget } from "@/api/api"
import { formatSec2 } from "@/utils/time"
import Decimal from 'decimal.js';
import { _dateUnitMap } from "@/utils/dataMap"
import Loaidng from "@/components/Loaidng.vue"
import Top from "@/components/Top.vue"
const emits = defineEmits(['back'])

const rate = computed(() => {
    let t = currItem.value.time || 1
    if (currItem.value.unit == 'm') {
        t *= 60
    }
    if (currItem.value.unit == 'h') {
        t *= 3600
    }
    if (currItem.value.unit == 'd') {
        t *= (3600 * 24)
    }
    const p = currItem.value.endtime * 100 / t
    return p > 100 ? 100 : p
})


//  复制
const copy = text => {
    _copyTxt(text)
    showToast('已复制')
}

const backFunc = ()=>{
    showModel.value = false
}

const gradientColor = {
    '0%': '#014CFA',
    '100%': '#608BEF'
};

const showModel = ref(false)
const currItem = ref({})
const open = (item) => {
    currItem.value = item
    getInfo()
    showModel.value = true
    if (timeout) clearInterval(timeout)
}

// 获取详情
let timeout = null
const loading = ref(false)
const getInfo = () => {
    loading.value = true
    _aiget({
        order_no: currItem.value.order_no
    }).then(res => {
        if (res.data) {
            currItem.value = res.data
            if (currItem.value.endtime) { // 开始倒计时
                if (timeout) clearInterval(timeout)
                timeout = setInterval(() => {
                    currItem.value.endtime--
                    if (currItem.value.endtime <= 0) {
                        clearInterval(timeout)

                        loading.value = true
                        setTimeout(() => {
                            getInfo()
                        }, 1000)
                    }
                }, 1000)
            }
        }
    }).finally(() => {
        loading.value = false
    })
}


const getRange = () => { // 获取预计盈亏
    if (!currItem.value.amountreturn) return '--'
    if (!currItem.value.amount) return '--'
    const rangereturn = currItem.value.amountreturn
    let rs = '--'
    try {
        const arr = rangereturn.split(' - ')
        const start = new Decimal(currItem.value.amount).mul(Number(arr[0])).div(100)
        const end = new Decimal(currItem.value.amount).mul(Number(arr[1])).div(100)
        rs = `${start} - ${end}`
    } catch { }

    return rs
}


onBeforeUnmount(() => {
    timeout && clearInterval(timeout)
})
defineExpose({
    open
})

</script>

<style lang="less" scoped>
.ai_order_info {
    padding: 0.32rem 0 1rem 0;
    margin-top: 1.12rem;
    height: calc(100vh - 1.12rem);
    overflow-y: auto;
    box-sizing: border-box;
    .title {
        font-size: 0.32rem;
        line-height: 0.6rem;
        text-align: center;
        margin-bottom: 0.2rem;
    }

    .win {
        display: flex;
        align-items: center;
        flex-direction: column;    
        height: 4.6rem;
        background-size: 100% 3.3rem;
        background-repeat: no-repeat;
        background-position: 0 100%;
        padding-top: 0.58rem;
        box-sizing: border-box;
        position: relative;
        overflow: hidden;
        .win_name {
            color: #000;
            text-align: center;
            font-size: 0.3rem;
            font-weight: 400;
            line-height: 100%; 
            position: relative;
            z-index: 1;
            animation: opacityanimate 0.5s;
        }
        .amount {
            font-size: 0.6rem;
            font-weight: 600;
            line-height: 100%;
            margin-top: 0.32rem;
            position: relative;
            z-index: 1;
            animation: opacityanimate 0.5s;

        }
    }
    
    .win-box{
        box-sizing: border-box;
        border-radius: 0.32rem;
        padding: 0.52rem;
        background: #FFF;
        height: 6.88rem;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-direction: column;
        box-shadow: 0px 4px 40px 0px rgba(1, 76, 250, 0.20);
        margin: 0 0.32rem;
    }
    

    .circle-wrap {
        width: 182px;
        position: relative;
    }

    .circle-mid{
        box-shadow:0px 0px 20px rgba(1, 76, 250, 0.10);
        width: 136px;
        height: 136px;
        border-radius: 50%;
        position: absolute;
        left:23px;
        top:23px;
        border-radius: 50%;
        z-index: 1;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-direction: column;
        .time {
            color:#014CFA;
            text-align: center;
            font-family: "SF Pro Display";
            font-size: 0.52rem;
            font-style: normal;
            font-weight: 800;
            line-height: 0.6rem;
        }
        .text{
            color:#8F92A1;
            text-align: center;
            font-size: 0.28rem;
            font-style: normal;
            font-weight: 400;
            line-height: 0.32rem;
            margin-top: 0.1rem;
        }
    }
  
    .name {
        font-weight: 600;
        color: #000;
        font-size: 0.32rem;
        margin: 0 0 0.2rem 0;
        
    }

    .time_bg{
        width: 3.42rem;
        height: 1.2rem;
        border-radius: 1rem;
        background: #014CFA;
        color:#fff;
        font-weight: 600;
        font-size: 0.3rem;
        justify-content: center;
        display: flex;
        margin-top: 0.4rem;
        align-items: center;
        strong{
            font-size:0.8rem;
            margin-right: 0.1rem;
        }
        .unit{
            position: relative;
            top:0.1rem;
        }
    }
    .time_tip{
        color: #8F92A1;
        text-align: center;
        font-size: 0.28rem;
        font-weight: 400;
        line-height: 100%;
        height: 0.28rem;
        margin-top:0.2rem;
    }
    
}

.stock-info{
    background-color: #F5F7FC;
    border-radius: 0.32rem;
    margin:0.4rem 0.32rem 0 0.32rem;
    padding: 0.2rem 0.32rem 0.6rem 0.32rem;
    
    &__symbol{
        font-size: 0.3rem;
        font-weight: 600;
        line-height: 0.36rem;
    }
    
    &__order_no{
        display: flex;
        align-items: center;
        color:#8F92A1;
        margin-top: 0.12rem;
        span{
            font-size: 0.28rem;
        }
    }

    &__copy_icon {
        width: 0.24rem;
        height: 0.24rem;
        margin-left: 0.12rem;
        img{
            width: 100%;
            height: 100%;
        }
    }

}


.info_boxs {
    padding: 0.3rem 0;
    position: relative;
    border: 1px solid #EFF3F8;
    border-radius: 0.32rem;
    background-color: #fff;
    margin: -0.5rem 0.32rem 0 0.32rem;

    z-index: 1;
    &::after{
        content: '';
        display: block;
        clear: both;
    }
    .info_box {
        width: 50%;
        float: left;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        color: #8F92A1;
        font-size: 0.28rem;
        line-height: 0.44rem;
        position: relative;
        .amount {
            flex: 1;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            line-height: 0.44rem;
            margin-top: 0.12rem;
            font-weight: 600;
            color: #061023;
            font-size: 0.36rem;
        }
    }
    .info_box--line::after{
        content: '';
        width: 1px;
        height: 0.9rem;
        background-color: #EFF3F8;
        position: absolute;
        left:0;
        top:50%;
        margin-top:-0.45rem;
    }
}
.win-animate-bg{
    position: absolute;
    left:100%;
    top:0;
    width: 100%;
    height: 100%;
    background-color: #fff;
    animation: bganimate 1.4s;
}

@keyframes bganimate {
    0% {
        left:0;
    }
    100% {
        left:100%;
    }
}

@keyframes opacityanimate {
    0% {
        opacity: 0;
    }
    100% {
        opacity: 1;
    }
}

.split-line{
    clear: both;
    height: 0.62rem;
    position: relative;
    margin:0 0.42rem;
    &::after{
        content: '';
        width: 100%;
        position: absolute;
        left:0;
        top:50%;
        height: 1px;
        background-color: #EFF3F8;
    }
}
</style>
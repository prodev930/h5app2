<!-- 充值 -->
<template>
    <div class="page page_amount-verification">
        <Top :title="'充值确认'" :backFunc="backFunc">
        </Top>

        <div class="send-money">
            <span>充值金额</span>
            <div></div>
        </div>
        <div class="amount-money">
            {{ rechargeAmount }}
        </div>
        <div class="code-img-box">
            <img src="/static/img/assets/code.png" alt="→" class="code-img">
        </div>
        <div class="code-text">
            gutytytyrtrrtdtd
        </div>


        <div class="circle-box">
            <Circle
                v-model:current-rate="currentRate"
                :rate="46"
                :speed="100"
                layer-color="#ebedf0"
                color="#5939f5"
                :stroke-width="60"
                size="50px"
                :clockwise="false"
            />
            <div class="circle-box-text">
                <div class="circle-box-text-p">
                    {{ text }}
                </div>
                <div style="color: #8d8d8d;">进度</div>
            </div>
        </div>

        <div class="verification-weight-text">
            Touch ID sensor to verify transaction
        </div>
        <div class="verification-text">
            Please verify your identity
        </div>
       
        <div class="amount-line">
            <div class="amount-line-box">
                <div>
                    确定
                </div>
                <div>
                    继续
                </div>
            </div>
        </div>
        

       
    </div>
</template>

<script setup>
import Top from "@/components/Top.vue"
import router from "@/router"
import { ref, computed } from "vue"
import store from "@/store";
import { Popup, Button, Tabs, Tab, Circle, PasswordInput } from "vant"
import { useRoute } from "vue-router"

const route = useRoute()

const currentRate = ref(0);
const text = computed(() => currentRate.value.toFixed(0) + '%');
const rechargeAmount = computed(() => {
    return store.state.rechargeAmount
})
const emit = defineEmits();

const backFunc = ()=>{
    emit('backFunc')
}


</script>

<style lang="less" scoped>
.page_amount-verification {
    height: 100%;
    position: relative;

    .top-record {
        width: 0.4rem;
        height: 0.4rem;
    }
    .send-money {
        text-align: center;
        span {
            font-size: 0.32rem;
            color: #8e8e93;
        }
    }
    .amount-money {
        text-align: center;
        margin-top: 0.4rem;
        font-size: 1rem;
        font-weight: 800;
    }
    .code-img-box {
        width: 100%;
        display: flex;
        justify-content: center;
        margin-top: 0.2rem;
        .code-img {
            width: 4rem !important;
            height: 4rem !important;
        }
    }  
    .code-text {
        text-align: center;
        font-size: 0.28rem;
        font-weight: 700;
        margin-top: 0.2rem;
        margin-bottom: 0.4rem;
    } 
    .circle-box {
        display: flex;
        justify-content: center;
        .circle-box-text {
            margin-left: 0.4rem;
            margin-top: 0.1rem;
            .circle-box-text-p {
                font-size: 0.36rem;
                margin-bottom: 0.1rem;
            }
        }
    }

    .amount-line {
        padding: 0 0.32rem;
        .amount-line-text {
            font-size: 0.32rem;
            font-style: normal;
            margin-bottom: 0.2rem;
        }
        .amount-line-box {
            display: flex;
            justify-content: center;
            div {
                width: 1.8rem;
                line-height: 0.8rem;
                height: 0.8rem;
                text-align: center;
                background: #dfe0fb;
                color: #8e90f3;
                border-radius: 0.12rem;
                font-weight: 600;
                margin-right: 0.2rem;
            }
        }
    }
    .verification-weight-text {
        margin-top: 0.3rem;
        text-align: center;
        font-size: 0.44rem;
        font-weight: 600;
    }
    .verification-text {
        margin-top: 0.3rem;
        text-align: center;
        font-size: 0.32rem;
        margin-bottom: 1rem;
        color: #8e8e93;
    }
    
}
</style>
<!-- 添加加密货币 -->
<template>
    <div class="page page_crypto">
        <Top :title="'加密货币'" />

        <div class="subtitle">加密货币</div>
        <div class="item" @click="showCrypto = true">
            <div class="iten_icon">
                <img :src="`/static/img/crypto/${form.currency}.png`" alt="usdt">
            </div>
            <div class="ipt">{{ form.currency }}</div>
            <Icon style="transform: rotate(90deg);" name="play" />
        </div>
        <div class="subtitle">网络</div>
        <div class="item" @click="showNet = true">
            <div class="ipt">{{ form.network }}</div>
            <Icon style="transform: rotate(90deg);" name="play" />
        </div>
        <div class="subtitle">地址</div>
        <div class="item">
            <input type="text" v-model.trim="form.address" class="ipt" maxlength="50">
        </div>

        <div style="flex: 1;"></div>
        <Button :disabled="!form.address" class="submit" :loading="loading" type="primary" round color="#014CFA"
            @click="next">保存</Button>


        <!-- 币种 -->
        <Popup :safe-area-inset-top="true" :safe-area-inset-bottom="true" round v-model:show="showCrypto"
            position="bottom">
            <div class="bottoms">
                <div @click="chooseCurrency(item)" class="bottom" :class="{ 'active_bottom': form.currency == item }"
                    v-for="item in currencyMapList" :key="item">
                    <div class="bottom_icon">
                        <img :src="`/static/img/crypto/${item.toUpperCase()}.png`" alt="usdt">
                    </div>
                    <span>{{ item }}</span>
                </div>
                <Icon @click="showCrypto = false" class="close" name="cross" />
            </div>
        </Popup>

        <!-- 网络 -->
        <Popup :safe-area-inset-top="true" :safe-area-inset-bottom="true" round v-model:show="showNet"
            position="bottom">
            <div class="bottoms">
                <div @click="chooseNet(item)" class="bottom" :class="{ 'active_bottom': form.network == item }"
                    v-for="item in currNetwork" :key="item">
                    <!-- <div class="bottom_icon">
                        <img :src="`/static/img/crypto/${item}.png`" alt="usdt">
                    </div> -->
                    <span>{{ item.network }}</span>
                </div>
                <Icon @click="showNet = false" class="close" name="cross" />
            </div>
        </Popup>

        <!-- 谷歌验证 -->
        <GoogleVerfCode ref="googleRef" @submit="submit" />
    </div>
</template>

<script setup>
import { Button, Icon, Popup, showToast } from "vant"
import GoogleVerfCode from "@/components/GoogleVerfCode.vue"
import Top from '@/components/Top.vue';
import { ref, computed } from "vue"
import { _addAccount, _cryptoCoin } from "@/api/api"
import router from "@/router";
import store from "@/store";
import { useRoute } from "vue-router"

const route = useRoute()
const coinMap = computed(() => store.state.coinMap || {})


const googleRef = ref()

const loading = ref(false)
const form = ref({
    channel: 'crypto',
    currency: route.query.currency || 'USDT',
    network: '',
    address: '',
    // account_name: null,
    // bank_name: null,
    // bank_card_number: null,
})

// 币种
const showCrypto = ref(false)
const chooseCurrency = (item) => {
    form.value.currency = item
    showCrypto.value = false
    initNetwork()
}
// 网络
const showNet = ref(false)
const chooseNet = (item) => {
    form.value.network = item.network
    showNet.value = false
}
const currNetwork = computed(() => {
    return coinMap.value[form.value.currency] || []
})

setTimeout(() => {
    console.error('????', coinMap.value, form.value.currency, currNetwork.value)
}, 5000)
const initNetwork = () => {
    if (currNetwork.value[0]) {
        form.value.network = currNetwork.value[0].network
    }
}
initNetwork()


const currencyMapList = computed(() => {
    return Object.keys(coinMap.value) || []
})
_cryptoCoin({ dedup: false }).then(res => {
    store.commit('setCoinMap', res.data || [])
})


// 提交
const submit = (googleCode) => {
    if (loading.value) return
    loading.value = true
    const params = {
        ...form.value,
        googlecode: googleCode,
        token: sessionToken.value
    }
    _addAccount(params).then(res => {
        if (res.code == 200) {
            showToast('添加成功')
            setTimeout(() => {
                router.back()
            }, 200)
        }
    }).finally(() => {
        getSessionToken()
        loading.value = false
    })
}
const next = () => {
    googleRef.value.open()
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
</script>

<style lang="less" scoped>
.page_crypto {
    padding: 1.4rem 0.32rem 1rem 0.32rem;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: flex-start;

    .subtitle {
        font-weight: 400;
        font-size: 0.28rem;
        line-height: 0.36rem;
        color: #333333;
        margin-bottom: 0.15rem;
    }

    .item {
        width: 100%;
        height: 1.12rem;
        border: 1px solid #D0D8E2;
        border-radius: 0.32rem;
        margin-bottom: 0.22rem;
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 0 0.44rem;

        .ipt {
            flex: 1;
            height: 100%;
            font-size: 0.24rem;
            text-align: left;
            outline: none;
            border: none;
            background-color: rgba(0, 0, 0, 0);
            display: flex;
            align-items: center;
            justify-content: flex-start;
            font-weight: 600;
            color: #061023;
        }

        .iten_icon {
            width: 0.45rem;
            height: 0.45rem;
            margin-right: 0.15rem;
        }
    }

    .submit {
        height: 1.12rem;
        width: 100%;
    }

    .bottoms {
        position: relative;
        padding: 1.12rem 0;

        .close {
            position: absolute;
            font-size: 0.4rem;
            top: 0.3rem;
            right: 0.4rem;
            color: #161616;
        }

        .bottom {
            color: #111111;
            font-size: 0.28rem;
            height: 1.12rem;
            display: flex;
            align-items: center;
            justify-content: center;
            overflow: hidden;
            border-bottom: 1px solid #F5F5F5;

            &:last-child {
                border-bottom: none
            }

            .bottom_icon {
                width: 0.44rem;
                height: 0.44rem;
                margin-right: 0.14rem;
                position: relative;
                top: -0.04rem;
            }
        }

        .active_bottom {
            background-color: #F5F5F5;
        }
    }
}
</style>
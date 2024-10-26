<!-- 添加银行卡 -->
<template>
    <div class="page page_bank">
        <Top :title="'银行卡'" />

        <div class="subtitle">持卡人姓名</div>
        <div class="item">
            <span style="flex: 1;">{{ name || '--' }}</span>
            <div class="icon_ok">
                <img src="/static/img/user/ok.png" alt="ok">
            </div>
            <span>已认证</span>
        </div>
        <div class="subtitle">银行</div>
        <div class="item">
            <input v-model="form.bank_name" type="text" class="ipt" maxlength="50">
        </div>
        <div class="subtitle">卡号</div>
        <div class="item">
            <input v-model.trim="form.bank_card_number" type="text" class="ipt" maxlength="50">
        </div>

        <div style="flex: 1;"></div>
        <Button class="submit" :disabled="!(form.bank_name && form.bank_card_number)" :loading="loading" type="primary"
            round color="#014CFA" @click="next">保存</Button>

        <!-- 谷歌验证 -->
        <GoogleVerfCode ref="googleRef" @submit="submit" />
    </div>
</template>

<script setup>
import GoogleVerfCode from "@/components/GoogleVerfCode.vue"
import Top from '@/components/Top.vue';
import { Button, showToast } from "vant"
import { ref, computed } from "vue"
import { _kycGet, _addAccount } from "@/api/api"
import router from "@/router";
import store from "@/store";

const googleRef = ref()

const loading = ref(false)
const form = ref({
    channel: 'bank',
    // currency: null,
    // network: null,
    // address: null,
    account_name: '',
    bank_name: '',
    bank_card_number: '',
})

// 提交
const submit = (googleCode) => {
    if (loading.value) return
    loading.value = true
    _addAccount({
        ...form.value,
        googlecode: googleCode,
        token: sessionToken.value
    }).then(res => {
        if (res.code == 200) {
            showToast('添加成功')
            setTimeout(() => {
                router.back()
            }, 200)
        }
    }).finally(() => {
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
    store.dispatch('updateSessionToken').finally(() => {
        loading.value = false
    })
}
getSessionToken()

// 获取真实姓名
const name = ref('')
_kycGet().then(res => {
    name.value = res?.data?.name || ''
    form.value.account_name = res?.data?.name || ''
})
</script>

<style lang="less" scoped>
.page_bank {
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
            width: 100%;
            height: 100%;
            font-size: 0.24rem;
            text-align: left;
            outline: none;
            border: none;
            background-color: rgba(0, 0, 0, 0);
        }

        .icon_ok {
            width: 0.32rem;
            height: 0.32rem;
            margin: 0 0.12rem;
        }
    }

    .submit {
        height: 1.12rem;
        width: 100%;
    }
}
</style>
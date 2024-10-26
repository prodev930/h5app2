<!-- 谷歌验证器 -->
<template>
    <div class="page page_google">
        <Top :title="'谷歌验证器'">
            <template #right v-if="from == 'register'">
                <span @click="nextStep" style="color: #014CFA;font-weight: 400;font-size: 0.28rem;">跳过</span>
            </template>
        </Top>

        <div class="qrcode">
            <img :src="gg.qrcode" alt="qrcode" v-if="gg.qrcode">
        </div>


        <div class="code_box">
            <div class="code">{{ gg.googlesecret }}</div>
            <div class="refresh" @click="getGoogle">
                <img src="/static/img/common/refresh.png" alt="⚪">
            </div>
        </div>
        <div class="tip">(Please back up your key in case you lose it)</div>

        <div class=" copy" @click="copy" v-if="gg.googlesecret">复制</div>

        <div class="subtitle">
            <span>Google verification code</span>
            <span class=" clear" @click="clear">Clear</span>
        </div>

        <PasswordInput :focused="showKeyboard" @focus="focus" class="code_ipt" :class="{ 'error_ipt': errText }"
            :value="val" :length="6" :gutter="'0.16rem'" :mask="false" />
        <input style="opacity: 0;" ref="iptRef" v-model="val" maxlength="6" enterkeyhint="done" @keydown.enter="goBind">

        <div class="error_text" v-if="errText">{{ errText }}</div>

        <!-- <div class="cautions">
            <div style="margin-bottom: 0.24rem;">Cautions</div>
            <div style="margin-bottom: 0.24rem;">1.Download Google Authenticator App</div>
            <div>2. Scan the QR code above and enter the verification code to complete the binding</div>
        </div> -->

        <Button :loading="loading" :disabled="disabled" round color="#014CFA" class="submit" type="primary"
            @click="goBind">绑定</Button>


    </div>
</template>

<script setup>
import Top from '@/components/Top.vue';
import { PasswordInput, Button, showToast, showLoadingToast, closeToast } from "vant"
import { ref, computed, watch } from "vue"
import { _google, _googleBind } from "@/api/api"
import QRCode from "qrcode"
import { _copyTxt } from "@/utils/index"
import router from '@/router';
import store from '@/store';
import { useRoute } from "vue-router"

const route = useRoute()
const from = ref(route.query.from) // 'register'-表示从注册来


const loading = ref(false)
const disabled = computed(() => {
    return !(val.value && val.value.length == 6)
})
const showKeyboard = ref(false)
const val = ref('')
watch(val, v => {
    if (v && v.length == 6) {
        showKeyboard.value = false
    }
    if (!v || v.length == 0) {
        errText.value = ''
    }
})

// 获取谷歌状态
const gg = ref({})
const getGoogle = () => {
    if (loading.value) return
    loading.value = true
    showLoadingToast({
        duration: 0,
        loadingType: 'spinner',
    })
    _google().then(res => {
        if (res.code == 200) {
            gg.value = res.data
            QRCode.toDataURL(res.data.googlesecretqr)
                .then((url) => {
                    gg.value.qrcode = url
                })
        }
    }).finally(() => {
        loading.value = false
        closeToast()
    })
}
getGoogle()

// 绑定
const errText = ref('')
const goBind = () => {
    if (loading.value) return
    errText.value = ''
    loading.value = true
    _googleBind({
        googlesecret: gg.value.googlesecret,
        googlecode: val.value
    }).then(res => {
        if (res.code == 200) {
            store.dispatch('updateUserInfo')
            setTimeout(() => {
                showToast('绑定成功')
            }, 300)
            if (from.value == 'register') {
                nextStep()
            } else {
                router.replace({
                    name: 'googleCode'
                })
            }
        }
    }).catch(err => {
        errText.value = err.message
    }).finally(() => {
        loading.value = false
    })
}

const iptRef = ref()
const focus = () => { // 聚焦
    showKeyboard.value = true
    setTimeout(() => {
        iptRef.value && iptRef.value.focus()
    }, 300)
    // setTimeout(() => {
    //     try {
    //         document.querySelector('.page').scrollTo({ top: 99999, behavior: 'smooth' });
    //     } catch {
    //     }
    // }, 100)
}
const blur = () => { // 失去焦点
    showKeyboard.value = false
}
const clear = () => {
    val.value = ''
    errText.value = ''
    showKeyboard.value = false
}
const copy = () => {
    _copyTxt(gg.value.googlesecret)
    showToast('复制成功')
}

const nextStep = () => {
    router.replace({
        name: 'kyc',
        query: route.query
    })
}
</script>

<style lang="less" scoped>
.page_google {
    padding: 1.52rem 0.32rem 0.4rem 0.32rem;
    height: 100%;
    overflow-y: auto;


    .qrcode {
        width: 3.3rem;
        height: 3.3rem;
        margin: 0 auto 0.4rem auto;
        border: 1px solid #ddd;
    }

    .code_box {
        font-size: 0.28rem;
        line-height: 0.33rem;
        color: #000000;
        display: flex;
        align-items: center;
        justify-content: center;
        margin-bottom: 0.2rem;

        .refresh {
            width: 0.24rem;
            height: 0.24rem;
            margin-left: 0.12rem;
            line-height: 1;
        }
    }

    .tip {
        font-size: 0.24rem;
        line-height: 0.28rem;
        color: #999999;
        font-weight: 400;
        margin-bottom: 0.3rem;
        text-align: center
    }

    .copy {
        border: 1px solid #DDDDDD;
        width: 2.4rem;
        height: 0.72rem;
        display: flex;
        align-items: center;
        justify-content: center;
        color: #333333;
        font-weight: 400;
        font-size: 0.24rem;
        border-radius: 0.08rem;
        overflow: hidden;
        margin: 0 auto 0.4rem auto;
    }

    .subtitle {
        display: flex;
        align-items: center;
        justify-content: space-between;
        font-weight: 400;
        font-size: 0.24rem;
        color: #000000;
        margin-bottom: 0.24rem;

        .clear {
            color: #1552F0;
            overflow: hidden;
        }
    }


    .submit {
        width: 100%;
        height: 1.12rem;
        border-radius: 1.2rem;
        font-size: 0.28rem;
        margin-top: 0.4rem;
    }

    .code_ipt {
        padding: 0;
        margin: 0;

        :deep(.van-password-input__item) {
            border: 1px solid #ECEFF3;
            width: 1rem;
            height: 1rem;
            box-sizing: border-box;
            border-radius: 0.16rem;

            &:has(*) {
                border: 1px solid #014CFA;
            }
        }
    }

    .error_ipt {
        :deep(.van-password-input__item) {
            border: 1px solid #E8503A;

        }
    }

    .error_text {
        color: #E8503A;
        margin-top: 0.12rem;
        font-weight: 400;
        font-size: 0.28rem;
        line-height: 0.42rem;
    }

    .cautions {
        padding: 0.4rem 0.3rem;
        background-color: #F6F6F6;
        border-radius: 0.08rem;
        margin-top: 0.4rem;
        font-weight: 400;
        font-size: 0.28rem;
        line-height: 0.35rem;
        color: #000000;
    }
}
</style>
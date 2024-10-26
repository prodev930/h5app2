<!-- 用户认证 -->
<template>
    <div class="page page_kyc" style="height:100%">
        <Loaidng :pageLoading="pageLoading" v-if="pageLoading" />
        <KycStatus @next="nextStep" :kycInfo="kycInfo" v-if="step == 0" />
        <Kyc1 @next="nextStep" :kycInfo="kycInfo" v-if="step == 1" />
        <Kyc2 @pre="preStep" @info="step = 3" :kycInfo="kycInfo" v-if="step == 2" />
        <KycTip @back="step = 2" v-if="step == 3" />
    </div>
</template>

<script setup>
import { defineAsyncComponent, computed, onBeforeUnmount, ref } from "vue"
import store from "@/store";
import { _kycGet } from "@/api/api"
import Loaidng from "@/components/Loaidng.vue";
import { showLoadingToast, closeToast } from 'vant';

const userInfo = computed(() => store.state.userInfo || {})
const step = ref(-1) // 0-审核中或审核成功
const nextStep = () => {
    step.value++
}
const preStep = () => {
    step.value--
}


const pageLoading = ref(true)
const kycInfo = ref({})
const getKyc = () => {
    pageLoading.value = true
    showLoadingToast({
        duration: 0,
        loadingType: 'spinner',
    })
    _kycGet().then(res => {
        if (res.code == 200) {
            pageLoading.value = false
            kycInfo.value = res.data
            if (kycInfo.value.status == 'none') {
                step.value = 1
            } else {
                step.value = 0
            }
        }
    }).finally(() => {
        closeToast()
    })
}
getKyc()

const Kyc1 = defineAsyncComponent(() =>
    import("./Kyc1.vue")
);
const Kyc2 = defineAsyncComponent(() =>
    import("./Kyc2.vue")
);
const KycStatus = defineAsyncComponent(() =>
    import("./KycStatus.vue")
);
const KycTip = defineAsyncComponent(() =>
    import("./KycTip.vue")
);

onBeforeUnmount(() => {
    store.dispatch('updateUserInfo')
})
</script>

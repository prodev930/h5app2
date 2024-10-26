<!-- 验证码弹窗 -->
<template>
    <Dialog v-model:show="show" title="" showCancelButton showConfirmButton :width="'6.22rem'" :confirmButtonText="'确定'"
        :confirmButtonColor="'#014CFA'" :cancelButtonText="'取消'" :cancelButtonColor="'#323233'" overlay @cancel="close"
        @confirm="confirm" :before-close="() => false">
        <div class="verif_box">
            <div class="title">请填写图形验证码</div>
            <!-- 验证码 -->
            <div @click="getCode" class="" style="overflow: hidden;">
                <div class="code">
                    <img v-if="codeImg && !loading" :src="codeImg" alt="code">
                    <Loading v-else type="spinner" />
                </div>
                <div class="tip">看不清？换一张</div>
            </div>
            <!-- 输入 -->
            <div class="ipt_box">
                <input ref="iptRef" type="text" @input="() => code = code.toString().slice(0, 4)" v-model.trim="code"
                    placeholder="输入验证码">
            </div>
        </div>
    </Dialog>
</template>

<script setup>
import { Dialog, showToast, Loading } from "vant"
import { ref } from "vue"
import { _verifcode } from "@/api/api"

const emits = defineEmits(['submit'])

const iptRef = ref()
const code = ref('')
const codeImg = ref('') // 验证码图片

const show = ref(false)
const open = () => {
    code.value = ''
    getCode()
    show.value = true
    setTimeout(() => {
        iptRef.value && iptRef.value.focus()
    }, 300)
}
const close = () => {
    code.value = ''
    show.value = false
}

const confirm = () => {
    const v = code.value.toString()
    if (!v || v.length != 4) return
    emits('submit', v)
    close()
}

const loading = ref(false)
const getCode = () => { // 获取验证码
    if (loading.value) return
    loading.value = true
    _verifcode().then(response => {
        const url = URL.createObjectURL(response.data);
        codeImg.value = url
    }).catch(() => {
        showToast('获取验证码异常，请手动刷新')
    }).finally(() => {
        setTimeout(() => {
            loading.value = false
        }, 500)
    })
}

defineExpose({
    open
})
</script>

<style lang="less" scoped>
.verif_box {
    padding: 0.4rem 0.48rem 0.16rem 0.48rem;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;

    .title {
        color: #121826;
        font-size: 0.32rem;
        line-height: 0.44rem;
        margin-bottom: 0.28rem;
    }

    .code {
        height: 1rem;
        width: auto;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .tip {
        line-height: 0.44rem;
        color: #014CFA;
        text-align: center;
        font-weight: 400;
        margin-bottom: 0.08rem
    }

    .ipt_box {
        height: 0.92rem;
        border-radius: 0.32rem;
        border: 1px solid #70747D;
        width: 100%;
        display: flex;
        align-items: stretch;

        input {
            text-align: center;
            width: 100%;
        }
    }
}
</style>
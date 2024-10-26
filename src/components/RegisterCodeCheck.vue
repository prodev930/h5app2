<!-- 验证码校验 -->
<template>
    <!-- <ElDialog v-model="show" align-center title="" width="500px" :close-on-click-modal="false"> -->
    <div class="code_check_box">
        <div class="jump" @click="close">跳过验证</div>
        <div class="title">{{ titleMap[props.type] }}验证</div>
        <div class="info">我们已将验证码发送至 <span>{{ props.value }}</span> <br />请输入以下 6 位数代码：</div>
        <div class="ipt_box">
            <PasswordInput :focused="showKeyboard" @focus="focus" class="code_ipt" :value="val" :length="6"
                :gutter="'0.16rem'" :mask="false" />
            <input style="opacity: 0;" ref="iptRef" v-model="val" maxlength="6" enterkeyhint="done"
                @keydown.enter="submit">
        </div>
        <div class="send" @click="send">{{ s ? (s + 's') : '再次发送' }}</div>
    </div>
    <!-- </ElDialog> -->
</template>

<script setup>
import { PasswordInput, showConfirmDialog, showToast, showLoadingToast, closeToast } from 'vant'
import { ref, computed, watch } from "vue"

const props = defineProps({
    type: {
        type: String,
        default: 'phone'
    },
    value: {
        type: String,
        default: ''
    }
})
const titleMap = ref({
    email: '电子邮件',
    phone: '手机'
})

const emit = defineEmits(['success'])

const val = ref('')

const showKeyboard = ref(true)
watch(val, v => {
    if (v && v.length == 6) {
        showKeyboard.value = false
        finishIpt()
    }
})
const finishIpt = () => {
    showLoadingToast({
        duration: 0,
        loadingType: 'spinner',
    })
    setTimeout(() => {
        closeToast()
        val.value = ''
        showToast('验证码错误')
    }, 1000)
}



const open = () => {
    s.value = 0
    timeInterval && clearInterval(timeInterval)
}

const iptRef = ref()
const focus = () => {
    showKeyboard.value = true
    setTimeout(() => {
        iptRef.value && iptRef.value.focus()
    }, 300)
}

const close = () => {
    showConfirmDialog({
        title: '',
        message: '跳过验证将继续注册，是否继续？'
    })
        .then(() => {
            emit('success')
            s.value = 0
            timeInterval && clearInterval(timeInterval)
        })
        .catch(() => { })

}

let timeInterval = null
const s = ref(0)
const send = () => {
    if (s.value) return
    s.value = 59
    timeInterval = setInterval(() => {
        s.value--
        if (s.value == 0) {
            clearInterval(timeInterval)
        }
    }, 1000)
}

open()
</script>

<style lang="less" scoped>
.code_check_box {
    position: relative;

    .jump {
        position: absolute;
        color: #1A59F6;
        font-weight: 600;
        right: 0.32rem;
        top: 0;
        cursor: pointer;
    }

    .title {
        text-align: center;
        font-weight: 600;
        color: #000;
        font-size: 0.48rem;
        width: 100%;
        padding: 2rem 0 0.4rem 0;
    }

    .info {
        text-align: center;
        margin-bottom: 0.4rem;
        line-height: 0.5rem;

        span {
            font-weight: bold;
        }
    }

    .ipt_box {
        :deep(.van-password-input__item) {
            border: 1px solid #ECEFF3;
            background-color: #fff;
            width: 1rem;
            height: 1rem;
            box-sizing: border-box;
            border-radius: 0.16rem;

            &:has(.van-password-input__cursor) {
                border: 1px solid #014CFA;
            }
        }
    }

    .send {
        color: #1A59F6;
        text-align: center;
        padding: .4rem 0;
        cursor: pointer;
    }
}
</style>
<!-- 修改交易密码 -->
<template>
    <div class="page page-loginpass">
        <Top :title="'修改交易密码'" />

        <!-- 表单 -->
        <div class="form">

            <div class="form_title">新密码</div>
            <div class="form_item margin_item">
                <input maxlength="20" v-show="!showPass" v-model.trim="form.password" placeholder="请输入您的新密码"
                    type="password" class="item_input">
                <input maxlength="20" v-show="showPass" v-model.trim="form.password" placeholder="请输入您的新密码" type="text"
                    class="item_input">
                <div class=" form_item_icon" @click="showPass = !showPass">
                    <img v-show="!showPass" src="/static/img/user/eye-off.png" alt="off">
                    <img v-show="showPass" src="/static/img/user/eye-open.png" alt="open">
                </div>
            </div>
            <!-- 密码等级 -->
            <PasswordLevel style="position: relative;top:-0.32rem;left:0.32rem" :password="form.password" />


            <div class="form_title">确认密码</div>
            <div class="form_item margin_item">
                <input maxlength="20" v-show="!showPass2" v-model.trim="form.password2" placeholder="请再次输入您的新密码"
                    type="password" class="item_input">
                <input maxlength="20" v-show="showPass2" v-model.trim="form.password2" placeholder="请再次输入您的新密码"
                    type="text" class="item_input">
                <div class=" form_item_icon" @click="showPass2 = !showPass2">
                    <img v-show="!showPass2" src="/static/img/user/eye-off.png" alt="off">
                    <img v-show="showPass2" src="/static/img/user/eye-open.png" alt="open">
                </div>
            </div>
            <div class="tip">两次密码必须一致</div>

        </div>


        <!-- 按钮 -->
        <div class="submit_box">
            <Button :loading="loading" :disabled="disabled" round color="#014CFA" class="submit" type="primary"
                @click="submit">修改</Button>
        </div>


        <!-- 谷歌 -->
        <GoogleVerfCode @submit="submitForm" ref="ggRef" />
    </div>


</template>

<script setup>
import Top from "@/components/Top.vue"
import { _safeword } from "@/api/api"
import GoogleVerfCode from "@/components/GoogleVerfCode.vue"
import { Button } from "vant"
import { ref, computed } from "vue"
import router from "@/router"
import { _login } from "@/api/api"
import PasswordLevel from "@/components/PasswordLevel.vue"

const ggRef = ref()

const showPass = ref(false) // 密码显示
const showPass2 = ref(false)
const form = ref({ // 表单
    password: '',
    password2: '',
})

const loading = ref(false) // 加载
const disabled = computed(() => { // 提交按钮禁用
    return !(form.value.password && form.value.password == form.value.password2)
})

const submit = () => {
    ggRef.value.open()
}
const submitForm = code => {
    const params = {
        safeword: form.value.password,
        googlecode: code
    }
    if (loading.value) return
    loading.value = true
    _safeword(params).then(res => {
        if (res.code == 200) {
            router.replace({
                name: 'success'
            })
        }
    }).finally(() => {
        loading.value = false
    })
}

</script>

<style lang="less" scoped>
.page-loginpass {
    padding-top: 1.12rem;

    .form {
        padding: 0.6rem 0.32rem;

        .form_title {
            color: #000;
            line-height: 0.42rem;
            font-weight: 400;
            margin-bottom: 0.12rem;
        }

        .form_item {
            display: flex;
            align-items: center;
            border: 1px solid #D0D8E2;
            height: 1.12rem;
            border-radius: 0.32rem;
            padding: 0 0.32rem;

            .item_input {
                flex: 1;
                color: #333333;
                font-weight: 400;
                font-size: 0.28rem;
            }

            &:has(.item_input:focus) {
                border: 1px solid #014CFA;
            }

            .form_item_user {
                width: 0.64rem;
                height: 0.64rem;
                margin-right: 0.32rem;
            }

            .form_item_icon {
                width: 0.4rem;
                height: 0.4rem;
                margin-left: 0.2rem;
            }
        }

        .tip {
            font-size: 0.24rem;
            font-weight: 400;
            color: #A4ACB9;
            line-height: 0.36rem;
            position: relative;
            top: -0.24rem;
        }

        .margin_item {
            margin-bottom: 0.4rem;
        }
    }



    .submit_box {
        padding: 0 0.32rem;

        .submit {
            width: 100%;
            height: 1.12rem;
        }
    }

}
</style>
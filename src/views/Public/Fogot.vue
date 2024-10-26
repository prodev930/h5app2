<!-- 忘记密码 -->
<template>
    <div class="page page-fogot">
        <!-- 返回和语言 -->
        <div class="max-width top">
            <div class="top_back" @click="router.back()">
                <Icon name="arrow-left" />
            </div>

            <div class="top_earphone_lang">
                <div class="top_earphone" @click="">
                    <img class="phoneImage" src="/static/img/common/Vector.png" alt="earphone" />
                </div>
                <div class="top_lang" @click="router.push({ name: 'language' })">
                    <img src="/static/img/common/language.png" alt="language" />
                </div>
            </div>
        </div>

        <!-- 标题 -->
        <div class="title_box">
            <div class="title">忘记密码</div>
            <div class="tologin" @click="router.push({ name: 'login' })">去登录</div>
        </div>

        <!-- 表单 -->
        <div class="form">
            <div class="form_title">邮箱/手机号</div>
            <div class="form_item margin_item">
                <input maxlength="20" v-model.trim="form.username" placeholder="您的用户名" type="text" class="item_input" />
                <div class="form_item_clear" v-show="form.username" @click="form.username = null">
                    <Icon name="cross" />
                </div>
            </div>

            <div class="form_title">新密码</div>
            <div class="form_item">
                <input maxlength="20" v-model.trim="form.password" :type="showPass ? 'text' : 'password'"
                    placeholder="密码最小8个字符" class="item_input" @input="checkPasswordStrength" />
                <div class="form_item_icon" @click="toggleShowPass">
                    <img v-if="!showPass" src="/static/img/user/eye-off.png" alt="Hide password" />
                    <img v-else src="/static/img/user/eye-open.png" alt="Show password" />
                </div>
            </div>

            <PasswordLevel class="form_passCheck" :password="form.password" />

            <div class="form_title">确认新密码</div>
            <div class="form_item">
                <input maxlength="20" v-model.trim="form.confirmPassword" :type="showConfirmPass ? 'text' : 'password'"
                    placeholder="请再次输入新密码" class="item_input" />
                <div class="form_item_icon" @click="toggleShowConfirmPass">
                    <img v-if="!showConfirmPass" src="/static/img/user/eye-off.png" alt="Hide password" />
                    <img v-else src="/static/img/user/eye-open.png" alt="Show password" />
                </div>
            </div>
        </div>

        <!-- 按钮 -->
        <div class="submit_box" @click="submit">
            <Button :loading="loading" :disabled="disabled" round color="#014CFA" class="submit"
                type="primary">找回</Button>
        </div>

        <!-- 谷歌 -->
        <GoogleVerfCode @submit="submitForm" ref="ggRef" />
    </div>
</template>

<script setup>
import { Icon, Button, showToast } from "vant";
import { ref, computed } from "vue";
import router from "@/router";
import { _forgetpw } from "@/api/api";
import GoogleVerfCode from "@/components/GoogleVerfCode.vue";
import store from "@/store";
import PasswordLevel from "@/components/PasswordLevel.vue"

// Refs and Variables
const ggRef = ref();
const showPass = ref(false);
const showConfirmPass = ref(false);
const svgColor = ref("#D9D9D9");
const loading = ref(false);

// Form data
const form = ref({
    username: "",
    password: "",
    confirmPassword: ""
});

// Disable button conditionally
const disabled = computed(() => {
    return !(
        form.value.username &&
        form.value.password &&
        form.value.password === form.value.confirmPassword
    );
});

// Toggle password visibility
const toggleShowPass = () => {
    showPass.value = !showPass.value;
};

const toggleShowConfirmPass = () => {
    showConfirmPass.value = !showConfirmPass.value;
};

// Submit form to trigger Google Verification
const submit = () => {
    ggRef.value.open();
};

// Check password strength logic
const checkPasswordStrength = () => {
    const password = form.value.password;
    if (password.length >= 8 && /[A-Z]/.test(password) && /[0-9]/.test(password)) {
        svgColor.value = "green";
    } else if (password.length >= 6) {
        svgColor.value = "orange";
    } else {
        svgColor.value = "#D9D9D9";
    }
};

// Handle form submission
const submitForm = (code) => {
    if (loading.value) return;
    loading.value = true;

    _forgetpw({
        ...form.value,
        googlecode: code
    })
        .then((res) => {
            showToast("密码找回成功");
            setTimeout(() => {
                router.replace({ name: "user" });
                store.commit("setIsLoginOpen", true);
            }, 300);
        })
        .finally(() => {
            loading.value = false;
        });
};
</script>

<style lang="less" scoped>
.page-fogot {
    padding-top: 1.12rem;

    .top {
        position: fixed;
        width: 100%;
        height: 1.12rem;
        display: flex;
        padding: 0 0.4rem 0 0.12rem;
        align-items: center;
        justify-content: space-between;
        left: 50%;
        transform: translateX(-50%);
        top: 0;
        background-color: #fff;

        .top_back {
            color: #161616;
            font-size: 0.40rem;
            width: 0.8rem;
            height: 0.8rem;
            display: flex;
            align-items: center;
            justify-content: center;
        }

        .top_earphone_lang {
            display: flex;
        }

        .top_earphone {
            width: 0.8rem;
            height: 0.8rem;
            padding: 0.13rem;
        }

        .top_lang {
            color: #161616;
            font-size: 0.4rem;
            width: 0.8rem;
            height: 0.8rem;
            display: flex;
            align-items: center;
            justify-content: center;
        }
    }

    .title_box {
        padding: 0.3rem 0.32rem 1.07rem 0.32rem;
        display: flex;
        align-items: center;
        justify-content: space-between;

        .title {
            // height: 0.78rem;
            // display: flex;
            // align-items: center;
            // font-weight: 600;
            // font-size: 0.56rem;
            // color: #0D0D12;

            color: #061023;
            font-family: "PingFang SC";
            font-size: 28px;
            font-style: normal;
            font-weight: 600;
            line-height: 140%;
            /* 39.2px */
        }

        .tologin {
            color: #014CFA;
            text-align: right;
            font-family: "PingFang SC";
            font-size: 12px;
            font-style: normal;
            font-weight: 600;
            line-height: 16px;
            /* 133.333% */
        }
    }

    .form {
        padding: 0 0.32rem;

        .form_title {
            color: #000;
            line-height: 0.42rem;
            font-weight: 400;
            margin-bottom: 0.12rem;
        }

        .form_passCheck {
            width: 116px;
            height: 3px;
            margin: 7px;
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

            .form_item_clear {
                justify-content: center;
                color: #161616;
                margin-left: 0.12rem;
                display: flex;
                justify-content: center;
                align-items: center;
                width: 16px;
                height: 16px;
                background-color: #CDD4E3;
                padding: '1px';
                border-radius: 50%;

                .van-icon {
                    font-size: 12px;
                }
            }
        }

        .margin_item {
            margin-bottom: 0.4rem;
        }
    }

    .submit_box {
        padding: 0 0.32rem;
        margin-top: 0.86rem;

        .submit {
            width: 100%;
            height: 1.12rem;
        }
    }

    .go_register {
        margin: 2.8rem 0 1.4rem 0;
        text-align: center;
        font-weight: 400;

        >span {
            color: #1A59F6;
            font-weight: 600;
        }
    }
}
</style>
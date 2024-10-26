<!-- 安全 -->
<template>
    <div class="page page-safety">
        <Top :title="'安全'" />

        <div class="navs">
            <div class=" nav" @click="checkGG('password')">
                <div class="nav_icon">
                    <img src="/static/img/user/lock_icon.png" alt="🔒">
                </div>
                <div class="nav_title">登录密码</div>
                <Icon name="arrow" />
            </div>
            <div class=" nav" @click="checkGG('fund')">
                <div class="nav_icon">
                    <img src="/static/img/user/safe_icon.png" alt="🔒">
                </div>
                <div class="nav_title">交易密码</div>
                <Icon name="arrow" />
            </div>
            <div class=" nav" @click="goGG">
                <div class="nav_icon">
                    <img src="/static/img/user/google_icon.png" alt="🔒">
                </div>
                <div class="nav_title">谷歌验证器</div>
                <div class="nav_tip">
                    <span style="color: #FF3B30;" v-if="!userInfo.googlebind">未绑定</span>
                    <span style="color: #18B762;" v-if="userInfo.googlebind">已绑定</span>
                </div>
                <Icon name="arrow" />
            </div>
        </div>
    </div>
</template>

<script setup>
import Top from "@/components/Top.vue"
import { Icon, showConfirmDialog } from "vant"
import store from "@/store";
import { computed } from "vue"
import router from "@/router"

const userInfo = computed(() => store.state.userInfo || {})

const jump = name => {
    router.push({
        name
    })
}

const goGG = () => {
    if (userInfo.value.googlebind) { // 已绑定
        jump('googleCode')
    } else {
        jump('google')
    }
}

const checkGG = (name) => {
    if (!userInfo.value.googlebind) {
        return showConfirmDialog({
            title: '谷歌验证器',
            message:
                '你还未绑定谷歌验证器，是否去绑定?',
        }).then(() => {
            jump('google')
        })
    }
    jump(name)
}


// 预加载页面
store.commit('setPageLoading', true)
const loadingList = [
    import('@/views/User/LoginPassword.vue'),
    import('@/views/User/Google/Google.vue'),
]
Promise.all(loadingList).finally(() => {
    store.commit('setPageLoading', false)
})

</script>

<style lang="less" scoped>
.page-safety {
    padding-top: 1.2rem;

    .navs {
        padding: 0 0.48rem 0 0.32rem;

        .nav {
            display: flex;
            align-items: center;
            height: 1.12rem;
            border-bottom: 1px solid #F4F4F4;
            color: #A2A2A7;
            font-size: 0.28rem;
            overflow: hidden;

            .nav_icon {
                width: 0.48rem;
                height: 0.48rem;
            }

            .nav_title {
                margin: 0 0.3rem;
                color: #1E1E2D;
                font-weight: 400;
                flex: 1;
            }

            .nav_tip {
                margin-right: 0.28rem;
                font-size: 0.24rem;
                font-weight: 500;
            }
        }
    }
}
</style>
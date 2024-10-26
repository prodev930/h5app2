<!-- 登录弹窗 -->
<template>
    <div class="login_dialog" :class="{ 'login_dialog_open': isLoginOpen }">
        <Login :backFunc="closeDialog" :successFunc="successFunc" v-if="isLoginOpen" @closeDialog="closeDialog" />
    </div>
</template>

<script setup>
import { ref, computed } from "vue"
import store from "@/store"
import Login from "./Login.vue";
import eventBus from "@/utils/eventBus";
import router from "@/router"

const isLoginOpen = computed(() => store.state.isLoginOpen)


// setTimeout(() => {
//     store.commit('setIsLoginOpen', true)
// }, 2000)

const closeDialog = () => {
    store.commit('setIsLoginOpen', false)
    setTimeout(() => {
        eventBus.emit('loginFail')
    }, 500)
}
const successFunc = () => {
    // router.push({
    //     name: 'user'
    // })
    eventBus.emit('loginSuccess')
}
</script>

<style lang="less" scoped>
.login_dialog {
    position: fixed;
    top: 0;
    left: 0;
    z-index: 99999;
    background-color: #fff;
    width: 100%;
    height: 100%;
    transform: translateY(-100%);
    overflow: hidden;
    transition: all ease .2s;
}

.login_dialog_open {
    transform: translateY(0);
}
</style>
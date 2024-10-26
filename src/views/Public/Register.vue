<!-- 注册页 -->
<template>
  <div class="page page-register">

    <!-- 图片验证 -->
    <template v-if="step == 1">
      <ImgCheck @success="step = 2" @goBack="goBack" />
    </template>

    <template v-else-if="step == 2">

      <!-- 返回和语言 -->
      <div class="max-width top">
        <div class="top_back" @click="goBack">
          <Icon name="arrow-left" />
        </div>

        <div class=" top_lang" @click="router.push({ name: 'language' })">
          <img src="/static/img/common/language.png" alt="language">
        </div>
      </div>

      <!-- 标题 -->
      <div class="title_box">
        <div class="title">{{ guest ? '创建模拟账户' : '创建您的账户' }}</div>
        <div class="login_title">有账号？
          <span class="tologin" @click="router.push({ name: 'login' })">去登录</span>
        </div>
      </div>

      <!-- tab -->
      <Tabs type="card" class="tabs" v-model:active="activeTab" animated shrink>
        <Tab :title="'邮箱'"> </Tab>
        <Tab :title="'手机'"></Tab>
      </Tabs>

      <!-- 表单 -->
      <div class="form">
        <!-- <div class="form_title">用户名</div>
        <div class="form_item margin_item" :class="{ 'err_ipt': errorTip.error1 }">
          <input maxlength="20" @blur="errorTip.error1 = false" v-model.trim="form.username" placeholder="您的用户名"
            type="text" class="item_input">
        </div> -->
        <div class="form_title" v-show="activeTab == 0">邮箱</div>
        <div class="form_item margin_item" v-show="activeTab == 0" :class="{ 'err_ipt': errorTip.error1 }">
          <input maxlength="20" @blur="errorTip.error1 = false" v-model.trim="form.email" placeholder="您的邮箱" type="text"
            class="item_input">
          <div class="form_item_clear" v-show="form.email" @click="form.email = null">
            <Icon class="" name="cross" />
          </div>
        </div>
        <div class="form_title" v-show="activeTab == 1">手机号</div>
        <div class="form_item margin_item" v-show="activeTab == 1" :class="{ 'err_ipt': errorTip.error1 }">
          <div class="code" @click="showDialog = true">
            <span class="flag_icon">
              <img src="/static/img/common/flag_hongkong.svg" alt="">
            </span>
            <span>{{ form.area }}</span>
            <div class="more_icon">
              <img src="/static/img/assets/more.png" alt="img">
            </div>
          </div>
          <input maxlength="20" @blur="errorTip.error1 = false" v-model.trim="form.phone" placeholder="您的手机号"
            type="text" class="item_input">
        </div>
        <div class="form_title">密码</div>
        <div class="form_item margin_item" :class="{ 'err_ipt': errorTip.error2 }">
          <input maxlength="20" @blur="errorTip.error2 = false" v-show="!showPass" v-model.trim="form.password"
            placeholder="密码最小8个字符" type="password" class="item_input">
          <input maxlength="20" @blur="errorTip.error2 = false" v-show="showPass" v-model.trim="form.password"
            placeholder="密码最小8个字符" type="text" class="item_input">
          <div class=" form_item_icon" @click="showPass = !showPass">
            <img v-show="!showPass" src="/static/img/user/eye-off.png" alt="off">
            <img v-show="showPass" src="/static/img/user/eye-open.png" alt="open">
          </div>
        </div>
        <!-- 密码等级 -->
        <PasswordLevel style="position: relative;top:-0.32rem;left:0.32rem" :password="form.password" />
        <div class="form_title">交易密码</div>
        <div class="form_item margin_item" :class="{ 'err_ipt': errorTip.error3 }">
          <input maxlength="20" @blur="errorTip.error3 = false" v-show="!showPass2" v-model.trim="form.safeword"
            placeholder="请输入交易密码" type="password" class="item_input">
          <input maxlength="20" @blur="errorTip.error3 = false" v-show="showPass2" v-model.trim="form.safeword"
            placeholder="请输入交易密码" type="text" class="item_input">
          <div class=" form_item_icon" @click="showPass2 = !showPass2">
            <img v-show="!showPass2" src="/static/img/user/eye-off.png" alt="off">
            <img v-show="showPass2" src="/static/img/user/eye-open.png" alt="open">
          </div>
        </div>
        <!-- <div class="form_title">确认交易密码</div>
      <div class="form_item margin_item" :class="{ 'err_ipt': errorTip.error3 }">
        <input maxlength="20" @blur="errorTip.error3 = false" v-show="!showPass3" v-model.trim="form.safeword2"
          placeholder="请确认交易密码" type="password" class="item_input">
        <input maxlength="20" @blur="errorTip.error3 = false" v-show="showPass3" v-model.trim="form.safeword2"
          placeholder="请确认交易密码" type="text" class="item_input">
        <div class=" form_item_icon" @click="showPass3 = !showPass3">
          <img v-show="!showPass3" src="/static/img/user/eye-off.png" alt="off">
          <img v-show="showPass3" src="/static/img/user/eye-open.png" alt="open">
        </div>
      </div> -->



        <div class="form_title">邀请码</div>
        <div class="form_item margin_item">
          <input maxlength="20" v-model.trim="form.invateCode" placeholder="请输入您的邀请码" type="text" class="item_input">
        </div>
      </div>

      <!-- 协议 -->
      <label class=" register_doc" @click="checked = !checked">
        <Checkbox :icon-size="'0.36rem'" @click.stop="() => { }" class="register_doc_check" checked-color="#014CFA"
          shape="square" v-model="checked"></Checkbox>
        我同意<span>隐私政策</span>和<span>用户条款</span>
      </label>

      <!-- 按钮 -->
      <div class="submit_box">
        <Button @click="submit" :loading="loading" round color="#014CFA" class="submit" type="primary">继续</Button>
      </div>

      <!-- 去注册 -->
      <div class="go_register">
        <div class="server_icon" @click="goChat">
          <img src="/static/img/common/server.png" alt="server">
        </div>
        <span @click="goLogin">
          有账号吗？
          <span>去登录</span>
        </span>

      </div>
    </template>

    <template v-else>
      <RegisterCodeCheck :type="activeTab == 0 ? 'email' : 'phone'" :value="activeTab == 0 ? form.email : form.phone"
        @success="registerSuccessNext" />
    </template>

    <!-- 验证码 -->
    <VerifCode :type="activeTab == 0 ? 'email' : 'phone'" :value="form.username" @submit="submitCode" to="body"
      ref="verifCodeRef" />


    <!-- 区号弹窗 -->
    <Popup :safe-area-inset-top="true" :safe-area-inset-bottom="true" class="self_van_popup" v-model:show="showDialog"
      position="bottom" teleport="body">
      <div class="register_accounr_dialog">
        <div class="close_icon" @click="showDialog = false">
          <img src="/static/img/common/close.png" alt="x">
        </div>
        <div class="item search_box">
          <Icon class="search" name="search" size="24px" />
          <input v-model.trim="searchStr" class="ipt" type="text" placeholder="搜索">
        </div>
        <div style="height:60vh;overflow-y: auto;">
          <div @click="clickItem(item)" class="transfer_dialog_item"
            :class="{ 'transfer_dialog_item_active': form.area == item.code }" v-for="(item, i) in showAreas" :key="i">
            <span class="flag_icon">
              <img src="/static/img/common/flag_hongkong.svg" alt="HongKong">
            </span>
            <span>{{ item.cn }}</span>
            <span>({{ item.code }})</span>
            <Icon v-if="form.area == item.code" class="check_icon" name="success" />
          </div>
          <NoData v-if="!showAreas.length" />
        </div>
      </div>
    </Popup>

  </div>


</template>

<script setup>
import { Icon, Button, showToast, Checkbox, showLoadingToast, closeToast, Tab, Tabs, Popup } from "vant"
import { ref, computed } from "vue"
import router from "@/router"
import { useRoute, useRouter } from "vue-router"
import PasswordLevel from "@/components/PasswordLevel.vue"
import store from "@/store"
import { _register } from "@/api/api"
import VerifCode from "@/components/VerifCode.vue"
import ImgCheck from "@/components/ImgCheck.vue"
import { areaCode, validateEmail } from '@/utils/index'
import NoData from "@/components/NoData.vue"
import RegisterCodeCheck from "@/components/RegisterCodeCheck.vue"


// 区号控制
// const step = ref(1)
const activeTab = ref(0)
const defaultCode = '+244'
const showDialog = ref(false)
const searchStr = ref('')
const showAreas = computed(() => {
  return areaCode.filter(item => {
    return item.cn.includes(searchStr.value) || item.en.includes(searchStr.value) || item.code.includes(searchStr.value)
  })
})
const clickItem = item => {
  form.value.area = item.code
  showDialog.value = false
}


// 进入页面则重置登录状态信息
store.commit("setToken", "");
store.commit("setUserInfo", {});

const route = useRoute()
const routerApi = useRouter();
const forwardUrl = routerApi.options.history.state.forward
const step = ref(forwardUrl === '/language' || forwardUrl === '/chat' ? 2 : 1)

const guest = ref(route.query.guest)
const showPass = ref(false) // 密码显示
const showPass2 = ref(false) // 密码显示
const showPass3 = ref(false) // 密码显示
const checked = ref(true) // 同意协议
const form = ref({ // 表单
  area: defaultCode,
  email: '',
  phone: '',
  username: '',
  password: '',
  guest: guest.value ? 'true' : 'false',
  invateCode: '',
  safeword: '',
  // safeword2: ''
})
const verifcode = ref('')
const verifCodeRef = ref()

// 提交
const errorTip = ref({
  error1: false,
  error2: false,
  error3: false
})
const loading = ref(false)
const submit = async () => {
  if (!checked.value) return showToast('请先同意隐私政策和用户条款')
  // if (!form.value.username) {
  //   errorTip.value.error1 = true
  //   return showToast('请输入用户名')
  // }
  if (activeTab.value == 0) {
    if (!form.value.email || !validateEmail(form.value.email)) {
      errorTip.value.error1 = true
      showToast('请输入有效邮箱')
      return
    }
    form.value.username = form.value.email
  }
  if (activeTab.value == 1) {
    if (!form.value.phone) {
      errorTip.value.error1 = true
      showToast('请输入手机号码')
      return
    }
    form.value.username = form.value.area + form.value.phone
  }
  if (!form.value.password) {
    errorTip.value.error2 = true
    return showToast('请输入密码')
  }
  if (form.value.password.length < 8) {
    errorTip.value.error2 = true
    return showToast('密码最小8个字符')
  }
  if (!form.value.safeword) {
    errorTip.value.error3 = true
    return showToast('请输入交易密码')
  }
  // if (form.value.safeword != form.value.safeword2) {
  //   errorTip.value.error3 = true
  //   return showToast('两次密码不一致')
  // }
  sessionStorage.setItem('registerForm', JSON.stringify(form.value))

  if (!sessionToken.value) {
    const rs = await store.dispatch('updateSessionToken')
    if (!rs) return showToast('网络异常，请重试')
  }
  if (loading.value) return
  loading.value = true
  showLoadingToast({
    duration: 0,
    loadingType: 'spinner',
  })
  _register({
    ...form.value,
    token: sessionToken.value,
    verifcode: verifcode.value
  }).then(res => {
    if (res.code == 200) {
      setTimeout(() => {
        store.dispatch('reset')
        setTimeout(() => {
          store.commit('setToken', res.data.auth)
          store.commit('setUserInfo', res.data)
        }, 100)
        setTimeout(() => {
          store.dispatch('updateUserInfo')
          store.dispatch('updateAssets')
          store.dispatch('updateWallet')
          step.value = 3
        }, 300)
      }, 2000)
    } else {
      showToast(res.message)
    }
  }).catch(err => {
    if (err.code == '1001') { // 弹出验证码
      if (verifcode.value) { // 如果输入了验证码，旧提示验证码错误
        showToast(err.message)
      }
      setTimeout(() => {
        verifCodeRef.value.open()
      }, 1000)
    } else {
      showToast(err.message || "网络异常")
    }
  }).finally(() => {
    getSessionToken()
    setTimeout(() => {
      verifcode.value = ''
      loading.value = false
      closeToast()
    }, 2500)
  })
}

const registerSuccessNext = () => {
  if (guest.value) {
    router.replace({
      name: 'registerSuccess2'
    })
  } else {
    router.replace({
      name: 'registerSuccess'
    })
  }
}

// 通过验证码提交
const submitCode = code => {
  verifcode.value = code
  submit()
}


const sessionToken = computed(() => store.state.sessionToken || '')
const getSessionToken = () => {
  store.dispatch('updateSessionToken')
}
getSessionToken()

// 返回
const goBack = () => {
  if (route.query.reurl) {
    router.replace({
      name: route.query.reurl,
      query: {
        redata: route.query.redata,
      }
    })
  } else {
    router.back()
  }
}
// 跳转登录
const goLogin = () => {
  router.replace({
    name: 'user',
  })
  setTimeout(() => {
    store.commit('setIsLoginOpen', true)
  }, 300)
  // router.replace({
  //   name: 'login',
  //   query: {
  //     reurl: route.query.reurl,
  //     redata: route.query.redata,
  //   }
  // })
}
const goChat = () => {
  router.push({
    name: 'chat'
  })
}
</script>

<style lang="less" scoped>
.page-register {
  padding-top: 1.12rem;
  height: 100%;

  .tabs {
    overflow: hidden;
    margin-bottom: 0.4rem;
    z-index: 1;

    :deep(.van-tab__panel) {
      // height: calc(var(--app-height) - 3.4rem);
      // overflow-y: auto;
    }

    :deep(.van-tabs__nav--card) {
      border: none;
    }

    :deep(.van-tab--card) {
      border-right: none;
      color: #061023;
      border-bottom: 3px solid #D0D8E2;
      // background-color: #f5f5f5;
      // border-radius: 0.3rem;
      // margin-left: 0.1rem;
      // transition: all ease .2s;
    }

    :deep(.van-tab--card.van-tab--active) {
      background-color: white;
      color: #2168F6;
      font-family: "PingFang SC";
      font-size: 18px;
      font-style: normal;
      font-weight: 600;
      line-height: normal;
      border-bottom: 3px solid #014CFA;
    }

    :deep(.van-tab--shrink) {
      padding: 0 0.3rem;
    }

    :deep(.van-tabs__wrap) {
      height: 0.8rem;
      border-bottom: 1px solid rgba(0, 0, 0, 0);
      padding-bottom: 0.2rem;
    }

    :deep(.van-tabs__nav--card) {
      height: 0.8rem;
      display: flex;
    }

    :deep(.van-tab) {
      line-height: 0.6rem;
      font-size: 0.28rem;
      width: 50%;
      padding-bottom: 14.5px;
    }
  }

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
    z-index: 99;

    .top_back {
      color: #161616;
      font-size: 0.40rem;
      width: 0.8rem;
      height: 0.8rem;
      display: flex;
      align-items: center;
      justify-content: center;
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
    padding: 0.12rem 0.32rem 0.12rem 0.32rem;
    display: flex;
    align-items: center;
    justify-content: space-between;

    .title {
      color: var(--, #061023);
      text-align: left;
      font-family: "PingFang SC";
      font-size: 28px;
      font-style: normal;
      font-weight: 600;
      line-height: 140%;
      /* 39.2px */
    }

    .login_title {
      color: #343434;
      text-align: right;
      font-family: "PingFang SC";
      font-size: 12px;
      font-style: normal;
      font-weight: 400;
      line-height: 16px;
      /* 133.333% */
    }

    .tologin {
      color: #014CFA;
      font-family: "PingFang SC";
      font-size: 12px;
      font-style: normal;
      font-weight: 600;
      line-height: 16px;
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

    .form_item {
      display: flex;
      align-items: center;
      border: 1px solid #D0D8E2;
      height: 1.12rem;
      border-radius: 0.32rem;
      padding: 0 0.32rem;

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

      .code {
        color: #666;
        display: flex;
        align-items: center;
        margin-right: 0.12rem;
        gap: 5px;

        .flag_icon {
          width: 32px;
          height: 32px;
        }

        .more_icon {
          width: 0.24rem;
          height: 0.24rem;
          margin-left: 0.1rem;
        }
      }

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

    .margin_item {
      margin-bottom: 0.4rem;
    }

    .err_ipt {
      border: 1px solid #E8503A;
    }
  }

  .register_doc {
    padding-left: 0.32rem;
    overflow: hidden;
    display: flex;
    align-items: center;
    justify-content: flex-start;
    color: #343434;
    font-weight: 400;
    font-size: 0.26rem;
    margin-bottom: 0.5rem;

    .register_doc_check {
      margin-right: 0.24rem;
    }

    >span {
      color: #014CFA;
    }
  }

  .submit_box {
    padding: 0 0.32rem;

    .submit {
      width: 100%;
      height: 1.12rem;
    }
  }

  .go_register {
    margin: 0.6rem 0 0.2rem 0;
    text-align: center;
    font-weight: 400;
    display: flex;
    align-items: center;
    justify-content: center;

    .server_icon {
      width: 0.8rem;
      height: 0.8rem;
      margin-right: 0.2rem;
    }

    >span {
      color: #1A59F6;
      font-weight: 600;
    }
  }
}
</style>


<style lang="less" scoped>
.register_accounr_dialog {
  background-color: #fff;
  border-top-left-radius: 0.4rem;
  border-top-right-radius: 0.4rem;
  overflow: hidden;
  padding: 0.86rem 0.32rem 0.8rem 0.32rem;
  position: relative;

  .close_icon {
    position: absolute;
    width: 0.4rem;
    height: 0.4rem;
    top: 0.24rem;
    right: 0.32rem;
  }

  .search_box {
    height: 0.84rem;
    border: 1px solid #d0d8e2;
    border-radius: 0.32rem;
    padding: 0 0.32rem;
    margin: 0.12rem 0;
    display: flex;
    align-items: center;

    .ipt {
      width: 100%;
      height: 100%;
    }
  }

  .transfer_dialog_item {
    overflow: auto;
    height: 1.12rem;
    display: flex;
    align-items: center;
    justify-content: start;
    border-bottom: 1px solid #F5F5F5;
    padding: 0 0.32rem;
    gap: 10px;

    .flag_icon {
      width: 32px !important;
      height: 32px !important;
    }

    .cross {
      position: absolute;
      right: 5px;
    }
  }

  .transfer_dialog_item_active {
    color: #014CFA;
    font-weight: 600;
    position: relative;

    .check_icon {
      position: absolute;
      right: 0.64rem;
      color: #014CFA;
      font-size: 0.28rem;
    }
  }
}
</style>

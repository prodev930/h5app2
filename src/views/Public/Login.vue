<!-- 登录页 -->
<template>
  <div class="page page-login max-width">
    <!-- 返回和语言 -->
    <div class="max-width top">
      <div class="top_back" @click="goBack">
        <Icon name="arrow-left" />
      </div>

      <div class="top_lang" @click="goLang">
        <img src="/static/img/common/language.png" alt="language" />
      </div>
    </div>

    <!-- 标题 -->
    <div class="title_box">
      <div class="title">登录</div>
    </div>

    <!-- tab -->
    <Tabs type="card" class="tabs" v-model:active="activeTab" animated shrink>
      <Tab :title="'邮箱'"></Tab>
      <Tab :title="'手机'"></Tab>
    </Tabs>


    <!-- 表单 -->
    <div class="form">
      <div class="form_title" v-show="activeTab == 0">邮箱</div>
      <div class="form_item margin_item" v-show="activeTab == 0">
        <!-- <div class="form_item_user" v-show="saveAccount && saveAccount == form.email"> -->
        <div class="form_item_user" v-show="form.email">
          <img class="van-icon" src="/static/img/assets/envelop.svg" alt="envelope" />
        </div>
        <input @change="changeAccount" v-model.trim="form.email" placeholder="您的邮箱" type="text" class="item_input" />
        <Loading v-if="accountLoading" :size="18" type="spinner" />
        <!-- <div class="form_item_clear" v-show="saveAccount && saveAccount == form.email"> -->
        <div class="form_item_clear" v-show="form.email" @click="form.email = null">
          <Icon class="" name="cross" />
        </div>
      </div>

      <div class="form_title" v-show="activeTab == 1">手机号</div>
      <div class="form_item margin_item" v-show="activeTab == 1">
        <div class="code" @click="showDialog = true">
          <span class="flag_icon">
            <img src="/static/img/common/flag_hongkong.svg" alt="">
          </span>
          <span>{{ form.area }}</span>
          <div class="more_icon">
            <img src="/static/img/assets/more.png" alt="img" />
          </div>
        </div>
        <input maxlength="20" v-model.trim="form.phone" placeholder="您的手机号" type="text" class="item_input" />
      </div>
      <div class="form_title">密码</div>
      <div class="form_item">
        <!-- 显示密码输入时的锁图标 -->
        <div class="form_item_user" v-if="form.password">
          <img class="van-icon" src="/static/img/assets/lock.svg" alt="lock" />
        </div>

        <!-- 密码输入框，使用 v-if/v-else 优化 -->
        <input maxlength="20" :type="showPass ? 'text' : 'password'" v-model.trim="form.password" placeholder="请输入您的密码"
          class="item_input" />

        <!-- 切换显示/隐藏密码的图标 -->
        <div class="form_item_icon" @click="showPass = !showPass">
          <img :src="showPass ? '/static/img/user/eye-open.png' : '/static/img/user/eye-off.png'"
            :alt="showPass ? 'open' : 'off'" />
        </div>
      </div>

    </div>

    <!-- 忘记密码 -->
    <div class="fogot" @click="goFoget">忘记密码？</div>

    <!-- 按钮 -->
    <div class="submit_box" @click="submit">
      <Button :loading="loading" :disabled="disabled" round color="#014CFA" class="submit" type="primary">登录</Button>
    </div>

    <!-- 去注册 -->
    <div class="go_register" @click="goRegister">
      没有账号吗？
      <span>去注册</span>
    </div>

    <!-- 验证码 -->
    <VerifCode @submit="submitCode" to="body" ref="verifCodeRef" />

    <!-- 区号弹窗 -->
    <Popup :safe-area-inset-top="true" :safe-area-inset-bottom="true" class="self_van_popup" v-model:show="showDialog"
      position="bottom" teleport="body">
      <div class="register_accounr_dialog">
        <div class="close_icon" @click="showDialog = false">
          <img src="/static/img/common/close.png" alt="x" />
        </div>
        <div class="item search_box">
          <Icon class="search" name="search" size="24px" />
          <input v-model.trim="searchStr" class="ipt" type="text" placeholder="输入区号" />
        </div>
        <div style="height: 60vh; overflow-y: auto">
          <div @click="clickItem(item)" class="transfer_dialog_item"
            :class="{ transfer_dialog_item_active: form.area == item.code }" v-for="(item, i) in showAreas" :key="i">
            <span class="flag_icon">
              <img src="/static/img/common/flag_hongkong.svg" alt="HongKong">
            </span>
            <span>{{ item.cn }}</span>
            <span>({{ item.code }})</span>
            <Icon v-if="form.area == item.code" class="cross" name="success" />
          </div>
          <NoData v-if="!showAreas.length" />
        </div>
      </div>
    </Popup>
  </div>
</template> 

<script setup>
import { Icon, Button, showToast, Loading, Popup, Tabs, Tab, Calendar } from 'vant';
import { ref, computed, onMounted } from "vue";
import router from "@/router";
import { useRoute } from "vue-router";
import { _login, _userExist, _watchlist } from "@/api/api";
import VerifCode from "@/components/VerifCode.vue";
import store from "@/store";
import { areaCode, validateEmail } from "@/utils/index";
import NoData from "@/components/NoData.vue";
const emits = defineEmits(["closeDialog"]);
const props = defineProps({
  backFunc: {
    type: Function,
    default: null,
  },
  successFunc: {
    type: Function,
    default: null,
  },
});

// 区号控制
const activeTab = ref(0);
const defaultCode = "+244";
const showDialog = ref(false);
const searchStr = ref("");
const showAreas = computed(() => {
  return areaCode.filter((item) => {
    return (
      item.cn.includes(searchStr.value) ||
      item.en.includes(searchStr.value) ||
      item.code.includes(searchStr.value)
    );
  });
});
const clickItem = (item) => {
  form.value.area = item.code;
  showDialog.value = false;
};

// 进入页面则重置登录状态信息
store.dispatch("reset");
// store.commit('clearChooseSymbol')

const saveAccount = ref(localStorage.getItem("saveAccount") || "");
const accountLoading = ref(false);
const changeAccount = () => {
  accountLoading.value = true;
  if (form.value.email) {
    // 去检测
    _userExist({
      username: form.value.email,
    })
      .then((res) => {
        if (res.code == 200 && res.data?.exist == 1) {
          saveAccount.value = form.value.email;
          localStorage.setItem("saveAccount", saveAccount.value);
        } else {
          showToast('账号不存在')
        }
      })
      .finally(() => {
        accountLoading.value = false;
      });
  }
};

const route = useRoute();
const verifCodeRef = ref();

const showPass = ref(false); // 密码显示
const form = ref({
  // 表单
  area: localStorage.getItem("area") || defaultCode,
  email: saveAccount.value,
  phone: localStorage.getItem("phone") || "",
  username: saveAccount.value,
  password: "",
  verifcode: "",
});

const loading = ref(false); // 加载
const disabled = computed(() => {
  // 提交按钮禁用
  return !form.value.password;
});

// 提交
const submit = () => {
  if (loading.value) return;
  loading.value = true;
  if (activeTab.value == 0) {
    form.value.username = form.value.email;
  }
  if (activeTab.value == 1) {
    localStorage.setItem("area", form.value.area);
    localStorage.setItem("phone", form.value.phone);
    form.value.username = form.value.area + form.value.phone;
  }
  if (!form.value.username) return;
  _login(form.value)
    .then((res) => {
      if (res && res.code == 200) {
        store.dispatch("reset");

        // setTimeout(() => {
        store.commit("setToken", res.data.auth);
        store.commit("setUserInfo", res.data);

        // }, 100)

        setTimeout(() => {
          store.dispatch("updateUserInfo");
          store.dispatch("updateAssets");
          store.dispatch("updateWallet");

          if (props.successFunc) return props.successFunc();
          if (route.query.reurl) {
            router.replace({
              name: route.query.reurl,
              query: {
                redata: route.query.redata,
              },
            });
          } else {
            router.push({
              name: "user",
            });
          }
        }, 300);
        _watchlist()
          .then((res) => {
            if (res.code == 200) {
              store.commit("setMarketWatchList", res.data || []);

              store.dispatch("subList", {
                commitKey: "setMarketWatchList",
                listKey: "marketWatchList",
              });
            }
          })
          .finally(() => {
            emits("closeDialog");
            showToast("登录成功");
          });
      } else {
        return showToast(res.message || "登录异常");
      }
    })
    .catch((err) => {
      if (err.code == "1001") {
        // 弹出验证码
        if (form.value.verifcode) {
          // 如果输入了验证码，旧提示验证码错误
          showToast(err.message);
        }
        setTimeout(() => {
          verifCodeRef.value.open();
        }, 1000);
      } else {
        showToast(err.message || "网络异常");
      }
    })
    .finally(() => {
      setTimeout(() => {
        form.value.verifcode = "";
        loading.value = false;
      }, 1000);
    });
};

// 通过验证码提交
const submitCode = (code) => {
  form.value.verifcode = code;
  submit();
};

// 返回
const goBack = () => {
  if (props.backFunc) return props.backFunc(); 
  if (route.query.reurl) {
    router.replace({
      name: route.query.reurl,
      query: {
        redata: route.query.redata,
      },
    });
  } else {
    router.back();
  }
};
// 忘记密码
const goFoget = () => {
  emits("closeDialog");
  router.push({ name: "fogot" });
};

// 跳转注册
const goRegister = () => {
  emits("closeDialog");
  router.push({
    name: "register",
    query: {
      reurl: route.query.reurl,
      redata: route.query.redata,
    },
  });
};
 

onMounted(() => {
  Promise.all([
    import("@/views/Public/Register.vue"),
    import("@/views/Public/Fogot.vue"),
  ]);
});
</script>

<style lang="less" scoped>
.page-login {
  padding-top: 1rem;
  margin: auto;

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

    .top_back {
      color: #161616;
      font-size: 0.4rem;
      width: 0.8rem;
      height: 0.8rem;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .top_lang {
      width: 0.8rem;
      height: 0.8rem;
    }
  }

  .title_box {
    padding: 0.24rem 0.32rem 0.8rem 0.32rem;

    .title {
      // height: 0.78rem;
      display: flex;
      align-items: center;
      color: #061023;
      text-align: center;
      font-family: "PingFang SC";
      font-size: 28px;
      font-style: normal;
      font-weight: 600;
      line-height: 140%;
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
      border: 1px solid #d0d8e2;
      height: 1.12rem;
      border-radius: 0.32rem;
      padding: 0 0.32rem;

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
        border: 1px solid #014cfa;
      }

      .form_item_user {
        justify-content: center;
        color: #014CFA;
        margin-right: 0.12rem;
        display: flex;
        justify-content: center;
        align-items: center;
        width: 32px;
        height: 32px;
        background-color: #CDD4E3;
        border-radius: 50%;

        .van-icon {
          width: 18px !important;
        }
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

      .form_item_icon {
        width: 0.4rem;
        height: 0.4rem;
        margin-left: 0.2rem;
      }
    }

    .margin_item {
      margin-bottom: 0.4rem;
    }
  }

  .fogot {
    color: #014cfa;
    font-weight: 400;
    padding-left: 0.44rem;
    margin: 0.2rem 0 0.8rem 0;
  }

  .submit_box {
    display: flex;
    width: 100%;
    height: 56px;
    padding: 8px;
    justify-content: center;
    align-items: center;
    gap: 10px;
    flex-shrink: 0;

    .submit {
      width: 100%;
      height: 1.12rem;
      color: #FFF;
      text-align: center;
      font-family: "PingFang SC";
      font-size: 18px;
      font-style: normal;
      font-weight: 500;
      line-height: 100%;
      /* 18px */
    }
  }

  .go_register {
    margin: 0.8rem 0 0.4rem 0;
    text-align: center;
    font-weight: 400;

    >span {
      color: #1a59f6;
      font-weight: 600;
    }
  }
}
</style>

<style lang="less" scoped>
.register_accounr_dialog {
  width: 100%;
  height: 100%;
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
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: start;
    border-bottom: 1px solid #f5f5f5;
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
    color: #014cfa;
    font-weight: 600;
    position: relative;

    .check_icon {
      position: absolute;
      right: 0.64rem;
      color: #014cfa;
      font-size: 0.28rem;
    }
  }
}
</style>

<!-- 个人中心 -->
<template>
  <div class="page page_user">
    <!-- 标题 -->
    <!-- <div class="title">用户</div> -->

    <div style="height: 0.28rem" />

    <div v-if="token" class="user-login">
      <div style="display: flex">
        <img src="/static/img/user/user-block.png" alt="" />
        <div class="user-login-block">
          <span style="font-weight: 500">{{ userInfo.username || '--' }}</span>
          <div class="id">ID:{{ userInfo.uid || '--' }}</div>
        </div>
      </div>
      <Icon name="arrow" class="arrow-right" />

      <div class="user-login_navs">
        <div class="user-login_nav">
          <div class="amount">0</div>
          <div>推荐用户</div>
        </div>
        <div class="user-login_nav">
          <div class="amount">0</div>
          <div>网络用户</div>
        </div>
        <div class="user-login_nav">
          <div class="amount">0</div>
          <div>推荐奖金</div>
        </div>
      </div>
    </div>

    <div v-else class="user-login" @click="store.commit('setIsLoginOpen', true)">
      <div>
        <img src="/static/img/user/user-block.png" alt="" />
        <span>登录/注册新用户</span>
      </div>

      <Icon name="arrow" class="arrow-right" />
    </div>

    <div v-if="!token" class="user-banner" @click="jump('register', false, { guest: 1 })">
      <img src="/static/img/user/bg.png" alt="banner" />
    </div>
    <div v-else-if="userInfo.role == 'guest'" class="user-banner" @click="jump('kyc')">
      <img src="/static/img/user/bg2.png" alt="banner" />
    </div>
    <div v-else style="height: 0.28rem" />

    <div class="user-comman">
      <div class="user-b-box" style="margin-right: 0.2rem">
        <div class="user-flex">
          <img src="/static/img/user/user.svg" alt="" />
          <Icon name="arrow" class="arrow-right" />
        </div>
        <div class="user-sub">推荐朋友</div>
        <div class="user-small-title">分享给好友</div>
      </div>

      <div class="user-b-box" @click="jump('chat', false)">
        <div class="user-flex">
          <img src="/static/img/user/server.png" alt="" />

          <div style="display: flex">
            <div v-if="messageNum > 0" class="nums">{{ messageNum }}</div>
            <Icon name="arrow" class="arrow-right" />
          </div>
        </div>
        <div class="user-sub">客服</div>
        <div class="user-small-title">联系客服</div>
      </div>
    </div>

    <div class="user-h-box" @click="jump('account', true)">
      <div class="">
        <div class="user-flex">
          <img src="/static/img/user/account.png" alt="" />
          <Icon name="arrow" class="arrow-right" />
        </div>
        <div class="user-sub">收款账户</div>
        <div class="user-small-title">收款银行卡添加</div>
      </div>
    </div>

    <div class="user-comman">
      <div class="user-b-box" style="margin-right: 0.2rem" @click="jump('kyc', true)">
        <div class="user-flex">
          <img src="/static/img/user/iden.png" alt="" />
          <div style="display: flex">
            <span v-if="token">
              <span v-if="userInfo.kycl2 != 1 && userInfo.kycl2 != 2" class="red-text">未认证</span>
              <span v-else class="red-text" style="color: #18b762">已认证</span>
            </span>
            <Icon name="arrow" class="arrow-right" />
          </div>
        </div>
        <div class="user-sub">身份认证</div>
        <div class="user-small-title">进行身份认证</div>
      </div>

      <div class="user-b-box" @click="jump('googleCode', true)">
        <div class="user-flex">
          <img src="/static/img/user/Google-lock.png" alt="" />
          <div style="display: flex">
            <span v-if="token && !userInfo.googlebind" class="red-text">谷歌验证器未绑定</span>
            <span v-if="token && userInfo.googlebind" class="red-text" style="color: #18b762">谷歌验证器已绑定</span>
            <Icon name="arrow" class="arrow-right" />
          </div>
        </div>
        <div class="user-sub">谷歌验证器</div>
        <div class="user-small-title">谷歌验证器安全认证</div>
      </div>
    </div>

    <div class="navs">
      <div class="nav" style="border-bottom: 0.02rem solid #eaeaea" @click="jump('language')">
        <div class="icon">
          <img src="/static/img/user/lang.png" alt="img" />
        </div>
        <div class="content">
          <div class="title">语言</div>
        </div>
        <div class="lang">
          <div class="lang_icon">
            <img :src="i18Data.icon" alt="English" />
          </div>
          <span class="font-1">{{ i18Data.name }}</span>
        </div>
        <Icon class="nav_more" name="arrow" />
      </div>
      <div class="nav" style="border-bottom: 0.02rem solid #eaeaea" @click="jump('safety', true)">
        <div class="icon">
          <img src="/static/img/user/safe.png" alt="img" />
        </div>
        <div class="content">
          <div class="title">安全</div>
        </div>
        <div v-if="token" class="gg">
          <span v-if="!userInfo.googlebind" style="color: #ff3b30">谷歌验证器未绑定</span>
          <span v-if="userInfo.googlebind" style="color: #18b762">谷歌验证器已绑定</span>
        </div>
        <Icon class="nav_more" name="arrow" />
      </div>
      <div class="nav" @click="jump('about')">
        <div class="icon">
          <img src="/static/img/user/about.png" alt="img" />
        </div>
        <div class="content">
          <div class="title">关于</div>
        </div>
        <Icon class="nav_more" name="arrow" />
      </div>
    </div>

    <!-- 退出登录 -->
    <div v-if="token" class="loginout" @click="loginout">退出登录</div>
  </div>
</template>

<script setup>
import { computed, watch, ref } from 'vue'
import { Icon, showConfirmDialog } from 'vant'
import router from '@/router'
import store from '@/store'
import storeChat from '@/store/chat'
import { _logout } from '@/api/api'

const messageNum = computed(() => storeChat.state.messageNum)
const token = computed(() => store.state.token)
const userInfo = computed(() => store.state.userInfo || {})
const i18Data = computed(() => store.state.i18Data || {})

const getFirstCharacter = username => {
  return username ? username.charAt(0) : '-'
}

const loginout = () => {
  if (token.value) {
    showConfirmDialog({
      title: '退出登录',
      message: '您当前确定要退出吗？',
      confirmButtonColor: '#014CFA',
      cancelButtonColor: '#323233',
    })
      .then(() => {
        _logout()
        setTimeout(() => {
          store.dispatch('reset')
          store.commit('setIsLoginOpen', true)
          // router.push({
          //     name: 'login'
          // })
        }, 200)
      })
      .catch(() => {})
  }
}

const jump = (name, needLogin, query) => {
  if (needLogin && !token.value) {
    store.commit('setIsLoginOpen', true)
    // router.push({
    //     name: 'login',
    //     query
    // })
    return
  }
  if (name == 'googleCode') {
    if (token.value && !userInfo.value.googlebind) {
      router.push({
        name: 'google',
        query,
      })
    } else if (token.value && userInfo.value.googlebind) {
      router.push({
        name: 'googleCode',
        query,
      })
    }
  } else {
    router.push({
      name,
      query,
    })
  }
}

// 预加载页面
store.commit('setPageLoading', true)
const loadingList = [import('@/views/Public/Language.vue')]
if (!token.value) {
  loadingList.push(import('@/views/Public/Login.vue'))
}
Promise.all(loadingList).finally(() => {
  store.commit('setPageLoading', false)
})

// 延迟加载
if (token.value) {
  setTimeout(() => {
    store.commit('setPageLoading', false)
    Promise.all([import('@/views/User/Safety.vue'), import('@/views/User/Account/Account.vue'), import('@/views/User/Kyc/Index.vue')])
  }, 1000)
}
</script>

<style lang="less" scoped>
.page_user {
  padding: 0 0.32rem 2rem 0.32rem;
  position: relative;
  height: 100%;
  overflow-y: auto;

  .title {
    height: 1.12rem;
    color: #0d0d12;
    font-size: 0.5rem;
    font-weight: 600;
    line-height: 1.12rem;
  }

  .user-header {
    display: flex;
    justify-content: right;
    margin-bottom: 0.4rem;

    div {
      font-size: 0.4rem;
    }
  }

  .user-banner {
    position: relative;
    margin-bottom: 0.1rem;

    .banner-title {
      position: absolute;
      left: 0.2rem;
      top: 0.48rem;
      font-size: 0.28rem;
      font-weight: 700;
    }
  }

  .user-login {
    background-color: #f2f3f8;
    padding: 0.3rem;
    padding-top: 0.18rem !important;
    border-radius: 0.2rem;
    display: flex;
    align-items: center;
    justify-content: space-between;
    min-height: 1.6rem;
    flex-wrap: wrap;

    .user-login_navs {
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 0.24rem;
      color: #333333;
      font-size: 0.24rem;
      font-weight: 400;
      margin-top: 0.2rem;
      text-align: center;

      .user-login_nav {
        .amount {
          color: #000;
          font-size: 0.32rem;
          font-weight: 600;
          margin-bottom: 0.1rem;
        }
      }
    }

    img {
      width: 0.96rem !important;
      height: 0.96rem !important;
      margin-right: 0.48rem;
      vertical-align: middle;
    }

    span {
      line-height: 1rem;
      display: inline-block;
      vertical-align: middle;
      font-size: 0.36rem;
      font-weight: 400;
    }

    .arrow-right {
      margin-top: 0.04rem !important;
      color: #797b81;
    }

    .user-login-block {
      padding-top: 0.04rem;

      span {
        line-height: 0.6rem;
        display: block;
      }

      .id {
        color: #90939c;
        font-weight: 400;
        font-size: 0.28rem;
        height: 0.44rem;
        line-height: 0.44rem;
        background-color: #e1e4ed;
        padding: 0 0.1rem;
        border-radius: 0.04rem;
        display: inline-block;
      }
    }
  }

  .user-comman {
    display: flex;
    margin-bottom: 0.28rem;
    position: relative;
    overflow: hidden;

    .user-b-box {
      flex: 1;
      background-color: #f2f3f8;
      padding: 0.2rem 0.3rem;
      border-radius: 0.2rem;
    }

    .user-flex {
      display: flex;
      justify-content: space-between;
      margin-bottom: 0.2rem;

      img {
        width: 0.4rem !important;
      }

      .arrow-right {
        color: #797b81;
        margin-left: 0.24rem;
        margin-top: 0.02rem;
      }

      .nums {
        width: 0.32rem;
        height: 0.32rem;
        background-color: #ff3b30;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 0.2rem;
        color: #fff;
        font-weight: 400;
      }
    }

    .user-sub {
      font-size: 0.28rem;
      font-weight: 600;
      line-height: 0.48rem;
    }

    .user-small-title {
      font-size: 0.24rem;
      line-height: 0.32rem;
      color: #4f5156;
    }
  }

  .user-h-box {
    background-color: #f2f3f8;
    padding: 0.2rem 0.3rem;
    border-radius: 0.2rem;
    margin-bottom: 0.28rem;
    position: relative;
    overflow: hidden;

    .user-flex {
      display: flex;
      justify-content: space-between;
      margin-bottom: 0.1rem;

      img {
        width: 0.48rem !important;
      }

      .arrow-right {
        margin-top: 0.08rem;
        color: #797b81;
      }
    }

    .user-sub {
      font-size: 0.28rem;
      font-weight: 600;
      line-height: 0.48rem;
    }

    .user-small-title {
      font-size: 0.24rem;
      line-height: 0.32rem;
      color: #4f5156;
    }
  }

  .user-bottom {
    margin-top: 0.4rem;

    .user-flex {
      border-bottom: 0.02rem solid #f4f4f4;
      display: flex;
      justify-content: space-between;
      padding: 0.2rem 0;

      .user-item {
        img {
          width: 0.4rem !important;
          vertical-align: middle;
          margin-right: 0.2rem;
        }

        span {
          vertical-align: middle;
        }
      }

      .arrow-right {
        margin-top: 0.08rem;
        color: #797b81;
      }
    }
  }

  .user-login-login-box {
    background-color: #f2f3f8;
    padding: 0.2rem 0.3rem;
    border-radius: 0.2rem;
  }

  .user-login-login {
    display: flex;
    justify-content: space-between;
    margin-bottom: 0.2rem;

    .arrow-right {
      margin-top: 0.08rem;
      color: #797b81;
    }

    .login-user-box {
      width: 1rem;
      height: 1rem;
      border-radius: 0.2rem;
      background-color: #667d7f;
      color: white;
      line-height: 0.88rem;
      text-align: center;
      margin-right: 0.4rem;
      font-size: 0.6rem;
      font-weight: 900;
    }

    span {
      font-size: 0.36rem;
      font-weight: 700;
      line-height: 0.6rem;
    }
  }

  // .loginout {
  //     margin-top: 0.2rem;
  //     border-bottom: 0.02rem solid #f4f4f4;
  //     display: flex;
  //     color: #eb4e3d;
  //     padding: 0.2rem 0;
  //     line-height: 0.4rem;
  //     img {
  //         width: 0.4rem !important;
  //         height: 0.4rem !important;
  //         vertical-align: middle;
  //         margin-right: 0.2rem;
  //     }
  // }
  .loginout {
    width: 100%;
    height: 1.5rem;
    border-radius: 1.3rem;
    background-color: #fff;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 0.28rem;
    color: #014cfa;
    font-weight: 400;
    overflow: hidden;
  }

  .user-fllower {
    display: flex;

    .user-fllower-flex {
      flex: 1;

      .user-fllower-num {
        font-size: 0.28rem;
        font-weight: 600;
        margin-bottom: 0.06rem;
      }

      .user-fllower-title {
        font-size: 0.24rem;
        color: #767880;
      }
    }
  }

  .navs {
    margin-top: 0.2rem;

    .nav {
      display: flex;
      align-items: center;
      height: 1.04rem;
      color: #7e848d;
      font-size: 0.28rem;
      overflow: hidden;

      .icon {
        width: 0.64rem;
        height: 0.64rem;
        margin-right: 0.3rem;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;

        > img {
          width: 0.48rem !important;
          height: 0.48rem !important;
        }
      }

      .content {
        flex: 1;
        font-weight: 400;
        margin-right: 0.2rem;
        overflow: hidden;

        .title {
          color: #1e1e2d;
          font-size: 0.32rem;
          font-weight: 400;
        }

        .info {
          font-size: 0.24rem;
          color: #c2c2c2;
          margin-top: 0.2rem;
        }
      }

      .nav_more {
        margin-left: 0.3rem;
      }

      .cards {
        width: 1.36rem;
        height: 0.52rem;
      }

      .gg {
        font-weight: 500;
        font-size: 0.24rem;
      }

      .lang {
        display: flex;
        align-items: center;
        font-weight: 500;
        color: #1e1e2d;
        font-size: 0.24rem;

        .lang_icon {
          width: 0.48rem;
          height: 0.48rem;
          margin-right: 0.2rem;
        }
      }
    }
  }

  .red-text {
    color: #ff3b30;
    font-size: 0.2rem;
    font-style: normal;
    font-weight: 500;
    line-height: 0.32rem;
  }
}
</style>

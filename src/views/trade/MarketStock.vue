<template>
  <div class="opentrade">
    <div ref="placeholder" class="placeholder"></div>

    <!-- <div> -->
    <div ref="stickyElement" :class="{ fixed: isFixed }" class="opentrade-sticky">
      <div class="opentrade-sticky">
        <div style="
            background-color: white;
          ">
          <Tabs class="tabs" v-model="active" :swipeable="false" animated :color="'#014CFA'" shrink @change="onChange">
            <Tab title="开仓" name="0"> </Tab>
            <Tab title="持仓" name="1"> </Tab>
            <Tab title="查询" name="2"> </Tab>
          </Tabs>
        </div>

        <div class="date-box" v-if="active === '2'" @click="goToDate">
          <img src="/static/img/trade/time.png" alt="" class="date-img" />
          <span>日期</span>
        </div>
      </div>
    </div>
    <!-- </div> -->

    <!-- <Loading v-if="loading"></Loading> -->

    <transition :name="transitionName">
      <!-- 持仓 -->
      <!-- 已登录 -->
      <div v-if="active === '1'">

        <Loading v-show="loading" type="spinner" class="position-loading"></Loading>
        <div v-show="!loading && token">
          <div class="header-grid" v-if="dataList.length > 0">
            <div style="padding: 0 0.3rem; display: flex" class="bottom-grid">
              <div class="header-f-left" style="width: 2.2rem">股票/状态</div>
              <div>开仓/可售</div>
              <div>现价/成本</div>
              <div class="header-f-right">盈亏/盈亏比</div>
            </div>
          </div>

          <div v-for="(i, key) in dataList" :key="key">
            <!-- <SwipeCell> -->
            <div class="content-grid grid-item-hover " @click="showButton(i)">
              <div :style="currentNum === i.order_no && buttonShow ? { padding: '0' } : { padding: '0 0.3rem' }"
                class="flex">
                <div class="grid-item" style="width: 2.2rem"
                  :class="{ 'open_tab': currentNum === i.order_no && buttonShow }">
                  <div class="f-text f-weight f-left" style="font-weight: 500;">
                    {{ i.symbol }}
                  </div>
                  <div class="f-left" style="display: flex">
                    <div style="line-height: 0.4rem">{{ i.lever }}X</div>
                    <div class="close-button" v-if="getStatusText(i.status) !== '持仓'">{{ getStatusText(i.status) }}
                    </div>
                  </div>
                </div>
                <div class="grid-item" :class="{ 'open_tab': currentNum === i.order_no && buttonShow }">
                  <div class="f-text button" style="color: #e8503a;background-color: #fbf1ef;"
                    v-if="i.offset === 'long'">买涨</div>
                  <div class="f-text button" v-else>买跌</div>
                  <div class="special-color">{{ i.unsold_volume }}</div>
                </div>
                <div class="grid-item">
                  <div class="f-text">{{ i.open_price }}</div>
                  <div>{{ i.settled_price }}</div>
                </div>
                <div class="grid-item">
                  <div class="f-text f-weight red">{{ i.profit }}</div>
                  <div class="f-weight red">{{ i.ratio }}</div>
                </div>

                <div v-if="currentNum === i.order_no && buttonShow">
                  <div class="button-style" style="width: 4rem">
                    <div style="background: #f7931f" @click="showDetailPopup(i)">
                      <img src="/static/img/trade/detail.png" alt="" />
                      订单详情
                    </div>
                    <div style="background-color: #627eea" @click="updateDetailPopup(i)"
                      v-if="i.status === 'none' || i.status === 'lock' || i.status === 'open'">
                      <img src="/static/img/trade/update.png" alt="" />
                      更新
                    </div>
                    <div style="background-color: #f2f2f2;color: #999999;" v-else>
                      <img src="/static/img/trade/no-update.png" alt="" />
                      更新
                    </div>
                    <div style="background-color: #014cfa" @click="updateClosePositionPopup(i)">
                      <img src="/static/img/trade/close.png" alt="" />
                      平仓
                    </div>
                  </div>
                </div>


              </div>
            </div>

            <!-- </SwipeCell> -->
          </div>
        </div>


        <!-- 没数据 -->
        <NoData v-if="!loading && token && dataList.length === 0" />


        <!-- 未登录 -->
        <div class="no-data-box" v-show="!loading && !token" style="height: 8rem;">
          <img src="/static/img/trade/no-data.png" class="no-data-img">
          <p class="no-data-text">还未登录账号？<span style="color: #014cfa;cursor: pointer;" @click="goLogin">马上登录</span>
          </p>
        </div>


      </div>
      <!-- 开仓 -->
      <div v-else-if="active === '0'">
        <OpenPosition ref="OpenPositionRef" />
      </div>



      <!-- 查询 -->
      <div v-else-if="active === '2'">
        <Loading v-show="loading" type="spinner" class="position-loading"></Loading>

        <div v-show="!loading && token">
          <div class="header-grid" v-if="inquireData.length > 0">
            <div style="padding: 0 0.3rem; display: flex" class="bottom-grid">
              <div class="header-f-left" style="width: 2.2rem">股票/状态</div>
              <div>开仓/可售</div>
              <div>现价/成本</div>
              <div class="header-f-right">盈亏/盈亏比</div>
            </div>
          </div>

          <div v-for="(i, key) in inquireData" :key="key" style="min-height: 100%;">
            <div class="content-grid grid-item-hover " @click="showButton(i)">
              <div :style="currentNum === i.order_no && buttonShow ? { padding: '0' } : { padding: '0 0.3rem' }"
                class="flex">
                <div class="grid-item" style="width: 2.2rem"
                  :class="{ 'open_tab': currentNum === i.order_no && buttonShow }">
                  <div class="f-text f-weight f-left" style="font-weight: 500;">
                    {{ i.symbol }}
                  </div>
                  <div class="f-left" style="display: flex">
                    <div style="line-height: 0.4rem">{{ i.lever }}X</div>
                    <div class="close-button" v-if="getStatusText(i.status) !== '持仓'">{{ getStatusText(i.status) }}
                    </div>
                  </div>
                </div>
                <div class="grid-item" :class="{ 'open_tab': currentNum === i.order_no && buttonShow }">
                  <div class="f-text button" style="color: #e8503a;background-color: #fbf1ef;"
                    v-if="i.offset === 'long'">买涨</div>
                  <div class="f-text button" v-else>买跌</div>
                  <div class="special-color">{{ i.unsold_volume }}</div>
                </div>
                <div class="grid-item">
                  <div class="f-text">{{ i.open_price }}</div>
                  <div>{{ i.settled_price }}</div>
                </div>
                <div class="grid-item">
                  <div class="f-text f-weight red">{{ i.profit }}</div>
                  <div class="f-weight red">{{ i.ratio }}</div>
                </div>

                <div v-if="currentNum === i.order_no && buttonShow">
                  <div class="button-style" style="width: 4rem">
                    <div style="background: #f7931f" @click="showDetailPopup(i)">
                      <img src="/static/img/trade/detail.png" alt="" />
                      订单详情
                    </div>
                    <div style="background-color: #627eea" @click="updateDetailPopup(i)"
                      v-if="i.status === 'none' || i.status === 'lock' || i.status === 'open'">
                      <img src="/static/img/trade/update.png" alt="" />
                      更新
                    </div>
                    <div style="background-color: #f2f2f2;color: #999999;" v-else>
                      <img src="/static/img/trade/no-update.png" alt="" />
                      更新
                    </div>
                    <div style="background-color: #014cfa" @click="updateClosePositionPopup(i)">
                      <img src="/static/img/trade/close.png" alt="" />
                      平仓
                    </div>
                  </div>
                </div>


              </div>
            </div>
          </div>
        </div>

        <!-- 没数据 -->
        <NoData v-if="!loading && token && inquireData.length === 0" />



        <!-- 未登录 -->
        <div class="no-data-box" v-show="!loading && !token" style="height: 8rem;">
          <img src="/static/img/trade/no-data.png" class="no-data-img">
          <p class="no-data-text">还未登录账号？<span style="color: #014cfa;cursor: pointer;"
              @click="jump('login')">马上登录</span>
          </p>
        </div>


      </div>

    </transition>


  </div>
</template>

<script setup>
import { ref, computed, watch, nextTick } from "vue";
import {
  Tab,
  Tabs,
  Grid,
  GridItem,
  SwipeCell,
  Sticky,
  Loading,
  Button,
  Popup,
  PullRefresh,
  showToast
} from "vant";
import { onMounted, onDeactivated } from "vue";
import OpenPosition from "./OpenPosition.vue";
import { useRouter, useRoute } from "vue-router";
import { useSocket } from "@/utils/ws";
import store from "@/store";
import { _stocksList, _commToken } from "@/api/api"
import OrderDetail from "./OrderDetail.vue";
import OrderUpdate from "./OrderUpdate.vue";
import OrderClosePosition from "./OrderClosePosition.vue";
import Optional from "../../views/Market/components/Optional.vue"
import NoData from "@/components/NoData.vue"
import eventBus from "@/utils/eventBus";


const goLogin = () => {
  store.commit('setIsLoginOpen', true)
  eventBus.on('loginSuccess', () => {
    eventBus.off('loginSuccess')
    if (active.value === '1') {
      subscribeOrders();
    }
  })
}

const token = computed(() => store.state.token);
const { startSocket } = useSocket();
let socket = null;
const active = ref('0');
const previousActive = ref('0');

const route = useRoute();
if (route.query.redata === "1") {
  active.value = '0';
}

const emit = defineEmits();
const buttonShow = ref(false);
const buttonInquiryShow = ref(false);
const currentNum = ref(null);
const currentInquiryNum = ref(null);
const loading = ref(false);

const isFixed = ref(false);
const stickyElement = ref(null);

const showLeft = ref(false)
const OptionalRef = ref()
const count = ref(1)


const reloading = ref(false)

const transitionName = ref('slide-left');
const OpenPositionRef = ref(null);


const inquireData = ref([])

let hasSubscribed = false; // 用于跟踪是否已订阅


watch([active], ([newActive]) => {
  if (previousActive.value === '0' && newActive === '1') {
    transitionName.value = 'slide-right';
  } else if (previousActive.value === '1' && newActive === '0') {
    transitionName.value = 'slide-left';
  } else if (previousActive.value === '1' && newActive === '2') {
    transitionName.value = 'slide-right';
  } else if (previousActive.value === '2' && newActive === '1') {
    transitionName.value = 'slide-left';
  } else if (previousActive.value === '2' && newActive === '0') {
    transitionName.value = 'slide-left';
  } else if (previousActive.value === '0' && newActive === '2') {
    transitionName.value = 'slide-right';
  }
}, { immediate: true });

const formatDate = (date) => {
  if (date != '') {
    const daysOfWeek = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'];
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    const dayOfWeek = daysOfWeek[d.getDay()];

    return `${year}-${month}-${day}`;
  } else {
    return ''
  }
};

//持仓 data
const dataList = ref([])
const startDate = computed(() => formatDate(store.state.startDate))
const endDate = computed(() => formatDate(store.state.endDate))

// 定义一个状态对象
const statusMapping = {
  none: '开仓',
  lock: '锁定',
  open: '持仓',
  done: '平仓',
  fail: '失败',
  cancel: '已取消'
};

// 定义一个方法来根据 `status` 的值获取对应的中文状态
const getStatusText = (status) => {
  return statusMapping[status] || status;
};

window.onscroll = () => {
  // if (stickyElement.value) {
  //   const scrollY = window.scrollY;
  //   const stickyRect = stickyElement.value.getBoundingClientRect();
  //   isFixed.value = scrollY > stickyRect.top;
  //   stickyElement.value.style.top = isFixed.value ? `${scrollY}px` : '';
  // }
};

const router = useRouter();
const goToDate = () => {
  router.push({ name: "date" });
};

const showDetailPopup = (i) => {
  store.commit('setOrderNo', i.order_no)
  //订单详情
  store.dispatch('openPopup', OrderDetail)
  store.commit('setPopupHeight', '90%')
  store.commit('setkeyborader', false)

};

const updateDetailPopup = (i) => {
  store.commit('setOrderNo', i.order_no)
  getcommToken()
  //更新
  store.dispatch('openPopup', OrderUpdate)
  store.commit('setPopupHeight', '90%')
  store.commit('setkeyborader', true)
};

const updateClosePositionPopup = (i) => {
  console.log(i, 'i')
  store.commit('setOrderNo', i.order_no)
  store.commit('setUnsoldVolume', i.unsold_volume)
  getcommToken()
  //平仓
  store.dispatch('openPopup', OrderClosePosition)
  store.commit('setPopupHeight', '90%')
  store.commit('setkeyborader', true)
};

const subscribeOrders = () => {
  socket = startSocket(() => {
    // 这里是 stocksorder 的处理
    socket && socket.emit('user', token.value)
    socket && socket.emit('stocksorder', '#all')
    socket && socket.off('user')
    socket && socket.off('stocksorder')
    socket.on('stocksorder', res => {
      // console.log(res.data,'res.data')
      if (res && res.data.length > 0) {
        dataList.value = res.data
        loading.value = false;
      } else {
        dataList.value = []
        loading.value = false;
      }
    })
  });
};

const onRefresh = () => {
  reloading.value = true;
  count.value++
  store.commit('setDates', ['', '']);

  getStocksList(true)
}


const getcommToken = () => {
  //点击按钮获取 token
  store.dispatch('updateSessionToken')
}


const onChange = async (val) => {
  if (Object.keys(route.query).length > 0) {
    router.push({ path: route.path, query: {} });
  }
  emit('updateActive', val)
  previousActive.value = active.value;
  active.value = val;
  count.val = 1
  store.commit('setDates', ['', '']);

  if (val === '0') {
    await nextTick(); // 确保 DOM 已更新
    if (OpenPositionRef.value) {
      OpenPositionRef.value.clearChild();
    }
    // setTimeout(() => {
    //   // store.commit('clearCurrentSymbol')
    //   // store.commit('clearChooseSymbol')
    // },5)

  }

  if (token.value === '') {
    loading.value = false;
    return
  }

  if (val === '1' && !hasSubscribed) {
    loading.value = true
    //持仓
    subscribeOrders()
    hasSubscribed = true; // 标记为已订阅
  } else if (val === '1') {
    subscribeOrders()
  } else {
    //取消订阅
    const socket = startSocket(() => {
      socket && socket.emit('user', '')
      socket && socket.emit('stocksorder', '')
      socket && socket.off('user')
      socket && socket.off('stocksorder')
    })
    if (val === '2') {
      //查询
      // loading.value = true;
      getStocksList(false)
    } else if (val === '0') {
      loading.value = false;
    }
  }
};


// 监听时间的变化
// watch([startDate, endDate], (newValues, oldValues) => {
//   getStocksList(false);
// });

const getStocksList = (val) => {
  // 查询
  const data = {
    symbol: '',
    page: 1,
    start_time: startDate.value,
    end_time: endDate.value
  }
  if (val === true) {
    data.page = count.value
  } else {
    data.page = 1
  }
  _stocksList({ ...data }).then(res => {
    if (res.code == 200) {
      if (val === true) {
        //下拉刷新
        reloading.value = false;
        loading.value = false
        inquireData.value = inquireData.value.concat(res.data);
      } else {
        reloading.value = false;
        loading.value = false

        inquireData.value = res.data
      }
      emit('reloading')
    } else {
      reloading.value = false;
      loading.value = false
      inquireData.value = []
      emit('reloading')
    }
  }).finally(() => {
    emit('reloading')
  })
}


if (route.query.type === "date") {
  active.value = '2';
  getStocksList(false)
}


onDeactivated(() => {
  eventBus.off('loginSuccess')
  // 取消订阅
  const socket = startSocket(() => {
    socket && socket.emit('user', '')
    socket && socket.emit('stocksorder', '')
    socket && socket.off('user')
    socket && socket.off('stocksorder')
  })
})

const showButton = (i) => {
  if (currentNum.value === i.order_no) {
    buttonShow.value = !buttonShow.value;
  } else {
    buttonShow.value = true;
  }
  currentNum.value = i.order_no;
};

const showInquiryButton = (i) => {
  if (currentInquiryNum.value === i) {
    buttonInquiryShow.value = !buttonInquiryShow.value;
  } else {
    buttonInquiryShow.value = true;
  }
  currentInquiryNum.value = i;
};

onMounted(() => {
  if (token.value === '') {
    loading.value = false;
    return
  }

  if (active.value === '1') {
    subscribeOrders();
  }
});

const jump = (name) => {
  router.push({
    name,
    query: { reurl: 'trade' }
  });
};


defineExpose({
  onRefresh
});

</script>

<style lang="less">
.opentrade {
  .opentrade-sticky {
    width: 100%;
    background-color: white;
    z-index: 1000;
    // transition: all 0.1s ease;
  }

  .fixed {
    position: absolute !important;
    width: 100%;
  }

  .position-loading {
    margin-top: 2rem !important;

    .van-loading__spinner {
      left: 45%;
    }
  }

  .open_tab {
    width: 0 !important;
  }

  .flex {
    display: flex;
    justify-content: space-between;

    &.flex-end {
      justify-content: flex-end !important;
    }

    >div {
      transition: all ease .2s;
      overflow: hidden;
    }
  }

  .header-grid {
    padding-bottom: 0.12rem;
    background: white;
    border-bottom: 0.02rem solid #e8e8e8;

    .bottom-grid div {
      color: #9ea3ae;
      font-size: 0.26rem;
      font-style: normal;
      font-weight: 400;
      // line-height: 0.48rem;
      width: 25%;
      text-align: center;
    }
  }

  .header-f-left {
    text-align: left !important;
    width: 100%;
  }

  .header-f-right {
    text-align: right !important;
    width: 100%;
  }

  .grid-item-hover {
    background-color: white;
  }

  .grid-item-hover :hover {
    // background: #e5e5e5 !important;
  }

  .content-grid {
    border-bottom: 0.02rem solid #e8e8e8;
    overflow: hidden;
    height: 1.22rem;

    .grid-item {
      padding: 0.2rem 0;
      width: 25%;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    div {
      color: #000;
      text-align: center;
      font-family: "PingFang SC";
      font-size: 0.28rem;
      font-style: normal;
      font-weight: 400;
      line-height: 0.3rem;
    }

    .f-text {
      margin-bottom: 0.1rem;
    }

    .f-left {
      text-align: left;
      width: 100%;
    }

    .button {
      height: 0.4rem;
      color: #18b762;
      padding: 0.04rem 0.3rem;
      background-color: rgba(239, 249, 242);
      width: 1.16rem;
      margin: auto;
      margin-bottom: 0.08rem;
    }

    .f-weight {
      font-weight: 600;
      font-size: 0.32rem;
    }

    .special-color {
      color: #014cfa;
    }

    .red {
      color: #e8503a;
    }
  }

  .risk-box {
    position: absolute;
    top: 0rem;
    right: 0.3rem;

    .risk-img {
      width: 0.52rem !important;
      height: 0.52rem !important;
      margin-right: 0.08rem;
      vertical-align: middle;
    }

    span {
      vertical-align: middle;
      color: #0953fa;
      font-size: 0.24rem;
      font-style: normal;
      font-weight: 400;
    }
  }

  .date-risk-box {
    position: absolute;
    top: 0rem;
    right: 1.6rem;

    .date-risk-img {
      width: 0.52rem !important;
      height: 0.52rem !important;
      margin-right: 0.08rem;
      vertical-align: middle;
    }

    span {
      vertical-align: middle;
      color: #0953fa;
      font-size: 0.24rem;
      font-style: normal;
      font-weight: 400;
    }
  }

  .date-box {
    position: absolute;
    top: 0rem;
    right: 0.3rem;

    .date-img {
      width: 0.52rem !important;
      height: 0.52rem !important;
      margin-right: 0.08rem;
      vertical-align: middle;
    }

    span {
      vertical-align: middle;
      color: #0953fa;
      font-size: 0.24rem;
      font-style: normal;
      font-weight: 400;
    }
  }

  .button-style {
    div {
      width: 1.22rem;
      height: 1.28rem;
      flex-shrink: 0;
      color: white;
      font-size: 0.24rem;
      font-style: normal;
      font-weight: 500;
      text-align: center;
      display: inline-block;

      img {
        width: 0.4rem !important;
        height: 0.4rem !important;
        display: block;
        margin: auto;
        margin-top: 0.22rem;
        margin-bottom: 0.14rem;
      }
    }
  }

  .tabs {
    flex: 1;
    display: flex;
    flex-direction: column;

    .van-tabs__nav {
      position: absolute;
      width: 100%;
      left: 0px;
      height: 0.68rem;

      &::after {
        content: "";
        width: 100%;
        height: 0.02rem;
        background-color: #3b82f6;
        position: absolute;
        bottom: 0.32rem;
        left: 0;
        opacity: 0.3;
      }
    }

    .van-tab {
      margin-left: 0.36rem;
      font-size: 0.28rem;
    }

    .van-tab:first-of-type {
      margin-left: 0.15rem;
    }

    .van-tabs__content {
      flex: 1;

      .van-swipe-item {
        padding-bottom: 0.2rem;
      }
    }

    .van-tabs__wrap {
      height: 0.88rem;
    }

    .van-tabs__line {
      bottom: 0.3rem;
    }

    .van-tabs__track {
      height: 0;
    }
  }

  .close-button {
    margin-left: 0.26rem;
    background-color: #fdf8ef;
    color: #f89a29 !important;
    width: 0.76rem;
    height: 0.4rem;
    text-align: center;
    font-size: 0.24rem !important;
    font-style: normal;
    font-weight: 500 !important;
    line-height: 0.4rem !important;
    border-radius: 0 0.14rem 0 0.14rem;
  }

  .button-show {
    display: flex;

    div {
      flex: 1;
      height: 1.12rem !important;
      color: #fff;
      text-align: left;
      font-size: 0.24rem;
      font-style: normal;
      font-weight: 500;
      line-height: 0.3rem;
      padding-left: 0.32rem;

      img {
        height: 0.4rem !important;
        margin-top: 0.22rem;
        width: 0.4rem !important;
        display: block;
        margin-bottom: 0.12rem;
      }
    }
  }

  .opentrade-sticky-wrapper {
    position: relative;
    width: 100%;
  }

  .opentrade-sticky {
    position: -webkit-sticky;
    position: sticky;
    top: 0;
    width: 100%;
    background-color: white;
    z-index: 1000;
  }
}

.no-data-box {
  position: relative;

  .no-data-img {
    width: 4.22rem !important;
    height: 2.16rem !important;
    position: absolute;
    top: 2.8rem;
    bottom: 0;
    left: 0;
    right: 0;
    margin: 0 auto;
  }

  .no-data-text {
    color: #a5afba;
    text-align: center;
    font-size: 0.28rem;
    font-style: normal;
    font-weight: 400;
    position: absolute;
    top: 5rem;
    bottom: 0;
    left: 0;
    right: 0;
    margin: 0 auto;
  }
}


@media (min-width: 751px) {
  .left-popup {
    max-width: 350px !important;
    position: fixed !important;
    top: 50% !important;
    left: calc(50% - 187.5px) !important;
    transform: translateY(-50%) !important;
  }
}
</style>

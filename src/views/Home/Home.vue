<!-- 首页 -->
<template>
  <div class="page_home">
    <!-- 顶部 -->
    <div class="top_box relative">
      <div
        class="flex transition-transform ease-out duration-700 absolute left-0 top-0"
        :style="`transform: translateX(-${
          slideIndex * 100
        }%) ; animation: rotateImages 6s linear infinite;`"
      >
        <!-- <div class="flex-shrink-0 w-full">
          <img :src="slides[slides.length - 1]" class="w-full" alt="img" />
        </div> -->
        <div
          v-for="(slide, index) in slides.concat(slides)"
          :key="index"
          class="flex-shrink-0 w-full"
        >
          <img :src="slide" class="w-full" alt="img" />
        </div>
        <!-- <div class="flex-shrink-0 w-full">
          <img :src="slides[0]" class="w-full" alt="img" />
        </div> -->
      </div>
      <div class="funcs relative">
        <!-- style="padding: 0.2rem 0.32rem 1rem 0.32rem;" -->
        <div class="user_box">
          <!-- <img
            v-if="token"
            src="/static/img/user/default_avatar.png"
            alt="avatar"
          /> -->
          <div class="user_default_avatar"></div>
          <!-- <Iconfonts v-if="!token" :name="'icon-yonghuhui'" :size="0.52" /> -->
        </div>
        <div style="flex: 1"></div>
        <div class="func_box" @click="jump('search')">
          <!-- <Iconfonts :name="'icon-sousuo'" :size="0.44" :color="'#000'" /> -->
          <div class="custom-search-icon"></div>
        </div>
        <div class="func_box">
          <!-- <Iconfonts :name="'icon-xiaoxi'" :size="0.44" :color="'#000'" /> -->
          <div class="custom-lock-icon"></div>
        </div>
      </div>
      <div class="pl-[0.285rem] mt-[1.25rem]">
        <!-- <div
          class="text-[#014CFA] font-[1000] text-[0.4rem] w-[5.14rem] h-[0.72rem] bg-gradient-to-r from-blue-400 to-white rounded-r-3xl justify-center flex items-center mb-[0.24rem] font-alibaba"
        >
          Newcomer Registration
        </div> -->
        <!-- <div
          class="font-medium text-[0.32rem] text-white mb-[0.16rem] font-alibaba"
        >
          Reward Immediately
        </div>
        <div class="font-[1000] text-[0.6rem] mb-[0.6rem] font-alibaba">
          <span
            class="text-transparent"
            style="
              background: linear-gradient(180deg, #ffab9f 0%, #e8503a 100%);
              background-clip: text;
            "
            >1000</span
          >
          <span
            class="text-transparent"
            style="
              background: linear-gradient(90deg, #b1c9ff 0%, #ffffff 100%);
              background-clip: text;
            "
          >
            + USDT
          </span>
        </div> -->
        <!-- <div
          class="w-[2.2rem] h-[0.7rem] rounded-[1rem] text-[white] bg-gradient-to-b from-blue-400 to-blue-800 items-center flex justify-center gap-3 mt-[1.924rem]"
        >
          Register
          <div class="custom-arrow-icon"></div>
        </div> -->
      </div>
    </div>
    <div
      class="h-[0.82rem] bg-[#F5F7FC] rounded-t-[0.5rem] rounded-b-[0.32rem] -mt-[0.5rem] px-[0.32rem] flex items-center justify-between relative"
    >
      <div class="flex items-center gap-2">
        <div class="custom-lock-small-icon"></div>
        <div class="text-[0.28rem] text-[#061023]">
          通知公告内容测试测试测试...
        </div>
      </div>
      <div class="text-[0.24rem] text-[#7B7B7B]">10/16 16:10</div>
    </div>
    <div class="relative m-[0.32rem]">
      <!--//////////////////////////////////-->
      <div
        class="backdrop-blur-sm bg-['rgba(255, 255, 255, 0.1)'] rounded-[0.32rem] w-full h-[1.6rem] px-[0.4rem] py-[0.28rem] absolute z-20 flex flex-col justify-center items-center"
        v-show="!token"
      >
        <div
          class="w-[1.2rem] h-[0.6rem] bg-[#014CFA] border-[#014CFA] text-[#FFF] rounded-[0.32rem] flex items-center justify-center border-[0.02rem] mb-[0.2rem]"
          @click="store.commit('setIsLoginOpen', true)"
        >
          登录
        </div>
        <div class="text-[0.24rem] text-[#8F92A1]">登录才能查看资产</div>
      </div>
      <div
        class="bg-[#EFF3F8] rounded-[0.32rem] h-[1.6rem] px-[0.4rem] py-[0.28rem] z-10"
      >
        <div class="flex justify-between mb-[0.2rem] items-center">
          <div class="flex items-center gap-1">
            <div class="text-[0.26rem] text-[#333333]">总资产(USDT)</div>
            <div
              class="assets"
              v-if="!token"
              @click="store.commit('setIsLoginOpen', true)"
            >
              <!-- <div class="assets_login">登录</div>
          <div>查看资产</div> -->
              <div class="assets_icon">
                <Iconfonts :name="'icon-biyan'" :size="0.32" :color="'#333'" />
              </div>
            </div>
            <div class="assets" v-if="token">
              <div class="assets_icon" @click="openEye = !openEye">
                <Iconfonts
                  v-show="!openEye"
                  :name="'icon-biyan'"
                  :size="0.32"
                  :color="'#333'"
                />
                <Iconfonts
                  v-show="openEye"
                  :name="'icon-zhengyan'"
                  :size="0.32"
                  :color="'#333'"
                />
              </div>
            </div>
          </div>
          <div class="flex items-center gap-2">
            <div
              class="w-[1.36rem] h-[0.52rem] border-[#014CFA] text-[#014CFA] rounded-[0.32rem] flex items-center justify-center border-[0.02rem]"
              @click="showAS = true"
            >
              快速交易
            </div>
            <div
              class="w-[1.36rem] h-[0.52rem] bg-[#014CFA] border-[#014CFA] text-[#FFF] rounded-[0.32rem] flex items-center justify-center border-[0.02rem]"
              @click="jump('topUp', true)"
            >
              充值
            </div>
          </div>
        </div>
        <div class="font-bold text-[0.48rem]">
          {{ openEye ? assets.total : "*******" }}
        </div>
      </div>
      <!--//////////////////////////////////-->
      <div class="flex mt-[0.32rem] justify-between mb-[0.32rem]">
        <div
          class="rounded-[0.32rem] w-[3.33rem] h-[3.48rem] bg-gradient-to-b from-[#98b0eb] border-[0.02rem] border-[#EFF3F8] via-[#F5F7FC] to-[#F5F7FC] p-[0.32rem] relative"
        >
          <div class="w-1/2 absolute bottom-0 right-0">
            <img src="/static/img/home/hand.svg" img="img" />
          </div>
          <div class="font-bold text-[0.32rem] mb-[0.32rem]">邀请朋友注册</div>
          <div class="text-[0.28rem] text-[#666D80] mb-[0.32rem]">各得最高</div>
          <div class="text-[0.28rem] text-[#666D80] mb-[0.64rem]">
            1000 USDT 奖励
          </div>
          <div
            class="w-[1.2rem] h-[0.6rem] bg-[#014CFA] border-[#014CFA] text-[#FFF] text-[0.28rem] rounded-[0.32rem] flex items-center justify-center border-[0.02rem]"
          >
            去邀请
          </div>
        </div>
        <div
          class="rounded-[0.32rem] w-[3.33rem] h-[3.48rem] bg-gradient-to-b from-[#98b0eb] border-[0.02rem] border-[#EFF3F8] via-[#F5F7FC] to-[#F5F7FC]"
        >
          <div
            class="flex items-center justify-between px-[0.32rem] py-[0.24rem]"
          >
            <div class="flex items-center gap-1">
              <div class="font-bold text-[0.32rem]">热卖</div>
              <div class="custom-heart-icon"></div>
            </div>
            <div class=""></div>
          </div>
          <div
            class="bg-[#FFF] w-full h-[2.64rem] rounded-[0.32rem] text-center p-[0.32rem]"
          >
            <div class="text-[font-bold] text-[15px] mb-[0.32rem]">
              BTC/USDT
            </div>
            <div class="flex justify-between mb-[0.32rem]">
              <div class="text-[#18B762] text-[0.3rem] font-bold">465.5</div>
              <div class="text-[#18B762] text-[0.3rem]">+1.72%</div>
            </div>
            <div></div>
          </div>
        </div>
      </div>
      <!--//////////////////////////////////-->
      <div
        class="flex w-full h-[2.18rem] border-[0.02rem] border-[#EFF3F8] bg-[#F5F7FC] rounded-[0.32rem] mb-[0.32rem]"
      >
        <div
          class="flex flex-col items-center justify-center bg-white border-[0.02rem] rounded-[0.32rem] border-[#EFF3F8] w-[1.04rem]"
        >
          <div class="text-[0.28rem] text-[#061023] mb-[0.2rem]">今日</div>
          <div class="text-[0.28rem] text-[#061023] mb-[0.2rem]">指数</div>
          <div class="text[0.24rem] text-[#666D80]">10/17</div>
        </div>
      </div>
      <!--//////////////////////////////////-->
      <div class="mb-[0.32rem]">
        <div class="flex justify-between items-center mb-[0.32rem]">
          <div class="font-bold text-[0.32rem]">优选</div>
          <div class="flex items-center gap-1">
            <div
              class="bg-[#014CFA] w-[0.12rem] h-[0.06rem] rounded-[0.2rem]"
            ></div>
            <div
              class="bg-[#cad7f333] w-[0.12rem] h-[0.06rem] rounded-[0.2rem]"
            ></div>
          </div>
        </div>
        <div class="flex justify-between">
          <div
            class="w-[2.22rem] h-[1.48rem] p-[0.16rem] rounded-[0.32rem] bg-[#F5F7FC]"
          >
            <div class="font-medium text-[0.28rem] text-[#061023] mb-[0.1rem]">
              NAHARCAP...
            </div>
            <div class="flex justify-between text-[#18B762] mb-[0.1rem]">
              <div class="text-[0.24rem] font-bold">465.4</div>
              <div class="text-[0.22rem]">+1.7%</div>
            </div>
          </div>
          <div
            class="w-[2.22rem] h-[1.48rem] p-[0.16rem] rounded-[0.32rem] bg-[#F5F7FC]"
          >
            <div class="font-medium text-[0.28rem] text-[#061023] mb-[0.1rem]">
              NAHARCAP...
            </div>
            <div class="flex justify-between text-[#E53E00] mb-[0.1rem]">
              <div class="text-[0.24rem] font-bold">465.4</div>
              <div class="text-[0.22rem]">+1.7%</div>
            </div>
          </div>
          <div
            class="w-[2.22rem] h-[1.48rem] p-[0.16rem] rounded-[0.32rem] bg-[#F5F7FC]"
          >
            <div class="font-medium text-[0.28rem] text-[#061023] mb-[0.1rem]">
              NAHARCAP...
            </div>
            <div class="flex justify-between text-[#18B762] mb-[0.1rem]">
              <div class="text-[0.24rem] font-bold">465.4</div>
              <div class="text-[0.22rem]">+1.7%</div>
            </div>
          </div>
        </div>
      </div>
      <!--//////////////////////////////////-->
      <div class="mb-[0.32rem]">
        <div class="flex justify-between items-center mb-[0.32rem]">
          <div class="font-bold text-[0.32rem]">优选</div>
          <div class="flex items-center gap-1">
            <div
              class="bg-[#014CFA] w-[0.12rem] h-[0.06rem] rounded-[0.2rem]"
            ></div>
            <div
              class="bg-[#cad7f333] w-[0.12rem] h-[0.06rem] rounded-[0.2rem]"
            ></div>
          </div>
          <div
            class="bg-[#F5F7FC] w-[0.84rem] h-[0.34rem] rounded-[0.32rem] text-[0.24rem] text-[#666D80] flex items-center justify-center"
          >
            more+
          </div>
        </div>
        <div class="flex justify-between">
          <div
            class="w-[3.33rem] h-[1.92rem] p-[0.16rem] rounded-[0.32rem] bg-[#F5F7FC] relative"
          >
            <div
              class="font-medium text-[0.28rem] text-[#061023] mb-[0.1rem] flex justify-between items-center"
            >
              NAHARCAP...
              <div
                class="custom-star-icon-small absolute right-0 top-0 mr-[0.1rem] mt-[0.1rem]"
              ></div>
            </div>
            <div class="flex justify-between text-[#18B762] mb-[0.1rem]">
              <div class="text-[0.28rem] font-bold">465.4</div>
              <div class="text-[0.28rem]">+1.7%</div>
            </div>
            <div class="flex">
              <div class="w-1/2"></div>
              <div class="w-1/2 flex items-center justify-center h-[0.82rem]">
                <div
                  class="border-[0.02rem] rounded-[0.32rem] border-[#014CFA] text-[#014CFA] text-[0.22rem] w-[0.96rem] h-[0.42rem] items-center justify-center flex"
                >
                  去看看
                </div>
              </div>
            </div>
          </div>
          <div
            class="w-[3.33rem] h-[1.92rem] p-[0.24rem] rounded-[0.32rem] bg-[#F5F7FC] relative"
          >
            <div
              class="font-medium text-[0.28rem] text-[#061023] mb-[0.1rem] flex justify-between items-center"
            >
              NAHARCAP...
              <div
                class="custom-star-icon-small absolute right-0 top-0 mr-[0.1rem] mt-[0.1rem]"
              ></div>
            </div>
            <div class="flex justify-between text-[#E53E00] mb-[0.1rem]">
              <div class="text-[0.28rem] font-bold">465.4</div>
              <div class="text-[0.28rem]">-1.7%</div>
            </div>
            <div class="flex">
              <div class="w-1/2"></div>
              <div class="w-1/2 flex items-center justify-center h-[0.82rem]">
                <div
                  class="border-[0.02rem] rounded-[0.32rem] border-[#014CFA] text-[#014CFA] text-[0.22rem] w-[0.96rem] h-[0.42rem] items-center justify-center flex"
                >
                  去看看
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <!--//////////////////////////////////-->
      <div>
        <div class="font-bold text-[0.32rem] mb-[0.32rem]">市场表现</div>
        <div class="flex gap-1">
          <div>
            <div
              :class="
                marketPerformance == 0
                  ? 'bg-[#014CFA] text-white'
                  : 'border-[0.02rem] text-[#666D80] border-[#D0D8E2]'
              "
              class="rounded-[0.32rem] w-[1.44rem] h-[0.68rem] flex items-center justify-center"
              @click="clickPerformance(0)"
            >
              涨幅榜
            </div>
          </div>
          <div>
            <div
              :class="
                marketPerformance == 1
                  ? 'bg-[#014CFA] text-white'
                  : 'border-[0.02rem] text-[#666D80] border-[#D0D8E2]'
              "
              class="rounded-[0.32rem] w-[1.44rem] h-[0.68rem] flex items-center justify-center"
              @click="clickPerformance(1)"
            >
              涨幅榜
            </div>
          </div>
          <div>
            <div
              :class="
                marketPerformance == 2
                  ? 'bg-[#014CFA] text-white'
                  : 'border-[0.02rem] text-[#666D80] border-[#D0D8E2]'
              "
              class="rounded-[0.32rem] w-[1.44rem] h-[0.68rem] flex items-center justify-center"
              @click="clickPerformance(2)"
            >
              涨幅榜
            </div>
          </div>
        </div>
        <StockTable
          style="margin-top: 0.1rem"
          v-if="marketPerformance == 2"
          :loading="marketLoading"
          :deleteItem="!!token"
          :list="marketVolumeList"
          :marketType="'all'"
        />
        <StockTable
          style="margin-top: 0.1rem"
          v-if="marketPerformance == 0"
          :loading="marketLoading"
          :deleteItem="!!token"
          :list="marketUpList"
          :marketType="'all'"
        />
        <StockTable
          style="margin-top: 0.1rem"
          v-if="marketPerformance == 1"
          :loading="marketLoading"
          :deleteItem="!!token"
          :list="marketDownList"
          :marketType="'all'"
        />
      </div>
    </div>
    <!-- banner -->
    <Banner v-if="activated" class="home_banner" />

    <!-- Tabs -->
    <Tabs
      @change="tabChange"
      v-if="!pageLoading && activated"
      type="card"
      class="tabs"
      v-model:active="activeTab"
      animated
      shrink
    >
      <Tab :title="'股票'">
        <Loaidng v-if="commendLoading" :loading="commendLoading" />
        <div>
          <StockItem
            :item="item"
            v-for="(item, i) in marketRecommndStockList"
            :key="'s_' + i"
          />
        </div>
        <NoData v-if="!commendLoading && !marketRecommndStockList.length" />
      </Tab>
      <Tab :title="'合约'">
        <Loaidng v-if="commendLoading" :loading="commendLoading" />
        <div>
          <StockItem
            :item="item"
            v-for="(item, i) in marketRecommndContractList"
            :key="'c_' + i"
          />
        </div>
        <NoData v-if="!commendLoading && !marketRecommndContractList.length" />
      </Tab>
      <Tab :title="'IPO'">
        <div>
          <IPO ref="ipoRef" :page="'home'" />
        </div>
      </Tab>
    </Tabs>

    <!-- 类型选择弹窗 -->
    <ActionSheet
      v-model:show="showAS"
      :actions="actions"
      @select="onSelect"
      title="快速交易"
    ></ActionSheet>
  </div>
</template>

<script setup>
import StockItem from "@/components/StockItem.vue";
import { onDeactivated, ref, computed, onActivated, onMounted } from "vue";
import Banner from "./components/Banner.vue";
import { useSocket } from "@/utils/ws";
import store from "@/store";
import { Tab, Tabs, ActionSheet } from "vant";
import { _sort, _watchlistDefault } from "@/api/api";
import Iconfonts from "@/components/Iconfonts.vue";
import router from "@/router";
import IPO from "../Market/components/IPO.vue";
import NoData from "@/components/NoData.vue";
import Loaidng from "@/components/Loaidng.vue";
import StockTable from "@/components/StockTable.vue";

import { Translation } from "vue-i18n";

const openEye = ref(false);

const { startSocket } = useSocket();
const activeTab = ref(0);
const token = computed(() => store.state.token || "");

// 打开添加类型选择弹窗
const showAS = ref(false);
const actions = [
  { name: "股票", value: "0" },
  { name: "合约", value: "-1" },
  { name: "IPO", value: "1" },
];
const slides = [
  "static/img/home/back1.png",
  "static/img/home/back2.png",
  "static/img/home/back3.png",
];
const slideIndex = ref(0);
const showSlides = () => {
  setInterval(() => {
    slideIndex.value = (slideIndex.value + 1) % slides.length;
  }, 2000);
};
onMounted(() => {
  showSlides();
  // getMarketPerformanceData(
  //   marketUpList,
  //   "setMarketUpList",
  //   "up",
  //   "marketUpList"
  // );
  getMarketPerformanceData(
    marketUpList,
    "setMarketDownList",
    "down",
    "marketDownList"
  );
});

const onSelect = (item) => {
  showAS.value = false;
  if (item.value == -1) return;
  router.push({
    name: "trade",
    query: {
      page: "home",
      pageType: item.value,
    },
  });
};

// 预加载页面
const pageLoading = computed(() => store.state.pageLoading);
store.commit("setPageLoading", true);

Promise.all([
  import("@/views/Market/MarketInfo.vue"),
  import("@/views/Market/Search.vue"),
  import("@/views/Public/Login.vue"),
  import("@/views/assets/TopUpCrypto.vue"),
]).finally(() => {
  store.commit("setPageLoading", false);
});

// 总资产
const assets = computed(() => store.state.assets || {});

const ipoRef = ref();
const ipoDataList = computed(() => store.state.ipoDataList || []);
const tabChange = (val) => {
  if (val == 2 && !ipoDataList.value.length) {
    setTimeout(() => {
      ipoRef.value && ipoRef.value.init();
    }, 500);
  }
};

const activated = ref(false);
onActivated(() => {
  activated.value = true;
  setTimeout(() => {
    subs([
      ...marketRecommndStockList.value,
      ...marketRecommndContractList.value,
      ...marketRecommndList.value,
    ]);
  }, 500);
});
onDeactivated(() => {
  activated.value = false;
  // 取消订阅
  const socket = startSocket(() => {
    socket && socket.emit("realtime", ""); // 价格变化
    socket && socket.emit("snapshot", ""); // 快照数据
    socket && socket.off("realtime");
    socket && socket.off("snapshot");
  });
});

// 获取推荐数据
const commendLoading = ref(false);
const marketRecommndStockList = computed(
  () => store.state.marketRecommndStockList || []
);
const marketRecommndContractList = computed(
  () => store.state.marketRecommndContractList || []
);
const marketRecommndList = computed(() => store.state.marketRecommndList || []);
const getRecommendData = () => {
  commendLoading.value = true;
  _watchlistDefault()
    .then((res) => {
      if (res.data?.chart) {
        const rs = res.data.chart.map((item) => {
          const target = marketRecommndList.value.find(
            (a) => a.symbol == item.symbol
          );
          if (target) {
            Object.assign(target, item);
            item = target;
          }
          return item;
        });
        store.commit("setMarketRecommndList", rs);
      }
      if (res.data?.stock) {
        const rs = res.data.stock.map((item) => {
          const target = marketRecommndStockList.value.find(
            (a) => a.symbol == item.symbol
          );
          if (target) {
            Object.assign(target, item);
            item = target;
          }
          return item;
        });
        store.commit("setMarketRecommndStockList", rs);
      }
      if (res.data?.contract) {
        const rs = res.data.contract.map((item) => {
          const target = marketRecommndContractList.value.find(
            (a) => a.symbol == item.symbol
          );
          if (target) {
            Object.assign(target, item);
            item = target;
          }
          return item;
        });
        store.commit("setMarketRecommndContractList", rs);
      }
      setTimeout(() => {
        subs([
          ...(res.data?.chart || []),
          ...(res.data?.stock || []),
          ...(res.data?.contract || []),
        ]);
      }, 500);
    })
    .finally(() => {
      commendLoading.value = false;
    });
};
getRecommendData();

const subs = (arr) => {
  // 订阅 ws
  store.commit("setMarketWatchKeys", arr.map((item) => item.symbol) || []);
  store.dispatch("subList", {});
};

// 跳转
const jump = (name, needToken) => {
  if (needToken && !token.value) return store.commit("setIsLoginOpen", true);
  // router.push({
  //   name: 'login',
  //   query: {
  //     reurl: 'home'
  //   }
  // })
  router.push({
    name,
  });
};
const page = ref(0);
const marketLoading = ref(true);
const totalHeight = window.innerHeight || document.documentElement.clientHeight;
let target = null;
const marketPerformance = ref(0);
const clickPerformance = (key) => {
  page.value = 0;
  marketLoading.value = false;
  marketPerformance.value = key;
  setTimeout(() => {
    // 加载更多元素
    switch (key) {
      case 2:
        getMarketPerformanceData(
          marketVolumeList,
          "setMarketVolumeList",
          "volume",
          "marketVolumeList"
        );
        break;
      case 1:
        getMarketPerformanceData(
          marketUpList,
          "setMarketUpList",
          "up",
          "marketUpList"
        );
        break;
      case 0:
        getMarketPerformanceData(
          marketDownList,
          "setMarketDownList",
          "down",
          "marketDownList"
        );
        break;
    }
    target = document.querySelector(".stock_soft_more" + key);
  }, 350);
};

const marketVolumeList = computed(() => store.state.marketVolumeList || []); // 活跃列表
const marketUpList = computed(() => store.state.marketUpList || []); // 涨幅列表
const marketDownList = computed(() => store.state.marketDownList || []); // 跌幅列表
const subsM = (listKey, key) => {
  // 订阅ws
  store.dispatch("subList", {
    commitKey: key,
    listKey: listKey,
    // proxyListValue: list.value
  });
};
const getMarketPerformanceData = (list, key, query, listKey) => {
  if (marketLoading.value) return;
  marketLoading.value = true;
  page.value++;
  let arr = JSON.parse(JSON.stringify(list.value));
  if (page.value == 1) {
    arr = [];
  }
  if (arr.length) {
    subsM(listKey, key);
  }
  const saveActive = marketPerformance.value;
  _sort({
    exchange: "",
    orderby: query,
    page: page.value,
  })
    .then((res) => {
      if (res.code == 200) {
        if (saveActive != marketPerformance.value) return;
        res.data = res.data.map((item) => {
          item.ratio = undefined; // 弃用接口里的该字段
          return item;
        });
        const rs = res.data.map((item) => {
          const target = list.value.find((a) => a.symbol == item.symbol);
          if (target) {
            item = {
              ...target,
              ...item,
              ratio: target.ratio,
            };
          }
          return item;
        });
        arr.push(...rs);
        store.commit(key, arr || []);
        setTimeout(() => {
          subsM(listKey, key);
          scrollHandler();
        }, 500);
      }
    })
    .finally(() => {
      setTimeout(() => {
        subsM(listKey, key);
        marketLoading.value = false;
      }, 300);
    });
};

const scrollHandler = () => {
  if (!target) return;
  const rect = target.getBoundingClientRect();
  if (rect.top <= totalHeight) {
    // 加载更多
    switch (marketPerformance.value) {
      case 2:
        getMarketPerformanceData(
          marketVolumeList,
          "setMarketVolumeList",
          "volume",
          "marketVolumeList"
        );
        break;
      case 1:
        getMarketPerformanceData(
          marketUpList,
          "setMarketUpList",
          "up",
          "marketUpList"
        );
        break;
      case 0:
        getMarketPerformanceData(
          marketDownList,
          "setMarketDownList",
          "down",
          "marketDownList"
        );
        break;
    }
  }
};
</script>

<style lang="less" scoped>
.page_home {
  padding: 0 0 1.9rem 0;
  height: 100%;
  overflow-y: auto;

  :deep(.van-action-sheet__content) {
    padding: 0.2rem 0 1.38rem 0;

    .van-action-sheet__item {
      padding: 0.32rem;
      border-bottom: 1px solid #f5f5f5;
    }
  }

  .top_box {
    padding: 0.2rem 0.32rem 0.32rem;
    min-height: 7rem;
    .funcs {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 0.52rem;

      .user_box {
        width: 0.8rem;
        height: 0.8rem;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        .user_default_avatar {
          width: 0.8rem;
          height: 0.8rem;
          background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 40"><circle cx="20" cy="20" r="20" fill="white" fill-opacity="0.1"/><path d="M2 20C2 29.9381 10.0619 38 20 38C29.9381 38 38 29.9381 38 20C38 10.0619 29.9381 2 20 2C10.0619 2 2 10.0615 2 20Z" fill="%236C8CD6"/><path d="M17.2891 24.8727H22.9362V29.5327H17.2704L17.2891 24.8727ZM13.7038 18.6344C13.7038 19.4633 13.2024 20.1348 12.5708 20.1348C11.9393 20.1348 11.4395 19.4633 11.4395 18.6344C11.4395 17.8056 11.9409 17.1345 12.5725 17.1345C13.204 17.1345 13.7055 17.806 13.7055 18.6344M28.8075 18.6137C28.8075 19.4421 28.3056 20.1136 27.6741 20.1136C27.0426 20.1136 26.5399 19.4409 26.5399 18.6137C26.5399 17.7865 27.0414 17.1133 27.6729 17.1133C28.3044 17.1133 28.8075 17.806 28.8075 18.6137Z" fill="%23F8ECEC"/><path d="M17.2879 25.541C17.2879 25.541 18.3655 26.0981 19.907 26.0981C21.7274 26.1726 22.9162 25.5598 22.9162 25.5598V26.1168C22.9162 26.1168 20.9103 27.1934 20.0187 27.1934C19.1083 27.1934 17.2871 25.9302 17.2871 25.9302L17.2879 25.541Z" fill="%23E9CFCF"/><path d="M33.1333 32.2817C32.2233 31.5576 30.5974 29.5108 28.8883 28.6934C26.1204 27.3381 22.9167 27.7333 22.9167 27.7333V27.8242C22.6937 28.0658 21.5978 29.1424 20.1117 29.1424C18.644 29.1424 17.5298 28.14 17.2884 27.8792L17.2696 27.7492C17.2696 27.7492 13.7357 27.3356 10.9503 28.6909C9.05569 29.6196 7.70416 31.6481 6.88672 32.3534C8.56413 34.1434 10.5926 35.5686 12.8457 36.5402C15.0987 37.5118 17.5279 38.0089 19.9817 38.0004C25.1831 37.9816 29.8639 35.791 33.1333 32.2817Z" fill="%23485B80"/><path d="M27.4857 17.4133C27.4857 19.3338 26.9044 21.9364 25.9283 23.3426C24.5829 25.2806 21.5488 26.1763 20.1296 26.1763C18.6949 26.1763 15.9649 25.4457 14.6179 23.7314C13.4698 22.2697 12.7734 19.5151 12.7734 17.4153C12.7734 12.8482 16.0615 9.13477 20.1296 9.13477C24.1976 9.13477 27.4857 12.8482 27.4857 17.4153" fill="%23F8ECEC"/><path d="M28.1358 13.6228C28.1358 13.6228 28.0718 10.7639 26.441 8.72645C25.3019 7.3035 21.6709 6.27052 19.0706 6.47508C19.0706 6.47508 13.9772 6.67882 13.8712 10.061C12.9404 10.618 11.9839 11.5789 11.8816 13.1937C11.6778 16.443 12.253 17.2971 12.253 17.2971C12.253 17.2971 13.0705 17.2971 13.2751 18.522C13.2751 18.522 13.6465 18.7453 13.6828 18.522C13.7383 18.1508 13.3485 16.3685 14.1284 14.7349C14.2247 14.5283 14.3209 14.3441 14.4138 14.1799C16.9677 11.3405 24.4584 11.6347 26.2135 14.7393C26.2854 14.9554 26.3374 15.1776 26.3689 15.4031C26.5173 16.4626 26.7032 18.4666 26.7032 18.4666C26.7032 18.4666 26.9816 18.652 27.1675 18.2066C27.3535 17.7425 27.3163 17.2971 27.4835 17.1671C28.4326 16.5368 28.1913 13.9015 28.1358 13.6228Z" fill="%23485B80"/></svg>');
          background-size: contain;
          background-repeat: no-repeat;
          background-position: center;
        }
      }

      .func_box {
        // background-color: #ededed;
        width: 0.72rem;
        height: 0.72rem;
        border-radius: 50%;
        margin-left: 0.28rem;
        display: flex;
        align-items: center;
        justify-content: center;
        border-color: #d0d8e2;
        border-width: 0.02rem;
      }
    }

    .subtitle {
      color: #333333;
      font-size: 0.26rem;
      margin-bottom: 0.16rem;
    }

    .assets {
      display: flex;
      align-items: center;
      justify-content: flex-start;
      font-size: 0.4rem;
      color: #8d93a6;
      font-weight: 600;

      .assets_login {
        color: #014cfa;
        margin-right: 0.12rem;
      }

      .assets_icon {
        width: 0.32rem;
        height: 0.32rem;
        margin-left: 0.2rem;
        line-height: 0;
      }

      .num {
        color: #000;
        font-size: 0.48rem;
      }
    }

    .btns {
      margin-top: 0.28rem;
      display: flex;
      align-items: center;
      justify-content: space-between;

      .btn {
        width: 48%;
        height: 0.76rem;
        background-color: #f2f3f7;
        border-radius: 0.76rem;
        display: flex;
        align-items: center;
        justify-content: center;
        color: #000000;
        font-size: 0.28rem;
      }

      .active_btn {
        background-color: #014cfa;
        color: #fff;
      }
    }
  }

  .home_ad {
    height: 2.8rem;
    width: 100%;
    margin: 0.4rem 0;
  }

  .home_banner {
    padding-bottom: 0.2rem;
  }

  .tabs {
    overflow: hidden;

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
      // background-color: #f5f5f5;
      // border-radius: 0.3rem;
      // margin-left: 0.1rem;
      // transition: all ease .2s;
    }

    :deep(.van-tab--card.van-tab--active) {
      // background-color: #014CFA;
      // color: #fff;

      background-color: #f6f8ff;
      border-radius: 0.3rem;
      color: #014cfa;
      font-weight: 500;
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
      height: 0.6rem;
    }

    :deep(.van-tab) {
      line-height: 0.6rem;
      font-size: 0.28rem;
    }
  }
}
.custom-arrow-icon {
  width: 0.32rem;
  height: 0.14rem;
  background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 7"><path d="M13.7031 5L10.4531 1.75L11.3438 0.859375L15.4688 5H15.5V6.25H0.5V5H13.7031Z" fill="%23ffffff"/></svg>');
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
}
.custom-search-icon {
  width: 0.46rem;
  height: 0.46rem;
  background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 23 23"><path fill-rule="evenodd" clip-rule="evenodd" d="M15.0893 17.8637C13.7154 18.8645 12.0508 19.4134 10.3297 19.4134C8.18582 19.4134 6.12972 18.5617 4.61374 17.0457C3.09776 15.5298 2.24609 13.4737 2.24609 11.3297C2.24609 9.18582 3.09776 7.12972 4.61374 5.61374C6.12972 4.09776 8.18582 3.24609 10.3297 3.24609C12.4737 3.24609 14.5298 4.09776 16.0457 5.61374C17.5617 7.12972 18.4134 9.18582 18.4134 11.3297C18.4134 13.4019 17.6177 15.3921 16.1956 16.8918L19.0036 19.6998C19.0097 19.7057 19.0157 19.7117 19.0217 19.7179C19.0919 19.7857 19.1478 19.8667 19.1864 19.9564C19.2249 20.0461 19.2451 20.1425 19.246 20.2401C19.2468 20.3376 19.2282 20.4344 19.1913 20.5247C19.1543 20.615 19.0998 20.6971 19.0308 20.7661C18.9618 20.8351 18.8797 20.8897 18.7894 20.9266C18.6991 20.9636 18.6023 20.9821 18.5048 20.9813C18.4072 20.9805 18.3107 20.9602 18.2211 20.9217C18.1314 20.8832 18.0503 20.8272 17.9826 20.757C17.9764 20.7511 17.9704 20.745 17.9645 20.7389L15.0893 17.8637ZM5.65301 16.0065C6.89336 17.2468 8.57563 17.9436 10.3297 17.9436C12.0839 17.9436 13.7661 17.2468 15.0065 16.0065C16.2468 14.7661 16.9436 13.0839 16.9436 11.3297C16.9436 9.57563 16.2468 7.89336 15.0065 6.65301C13.7661 5.41267 12.0839 4.71585 10.3297 4.71585C8.57563 4.71585 6.89336 5.41267 5.65301 6.65301C4.41267 7.89336 3.71585 9.57563 3.71585 11.3297C3.71585 13.0839 4.41267 14.7661 5.65301 16.0065Z" fill="%23ffffff"/></svg>');
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
}
.custom-lock-icon {
  width: 0.44rem;
  height: 0.44rem;
  background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 22 22"><path d="M18.4674 17.6193H4.82183C4.43021 17.6193 4.06576 17.4246 3.84618 17.1009C3.6266 16.7749 3.58359 16.3652 3.73073 16.0007L4.84447 13.2503V9.07153C4.84447 8.19096 5.01877 7.33528 5.36285 6.52714C5.69335 5.74843 6.16647 5.04894 6.76861 4.4468C7.37076 3.84465 8.07024 3.37154 8.84895 3.04104C9.65709 2.69696 10.5128 2.52266 11.3933 2.52266H11.4092C12.2898 2.52266 13.1454 2.69696 13.9536 3.04104C14.7323 3.37154 15.4318 3.84465 16.0339 4.4468C16.6361 5.04894 17.1092 5.74843 17.4397 6.52714C17.7838 7.33528 17.9581 8.19096 17.9581 9.07153V13.1983L19.4861 15.8558C19.6989 16.2248 19.6966 16.664 19.4838 17.033C19.2733 17.3997 18.8907 17.6193 18.4674 17.6193ZM5.22477 16.1705H17.9966L16.5093 13.5853V9.07153C16.5093 7.71558 15.9773 6.43659 15.0107 5.46999C14.0441 4.50339 12.7651 3.97142 11.4092 3.97142H11.3933C10.0374 3.97142 8.7584 4.50339 7.7918 5.46999C6.8252 6.43659 6.29323 7.71558 6.29323 9.07153V13.5333L5.22477 16.1705ZM9.6005 4.17515C9.2949 4.17515 9.02552 3.95558 8.97119 3.64545C8.94629 3.5051 8.93497 3.36249 8.93497 3.22214C8.93497 1.87524 10.0306 0.777344 11.3798 0.777344C12.7289 0.777344 13.8246 1.87297 13.8246 3.22214C13.8246 3.36249 13.811 3.5051 13.7883 3.64545C13.7272 3.98953 13.4012 4.22269 13.0549 4.1661L11.7691 3.95784C11.5111 3.91483 11.2485 3.91483 10.9881 3.95784L9.70236 4.1661C9.66841 4.17289 9.63445 4.17515 9.6005 4.17515ZM11.3775 2.64716C11.5767 2.64716 11.7759 2.663 11.9729 2.6947L12.4528 2.77166C12.2762 2.35288 11.8619 2.05633 11.3775 2.05633C10.8931 2.05633 10.4788 2.35288 10.3022 2.77166L10.7821 2.6947C10.9814 2.663 11.1806 2.64716 11.3775 2.64716ZM14.6983 20.3198H8.33056C7.93215 20.3198 7.60618 19.9939 7.60618 19.5955C7.60618 19.1971 7.93215 18.8711 8.33056 18.8711H14.6983C15.0968 18.8711 15.4227 19.1971 15.4227 19.5955C15.4227 19.9939 15.0968 20.3198 14.6983 20.3198Z" fill="%23ffffff"/><circle cx="16.5" cy="4.5" r="2.5" fill="%23E8503A"/></svg>');
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
}
.custom-lock-small-icon {
  width: 0.32rem;
  height: 0.32rem;
  background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><path d="M13.4307 12.8131H3.50661C3.22179 12.8131 2.95674 12.6715 2.79704 12.4361C2.63735 12.199 2.60607 11.9011 2.71308 11.636L3.52307 9.63571V6.59659C3.52307 5.95617 3.64984 5.33386 3.90008 4.74612C4.14044 4.17979 4.48453 3.67107 4.92245 3.23315C5.36037 2.79522 5.86909 2.45114 6.43542 2.21078C7.02316 1.96054 7.64547 1.83377 8.28589 1.83377H8.29742C8.93784 1.83377 9.56015 1.96054 10.1479 2.21078C10.7142 2.45114 11.2229 2.79522 11.6609 3.23315C12.0988 3.67107 12.4429 4.17979 12.6832 4.74612C12.9335 5.33386 13.0602 5.95617 13.0602 6.59659V9.59784L14.1715 11.5306C14.3263 11.799 14.3246 12.1184 14.1699 12.3867C14.0168 12.6534 13.7385 12.8131 13.4307 12.8131ZM3.79965 11.7595H13.0882L12.0066 9.87936V6.59659C12.0066 5.61044 11.6197 4.68027 10.9167 3.97729C10.2137 3.27431 9.28357 2.88742 8.29742 2.88742H8.28589C7.29974 2.88742 6.36957 3.27431 5.66659 3.97729C4.96361 4.68027 4.57672 5.61044 4.57672 6.59659V9.8415L3.79965 11.7595ZM6.982 3.03559C6.75975 3.03559 6.56384 2.87589 6.52432 2.65035C6.50621 2.54828 6.49798 2.44456 6.49798 2.34249C6.49798 1.36292 7.2948 0.564453 8.27601 0.564453C9.25723 0.564453 10.054 1.36127 10.054 2.34249C10.054 2.44456 10.0442 2.54828 10.0277 2.65035C9.98325 2.90059 9.74618 3.07016 9.4943 3.029L8.55918 2.87754C8.3715 2.84626 8.18053 2.84626 7.9912 2.87754L7.05609 3.029C7.03139 3.03394 7.0067 3.03559 6.982 3.03559ZM8.27437 1.92432C8.41924 1.92432 8.56412 1.93584 8.70735 1.95889L9.05637 2.01487C8.92796 1.7103 8.62668 1.49463 8.27437 1.49463C7.92205 1.49463 7.62078 1.7103 7.49236 2.01487L7.84138 1.95889C7.98626 1.93584 8.13114 1.92432 8.27437 1.92432ZM10.6895 14.7772H6.05841C5.76866 14.7772 5.53159 14.5401 5.53159 14.2504C5.53159 13.9606 5.76866 13.7235 6.05841 13.7235H10.6895C10.9793 13.7235 11.2164 13.9606 11.2164 14.2504C11.2164 14.5401 10.9793 14.7772 10.6895 14.7772Z" fill="%23014CFA"/></svg>');
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
}
.custom-heart-icon {
  width: 0.24rem;
  height: 0.28rem;
  background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 12 14"><path d="M4.49621 13.9937C4.49621 13.9937 -1.73347 12.5172 0.936838 5.875C1.24621 6.15938 1.43371 6.65625 1.57903 6.94531C1.91496 3.4625 4.5259 3.12344 4.1509 0C5.16028 0.359375 8.34309 1.41875 8.8384 5.31719C9.3134 4.42812 10.0447 3.95469 10.5993 3.86094C10.4603 4.56094 10.6868 5.76719 11.1931 7.00156C11.9743 8.9125 12.0243 12.7156 8.08684 13.7016C8.68059 12.3188 8.91809 10.0766 5.9509 8.17656C5.4259 10.5797 2.7759 11.2188 4.49621 13.9937Z" fill="%23E53E00"/></svg>');
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
}
.custom-star-icon-small {
  width: 0.24rem;
  height: 0.24rem;
  background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 12 12"><g clip-path="url(%23clip0_59_43813)"><path d="M11.9889 4.61328C11.9644 4.53776 11.9194 4.47055 11.8589 4.41914C11.7984 4.36772 11.7248 4.33414 11.6463 4.32213L7.99848 3.79979L6.37149 0.503005C6.33298 0.437284 6.27794 0.382781 6.21184 0.344908C6.14575 0.307035 6.0709 0.287109 5.99472 0.287109C5.91854 0.287109 5.84369 0.307035 5.7776 0.344908C5.7115 0.382781 5.65646 0.437284 5.61794 0.503005L3.99096 3.79979L0.360222 4.28788C0.281751 4.29989 0.208162 4.33347 0.147676 4.38488C0.0871903 4.4363 0.042189 4.50351 0.0176991 4.57902C-0.00448461 4.65376 -0.00584077 4.73314 0.0137769 4.80859C0.0333946 4.88405 0.0732414 4.95271 0.129019 5.00718L2.75788 7.5761L2.13278 11.224C2.12088 11.3016 2.13057 11.381 2.16077 11.4535C2.19098 11.526 2.24054 11.5888 2.30404 11.635C2.37629 11.6869 2.46343 11.7139 2.55237 11.7121C2.61848 11.711 2.68327 11.6933 2.74075 11.6607L5.99472 9.94807L9.24868 11.6607C9.31376 11.7027 9.38958 11.7251 9.46704 11.7251C9.54451 11.7251 9.62033 11.7027 9.6854 11.6607C9.7489 11.6145 9.79846 11.5517 9.82867 11.4792C9.85887 11.4067 9.86856 11.3273 9.85666 11.2497L9.23156 7.62748L11.8604 5.05856C11.9223 5.00449 11.9673 4.93375 11.9901 4.8548C12.0129 4.77584 12.0124 4.692 11.9889 4.61328Z" fill="%23014CFA"/></g><defs><clipPath id="clip0_59_43813"><rect width="12" height="12" fill="white"/></clipPath></defs></svg>');
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
}
</style>

<!-- 搜索页 -->
<template>
  <div class="page page_search">
    <Top :title="'搜索'" :searchText="search" />
    <!-- 搜索框 -->
    <div class="search_box">
      <div class="icon">
        <!-- <img src="/static/img/common/search.png" alt="🔍" /> -->
        <Iconfonts :name="'icon-sousuo'" :size="0.32" :color="'#666D80'" />

      </div>
      <input
        ref="iptRef"
        @keydown="keydown"
        @keydown.enter="keydownEnter"
        placeholder="搜索"
        type="text"
        enterkeyhint="search"
        v-model.trim="search"
        class="search"
      />

      <div class="type_select" @click="closeSearch" v-show="search.length > 0">
        <div class="type_icon">
          <!-- <img src="/static/img/market/close.svg" alt="img" /> -->
          <div class="closeIcon"></div>
        </div>
      </div>
    </div>
    <!-- 结果列表 -->
    <div v-show="marketSearchTextList.length > 0 && !search.length > 0">
      <div class="flex justify-between items-center mb-4">
        <div class="text-[0.32rem]">搜索历史</div>
        <div class="w-[0.4rem] h-[0.4rem]" @click="clearSearchHistory">
          <!-- <img src="/static/img/market/clear.svg" alt="img" /> -->
          <div class="clearIcon"></div>
        </div>
      </div>
      <div class="flex gap-[0.2rem] mb-4 flex-wrap">
        <div
          class="text-[0.28rem] h-[0.6rem] px-[0.16rem] bg-[#F5F7FC] rounded-[0.32rem] items-center flex"
          v-for="(item, i) in marketSearchTextList"
          :key="i"
          @click="handleHistory(item)"
        >
          {{ item }}
        </div>
      </div>
    </div>

    <div
      class="flex justify-between items-center mb-4"
      v-show="!search.length > 0"
    >
      <div class="text-[0.32rem]">热搜推荐</div>
      <div class="w-[0.4rem] h-[0.4rem]" @click="resetData">
        <!-- <img
          v-if="!marketSearchTextList.length > 0"
          src="/static/img/market/vector.svg"
        />
        <img v-else src="/static/img/market/vector_b.svg" /> -->
        <div
          :class="!marketSearchTextList.length > 0 ? 'vector_b' : 'vector'"
        ></div>
      </div>
    </div>
    <div class="list">
      <Loading v-show="!searchList.length && loading" />
      <NoData v-if="!searchList.length && !loading" />
      <div
        class="item"
        v-for="(item, i) in searchList"
        :key="i"
        @click="goItem(item)"
      >
        <div class="info">
          <div class="title flex items-center gap-1">
            {{ item.symbol || "--" }}
            <div
              :class="`${
                marketStyle[item.type]
              } font-normal text-[0.22rem] flex items-center justify-center rounded-[0.08rem] w-[0.6rem] h-[0.3rem] `"
            >
              {{ market[item.type] }}
            </div>
          </div>

          <!-- 给了定值，需要用后端数据该代码 -->
          <div class="text">超2万人搜索</div>
        </div>
        <div @click.stop="collect(item)">
          <div :class="item.watchlist == 1 ? 'star': 'unstar'"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import Top from "@/components/Top";
import {
  Icon,
  showToast,
  showLoadingToast,
  closeToast,
  ActionSheet,
} from "vant";
import { ref, computed, onMounted, onBeforeUnmount } from "vue";
import { _search } from "@/api/api";
import Loading from "@/components/Loaidng.vue";
import store from "@/store";
import router from "@/router";
import { _add, _del } from "@/api/api";
import NoData from "@/components/NoData.vue";
import eventBus from "@/utils/eventBus";
import Iconfonts from '@/components/Iconfonts.vue'

const market = {
  stock: "股票",
  crypto: "合约",
  forex: "外汇",
};
const marketStyle = {
  stock: "text-[#014CFA] bg-[rgba(1,76,250,0.1)] ",
  crypto: "text-[#FFAF2A] bg-[rgba(255,175,42,0.1)] ",
  forex: "text-[#18B762] bg-[rgba(24,183,98,0.1)] ",
};
onBeforeUnmount(() => {
  eventBus.off("loginSuccess");
});

const iptRef = ref();
const search = ref("");
const loading = ref(false);
const token = computed(() => store.state.token);

// 搜索相关
const searchList = computed(() => store.state.marketSearchList);

console.log('search list =======> ', searchList)

const marketSearchTextList = computed(() => store.state.marketSearchTextList);
const handleHistory = (data) => {
  search.value = data;
  resetData();
};
const closeSearch = () => {
  search.value = "";
  resetData();
};
const clearSearchHistory = () => {
  store.commit("setMarketSearchTextList", []);
};
const getData = () => {
  // 获取数据
  loading.value = true;
  _search({
    // market: currAs.value == 'stock' ? 'stock' : '', // currAs.value
    symbol: search.value,
    // page: 1,
  })
    .then((res) => {
      store.commit("setMarketSearch", {
        search: search.value,
        list: res.data || [],
      });
    })
    .finally(() => {
      loading.value = false;
    });
};
const resetData = () => {
  // 搜索
  store.commit("setMarketSearch", {
    search: "",
  });
  getData();
};
let timeout = null;
const keydown = () => {
  // 输入事件监听
  setTimeout(() => {
    if (timeout) clearTimeout(timeout);
    // if (!search.value) return
    timeout = setTimeout(() => {
      resetData();
    }, 500);
  }, 0);
};
const keydownEnter = () => {
  resetData();
};

if (!searchList.value.length) {
  // 初始化如果没有内容就触发搜索
  getData();
}

onMounted(() => {
  // 进入页面聚焦
  search.value = "";
  resetData();
  setTimeout(() => {
    iptRef.value.focus();
  }, 500);
});

// 查看详情
const goItem = (item) => {
  var prevList = [...marketSearchTextList.value];
  var flag = false;
  prevList.map((list) => {
    if (list.toUpperCase() == item.symbol.toUpperCase()) flag = true;
  });
  var newList = flag ? prevList : [...prevList, item.symbol];

  store.commit("setMarketSearchTextList", newList);
  store.commit("setCurrStock", item);
  setTimeout(() => {
    router.push({
      name: "market_info",
      query: {
        symbol: item.symbol,
        type: "stock",
      },
    });
  }, 100);
};

// 收藏
const collectLoading = ref(false);
const reqMap = {
  0: _add,
  1: _del,
};
const collect = (item) => {
  if (!token.value) {
    store.commit("setIsLoginOpen", true);
    eventBus.on("loginSuccess", () => {
      getData();
      eventBus.off("loginSuccess");
    });
    // router.push({
    //     name: 'login',
    //     query: {
    //         reurl: 'search'
    //     }
    // })
  } else {
    if (collectLoading.value) return;
    collectLoading.value = true;
    if (!reqMap[item.watchlist || 0]) return (collectLoading.value = false);
    showLoadingToast({
      duration: 0,
      loadingType: "spinner",
    });
    reqMap[item.watchlist || 0]({
      symbol: item.symbol,
    })
      .then((res) => {
        if (res.code == 200) {
          setTimeout(() => {
            showToast(item.watchlist ? "添加成功" : "移除成功");
          }, 300);
          const i = searchList.value.find((a) => a.symbol == item.symbol);
          if (i) {
            i.watchlist = i.watchlist == 1 ? 0 : 1;
            store.commit("setMarketSearch", {
              search: search.value,
              list: searchList.value,
            });
          }
        }
      })
      .finally(() => {
        closeToast();
        collectLoading.value = false;
      });
  }
};

Promise.all([import("@/views/Market/MarketInfo.vue")]);
</script>

<style lang="less" scoped>
.page_search {
  padding: 1.32rem 0.32rem 0.24rem 0.32rem;
  display: flex;
  flex-direction: column;
  overflow: hidden;

  .search_box {
    display: flex;
    align-items: center;
    padding: 0 0.4rem;
    margin-bottom: 0.4rem;
    height: 0.8rem;
    background-color: #f4f5f7;
    border-radius: 0.4rem;

    .type_select {
      right: 0;
      display: flex;
      align-items: center;
      color: #253146;
      font-size: 0.24rem;

      .type_icon {
        width: 0.32rem;
        height: 0.32rem;
        opacity: 0.8;
        margin-left: 0.06rem;
      }
    }

    &:has(.search:focus) {
      border: 1px solid #014cfa;
    }

    .icon {
      width: 0.4rem;
      height: 0.4rem;
    }

    .close {
      width: 0.24rem;
      height: 0.24rem;
      color: #121826;
    }

    .search {
      flex: 1;
      margin: 0 0.16rem;
      font-size: 0.32rem;
      font-weight: 400;
    }
  }
  /* Star_light */

  .list {
    flex: 1;
    overflow-y: auto;

    .item {
      height: 1.12rem;
      display: flex;
      align-items: center;
      background-color: #f4f5f7;
      margin-bottom: 0.2rem;
      border-radius: 0.3rem;
      padding-inline: 0.26rem;

      .info {
        flex: 1;
        overflow: hidden;

        .title {
          color: #061023;
          font-size: 0.32rem;
        }

        .text {
          color: #8f92a1;
          font-size: 0.24rem;
          font-weight: 400;
          margin-top: 0.18rem;
        }
      }

      .star {
        width: 0.4rem;
        height: 0.36rem;
        margin-left: 0.2rem;
        background-image: url('data:image/svg+xml;charset=UTF-8,%3Csvg width="18" height="17" viewBox="0 0 18 17" fill="none" xmlns="http://www.w3.org/2000/svg"%3E%3Cpath fill-rule="evenodd" clip-rule="evenodd" d="M10.5184 3.03281C10.9628 4.14068 11.185 4.69462 11.6379 5.0313C12.0907 5.368 12.6852 5.42124 13.8741 5.52771L14.089 5.54696C16.0349 5.72122 17.0078 5.80835 17.2159 6.42734C17.4241 7.04632 16.7016 7.70366 15.2565 9.01835L14.7743 9.45713C14.0428 10.1226 13.677 10.4554 13.5065 10.8915C13.4747 10.9729 13.4483 11.0562 13.4274 11.141C13.3153 11.5957 13.4225 12.0784 13.6367 13.0439L13.7033 13.3444C14.097 15.1188 14.2938 16.0059 13.9502 16.3886C13.8217 16.5316 13.6548 16.6345 13.4694 16.6851C12.9732 16.8205 12.2687 16.2465 10.8598 15.0984C9.93462 14.3445 9.47203 13.9676 8.94093 13.8828C8.73202 13.8494 8.51914 13.8494 8.31023 13.8828C7.77914 13.9676 7.31655 14.3445 6.39138 15.0984C4.98243 16.2465 4.27794 16.8205 3.78175 16.6851C3.59633 16.6345 3.42943 16.5316 3.30099 16.3886C2.95732 16.0059 3.15415 15.1188 3.54782 13.3444L3.6145 13.0439C3.82871 12.0784 3.93582 11.5957 3.82375 11.141C3.80286 11.0562 3.77642 10.9729 3.74462 10.8915C3.57415 10.4554 3.20839 10.1226 2.47689 9.45713L1.99461 9.01835C0.54957 7.70366 -0.17296 7.04632 0.0352269 6.42734C0.243397 5.80835 1.21631 5.72122 3.16212 5.54696L3.37705 5.52771C4.56597 5.42124 5.16043 5.368 5.61329 5.0313C6.06613 4.69462 6.28833 4.14068 6.73272 3.03281L6.76936 2.9415C7.55596 0.980495 7.94925 0 8.62558 0C9.30191 0 9.69521 0.980495 10.4818 2.9415L10.5184 3.03281Z" fill="%232752E7"/%3E%3C/svg%3E');
        background-size: contain;
        background-repeat: no-repeat;
      }
      .unstar {
        width: 0.4rem;
        height: 0.36rem;
        background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 18" fill="none"><path d="M11.8934 3.71885C12.3378 4.82671 12.56 5.38066 13.0129 5.71734C13.4657 6.05404 14.0602 6.10727 15.2491 6.21375L15.464 6.23299C17.4099 6.40726 18.3828 6.49439 18.5909 7.11338C18.7991 7.73235 18.0766 8.3897 16.6315 9.70438L16.1493 10.1432C15.4178 10.8087 15.052 11.1414 14.8815 11.5776C14.8497 11.6589 14.8233 11.7423 14.8024 11.8271C14.6903 12.2817 14.7975 12.7645 15.0117 13.7299L15.0783 14.0305C15.472 15.8048 15.6688 16.692 15.3252 17.0746C15.1967 17.2176 15.0298 17.3206 14.8444 17.3712C14.3482 17.5066 13.6437 16.9325 12.2348 15.7844C11.3096 15.0305 10.847 14.6536 10.3159 14.5688C10.107 14.5354 9.89414 14.5354 9.68523 14.5688C9.15414 14.6536 8.69155 15.0305 7.76638 15.7844C6.35743 16.9325 5.65294 17.5066 5.15675 17.3712C4.97133 17.3206 4.80443 17.2176 4.67599 17.0746C4.33232 16.692 4.52915 15.8048 4.92282 14.0305L4.9895 13.7299C5.20371 12.7645 5.31082 12.2817 5.19875 11.8271C5.17786 11.7423 5.15142 11.6589 5.11962 11.5776C4.94915 11.1414 4.58339 10.8087 3.85189 10.1432L3.36961 9.70438C1.92457 8.3897 1.20204 7.73235 1.41023 7.11338C1.6184 6.49439 2.59131 6.40726 4.53712 6.23299L4.75205 6.21375C5.94097 6.10727 6.53543 6.05404 6.98829 5.71734C7.44113 5.38066 7.66333 4.82671 8.10772 3.71885L8.14436 3.62754C8.93096 1.66653 9.32425 0.686035 10.0006 0.686035C10.6769 0.686035 11.0702 1.66653 11.8568 3.62754L11.8934 3.71885V3.71885Z" fill="none" stroke="%23666D80" stroke-width="1.5"/></svg>');
        background-size: contain;
        background-repeat: no-repeat;
      }
    }
  }
  .vector_b {
    width: 0.4rem;
    height: 0.4rem;
    background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M3.46257 2.43262C5.21556 0.91688 7.5007 0 10 0C15.5228 0 20 4.47715 20 10C20 12.1361 19.3302 14.1158 18.1892 15.7406L15 10H18C18 5.58172 14.4183 2 10 2C7.84982 2 5.89777 2.84827 4.46023 4.22842L3.46257 2.43262ZM16.5374 17.5674C14.7844 19.0831 12.4993 20 10 20C4.47715 20 0 15.5228 0 10C0 7.86386 0.66979 5.88416 1.8108 4.25944L5 10H2C2 14.4183 5.58172 18 10 18C12.1502 18 14.1022 17.1517 15.5398 15.7716L16.5374 17.5674Z" fill="%23014CFA"/></svg>');
    background-size: cover;
  }
  .vector {
    width: 0.4rem;
    height: 0.4rem;
    background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="none"><path d="M10 17.96C5.61004 17.96 2.04004 14.39 2.04004 10C2.04004 9.83004 2.05004 9.66004 2.06004 9.49004L3.46004 9.58004C3.45004 9.72004 3.45004 9.86004 3.45004 10C3.45004 13.62 6.39004 16.56 10.01 16.56C11.7 16.56 13.3 15.92 14.52 14.76L15.48 15.78C13.99 17.19 12.05 17.96 10 17.96ZM17.96 10H16.56C16.56 9.77004 16.55 9.54004 16.52 9.31004C16.17 5.96004 13.37 3.44004 9.99004 3.44004C8.67004 3.44004 7.41004 3.83004 6.32004 4.56004L5.55004 3.40004C6.86004 2.51004 8.40004 2.04004 10 2.04004C14.09 2.04004 17.5 5.10004 17.92 9.17004C17.95 9.44004 17.96 9.72004 17.96 10Z" fill="%238F92A1"/><path d="M2.73983 5.68L0.54983 9.6C0.48983 9.7 0.56983 9.83 0.67983 9.83H5.04983C5.16983 9.83 5.23983 9.71 5.17983 9.6L2.99983 5.68C2.93983 5.57 2.78983 5.57 2.73983 5.68ZM16.9998 13.2L14.8098 9.28C14.7498 9.18 14.8298 9.05 14.9398 9.05H19.3098C19.4298 9.05 19.4998 9.17 19.4398 9.28L17.2598 13.2C17.2098 13.3 17.0598 13.3 16.9998 13.2ZM5.27983 3.95C5.27983 4.13565 5.35358 4.3137 5.48486 4.44497C5.61613 4.57625 5.79418 4.65 5.97983 4.65C6.16548 4.65 6.34353 4.57625 6.47481 4.44497C6.60608 4.3137 6.67983 4.13565 6.67983 3.95C6.67983 3.76435 6.60608 3.5863 6.47481 3.45503C6.34353 3.32375 6.16548 3.25 5.97983 3.25C5.79418 3.25 5.61613 3.32375 5.48486 3.45503C5.35358 3.5863 5.27983 3.76435 5.27983 3.95ZM14.2298 15.33C14.2298 15.5157 14.3036 15.6937 14.4349 15.825C14.5661 15.9563 14.7442 16.03 14.9298 16.03C15.1155 16.03 15.2935 15.9563 15.4248 15.825C15.5561 15.6937 15.6298 15.5157 15.6298 15.33C15.6298 15.1443 15.5561 14.9663 15.4248 14.835C15.2935 14.7038 15.1155 14.63 14.9298 14.63C14.7442 14.63 14.5661 14.7038 14.4349 14.835C14.3036 14.9663 14.2298 15.1443 14.2298 15.33Z" fill="%238F92A1"/></svg>');
    background-size: contain;
    background-repeat: no-repeat;
  }
  .clearIcon {
    width: 0.4rem;
    height: 0.4rem;
    background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 18 18" fill="none"><path d="M17.0276 6.2172L13.9791 4.66798L15.6865 1.28376C15.8013 1.1662 15.866 1.00867 15.867 0.844341C15.868 0.680009 15.8052 0.521697 15.6919 0.40274C15.5748 0.286448 15.4172 0.220012 15.2522 0.217367C15.0872 0.214722 14.9275 0.276073 14.8068 0.388552L12.9164 4.12951L10.2882 2.79987C10.0064 2.65799 9.7416 2.58637 9.50175 2.58637C9.06732 2.58637 8.78423 2.81338 8.66194 3.02823L8.63965 3.07147C6.70735 7.33063 1.13004 9.67709 1.07193 9.70141C0.828709 9.80884 0.657099 9.99936 0.588185 10.2372C0.475355 10.627 0.688854 10.9756 0.732769 11.0419L0.801008 11.1446L10.9861 17.4522C11.3442 17.6725 11.6496 17.7799 11.9185 17.7799C12.1752 17.7799 12.334 17.6813 12.4076 17.6198L12.436 17.5948C16.1189 14.0869 17.3046 8.92985 17.4208 7.74074C17.5194 6.72054 17.2195 6.3503 17.0276 6.2172ZM16.2986 7.62926C16.2979 7.63737 16.183 8.49677 15.7871 9.78924C13.9474 8.88525 9.74565 6.46177 8.36737 5.66183C8.8379 5.06367 9.24332 4.41704 9.57675 3.73291C9.62269 3.7444 9.69092 3.76804 9.78349 3.81399C10.3652 4.10721 14.7453 6.32597 16.0763 7.00025L16.2952 7.11105C16.3107 7.19551 16.3249 7.35631 16.2986 7.62926ZM11.1679 13.3741C11.2865 13.2572 11.3545 13.0984 11.3572 12.9318C11.3598 12.7652 11.2969 12.6043 11.182 12.4836C11.0649 12.3674 10.9074 12.3009 10.7424 12.2983C10.5774 12.2956 10.4177 12.357 10.297 12.4695L8.34102 14.3747C8.31885 14.3962 8.29851 14.4195 8.28021 14.4443L5.30272 12.6005L7.30461 11.2283C7.44174 11.1336 7.53596 10.9885 7.56683 10.8247C7.59769 10.6609 7.5627 10.4916 7.46946 10.3534C7.42326 10.2854 7.36411 10.2272 7.29539 10.1821C7.22668 10.1369 7.14975 10.1058 7.069 10.0904C6.98824 10.0751 6.90525 10.0758 6.82477 10.0925C6.74428 10.1092 6.66788 10.1416 6.59993 10.1879L4.34941 11.7303C4.2822 11.7768 4.225 11.8363 4.18118 11.9053L1.97525 10.5399C3.08733 10.021 5.59797 8.69878 7.6181 6.53677C9.03962 7.36374 13.513 9.94937 15.4203 10.8702C14.8216 12.4728 13.7177 14.7443 11.8225 16.6144C11.7369 16.5783 11.6545 16.5351 11.5759 16.4854L9.37338 15.1213L11.1679 13.3741Z" fill="%238F92A1"/></svg>');
    background-size: contain;
    background-repeat: no-repeat;
  }
  .closeIcon {
    width: 0.32rem;
    height: 0.32rem;
    background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 0.32rem 0.32rem" fill="none"><circle cx="8" cy="8" r="8" fill="%23A4ACB9"/><path d="M7.99997 7.46422L5.52417 4.98598L5.52441 4.98574L5.51759 4.97987C5.4456 4.91786 5.35287 4.88531 5.25791 4.88875C5.16296 4.89219 5.07282 4.93138 5.00551 4.99844C4.93821 5.06549 4.89868 5.15548 4.89479 5.25041C4.8909 5.34534 4.92295 5.43826 4.98454 5.5106L4.98427 5.51083L4.99084 5.51744L7.46704 8.00603L4.99153 10.4757C4.99146 10.4758 4.99139 10.4758 4.99131 10.4759C4.95608 10.5108 4.9281 10.5523 4.909 10.5981C4.88986 10.644 4.88 10.6932 4.88 10.7429C4.88 10.7926 4.88986 10.8418 4.909 10.8876C4.92809 10.9334 4.95605 10.9749 4.99126 11.0098C5.06194 11.0804 5.15771 11.12 5.25759 11.12C5.35756 11.12 5.45342 11.0803 5.52412 11.0096L5.52417 11.0095L8.00003 8.53125L10.4759 11.0079L10.4759 11.0079C10.5466 11.0786 10.6424 11.1183 10.7424 11.1183C10.8424 11.1183 10.9382 11.0786 11.0089 11.0079L10.9241 10.923M7.99997 7.46422L8.08484 8.44636L10.5607 10.923C10.6089 10.9712 10.6743 10.9983 10.7424 10.9983C10.8105 10.9983 10.8759 10.9712 10.9241 10.923M7.99997 7.46422L10.4758 4.98429L10.4788 4.98126L10.4789 4.98132C10.5504 4.91465 10.6449 4.87833 10.7427 4.88006C10.8404 4.88178 10.9336 4.92142 11.0027 4.99057C11.0718 5.05971 11.1113 5.15298 11.113 5.2507C11.1148 5.34842 11.0785 5.44302 11.0119 5.51456L11.0092 5.51749L11.0092 5.51744L8.53299 8.006L11.0085 10.474M7.99997 7.46422L11.0085 10.474M10.9241 10.923C10.9481 10.8992 10.9672 10.8709 10.9803 10.8397C10.9933 10.8085 11 10.775 11 10.7412C11 10.7073 10.9933 10.6738 10.9803 10.6426C10.9672 10.6114 10.9481 10.5831 10.9241 10.5593M10.9241 10.923L11.0085 11.0083C11.0438 10.9734 11.0719 10.9318 11.091 10.8859C11.1101 10.8401 11.12 10.7909 11.12 10.7412C11.12 10.6915 11.1101 10.6422 11.091 10.5964C11.0719 10.5506 11.0439 10.5091 11.0087 10.4742L11.0088 10.4743L10.9241 10.5593M10.9241 10.5593L11.0085 10.474M10.9241 10.5593L11.0085 10.474M5.43928 10.9247L7.91519 8.44638L7.63663 8.00634L5.07591 10.561C5.05186 10.5848 5.03277 10.6131 5.01974 10.6443C5.00671 10.6755 5 10.709 5 10.7429C5 10.7767 5.00671 10.8102 5.01974 10.8414C5.03277 10.8726 5.05186 10.901 5.07591 10.9247C5.12411 10.9729 5.18946 11 5.25759 11C5.32572 11 5.39107 10.9729 5.43928 10.9247Z" fill="%23161616" stroke="%23161616" stroke-width="0.24"/></svg>');
    background-size: contain;
    background-repeat: no-repeat;
  }
}
</style>

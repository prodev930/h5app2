<!-- 股票 -->
<template>
  <div class="market_stock_list">
    <!-- Tabs -->
    <Tabs
      v-if="!pageLoading"
      class="tabs"
      @change="changeTab"
      v-model:active="active"
      :swipeable="false"
      animated
      shrink
    >
      <Tab :title="'涨幅榜'">
        <!-- <StockTable :key="'down'" :loading="loading" :list="marketDownList" :marketType="'stock'" /> -->
        <StockTableForList
          v-if="marketDownList.length"
          :loading="loading"
          :list="marketDownList"
        />
        <LoadingMore
          :classN="'stock_soft_more2'"
          ref="more_3"
          class="active_more"
          :loading="!!(marketDownList.length && loading)"
          :finish="finish"
          v-if="((finish && marketDownList.length) || !finish) && active == 2"
        />
      </Tab>
      <Tab :title="'跌幅榜'">
        <StockTableForList
          :key="'up'"
          :loading="loading"
          :list="marketUpList"
        />
        <LoadingMore
          :classN="'stock_soft_more1'"
          ref="more_2"
          class="active_more"
          :loading="!!(marketUpList.length && loading)"
          :finish="finish"
          v-if="((finish && marketUpList.length) || !finish) && active == 1"
        />
      </Tab>
    </Tabs>

    <!-- 类型选择弹窗 -->
    <Teleport to="body">
      <ActionSheet
        v-model:show="showAS"
        :actions="actions"
        @select="onSelect"
        title="交易所"
      ></ActionSheet>
    </Teleport>
  </div>
</template>

<script setup>
import { Tab, Tabs, ActionSheet } from "vant";
import StockTableForList from "@/components/StockTableForList.vue";
import { ref, computed, onMounted, onBeforeUnmount } from "vue";
import { _sort } from "@/api/api";
import store from "@/store";
import Recommend from "@/views/Home/components/Recommend.vue";
import Loading from "@/components/Loaidng.vue";
import LoadingMore from "@/components/LoadingMore.vue";

const loading = ref(false);
const finish = ref(false);
const page = ref(0);

const showAS = ref(false);
const currAs = ref("");
const actionsMap = ref([]);
const actions = computed(() => {
  return actionsMap.value.map((item) => {
    return {
      name: item,
      value: item,
      className: currAs.value == item ? "action-sheet-active" : "",
    };
  });
});
const onSelect = (item) => {
  showAS.value = false;
  currAs.value = item.value;
  count.value = 0;
  setTimeout(() => {
    store.commit("setMarketVolumeList", []);
    store.commit("setMarketUpList", []);
    store.commit("setMarketDownList", []);
  }, 340);
  setTimeout(() => {
    getOverviewData();
    changeTab(active.value);
  }, 0);
};

// tabs
const active = ref(-1);
const changeTab = (key) => {
  page.value = 0;
  loading.value = false;
  finish.value = false;
  setTimeout(() => {
    // 加载更多元素
    switch (key) {
      case 0:
        getData(
          marketVolumeList,
          "setMarketVolumeList",
          "volume",
          "marketVolumeList"
        );
        break;
      case 1:
        getData(marketUpList, "setMarketUpList", "up", "marketUpList");
        break;
      case 2:
        getData(marketDownList, "setMarketDownList", "down", "marketDownList");
        break;
    }
    target = document.querySelector(".stock_soft_more" + key);
  }, 350);
};
// const readyRecommendData = () => {
//   // 推荐数据准备好了，一起监听
//   changeTab(active.value);
// };

// 获取列表数据
const marketVolumeList = computed(() => store.state.marketVolumeList || []); // 活跃列表
const marketUpList = computed(() => store.state.marketUpList || []); // 涨幅列表
const marketDownList = computed(() => store.state.marketDownList || []); // 跌幅列表
const subs = (listKey, key) => {
  // 订阅ws
  store.dispatch("subList", {
    commitKey: key,
    listKey: listKey,
    // proxyListValue: list.value
  });
};
const getData = (list, key, query, listKey) => {
  if (loading.value || finish.value) return;
  loading.value = true;
  page.value++;
  let arr = JSON.parse(JSON.stringify(list.value));
  if (page.value == 1) {
    arr = [];
  }
  if (arr.length) {
    subs(listKey, key);
  }
  const saveActive = active.value;
  _sort({
    exchange: currAs.value.includes(",") ? "" : currAs.value,
    orderby: query,
    page: page.value,
  })
    .then((res) => {
      if (res.code == 200) {
        if (saveActive != active.value) return;
        if (!res.data.length) {
          finish.value = true;
        }
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
          subs(listKey, key);
          scrollHandler();
        }, 500);
      }
    })
    .finally(() => {
      setTimeout(() => {
        loading.value = false;
      }, 300);
    });
};

// 滚动监听
const more_1 = ref();
const more_2 = ref();
const more_3 = ref();
const totalHeight = window.innerHeight || document.documentElement.clientHeight;
let target = null;
const scrollHandler = () => {
  if (!target) return;
  const rect = target.getBoundingClientRect();
  if (rect.top <= totalHeight) {
    // 加载更多
    switch (active.value) {
      case 0:
        getData(
          marketVolumeList,
          "setMarketVolumeList",
          "volume",
          "marketVolumeList"
        );
        break;
      case 1:
        getData(marketUpList, "setMarketUpList", "up", "marketUpList");
        break;
      case 2:
        getData(marketDownList, "setMarketDownList", "down", "marketDownList");
        break;
    }
  }
};

const pageLoading = ref(true);
onMounted(() => {
  setTimeout(() => {
    pageLoading.value = false;
  }, 300);
  setTimeout(() => {
    try {
      document.querySelector(".page").addEventListener("scroll", scrollHandler);
      target = document.querySelector(".stock_soft_more" + active.value);
    } catch {}
  }, 500);
});
onBeforeUnmount(() => {
  try {
    document
      .querySelector(".page")
      .removeEventListener("scroll", scrollHandler);
  } catch {}
});
</script>

<style lang="less" scoped>
.market_stock_list {
  :deep(.van-tabs) {
    .van-tabs__wrap {
        margin: 0 !important;
        height: 1rem !important;
      .van-tabs__nav {
        padding: 0 0.32rem;

        .van-tab {
            padding-right: 0.6rem;
            font-size: 0.32rem;
            color: #8f92a1;
        }

        .van-tab--active {
            font-size: 0.36rem !important;
            font-weight: 600 !important;
            color: #014cfa !important;
        }

        .van-tabs__line {
            bottom: 0;
            margin-left: -0.3rem;
            width: 0.8rem;
            height: 0.06rem;
        }
      }
    }
  }
}
</style>

<!-- 股票 -->
<template>
  <div class="market_stock_block">
    <Tabs
      v-if="!pageLoading"
      type="custom-card"
      v-model:active="active"
      :swipeable="false"
      animated
      :color="'#014CFA'"
      shrink
      @change="onChange"
    >
      <Tab title="美国" name="0">
        <div class="stock_tab-body">
          <StockDescription :region="'us'" :data="currentData" @update="getData(currentData.region)" />
        </div>
      </Tab>
      <Tab title="印度" name="1">
        <div class="stock_tab-body">
          <StockDescription :region="'india'" :data="currentData" @update="getData(currentData.region)"/>
        </div>
      </Tab>
      <Tab title="日本" name="2">
        <div class="stock_tab-body">
          <StockDescription :region="'japan'" :data="currentData" @update="getData(currentData.region)"/>
        </div>
      </Tab>
      <Tab title="韩国" name="3">
        <div class="stock_tab-body">
          <StockDescription :region="'korea'" :data="currentData" @update="getData(currentData.region)"/>
        </div>
      </Tab>
    </Tabs>
  </div>
</template>

<script setup>
import { Tab, Tabs } from "vant";
import { ref, computed, onMounted, onBeforeUnmount } from "vue";
import { _recommend } from "@/api/api";
import store from "@/store";
import Loading from "@/components/Loaidng.vue";
import LoadingMore from "@/components/LoadingMore.vue";
import StockDescription from "@/components/StockDescription.vue";

const active = ref(sessionStorage.getItem("trade_stock_tab") || 0);
const currentData = computed(() => store.state.currentRecommendData);
const onChange = async (val) => {
  active.value = val;
  sessionStorage.setItem("trade_stock_tab", val);
  getData(region[val])
};

const pageLoading = ref(true);

onMounted(() => {
  setTimeout(() => {
    pageLoading.value = false;
    setTimeout(() => {
      onChange(active.value);
    }, 300);
  }, 300);
});

const region = {
  0: "us",
  1: "india",
  2: "japan",
  3: "korea",
};

const getData = (region) => {
  _recommend({
    market: region,
    type: "index",
  })
    .then((res) => {
      const data = {
        region,
        currentts: formatDate(new Date(res.data.currentts)),
        closets: formatDate(new Date(res.data.closets)),
        updated: formatDate(new Date()),
        stock: res.data.index
      }
      store.commit("setCurrentRecommenData", data)
    })
    .catch((err) => console.error(err))
    .finally(() => {
      (pageLoading.value = false)
    });
};

function formatDate(date) {
    const year = String(date.getFullYear()).slice(-2);
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');

    return `${month}/${day} ${hours}:${minutes}:${seconds}`;
}

</script>

<style lang="less" scoped>
.market_stock_block {
  height: 4.38rem;
  border-radius: 0.64rem;
  background-image: linear-gradient(to bottom, #ffffff, #f5f7fc);

  :deep(.van-tabs__nav) {
    width: 100%;
  }
  .van-tabs {
    :deep(.van-tabs__wrap) {
      padding: 0 0.32rem !important;

      .van-tabs__nav {
        position: relative;
        display: flex;
        justify-content: space-between;

        .van-tab {
          flex: 1;
          text-align: center;
          padding-right: 0;
          font-size: 0.32rem;
          line-height: 0.5rem;
        }
      }
    }
  }
}
</style>

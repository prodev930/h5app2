<!-- 自选 -->
<template>
  <div class="stock_hot">
    <Loaidng
      v-if="
        !marketSrockRecommendList.length &&
        !marketContractRecommendList.length &&
        recommendLoading
      "
      :loading="recommendLoading"
      :type="'spinner'"
    />
    <NoData
      v-if="
        !marketSrockRecommendList.length &&
        !marketContractRecommendList.length &&
        !loading &&
        !recommendLoading
      "
    />

    <div class="recommend_block">
      <div class="item_block" v-if="marketSrockRecommendList.length">
        <div class="item_block_title flex justify-between">
          <div>热门股</div>
          <div class="re_render" @click.stop="update"></div>
        </div>
        <StockRecommendList
          :key="'stock'"
          :keyStr="'stock'"
          :loading="recommendLoading"
          @change="changeStockList"
          @init="init"
          :list="marketSrockRecommendList"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import Loaidng from "@/components/Loaidng.vue";
import NoData from "@/components/NoData.vue";
// import StockTable from "@/components/StockTable.vue";
import StockRecommendList from "@/components/StockRecommendList.vue";
import OptionCategory from "@/components/OptionCategory.vue";
import router from "@/router";
import store from "@/store";
import { computed, onMounted, ref, watch } from "vue";
import { _watchlistDefault } from "@/api/api";
import {
  showLoadingToast,
  closeToast,
  showToast,
  Tabs,
  Tab,
  Button,
} from "vant";
import { useSocket } from "@/utils/ws";
const { startSocket } = useSocket();

const watchList = computed(() => store.state.marketWatchList || []);
const active = ref(0);

const token = computed(() => store.state.token || "");
const loading = ref(true);

const init = () => {
  loading.value = false;
  // 打开推荐列表
  openRecommendList();
};

const update = () => {
  openRecommendList();
}
// 推荐列表
const marketType = computed(() => store.getters.getMarketType);
const marketSrockRecommendList = computed(
  () => store.state.marketSrockRecommendList || []
);
const recommendLoading = ref(false);
const openRecommendList = () => {
  recommendLoading.value = true;
  _watchlistDefault()
    .then((res) => {
      if (res.code == 200) {
        // 股票

        if (res.data?.stock) {
          const arr = res.data.stock.map((item) => {
            const target = marketSrockRecommendList.value.find(
              (a) => a.symbol == item.symbol
            );
            return target || item;
          });
          store.commit("setMarketSrockRecommendList", arr || []);
          setTimeout(() => {
            store.dispatch("subList", {
              commitKey: "setMarketSrockRecommendList",
              listKey: "marketSrockRecommendList",
            });
          }, 500);
        }
      }
    })
    .finally(() => {
      recommendLoading.value = false;
    });
};
// 推荐股票选择
const stockList = ref([]);
const changeStockList = (arr) => {
};

// 添加自选
const addLoading = ref(false);

defineExpose({
  init,
});

// 移除收藏
const removeLoading = ref(false);

const jump = (name) => {
  router.push({
    name,
  });
};
</script>

<style lang="less" scoped>
.recommend_block {
  padding: 0.32rem 0.32rem;

  .item_block {
    .item_block_title {
      font-size: 0.32rem;
      font-weight: 600;
      line-height: 0.36rem;
      margin-bottom: 0.36rem;

      .re_render {
        width: 0.32rem;
        height: 0.32rem;
        margin-left: 0.12rem;
        background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 12 12"><path d="M11.25 4.87489V2.24989L10.3939 3.10601C9.91589 2.38181 9.26575 1.78747 8.50169 1.37622C7.73762 0.96496 6.88347 0.74963 6.01576 0.749512C3.11626 0.749512 0.765381 3.10001 0.765381 5.99989C0.765381 8.89976 3.11626 11.2503 6.01576 11.2503C7.06067 11.2505 8.08189 10.9389 8.94873 10.3554C9.81558 9.77198 10.4886 8.94315 10.8818 7.97501C10.9267 7.86447 10.9258 7.74061 10.8794 7.63069C10.833 7.52077 10.7448 7.43379 10.6343 7.38889C10.5795 7.36665 10.5209 7.35542 10.4619 7.35582C10.4028 7.35623 10.3444 7.36826 10.2899 7.39125C10.18 7.43766 10.093 7.52584 10.0481 7.63639C9.72223 8.43857 9.16445 9.1253 8.44613 9.60874C7.72781 10.0922 6.88161 10.3504 6.01576 10.3503C3.61313 10.3503 1.66538 8.40251 1.66538 5.99989C1.66538 3.59726 3.61313 1.64951 6.01576 1.64951C7.56788 1.64951 8.96813 2.47076 9.74251 3.75701L8.62501 4.87489H11.25Z" fill="%23014CFA"/></svg>');
        background-size: contain;
        background-repeat: no-repeat;
        background-position: center;
      }
    }
  }
}
</style>

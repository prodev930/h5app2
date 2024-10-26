<!-- 股票 -->
<template>
    <div class="total_box">
      <div class="total_title flex flex-row justify-between">
        <span class="text-[0.32rem] font-bold leading-[0.32rem] text-[#061023]">涨跌分布</span>
        <div>
            <span class="text-[0.28rem] text-[#18B762] mr-[0.28rem]">上涨：{{ up }}</span>
            <span class="text-[0.28rem] text-[#e8503a]">下跌：{{ down }}</span>
        </div>
      </div>
      <Loading
        v-if="overviewLoading && !count"
        :loading="overviewLoading"
        :type="'spinner'"
      />
      <div class="table_box" v-if="!overviewLoading || count">
        <div class="table_list">
          <div class="table_item" v-for="(key, i) in keySoft" :key="key">
            <div
              class="table_item_num"
              :class="[i == 5 ? 'item_center' : i < 5 ? 'item_green' : 'item_red']"
            >
              {{ overview[key] }}
            </div>
            <div
              class="table_item_bar"
              :style="{
                height: getHeight(key) + 'rem',
                borderTopLeftRadius: `${getHeight(key) > 0.48 ? 0.24 : getHeight(key) > 0.15 ? getHeight(key) : 0.15}rem`,
                borderTopRightRadius: `${getHeight(key) > 0.48 ? 0.24 : getHeight(key) > 0.15 ? getHeight(key) : 0.15}rem`,
                backgroundColor: bgColors[i],
              }"
            ></div>
            <div
              class="table_item_name flex flex-row justify-center align-items-center"
              :class="{ item_green: i == 0, item_red: i == 10 }"
            >
                {{ overviewTitleMap[key] }}
            </div>
          </div>
        </div>
        <div class="table_tabs flex flex-row justify-between">
            <div class="bg-custom_green w-[3.04rem] h-[0.2rem]"></div>
            <div class="bg-custom_blue w-[0.48rem]"></div>
            <div class="bg-custom_red w-[3.04rem] h-[0.2rem]"></div>
        </div>
      </div>
    </div>
</template>

<script setup>
import { Tab, Tabs } from "vant";
import { ref, computed, onMounted, onBeforeUnmount } from "vue";
import { _marketOverview } from "@/api/api";
import store from "@/store";
import Loading from "@/components/Loaidng.vue";
import LoadingMore from "@/components/LoadingMore.vue";

const loading = ref(false);
const finish = ref(false);
const page = ref(0);
const up = ref(0);
const down = ref(0);

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

// 获取总览数据
const count = ref(0);
const keySoft = ref([5, 4, 3, 2, 1, 0, "-1", "-2", "-3", "-4", "-5"]);
const bgColors = ref([
  "#18b762",
  "#18b762",
  "#18b762",
  "#18b762",
  "#18b762",
  "#7e99d6",
  "#e8503a",
  "#e8503a",
  "#e8503a",
  "#e8503a",
  "#e8503a",
]);
const overview = ref({
  5: 0,
  4: 0,
  3: 0,
  2: 0,
  1: 0,
  0: 0,
  "-1": 0,
  "-2": 0,
  "-3": 0,
  "-4": 0,
  "-5": 0,
});
try {
  const d = JSON.parse(sessionStorage.getItem("overview_data") || "{}");
  count.value = d.count || 0;
  for (let key in overview.value) {
    overview.value[key] = d[key] || 0;
  }
} catch {}
const overviewTitleMap = ref({
  5: "涨停",
  4: ">7%",
  3: "7~5％",
  2: "5~2％",
  1: "2~0％",
  0: "平",
  "-1": "0~2％",
  "-2": "2~5％",
  "-3": "5~7％",
  "-4": "7％<",
  "-5": "跌停",
});
// 获取柱状图高度
const getHeight = (key) => {
  let max = 0;
  for (let k in overview.value) {
    if (overview.value[k] > max) max = overview.value[k];
  }
  return (overview.value[key] * 3) / max; // 最高的3rem
};
const overviewLoading = ref(false);
const getOverviewData = () => {
  overviewLoading.value = true;
  _marketOverview({
    market: ""
  })
    .then((res) => {
      if (!res.data) return;
      sessionStorage.setItem("overview_data", JSON.stringify(res.data));
      count.value = res.data.count || 0;
      for (let key in overview.value) {
        overview.value[key] = res.data[key] || 0;
      }
    })
    .finally(() => {
      overviewLoading.value = false;
    });
};

const initData = () => {
  getOverviewData();
  getUpNum();
  getDownNum();
};
onMounted(() => {
  initData()
})

const getUpNum = () => {
  up.value = 0;
  for (let i = 1; i < 6; i++) {
    up.value = up.value + overview.value[i]
  }
}

const getDownNum = () => {
  down.value = 0;
  for (let i = 1; i < 6; i++) {
    down.value = down.value + overview.value[`-${i.toString()}`]
  }
}

</script>

<style lang="less" scoped>
  .total_box {
    padding: 0.48rem 0.32rem;
    position: relative;
    background-image: linear-gradient(to bottom, #ffffff, #f5f7fc);
    border-radius: 0.64rem;

    .type_box {
      position: absolute;
      top: -0.1rem;
      right: 0;
      display: flex;
      align-items: center;
      color: #253146;
      font-size: 0.24rem;
      border: 1px solid #eee;
      border-radius: 0.08rem;
      padding: 0.08rem 0.16rem;

      .type_icon {
        width: 0.28rem;
        height: 0.28rem;
        opacity: 0.8;
        margin-left: 0.06rem;
      }
    }

    .total_title {
      color: #9ea3ae;
      font-size: 0.28rem;
      margin-bottom: 0.32rem;
    }

    .table_list {
      display: flex;
      align-items: flex-end;
      justify-content: space-between;

      .table_item {
        width: 7%;
        color: #7e879c;
        font-size: 0.18rem;
        text-align: center;

        .item_red {
          color: #fc6c6b;
        }

        .item_center {
            color: #7e99d6
        }

        .item_green {
          color: #19c09a;
        }

        .table_item_num {
          font-size: 0.22rem;
          line-height: 0.308rem;
        }

        .table_item_bar {
          min-height: 0.15rem;
          background-color: #87878c;
          transition: all ease 0.3s;
        }

        .table_item_name {
            font-size: 0.22rem;
            line-height: 0.308rem;
            height: 0.36rem;
            align-items: center;
        }
      }
    }

    .table_tabs {
      height: 0.2rem;
      display: flex;
      align-items: stretch;
      border-radius: 0.1rem;
      overflow: hidden;
    }
  }
</style>

<!-- 市场详情 -->
<template>
  <div
    class="page page_marketinfo"
    :class="{ innerpage_marketinfo: props.innerPage }"
  >
    <!-- 头部 -->
    <div class="max-width info_header">
      <div class="top">
        <div v-if="!props.innerPage" class="back" @click="backFunc">
          <Icon name="arrow-left" />
        </div>
        <!-- 标题 -->
        <div class="title" v-if="route.query.type == 'stock'">
          <div class="title_name">{{ item.symbol || "--" }}</div>
          {{ item.name || "--" }}
        </div>
        <div class="title" v-else>
          <div class="title_name">{{ item.name || "--" }}</div>
        </div>
        <!-- 详情 -->
        <div class="title_shadow"></div>
        <div
          v-if="!props.innerPage"
          class="search star"
          @click="addCollect"
          :style="{ opacity: loading ? '0.5' : '1' }"
        >
          <div
            :class="
              item.watchlist == 1 ? 'check_star_icon' : 'uncheck_star_icon'
            "
          ></div>
        </div>
        <!-- <div v-if="!props.innerPage" class="search" @click="fullScreen(true)">
                    <Icon name="enlarge" />
                </div> -->
      </div>
      <div class="header-price">
        <h1
          class="info"
          :class="[updown === 0 ? '' : updown > 0 ? 'up' : 'down']"
        >
          <template v-if="item.price || item.close">
            {{ Number(item.price || item.close) }}
          </template>
          <span v-else>--</span>
        </h1>
        <div
          style="display: flex; align-items: center; margin-left: 0.2rem"
          class="ratio"
          :class="[updown === 0 ? '' : updown > 0 ? 'up' : 'down']"
        >
          <div
            class="ratio_price"
            v-if="Number(item.price * (item.ratio || 0))"
          >
            {{ updown === 0 ? "" : updown > 0 ? "+" : "" }}
            {{ Number(item.price * (item.ratio || 0)).toFixed(4) }}
          </div>
          <div class="ratio_percentage" v-if="item.ratio">
            {{
              updown === 0 || item.ratio === undefined
                ? ""
                : updown > 0
                ? "+"
                : ""
            }}
            {{
              item.ratio === undefined
                ? "--"
                : (item.ratio * 100).toFixed(2) + "%"
            }}
          </div>
        </div>
        <!-- <div class="count van-col van-col--5">
                    <div class="count_item">
                        <div class="txt">最高</div>
                        <span>{{ item.high || '--' }}</span>
                    </div>
                    <div class="count_item">
                        <div class="txt">最低</div>
                        <span>{{ item.low || '--' }}</span>
                    </div>
                </div> -->
      </div>
    </div>
    <!-- 内容 -->
    <div class="market_content">
      <!-- 图表 -->
      <div class="chart_box">
        <div class="tabs">
          <div
            class="tab"
            :class="{ active_tab: timeType == 'Time' }"
            @click="changeType('Time')"
          >
            Time
          </div>
          <div
            class="tab"
            @click="showPicker = true"
            :class="{ active_tab: minList.includes(timeType) }"
          >
            {{ currMin }}
            <Icon style="transform: rotate(90deg)" name="play" />
          </div>
          <div
            class="tab"
            :class="{ active_tab: timeType == '1h' }"
            @click="changeType('1h')"
          >
            1h
          </div>
          <div
            class="tab"
            v-if="!['stocks', 'forex'].includes(periodType)"
            :class="{ active_tab: timeType == '4h' }"
            @click="changeType('4h')"
          >
            4h
          </div>
          <div
            class="tab"
            :class="{ active_tab: timeType == '1D' }"
            @click="changeType('1D')"
          >
            1D
          </div>
          <div
            class="tab"
            :class="{ active_tab: timeType == '1W' }"
            @click="changeType('1W')"
          >
            1W
          </div>
          <div
            class="tab"
            :class="{ active_tab: timeType == '1M' }"
            @click="changeType('1M')"
          >
            1M
          </div>
          <div
            class="tab"
            v-if="!['stocks', 'forex'].includes(periodType)"
            :class="{ active_tab: timeType == '1Y' }"
            @click="changeType('1Y')"
          >
            1Y
          </div>
          <!-- <div style="flex:1"></div> -->
          <div class="full-tab" @click="fullScreen(true)">
            <img src="/static/img/common/full.svg" alt="" />
          </div>
          <!-- <div class="full-tab" @click="addCollect" :style="{ opacity: loading ? '0.5' : '1' }">
                        <img v-if="item.watchlist == 0" src="/static/img/market/unstar.png" alt="⭐">
                        <img v-if="item.watchlist == 1" src="/static/img/market/star.png" alt="⭐">
                    </div> -->
        </div>
        <div
          class="chart_container"
          :class="{ fullscreen_container: fullWindow }"
        >
          <!-- 时区 -->
          <div v-if="showDate" class="chart_time">{{ showDate }}</div>
          <!-- 分时图 -->
          <AreaChart
            ref="AreaChartRef"
            v-if="timeType == 'Time'"
            :showY="true"
            :symbol="item.symbol"
          />
          <!-- K线图 -->
          <KlineChart
            ref="KlineChartRef"
            v-if="timeType != 'Time'"
            :symbol="item.symbol"
            :period="timeType"
          />
          <!-- 全屏关闭按钮 -->
          <div class="full_close" v-if="fullWindow" @click="fullScreen(false)">
            <Icon name="cross" />
          </div>
        </div>
      </div>
    </div>
    <!-- 操作 -->
    <div class="market_bottom" v-if="!props.innerPage">
      <div class="market_bottom_symbol">
        <div class="symbol">{{ route.query.type == 'constract' ? item.name : item.symbol || "--" }}</div>
        <div class="time_type">{{ timeType }}</div>
      </div>

      <!-- <div class="bottom_btn" @click="showBuy = true">
                <span>交易</span>
            </div>
            -->
      <div style="display: flex">
        <div class="bottom_btn--default" @click="showInfo = true">
          <!-- <div class="bottom_btn_icon">
                            <img src="/static/img/market/data_icon.png" alt="img">
                        </div> -->
          <span>数据</span>
        </div>
        <div
          class="bottom_btn"
          @click="goBuy(true)"
          style="background-color: #00af70"
        >
          <!-- <div class="bottom_btn_icon">
                            <img src="/static/img/market/data_icon.png" alt="img">
                        </div> -->
          <span>买涨</span>
        </div>
        <div
          class="bottom_btn"
          @click="goBuy(false)"
          style="background-color: #e8503a"
        >
          <!-- <div class="bottom_btn_icon">
                            <img src="/static/img/market/data_icon.png" alt="img">
                        </div> -->
          <span>买跌</span>
        </div>
      </div>
    </div>
    <!-- 时间选择弹窗 -->
    <Popup
      :safe-area-inset-top="true"
      :safe-area-inset-bottom="true"
      v-model:show="showPicker"
      round
      position="bottom"
    >
      <div class="times_list">
        <div
          v-for="item in minList"
          :key="item"
          @click="chooseTime(item)"
          class="item"
          :class="{ active_item: currMin == item }"
        >
          {{ item }}
        </div>
      </div>
    </Popup>
    <!-- 交易弹窗 -->
    <Popup
      :safe-area-inset-top="true"
      :safe-area-inset-bottom="true"
      v-model:show="showBuy"
      round
      position="bottom"
      closeable
    >
      <div class="buy_popup">
        <div class="buy_name">交易</div>
        <div class="buy_popup_btn" @click="goBuy(true)">
          <span>买涨</span>
          <div class="btn_icon">
            <img src="/static/img/market/market.png" alt="img" />
          </div>
        </div>
        <div class="buy_popup_btn buy_popup_btn2" @click="goBuy(false)">
          <span>买跌</span>
          <div class="btn_icon">
            <img src="/static/img/market/market.png" alt="img" />
          </div>
        </div>
      </div>
    </Popup>

    <!-- 数据弹窗 -->
    <Popup
      :safe-area-inset-top="true"
      :safe-area-inset-bottom="true"
      v-model:show="showInfo"
      round
      position="bottom"
      closeable
    >
      <div class="info_popup">
        <div class="info_name">数据</div>
        <div class="info_price">
          <div
            class="info_num"
            :class="[updown === 0 ? '' : updown > 0 ? 'up' : 'down']"
          >
            <template v-if="item.price || item.close">
              {{ Number(item.price || item.close).toFixed(2) }}
            </template>
            <span v-else>--</span>
          </div>
          <div
            style="display: flex; align-items: center"
            :class="[updown === 0 ? '' : updown > 0 ? 'up' : 'down']"
          >
            <div
              v-if="Number(item.price * (item.ratio || 0))"
              :class="[
                updown === 0 ? '' : updown > 0 ? 'price_up' : 'price_down',
              ]"
            >
              {{ updown === 0 ? "" : updown > 0 ? "+" : ""
              }}{{ Number(item.price * (item.ratio || 0)).toFixed(2) }}
            </div>
            <div
              v-if="item.ratio"
              style="margin-left: 0.15rem"
              :class="[
                updown === 0
                  ? ''
                  : updown > 0
                  ? 'percentage_up'
                  : 'percentage_down',
              ]"
            >
              {{
                updown === 0 || item.ratio === undefined
                  ? ""
                  : updown > 0
                  ? "+"
                  : ""
              }}{{
                item.ratio === undefined
                  ? "--"
                  : (item.ratio * 100).toFixed(2) + "%"
              }}
            </div>
          </div>
        </div>
        <div class="info_items">
          <div
            class="info_item"
            style="
              background-image: url('/static/img/common/price_bg.png');
              background-repeat: no-repeat;
              background-position: center bottom;
            "
          >
            <div class="name">开</div>
            <div class="info_item__value">{{ item.open }}</div>
          </div>
          <div
            class="info_item"
            style="
              background-image: url('/static/img/common/price_bg.png');
              background-repeat: no-repeat;
              background-position: center bottom;
            "
          >
            <div class="name">高</div>
            <div class="info_item__value">{{ item.high }}</div>
          </div>
          <div
            class="info_item"
            style="
              background-image: url('/static/img/common/price_bg.png');
              background-repeat: no-repeat;
              background-position: center bottom;
            "
          >
            <div class="name">量</div>
            <div class="info_item__value">{{ _formatNumber(item.volume) }}</div>
          </div>
          <div
            class="info_item"
            style="
              background-image: url('/static/img/common/price_bg.png');
              background-repeat: no-repeat;
              background-position: center bottom;
            "
          >
            <div class="name">收</div>
            <div class="info_item__value">{{ item.close }}</div>
          </div>
          <div
            class="info_item"
            style="
              background-image: url('/static/img/common/price_bg.png');
              background-repeat: no-repeat;
              background-position: center bottom;
            "
          >
            <div class="name">低</div>
            <div class="info_item__value">{{ item.low }}</div>
          </div>
          <div
            class="info_item"
            style="
              background-image: url('/static/img/common/price_bg.png');
              background-repeat: no-repeat;
              background-position: center bottom;
            "
          >
            <div class="name">额</div>
            <div class="info_item__value">{{ _formatNumber(item.amount) }}</div>
          </div>
        </div>
      </div>
    </Popup>
  </div>
</template>

<script setup>
import { Icon, Popup, showToast } from "vant";
import router from "@/router";
import { useRoute } from "vue-router";
import { computed, ref } from "vue";
import store from "@/store";
import AreaChart from "@/components/KlineCharts/AreaChart.vue";
import KlineChart from "@/components/KlineCharts/KlineChart.vue";
import { _formatNumber } from "@/utils/index";
import { _basic, _profile, _add, _del } from "@/api/api";
import { formatTimestamp } from "@/utils/time";

const route = useRoute();
const token = computed(() => store.state.token);

// const activeTab = ref(1)
const props = defineProps({
  innerPage: {
    // 作为内置展示页
    type: Boolean,
    default: false,
  },
  type: {
    type: String,
    default: "",
  },
});

// 添加自选
const loading = ref(false);
const addCollect = () => {
  if (!token.value) return store.commit("setIsLoginOpen", true);
  if (loading.value) return;
  loading.value = true;
  if (!item.value.watchlist) {
    _add({
      symbol: item.value.symbol,
    })
      .then((res) => {
        if (res.code == 200) {
          switch (route.query.type) {
            case "constract": // 合约
              store.commit("setCurrConstract", { watchlist: 1 });
              break;
            default:
              store.commit("setCurrStock", { watchlist: 1 });
          }
          showToast("添加成功");
        }
      })
      .finally(() => {
        loading.value = false;
      });
  } else {
    _del({
      symbol: item.value.symbol,
    })
      .then((res) => {
        if (res.code == 200) {
          switch (route.query.type) {
            case "constract": // 合约
              store.commit("setCurrConstract", { watchlist: 0 });
              break;
            default:
              store.commit("setCurrStock", { watchlist: 0 });
          }
          showToast("移除成功");
        }
      })
      .finally(() => {
        loading.value = false;
      });
  }
};

const periodType = computed(() => route.query.type || props.type);
// 股票信息
const item = computed(() => {
  let it = {};
  const type = route.query.type || props.type;
  switch (type) {
    case "constract": // 合约
      it = store.state.currConstact || {};
      break;
    case "ai": // 合约
      it = store.state.currAi || {};
      break;
    default:
      it = store.state.currStock || {};
  }
  return it;
});

const showDate = computed(() => {
  // 展示的数据时间
  if (item.value.timestamp || item.value.ts) {
    return formatTimestamp(
      item.value.timestamp || item.value.ts,
      item.value.timezone
    );
  }
  return "";
});

const updown = computed(() => {
  // 1-涨 -1-跌 0-平
  if (item.value.ratio === undefined) return 0;
  return item.value.ratio > 0 ? 1 : -1;
});

// 获取股票最新信息
if (item.value.symbol) {
  _basic({ symbol: item.value.symbol }).then((res) => {
    if (res.code == 200) {
      store.commit("setCurrStock", {
        ...item.value,
        ...res.data,
      });
    }
  });
  // _profile({ symbol: item.value.symbol }).then(res => {
  //     if (res.code == 200) {
  //         store.commit('setCurrStock', {
  //             ...item.value,
  //             ...res.data
  //         })
  //     }
  // })
}

// 图表信息  Time 1m 5m 10m 15m 30m 1h 4h 1D 1W 1M 1Y
const timeType = ref("1h");
const showPicker = ref(false); // 时间选择弹窗
const currMin = ref("1m");
const minList = computed(() => {
  if (
    periodType.value == "futures" ||
    periodType.value == "aiquant" ||
    periodType.value == "constract"
  ) {
    return ["1m", "5m", "15m", "30m"];
  }
  return ["1m", "5m", "10m", "15m", "30m"];
});
const chooseTime = (time) => {
  showPicker.value = false;
  currMin.value = time;
  changeType(time);
};
const changeType = (type) => {
  if (timeType.value == type) return;
  timeType.value = type;
};

// 投注折叠
const switchKey = ref(false);

// 全屏
store.commit("setFullscreen", false);
const fullWindow = computed(() => store.state.fullscreen);
const KlineChartRef = ref();
const AreaChartRef = ref();
const fullScreen = (key) => {
  store.commit("setFullscreen", key);
  if (KlineChartRef.value) KlineChartRef.value.resetSize();
  if (AreaChartRef.value) AreaChartRef.value.resetSize();
};

// 下单
const goBuy = (key) => {
  showBuy.value = false;
  // store.commit('setActive', key)
  router.push({
    name: "trade",
    query: {
      symbol: item.value.symbol,
      type: key ? 1 : 2,
      to: route.query.type,
    },
  });
};

// 返回
const emits = defineEmits(["back"]);
const backFunc = () => {
  if (props.innerPage) {
    emits("back");
  } else {
    router.back();
  }
};

// 弹窗
const showBuy = ref(false);
const showInfo = ref(false);
</script>

<style lang="less" scoped>
.page_marketinfo {
  // padding: 1.8rem 0 0 0;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  position: relative;

  .has_padding_x {
    padding: 0 0.3rem;
  }

  .info_header {
    width: 100%;
    background-color: #fff;
    padding: 0 0.205rem;
    z-index: 100;

    .top {
      display: flex;
      min-height: 1rem;
      align-items: center;
      justify-content: space-between;
      position: relative;
      height: 0.88rem;
      margin-bottom: 0.205rem;

      .back {
        width: 0.36rem;
        height: 0.36rem;
        font-size: 0.36rem;
      }

      .title_shadow {
        flex: 1;
      }

      .title {
        pointer-events: none;
        position: absolute;
        width: calc(100% - 1.6rem);
        top: 50%;
        transform: translateY(-50%) translateX(-50%);
        left: 50%;
        text-align: center;
        white-space: nowrap;
        text-overflow: ellipsis;
        overflow: hidden;
        font-size: 0.24rem;
        line-height: 0.332rem;
        font-weight: 400;
        color: #8f92a1;

        .title_name {
          color: #061023;
          font-size: 0.32rem;
          line-height: 0.432rem;
          font-weight: 500;
        }
      }

      .search {
        width: 0.85rem;
        height: 0.85rem;
        padding: 0.025rem;
        .uncheck_star_icon {
          width: 0.8rem;
          height: 0.8rem;
          border-width: 1px;
          border-radius: 0.4rem;
          border-color: #cfcfcf;
          background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="0.8rem" height="0.8rem" viewBox="0 0 40 40" fill="none"><path fill-rule="evenodd" clip-rule="evenodd" d="M21.8934 14.7188C22.3378 15.8267 22.56 16.3807 23.0129 16.7173C23.4657 17.054 24.0602 17.1073 25.2491 17.2137L25.464 17.233C27.4099 17.4073 28.3828 17.4944 28.5909 18.1134C28.7991 18.7324 28.0766 19.3897 26.6315 20.7044L26.1493 21.1432C25.4178 21.8087 25.052 22.1414 24.8815 22.5776C24.8497 22.6589 24.8233 22.7423 24.8024 22.8271C24.6903 23.2817 24.7975 23.7645 25.0117 24.7299L25.0783 25.0305C25.472 26.8048 25.6688 27.692 25.3252 28.0746C25.1967 28.2176 25.0298 28.3206 24.8444 28.3712C24.3482 28.5066 23.6437 27.9325 22.2348 26.7844C21.3096 26.0305 20.847 25.6536 20.3159 25.5688C20.107 25.5354 19.8941 25.5354 19.6852 25.5688C19.1541 25.6536 18.6915 26.0305 17.7664 26.7844C16.3574 27.9325 15.6529 28.5066 15.1567 28.3712C14.9713 28.3206 14.8044 28.2176 14.676 28.0746C14.3323 27.692 14.5292 26.8048 14.9228 25.0305L14.9895 24.7299C15.2037 23.7645 15.3108 23.2817 15.1988 22.8271C15.1779 22.7423 15.1514 22.6589 15.1196 22.5776C14.9491 22.1414 14.5834 21.8087 13.8519 21.1432L13.3696 20.7044C11.9246 19.3897 11.202 18.7324 11.4102 18.1134C11.6184 17.4944 12.5913 17.4073 14.5371 17.233L14.7521 17.2137C15.941 17.1073 16.5354 17.054 16.9883 16.7173C17.4411 16.3807 17.6633 15.8267 18.1077 14.7188L18.1444 14.6275C18.931 12.6665 19.3242 11.686 20.0006 11.686C20.6769 11.686 21.0702 12.6665 21.8568 14.6275L21.8934 14.7188V14.7188Z" stroke="%23666D80" stroke-width="1"/></svg>');
          background-size: cover;
        }
        .check_star_icon {
          width: 0.8rem;
          height: 0.8rem;
          border-width: 1px;
          border-radius: 0.4rem;
          border-color: #cfcfcf;
          background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="0.8rem" height="0.8rem" viewBox="0 0 40 40" fill="none"><g clip-path="url(%23clip0_611_1527)"><path fill-rule="evenodd" clip-rule="evenodd" d="M21.8934 14.7188C22.3378 15.8267 22.56 16.3807 23.0129 16.7173C23.4657 17.054 24.0602 17.1073 25.2491 17.2137L25.464 17.233C27.4099 17.4073 28.3828 17.4944 28.5909 18.1134C28.7991 18.7324 28.0766 19.3897 26.6315 20.7044L26.1493 21.1432C25.4178 21.8087 25.052 22.1414 24.8815 22.5776C24.8497 22.6589 24.8233 22.7423 24.8024 22.8271C24.6903 23.2817 24.7975 23.7645 25.0117 24.7299L25.0783 25.0305C25.472 26.8048 25.6688 27.692 25.3252 28.0746C25.1967 28.2176 25.0298 28.3206 24.8444 28.3712C24.3482 28.5066 23.6437 27.9325 22.2348 26.7844C21.3096 26.0305 20.847 25.6536 20.3159 25.5688C20.107 25.5354 19.8941 25.5354 19.6852 25.5688C19.1541 25.6536 18.6915 26.0305 17.7664 26.7844C16.3574 27.9325 15.6529 28.5066 15.1567 28.3712C14.9713 28.3206 14.8044 28.2176 14.676 28.0746C14.3323 27.692 14.5292 26.8048 14.9228 25.0305L14.9895 24.7299C15.2037 23.7645 15.3108 23.2817 15.1988 22.8271C15.1779 22.7423 15.1514 22.6589 15.1196 22.5776C14.9491 22.1414 14.5834 21.8087 13.8519 21.1432L13.3696 20.7044C11.9246 19.3897 11.202 18.7324 11.4102 18.1134C11.6184 17.4944 12.5913 17.4073 14.5371 17.233L14.7521 17.2137C15.941 17.1073 16.5354 17.054 16.9883 16.7173C17.4411 16.3807 17.6633 15.8267 18.1077 14.7188L18.1444 14.6275C18.931 12.6665 19.3242 11.686 20.0006 11.686C20.6769 11.686 21.0702 12.6665 21.8568 14.6275L21.8934 14.7188Z" fill="%232752E7"/></g><defs><clipPath id="clip0_611_1527"><rect width="24" height="24" fill="white" transform="translate(8,8)"/></clipPath></defs></svg>');
          background-size: cover;
        }
      }
    }

    .header-price {
      padding: 0.1rem 0;
      display: flex;
      align-items: center;
      justify-content: flex-start;

      .info {
        align-items: center;
        margin: 0;
      }
    }

    .count {
      .count_item {
        color: #55555e;
        font-size: 0.24rem;
        font-weight: 400;
        line-height: 0.36rem;

        .txt {
          flex: none;
          display: block;
          width: 100%;
          color: #bbb;
        }

        .num {
          color: #000;
          margin-left: 0.1rem;
        }
      }

      .flex10 {
        flex: 5;
      }

      .flex12 {
        flex: 6;
      }
    }
  }

  h1.info {
    font-size: 0.6rem;
    line-height: 0.81rem;
    font-weight: 600;
  }

  .submit {
    color: #fff;
    height: 0.8rem;
    border-radius: 1.2rem;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 600;
    font-size: 0.28rem;
    z-index: 100;
    margin-right: 0.2rem;
  }

  .btn-green {
    background: #18b762;
  }

  .btn-red {
    background: #f3485e;
  }

  .info {
    display: flex;
    flex-direction: column;
    justify-content: center;
    vertical-align: middle;
    font-size: 0.6rem;
    font-weight: 600;
    line-height: 0.8rem;
  }

  .ratio {
    font-size: 0.4rem;
    line-height: 0.5rem;
  }

  .sell_key_open {
    transform: translateY(0);

    .sell_key {
      background-color: rgba(0, 0, 0, 0);

      .sell_key_icon {
        transform: rotate(0deg);
      }
    }
  }

  .ratio_price,
  .ratio_percentage {
    height: 0.56rem;
    display: inline-flex;
    align-items: center;
    font-size: 0.32rem;
    font-weight: 400;
    line-height: 0.42;
    margin-right: 0.2rem;
    padding: 0.1rem 0.25rem;
    border-radius: 1.25rem;
  }

  .up .ratio_price,
  .up .ratio_percentage {
    background: #00af701a;
  }

  .down .ratio_price,
  .down .ratio_percentage {
    background: #e53e001a;
  }

  .align-content {
    align-content: center;
  }

  .txt-center {
    text-align: center;
  }

  .icon-heyue {
    display: block;
    height: 0.6rem;
  }

  @media (min-width: 751px) {
    .submit {
      max-width: 340px;
    }

    .info_header {
      max-width: 340px;
    }
  }

  .market_content {
    flex: 1;
    overflow: hidden;

    .funcs {
      display: flex;
      align-items: center;

      .tab {
        color: #061023;
        font-size: 0.28rem;
        font-weight: 400;
        margin-right: 0.32rem;
        overflow: hidden;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 0 0.2rem;
        // height: 0.72rem;
      }

      .active_tab {
        // background-color: #F6F8FF;
        border-radius: 0.48rem;
        color: #014cfa;
        font-weight: bold;
      }

      .icon {
        width: 0.5rem;
        height: 0.5rem;
        margin-left: 0.2rem;
      }

      .submit_btn {
        padding: 0.12rem 0.4rem;
        color: #fff;
        background-color: #014cfa;
        border-radius: 0.5rem;
        font-weight: 600;
        font-size: 0.26rem;
        margin-left: 0.3rem;
      }
    }

    .info {
      display: flex;
      align-items: stretch;
      margin-top: 0.16rem;
      margin-bottom: 0.3rem;

      .left {
        .price {
          font-size: 0.9rem;
          line-height: 1.06rem;
          color: #55555e;
          margin-bottom: 0.12rem;
        }

        .time {
          color: #55555e;
          font-size: 0.28rem;
          line-height: 0.48rem;

          span {
            color: #0f0f1b;
            margin-left: 0.2rem;
          }
        }
      }

      .mid {
        flex: 1;
        margin-left: 0.36rem;
        margin-right: 0.2rem;
        color: #55555e;
        font-size: 0.36rem;
        line-height: 0.48rem;
      }

      .right {
        font-size: 0.24rem;
        line-height: 0.48rem;
        color: #818898;
        font-weight: 400;

        b {
          color: #0d0d12;
          font-weight: 700;
          font-size: 0.28rem;
          line-height: 0.4rem;
        }
      }
    }

    .chart_box {
      width: 100%;
      height: calc(var(--app-height) - 3.7rem);
      display: flex;
      flex-direction: column;
      overflow: hidden;

      .tabs {
        padding: 0 0.2rem;
        height: 0.48rem;
        display: flex;
        align-items: center;
        justify-content: space-between;

        .tab {
          height: 0.48rem;
          background-color: #eff6ff;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 0.3rem;
          color: #0a54f9;
          font-size: 0.24rem;
          font-weight: 400;
          margin-right: 0.16rem;
          padding: 0 0.1rem;
          min-width: 0.64rem;
        }

        .active_tab {
          background-color: #014cfa;
          color: #fff;
        }
      }

      .full-tab {
        color: #333;
        font-size: 0.32rem;
        width: 0.48rem;
        height: 0.48rem;
        // margin-left: 0.2rem;
        // background-color: #EDEDED;
        border-radius: 50%;
        padding: 0.08rem;
        display: center;
        align-items: center;
        justify-content: center;
        text-align: center;
        line-height: 0;
      }

      .chart_container {
        height: calc(100% - 0.48rem);
        width: 100%;
        padding: 0 0.28rem;
        position: relative;

        .chart_time {
          position: absolute;
          display: flex;
          align-items: center;
          height: 0.38rem;
          z-index: 999;
          top: 0.24rem;
          left: 0.24rem;
          color: #999;
          padding: 0.1rem 0.15rem;
          background: #00000080;
          border-radius: 0.15rem;
          color: #fff;
          font-size: 0.22rem;
          font-weight: 400;
          line-height: 0.22rem;
        }
      }

      .fullscreen_container {
        position: fixed;
        z-index: 9999;
        width: 100vw;
        height: var(--app-height);
        top: 0;
        // left: 100vw;
        left: 0;
        background-color: #fff;
        // transform: rotate(90deg);
        // transform-origin: 0% 0%;

        .full_close {
          width: 0.4rem;
          height: 0.4rem;
          position: absolute;
          right: 0.4rem;
          top: 0.4rem;
          color: #000;
          font-size: 0.4rem;
          z-index: 99999;
        }
      }

      @media (min-width: 751px) {
        .fullscreen_container {
          width: 100%;
          height: 100%;
          top: 0;
          left: 0;
          transform: none;
        }
      }
    }
  }

  .market_bottom {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0.12rem 0.32rem;
    border-top: 1px solid #eaeef3;
    height: 1.4rem;
    font-size: 0.3rem;
    font-weight: 400;

    .market_bottom_symbol {
      padding-right: 0.1rem;
      overflow: hidden;
    }

    .symbol {
      color: #061023;
      margin-bottom: 0.12rem;
    }

    .time_type {
      height: 0.36rem;
      padding: 0 0.1rem;
      display: inline-flex;
      align-items: center;
      text-align: center;
      box-sizing: border-box;
      color: #8f92a1;
      border-radius: 20px;
      border: 0.5px solid #d0d8e2;
      font-size: 0.24rem;
    }

    .bottom_line {
      flex: 1;
      height: 0.32rem;
      border-left: 1px solid #eaeef3;
    }

    .bottom_btn--default {
      width: 1.44rem;
      height: 0.9rem;
      color: #061023;
      border-radius: 40px;
      font-size: 0.32rem;
      margin-left: 0.2rem;
      display: flex;
      align-items: center;
      justify-content: center;
      background: #fff;
      border: 1px solid #d0d8e2;
    }

    .bottom_btn {
      width: 1.44rem;
      height: 0.9rem;
      color: white;
      border-radius: 40px;
      font-size: 0.32rem;
      margin-left: 0.2rem;
      display: flex;
      align-items: center;
      justify-content: center;

      .bottom_btn_icon {
        margin-right: 0.08rem;
        width: 0.32rem;
        height: 0.32rem;
      }
    }
  }

  .intro_box {
    padding-top: 0.4rem;

    .intro_title {
      color: #000;
      font-size: 0.36rem;
      font-weight: 600;
      margin-bottom: 0.2rem;
    }

    .intro_content {
      font-size: 0.28rem;
      font-weight: 400;
      color: #121826;
      line-height: 0.54rem;
      margin-bottom: 0.4rem;
    }

    .intro_area {
      display: flex;
      align-items: center;
      justify-content: space-between;
      height: 0.6rem;
      margin-bottom: 0.28rem;
      font-size: 0.28rem;
      color: #121826;
      font-weight: 400;

      .intro_area_box {
        width: 2.6rem;
        font-size: 0.2rem;
        font-weight: 500;
        color: #000;
        display: flex;
        align-items: center;
        justify-content: space-between;
      }
    }
  }
}

.innerpage_marketinfo {
  width: 100%;
  height: 100%;
  padding-top: 0;

  .info_header {
    position: relative;
    background-color: rgba(0, 0, 0, 0);
    pointer-events: none;
  }

  .market_content {
    height: calc(100% - 1.8rem);

    .chart_box {
      height: 100%;
    }
  }
}

.times_list {
  padding: 0.5rem 0;

  .item {
    height: 1rem;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 0.28rem;
    color: #55555e;
    overflow: hidden;
  }

  .active_item {
    background-color: #f4f5f7;
    color: #014cfa;
  }
}

.buy_popup {
  padding: 0.8rem 0.32rem 0.2rem 0.32rem;

  .buy_name {
    color: #121826;
    margin-bottom: 0.54rem;
    padding-left: 0.24rem;
  }

  .buy_popup_btn {
    height: 0.9rem;
    border-radius: 0.9rem;
    background-color: #e8503a;
    color: #fff;
    font-size: 0.28rem;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 0.54rem;
    position: relative;

    .btn_icon {
      width: 0.4rem;
      height: 0.4rem;
      position: absolute;
      right: 0.64rem;
    }
  }

  .buy_popup_btn2 {
    background-color: #18b762;
  }
}

.info_popup {
  padding: 0.8rem 0.32rem 0.2rem 0.32rem;

  .info_name {
    font-size: 0.32rem;
    line-height: 0.44rem;
    color: #121826;
    margin-bottom: 0.54rem;
    text-align: center;
  }

  .info_price {
    display: flex;
    align-items: center;
    justify-content: flex-start;
    font-size: 0.32rem;
    height: 1.3rem;
    padding: 0.24rem;
    background: #e6f9f2;
    border-radius: 0.4rem;

    .info_num {
      font-size: 0.6rem;
      line-height: 0.81rem;
      font-weight: 600;
      margin-right: 0.2rem;
    }

    .price_up,
    .percentage_up {
      height: 0.56rem;
      display: flex;
      align-items: center;
      background: #00af701a;
      border-radius: 1.25rem;
      padding: 0.075rem 0.25rem;
    }

    .price_down,
    .percentage_down {
      height: 0.56rem;
      display: flex;
      align-items: center;
      background: #e53e001a;
      border-radius: 1.25rem;
      padding: 0.075rem 0.25rem;
    }
  }

  .info_items {
    margin: 0.32rem 0 0 0;
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    justify-content: space-between;

    .info_item {
      display: flex;
      flex-direction: column;
      gap: 0.2rem;
      align-items: center;
      margin-bottom: 0.32rem;
      width: 31%;
      background-color: #f2f3f8;
      border-radius: 0.4rem;
      height: 1.14rem;

      .name {
        margin-top: 0.2rem;
      }

      .info_item__value {
        font-weight: 600;
      }
    }
  }
}
</style>

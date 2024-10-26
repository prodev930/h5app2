<!-- 股票单个元素 -->
<template>
  <div
    ref="root"
    style="width: 100%"
    :class="props.marketType != 'crypto' ? '' : 'mb-[0.2rem] pr-[0.32rem]'"
  >
    <SwipeCell
      :class="
        (props.marketType != 'crypto'
          ? 'stock_item_box'
          : 'stock_item_box_crypto') + `${' stock_item_' + updownStatus}`
      "
    >
      <div
        :class="
          props.marketType == 'crypto'
            ? 'bg-[#F5F7FC] rounded-[0.32rem] pb-3 overflow-hidden '
            : ''
        "
        @click="goInfo(props.item.type)"
      >
        <div
          :class="
            props.marketType != 'crypto' ? 'stock_item' : 'stock_item_crypto'
          "
        >
          <div class="td5" v-show="props.marketType != 'crypto'">
            <div class="item_name flex items-center gap-1">
              <span v-show="item.type == 'stock'">{{ props.item.symbol }}</span>
              <span v-show="item.type == 'crypto'">{{ props.item.name }}</span>
              <div
                :class="`${
                  marketStyle[props.item.type]
                } font-normal text-[0.22rem] ml-[0.06rem] flex items-center justify-center rounded-[0.08rem] w-[0.6rem] h-[0.3rem] `"
              >
                {{ market[props.item.type] }}
              </div>
            </div>
            <div class="item_info" v-show="props.item.type != 'crypto'">
              {{ props.item.name || "--" }}
            </div>
            <div
              class="text-[#0A54F9] text-[0.24rem] w-[0.64rem] h-[0.32rem] rounded-[0.24rem] border mt-[0.16rem] items-center flex justify-center border-[#0A54F9]"
              v-show="props.item.type == 'crypto'"
            >
              {{ props.item.lever }}X
            </div>
          </div>
          <div class="td5" v-show="marketType == 'crypto'">
            <div class="item_name flex items-center gap-1">
              {{ props.item.name }}
              <div
                class="text-[#0A54F9] border-[1px] font-normal text-[0.2rem] flex items-center justify-center rounded-[0.16rem] w-[0.64rem] h-[0.32rem] ml-[0.06rem] border-[#0A54F9]"
              >
                {{ props.item.lever }}X
              </div>
            </div>
          </div>
          <div
            :class="
              props.marketType != 'crypto'
                ? 'td2 spark_line_box'
                : 'td2 ml-[2rem]'
            "
          >
            <SparkLine
              v-if="props.item.points && showSparkLine"
              :style="
                props.marketType != 'cryto'
                  ? 'width: 100%; height: 0.6rem;'
                  : 'width: 100%; height: 0.54rem;'
              "
              :points="props.item.points"
              :ratio="props.item.ratio"
            />
          </div>
          <div class="td2 td_r" v-show="props.marketType != 'crypto'">
            <div
              class="item_num"
              :class="[updown === 0 ? '' : updown > 0 ? 'up' : 'down']"
            >
              {{ props.item.price ? props.item.price.toFixed(3) : "--" }}
            </div>
            <div
              class="item_info_box"
              @click.stop="() => (mode = mode == 3 ? 1 : mode + 1)"
            >
              <div
                v-if="props.item.ratio !== undefined"
                class="item_percent"
                :class="[updown === 0 ? '' : updown > 0 ? 'up_bg' : 'down_bg']"
              >
                <span v-if="mode == 1"
                  >{{
                    ((props.item.ratio || 0) * 100).toFixed(2) > 0
                      ? "+" + ((props.item.ratio || 0) * 100).toFixed(2)
                      : ((props.item.ratio || 0) * 100).toFixed(2)
                  }}%</span
                >
                <span v-else-if="mode == 2">{{
                  (props.item.price || 0).toFixed(2) > 0
                    ? "+" + (props.item.price || 0).toFixed(2)
                    : (props.item.price || 0).toFixed(2)
                }}</span>
                <span v-else>{{ _formatNumber(props.item.volume) }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- 为了显示自选给了常数，需要更改为后端数据 -->
        <div
          class="flex items-center justify-between text-[0.32rem] font-bold w-[100%]"
          v-show="props.marketType == 'crypto'"
        >
          <div class="text-center w-1/3">
            <span :class="updown === 0 ? '' : updown > 0 ? 'up' : 'down'">{{
              item.price || "--"
            }}</span
            ><br />
            <span class="text-[0.22rem] text-[#8F92A1] font-normal"
              >最新价</span
            >
          </div>
          <div class="text-center border-x-[#eff3f8] border-x-2 w-1/3">
            <span :class="updown === 0 ? '' : updown > 0 ? 'up' : 'down'">{{
              item.change || "--"
            }}</span
            ><br />
            <span class="text-[0.22rem] text-[#8F92A1] font-normal">涨跌</span>
          </div>
          <div class="text-center w-1/3">
            <span :class="updown === 0 ? '' : updown > 0 ? 'up' : 'down'"
              >{{ item.ratio > 0 ? "+" : ""
              }}{{ ((item.ratio || 0) * 100).toFixed(2) }}%</span
            ><br />
            <span class="text-[0.22rem] text-[#8F92A1] font-normal"
              >涨跌比</span
            >
          </div>
        </div>
      </div>

      <template #right v-if="props.deleteItem">
        <div
          :class="
            props.marketType != 'crypto'
              ? 'delete_content'
              : 'delete_content_crypto ml-[1px]'
          "
          @click="removeStock(item)"
        >
          <div class="delete_icon">
            <!-- <img src="/static/img/assets/delete.svg" alt="🚮" /> -->
          </div>
        </div>
      </template>
    </SwipeCell>
  </div>
</template>

<script setup>
import SparkLine from "./SparkLine.vue";
import { ref, computed, watch, onMounted } from "vue";
import router from "@/router";
import { SwipeCell } from "vant";
import store from "@/store";
import { _formatNumber } from "@/utils/index";

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
const emits = defineEmits(["remove"]);
const props = defineProps({
  item: {
    type: Object,
    default: () => {},
  },
  scrollBox: {
    // 滚动的父级
    type: String,
    default: ".page",
  },
  deleteItem: {
    // 是否可以滑动删除
    type: Boolean,
    default: false,
  },
  type: {
    //从交易页面侧边栏点击
    type: String,
    default: "",
  },
  handleClick: {
    type: Function,
    default: null,
  },
  marketType: {
    type: String,
  },
  showSparkLine: {
    type: Boolean,
    default: true,
  },
});

const mode = ref(1);
const updown = computed(() => {
  // 1-涨 -1-跌 0-平
  if (props.item.ratio === undefined) return 0;
  return props.item.ratio > 0 ? 1 : -1;
});
const price = computed(() => props.item.price | 0);

const updownStatus = ref("");
watch(price, (newVal, oldVal) => {
  if (newVal && oldVal) {
    if (newVal > oldVal) {
      // 上升
      updownStatus.value = "up";
    } else {
      // 下降
      updownStatus.value = "down";
    }
    setTimeout(() => {
      updownStatus.value = "";
    }, 1000);
  }
});

const goInfo = (type) => {
  if (props.handleClick) return props.handleClick(props.item);
  if (type == "stock") {
    store.commit("setCurrStock", props.item);
    router.push({
      name: "market_info",
      query: {
        symbol: props.item.symbol,
        type: "stock",
      },
    });
  }
  if (type == "crypto") {
    store.commit("setCurrConstract", props.item);
    router.push({
      name: "market_info",
      query: {
        symbol: props.item.name,
        type: "constract",
      },
    });
  }
  if (props.type === "trade") {
    const data = [
      {
        name: props.item.name,
        symbol: props.item.symbol,
      },
    ];
    store.commit("setShowLeft", false);
    store.commit("setChooseSymbol", data);
    return;
  }
};

const removeStock = (item) => {
  emits("remove", item);
};
</script>

<style lang="less" scoped>
.stock_item_box {
  width: 100%;
  border-radius: 0.12rem;
  overflow: hidden;

  &:active,
  &:hover {
    background-color: #f2f3f7;
  }

  .delete_content {
    width: 0.78rem;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #d0d8e2;
    border-top-right-radius: 16px;
    border-bottom-right-radius: 16px;

    .delete_icon {
      width: 0.4rem;
      height: 0.4rem;
    }
  }
  .delete_content_crypto {
    width: 0.78rem;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #d0d8e2;
    border-radius: 0.32rem;
    margin-left: -0.32rem;
    .delete_icon {
      font-size: 0.52rem;
      height: 0.52rem;
    }
  }
}
.stock_item_box_crypto {
  width: 100%;
  overflow: hidden;
  padding-left: 0.32rem;

  .delete_content {
    width: 0.78rem;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #d0d8e2;
    border-top-right-radius: 16px;
    border-bottom-right-radius: 16px;    
  }
  
  .delete_content_crypto {
    width: 0.78rem;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #d0d8e2;
    border-radius: 0.32rem;
    // margin-left: -0.32rem;    
  }

  
}
.active_symbol {
  background-color: #f2f3f7;
}

.stock_item {
  display: flex;
  align-items: center;
  height: 1.24rem;
  padding: 0 0.3rem;
  position: relative;

  &::after {
    content: "";
    width: calc(100% - 0.6rem);
    position: absolute;
    bottom: 0;
    left: 0.3rem;
    height: 1px;
    background-color: #eff3f8;
  }

  .td5 {
    flex: 5;
    flex-shrink: 0;
    overflow: hidden;

    .item_name {
      font-size: 0.32rem;
      color: #061023;
      line-height: 0.32rem;
      font-weight: 600;
    }

    .item_info {
      font-size: 0.24rem;
      line-height: 0.332rem;
      color: #8f92a1;
      text-overflow: ellipsis;
      white-space: nowrap;
      width: 100%;
      overflow: hidden;
      padding-right: 0.4rem;
    }
  }

  .td2 {
    flex-shrink: 0;
    flex: 2;
    overflow: hidden;

    .item_num {
      font-size: 0.3rem;
      font-weight: 600;
      line-height: 0.3rem;
      color: #6c7b90;
    }

    .item_info_box {
      margin-top: 0.1rem;
      .item_percent {
        text-align: center;
        width: 1rem;
        height: 0.4rem;
        line-height: 0.4rem;
        font-size: 0.24rem;
        display: inline-block;
        font-weight: 600;
        color: #fff;
        border-radius: 0.12rem;
      }

      .nodata_percent {
        background-color: #6c7b90;
      }
    }
  }

  .td_r {
    text-align: right;
  }

  .spark_line_box {
    padding-right: 0.4rem;
    padding-left: 0.2rem;
  }
}
.stock_item_crypto {
  display: flex;
  align-items: center;
  height: 1rem;
  padding: 0 0.32rem;
  position: relative;
  margin-bottom: 0.1rem;

  ::after {
    content: "";
    width: calc(100% - 0.6rem);
    position: absolute;
    bottom: 0;
    left: 0.3rem;
    height: 1px;
    background-color: #eff3f8;
  }
  .td5 {
    flex: 5;
    flex-shrink: 0;
    overflow: hidden;

    .item_name {
      font-size: 0.32rem;
      color: #061023;
      line-height: 0.46rem;
      font-weight: 600;
      margin-bottom: 0.06rem;
    }

    .item_info {
      font-size: 0.28rem;
      line-height: 0.36rem;
      color: #8f92a1;
      text-overflow: ellipsis;
      white-space: nowrap;
      width: 100%;
      overflow: hidden;
      padding-right: 0.4rem;
    }
  }

  .td2 {
    flex-shrink: 0;
    flex: 2;
    overflow: hidden;

    .item_num {
      font-size: 0.3rem;
      font-weight: 600;
      line-height: 0.3rem;
      color: #6c7b90;
    }

    .item_info_box {
      margin-top: 0.1rem;
      .item_percent {
        text-align: center;
        width: 1rem;
        height: 0.4rem;
        line-height: 0.4rem;
        font-size: 0.24rem;
        display: inline-block;
        font-weight: 600;
        color: #fff;
        border-radius: 0.12rem;
      }

      .nodata_percent {
        background-color: #6c7b90;
      }
    }
  }

  .td_r {
    text-align: right;
  }

  .spark_line_box {
    padding-right: 0.4rem;
    padding-left: 0.2rem;
  }
}
.stock_item_up {
  background-color: rgba(24, 183, 98, 0.12);

  .stock_item {
    border-bottom: 1px solid rgba(24, 183, 98, 0.12);
  }
}

.stock_item_down {
  background-color: rgba(250, 100, 102, 0.12);

  .stock_item {
    border-bottom: 1px solid rgba(250, 100, 102, 0.12);
  }
}
.delete_icon {
      width: 0.36rem;
      height: 0.34rem;
      background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 18 17"><path d="M14.4813 3.59546H3.5192C3.38792 3.59546 3.26758 3.70486 3.26758 3.84708V15.4218C3.26758 16.1767 3.88023 16.7893 4.6351 16.7893H13.3763C13.7373 16.7893 14.0765 16.6471 14.3281 16.3955C14.5797 16.1438 14.7219 15.7938 14.7219 15.4327V3.83614C14.7329 3.70486 14.6235 3.59546 14.4813 3.59546ZM6.80125 13.0806C6.80125 13.2119 6.74655 13.3432 6.65903 13.4307C6.56057 13.5291 6.44023 13.5729 6.30895 13.5729C6.03544 13.5729 5.81664 13.3541 5.81664 13.0806V6.99785C5.81664 6.72435 6.03544 6.50554 6.30895 6.50554C6.58245 6.50554 6.80125 6.72435 6.80125 6.99785V13.0806ZM9.49254 13.0806C9.49254 13.3541 9.27373 13.5729 9.00023 13.5729C8.72672 13.5729 8.50792 13.3541 8.50792 13.0806V6.99785C8.50792 6.72435 8.72672 6.50554 9.00023 6.50554C9.27373 6.50554 9.49254 6.72435 9.49254 6.99785V13.0806ZM12.1948 13.0806C12.1948 13.3541 11.976 13.5729 11.7024 13.5729C11.4289 13.5729 11.2101 13.3541 11.1992 13.0696V6.99785C11.1992 6.72435 11.418 6.50554 11.7024 6.50554C11.976 6.50554 12.1948 6.72435 12.1948 6.99785V13.0806Z" fill="%23666D80"/><path d="M16.5925 3.09238H12.9932V2.1187C12.9932 1.45135 12.4462 0.915283 11.7898 0.915283H6.24311C5.57576 0.915283 5.03969 1.46229 5.03969 2.1187V3.09238H1.40756C1.10123 3.09238 0.849609 3.344 0.849609 3.65033C0.849609 3.95665 1.10123 4.20827 1.40756 4.20827H16.5925C16.8988 4.20827 17.1505 3.95665 17.1505 3.65033C17.1505 3.344 16.8988 3.09238 16.5925 3.09238ZM11.8773 3.09238H6.15559V2.02024H11.8773V3.09238Z" fill="%23666D80"/></svg>');
      background-size: contain;
      background-repeat: no-repeat;
      background-position: center;
    }
</style>

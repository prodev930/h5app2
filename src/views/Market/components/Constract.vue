<!-- 合约 -->
<template>
  <div class="page page-constract">
    <!-- <div class="tr th">
            <div class="td td_left">名称/交易量</div>
            <div class="td">价格</div>
            <div class="td td_right">24小时涨跌</div>
        </div> -->
    <div class="coinbuy_content">
      <Loaidng :loading="loading" v-if="loading && !contractList.length" />
      <NoData v-if="!loading && !contractList.length" />
      <div
        class="tr flex-col bg-[#F5F7FC] rounded-[0.32rem]"
        v-for="(item, i) in contractList"
        :key="i"
        @click="goInfo(item)"
      >
        <div class="stock_item_crypto">
          <div class="td5">
            <div class="item_name flex items-center gap-1">
              {{ item.name }}
              <div
                class="text-[#0A54F9] border-[1px] font-normal text-[0.2rem] flex items-center justify-center rounded-[0.16rem] w-[0.64rem] h-[0.32rem] border-[#0A54F9]"
              >
                <span class="item_lever">{{ item.lever }}X</span>
              </div>
            </div>
          </div>
          <div class="td2 ml-[2rem]">
            <SparkLine
              v-if="item.points"
              :style="'width: 100%; height: 0.54rem;'"
              :points="item.points"
              :ratio="item.ratio"
            />
          </div>
        </div>
        <div
          class="flex items-center justify-between text-[0.32rem] font-bold w-[100%] pt-[0.15rem] pb-[0.15rem] w-[7.14rem]"
        >
          <div class="item_new_price text-center w-1/3">
            <span
              :class="item.ratio === 0 ? '' : item.ratio > 0 ? 'up' : 'down'"
              >{{ item.price || '--' }}</span
            ><br />
            <span class="text-[0.22rem] text-[#8F92A1] font-normal"
              >最新价</span
            >
          </div>
          <div
            class="item_loss_price text-center border-x-[#eff3f8] border-x-2 w-1/3"
          >
            <span
              :class="item.ratio === 0 ? '' : item.ratio > 0 ? 'up' : 'down'"
              >{{ item.change || '--' }}</span
            ><br />
            <span class="text-[0.22rem] text-[#8F92A1] font-normal"
              >涨跌</span
            >
          </div>
          <div class="item_loss_percentage text-center w-1/3">
            <span
              :class="item.ratio === 0 ? '' : item.ratio > 0 ? 'up' : 'down'"
              >{{ item.ratio > 0 ? "+" : ""
              }}{{ ((item.ratio || 0) * 100).toFixed(2) }}%</span
            ><br />
            <span class="text-[0.22rem] text-[#8F92A1] font-normal"
              >涨跌比</span
            >
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import SparkLine from "@/components/SparkLine.vue";
import { _futures } from "@/api/api";
import { ref, computed } from "vue";
import store from "@/store/index";
import router from "@/router";
import Decimal from "decimal.js";
import NoData from "@/components/NoData.vue";
import Loaidng from "@/components/Loaidng.vue";

const contractList = computed(() => store.state.contractList || []);

console.log("contract list ==========> ", contractList.value[0]);

const loading = ref(false);
const getList = () => {
  loading.value = true;
  _futures()
    .then((res) => {
      const list = res.data.map((item) => {
        const target = contractList.value.find((a) => a.symbol == item.symbol);
        if (target) return target;
        return item;
      });
      store.commit("setContractList", list || []);
      setTimeout(() => {
        store.dispatch("subList", {
          commitKey: "setContractList",
          listKey: "contractList",
        });
      }, 500);
    })
    .finally(() => {
      loading.value = false;
    });
};

getList();

const getUpDown = (item) => {
  if (!item.price || !item.ratio) return 0;
  return new Decimal(item.price).mul(item.ratio).toNumber();
};

// 去详情
const goInfo = (item) => {
  store.commit("setCurrConstract", item);
  router.push({
    name: "market_info",
    query: {
      symbol: item.name,
      type: "constract",
    },
  });
};
</script>

<style lang="less" scoped>
.page-constract {
  .stock_item_crypto {
    display: flex;
    align-items: center;
    position: relative;
    height: 0.54rem;
    margin-bottom: 0.21rem;

    ::after {
      content: "";
      width: 6.86rem;
      position: absolute;
      top: 0.7rem;
      left: -0.25rem;
      height: 1px;
      background-color: #eff3f8;
    }

    .item_new_price,
    .item_loss_price,
    .item_loss_percentage {
      font-size: 0.32rem;
      font-weight: 600;
      line-height: 0.3rem;
    }

    .td5 {
      flex: 5;
      flex-shrink: 0;
      overflow: hidden;

      .item_name {
        font-size: 0.32rem;
        color: #061023;
        line-height: 0.432rem;
        font-weight: 600;

        .item_lever {
          font-size: 0.24rem;
          line-height: 0.22rem;
        }
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
  .tr {
    display: flex;
    align-items: center;
    margin-bottom: 0.2rem;
    padding: 0.15rem 0.25rem;

    .td {
      flex: 1;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      color: #9ea3ae;
      font-size: 0.28rem;

      .amount {
        color: #333;
        font-weight: bold;
        font-size: 0.32rem;
        font-weight: bold;
      }

      .x {
        color: #014cfa;
        background-color: #eef3fe;
        border-radius: 0.04rem;
        padding: 0.04rem 0.08rem;
        margin-right: 0.16rem;
      }

      .percent {
        padding: 0.08rem 0.2rem;
        border-radius: 0.08rem;
        color: #fff;
        font-size: 0.24rem;
      }
    }

    .td_left {
      flex: 1.5;
      align-items: flex-start;
    }

    .td_right {
      align-items: flex-end;
    }
  }

  .coinbuy_content {
    padding: 0 0.32rem;
  }

  .th {
    padding: 0.24rem 0.32rem;
  }
}
</style>

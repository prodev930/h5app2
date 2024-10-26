<!-- 自选推荐 -->
<template>
  <div class="recommend_list">
    <Loading v-show="!props.list.length && props.loading" />
    <div class="list_box">
      <div
        class="list_item"
        @click="changeCheck(i)"
        :class="'list_item_active'"
        v-for="(item, i) in props.list"
        :key="i"
      >
        <div class="symbol">{{ item.symbol }}</div>
        <div class="name">{{ item.name || "--" }}</div>
        <div class="price">{{ item.price ? item.price.toFixed(2) : "--" }}</div>
        <div
          class="percent"
          :class="[updown(item) === 0 ? '' : updown(item) > 0 ? 'up' : 'down']"
        >
          {{
            ((item.ratio || 0) * 100).toFixed(2) > 0
              ? "+" + ((item.ratio || 0) * 100).toFixed(2)
              : ((item.ratio || 0) * 100).toFixed(2)
          }}%
        </div>

        <div class="sparkLine">
          <SparkLine
            v-if="item.points"
            style="width: 100%; height: 0.45rem"
            :points="item.points"
            :ratio="item.ratio"
          />
        </div>

        <div class="check_ticket" v-if="checkedList[i]">
          <div class="checkmark"></div>
        </div>

        <div class="uncheck_ticket" v-else>
          <!-- <div class="uncheckmark"></div> -->
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import SparkLine from "./SparkLine.vue";
import Loading from "./Loaidng.vue";
import { ref, computed, watch } from "vue";
import { Button, showToast } from "vant";
import { _add } from "@/api/api";
import store from "@/store";
import router from "@/router";

const emits = defineEmits(["init", "change"]);
const token = computed(() => store.state.token || "");

const props = defineProps({
  keyStr: {
    type: String,
    default: "",
  },
  loading: {
    type: Boolean,
    default: true,
  },
  list: {
    type: Array,
    default: () => [],
  },
  newState: {
    type: Boolean,
    default: true,
  },
  flag: {
    type: Boolean,
    default: true,
  },
});

const updown = (item) => {
  if (item.ratio === undefined) return 0;
  return item.ratio > 0 ? 1 : -1;
};

const emitsKeys = () => {
  const keys = [];

  checkedList.value.map((item, i) => {
    if (item) {
      keys.push(props.list[i].symbol);
    }
  });
  emits("change", keys);
};

const checkedList = ref([]);
try {
  checkedList.value = props.list.map((item) => true);
  store.commit("setCheckState", true);
} catch {
  checkedList.value = [];
}
emitsKeys();

watch(
  () => props.newState,
  (newValue) => {
    try {
      if (props.flag == true)
        checkedList.value = props.list.map(() => newValue);
      else checkedList.value = props.list.map(() => !newValue);

      if (props.keyStr == "stock")
        store.commit("setCheckStockState", checkedList.value);
      if (props.keyStr == "recommend")
        store.commit("setCheckCryptoState", checkedList.value);
    } catch {
      checkedList.value = [];
    }
    emitsKeys();
  }
);

const checkStockList = computed(() => store.state.checkStockList);
const checkCryptoList = computed(() => store.state.checkCryptoList);
var all = computed(
  () =>
    checkStockList.value.every((item) => item === true) &&
    checkCryptoList.value.every((item) => item === true)
);
const changeCheck = (i) => {
  checkedList.value[i] = !checkedList.value[i];
  if (props.keyStr == "stock")
    store.commit("setCheckStockState", checkedList.value);
  if (props.keyStr == "recommend")
    store.commit("setCheckCryptoState", checkedList.value);
  console.log("============> all", all.value);
  store.commit("setCheckState", all.value);
  emitsKeys();
};

const loading = ref(false);
const disabled = computed(
  () => !checkedList.value.some((item) => item == true)
);
</script>

<style lang="less" scoped>
.recommend_list {
  padding: 0 0.036rem;
  overflow: hidden;
  display: flex;
  flex-direction: column;

  .list_box {
    flex: 1;
    overflow-y: auto;
    display: flex;
    align-items: stretch;
    justify-content: space-between;
    flex-wrap: wrap;

    .list_item {
      background-color: #ffffff;
      height: 1.998rem;
      width: 3.36rem;
      border-radius: 0.2rem;
      margin-bottom: 0.15rem;
      position: relative;
      padding: 0.2rem;
      overflow: hidden;

      .symbol {
        font-size: 0.32rem;
        color: #061023;
      }

      .name {
        font-size: 0.24rem;
        color: #8f92a1;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        margin: 0.1rem 0;
      }

      .price {
        color: #061023;
        font-weight: 600;
        font-size: 0.32rem;
        line-height: 0.432rem;
        margin-bottom: 0.08rem;
      }

      .percent {
        font-size: 0.28rem;
        line-height: 0.32rem;
        font-weight: 600;
      }

      .sparkLine {
        position: absolute;
        width: 1.6rem;
        height: 0.5rem;
        right: 0.1rem;
        bottom: 0.1rem;
      }
    }

    .list_item_active {
      position: relative;

      .check_ticket {
        top: 0.15rem;
        right: 0.15rem;
        display: flex;
        align-items: center;
        justify-content: center;
        width: 0.4rem;
        height: 0.4rem;
        background-color: #014cfa;
        border-radius: 50%;
        color: white;
        font-size: 0.5rem;
        position: absolute;
        transition: background-color linear 2s;

        .checkmark {
          width: 11px;
          height: 7px;
          position: relative;
          transition: background-color linear 2s;
        }

        .checkmark::before {
          content: "";
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background-color: white;
          transition: background-color linear 2s;

          clip-path: path(
            "M3.52645 6.39447C3.34635 6.38945 3.17542 6.32185 3.04962 6.2059L0.203008 3.66018C0.072772 3.53877 0 3.37669 0 3.20804C0 3.03939 0.072772 2.87731 0.203008 2.7559C0.268598 2.69655 0.346602 2.64945 0.432527 2.61731C0.518452 2.58517 0.610601 2.56862 0.70367 2.56862C0.796739 2.56862 0.888889 2.58517 0.974814 2.61731C1.06074 2.64945 1.13874 2.69655 1.20433 2.7559L3.52645 4.8559L9.45809 0.188751C9.52294 0.129008 9.60043 0.081531 9.68601 0.0491152C9.77158 0.0166994 9.86351 0 9.95637 0C10.0492 0 10.1412 0.0166994 10.2267 0.0491152C10.3123 0.081531 10.3898 0.129008 10.4547 0.188751C10.5207 0.247704 10.5731 0.317814 10.6088 0.395044C10.6446 0.472274 10.663 0.555099 10.663 0.638751C10.663 0.722402 10.6446 0.805227 10.6088 0.882457C10.5731 0.959687 10.5207 1.0298 10.4547 1.08875L4.02712 6.2059C3.89458 6.32584 3.71453 6.39366 3.52645 6.39447Z"
          );
        }
      }

      .uncheck_ticket {
        top: 0.15rem;
        right: 0.15rem;
        display: flex;
        align-items: center;
        justify-content: center;
        width: 0.4rem;
        height: 0.4rem;
        background-color: white;
        border-width: 1px;
        border-radius: 50%;
        color: #8f92a1;
        font-size: 0.5rem;
        position: absolute;
        transition: background-color linear 2s;

        .uncheckmark {
          width: 11px;
          height: 7px;
          position: relative;
          transition: background-color linear 2s;
        }

        .uncheckmark::before {
          content: "";
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background-color: #8f92a1;
          transition: background-color linear 2s;

          clip-path: path(
            "M3.52645 6.39447C3.34635 6.38945 3.17542 6.32185 3.04962 6.2059L0.203008 3.66018C0.072772 3.53877 0 3.37669 0 3.20804C0 3.03939 0.072772 2.87731 0.203008 2.7559C0.268598 2.69655 0.346602 2.64945 0.432527 2.61731C0.518452 2.58517 0.610601 2.56862 0.70367 2.56862C0.796739 2.56862 0.888889 2.58517 0.974814 2.61731C1.06074 2.64945 1.13874 2.69655 1.20433 2.7559L3.52645 4.8559L9.45809 0.188751C9.52294 0.129008 9.60043 0.081531 9.68601 0.0491152C9.77158 0.0166994 9.86351 0 9.95637 0C10.0492 0 10.1412 0.0166994 10.2267 0.0491152C10.3123 0.081531 10.3898 0.129008 10.4547 0.188751C10.5207 0.247704 10.5731 0.317814 10.6088 0.395044C10.6446 0.472274 10.663 0.555099 10.663 0.638751C10.663 0.722402 10.6446 0.805227 10.6088 0.882457C10.5731 0.959687 10.5207 1.0298 10.4547 1.08875L4.02712 6.2059C3.89458 6.32584 3.71453 6.39366 3.52645 6.39447Z"
          );
        }
      }
    }
  }

  .submit {
    margin: 0.2rem 0;
  }
}
</style>

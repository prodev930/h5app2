<!-- 股票列表样式架子 -->
<template>
  <div class="stock_table">
    <Loading :type="'spinner'" v-show="!props.list.length && props.loading" />
    <div class="tr" v-for="(item, i) in props.list" :key="i">
      <StockItemForList
        :marketType="props.marketType"
        :theme="theme"
        :handleClick="props.handleClick"
        :deleteItem="props.deleteItem"
        :showSparkLine="showSparkLine"
        :type="props.type"
        @remove="remove"
        :scrollBox="props.scrollBox"
        :item="item"
      />
    </div>
    <NoData v-if="!props.loading && !props.list.length" />
  </div>
</template>

<script setup>
import Loading from "./Loaidng.vue";
import StockItemForList from "./StockItemForList.vue";
import NoData from "./NoData.vue";

const emits = defineEmits(["remove"]);
const props = defineProps({
  loading: {
    type: Boolean,
    default: true,
  },
  marketType: {
    type: String,
    default: "stock",
  },
  list: {
    type: Array,
    default: () => [],
  },
  scrollBox: {
    type: String,
    default: ".page",
  },
  deleteItem: {
    // 是否可以滑动删除
    type: Boolean,
    default: false,
  },
  theme: {
    // 空 默认 classic 经典
    type: String,
    default: "",
  },
  type: {
    //从交易页面侧边栏点击
    type: String,
    default: "",
  },
  handleClick: {
    // 元素点击事件
    type: Function,
    default: null,
  },
  showSparkLine:{
    type:Boolean,
    default:true
  }
});

const remove = (item) => {
  emits("remove", item);
};
</script>

<style lang="less" scoped>
.stock_table {
  padding: 0;
  width: 100%;

  .tr {
    display: flex;
    align-items: center;

    .td {
      flex: 1;
    }

    .td5 {
      flex: 5;
    }

    .td2 {
      flex: 2;
    }
  }

  .th {
    padding: 0 0.3rem 0.16rem 0.3rem;
    height: 0.64rem;
    color: #9ea3ae;
    font-size: 0.28rem;
    font-weight: 400;
    // border-bottom: 1px solid #E8E8E8;

    .td_r {
      text-align: right;
    }
  }
}
</style>

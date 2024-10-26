<!-- 自选推荐 -->
<template>
  <div class="recommend_list">
    <Loading v-show="!props.list.length && props.loading" />
    <div class="list_box" v-show="props.list.length && !props.loading">
      <div
        class="list_item"
        v-for="(item, i) in props.list"
        @click="goInfo(item)"
        :key="i"
      >
        <div :class="item.watchlist == 1 ? 'star_icon' : 'unstar_icon'" @click.stop="collect(item)"></div>
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
      </div>
    </div>
  </div>
</template>

<script setup>
import SparkLine from "@/components/SparkLine.vue";
import Loading from "@/components/Loaidng.vue";
import { ref, computed } from "vue";
import { Button, showToast, showLoadingToast, closeToast } from "vant";
import store from "@/store";
import router from "@/router";
import { _add, _del } from "@/api/api";
import eventBus from "@/utils/eventBus";


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

const loading = ref(false);
const disabled = computed(
  () => !checkedList.value.some((item) => item == true)
);

const goInfo = (item) => {
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

const collectLoading = ref(false)
const reqMap = {
  0: _add,
  1: _del
}

const collect = (item) => {
  if (!token.value) {
    store.commit("setIsLoginOpen", true);
    eventBus.on("loginSuccess", () => {
      eventBus.off("loginSuccess");
    });
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
            showToast(item.watchlist ? "移除成功" : "添加成功");
          }, 300);
          const i = props.list.find((a) => a.symbol == item.symbol);
          if (i) {
            i.watchlist = i.watchlist == 1 ? 0 : 1;
            emits('change', props.list)
          }
        }
      })
      .finally(() => {
        closeToast();
        collectLoading.value = false;
      });
  }
}
</script>

<style lang="less" scoped>
.recommend_list {
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
      position: relative;
      background-color: #f5f7fc;
      height: 1.998rem;
      width: 3.36rem;
      border-radius: 0.32rem;
      margin-bottom: 0.15rem;
      position: relative;
      padding: 0.15rem;
      overflow: hidden;

      .star_icon {
        width: 0.28rem;
        height: 0.26rem;
        position: absolute;
        right: 0.2rem;
        background-image: url('data:image/svg+xml;charset=UTF-8,%3Csvg width="18" height="17" viewBox="0 0 18 17" fill="none" xmlns="http://www.w3.org/2000/svg"%3E%3Cpath fill-rule="evenodd" clip-rule="evenodd" d="M10.5184 3.03281C10.9628 4.14068 11.185 4.69462 11.6379 5.0313C12.0907 5.368 12.6852 5.42124 13.8741 5.52771L14.089 5.54696C16.0349 5.72122 17.0078 5.80835 17.2159 6.42734C17.4241 7.04632 16.7016 7.70366 15.2565 9.01835L14.7743 9.45713C14.0428 10.1226 13.677 10.4554 13.5065 10.8915C13.4747 10.9729 13.4483 11.0562 13.4274 11.141C13.3153 11.5957 13.4225 12.0784 13.6367 13.0439L13.7033 13.3444C14.097 15.1188 14.2938 16.0059 13.9502 16.3886C13.8217 16.5316 13.6548 16.6345 13.4694 16.6851C12.9732 16.8205 12.2687 16.2465 10.8598 15.0984C9.93462 14.3445 9.47203 13.9676 8.94093 13.8828C8.73202 13.8494 8.51914 13.8494 8.31023 13.8828C7.77914 13.9676 7.31655 14.3445 6.39138 15.0984C4.98243 16.2465 4.27794 16.8205 3.78175 16.6851C3.59633 16.6345 3.42943 16.5316 3.30099 16.3886C2.95732 16.0059 3.15415 15.1188 3.54782 13.3444L3.6145 13.0439C3.82871 12.0784 3.93582 11.5957 3.82375 11.141C3.80286 11.0562 3.77642 10.9729 3.74462 10.8915C3.57415 10.4554 3.20839 10.1226 2.47689 9.45713L1.99461 9.01835C0.54957 7.70366 -0.17296 7.04632 0.0352269 6.42734C0.243397 5.80835 1.21631 5.72122 3.16212 5.54696L3.37705 5.52771C4.56597 5.42124 5.16043 5.368 5.61329 5.0313C6.06613 4.69462 6.28833 4.14068 6.73272 3.03281L6.76936 2.9415C7.55596 0.980495 7.94925 0 8.62558 0C9.30191 0 9.69521 0.980495 10.4818 2.9415L10.5184 3.03281Z" fill="%232752E7"/%3E%3C/svg%3E');
        background-size: contain;
        background-repeat: no-repeat;
      }

      .unstar_icon {
        width: 0.28rem;
        height: 0.26rem;
        position: absolute;
        right: 0.2rem;
        background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 18" fill="none"><path d="M11.8934 3.71885C12.3378 4.82671 12.56 5.38066 13.0129 5.71734C13.4657 6.05404 14.0602 6.10727 15.2491 6.21375L15.464 6.23299C17.4099 6.40726 18.3828 6.49439 18.5909 7.11338C18.7991 7.73235 18.0766 8.3897 16.6315 9.70438L16.1493 10.1432C15.4178 10.8087 15.052 11.1414 14.8815 11.5776C14.8497 11.6589 14.8233 11.7423 14.8024 11.8271C14.6903 12.2817 14.7975 12.7645 15.0117 13.7299L15.0783 14.0305C15.472 15.8048 15.6688 16.692 15.3252 17.0746C15.1967 17.2176 15.0298 17.3206 14.8444 17.3712C14.3482 17.5066 13.6437 16.9325 12.2348 15.7844C11.3096 15.0305 10.847 14.6536 10.3159 14.5688C10.107 14.5354 9.89414 14.5354 9.68523 14.5688C9.15414 14.6536 8.69155 15.0305 7.76638 15.7844C6.35743 16.9325 5.65294 17.5066 5.15675 17.3712C4.97133 17.3206 4.80443 17.2176 4.67599 17.0746C4.33232 16.692 4.52915 15.8048 4.92282 14.0305L4.9895 13.7299C5.20371 12.7645 5.31082 12.2817 5.19875 11.8271C5.17786 11.7423 5.15142 11.6589 5.11962 11.5776C4.94915 11.1414 4.58339 10.8087 3.85189 10.1432L3.36961 9.70438C1.92457 8.3897 1.20204 7.73235 1.41023 7.11338C1.6184 6.49439 2.59131 6.40726 4.53712 6.23299L4.75205 6.21375C5.94097 6.10727 6.53543 6.05404 6.98829 5.71734C7.44113 5.38066 7.66333 4.82671 8.10772 3.71885L8.14436 3.62754C8.93096 1.66653 9.32425 0.686035 10.0006 0.686035C10.6769 0.686035 11.0702 1.66653 11.8568 3.62754L11.8934 3.71885V3.71885Z" fill="none" stroke="%23666D80" stroke-width="1.5"/></svg>');
        background-size: contain;
        background-repeat: no-repeat;
      }

      .symbol {
        font-size: 0.32rem;
        line-height: 0.432rem;
        color: #061023;
      }

      .name {
        font-size: 0.24rem;
        color: #8f92a1;
        line-height: 0.312rem;
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
        right: -0.15rem;
        bottom: 0.25rem;
      }
    }
  }
}
</style>

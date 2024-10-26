<template>
  <div class="date-date-box">
    <div class="date-header">
      <Icon name="arrow-left" class="arrow-left" @click="goTotrade" />
      <span>查询</span>
    </div>
    <div class="date-close-button" @click="goTotrade" >
      关闭
    </div>
    <div class="date-close-button" style="right: 0.3rem;" @click="clearDates">
      清空
    </div>
    <PullRefresh v-model="loading" @refresh="onRefresh">
      <Calendar
        :poppable="false"
        type="range"
        :show-confirm="false"
        :show-mark="false"
        @confirm="onConfirm"
        title="日期选择（下拉加载更多）"
        :formatter="formatter"
        :row-height="40"
        :min-date="minDate"
        :default-date = 'null'
        :max-date='maxDate'
        ref="calendar"
      />
    </PullRefresh>

    <teleport to="body">
      <DateBottom />
    </teleport>

  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { Calendar, Icon, PullRefresh } from 'vant';
import DateBottom from '@/views/trade/DateBottom.vue'
import store from "@/store";

const router = useRouter();
const minDate = ref()
const maxDate = ref()
const count = ref(0);
const calendar = ref(null);

store.commit('setDates', ['','']);

const formatter = (day) => {
  if (day.type === 'start') {
    day.bottomInfo = '';
  } else if (day.type === 'end') {
    day.bottomInfo = '';
  }
  return day;
};

const goTotrade = () => {
  router.push({ name: 'trade', query: { type: 'date' } });
};

const onConfirm = (value) => {
  store.commit('setDates', value);
};

const loading = ref(false);
const onRefresh = () => {
  loadMoreDates();
  count.value++;
};

const loadMoreDates = () => {
  var currentMinDate
  if (count.value === 0) {
    currentMinDate = new Date();
  } else {
    currentMinDate = minDate.value
  }
  const today = new Date()
  const newMinDate = new Date(currentMinDate.getFullYear(), currentMinDate.getMonth() - 1, currentMinDate.getDate());
  const newMaxDate = new Date(today.getFullYear(), today.getMonth() + 6, today.getDate());
  minDate.value = newMinDate
  maxDate.value = newMaxDate
  loading.value = false;
};

const clearDates = () => {
  if (calendar.value) {
    calendar.value.reset();
  }
  store.commit('setDates', ['','']);
};
</script>

<style lang="less">
.date-date-box {
  position: relative;
  padding: 0 0.3rem;
  background-color: white;
  padding-bottom: 1.42rem;
  .arrow-left {
    position: absolute;
    left: 0.3rem;
    top: 0.36rem;
  }
  .date-close-button {
    color: #0953FA;
    font-size: 0.28rem;
    font-style: normal;
    font-weight: 400;
    line-height: normal;
    position: absolute;
    top: 1.36rem;
    z-index: 9999;
    cursor: pointer;
  }
  .date-header {
    padding: 0.3rem 0;
    background-color: white;
    color: #010101;
    font-size: 0.36rem;
    font-style: normal;
    font-weight: 500;
    line-height: 0.52rem;
    text-align: center;
  }
  .van-calendar__header {
    box-shadow: inherit;
    border-bottom: 0.02rem solid #dddddd;
  }
  .van-calendar__header-title {
    color: #000;
    font-size: 0.28rem;
    font-style: normal;
    font-weight: 400;
  }
  .van-calendar__day--start {
    background-color: #0953fa;
    margin: 0 0.0928rem;
    width: 0.8rem;
    border-radius: 50%;
  }
  .van-calendar__day--end {
    background-color: #0953fa;
    margin: 0 0.0928rem;
    width: 0.8rem;
    border-radius: 50%;
  }
}
</style>

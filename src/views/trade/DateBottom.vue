<template>
    <div class="date-bottom">
      <div style="display: flex;justify-content: space-between;padding: 0.32rem;">
        <div class="date-text-box">
          <div style="margin-bottom: 0.08rem;">开始：{{ startDate }}</div>
          <div>结束：{{ endDate }}</div>
        </div>
        <div class="date-button-box">
          <Button color="#0953fa" @click="goTrade">确认</Button>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { Button } from 'vant';
  import { ref, computed } from "vue";
  import store from "@/store";
  import { useRouter } from 'vue-router';

  const startDate = computed(() => formatDate(store.state.startDate))
  const endDate = computed(() => formatDate(store.state.endDate))
  const router = useRouter();


  const formatDate = (date) => {
    if (date != '') {
      const daysOfWeek = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'];
      const d = new Date(date);
      const year = d.getFullYear();
      const month = String(d.getMonth() + 1).padStart(2, '0');
      const day = String(d.getDate()).padStart(2, '0');
      const dayOfWeek = daysOfWeek[d.getDay()];

      return `${year}年${month}月${day}日 ${dayOfWeek}`;
    } else {
      return ''
    }
  };

  const goTrade = ()=>{
    router.push({ name: 'trade', query: { type: 'date' } });
  }

  
  
  </script>
  
  <style lang="less">
  .date-bottom{
    width: 100%;
    height: 1.42rem;
    background-color: #f7f7f7;
    position: fixed;
    bottom: 0;
    .date-text-box {
      color: #000;
      font-size: 0.24rem;
      font-style: normal;
      font-weight: 400;
      line-height: normal;
    }
    .date-button-box {
      .van-button {
        width: 1.6rem;
        height: 0.72rem;
        line-height: 0.72rem;
      }
    }
  }

  @media (min-width: 751px) {
    .date-bottom {
      max-width: 375px;
      left: 50% !important;
      transform: translateX(-50%) !important;
      position: fixed !important;
    }
  }
  </style>
  
<template>
    <div class="leverselect">
      <!-- <div class="detail-update-title">保证金模式</div> -->
  
      <div class="select-box">
        <div class="select-box-item" v-for="i in option2" :class="{'selected-class': selectedLeverOption === i.value}"  :key="i.value" @click="bigLeverSelect(i.value)">
          {{ i.text }}
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, computed } from "vue";
  import store from "@/store";
  
  const option2 = computed(() => store.state.option2)
  const selectedLeverOption = computed({
    get: () => store.state.selectedLeverOption,
    set: (value) => store.commit('setSelectedLeverOption', value)
  });

  const bigLeverSelect = (val)=>{
    store.commit('setSelectedLeverOption',val)
    store.dispatch('closePopup')
  }

  
  </script>
  
  <style lang="less">
  .leverselect {
    .detail-update-title {
      text-align: center;
      margin-top: 0.4rem;
      color: #121826;
      font-size: 0.32rem;
      font-style: normal;
      font-weight: 500;
      line-height: 0.44rem;
      margin-bottom: 0.36rem;
      text-align: left;
      margin-left: 0.3rem;
    }
    .select-box {
      margin-top: 1rem;
      .select-box-item {
        width: 100%;
        height: 0.96rem;
        text-align: center;
        line-height: 0.96rem;
        color: #333333;
        font-size: 0.28rem;
        font-style: normal;
        font-weight: 400;
        border-bottom: 0.02rem solid #f4f5f7;
      }
      .select-box-item:first-of-type {
        margin-right: 0.3rem;
      }
      .selected-class {
        color: #014cfa;
        background-color: #f4f5f7;
        position: relative;
      }
    }
    
  }
  </style>
  
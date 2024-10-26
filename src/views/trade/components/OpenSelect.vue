<template>
    <div class="openSelect">
      <div class="detail-update-title">保证金模式</div>
      <div class="select-box">
        <div class="select-box-item"  v-for="i in option1" :class="{'selected-class': selectedOption === i.value}"  :key="i.value"  @click="smallSelect(i.value)">
            {{ i.text }}
            <Icon v-if="selectedOption === i.value"  class="check_icon" name="success" />
        </div>
      </div>
      
    </div>
  </template>
  
  <script setup>
  import {  Icon } from "vant"
  import { ref, computed } from "vue";
  import store from "@/store";
  
  const option1 = [
    { text: "全仓", value: 0 },
    { text: "逐仓", value: 1 },
  ];
  const selectedOption = ref(store.state.allSelect)
  
  const smallSelect = (val)=>{
    //下拉框点击选择
    selectedOption.value = val
    store.commit('setAllSelect',val)
    store.dispatch('closePopup')
  }
  
  </script>
  
  <style lang="less">
  .openSelect {
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
    .transfer_dialog_item {
        overflow: auto;
        height: 1.12rem;
        display: flex;
        align-items: center;
        justify-content: center;
        border-bottom: 1px solid #F5F5F5;
    }

    .select-box {
      padding:  0 0.3rem;
      margin-top: 0.7rem;
      .select-box-item {
        overflow: auto;
        height: 1.12rem;
        display: flex;
        align-items: center;
        justify-content: center;
        border-bottom: 1px solid #F5F5F5;
        // background-color: #f2f2f2;
      }
      .selected-class {
        color: #014CFA;
        font-weight: 600;

        .check_icon {
            position: absolute;
            right: 0.64rem;
            color: #014CFA;
            font-size: 0.28rem;
        }
      }
    }

    .checkmark {
      width: 0;
      height: 0;
      border-top: 0.4rem solid #1a59f6;
      border-left: 0.4rem solid transparent;
      position: absolute;
      top: 0;
      right: 0;
      &:after {
        content: "✓";
        position: absolute;
        top: -0.6rem;
        right: 0px;
        color: white;
        font-size: 0.24rem;
        font-weight: normal;
      }
    }
    
  }
  </style>
  
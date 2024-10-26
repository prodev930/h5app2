<template>
  <div class="order-detail">
    <div class="detail-title">
      订单详情
    </div>

    <Loading v-show="loading" type="spinner" class="position-loading"></Loading>
    <div v-show="!loading">
      <div class="detail-t-title">
      <div class="detail-flex">
        <div class="detail-flex-title">
          可售股票
        </div>
        <div class="detail-num" style="color: #014CFA;margin-top: 0.38rem;">
          {{ detaiList.unsold_volume }}
        </div>
      </div>
      <div class="detail-flex">
        <div class="detail-flex-title">
          盈亏/盈亏比
        </div>
        <div class="detail-num" style="color: #e8503a; margin-top: 0.06rem;">
          {{ detaiList.profit }}
        </div>
        <div class="detail-num" style="color: #e8503a;">
          {{ detaiList.ratio }}
        </div>
      </div>
    </div>

    <div class="dashed-line"></div>

    <div class="detail-body">
      <div class="detail-box">
        <div class="left-text">
          订单号
        </div>
        <div class="right-text">
          <span style="vertical-align: middle;">{{ detaiList.order_no  }}</span>
          <img src="/static/img/trade/copy.png" alt="" class="copy-img">
        </div>
      </div>

      <div class="detail-box">
        <div class="left-text">
          股票
        </div>
        <div class="right-text" style="line-height: 0.45rem;">
          <div>
            {{ detaiList.symbol }}
          </div>
          <div style="color: #9ea3ae;">
            Ador Welding Limited
          </div>
        </div>
      </div>

      <div class="detail-box">
        <div class="left-text">
          开仓
        </div>
        <div class="right-text" style="display: flex;">
          <div class="detail-flex-1 detail-red-box" v-if="detaiList.offset === 'long' ">
            买涨
          </div>
          <div class="detail-flex-1 detail-green-box" v-else>
            买跌
          </div>
          <div class="detail-flex-1 detail-blue-box">
            {{ detaiList.lever_type ==='cross'?'全仓':'逐仓 ' }}
          </div>
          <div class="detail-flex-1">
            {{detaiList.lever}}X
          </div>
        </div>
      </div>


      <div class="detail-box">
        <div class="left-text">
          价格
        </div>
        <div class="right-text" style="display: flex;" v-if="detaiList.price_type === 'limit'">
          <div class="detail-flex-1">
          </div>
          <div class="detail-flex-1 detail-blue-box">
            限价
          </div>
          <div class="detail-flex-1">
            {{ detaiList.price }}
          </div>
        </div>
        <div class="right-text" v-else>
          <div class="win-lose-box">
            市价
          </div>
        </div>
      </div>


      <div class="detail-box">
        <div class="left-text">
          开仓数量
        </div>
        <div class="right-text">
          {{ detaiList.open_volume }}
        </div>
      </div>

      <div class="detail-box">
        <div class="left-text">
          手续费
        </div>
        <div class="right-text">
          {{ detaiList.fees }}
        </div>
      </div>

      <div class="detail-box">
        <div class="left-text">
          止赢/止损
        </div>
        <div class="right-text">
          <div class="win-lose-box">
            {{detaiList.stop_loss_price > 0 || detaiList.stop_loss_price && detaiList.stop_loss_price.length > 0 ? '有':"无"}}
          </div>
        </div>
      </div>

      <div class="detail-box">
        <div class="left-text">
          订单价值
        </div>
        <div class="right-text">
          
        </div>
      </div>

      <div class="detail-box">
        <div class="left-text">
          保证金
        </div>
        <div class="right-text">
          {{ detaiList.margin }}
        </div>
      </div>

      <div class="detail-box">
        <div class="left-text">
          持仓利息
        </div>
        <div class="right-text">
          
        </div>
      </div>
      
    </div>

    <div style="position: relative;">
      <div class="risk-line">
        <div>
          逐仓风险线
        </div>
        <div class="prcent-num">
          ----
        </div>
      </div>

      <div class="risk-line-dashed"></div>

      <div class="all-risk-line">
        <div class="risk-text">
          全仓风险线
        </div>
        <div class="prcent-num" style="font-weight: 500;font-size: 0.28rem;">
          ----
        </div>
      </div>
    </div>

    <div style="padding: 0 0.32rem;">
      <Button size="large" color="#014cfa" round style="margin-bottom: 0.32rem;" @click="updateClosePositionPopup">平仓</Button>
      <Button size="large" color="#f2f2f2" round style="margin-bottom: 0.32rem;color: #999999;" @click="updateDetailPopup">订单更新</Button>
    </div>

    </div>

   
    

    
    

  </div>
</template>

<script setup>
  import { ref, computed, onMounted } from "vue";
  import { Button, Loading } from 'vant';
  import { _stocksGet } from "@/api/api";
  import OrderUpdate from "./OrderUpdate.vue";
  import OrderClosePosition from "./OrderClosePosition.vue";
  import store from "@/store";

  const detaiList = ref({})
  const order_no = computed(() => store.state.orderNo);

  const loading = ref(true)

  const getData = () =>{
    _stocksGet({ order_no: order_no.value}).then(res => {
        if (res.code == 200) {
          detaiList.value = res.data
          loading.value = false
        }
        loading.value = false
    });
  }

  onMounted(() => {
    getData()
  });


  const updateClosePositionPopup = () => {
    store.dispatch('closePopup')
    //平仓
    store.dispatch('openPopup',OrderClosePosition)
    store.commit('setPopupHeight','90%')
    store.commit('setkeyborader',true)
  };


  const updateDetailPopup = () => {
    store.dispatch('closePopup')
    //更新
    store.dispatch('openPopup',OrderUpdate)
    store.commit('setPopupHeight','90%')
    store.commit('setkeyborader',true)
  };

</script>

<style lang="less">
  .order-detail {
    .position-loading {
      margin-top: 2rem !important;
      .van-loading__spinner {
        left: 47%;
      }
    }
    .detail-title {
      text-align: center;
      margin-top: 0.4rem;
      color: #121826;
      font-size: 0.32rem;
      font-style: normal;
      font-weight: 500;
      line-height: 0.44rem;
      margin-bottom: 0.36rem;
    }
    .van-popup__close-icon--top-right {
      top: 0.4rem;
    }
    .detail-t-title {
      display: flex;
      margin-bottom: 0.44rem;
      .detail-flex {
        flex: 1;
        .detail-flex-title {
          color: #9EA3AE;
          text-align: center;
          font-size: 0.28rem;
          font-style: normal;
          font-weight: 400;
          line-height: 0.48rem;
        }
        .detail-num {
          text-align: center;
          font-size: 0.52rem;
          font-style: normal;
          font-weight: 600;
          line-height: 0.56rem;
        }
      }
    }
    .dashed-line {
      width: 3.44rem;
      border-bottom: 0.02rem dashed #cbcbcb;
      margin: auto;
    }

    .detail-body {
      padding: 0 0.32rem;
      .detail-box {
        display: flex;
        border-bottom: 0.02rem solid #f5f5f5;
        height: 1rem;
        width: 100%;
        .left-text {
          width: 2rem;
          color: #8F92A1;
          text-align: left;
          font-size: 0.28rem;
          font-style: normal;
          font-weight: 400;
          line-height: 1rem;
        }
        .right-text {
          flex: 1;
          color: #121826;
          text-align: right;
          font-size: 0.28rem;
          font-style: normal;
          font-weight: 500;
          line-height: 1rem;
          position: relative;
          .win-lose-box {
            width: 1.16rem;
            height: 0.44rem;
            color: #014CFA;
            background-color: #ecf1fe;
            position: absolute;
            right: 0;
            line-height: 0.44rem;
            text-align: center;
            top: 0.28rem;
          }
          .copy-img {
            display: inline-block;
            width: 0.3rem !important;
            height: 0.3rem !important;
            vertical-align: middle;
            margin-left: 0.1rem;
          }
        }
        .detail-flex-1 {
          flex: 1;
        }
        .detail-red-box {
          width: 1.16rem;
          height: 0.44rem;
          background-color: #fbf1ef;
          color: #e8503a;
          margin: auto;
          text-align: center;
          line-height: 0.44rem;
        }
        .detail-green-box {
          width: 1.16rem;
          height: 0.44rem;
          background-color: #eff9f2;
          color: #18b762;
          margin: auto;
          text-align: center;
          line-height: 0.44rem;
        }
        .detail-blue-box {
          width: 1.16rem;
          height: 0.44rem;
          background-color: #ecf1fe;
          color: #014cfa;
          margin: auto;
          text-align: center;
          line-height: 0.44rem;
          margin-left: 0.18rem;
        }
      }
    }
    .risk-line {
      display: flex;
      justify-content: right;
      margin-top: 0.6rem;
      color: #014CFA;
      font-size: 0.24rem;
      font-style: normal;
      font-weight: 400;
      line-height: 0.36rem;
    }
    .prcent-num {
      font-weight: 600;
      margin-left: 0.26rem;
      font-size: 0.36rem;
      margin-right: 0.32rem;
      width: 1rem;
      text-align: right;
    }
    .risk-line-dashed {
      width: 3.44rem;
      border-bottom: 0.02rem dashed #cbcbcb;
      position: absolute;
      right: 0.32rem;
      top: 0.42rem;
    }
    .all-risk-line {
      display: flex;
      justify-content: right;
      margin-top: 0.1rem;
      margin-bottom: 1.46rem;
      .risk-text {
        color: #333;
        text-align: center;
        font-size: 0.24rem;
        font-style: normal;
        font-weight: 400;
        line-height: 0.36rem;
      }
    }
  }
</style>
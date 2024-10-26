<template>
  <div class="open-position">
    <div class="position-header">
      <div class="btn flex">
        <div class="up-botton" :style="isUpActive ? activeBackgroundImageStyle : backgroundImageStyle"
          @click="activateUp">
          买涨
        </div>
        <div class="down-button" :style="isDownActive
          ? activeBlueBackgroundImageStyle
          : blueBackgroundImageStyle
          " @click="activateDown">
          买跌
        </div>
      </div>

      <div class="position-tabs">
        <Tabs class="tabs" v-model="active" :swipeable="false" animated :color="'#014CFA'" shrink @change="onChange">
          <Tab title="市价" name="0"> </Tab>
          <Tab title="限价" name="1"> </Tab>
          <Tab title="止盈/止损" name="2"> </Tab>
        </Tabs>
      </div>
    </div>



    <transition :name="transitionName">
      <div v-if="active === '1'">
        <Loading v-show="loading" type="spinner" class="position-loading"></Loading>
        <div v-show="!loading">
          <span class="grop-title">价格</span>
          <!-- <Field v-model="priceValue" :class="['num-input', { 'focusinput': isFocused === 1 }]"
            style="margin-bottom: 0.2rem" type="number" @focus="handleFocus(1)"
            @blur="handleBlur(1)" placeholder="满足价格才能成交" /> -->
          <div class="animate-input num-input flex left-text"
            :class="{ hasval: !!priceValue, inputFocus: isFocused === 1 }">
            <div class="ipt_tip" v-if="isFocused === 1 || !priceValue">满足价格才能成交</div>
            <input v-model="priceValue" type="number" @focus="handleFocus(1)" @blur="handleBlur(1)" placeholder="">
            <div class="link-text cur-price" @click="setCurPrice">市价</div>
          </div>
          <Common @update-value="handleUpdateValue" ref="childComponentRef" @already="already"
            :priceValue="priceValue" />
        </div>

      </div>

      <div v-else-if="active === '2'">
        <Loading v-show="loading" type="spinner" class="position-loading"></Loading>
        <div v-show="!loading">
          <div class="right-text m-t-5"><span class="link-text" @click="setMode">{{ !mode ? '简单模式' : '复杂模式' }}</span>
          </div>
          <template v-if="mode">
            <div class="left-text grop-title m-b-5">止损</div>
            <Field v-model="loseValue" :class="['num-input', { 'focusinput': isFocused === 2 }]" input-align="right"
              style="margin-bottom: 0.2rem" @focus="handleFocus(2)" @blur="handleBlur(2)" />

            <span class="grop-title">价格</span>
            <div style="display: flex">
              <Field v-model="marketValue" style="margin-bottom: 0.2rem"
                :class="['price-num-input', { pricenlarged: !marketprice }, { 'focusinput': isFocused === 3 }]"
                :disabled="!marketprice" @focus="handleFocus(3)" @blur="handleBlur(3)" />
              <div :class="['market-button', { marketenlarged: marketprice }]" @click="changePrice">
                {{ marketprice ? '限价' : '市价' }}
              </div>
            </div>
          </template>
          <template v-else>
            <div class="left-text grop-title m-b-5">止盈</div>
            <div class="flex flex-between">
              <div class="small-select" @click="allModeSelect">
                <div class="abs-con">
                  <span style="margin-left: 0.2rem">{{ selectedModeObj.text }}</span>
                  <img src="/static/img/trade/down.png" class="down-img" />
                </div>
              </div>

              <div class="animate-input num-input flex" :class="{ hasval: !!numValue, inputFocus: isFocused === 5 }">
                <div class="ipt_tip" v-if="isFocused === 5 || !numValue">止盈触发价格类型</div>
                <input v-model="numValue" type="number" @input="inputChange" @focus="handleFocus(5)"
                  @blur="handleBlur(5)" ref="buyNumRef" placeholder="">
              </div>
            </div>
            <div class="left-text grop-title m-t-10 m-b-5">止损</div>
            <div class="flex flex-between">
              <div class="small-select" @click="allModeSelect">
                <div class="abs-con" style="width: 95%;">
                  <span style="margin-left: 0.2rem">{{ selectedModeObj2.text }}</span>
                  <img src="/static/img/trade/down.png" class="down-img" />
                </div>
              </div>

              <div class="animate-input num-input flex" :class="{ hasval: !!numValue, inputFocus: isFocused === 5 }">
                <div class="ipt_tip" v-if="isFocused === 5 || !numValue">止损触发价格类型
                </div>
                <input v-model="numValue" type="number" @input="inputChange" @focus="handleFocus(5)"
                  @blur="handleBlur(5)" ref="buyNumRef" placeholder="">
              </div>
            </div>
          </template>
          <Common @update-value="handleUpdateValue" ref="childComponentRef" @already="already" :loseValue="loseValue"
            :marketValue="marketValue" :marketprice="marketprice" />
        </div>
      </div>

      <div v-else>
        <Loading v-show="loading" type="spinner" class="position-loading"></Loading>
        <div v-show="!loading">
          <Common @update-value="handleUpdateValue" ref="childComponentRef" @already="already" />
        </div>
      </div>
    </transition>

    <!-- <div class="position-box" v-if="!loading"> -->


    <!-- </div> -->

  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch, nextTick, defineExpose } from "vue";
import { Tab, Tabs, Field, CellGroup, Slider, Button, Loading, Popup, showToast } from "vant";
import { _search, _basic, _walletBalance, _commToken } from "@/api/api";
import { useRouter, useRoute } from "vue-router";
import OpenPositionPopup from "./OpenPositionPopup";
import ModeSelect from "./components/ModeSelect.vue";
import OpenSelect from "./components/OpenSelect.vue";
import LeverSelect from "./components/LeverSelect.vue";
import StockPopup from './StockPopup.vue'
import store from "@/store";
import Decimal from 'decimal.js';
import Common from './components/Common.vue'

const token = computed(() => store.state.token);
const router = useRouter();

const backgroundImageStyle = computed(() => ({
  backgroundImage: `url(/static/img/trade/light-blue.svg)`,
  color: "#034cfa",
}));

const activeBackgroundImageStyle = computed(() => ({
  backgroundImage: `url(/static/img/trade/left-blue.svg)`,
  color: "white",
}));

const activeBlueBackgroundImageStyle = computed(() => ({
  backgroundImage: `url(/static/img/trade/blue.svg)`,
  color: "white",
}));

const blueBackgroundImageStyle = computed(() => ({
  backgroundImage: `url(/static/img/trade/right-white.svg)`,
  color: "#034cfa",
}));
const currentSymbol = computed(() => {
  return store.state.currentSymbol
})

const active = ref('0');
const previousActive = ref('0');

const value = ref("");
const priceValue = ref("");
const loseValue = ref("");
const marketValue = ref("");
const sliderValue = ref(0);
const loading = ref(false);
const percentages = [25, 50, 75, 100];
const stockCo = ref([]);
const showOpenPositionBottom = ref(false);
const showLeverSelect = ref(false)
const selectedModeObj = ref({ text: "价格", value: 'price' })
const selectedModeObj2 = ref({ text: "百分比", value: 'price' })
const option1 = [
  { text: "全仓", value: 0 },
  { text: "逐仓", value: 1 },
];

const option2 = ref([]);
const roundedQuantity = ref(0)

//数量输入框的值
const minOrder = ref('')
const numValue = ref('')
const increment = ref(0)
const lastValidValue = ref(0); // 保存上一个有效值

const isUpActive = computed(() => {
  return store.state.isUpActive
});
const isDownActive = computed(() => {
  return store.state.isDownActive
});

const paymentAmount = ref(0)
const stockPrice = ref(0)
const amount = ref(0)

//手续费
const openfee = ref(0)
const closefee = ref(0)
const mode = ref(true)
const ofee = ref(0)
const cfee = ref(0)
const setMode = () => {
  mode.value = !mode.value;
}
//修改市价和限价
const marketprice = ref(false)

const isFocused = ref();
const childComponentRef = ref(null);


const selectedOptionText = computed(() => {
  const selected = option1.find(option => option.value === store.state.allSelect)
  return selected ? selected.text : ''
})

const selectedLeverOptionText = computed(() => {
  const selected = option2.value.find(option => option.value === store.state.selectedLeverOption)
  return selected ? selected.text : ''
})

const selectedLeverOption = computed(() => {
  return store.state.selectedLeverOption
})

const chooseSymbol = computed(() => {
  return store.state.chooseSymbol
})

const previousChooseSymbol = computed(() => {
  return store.state.previousChooseSymbol
})


//点击左边的侧边栏，修改股票 input
const handleSymbolChange = () => {
  if (chooseSymbol.value !== previousChooseSymbol.value && chooseSymbol.value.length > 0) {
    loading.value = true
  }
};
watch(chooseSymbol, handleSymbolChange, { immediate: true });


const activateUp = () => {
  store.commit('setActive', true)
};

const activateDown = () => {
  store.commit('setActive', false)
};

const onSliderChange = (newValue) => {
  //滚动滑动条
  sliderValue.value = newValue;
  getnumval(newValue)
};

const getnumval = (newValue) => {
  //根据滑动条计算数量输入框中的值
  try {
    const percentage = new Decimal(newValue).div(100);
    const calculatedValue = percentage.mul(roundedQuantity.value);

    // 百位数取整
    const roundedValue = calculatedValue.div(100).floor().mul(100);
    numValue.value = roundedValue.toNumber();

    if (numValue.value !== 0 || numValue.value !== '') {
      getPay()
    }

  } catch (error) {
    console.error('Error calculating value:', error);
  }
}

const getPay = () => {
  //保证金 数量*股票单价/杠杆
  if (numValue.value != '' && numValue.value) {
    const result = new Decimal(numValue.value)
      .mul(stockPrice.value)
      .div(selectedLeverOption.value)
      .toFixed(2);
    paymentAmount.value = result
    //手续费计算
    //开仓手续费  数量*手续费
    openfee.value = new Decimal(numValue.value).mul(ofee.value).toFixed(2);
    //平仓手续费
    closefee.value = new Decimal(cfee.value).mul(numValue.value).toFixed(2);
    amount.value = new Decimal(numValue.value)
      .mul(stockPrice.value)
      .div(selectedLeverOption.value)
      .plus(new Decimal(numValue.value).mul(ofee.value))
      .toFixed(2);
  }
}

const transitionName = ref('slide-left');


watch([active], ([newActive]) => {
  if (previousActive.value === '0' && newActive === '1') {
    transitionName.value = 'slide-right';
  } else if (previousActive.value === '1' && newActive === '0') {
    transitionName.value = 'slide-left';
  } else if (previousActive.value === '1' && newActive === '2') {
    transitionName.value = 'slide-right';
  } else if (previousActive.value === '2' && newActive === '1') {
    transitionName.value = 'slide-left';
  } else if (previousActive.value === '2' && newActive === '0') {
    transitionName.value = 'slide-left';
  } else if (previousActive.value === '0' && newActive === '2') {
    transitionName.value = 'slide-right';
  }
});


const handleFocus = (val) => {
  isFocused.value = val
};

const handleBlur = (val) => {
  isFocused.value = null
};

const onChange = (val) => {
  previousActive.value = active.value;
  active.value = val;
  // store.commit('clearState')
  value.value = ''
  priceValue.value = ''
  loseValue.value = ''
  marketValue.value = ''
  marketprice.value = false
  clearChild()
  store.commit('setCurrentActive', val)

  if (token.value) {
    // loading.value = true;
  } else {
    // loading.value = true;

    // setTimeout(()=>{
    //   loading.value = false;
    // },500)
  }

};

const clearChild = () => {
  if (childComponentRef.value) {
    childComponentRef.value.clear();
  }
}


const already = () => {
  loading.value = false;
}


const getslide = () => {
  //滑动条值
  if (numValue.value && numValue.value !== 0 && new Decimal(numValue.value)) {
    if (new Decimal(numValue.value).gt(roundedQuantity.value)) {
      sliderValue.value = 100
      return
    }
    if (roundedQuantity.value.div(new Decimal(numValue.value)).floor() == 1) {
      sliderValue.value = 100
    } else {
      sliderValue.value = new Decimal(numValue.value).div(roundedQuantity.value).mul(100).floor();
    }
  }
}


const jump = (name) => {
  router.push({
    name,
    query: { reurl: 'trade', redata: '1' }
  });
};
const setCurPrice = () => {
  priceValue.value = currentSymbol.value.stockPrice
}

const handleUpdateValue = (value) => {
  const data = {
    'active': active.value,
    'priceValue': priceValue.value,
    'marketValue': marketValue.value,
    'marketprice': marketprice.value,
    'loseValue': loseValue.value
  }
  store.commit('setUpOrder', { ...data, ...value });
  //买涨按钮
  store.dispatch('openPopup', OpenPositionPopup)
  store.commit('setPopupHeight', '90%')
  store.commit('setkeyborader', true)
  getcommToken()
}

const getcommToken = () => {
  //点击按钮获取 token
  store.dispatch('updateSessionToken')
}

const allSelect = () => {
  store.dispatch('openPopup', OpenSelect)
  store.commit('setPopupHeight', '30%')
  store.commit('setkeyborader', false)
}
const allModeSelect = () => {
  store.dispatch('openPopup', ModeSelect)
  store.commit('setPopupHeight', '30%')
  store.commit('setkeyborader', false)
}

const leverSelect = () => {
  // showLeverSelect.value = !showLeverSelect.value
  store.dispatch('openPopup', LeverSelect)
  store.commit('setPopupHeight', '50%')
  store.commit('setkeyborader', false)
}

const inputChange = () => {
  if (numValue.value == '' || !numValue.value) {
    numValue.value = minOrder.value
  }
  getslide()
  getPay();
}

const changePrice = () => {
  marketprice.value = !marketprice.value
  marketValue.value = ''
}

// const openPopup = () => {
//   store.dispatch('openPopup', StockPopup)
//   store.commit('setPopupHeight', '80%')
//   store.commit('setkeyborader', false)
// }


defineExpose({
  clearChild,
});


</script>

<style lang="less">
.open-position {
  color: #333;
  margin: 0 0.3rem;
  padding-bottom: 0.76rem;
  background-color: white;

  // .van-loading {
  //   left: 47%;
  //   margin-top: 2rem !important;
  // }
  .position-loading {
    margin-top: 2rem !important;

    .van-loading__spinner {
      left: 47%;
    }
  }

  .btn {
    margin-top: .1rem;
  }

  .position-header {
    display: flex;
    justify-content: center;
    align-content: center;

    .up-botton {
      width: 1.2rem;
      color: #014cfa;
      height: .58rem;
      line-height: .58rem;
      text-align: center;
      position: relative;
      background-size: 100% 100%;
      background-position: top;
      background-repeat: no-repeat;
    }

    .down-button {
      width: 1.2rem;
      height: .58rem;
      line-height: .58rem;
      color: white;
      text-align: center;
      background-size: 100% 100%;
      background-position: top;
    }

    .position-tabs {
      width: 4.4rem;
      margin-left: 0.12rem;
      overflow: hidden;

      .tabs .van-tab {
        margin-left: 0.2rem !important;
      }
    }
  }

  .fade-enter-active,
  .fade-leave-active {
    transition: opacity 0.5s;
  }

  .fade-enter-from,
  .fade-leave-to {
    opacity: 0;
  }

  .grop-title {
    text-align: center;
    font-size: 0.28rem;
    font-style: normal;
    font-weight: 400;
    line-height: 0.36rem;
  }

  .m-b-5 {
    margin-bottom: .1rem;
  }

  .m-t-5 {
    margin-top: .1rem;
  }

  .m-t-10 {
    margin-top: .2rem;
  }

  // .position-box {
  .stock-input {
    width: 100%;
    height: 1.14rem;
    border-radius: 0.12rem;
    border: 0.02rem solid #d0d8e2;
    margin: 0.2rem 0;
  }

  .stock-input-text {
    .van-field__control {
      text-align: center;
      caret-color: #014cfa;
    }
  }

  .animate-input {
    position: relative;
    border: 1px solid #D0D8E2;
    border-radius: 0.12rem;
    height: 100%;
    transition: all 1s;
    padding: 0.1rem;

    &.symbol-name {
      .matchName {
        top: 0.33rem;
        left: 0.13rem;
        position: absolute;
        border: none;
        height: 0.68rem;
        line-height: 0.68rem;
        z-index: 0;
        color: #b7b7b7;

        .keyword {
          color: #fff;
          font-weight: normal;
        }
      }

      input {
        position: relative;
        z-index: 1;
      }
    }

    .ipt_tip {
      position: absolute;
      left: 0;
      top: 0;
      padding: .1rem 0 0 .2rem;
      pointer-events: none;
      color: #9ea3ae;
      text-align: left;
      width: 100%;
      line-height: .66rem;
      font-size: 0.24rem;
      z-index: 0;
      transition: all .2s;
    }

    input {
      width: 100%;
      height: 100%;
    }

    &.hasval {
      .ipt_tip {
        display: none;
      }
    }

    &.inputFocus {
      padding-top: .3rem;
      border: 1px solid #014CFA;
      height: 1.1rem;

      .ipt_tip {
        display: block;
        right: 0;

        line-height: .2rem;
        font-size: 0.2rem;
      }

      input {
        width: 100%;
        height: .68rem;
        text-align: left;
      }
    }
  }

  .small-select {
    width: 1.72rem !important;
    height: auto !important;
    border-radius: 0.12rem;
    border: 0.02rem solid #d0d8e2;
    position: relative;
    color: #333333;
    position: relative;
    line-height: auto !important;

    .abs-con {
      display: flex;
      width: 80%;
      height: .3rem;
      line-height: auto !important;
      position: absolute;
      top: 0;
      bottom: 0;
      left: 0;
      right: 0;
      text-align: center;
      margin: auto;
    }
  }

  .select-box {
    .select-box-item {
      width: 1.48rem;
      height: 0.88rem;
      line-height: 0.88rem;
      margin-left: 0.2rem;
    }

    .bigslect {
      width: 100%;
      text-align: center;
      padding-right: 0.4rem;
    }

    .selected-class {
      color: #1e5eff;
    }
  }

  .num-input {
    width: 100%;
    height: 0.88rem;
    border-radius: 0.12rem;
    border: 0.02rem solid #d0d8e2;
    transition: all 0.3s ease;

    &.border_item {
      input {
        width: 100%;
        height: 100%;
        text-align: center;
      }
    }
  }

  .cur-price {
    text-align: center;
    width: 1rem;
    line-height: .66rem;
  }

  .link-text {
    color: #014CFA;
  }

  .left-text {
    text-align: left;
  }

  .price-num-input {
    width: 4.9rem;
    height: 0.88rem;
    border-radius: 0.12rem;
    border: 0.02rem solid #d0d8e2;
    margin-top: 0.2rem;
    background: white;
  }

  .pricenlarged {
    background: #f9fafb;
  }

  .right-text {
    text-align: right;
  }

  .market-button {
    width: 1.9rem;
    height: 0.72rem;
    border-radius: 1.26rem;
    background: #f2f2f2;
    text-align: center;
    line-height: 0.72rem;
    color: #999;
    text-align: center;
    font-size: 0.28rem;
    font-style: normal;
    font-weight: 600;
    margin-left: 0.16rem;
    margin-top: 0.28rem;
    cursor: pointer;
  }

  .marketenlarged {
    background: #014cfa;
    color: white;
  }

  // .num-right-text {
  //   .van-field__control {
  //     text-align: right;
  //   }
  // }

  .small-select {
    width: 1.48rem;
    height: 0.88rem;
    flex-shrink: 0;
    border-radius: 0.12rem;
    border: 0.02rem solid #d0d8e2;
    margin-right: 0.24rem;
    // line-height: 0.88rem;
    position: relative;
    color: #333333;
  }

  .select-box {
    .select-box-item {
      width: 1.48rem;
      height: 0.88rem;
      line-height: 0.88rem;
      margin-left: 0.2rem;
    }

    .bigslect {
      width: 100%;
      text-align: center;
      padding-right: 0.4rem;
    }

    .selected-class {
      color: #1e5eff;
    }
  }

  .van-dropdown-menu__title:after {
    border-color: transparent transparent #333333 #333333;
  }

  .van-dropdown-menu__title {
    padding-left: 0;
  }

  .van-overlay {
    background-color: transparent;
  }

  .van-dropdown-item {
    z-index: 9999 !important;
  }

  .big-selcet {
    width: 100%;
    height: 0.88rem;
    border-radius: 0.12rem;
    border: 0.02rem solid #d0d8e2;
    line-height: 0.88rem;
    text-align: center;
    position: relative;
    color: #333333;
  }

  .down-img {
    display: inline-block;
    width: 0.32rem !important;
    height: 0.32rem !important;
    vertical-align: middle;
    position: absolute;
    right: 0.2rem;
    // top: 0.28rem;
  }

  // }
  .position-account {
    margin: 0.1rem 0 .3rem 0;
    text-align: right;
    color: #8f92a1;
    font-size: 0.28rem;
    font-style: normal;
    font-weight: 400;
    line-height: 0.48rem;
  }

  .position-bottom {
    text-align: right;
    margin-top: 0.8rem;
    position: relative;

    .position-pay {
      color: #014cfa;
      font-size: 0.28rem;
      font-style: normal;
      font-weight: 600;
      line-height: 0.48rem;
      vertical-align: middle;
    }

    .pay-num {
      color: #014cfa;
      text-align: right;
      font-size: 0.36rem;
      font-style: normal;
      font-weight: 600;
      line-height: 0.56rem;
      vertical-align: middle;
    }

    .position-line-dashed {
      width: 3.44rem;
      border-bottom: 0.02rem dashed #cbcbcb;
      position: absolute;
      right: 0;
      top: 0.5rem;
    }

    .position-fee {
      margin-top: 0.1rem;
      color: #333;
      font-size: 0.24rem;
      font-style: normal;
      font-weight: 400;
      line-height: 0.36rem;
      margin-bottom: 0.76rem;
    }
  }

  .custom-button {
    width: 0.06rem;
    height: 0.48rem;
    background: #014cfa;
  }

  .percentages {
    display: flex;
    justify-content: space-between;
    margin-top: 0.2rem;
    width: 100%;
    z-index: 7;

    .line {
      width: 0.06rem;
      height: 0.2rem;
      position: absolute;
      right: 0;
      top: -.5rem;
      background: #fff;
      z-index: 88;
    }
  }

  .percentage {
    color: #8f92a1;
    font-size: 0.28rem;
    font-style: normal;
    font-weight: 400;
    text-align: center;
    width: 25%;
    position: relative;
  }

  .purchase-amount {
    margin-top: 0.2rem;
    color: #333;
    font-size: 0.32rem;
  }

  .van-slider {
    margin-top: 0.1rem;
    height: 0.16rem !important;
    border-radius: 0.02rem;
  }

  .van-slider__bar {
    position: relative;
  }

  .van-slider__button {
    width: 0.06rem;
    height: 0.48rem;
    background-color: #014cfa;
    border-radius: inherit;
    top: -0.36rem;
  }

  .van-slider__button-wrapper {
    z-index: 999 !important;
  }

  input:focus {
    color: #014cfa;
    caret-color: #014cfa;
    /* 光标颜色 */
  }

  input:focus::placeholder {
    // color: #014cfa; /* 占位符颜色 */
  }

  .focusinput {
    border-color: #014cfa !important;
  }
}

.detail-popup {
  border-top-left-radius: 0.36rem;
  border-top-right-radius: 0.36rem;
  border-bottom-left-radius: 0;
  border-bottom-right-radius: 0;
  padding-bottom: 1.2rem;
}

.keypadding {
  padding-bottom: 5rem !important;
}

@media (min-width: 751px) {
  .detail-popup {
    max-width: 375px;
    position: fixed !important;
    padding-bottom: 3rem !important;
    left: 50% !important;
    transform: translateX(-50%) !important;
  }
}
</style>

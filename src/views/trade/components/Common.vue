<template>
  <div class="common-open-position">
    <div class="stock-box" style="margin: 0 0px 0.1rem;">
      <span class="grop-title">股票</span>
      <Loading type="spinner" class="stock-img" v-if="loading && stockCo.length == 0" color="#004DFF" />
      <!-- <img src="/static/img/trade/white-stock.png" class="stock-img" v-if="!loading && stockCo.length === 0" /> -->
      <img src="/static/img/trade/blue-stock.png" class="stock-img" v-if="stockCo.length > 0" @click="openPopup" />
    </div>
    <div class="animate-input num-input symbol-name"
      :class="{ hasval: !!value || stockCo.length > 0, inputFocus: isFocused === 4 || value }">
      <div class="ipt_tip">股票代码 </div>
      <input v-model="value" @input="handleInput" @focus="handleFocus(4)" @blur="handleBlur(4)" ref="stockNameRef"
        placeholder="" />
      <div class="matchName" v-html="matchName.symbolHtml"></div>
      <div class="co-text" v-if="stockCo.length > 0 && isFocused !== 4">
        <div>
          {{ stockCo[0].symbol }}
        </div>
        <div style="color: #9ea3ae">
          {{ stockCo[0].name }}
        </div>
      </div>
    </div>
    <!-- <Field v-model="value" :class="[
      'num-input',
      'stock-input-text',
      { enlarged: enlarged },
      { 'focusinput': isFocused === 4 }
    ]" style="margin-bottom: 0.2rem;margin-top: 0.05rem;" @input="handleInput" @focus="handleFocus(4)"
      @blur="handleBlur(4)" placeholder="股票代码">
      <template #button v-if="stockCo.length > 0">
        <div class="co-text">
          <div>
            {{ stockCo[0].symbol }}
          </div>
          <div style="color: #9ea3ae">
            {{ stockCo[0].name }}
          </div>
        </div>
      </template>
</Field>-->
    <div class="flex flex-between" style="margin: .4rem 0 .1rem 0;">
      <div class="grop-title link-text">全仓 VS 逐仓</div>
      <div class="right-input flex flex-between">
        <div class="grop-title right-text">数量</div>
        <span class="btn_icon">
          <span class="grop-title link-text mr-10" @click="jump('transfer', true)">账户划转</span>
          <span class="grop-title right-text link-text" @click="jump('loanList', true)">借贷</span>
        </span>

      </div>

    </div>
    <!-- {{ isFocused }}---{{  numValue }} -->
    <div class="flex flex-between">
      <div class="small-select" @click="allSelect">
        <div class="abs-con">
          <span style="margin-left: 0.2rem">{{ selectedOptionText }}</span>
          <img src="/static/img/trade/down.png" class="down-img" />
        </div>
      </div>

      <div class="animate-input num-input flex" :class="{ hasval: !!numValue, inputFocus: isFocused === 5 }">
        <div class="ipt_tip" v-if="isFocused === 5 || !numValue">≤ {{ roundedQuantity }}
        </div>
        <input v-model="numValue" type="number" @input="inputChange" @focus="handleFocus(5)" @blur="handleBlur(5)"
          ref="buyNumRef" placeholder="">
      </div>
    </div>

    <div class="slider-container-box">
      <div class="slider-container">
        <Slider :min="0" :max="100" v-model="sliderValue" bar-height="0.08rem" active-color="#014cfa"
          inactive-color="#f2f2f2" @change="onSliderChange">
          <template #button>
            <div class="slider-custom-num">
              <span class="number" v-show="sliderValue">{{ sliderValue }}%</span>
            </div>
          </template>
        </Slider>
      </div>
    </div>
    <div class="percentages">
      <div v-for="percent in percentages" :key="percent" class="percentage">
        <div class="line"></div>
        {{ percent }}%
      </div>
    </div>

    <!-- <div class="position-bottom">
        <div>
          <span class="position-pay">支付 </span
          ><span class="pay-num">{{ amount }}</span>
        </div>
        <div class="position-line-dashed"></div>
        <div class="position-fee">保证金 {{ paymentAmount }} + 手续费 {{ openfee }}</div>
      </div> -->

    <div class="m-b-5" style="height: .5rem;"></div>
    <Button size="large" color="#e8503a" round v-if="isDownActive && token" :disabled="downdisable(active)"
      @click="openPositPopup('down')">买跌</Button>
    <Button size="large" color="#18b762" round v-if="isUpActive && token" :disabled="downdisable(active)"
      @click="openPositPopup('up')">买涨 </Button>


    <Button size="large" color="#014cfa" round v-if="!token" style="margin-bottom: 0.34rem"
      @click="jump('login')">登陆</Button>
    <Button size="large" color="#f2f2f2" round v-if="!token" style="color: #999999"
      @click="jump('register')">注册</Button>

  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch, nextTick, defineExpose, onUpdated, onBeforeUnmount, onDeactivated, reactive } from "vue";
import { Tab, Tabs, Field, CellGroup, Slider, Button, Loading, Popup, showToast } from "vant";
import { _search, _stocksPara, _basic, _walletBalance, _commToken } from "@/api/api";
import { useRouter, useRoute } from "vue-router";
import OpenPositionPopup from "../OpenPositionPopup";
import OpenSelect from "./OpenSelect.vue";
import LeverSelect from "./LeverSelect.vue";
import StockPopup from '../StockPopup.vue'
import store from "@/store";
import Decimal from 'decimal.js';
// import { debounce } from 'lodash';
const debounce = () => { }

const token = computed(() => store.state.token);
const router = useRouter();
const route = useRoute()
const active = computed(() => store.state.currentActive);
const value = ref('');
// setTimeout(() => {
//   if (value.value) {
//     handleInput()
//   }
// }, 0)
const stockNameRef = ref();
const priceValue = ref("");
const loseValue = ref("");
const marketValue = ref("");
const sliderValue = ref(0);
const loading = ref(false);
const percentages = [25, 50, 75, 100];
const stockCo = ref([]);
const showOpenPositionBottom = ref(false);
const showLeverSelect = ref(false)
const option1 = [
  { text: "全仓", value: 0 },
  { text: "逐仓", value: 1 },
];
const option2 = computed(() => {
  return store.state.option2
})

const roundedQuantity = ref(0)
const saveRoundedQuantity = computed(() => {
  return token.value ? store.state.roundedQuantity : 0
})


const props = defineProps({
  priceValue: '',
  loseValue: '',
  marketValue: '',
  marketprice: false
})

const first = ref(false)

const downdisable = (val) => {
  if (val == '0') {
    if (numValue.value.length === 0 || numValue.value == 0 || stockCo.value.length === 0) {
      return true
    } else {
      return false
    }
  } else if (val == '1') {
    if (numValue.value.length === 0 || numValue.value == 0 || stockCo.value.length === 0 || props.priceValue == '') {
      return true
    } else {
      return false
    }
  } else if (val == '2') {
    if (numValue.value.length === 0 || numValue.value == 0 || stockCo.value.length === 0 || props.loseValue == '' || (props.marketprice && props.marketValue == '')) {
      return true
    } else {
      return false
    }
  }
}

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
const currentNumber = computed(() => { return store.state.currentNumber })

//手续费
const openfee = ref(0)
const closefee = ref(0)
const ofee = ref(0)
const cfee = ref(0)

//修改市价和限价
const marketprice = ref(false)

//输入框变大
const enlarged = ref(false)

const isFocused = ref();
const emit = defineEmits(['update-value', 'already']);

const previousChooseSymbol = computed(() => {
  return store.state.previousChooseSymbol
})


const previousTabSymbol = computed(() => {
  return store.state.previousTabSymbol
})


const selectedOptionText = computed(() => {
  const selected = option1.find(option => option.value === store.state.allSelect)
  return selected ? selected.text : ''
})


const selectedLeverOption = computed(() => {
  return store.state.selectedLeverOption
})

const selectedLeverOptionText = computed(() => {
  const selected = option2.value.find(option => option.value == selectedLeverOption.value)
  return selected ? selected.text : option2.value[0].text
})


const chooseSymbol = computed(() => {
  return store.state.chooseSymbol
})

const currentSymbol = computed(() => {
  return store.state.currentSymbol
})

const currentMinOrder = computed(() => {
  return store.state.minOrder
})

const currentSliderValue = computed(() => {
  return store.state.sliderValue
})
const matchName = reactive({ symbol: '', symbolHtml: '' });
const getPrice = (val) => {
  // let price;
  //获取股票价格
  if (val) {
    const Reg = new RegExp(val, 'i');
    // 发起 API 请求获取股票价格和钱包余额
    loading.value = true
    _search({ symbol: val.toLocaleUpperCase(), mode: 'right' }).then(res => {
      if (res.code == 200 && res.data.length) {
        const symbolStr = res.data[0].symbol;
        matchName.symbol = symbolStr;
        matchName.symbolHtml = symbolStr.replace(Reg, `<b class='keyword'>${val}</b>`);
      }
      loading.value = false
    })
  }
}

// 使用 lodash 的 debounce 函数包装搜索函数
const debouncedSearch = debounce(getPrice, 800);


const getAccount = (price) => {
  let amountNum;
  // 计算可用数量
  if (token.value) {
    _walletBalance({ currency: 'stock' }).then(res => {
      if (res.code == 200) {
        amountNum = new Decimal(res.data[0].amount);
        // amountNum = new Decimal(50000);
        if (price !== undefined && price !== '' && price !== 0 && amountNum !== undefined) {
          const availableQuantity = amountNum.div(stockPrice.value);
          // 取整
          roundedQuantity.value = availableQuantity.floor();
          store.commit('setRoundedQuantity', roundedQuantity.value)
          if (currentNumber.value > minOrder.value) {
            numValue.value = currentNumber.value > 0 ? currentNumber.value : ''
            getslide()
          } else {
            numValue.value = ''
            // numValue.value = minOrder.value
            getslide()
          }

        } else {
          paymentAmount.value = 0
          amount.value = 0
          numValue.value = ''
          roundedQuantity.value = 0
          store.commit('setCurrentNumber', 0)
          store.commit('setRoundedQuantity', new Decimal(0))
          getslide()
        }
        emit('already');
      } else {
        emit('already');
      }
    });
  } else {
    emit('already');
  }
}


getAccount(stockPrice.value || currentSymbol.value.stockPrice)
//点击左边的侧边栏，修改股票 input
const handleSymbolChange = () => {
  if (chooseSymbol.value !== previousChooseSymbol.value && chooseSymbol.value.length > 0) {
    store.commit('setPreviousChooseSymbol', chooseSymbol.value)
    setTimeout(() => {
      enlarged.value = true
      loading.value = true
      stockCo.value = chooseSymbol.value || []
      debouncedSearch(chooseSymbol.value[0].symbol);
    }, 200);
  }
};
watch(chooseSymbol, handleSymbolChange, { immediate: true });


watch([active, currentSymbol], () => {
  //切换顶部 tab，存储股票数据
  setTimeout(() => {
    stockPrice.value = currentSymbol.value.stockPrice || 0;
    stockCo.value = currentSymbol.value.stockCo || []
    if (stockCo.value.length > 0) {
      value.value = '';
    } else {
      value.value = currentSymbol.value.symbol
    }
    if (stockCo.value.length > 0) {
      enlarged.value = true
    }
    if (saveRoundedQuantity.value == 0) {
      roundedQuantity.value = 0
    } else {
      roundedQuantity.value = saveRoundedQuantity.value
    }
    if (new Decimal(roundedQuantity.value).equals(0)) {
      numValue.value = ''
      return
    }

    if (currentNumber.value > currentMinOrder.value && currentMinOrder.value > 0) {
      numValue.value = currentNumber.value
    } else {
      // numValue.value = currentMinOrder.value
    }
    getslide()

  }, 400);
}, { immediate: true })

const onSliderChange = (newValue) => {
  //滚动滑动条
  sliderValue.value = newValue;
  if (new Decimal(roundedQuantity.value).equals(0)) {
    sliderValue.value = 0
  } else {
    getnumval(newValue)
  }
};
const allNumber = () => {
  onSliderChange(100);
}
const getnumval = (newValue) => {
  //根据滑动条计算数量输入框中的值
  try {
    const percentage = new Decimal(newValue).div(100);
    const calculatedValue = percentage.mul(roundedQuantity.value);
    let val = 0;
    if (increment.value) {
      // 百位数取整
      const roundedValue = calculatedValue.div(increment.value).floor().mul(increment.value);
      val = roundedValue.toNumber();
    } else {
      const roundedValue = calculatedValue.div(100).floor().mul(100);
      val = roundedValue.toNumber();
    }
    if (val == 0) {
      numValue.value = ''
    } else {
      numValue.value = val
    }
    store.commit('setCurrentNumber', numValue.value)
  } catch (error) {
    console.error('Error calculating value:', error);
  }
}

const getPay = () => {
  //保证金 数量*股票单价/杠杆
  let lever
  if (selectedLeverOption.value && new Decimal(selectedLeverOption.value) && selectedLeverOption.value != 0) {
    lever = new Decimal(selectedLeverOption.value)
  } else {
    lever = 1
  }
  if (numValue.value != '' && numValue.value != 0) {
    const result = new Decimal(numValue.value)
      .mul(stockPrice.value)
      .div(lever)
      .toFixed(2);
    paymentAmount.value = result
    //手续费计算
    //开仓手续费  数量*手续费
    openfee.value = new Decimal(numValue.value).mul(ofee.value).toFixed(2);
    //平仓手续费
    closefee.value = new Decimal(cfee.value).mul(numValue.value).toFixed(2);
    amount.value = new Decimal(numValue.value)
      .mul(stockPrice.value)
      .div(lever)
      .plus(new Decimal(numValue.value).mul(ofee.value))
      .toFixed(2);
  }
}

const handleInput = () => {
  value.value = value.value.toLocaleUpperCase()
  matchName.symbolHtml = matchName.symbol = ''
  roundedQuantity.value = 0
  numValue.value = ''
  //股票搜索
  getData();
};


const handleFocus = (val) => {
  isFocused.value = val
  if (val == 4) {
    if (stockCo.value[0] && stockCo.value[0].symbol) {
      value.value = stockCo.value[0].symbol;
      setTimeout(() => {
        matchName.symbol = matchName.symbolHtml = value.value
      }, 500);
    }
  }
};

const handleBlur = (val) => {
  isFocused.value = null
  if (val === 5 && numValue.value != '') {
    const numValueDecimal = new Decimal(numValue.value);
    if (numValueDecimal.gt(roundedQuantity.value)) {
      numValue.value = roundedQuantity.value === 0 ? '' : roundedQuantity.value;
      store.commit('setCurrentNumber', numValue.value)
    }
    inputChange()
  }
  if (val == 4) {
    // enlarged.value = false
    if (matchName.symbol) {
      loading.value = true
      const symbol = matchName.symbol;
      _basic({ symbol }).then(res => {
        if (res.code == 200 && res.data) {
          console.log(res.data)
          stockCo.value = [res.data];
          isFocused.value = null
          matchName.symbol = matchName.symbolHtml = value.value = ''
          stockPrice.value = new Decimal(res.data.price);
          stockNameRef.value && stockNameRef.value.blur();
          const data = {
            stockCo: stockCo.value,
            stockPrice: stockPrice.value != '' ? stockPrice.value.toNumber() : '',
            symbol
          }
          store.commit('setCurrentSymbol', data)
          getAccount(stockPrice.value)
          loading.value = false
        } else {
          loading.value = false
          stockCo.value = [];
          stockPrice.value = 0
        }
      })
    } else {
      loading.value = false
    }

  }
}

const clear = () => {
  //输入框清空
  stockCo.value = [];
  roundedQuantity.value = 0
  value.value = ''
  sliderValue.value = 0

  // numValue.value = minOrder.value

  paymentAmount.value = 0
  openfee.value = 0
  amount.value = 0
}

const getData = () => {
  stockCo.value = [];
  stockPrice.value = 0
  //股票搜索
  if (value.value === '') {
    matchName.symbol = matchName.symbolHtml = ''
    loading.value = false
    debouncedSearch.cancel();
  } else {
    if (value.value && value.value.length > 0) {
      debouncedSearch(value.value);
    }
  }

  if (value.value === '') {
    //输入框清空
    const data = {
      stockCo: [],
      stockPrice: '',
      symbol: ''
    }
    store.commit('setCurrentSymbol', data)
    store.commit('setChooseSymbol', [])
    clear()
    return;
  }
  // getPrice(value.value)
};

const getStockslist = () => {
  //交易参数
  // _stocksPara({
  // })
  //   .then((res) => {
  //     if (res.code == 200 && res.data) {
  //       //杠杆参数
  //       const str = res.data.lever;
  //       const lever = str.split(',')
  //       const levernum = lever.map((num, index) => {
  //         return {
  //           text: `${num}x`,
  //           value: `${num}`
  //         };
  //       });
  //       option2.value = levernum
  //       store.commit('setOption2', levernum)
  //       store.commit('setSelectedLeverOption', levernum[0].value)

  //       //volume 最低数量 和倍数增加的处理
  //       const volume = res.data.volume.split(',')
  //       minOrder.value = new Decimal(volume[0]);
  //       increment.value = new Decimal(volume[1]);


  //       store.commit('setMinOrder', minOrder.value)

  //       if (roundedQuantity.value == 0) {
  //         numValue.value = ''
  //         sliderValue.value = 0
  //       } else if (currentNumber.value > minOrder.value) {
  //         numValue.value = currentNumber.value
  //         getslide()
  //       } else if (currentNumber.value < minOrder.value) {
  //         numValue.value = minOrder.value
  //         getslide()
  //       }

  //       //手续费
  //       const fee = res.data.fee.split(',')
  //       ofee.value = new Decimal(fee[0]).plus(new Decimal(fee[2]))
  //       cfee.value = new Decimal(fee[1])

  //       //开仓手续费  数量*手续费
  //       openfee.value = numValue.value ? new Decimal(numValue.value).mul(ofee.value).toFixed(2) : 0;
  //       //平仓手续费
  //       closefee.value = numValue.value ? new Decimal(cfee.value).mul(numValue.value).toFixed(2) : 0;

  //       // emit('already');
  //     }
  //   })

}


const getslide = () => {
  //滑动条值
  if (numValue.value && numValue.value !== 0 && new Decimal(numValue.value) && roundedQuantity.value && !new Decimal(roundedQuantity.value).equals(0)) {
    if (new Decimal(numValue.value).gt(roundedQuantity.value)) {
      sliderValue.value = 100
      return
    }
    sliderValue.value = new Decimal(numValue.value).div(roundedQuantity.value).mul(100).floor();
  } else if (new Decimal(roundedQuantity.value).equals(0)) {
    sliderValue.value = 0
  } else {
    sliderValue.value = 0
  }
  store.commit('setSliderValue', sliderValue.value)
}


onMounted(() => {
  //emit('already');
  if (route.query.symbol) {
    matchName.symbol = value.value = route.query.symbol;
    handleBlur(4)
  }
  getStockslist()

  if (first.value == false) {
    getPrice(currentSymbol.value.symbol)
    first.value = true
  }

});

const jump = (name, needLogin) => {
  let routname = name;
  if (needLogin && !token.value) {
    routname = 'login';
  }
  router.push({
    name: routname,
    query: { reurl: 'trade' }
  });
};

const openPositPopup = async (val) => {
  const numValueDecimal = new Decimal(numValue.value);
  if (numValueDecimal.gt(roundedQuantity.value)) {
    showToast('超出最大可买');
    return
  }

  if (numValueDecimal.lt(minOrder.value)) {
    showToast('低于最小可买');
    return
  }

  if (!numValueDecimal.mod(increment.value).equals(0)) {
    showToast('当前值不是递增量的倍数');
    return
  }

  await getPay()

  //存选择的数据
  const data = {
    'stockCo': stockCo.value,
    'selectedOptionText': selectedOptionText.value,
    'selectedLeverOptionText': selectedLeverOptionText.value,
    'selectedLeverOption': selectedLeverOption.value,
    'numValue': numValue.value,
    'paymentAmount': paymentAmount.value,
    'amount': amount.value,
    'openfee': openfee.value,
    'button': val
  }

  emit('update-value', data);
};

const allSelect = () => {
  store.dispatch('openPopup', OpenSelect)
  store.commit('setPopupHeight', '30%')
  store.commit('setkeyborader', false)
}

const leverSelect = () => {
  // showLeverSelect.value = !showLeverSelect.value
  store.dispatch('openPopup', LeverSelect)
  store.commit('setPopupHeight', '50%')
  store.commit('setkeyborader', false)
}

const inputChange = (val) => {
  if (numValue.value == 0 || !numValue.value) {
    numValue.value = ''
  }
  getslide()
  store.commit('setCurrentNumber', numValue.value)
  // getPay();
}

const changePrice = () => {
  marketprice.value = !marketprice.value
  marketValue.value = ''
}

const openPopup = () => {
  if (!stockCo.value[0]) return
  store.commit('setCurrStock', stockCo.value[0])
  store.dispatch('openPopup', StockPopup)
  store.commit('setPopupHeight', '90%')
  store.commit('setkeyborader', false)
};

// 使用 defineExpose 暴露方法
defineExpose({
  clear
});

</script>

<style lang="less">
.common-open-position {
  padding: .25rem 0;
  padding-bottom: 0.76rem;
  background-color: white;

  // .van-loading {
  //   left: 47%;
  //   margin-top: 2rem !important;
  // }
  .yuan {
    width: 15px;
    height: 15px;
    background-color: #e8503a;
    border-radius: 15px;
    display: inline-block;
    margin-left: 10px;
    vertical-align: top;
  }

  .slider-container-box {
    margin-top: .2rem;
    height: 1rem;
    padding: .4rem 0 0 0;

    .slider-custom-num {
      position: relative;
      background: #014CFA;
      color: #fff;
      display: inline-block;
      width: .05rem;
      height: .5rem;
      font-size: 12px;
      text-align: center;
      line-height: .4rem;
      border-radius: 10px;

      .number {
        color: #014CFA;
        position: absolute;
        top: -0.4rem;
        left: -0.1rem;
        font-size: .2rem;
      }
    }
  }

  [contenteditable="true"]:focus {
    outline: none;
  }

  .setall {
    color: #014cfa;
    // line-height: 0.35rem;
    margin-left: .2rem;
  }

  .position-header {
    display: flex;

    .up-botton {
      width: 1.2rem;
      height: 0.5rem;
      color: #014cfa;
      line-height: 0.59rem !important;
      text-align: center;
      position: relative;
      background-size: 100% 100%;
      background-position: center;
    }

    .down-button {
      width: 1.32rem;
      height: 0.56rem;
      color: white;
      line-height: 0.56rem;
      text-align: center;
      background-size: cover;
      background-position: center;
    }

    .position-tabs {
      width: 4.4rem;
      margin-left: 0.12rem;

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

  .num-input {
    margin-top: 0 !important;
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
  }

  .btn_icon {
    display: flex;
    justify-content: center;
    align-content: center;

    span.flex {
      display: flex;
      flex-wrap: nowrap;
      justify-content: center;
      align-content: center;
      margin-right: 10px;
    }

    img {
      margin: 0 5px 0 0;
      height: 18px !important;
    }
  }

  .flex-between {
    justify-content: space-between;
    align-content: center;
  }

  .right-input {
    width: calc(100% - 2rem);
  }

  .position-account {
    margin: 0.1rem 0 1rem 0;
    text-align: right;
    color: #8f92a1;
    font-size: 0.28rem;
    font-style: normal;
    font-weight: 400;
    line-height: 0.48rem;
    display: flex;
    justify-content: space-between;
    align-content: center;

    .empty-left {
      width: 1rem;
    }
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

  .co-text {
    position: absolute;
    right: .2rem;
    top: .12rem;
    height: .68rem;
    color: #333;
    text-align: right;
    font-size: 0.28rem;
    font-style: normal;
    font-weight: 400;
    z-index: 0;
    pointer-events: none;
  }

  .percentages {
    display: flex;
    justify-content: space-between;
    margin-top: 0 !important;
    width: 98%;
    z-index: 7;
    margin-bottom: 0.8rem;

    .line {
      width: 0.06rem;
      height: 0.2rem;
      position: absolute;
      right: 0;
      top: -1rem;
      background: red;
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
    width: 0.1rem;
    height: 0.48rem;
    background-color: #014cfa;
    border-radius: inherit;
    top: -0.36rem;
  }

  .van-slider__button-wrapper {
    z-index: 999 !important;
    padding: 0.24rem;
  }

  .stock-box {
    display: flex;
    justify-content: space-between;

    .stock-img {
      width: 0.4rem !important;
      height: 0.4rem !important;
    }
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

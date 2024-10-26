<template>
  <div class="subscription">

    <div class="ipo-detail-header">
      <Icon name="arrow-left" class="arrow-left" @click="goTotrade" />
      <span>认购</span>
    </div>

    <span class="grop-title" style="margin-top: 0.6rem;display: block;">认购名称</span>
    <div class="ipo-company-name">{{ ipoDetail.company_name }}</div>
    <!-- <Field v-model="nameVal" input-align="right"  @focus="handleFocus(1)" 
        @blur="handleBlur(1)" :class="['num-input',{'focusinput': isFocused === 1}]"  style="margin-bottom: 0.4rem;"/> -->

    <div class="subscription-m-box" :class="textSelect === '普通申购' ? 'add' : ''">
      <div class="vip-subscription" @click="vipSubscription">
        <span>{{ textSelect }}</span>
        <img src="/static/img/trade/down.png" class="subscription-down-img">
      </div>
      <Field class="vip-input" v-model="vipVal" :disabled="textSelect === '普通申购'" input-align="right"
        :placeholder="placeholderText" />
    </div>

    <span class="grop-title">认购数量</span>
    <Field v-model="numValue" type="number" input-align="right" @input="inputChange" @focus="handleFocus(5)"
      @blur="handleBlur(5)" :class="['num-input', { 'focusinput': isFocused === 5 }]" />

    <div class="position-account">
      可买数量 <span style="color: #333">{{ availableNum }}</span>
    </div>

    <Slider v-model="sliderValue" bar-height="0.08rem" active-color="#014cfa" inactive-color="#f2f2f2"
      @change="onSliderChange" />
    <div class="percentages">
      <div v-for="percent in percentages" :key="percent" class="percentage">
        <div class="line"></div>
        {{ percent }}%
      </div>
    </div>




    <div class="subscription-ipo-code">
      <div class="grop-title" style="margin: 0.2rem 0;">交易密码</div>
      <PasswordInput :value="password" :focused="showKeyboard" @focus="showKeyboard = true" :gutter="16" />
      <teleport to="body">
        <!-- 数字键盘 -->
        <NumberKeyboard v-model="password" :show="showKeyboard" @blur="showKeyboard = false" />
      </teleport>
    </div>




    <div class="subscription-total">
      <div class="subscription-text">
        <span style="margin-right: 0.08rem;">申购数量</span><span>{{ subscriptionQuantity }}</span>
        <div class="subscription-position-line-dashed"></div>
      </div>
      <div class="subscription-text">
        <span style="margin-right: 0.08rem;">锁定金额</span><span>{{ lockmonkey }}</span>
        <div class="subscription-position-line-dashed"></div>
      </div>
      <div class="subscription-text">
        <span style="margin-right: 0.08rem;">手续费</span><span>{{ fee }}</span>
        <div class="subscription-position-line-dashed"></div>
      </div>
      <div class="subscription-total-text">
        <span style="margin-right: 0.08rem;">合计</span><span>{{ all }}</span>
      </div>

    </div>

    <Button size="large" color="#014cfa" round @click="openPositPopup()"
      :disabled="(textSelect != '普通申购' && vipVal == '') || numValue == '' || password == ''">认购</Button>


    <!-- 下拉框 -->
    <teleport to="body">
      <Popup :safe-area-inset-top="true" :safe-area-inset-bottom="true" v-model:show="showPopup" position="bottom"
        :style="{ height: '30%' }" class="market_ipo-popup" closeable>
        <div class="market_ipo-box">
          <div v-for="(i, key) in option" :key="key" class="market_ipo-box-item"
            :class="{ 'selected-class': selectedOption === i.value }" @click="select(i.value)">
            {{ i.text }}
          </div>
        </div>
      </Popup>
    </teleport>


  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { Tab, Tabs, Field, Slider, Button, Loading, showToast, Icon, PasswordInput, NumberKeyboard, Popup } from "vant";
import { useRouter, useRoute } from "vue-router";
import store from "@/store";
import Decimal from 'decimal.js';
import { _orderPara, _orderBuy, _walletBalance, _commToken } from '@/api/api'


const router = useRouter();
const route = useRoute();

const sliderValue = ref(0);
const loading = ref(false);
const percentages = [25, 50, 75, 100];

//输入框的值
const numValue = ref('')
const nameVal = ref('')
const vipVal = ref('')

const password = ref('')


const isFocused = ref();
const showKeyboard = ref(false);
const showPopup = ref(false)

const ipoDetail = computed(() => {
  return store.state.ipoDetail
})

const option = [
  { text: '普通申购', value: '0' },
  { text: `VIP 申购-${ipoDetail.value.lever}X`, value: '1' }
]
const selectedOption = ref("0");

const textSelect = computed(() => {
  const selected = option.find((i) => i.value === selectedOption.value);
  return selected ? selected.text : "";
});

//可买数量
const availableNum = ref(0)
//主账户金额
const amount = ref(0)
//申购数量
const subscriptionQuantity = ref(0)
//锁定金额
const lockmonkey = ref(0)
//手续费
const fee = ref(0)
//设置手续费
const setFee = ref(0)
//合计
const all = ref(0)
const emit = defineEmits();

const id = computed(() => {
  return store.state.ipoId
})
// const sessionToken = computed(() => store.state.sessionToken || '')

const goTotrade = () => {
  emit('closeOpenDetail')
  // if (route.query.type === "market") {
  //   router.push({ name: 'market'});
  // } else if (route.query.type === "trade"){
  //   router.push({ name: 'trade', query: { type: 'ipodetail' } });
  // }
};

const placeholderText = computed(() => {
  if (textSelect.value === '普通申购') {
    return ''
  }
  return `请输入 VIP 认购密钥`;
});



const onSliderChange = (newValue) => {
  //滚动滑动条
  sliderValue.value = newValue;
  const result = new Decimal(sliderValue.value).mul(new Decimal(availableNum.value)).div(100)
  numValue.value = result.floor().toNumber();

  getPrice()
};

const handleFocus = (val) => {
  isFocused.value = val
};

const handleBlur = (val) => {
  isFocused.value = null
};

const buy = (val) => {
  const data = {
    ipoid: id.value,
    volume: numValue.value,
    keyword: vipVal.value,
    safeword: password.value,
    token: val
  }
  _orderBuy({ ...data }).then(res => {
    if (res.code == 200) {
      router.push({
        name: 'subscriptionSuccess'
      });
    } else {
      showToast(res.message);
    }
  })
}

const openPositPopup = () => {
  if (new Decimal(numValue.value).gt(new Decimal(availableNum.value))) {
    showToast('超出最大可买');
    return
  }
  _commToken().then((res => {
    if (res.code == 200) {
      buy(res.data)
    }
  }))

};

const vipSubscription = () => {
  showPopup.value = true
  vipVal.value = ''
}

const select = (i) => {
  selectedOption.value = i;
  showPopup.value = false;
  getPrice()
}


const inputChange = () => {
  if (numValue.value != '') {
    //输入框换算滚动滑动条
    const result = new Decimal(numValue.value).div(new Decimal(availableNum.value)).mul(100).floor().toNumber()
    if (result >= 100) {
      sliderValue.value = 100;
      return
    }
    sliderValue.value = result;


    getPrice()
  }
}

const getPrice = () => {
  if (numValue.value != '') {
    if (textSelect.value === '普通申购') {
      //锁定金额 = 数量 * 最高价
      lockmonkey.value = new Decimal(numValue.value).mul(new Decimal(ipoDetail.value.issue_price_max))
      //申购数量 = 数量*杠杆
      subscriptionQuantity.value = new Decimal(numValue.value).mul(new Decimal(1))
      //手续费 = （最高价 -1）*数量 * 杠杆 *手续费
      fee.value = 0
      //合计 
      all.value = lockmonkey.value.toNumber();
    } else {
      //锁定金额 = 数量 * 最高价
      lockmonkey.value = new Decimal(numValue.value).mul(new Decimal(ipoDetail.value.issue_price_max))
      //申购数量 = 数量*杠杆
      subscriptionQuantity.value = new Decimal(numValue.value).mul(new Decimal(ipoDetail.value.lever))
      //手续费 = （最高价 -1）*数量 * 杠杆 *手续费
      fee.value = (new Decimal(ipoDetail.value.issue_price_max).minus(1)).mul(subscriptionQuantity.value).mul(new Decimal(setFee.value))
      //合计 
      all.value = fee.value.plus(lockmonkey.value).toNumber();
    }
  }
}

const getList = () => {
  _orderPara().then(res => {
    if (res.code == 200) {
      setFee.value = res.data.fee
    }
  })
}

const getBalance = () => {
  _walletBalance({ currency: 'main' }).then(res => {
    if (res.code == 200) {
      console.log(ipoDetail.value, 'ipoDetail.value')
      amount.value = res.data[0].amount
      const issue_price_max = ipoDetail.value.issue_price_max
      availableNum.value = new Decimal(amount.value).div(new Decimal(issue_price_max)).floor();
    }
  })
}


onMounted(() => {
  getList()
  //获得主账户
  getBalance()
})

</script>

<style lang="less">
.subscription {
  padding: 0 0.3rem;
  padding-bottom: 0.76rem;
  background-color: white;

  // .van-loading {
  //   left: 47%;
  //   margin-top: 2rem !important;
  // }
  .ipo-company-name {
    width: 100%;
    height: 0.88rem;
    border-radius: 0.12rem;
    border: 0.02rem solid #d0d8e2;
    margin-bottom: 0.4rem;
    background-color: #f9fafb;
    margin-top: 0.2rem;
    color: #333;
    text-align: right;
    font-size: 0.28rem;
    font-style: normal;
    font-weight: 400;
    line-height: 0.88rem;
    padding-right: 0.32rem;
  }

  .add {
    background-color: #f9fafb;

    .vip-input {
      background-color: #f9fafb;
    }
  }

  .arrow-left {
    position: absolute;
    left: 0.3rem;
    top: 0.36rem;
  }

  .ipo-detail-header {
    padding: 0.3rem 0;
    background-color: white;
    color: #010101;
    font-size: 0.36rem;
    font-style: normal;
    font-weight: 400;
    line-height: 0.52rem;
    text-align: center;
  }

  .position-header {
    display: flex;

    .up-botton {
      width: 1.2rem;
      height: 0.5rem;
      color: #014cfa;
      line-height: 0.5rem;
      text-align: center;
      position: relative;
      background-size: cover;
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
    color: #333;
    text-align: left;
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
    width: 100%;
    height: 0.88rem;
    border-radius: 0.12rem;
    border: 0.02rem solid #d0d8e2;
    margin-top: 0.2rem;
    transition: all 0.3s ease;
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

  .small-select {
    width: 1.48rem;
    height: 0.88rem;
    flex-shrink: 0;
    border-radius: 0.12rem;
    border: 0.02rem solid #d0d8e2;
    margin-right: 0.24rem;
    line-height: 0.88rem;
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
    top: 0.28rem;
  }

  // }
  .position-account {
    margin: 0.1rem 0;
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

  .co-text {
    color: #333;
    text-align: center;
    font-size: 0.28rem;
    font-style: normal;
    font-weight: 400;
    line-height: 0.36rem;
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
      top: -0.36rem;
      background: white;
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
    padding: 0.24rem;
  }

  input:focus {
    color: #014cfa;
    caret-color: #014cfa;
    /* 光标颜色 */
  }

  input:focus::placeholder {
    //   color: #014cfa; /* 占位符颜色 */
  }

  .focusinput {
    border-color: #014cfa !important;
  }

  .subscription-total {
    margin-bottom: 0.8rem;
    margin-top: 0.26rem;

    .subscription-text {
      position: relative;
      text-align: right;
      color: #343434;
      font-size: 0.28rem;
      font-style: normal;
      font-weight: 400;
      line-height: 0.72rem;
      height: 0.72rem;
    }

    .subscription-total-text {
      text-align: right;
      color: #343434;
      font-size: 0.36rem;
      font-style: normal;
      font-weight: 600;
      line-height: 0.8rem;
    }

    .subscription-position-line-dashed {
      width: 3.44rem;
      border-bottom: 0.02rem dashed #cbcbcb;
      position: absolute;
      right: 0;
      top: 0.7rem;
    }
  }

  .subscription-m-box {
    display: flex;
    width: 6.86rem;
    height: 0.88rem;
    border-radius: 0.12rem;
    border: 0.02rem solid #D0D8E2;
    margin-bottom: 0.4rem;
    padding-left: 0.4rem;

    .vip-subscription {
      display: flex;
      width: 5rem;
      justify-content: space-between;

      span {
        text-align: center;
        line-height: 0.88rem;
        font-size: 0.28rem;
        font-style: normal;
        font-weight: 400;
      }

      .subscription-down-img {
        display: inline-block;
        width: 0.32rem !important;
        height: 0.32rem !important;
        vertical-align: middle;
        margin-top: 0.28rem;
      }
    }

    .vip-input {
      margin-right: 0.04rem;
    }
  }

  .subscription-ipo-code {
    margin-top: 0.26rem;
  }

  .van-password-input {
    margin: 0;
  }

  .van-password-input__security li {
    border-radius: 0.16rem;
    border: 0.02rem solid #eceff3;
  }
}
</style>
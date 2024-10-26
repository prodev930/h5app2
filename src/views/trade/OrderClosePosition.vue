<template>
  <div class="close-position-order-update">
    <div class="detail-update-title">
      平仓
    </div>

    <div class="order-update-box">
      <div class="order-lose-title">数量</div>
      <Field v-model="loseValue" class="lose-field" type="number" @focus="handleFocus(1)" 
      @blur="handleBlur(1)" :class="[{'focusinput': isFocused === 1}]" @input="handleInput()"/>

      <div class="account-monkey">
        可卖数量 <span class="account-num-monkey">{{ unsold_volume }}</span>
      </div>


      <Slider
        v-model="sliderValue"
        bar-height="0.08rem"
        active-color="#f2f2f2"
        inactive-color="#f2f2f2"
        @change="onSliderChange"
      />
      <div class="percentages">
        <div v-for="percent in percentages" :key="percent" class="percentage">
          <div class="line"></div>
          {{ percent }}%
        </div>
      </div>

      <div class="close-price-num">
        2304
      </div>

    <div style="position: relative;">
      <div class="risk-line">
        <div>
          盈亏/盈亏比
        </div>
        <div class="prcent-num" style="color: #e8503a;">
          -18%
        </div>
      </div>

      <div class="risk-line-dashed"></div>

      <div class="all-risk-line">
        <div class="risk-text">
          手续费
        </div>
        <div class="prcent-num" style="font-weight: 500;font-size: 0.28rem;">
          34.93
        </div>
      </div>
    </div>

    <div class="ipo-code">
      <div class="ipo-code-title">
        请输入交易密码
      </div>

      <PasswordInput
        :value="value"
        :focused="showKeyboard"
        @focus="showKeyboard = true"
        :gutter="16"
      />

      <Button size="large" color="#014cfa" round style="margin-bottom: 0.32rem;margin-top: 0.6rem;" :disabled="loseValue === '' || value === ''" @click="sure">确定</Button>

      <!-- 数字键盘 -->
      <NumberKeyboard
        v-model="value"
        :show="showKeyboard"
        @blur="showKeyboard = false"
      />
    </div>

    


  </div>
  </div>
</template>

<script setup>
  import { ref,computed, watch } from "vue";
  import { Button, Field, Slider, PasswordInput, NumberKeyboard, showToast } from 'vant';
  import store from "@/store";
  import Decimal from 'decimal.js';
  import { _stocksSell } from "@/api/api";


  const order_no = computed(() => store.state.orderNo);
  const unsold_volume = computed(() => store.state.unsold_volume);
  const getcommToken = computed(() => store.state.sessionToken)

  const loseValue = ref('')
  const addValue = ref('')
  const sliderValue = ref(0)
  const percentages = [25, 50, 75, 100];
  const value = ref('');
  const showKeyboard = ref(false);

  const isFocused = ref();


  const onSliderChange = (newValue) => {
    sliderValue.value = newValue;

    const result = new Decimal(newValue).mul(new Decimal(unsold_volume.value)).div(100);
    loseValue.value = result.floor();
  };

  const handleFocus = (val) => {
    isFocused.value = val
  };

  const handleBlur = (val) => {
    isFocused.value = null
  };


  const sure = ()=>{
    if (new Decimal(loseValue.value).gt(unsold_volume.value)) {
      showToast('超出最大可卖金额');
      return
    }
    const data = {
      order_no:order_no.value,
      volume: loseValue.value,
      token: getcommToken.value,
      safeword: value.value
    }
    _stocksSell({ ...data }).then(res => {
        if (res.code == 200) {
          showToast('平仓成功');
          store.dispatch('closePopup')
        }
    });
  }

  const handleInput = ()=>{
    if (loseValue.value !== '') {
      const lose = new Decimal(loseValue.value);
      const volume = new Decimal(unsold_volume.value);
      if (new Decimal(loseValue.value).gt(new Decimal(unsold_volume.value))) {
        sliderValue.value = 100
        return
      }
      const result = lose.div(volume).mul(100);
      sliderValue.value = result.toNumber();
    } else {
      sliderValue.value = 0
    }
  }


</script>

<style lang="less">
  .close-position-order-update{
    .detail-update-title {
      text-align: center;
      margin-top: 0.4rem;
      color: #121826;
      font-size: 0.32rem;
      font-style: normal;
      font-weight: 500;
      line-height: 0.44rem;
      margin-bottom: 0.36rem;
    }
    .order-update-box {
      padding: 0 0.32rem;
      padding-top: 0.2rem;
    }
    .order-lose-title {
      color: #333;
      font-size: 0.28rem;
      font-style: normal;
      font-weight: 400;
      line-height: 0.36rem;
      text-align: left;
      margin-bottom: 0.2rem;
      margin-top: 0.2rem;
    }
    .lose-field {
      height: 0.88rem;
      border-radius: 0.12rem;
      border: 0.02rem solid #D0D8E2;
      .van-field__control {
          text-align: right;
      }
    }
    .account-monkey {
      text-align: right;
      color: #8F92A1;
      font-size: 0.28rem;
      font-style: normal;
      font-weight: 400;
      line-height: 0.48rem;
      margin: 0.12rem 0;
      .account-num-monkey {
        color: #333333;
      }
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
      z-index: 999!important;
    }

    .risk-line {
      display: flex;
      justify-content: right;
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
      width: 1rem;
      text-align: right;
    }
    .risk-line-dashed {
      width: 3.44rem;
      border-bottom: 0.02rem dashed #cbcbcb;
      position: absolute;
      right: 0;
      top: 0.42rem;
    }
    .all-risk-line {
      display: flex;
      justify-content: right;
      margin-top: 0.16rem;
      .risk-text {
        color: #333;
        text-align: center;
        font-size: 0.24rem;
        font-style: normal;
        font-weight: 400;
        line-height: 0.36rem;
      }
    }
    .ipo-code {
      margin-top: 0.26rem;
      .ipo-code-title {
        text-align: center;
        color: #121826;
        font-size: 0.28rem;
        font-style: normal;
        font-weight: 500;
        line-height: 0.44rem;
        margin-bottom: 0.3rem;
      }
    }
    .van-password-input {
      margin: 0;
    }
    .van-password-input__security li {
      border-radius: 0.16rem;
      border: 0.02rem solid #eceff3;
    }
    @media (min-width: 751px) {
      .van-number-keyboard {
        max-width: 375px;
        position: absolute !important;
        left: 50% !important;
        transform: translateX(-50%) !important;
      }
    }
    .close-price-num {
      text-align: right;
      color: #E8503A;
      font-size: 0.36rem;
      font-style: normal;
      font-weight: 600;
      line-height: 0.56rem;
      margin-top: 0.56rem;
    }

    input:focus {
      color: #014cfa;
      caret-color: #014cfa; /* 光标颜色 */
    }

    input:focus::placeholder {
      // color: #014cfa; /* 占位符颜色 */
    }

    .focusinput {
      border-color: #014cfa !important;
    }
    
  }
</style>
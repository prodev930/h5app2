<template>
   <!-- 拖动 -->
    <div>
        <div class="slider-container">
            <Slider v-model="sliderValue" bar-height="0.28rem" active-color="#014CFA" inactive-color="#E0E7F8"
                @change="onSliderChange">
                <template #button>
                    <div class="slider-custom-num">
                        <span class="number" v-show="sliderValue">{{ Math.floor(sliderValue) }}%</span>
                    </div>
                </template>
            </Slider>
        </div>
        <div class="percentages">
            <div v-for="percent in percentages" :key="percent" class="percentage">
                <div class="line"></div>
                {{ percent }}%
            </div>
        </div>
    </div>
</template>
<script setup>
import { ref, watch } from 'vue'
import { Slider } from 'vant'

const emit = defineEmits(['update:modelValue','change'])
const props = defineProps({
    modelValue:{
        type:Number,
        default:0
    }
})

const percentages = [25, 50, 75, 100];
const sliderValue = ref(props.modelValue);


watch(()=>props.modelValue,(newValue)=>{
    if(newValue != sliderValue){
        sliderValue.value = newValue
    }
})

const onSliderChange = (newValue) => {
    emit('update:modelValue',newValue)
    emit('change',newValue)
  
}

</script>
<style lang="less" scoped>

.slider-container {
    margin: 0 0.2rem;
    line-height: 100%;
    :deep(.slider-custom-num) {
        position: relative;
        background: #014CFA;
        color: #fff;
        display: inline-block;
        width: .4rem;
        height: .4rem;
        border-radius: 50%;
        .number {
            color: #014CFA;
            position: absolute;
            top: -0.28rem;
            right: 0;
            font-size: .24rem;
        }
    }

    :deep(.van-slider) {
        height: 0.26rem !important;
        border-radius: 0.2rem;
    }

    :deep(.van-slider__bar) {
        position: relative;
    }

    :deep(.van-slider__button) {
        width: 0.1rem;
        height: 0.48rem;
        background-color: #014cfa;
        border-radius: inherit;
        top: -0.36rem;
    }

    :deep(.van-slider__button-wrapper) {
        z-index: 999 !important;
    }
}

.percentages {
    display: flex;
    justify-content: space-between;
    z-index: 7;
    height: 0.62rem;
    align-items: center;
    margin: 0 0.2rem;
    line-height: 100%;
    .percentage {
        color: #8f92a1;
        font-size: 0.28rem;
        font-style: normal;
        font-weight: 400;
        text-align: center;
        width: 25%;
        position: relative;
    }
    .percentage:last-child .line{
        display: none;
    }
    .line {
        width: 0.07rem;
        height: 0.28rem;
        position: absolute;
        right: -0.03rem;
        top: -0.44rem;
        background: #fff;
        z-index: 88;
    }
}
</style>
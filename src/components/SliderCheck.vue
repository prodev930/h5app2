<!-- 滑动验证 -->
<template>
    <Popup v-model:show="showCenter" style="background-color: rgba(0,0,0,0);">

        <div class="slider_check_box">
            <div class="slider_title">拖动滑块至最右边以完成校验</div>

            <div class="slider_box">
                <Slider @change="changeSlider" @drag-start="activeVal = 0" v-model="value" bar-height="40px"
                    button-size="40px" :active-color="colorMap[activeVal]" />
            </div>
        </div>

    </Popup>
</template>

<script setup>
import { Popup, Slider } from 'vant';
import { ref } from "vue"

const emits = defineEmits('success')

const showCenter = ref(false)
const value = ref(0)
const activeVal = ref(0)
const colorMap = ref({
    0: '#014CFA',
    1: '#18B762',
    2: '#ee0a24'
})

const changeSlider = (e) => {
    if (e == 100) {
        activeVal.value = 1
        setTimeout(() => {
            showCenter.value = false
            emits('success')
        }, 300)
    } else {
        activeVal.value = 2
        setTimeout(() => {
            value.value = 0
        }, 300)
    }
}

const open = () => {
    value.value = 0
    showCenter.value = true
}

defineExpose({
    open
})
</script>

<style lang="less" scoped>
.slider_check_box {
    width: 80vw;
    border-radius: 0.12rem;
    background-color: #fff;
    padding: 0.48rem 0.64rem 0.64rem 0.64rem;
    text-align: center;

    .slider_title {
        font-size: 0.28rem;
        margin-bottom: 0.48rem;
        color: #666;
    }
}
</style>
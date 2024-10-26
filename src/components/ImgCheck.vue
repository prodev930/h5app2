<!-- 图片拖动校验 -->
<template>
    <div class="container">

        <!-- 返回和语言 -->
        <div class="max-width top">
            <div class="top_back" @click="goBack">
                <Icon name="arrow-left" />
            </div>

            <div class="top_lang" @click="goLang">
                <img src="/static/img/common/language.png" alt="language" />
            </div>
        </div>

        <div class="title">安全验证</div>
        <div class="check_title">拖动滑块，使图片角度为正</div>
        <div class="check_pic">
            <img class="check_img" :style="{ transform: `rotate(${slider * 3.5}deg)` }"
                src="/static/img/common/check.png" alt="img">
        </div>
        <div class="slider_box" style="width:100%">
            <Slider @change="changeSlider" @drag-start="activeVal = 0" v-model="slider" bar-height="40px"
                button-size="40px" :active-color="colorMap[sliderStatus]" />
        </div>
        <span>&nbsp;</span>

        <div class="status_text" v-if="loading" style="opacity:0">
            <div class="status_text_icon">
                <img src="/static/img/common/check_default.png" alt="img">
                <img src="/static/img/common/check_success.png" alt="img">
                <img src="/static/img/common/check_error.png" alt="img">
            </div>
        </div>
        <div class="status_text status_success" v-else-if="sliderStatus == 'success'">
            <span class="check_result">验证成功</span>
        </div>
        <div class="status_text status_error" v-else-if="sliderStatus == 'error'">
            <span class="check_result">验证失败</span>
        </div>
        <div class="status_text" v-else>
            <span class="check_result">待滑动验证</span>
        </div>

    </div>
</template>

<script setup>
import { Slider, showLoadingToast, closeToast, Icon } from 'vant';
import { ref, onMounted } from "vue"

const show = ref(false)
const loading = ref(false)
const emits = defineEmits(['success', 'goBack'])
// 跳转多语言
const goLang = () => {
    emits("closeDialog");
    router.push({ name: "language" });
};

const colorMap = ref({
    'default': '#014CFA',
    'success': '#18B762',
    'error': '#ee0a24'
})

const open = () => {
    loading.value = true
    sliderStatus.value = 'default'
    slider.value = 0
    show.value = true
    setTimeout(() => {
        loading.value = false
    }, 600)
}

// 验证
const slider = ref(0)
const sliderStatus = ref('default')
const changeSlider = val => {
    loading.value = true
    showLoadingToast({
        duration: 0,
        loadingType: 'spinner',
    })
    if (val >= 87 && val <= 93) { // 成功
        sliderStatus.value = 'success'
        setTimeout(() => {
            show.value = false
            emits('success')
        }, 1200)
    } else { // 失败
        sliderStatus.value = 'error'
    }
    setTimeout(() => {
        closeToast()
        loading.value = false
    }, 500)
    setTimeout(() => {
        slider.value = 0
        sliderStatus.value = 'default'
    }, 1400)
}

const goBack = () => {
    emits('goBack')
}

onMounted(() => {
    open()
})

</script>

<style lang="less" scoped>
.container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    font-size: 0.32rem;
    padding: 0 1rem;

    .top {
        position: fixed;
        width: 100%;
        height: 1.12rem;
        display: flex;
        padding: 0 0.4rem 0 0.12rem;
        align-items: center;
        justify-content: flex-end;
        left: 50%;
        transform: translateX(-50%);
        top: 0;
        background-color: #fff;

        .top_back {
            color: #161616;
            font-size: 0.4rem;
            width: 0.8rem;
            height: 0.8rem;
            display: flex;
            align-items: center;
            justify-content: center;
        }

        .top_lang {
            color: #161616;
            font-size: 0.4rem;
            width: 0.8rem;
            height: 0.8rem;
            display: flex;
            align-items: center;
            justify-content: center;
        }
    }

    .top_back {
        position: absolute;
        top: 0.2rem;
        left: 0.2rem;
        color: #161616;
        font-size: 0.40rem;
        width: 0.8rem;
        height: 0.8rem;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .title {
        color: var(--, #061023);
        font-family: "PingFang SC";
        font-size: 28px;
        font-style: normal;
        font-weight: 600;
        line-height: 140%;
        margin-bottom: 8px;
        /* 39.2px */
    }

    .check_title {
        color: var(--, #000);
        text-align: center;
        font-family: "PingFang SC";
        font-size: 14px;
        font-style: normal;
        font-weight: 400;
        line-height: 150%;
        /* 21px */
    }

    .check_pic {
        margin: 0.64rem auto;
        width: 219px;
        height: 219px;
        flex-shrink: 0;
        background-color: #D0D8E2;
        padding: 10px;
        border-radius: 219px;
    }

    .status_text {
        margin-top: 0.64rem;
        margin-bottom: 0.64rem;
        width: 100%;
        text-align: left;
        display: flex;
        align-items: center;
        justify-content: center;
        color: var(--, #333);
        font-family: "PingFang SC";
        font-size: 14px;
        font-style: normal;
        font-weight: 400;
        line-height: 16px;

        .status_text_icon {
            width: 0.36rem;
            height: 0.36rem;
            margin-right: 0.12rem;
        }
    }

    .status_success {
        color: #008822;
    }

    .status_error {
        color: #FF0000;
    }

    .check_slider {

        :deep(.el-slider__bar) {
            height: 1.2rem;
            border-radius: 0.6rem;
        }

        :deep(.el-slider__runway) {
            height: 1.2rem;
            border-radius: 0.6rem;
        }

        :deep(.el-slider__button-wrapper) {
            top: 0;
        }

        :deep(.el-slider__button) {
            width: 1.2rem;
            height: 1.2rem;
            border: none;
            // background-image: url('@/assets/slider.png');
            background-size: 100% 100%;
        }
    }

    .check_slider_success {
        :deep(.el-slider__bar) {
            background-color: #17B763;
        }
    }

    .check_slider_error {
        :deep(.el-slider__bar) {
            background-color: #FA6466;
        }
    }
}
</style>
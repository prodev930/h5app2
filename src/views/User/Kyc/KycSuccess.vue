<!-- 认证成功 -->
<template>
    <div class="page page-auth-success">
        <Top :title="'认证详情'"></Top>


        <div class="subtitle">个人信息</div>
        <div class="info_box">
            <div class="info_item">
                <span>姓名</span>
                <span class="val">{{ kycInfo.name }}</span>
            </div>
            <div class="info_item">
                <span>证件号码</span>
                <span class="val">{{ kycInfo.idnum }}</span>
            </div>
            <div class="info_item">
                <span>出生日期</span>
                <span class="val">{{ kycInfo.birthday }}</span>
            </div>
        </div>
        <div class="subtitle">身份证件信息</div>

        <div>
            <div class="pic_box">
                <img :src="kycInfo.idimg_1" alt="img">
            </div>
            <div class="pic_box">
                <img :src="kycInfo.idimg_2" alt="img">
            </div>
            <div class="pic_box">
                <img :src="kycInfo.idimg_3" alt="img">
            </div>
        </div>
    </div>
</template>

<script setup>
import Top from '@/components/Top.vue';
import { ref } from "vue"


const kycInfo = ref({})
try {
    kycInfo.value = JSON.parse(localStorage.getItem('kycInfo'))
} catch { }


</script>

<style lang="less" scoped>
.page-auth-success {
    padding: 1.4rem 0.32rem 0.32rem 0.32rem;

    .subtitle {
        color: #000;
        margin-bottom: 0.24rem;
    }

    .info_box {
        padding: 0.32rem;
        background-color: #F5F8FB;
        border-radius: 0.08rem;
        margin-bottom: 0.48rem;

        .info_item {
            line-height: 0.6rem;
            display: flex;
            align-items: center;
            justify-content: space-between;
            color: #333;

            .val {
                color: #000
            }
        }
    }

    .pic_box {
        height: 4rem;
        width: 100%;
        margin-bottom: 0.24rem;
        border: 1px dashed #2972F6;
        border-radius: 0.24rem;
        padding: 0.08rem;

        >img {
            object-fit: fill !important;
        }
    }
}
</style>
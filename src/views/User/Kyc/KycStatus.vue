<!-- 认证状态 -->
<template>
    <div class="page page-auth_status">
        <Top :title="''" />
        <div class="check_box">
            <!-- v-if="kycInfo.status == 'review'" -->

            <!-- 成功 -->
            <template v-if="kycInfo.status == 'success'">
                <div class="status_icon">
                    <img src="/static/img/user/success.png" alt="img">
                </div>
                <div class="subtitlt">认证成功</div>
                <div style="flex:1"></div>
                <div class="btn" @click="goInfo">查看认证信息</div>
            </template>
            <!-- 详情 -->
            <template v-if="kycInfo.status == 'review'">
                <div class="status_icon big_icon">
                    <img src="/static/img/user/info.png" alt="img">
                </div>
                <div class="subtitlt">身份认证已提交审核，请耐心等待</div>
                <div style="flex:1"></div>
            </template>
            <!-- 失败 -->
            <template v-if="kycInfo.status == 'failure'">
                <div class="status_icon">
                    <img src="/static/img/user/fail.png" alt="img">
                </div>
                <div class="subtitlt">认证失败</div>
                <div class="reason">
                    <div class="reason_title">失败原因：</div>
                    <div>{{ kycInfo.remarks ||
                        '--'
                        }}</div>
                </div>
                <div style="flex:1"></div>
                <div style="display: flex;align-items: center;justify-content: space-between;width: 100%">
                    <div class="btn light_btn" style="width:47%">联系客服</div>
                    <div class="btn" style="width:47%" @click="nextStep">重新认证</div>
                </div>
            </template>
        </div>
    </div>
</template>

<script setup>
import Top from '@/components/Top.vue';
import router from '@/router';

const props = defineProps({
    kycInfo: {
        type: Object,
        default: () => { }
    }
})

const emits = defineEmits(['next'])

const nextStep = () => {
    emits('next')
}

const back = () => {
    router.back()
}
const goInfo = () => {
    localStorage.setItem('kycInfo', JSON.stringify(props.kycInfo))
    router.replace({
        name: 'kycSuccess'
    })
}

</script>

<style lang="less" scoped>
.page-auth_status {
    height: 100%;
    padding: 1.6rem 0 0.6rem 0;

    .check_box {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: space-between;
        padding: 0 0.32rem 0.6rem 0.32rem;
        height: 100%;

        .status_icon {
            width: 2rem;
            height: 2rem;
        }

        .big_icon {
            width: 3rem;
            height: 3rem;
            margin-bottom: -0.6rem;
        }

        .subtitlt {
            font-size: 0.28rem;
            color: #333;
            margin-top: 0.4rem;
        }

        .reason {
            background-color: #F5F8FB;
            padding: 0.4rem;
            width: 100%;
            margin-top: 0.64rem;
            color: #333;
            word-break: break-all;
            line-height: 0.4rem;

            .reason_title {
                color: #000;
                font-size: 0.32rem;
                margin-bottom: 0.2rem;
            }
        }

        .btn {
            background-color: #014CFA;
            height: 0.96rem;
            border-radius: 0.96rem;
            display: flex;
            align-items: center;
            justify-content: center;
            color: #fff;
            width: 100%;
        }

        .light_btn {
            background-color: #EFF6FF;
            color: #014CFA;
        }
    }
}
</style>
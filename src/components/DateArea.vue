<!-- 日期范围选择 -->
<template>
    <Popup v-model:show="show" teleport="body" position="bottom">
        <div class="date_popup_box">
            <Top :backFunc="close" :title="'查询'" />
            <div class="top_info">
                <div class="link" @click="close">关闭</div>
                <div>日期选择（下拉加载更多）</div>
                <div class="link" @click="reset">清空</div>
            </div>

            <Calendar ref="customRef" class="calendar" :poppable="false" type="range" :show-confirm="false"
                :show-mark="false" @confirm="onConfirm" :default-date="null" :min-date="minDate" :title="' '"
                :row-height="40" />

            <div class="bottom_info">

                <div class="date_info">
                    <div>开始：{{ rs.start_time || '--' }}</div>
                    <div>结束：{{ rs.end_time || '--' }}</div>
                </div>
                <div class="btn" @click="submit">确认</div>
            </div>

        </div>
    </Popup>
</template>

<script setup>
import { Popup, Calendar, Button } from "vant"
import { ref } from "vue"
import Top from './Top.vue'
import { getTimestr } from "@/utils/time"

const customRef = ref()

const minDate = ref(new Date())
minDate.value.setFullYear(new Date().getFullYear() - 1);


const rs = ref({
    start_time: null,
    end_time: null
})

const show = ref(false)
const onConfirm = (value) => {
    rs.value = {
        start_time: getTimestr(Date.parse(value[0]), 1),
        end_time: getTimestr(Date.parse(value[1]), 1),
    }
};
const reset = () => {
    customRef.value.reset()
    rs.value = {
        start_time: null,
        end_time: null
    }
}

const open = () => {
    show.value = true
    setTimeout(() => {
        customRef.value.scrollToDate(new Date())
    }, 500)
}
const close = () => {
    show.value = false
}


const emits = defineEmits(['submit'])
const submit = () => {
    close()
    emits('submit', rs.value)
}

defineExpose({
    open
})
</script>

<style lang="less">
.date_popup_box {
    height: var(--app-height);
    display: flex;
    flex-direction: column;
    overflow: hidden;
    padding-top: 1.2rem;

    .van-calendar__header-title,
    .van-calendar__header-subtitle {
        display: none !important;
    }

    .top_info {
        display: flex;
        align-items: center;
        justify-content: space-between;
        color: #000;
        font-size: 0.24rem;
        font-weight: 400;
        padding: 0 0.44rem;
        margin-bottom: 0.32rem;

        .link {
            color: #0953FA;
            font-size: 0.28rem;
        }
    }

    .bottom_info {
        display: flex;
        align-items: center;
        padding: 0.2rem 0.44rem 0.4rem 0.44rem;
        color: #000;
        font-size: 0.24rem;
        font-weight: 400;
        line-height: 0.4rem;

        .date_info {
            flex: 1;
        }

        .btn {
            margin-left: 0.4rem;
            height: 0.72rem;
            background-color: #0953FA;
            border-radius: 0.08rem;
            padding: 0 0.4rem;
            display: flex;
            align-items: center;
            justify-content: center;
            color: #fff;
        }
    }

    .calendar {
        flex: 1;
        overflow: hidden;
    }
}
</style>
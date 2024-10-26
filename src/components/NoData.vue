<!-- 空数据 -->
<template>
    <div class="no_data">
        <div class="nodata_icon">
            <img src="/static/img/common/no_data.png" alt="nothing">
        </div>
        <div class="nodata_text">{{ props.tip }}</div>
    </div>
</template>

<script setup>

const props = defineProps({
    tip: {
        type: String,
        default: '暂无数据'
    }
})
</script>

<style scoped lang="less">
.no_data {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    font-weight: 400;
    line-height: 0.4rem;
    font-size: 0.28rem;
    color: #A4ACB9;
    padding: 1rem 0;

    .nodata_icon {
        width: 2.28rem;
        height: auto;
        img {
            width: 100%;
        }
    }
    .nodata_text{
        font-size: 0.28rem;
        margin-top: 0.46rem;
    }
}
</style>
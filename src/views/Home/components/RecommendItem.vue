<!-- 推荐元素 -->
<template>
    <div class="stock_tab">
        <div class="tab_title">{{ props.item.symbol || '--' }}</div>
        <!-- <div class="tab_subtitle">{{ item.name || '--' }}</div> -->
        <div style="display: flex;align-items: center;justify-content: space-between;">
            <div class="tab_num" v-if="props.item.price">{{ props.item.price ?
                (props.item.price).toFixed(2) : '--' }}</div>
            <div class="tab_num" v-if="props.item.ratio" :class="[(props.item.ratio > 0 ? 'up' : 'down')]">
                {{ isNaN(props.item.ratio) ? '--' : (props.item.ratio * 100).toFixed(2) }}%</div>
        </div>

        <div class="tab_line">
            <SparkLine style="width:100%;height:100%;transform: scaleX(1.75);" :points="props.item.points"
                :ratio="props.item.ratio" />
        </div>
    </div>
</template>

<script setup>
import SparkLine from "@/components/SparkLine.vue"
const props = defineProps({
    item: {
        type: Object,
        default: () => { }
    }
})
</script>

<style lang="less" scoped>
.stock_tab {
    width: 100%;
    height: 100%;
    border: 1px solid #F8F9FB;
    border-radius: 0.08rem;
    padding: 0.17rem;
    position: relative;
    background-color: #F8F9FB;

    .tab_title {
        font-weight: 700;
        font-size: 0.24rem;
        color: #0D0D12;
        line-height: 0.274rem;
        margin-bottom: 0.06rem;
    }

    .tab_subtitle {
        color: #818898;
        font-weight: 400;
        font-size: 0.2rem;
        margin-bottom: 0.14rem;
    }

    .tab_num {
        color: #0D0D12;
        font-weight: 600;
        font-size: 0.2rem;
        line-height: 0.25rem;
    }

    .tab_line {
        position: absolute;
        bottom: 0;
        width: calc(100% - 0.34rem);
        transform-origin: 0 0;
        height: 0.6rem;
        overflow: hidden;
    }
}
</style>
<!-- banner -->
<template>
    <Swipe v-if="showList.length" class="banner_box" lazy-render :initial-swipe="currIndex" :autoplay="3000" loop
        indicator-color="white" @change="onChange">
        <SwipeItem v-for="(list, index) in showList" :key="index">
            <div class="banner_items">
                <div class="banner_item" v-for="(item, i) in list" :key="index + '_' + i">
                    <RecommendItem :item="item" v-if="item.symbol" />
                </div>
            </div>
        </SwipeItem>
        <template #indicator="{ active, total }">
            <div class="custom-indicator">
                <div v-for="i in total" :key="i" class="indicator" :class="{ 'active_indicator': active == i - 1 }">
                </div>
            </div>
        </template>
    </Swipe>
</template>

<script setup>
import { Swipe, SwipeItem } from 'vant';
import { ref, onMounted, computed } from "vue"
import RecommendItem from "./RecommendItem.vue"
import store from '@/store';


// 推荐数据
const marketRecommndList = computed(() => store.state.marketRecommndList || [])
const showList = computed(() => {
    const arr = []
    let i = 0
    marketRecommndList.value.forEach((item) => {
        if (!arr[i]) {
            arr[i] = [item]
        } else if (arr[i].length < 3) {
            arr[i].push(item)
        } else {
            i++
            arr[i] = [item]
        }
    })
    if (arr[i]) {
        if (arr[i].length == 2) {
            arr[i].push({})
        }
        if (arr[i].length == 1) {
            arr[i].push({})
            arr[i].push({})
        }
    }
    return arr
})

// 轮播
const currIndex = ref(0)
const onChange = key => {
    setTimeout(() => {
        currIndex.value = key
    }, 0)
}
onMounted(() => {
    onChange(0)
})
</script>

<style lang="less" scoped>
.banner_box {

    .banner_items {
        height: 1.9rem;
        padding: 0 0.32rem;
        color: #fff;
        display: flex;
        align-items: flex-start;
        justify-content: space-between;

        .banner_item {
            height: 1.5rem;
            width: 32%;
        }
    }

    .custom-indicator {
        position: absolute;
        left: 50%;
        transform: translateX(-50%);
        bottom: 0.4rem;
        display: flex;

        .indicator {
            border-radius: 0.26rem;
            width: 0.14rem;
            height: 0.08rem;
            background-color: #D2D2D2;
            margin: 0 0.08rem;
        }

        .active_indicator {
            width: 0.4rem;
            background-color: #0063F5;
        }
    }
}
</style>
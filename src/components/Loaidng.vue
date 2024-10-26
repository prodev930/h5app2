<!-- loading 组件封装 -->
<template>
    <Loading class="loading_dom" :size="props.size" :color="props.color" :type="props.type" v-show="props.loading" />
</template>

<script setup>
import { Loading } from 'vant';
const props = defineProps({
    loading: false,
    size: 48,
    type: {
        type: String,
        default: 'spinner'
    },
    color: ''
})
</script>

<style scoped>
.loading_dom {
    margin: 40px auto;
    text-align: center;
}
</style>
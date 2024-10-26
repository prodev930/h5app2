<template>
    <svg class="icon" aria-hidden="true" :style="{ 'color': props.color, opacity:'50%', 'font-size': props.size + 'rem' }">
        <use :xlink:href="'#' + props.name"></use>
    </svg>
</template>

<script setup>
const props = defineProps({
    name: {
        type: String,
        default: ''
    },
    color: {
        type: String,
        default: ''
    },
    size: {
        type: [String, Number],
        default: ''
    },
})
</script>
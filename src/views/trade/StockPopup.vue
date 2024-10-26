<template>
  <div class="stockPopup">
    <MarketInfo :type="props.type" @back="back" :innerPage="true" />
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import store from "@/store";
import MarketInfo from "../Market/MarketInfo.vue"

const props = defineProps({
  type: {
    type: String,
    default: ''
  }
})

const back = () => {
  store.commit('setShowOpenPositionBottom', false)
}
</script>

<style lang="less">
.stockPopup {
  height: 100%;
  width: 100%;
}
</style>

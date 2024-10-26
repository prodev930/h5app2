<!-- 顶部菜单 -->
<template>
  <div class="max-width top">
    <div class="back" @click="clickLeft">
      <Icon :name="props.icon" size="0.4rem" />
    </div>
    <span>{{ props.title }}</span>
    <div class="right">
      <slot name="right" />
    </div>
  </div>
</template>

<script setup>
import { Icon } from 'vant'
import router from '@/router'
import store from '@/store'
const props = defineProps({
  title: {
    // 标题
    type: String,
    default: '',
  },
  icon: {
    type: String,
    default: 'arrow-left',
  },
  searchText: {
    type: String,
    default: ""
  },
  backFunc: Function,
})
const marketSearchTextList = computed(() => store.state.marketSearchTextList);
const clickLeft = () => {
  if (props.searchText.length > 0) {
    var prevList = [...marketSearchTextList.value];
    var flag = false;
    prevList.map((item) => {
        if(item.toUpperCase() == props.searchText.toUpperCase())
            flag = true;
    })
    var newList = flag ? prevList : [...prevList, props.searchText];

    store.commit("setMarketSearchTextList", newList);
  }
  if (props.backFunc) return props.backFunc()
  router.back()
}
</script>

<style lang="less" scoped>
.top {
  top: 0;
  position: fixed;
  left: 50%;
  transform: translateX(-50%);
  width: 100%;
  height: 1.12rem;
  background-color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 0.8rem;
  color: var(--main-text-color);
  font-size: 0.32rem;
  font-weight: 500;
  text-align: center;
  line-height: 1.05;
  z-index: 9999;

  .back {
    position: absolute;
    left: 0.32rem;
    width: 0.4rem;
    height: 0.4rem;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .right {
    position: absolute;
    right: 0.32rem;
  }
}
</style>

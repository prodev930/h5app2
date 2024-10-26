<!-- 语言选择 -->
<template>
  <div class="page page_language">
    <Top :title="'语言'" />

    <CheckboxGroup v-model="checked" class="lang_box" :max="2">
      <div v-for="(item, i) in navs" :key="i" class="lang_item" @click="clickItem(item)">
        <div class="logo">
          <img :src="item.icon" alt="english" />
        </div>
        <div class="name">{{ item.name }}</div>
        <div class="check">
          <Checkbox checked-color="#014CFA" :name="item.val" />
        </div>
      </div>
    </CheckboxGroup>
  </div>
</template>

<script setup>
import { Checkbox, CheckboxGroup } from 'vant'
import { ref } from 'vue'
import Top from '@/components/Top.vue'
import router from '@/router'
import store from '@/store'
import { setLocale } from '@/i18/utils'

const checked = ref([store.state.i18Data.locale])
const navs = ref([
  { name: 'English', icon: '/static/img/common/en.png', val: 'en' },
  { name: '中文繁体', icon: '/static/img/common/cn.png', val: 'cn' },
  { name: '中文简体', icon: '/static/img/common/cn.png', val: 'zh' },
])

const clickItem = item => {
  checked.value = [item.val]
  store.commit('setI18Data', {
    name: item.name,
    locale: item.val,
    icon: item.icon,
  })
  setLocale()
  router.back()
}
</script>

<style lang="less" scoped>
.page_language {
  padding-top: 1.12rem;

  .lang_box {
    padding: 0.8rem 0.4rem;

    .lang_item {
      overflow: hidden;
      height: 1.6rem;
      border-bottom: 1px solid #f4f4f4;
      display: flex;
      align-items: center;

      .logo {
        width: 0.96rem;
        height: 0.96rem;
        margin-right: 0.32rem;
      }

      .name {
        flex: 1;
        text-align: left;
        color: #1e1e2d;
        font-size: 0.32rem;
      }
    }
  }
}
</style>

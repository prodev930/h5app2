<template>
    <div class="btns">
        <div class="btn-item" @click="jump('topUpCrypto', true)">
            <div class="btn-item__icon">
              <span><img src="/static/img/assets/recharge.png" /></span>
            </div>
            <div class="btn-item__name">充值</div>
        </div>
        <div class="btn-item" @click="jump('withdraw', true)">
            <div class="btn-item__icon">
              <span>
                <img src="/static/img/assets/withdrawal.png" />
              </span>
            </div>
            <div class="btn-item__name">提现</div>
        </div>
        <div class="btn-item" @click="jump('transfer')">
            <div class="btn-item__icon">
               <span>
                <img src="/static/img/assets/transfer_icon.png" />
              </span>
            </div>
            <div class="btn-item__name">划转</div>
        </div>
        <div class="btn-item" @click="showAS = true">
            <div class="btn-item__icon">
              <span>
                <img src="/static/img/assets/record.png" />
              </span>
            </div>
            <div class="btn-item__name">资金记录</div>
        </div>
    </div>
    <ActionSheet v-model:show="showAS" teleport="body" :actions="actions" :title="$t('记录列表')" @select="onSelect" />
</template>
<script setup>
import { useI18n } from 'vue-i18n'
import { ActionSheet } from 'vant'
const { t } = useI18n()
const jump = (name, check = false, query) => {
  router.push({
    name,
    query,
  })
}

const hintNum = computed(() => store.state.hintNum || 0)

const showAS = ref(false)
const actions = computed(() => {
  return [
    { name: t('充值记录'), value: '0' },
    { name: t('提现记录'), value: '1' },
    { name: t('划转记录'), value: '2' },
  ]
})

const onSelect = item => {
  showAS.value = false
  router.push({
    name: 'recordList',
    query: {
      tab: item.value,
    },
  })
}

</script>
<style lang="less" scoped>
.btns{
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0.32rem;
}
.btn-item{
    flex: 1;
    display:flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    &__icon{
        border-radius: 0.32rem;
        background: rgba(1, 76, 250, 0.10);
        display: flex;
        justify-content: center;
        align-items: center;
        width: 0.8rem;
        height: 0.8rem;
        span{
          display: block;
          width: 0.56rem;
          height: 0.56rem;
        }
    }
    &__name{
        color: #061023;
        text-align: center;
        font-size: 0.3rem;
        font-weight: 400;
        line-height: 0.44rem; 
        margin-top:0.08rem;
    }
}
</style>
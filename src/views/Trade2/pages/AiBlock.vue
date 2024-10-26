<!-- ai -->
<template>
    <div class="ai-block">
      
        <Tabs v-if="!pageLoading" type="custom-card" v-model:active="active" :swipeable="false" animated :color="'#014CFA'"
            shrink @change="onChange">
            <Tab title="开仓" name="0">
                <div class="ai-block-content">
                    <Ai @clickItems="clickItem"></Ai>
                </div>
            </Tab>
            <!-- <Tab title="持仓" name="1">
                <div class="ai-block-content">
                    
                </div>
            </Tab> -->
            <Tab title="订单" name="2">
                
                <div class="type_tabs">
                    <div @click="activeType = 1" class="type_tab" :class="{ 'active_type_tab': activeType == 1 }">
                        <span class="type_tab_text">当前持仓</span>
                    </div>
                    <div @click="activeType = 2" class="type_tab" :class="{ 'active_type_tab': activeType == 2 }">
                        <span class="type_tab_text">历史订单</span>
                    </div>
                </div>

                <div v-show="activeType == 1">
                    <Positions />
                </div>
                <div v-show="activeType == 2">
                    <Inquire ref="InquireRef"  />
                </div>

            </Tab>
        </Tabs>
        <div style="height:50vh" v-else></div>

        <!-- 下单弹窗 -->
        <Popup teleport="body" v-model:show="showModel" position="right" style="width:100%;height:100%;">
            <Opening @showNavDialog="showNavDialog" ref="OpeningRef" @back="showModel=false" />
        </Popup>
    </div>
</template>

<script setup>
import { Tab, Tabs, Popup } from "vant";
import { ref, onMounted, computed } from "vue"
import Opening from "../ai/Opening.vue"
import Ai from "../../Market/components/Ai.vue"
import Positions from "../ai/Positions.vue"
import Inquire from "../ai/Inquire.vue"
import store from "@/store";
import router from "@/router";

const token = computed(() => store.state.token || '')
const activeType = ref(1)
const OpeningRef = ref()
const showModel = ref(false)
const clickItem = item => {
    if (!token.value) {
        return store.commit('setIsLoginOpen', true)
        // return router.push({
        //     name: 'login',
        //     query: {
        //         reurl: "trade"
        //     }
        // })
    }
    showModel.value = true
    setTimeout(() => {
        OpeningRef.value.init()
    }, 100)
}

const emits = defineEmits(['showNavDialog'])
const showNavDialog = () => {
    emits('showNavDialog', 'ai')
}

const active = ref(sessionStorage.getItem('trade_ai_tab') || 0)
const InquireRef = ref()
const onChange = async (val) => {
    active.value = val;
    sessionStorage.setItem('trade_ai_tab', val)

    if (val == 2) {
        InquireRef.value && InquireRef.value.init()
    }
};

const pageLoading = ref(true)
onMounted(() => {
    setTimeout(() => {
        pageLoading.value = false
    }, 300)
})
</script>

<style lang="less" scoped>
.ai-block {
    padding: 0.24rem 0.32rem 0.32rem;
    .ai-block-content {
        padding: 0.4rem 0 0 0;

        .ai-block-title {
            padding: 0 0.32rem;
            font-weight: 600;
        }
    }

    .tabs {
        :deep(.van-tabs__nav) {
            padding-left: 0.32rem;
        }

        :deep(.van-tabs__nav) {
            position: relative;

            &::after {
                content: '';
                width: 100%;
                height: 1px;
                background-color: #3B82F6;
                position: absolute;
                bottom: 16px;
                left: 0;
                opacity: 0.3;
            }
        }
    }
}

.type_tabs {
    width: 3.5rem;
    height: 0.68rem;
    display: flex;
    align-items: center;
    z-index: 99;
    margin-top: 0.32rem;
    border: 1px solid #D0D8E2;
    border-radius: 0.6rem;
    .type_tab {
        flex: 1;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        color: #666D80;
        font-size: 0.3rem;
    }

    .type_tab_text{
        position: relative;
        z-index: 1;
    }

    .active_type_tab {
        color: #fff;
        position: relative;
        &::after{
            content: '';
            width: calc(100% + 1px);
            height: calc(100% + 1px);
            background-color: #014CFA;
            position: absolute;
            left:0;
            top:-1px;
            border-radius: 0.6rem;
        }
    }
    .type_tab:first-child.active_type_tab{
        left:-1px;
    }
    .type_tab:last-child.active_type_tab{
        right:-1px;
    }
}
</style>
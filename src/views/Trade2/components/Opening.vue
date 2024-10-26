<!-- 开仓 -->
<template>
    <div class="opening">

        <!-- Tabs -->
        <div class="open_tab_box">
            <div class="type_tabs">
                <div @click="activeType = 1" class="type_tab" :class="{ 'active_type_tab': activeType == 1 }">
                    <span class="type_tab_text">买涨</span>
                </div>
                <div @click="activeType = 2" class="type_tab" :class="{ 'active_type_tab': activeType == 2 }">
                    <span class="type_tab_text">买跌</span>
                </div>
            </div>

            <Tabs key="form" v-if="!pageLoading" class="van-tabs--sub" @change="e => activeTab = e" v-model="activeTab"
                :swipeable="false" animated :color="'#014CFA'" shrink>
                <Tab title="市价" name="0">
                    <OpeningForm @showNavDialog="showNavDialog" v-if="activeTab == 0" ref="OpeningForm0Ref" :key="0"
                        :activeTab="activeTab" :activeType="activeType" />
                </Tab>
                <Tab title="限价" name="1">
                    <OpeningForm @showNavDialog="showNavDialog" v-if="activeTab == 1" ref="OpeningForm1Ref" :key="1"
                        :activeTab="activeTab" :activeType="activeType" />
                </Tab>
                <Tab title="止盈/止损" name="2">
                    <OpeningForm @showNavDialog="showNavDialog" v-if="activeTab == 2" ref="OpeningForm2Ref" :key="2"
                        :activeTab="activeTab" :activeType="activeType" />
                </Tab>
            </Tabs>

            <div style="height: 50vh;" v-else></div>
        </div>





    </div>
</template>

<script setup>
import { ref, onMounted, computed } from "vue"
import { Tab, Tabs, ActionSheet } from "vant";
import { _search, _basic, _stocksPara, _stocksBuy } from "@/api/api"
import { useRoute } from "vue-router"
import OpeningForm from "./OpeningForm.vue"


const emits = defineEmits(['showNavDialog'])
const showNavDialog = () => {
    emits('showNavDialog')
}

const route = useRoute()
const OpeningForm0Ref = ref()
const OpeningForm1Ref = ref()
const OpeningForm2Ref = ref()



const activeType = ref(1) // 1-买涨 2-买跌
// url参数处理
if (route.query.symbol) {
    activeType.value = route.query.type || 1
}
const activeTab = ref(0) // 0-市价 1-限价 2-止盈止损
const pageLoading = ref(true)
onMounted(() => {
    setTimeout(() => {
        pageLoading.value = false
    }, 300)
})



// 选择某个股票
const choose = (item) => {
    OpeningForm0Ref.value && OpeningForm0Ref.value.choose(item)
    OpeningForm1Ref.value && OpeningForm1Ref.value.choose(item)
    OpeningForm2Ref.value && OpeningForm2Ref.value.choose(item)
}



defineExpose({
    choose
})
</script>

<style lang="less" scoped>
.opening {
    padding: 0.32rem 0;

    .open_tab_box {
        position: relative;
        display: flex;
        justify-content: space-between;
        
        .van-tabs--sub{
            width: 100%;
        }
        .type_tabs {
            position: absolute;
            left: 0.32rem;
            width: 2.7rem;
            height: 0.68rem;
            display: flex;
            align-items: center;
            z-index: 99;
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

        .van-tabs--sub {
            margin-top: 0.1rem;
        }
    
        :deep(.van-tabs__nav) {
            margin-left: 3.4rem !important;

        }
    }


}
</style>

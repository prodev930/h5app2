<!-- 充提记录弹窗 -->
<template>
    <Teleport to="#app">
        <div class="fix_block_record" @click.stop="() => { }"
            :class="{ 'fix_block_open': openList, 'hidden_fix_block': props.hiddenBeforeOpen && !openList, 'fix_block_down': scrollDir == 'down' }"
            :style="{ bottom: bottom }">
            <div class="fix_block_header" @click="openRecord" v-show="!openList">
                <!-- <Icon name="arrow-up" class="arrow" v-show="openList" :class="{ 'arrow_active': openList }" /> -->
                <div class="header_box">
                    <div class="header_box_icon">
                        <img src="/static/img/common/time_icon.png" alt="img">

                        <div class="header_num" v-if="hintNum">{{ hintNum }}</div>
                    </div>
                </div>
            </div>

            <div class="close_icon" @click="close" v-if="openList">
                <img src="/static/img/common/close.png" alt="img">
            </div>

            <div class="list_box list" :class="{ 'open_list': openList }">
                <Tabs v-if="openList" style="width:100%" :lazy-render="false" v-model:active="currTab" type="card"
                    sticky animated shrink>
                    <Tab :title="'充值记录'" name="1">
                        <div style="padding: 0 0.32rem">
                            <Loaidng :loading="listLoading && !depositList.length" />
                            <RechargeItem v-for="(item, i) in depositList" :item="item" :key="i" />
                            <NoData v-if="!listLoading && !depositList.length" />
                        </div>
                    </Tab>
                    <Tab :title="'提现记录'" name="2">
                        <div style="padding: 0 0.32rem">
                            <Loaidng :loading="listLoading && !withdrawList.length" />
                            <WithdrawItem v-for="(item, i) in withdrawList" :item="item" :key="i" />
                            <NoData v-if="!listLoading && !withdrawList.length" />
                        </div>
                    </Tab>
                </Tabs>
            </div>
        </div>
    </Teleport>

</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from "vue"
import { _depositList, _withdrawList } from "@/api/api"
import RechargeItem from "./RecordItem/RechargeItem"
import WithdrawItem from "./RecordItem/WithdrawItem"
import Loaidng from "@/components/Loaidng.vue"
import NoData from "@/components/NoData.vue"
import { Icon, Tabs, Tab } from "vant"
import store from "@/store"


const hintNum = computed(() => store.state.hintNum || 0)
const props = defineProps({
    bottom: { // 初始位置
        type: String,
        default: 0,
    },
    hiddenBeforeOpen: { // 未打开前隐藏
        type: Boolean,
        default: true
    },
    scrollFather: {
        type: String,
        default: '.page'
    }
})


// 打开记录
const openList = ref(false)
const currTab = ref(1) // 1-充值记录  2-提现记录
const openRecord = () => {
    openList.value = !openList.value
    if (openList.value) {
        getList()
        setTimeout(() => {
            document.body.addEventListener('click', close)
        }, 500)
    }
}

// 获取充值记录
const listLoading = ref(false)
const depositList = ref([])
const withdrawList = ref([])
const getList = () => {
    listLoading.value = true
    let i = 0
    _depositList({ // 充值记录
        page: 1
    }).then(res => {
        depositList.value = res.data || []
    }).finally(() => {
        i++
        if (i == 2) {
            listLoading.value = false
        }
    })

    _withdrawList({ // 提现记录
        page: 1
    }).then(res => {
        withdrawList.value = res.data || []
    }).finally(() => {
        i++
        if (i == 2) {
            listLoading.value = false
        }
    })
}

const close = () => {
    openList.value = false
    setTimeout(() => {
        document.body.removeEventListener('click', close)
    }, 0)
}

defineExpose({
    openRecord,
    close
})

const lastTop = ref(0)
const scrollDir = ref('up')
const scrollHanler = (event) => {
    // 获取当前滚动位置
    let scrollTop = event.target.scrollTop;
    if (scrollTop >= lastTop.value) {
        scrollDir.value = 'down'
    } else {
        scrollDir.value = 'up'
    }
    // 更新上一次滚动位置
    lastTop.value = scrollTop;
}

onMounted(() => {
    document.querySelector(props.scrollFather)?.addEventListener('scroll', scrollHanler)
})
onBeforeUnmount(() => {
    document.querySelector(props.scrollFather)?.removeEventListener('scroll', scrollHanler)
})

</script>

<style lang="less">
.fix_block_record {
    width: 100vw;
    position: fixed;
    overflow: hidden;
    z-index: 99;
    left: auto;
    border-top-left-radius: 0.4rem;
    border-top-right-radius: 0.4rem;
    background-color: #fff;
    box-shadow: -2px 0 5px #ddd;
    transform: translateY(0);

    .fix_block_header {
        height: 1rem;
        display: flex;
        align-items: center;
        justify-content: flex-start;
        padding: 0 0.4rem;
        font-size: 0.3rem;
        overflow: hidden;
        position: relative;


        .arrow {
            margin-right: 0.2rem;
            transition: all ease .8s;
        }

        .arrow_active {
            transform: rotate(180deg);
        }

        .header_box {
            // background: linear-gradient(270deg, #504BFF 0%, #53B4FF 100%);
            background: linear-gradient(270deg, #0C05FF 0%, #008DF9 100%);
            width: 1.5rem;
            height: 0.62rem;
            border-radius: 0.3rem;
            position: absolute;
            left: 50%;
            transform: translateX(-50%);
            display: flex;
            align-items: center;
            justify-content: center;

            &:active {
                background: linear-gradient(270deg, #504BFF 0%, #53B4FF 100%);
            }

            .header_box_icon {
                width: 0.48rem;
                height: 0.48rem;
                position: relative;

                .header_num {
                    background-color: #fff;
                    height: 0.24rem;
                    font-size: 0.2rem;
                    line-height: 0.24rem;
                    font-weight: 200;
                    padding: 0 0.1rem;
                    border-radius: 0.2rem;
                    position: absolute;
                    top: -0.1rem;
                    right: -0.16rem;
                }
            }
        }
    }



    .close_icon {
        width: 0.32rem;
        height: 0.32rem;
        position: absolute;
        right: 0.32rem;
        top: 0.32rem;
        z-index: 999;
    }


    .list {
        height: 0;
        padding: 0 0 0 0;
        overflow: hidden;
        transition: all ease .3s;
    }

    .open_list {
        height: calc(var(--app-height) - 5.5rem);
        overflow-y: auto;
        padding: 0.32rem 0 0 0;
    }

    .van-tabs__nav--card {
        border: none;
    }

    .van-tab--card {
        border-right: none;
        color: #061023;
        // background-color: #f5f5f5;
        // border-radius: 0.3rem;
        // margin-left: 0.1rem;
        // transition: all ease .2s;
    }

    .van-tab--card.van-tab--active {
        // background-color: #014CFA;
        // color: #fff;

        background-color: #F6F8FF;
        border-radius: 0.3rem;
        color: #014CFA;
        font-weight: 500
    }

    .van-tab--shrink {
        padding: 0 0.3rem;
    }

    .van-tabs__wrap {
        height: 0.8rem;
        border-bottom: 1px solid #F6F8FF;
        padding-bottom: 0.2rem;
    }

    .van-tabs__nav--card {
        height: 0.6rem;
    }

    .van-tab {
        line-height: 0.6rem;
        font-size: 0.28rem;
    }
}

.fix_block_open {
    .fix_block_header {
        height: 0.8rem;
    }
}

.hidden_fix_block {
    bottom: -2rem !important;
}

.fix_block_down {
    transform: translateY(100%)
}

@media (min-width: 751px) {

    .fix_block_record {
        width: 375px;
    }

}
</style>
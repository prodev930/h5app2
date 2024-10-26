<!-- IPO -->
<template>
    <div class="page_ipo">
        
        <Tabs v-show="props.page != 'home'" type="custom-card" v-model:active="selectedOption" :swipeable="false" animated :color="'#014CFA'"
            shrink @change="init(true)">
            <Tab :title="i.text" :name="i.value" v-for="(i, key) in option" :key="key">
            </Tab>
        </Tabs>

         <Tabs  class="van-tabs--oval-sub" v-model:active="selectedLever" :swipeable="false" animated :color="'#014CFA'"
            shrink @change="init(true)">
            <Tab :title="i.text" :name="i.value" v-for="(i, key) in leverOption" :key="key">
            </Tab>
        </Tabs>

        <div class="list">
            <div class="item" v-for="(item, i) in ipoDataList" :key="i" @click="openDetail(item)">
                <div class="item_box">
                    <div class="name_box">
                        <div class="name">{{ item.company_name }}</div>
                        <img  v-if="item.lever > 1" src="/static/img/trade/level.png"/>
                    </div>
                    <div class="pre_times" v-if="item.status == 'none' && item._timedown">
                        <div class="pre_time">{{ item._timedown[0] }}</div>
                        <span>:</span>
                        <div class="pre_time">{{ item._timedown[1] }}</div>
                        <span>:</span>
                        <div class="pre_time">{{ item._timedown[2] }}</div>
                    </div>
                    
                    <!-- 认购中 -->
                    <div class="status_ing" v-if="item.status == 'issuing'">认购中</div>
                    <!-- 预售中 -->
                    <div class="status_ing status_pre" v-if="item.status == 'none'">预售</div>
                    <!-- 已结束 -->
                    <div class="status_ing status_ed" v-if="item.status == 'listed'">已上市</div>
                    <!-- 已结束 -->
                    <div class="status_ing status_done" v-if="item.status == 'done'">已结束</div>
                </div>
                <div class="item_info" :class="{'item_info_nobb':item.status != 'issuing' && item.status != 'listed'}">
                    <div class="info_cell">
                        <span class="info_name">认购价格</span>
                        <span class="info_price">{{ item.issue_price_max }}</span>
                    </div>
                    <div class="info_cell" v-if="item.lever > 1">
                        <span class="info_name">认购杠杆</span>
                        <span class="info_price">{{ item.lever + 'X' }}</span>
                    </div>
                    <div class="info_cell">
                        <span class="info_name">上市时间</span>
                        <span class="info_price">{{ item.listing_date }}</span>
                    </div>
                    
                    <div class="info_cell" v-if="item.listing_price">
                        <span class="info_name">上市价格</span>
                        <span class="info_price">{{ item.listing_price }}</span>
                    </div>
                    <div class="info_cell">
                        <span class="info_name">认购日期</span>
                        <span class="info_date">{{ item.issue_start_date }} - {{ item.issue_end_date }}</span>
                    </div>
                    
                </div>
                <div class="control_box" v-if="item.status == 'issuing' || item.status == 'listed'">
                    <div class="btn"
                        @click.stop="goBuy(item)">认购</div>
                </div>
                
            </div>

            <LoadingMore v-if="!(finish && ipoDataList.length == 0)" :loading="loading" :finish="finish" />
            <NoData v-if="(finish && ipoDataList.length == 0)" />
        </div>

        <!-- 详情弹窗 -->
        <teleport to="body">
            <Popup style="background-color: rgba(0,0,0,0);" :safe-area-inset-top="true" :safe-area-inset-bottom="true"
                v-model:show="showPopupInfo" position="bottom" closeable>
                <div class="ipo_detail">
                    <div class="detail_title">IPO详情</div>

                    <div class="detail_item">
                        <div class="name">{{ currDetail.company_name }}</div>
                        <div class="status" :class="{ 'close_status': currDetail.status == 'done' }">{{
                            (currDetail.status
                                == 'issuing' || currDetail.status == 'listed') ? '认购中'
                                : (currDetail.status == 'none' ? '预售中' : '已结束') }}</div>
                    </div>
                    <div class="detail_item">
                        <div>股票代码</div>
                        <div class="val">--</div>
                    </div>
                    <div class="detail_item">
                        <div>认购价格</div>
                        <div class="val">{{ currDetail.issue_price_max || '--' }}</div>
                    </div>
                    <div class="detail_item">
                        <div>认购开始日期</div>
                        <div class="val">{{ currDetail.issue_start_date || '--' }}</div>
                    </div>
                    <div class="detail_item">
                        <div>认购结束日期</div>
                        <div class="val">{{ currDetail.issue_end_date || '--' }}</div>
                    </div>
                    <div class="detail_item">
                        <div>上市日期</div>
                        <div class="val">{{ currDetail.listing_date || '--' }}</div>
                    </div>
                    <div class="detail_item">
                        <div>上市价格</div>
                        <div class="val">{{ currDetail.listing_price || '--' }}</div>
                    </div>
                    <div class="detail_item">
                        <div>最低认购数量</div>
                        <div class="val">--</div>
                    </div>
                    <div class="detail_item">
                        <div>VIP认购</div>
                        <div class="val">{{ currDetail.lever ? currDetail.lever + 'X' : '--' }}</div>
                    </div>
                    <div class="detail_item">
                        <div>VIP利息</div>
                        <div class="val">--</div>
                    </div>
                </div>
            </Popup>
        </teleport>
    </div>
</template>

<script setup>
import LoadingMore from "@/components/LoadingMore.vue"
import NoData from "@/components/NoData.vue"
import { ref, computed, onMounted, onBeforeUnmount } from "vue"
import store from "@/store"
import { _ipoList, _ipoGet } from "@/api/api";
import { Tabs,Tab,Popup } from "vant"
import router from "@/router"

const props = defineProps({
    scrollDom: {
        type: String,
        default: '.page'
    },
    page: {
        type: String,
        default: ''
    }
})

const ipoDataList = computed(() => store.state.ipoDataList || [])
const selectedOption = ref('')
const option = [
    { text: "全部", value: "" },
    { text: "预售中", value: "none" },
    { text: "认购中", value: "issuing" },
    { text: "已结束", value: "done" },
    { text: "已上市", value: "listed" }
];
const selectedOptiontext = computed(() => option.find(item => item.value == selectedOption.value).text)

const selectedLever = ref("")
const leverOption = [
    { text: "全部", value: "" },
    { text: "普通", value: "1" },
    { text: "配资", value: "2" },
]
const loading = ref(false)
const finish = ref(false)
const page = ref(0)

// 初始化
const init = (reset) => {
    if (reset) {
        store.commit('setIpoDataList', [])
    }
    loading.value = false
    finish.value = false
    page.value = 0
    getData()
}
// 获取数据
const getData = () => {
    if (loading.value || finish.value) return
    loading.value = true
    page.value++
    const par = {
        status: selectedOption.value,
        page: page.value,
        lever:''
    }
    if(selectedLever.value == '1'){
        par.lever = false
    }else if(selectedLever.value == '2'){
        par.lever = true
    }
    _ipoList(par).then(res => {
        if (res.data && res.data.length) {
            res.data = res.data.map(item => {
                item._timedown = countdown(item.listing_date)
                return item
            })
            if (page.value == 1) {
                store.commit('setIpoDataList', res.data)
            } else {
                store.commit('setIpoDataList', [...ipoDataList.value, ...res.data])
            }
        } else {
            setTimeout(() => {
                finish.value = true
            }, 500)
        }
    }).finally(() => {
        setTimeout(() => {
            loading.value = false
        }, 500)
    })
}

// 滚动监听
let loadingMore = ''
const totalHeight = window.innerHeight || document.documentElement.clientHeight;
const scrollHandler = () => {
    if (!loadingMore) return
    const rect = loadingMore.getBoundingClientRect()
    if (rect.top <= totalHeight) {
        // 加载更多
        getData()
    }
}
// 倒计时
let interval = null
onMounted(() => {
    interval = setInterval(() => {
        const arr = ipoDataList.value.map(item => {
            item._timedown = countdown(item.listing_date)
            return item
        })
        store.commit('setIpoDataList', arr)
    }, 1000)
    setTimeout(() => {
        loadingMore = document.querySelector('.loading_more')
        try {
            document.querySelector(props.scrollDom).addEventListener('scroll', scrollHandler)
        } catch {}
    }, 500)


    Promise.all([
        import('@/views/Market/IpoSubscription.vue'),
    ])
})
onBeforeUnmount(() => {
    if (interval) clearInterval(interval)
    try {
        document.querySelector('.page').removeEventListener('scroll', scrollHandler)
    }catch {}
})

defineExpose({
    init
})

// 去购买
const goBuy = (query) => {
    router.push({
        name: 'subscription',
        query
    })
}


// 详情
const showPopupInfo = ref(false)
const currDetail = ref({})
const openDetail = (val)=>{
    router.push('/ipo/detail?id='+val.id)
}
// const openDetail = (val) => {
//     currDetail.value = val
//     showPopupInfo.value = true
//     _ipoGet({
//         id: currDetail.value.id
//     }).then(res => {
//         if (res.data) {
//             currDetail.value = {
//                 ...currDetail.value,
//                 ...res.data
//             }
//         }
//     })
// }


function countdown(endTime) {
    if (!endTime) return ['--', '--', '--']
    const endDate = new Date(endTime);
    const now = new Date();
    const diff = endDate - now;
    if (diff <= 0) {
        return ["--", "--", "--"];
    }
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);
    const formattedHours = String(hours).padStart(2, '0');
    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedSeconds = String(seconds).padStart(2, '0');
    return [formattedHours, formattedMinutes, formattedSeconds];
}
</script>

<style lang="less" scoped>

.page_ipo {
    padding: 0.28rem 0.32rem 0 0.32rem;
    .van-tabs--oval-sub{
        margin-top:0.32rem;
    }
    :deep(.van-tab--custom-card){
        padding: 0 0.12rem !important;
    }
    .list {
        padding-top: 0.12rem;

        .item {
            border-radius: 0.32rem;
            border: 1px solid #EFF3F8;
            background: #F5F7FC;
            margin-top: 0.2rem;
                
            .name {
                color: #061023;
                font-size: 0.32rem;
                font-weight: 600;
                line-height: 0.36rem; 
                color: #0D0D12;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
                height: 0.36rem; 
                white-space: wrap;
                word-break: keep-all;
                margin-bottom: 0.14rem;
                max-width: 80%;
            }
            .name_box{
                display: flex;
                img{
                    width: 0.34rem !important;
                    height: 0.34rem !important;
                    margin-left: 0.08rem;
                }
            }
            .item_box {
                padding: 0.26rem 0.32rem 0.16rem 0.32rem;
                position: relative;
                
            }

            .pre_times {
                display: flex;
                align-items: center;
                .pre_time {
                    height: 0.48rem;
                    min-width: 0.48rem;
                    display: flex;
                    align-items: center;
                    text-align: center;
                    justify-content: center;
                    color: #FFAF2A;
                    border: 1px solid #FFAF2A;
                    border-radius: 0.12rem;
                    font-size: 0.28rem;
                    font-weight: 600;
                    box-sizing: border-box;

                }
                span {
                    color: #FFAF2A;
                    margin: 0 0.1rem;
                    font-size: 0.28rem;
                }
            }

            .status_ing {
                height: 0.6rem;
                border-radius: 0rem 0.32rem;
                padding: 0 0.2rem;
                background-color: #014CFA;
                min-width: 1.1rem;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 0.24rem;
                color: #fff;
                position: absolute;
                right:0;
                top:0;
            }

            .status_pre {
                background-color: #FFAF2A;
                color: #fff;
            }

            .status_done {
                background-color: #7E99D6;
                color: #fff;
            }

            .status_ed {
                background-color: #18B762;
                color: #fff;
            }

            .item_info {
                border-radius: 0.32rem;
                border: 1px solid #EFF3F8;
                background: #FFF;
                position: relative;
                left:-1px;
                width: calc(100% + 2px);
                box-sizing: border-box;
                line-height: 0.3rem;
                .info_cell{
                    display: flex;
                    justify-content: space-between;
                    padding: 0.24rem 0.32rem;
                }
                .info_cell + .info_cell{
                    border-top: 1px dashed #EFF3F8;
                }
                .info_name{
                    font-size: 0.28rem;
                    color:#8F92A1;
                }
                .info_date,
                .info_price {
                    color: #061023;
                    font-size: 0.28rem;
                }
            }
            .item_info_nobb{
                border-bottom: 0px;
            }

            .control_box {
                padding: 0.2rem 0.32rem;
                .btn {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    background-color: #014CFA;
                    height: 0.8rem;
                    border-radius: 0.5rem;
                    color: #fff;
                    font-size: 0.3rem;
                    font-weight: 600;
                }

                
            }
        }
    }
    
}

.market_ipo-popup {
    border-top-left-radius: 0.36rem;
    border-top-right-radius: 0.36rem;
    border-bottom-left-radius: 0;
    border-bottom-right-radius: 0;
    padding-bottom: 1.2rem;

    .market_ipo-box {
        margin-top: 1rem;

        .market_ipo-box-item {
            width: 100%;
            height: 0.96rem;
            text-align: center;
            line-height: 0.96rem;
            color: #333333;
            font-size: 0.28rem;
            font-style: normal;
            font-weight: 400;
            border-bottom: 0.02rem solid #f4f5f7;
        }

        .market_ipo-box-item:first-of-type {
            margin-right: 0.3rem;
        }

        .selected-class {
            color: #014cfa;
            background-color: #f4f5f7;
            position: relative;
        }
    }
}

.ipo_detail {
    border-top-left-radius: 0.36rem;
    border-top-right-radius: 0.36rem;
    border-bottom-left-radius: 0;
    border-bottom-right-radius: 0;
    background-color: #fff;
    padding: 0.32rem 0.32rem 0.4rem 0.32rem;
    position: relative;

    .detail_title {
        text-align: center;
        font-size: 0.32rem;
        margin-bottom: 0.32rem;
    }

    .detail_item {
        display: flex;
        align-items: center;
        justify-content: space-between;
        height: 1rem;
        border-bottom: 1px solid #F5F5F5;
        color: #8F92A1;
        font-size: 0.28rem;
        font-weight: 400;

        .name {
            color: #0D0D12;
            font-weight: 600;
            font-size: 0.32rem;
        }

        .status {
            height: 0.48rem;
            background-color: #E4ECFB;
            color: #014CFA;
            font-size: 0.24rem;
            padding: 0 0.32rem;
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 0.08rem;
            white-space: nowrap;
        }

        .close_status {
            background-color: #EBEBEB;
            color: #838383;
        }

        .val {
            color: #121826;
            font-weight: 500
        }
    }
}
</style>
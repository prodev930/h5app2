<!-- 中签 -->
<template>
  <div v-if="token" class="page_ipo_stock">

    <Tabs  type="custom-card" v-model:active="ipoActive" :swipeable="false" @change="ipoOnChange"  :color="'#014CFA'" 
        shrink>
        <Tab title="全部" name="">
        </Tab>
        <Tab title="待中签" name="lock">
        </Tab>
        <Tab title="已中签" name="success">
        </Tab>
        <Tab title="未中签" name="failure">
        </Tab>
    </Tabs>
    <div class="list">
      <div class="item" v-for="(item, i) in ipoStockList" :key="i" @click="ipoOrderDetail(item)">
          <div class="item_box">
            <div class="name_box">
              <div class="name">{{ item.company_name }}</div>
              <img v-if="item.lever > 1" src="/static/img/trade/level.png"/>
            </div>
            
            <div class="item_winning">
              中签数量：<strong>{{ item.winning || '--' }}</strong>
            </div>

            <div class="status_box" v-if="item.status == 'success'" style="background-image: url(/static/img/trade/ipo_status_success.png);">
              
            </div>
            <div class="status_box" v-else-if="item.status == 'failure'" style="background-image: url(/static/img/trade/ipo_status_failure.png);">
              
            </div>
            <div class="status_box" v-else style="background-image: url(/static/img/trade/ipo_status_lock.png);">
              
            </div>
          </div>
          <div class="item_info">
            <div class="info_cell">
              <span class="info_name">认购价格</span>
              <span class="info_val">{{ item.issue_price || '--' }}</span>
            </div>
            <div class="info_cell">
              <span class="info_name">认购数量</span>
              <span class="info_val">{{ item.volume || '--' }}<span class="info_lever" v-if="item.lever > 1">{{ item.lever }}X</span></span>
            </div>
            <div class="info_cell" v-if="item.listing_date">
              <span class="info_name">上市日期</span>
              <span class="info_val">{{ item.listing_date || '--' }}</span>
            </div>
            <div class="info_cell" v-if="item.listed_price">
              <span class="info_name">上市价格</span>
              <span class="info_val">{{ item.listed_price || '--' }}</span>
            </div>
            <div class="info_cell">
              <span class="info_name">认购日期</span>
              <span class="info_val">{{ item.created || '--' }}</span>
            </div>
          </div>
      </div>

      <LoadingMore style="margin-top: 0.8rem;" v-if="!(finish && ipoStockList.length == 0)" :loading="loading" :finish="finish" />
      <NoData v-if="(finish && ipoStockList.length == 0)" />
    </div>

    <!-- 详情弹窗 -->
    <teleport to="body">
      <Popup style="background-color: rgba(0,0,0,0);" :safe-area-inset-top="true" :safe-area-inset-bottom="true"
        v-model:show="showPopupInfo" position="bottom" closeable>
        <div class="ipo_stock_detail">
          <div class="detail_title">中签详情</div>

          <div class="detail_item">
            <div class="name">{{ currDetail.company_name }}</div>
            <div class="status" :class="['status_' + currDetail.status]">{{ statusMap[currDetail.status] || '--' }}
            </div>
          </div>
          <div class="detail_item">
            <div>股票代码</div>
            <div class="val">{{ currDetail.symbol || '--' }}</div>
          </div>
          <div class="detail_item">
            <div>认购价格</div>
            <div class="val">{{ currDetail.issue_price || '--' }}</div>
          </div>
          <div class="detail_item">
            <div>认购开始日期</div>
            <div class="val">{{ currDetail.created || '--' }}</div>
          </div>
          <div class="detail_item">
            <div>认购结束日期</div>
            <div class="val">{{ '--' }}</div>
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
            <div>认购数量</div>
            <div class="val">{{ currDetail.volume || '--' }}</div>
          </div>
          <div class="detail_item">
            <div>VIP认购</div>
            <div class="val">{{ currDetail.lever ? currDetail.lever + 'X' : '--' }}</div>
          </div>
          <div class="detail_item">
            <div>VIP利息</div>
            <div class="val">{{ currDetail.fee || '--' }}</div>
          </div>
        </div>
      </Popup>
    </teleport>
  </div>

  <UnLogin @loginfinish="loginfinish" v-show="!token" />
</template>

<script setup>
import LoadingMore from "@/components/LoadingMore.vue"
import NoData from "@/components/NoData.vue"
import { ref, computed, onMounted, onBeforeUnmount } from "vue"
import store from "@/store"
import { _orderList, _orderGet } from "@/api/api";
import { Popup, Tabs,Tab } from "vant"
import router from "@/router"
import UnLogin from "@/components/UnLogin.vue"

const ipoActive = ref("")
const loginfinish = () => {

}
const ipoOnChange = ()=>{
  init(true)
}
const token = computed(() => store.state.token)

const statusMap = ref({
  lock: '锁定',
  success: '中签',
  failure: '未中签'
})

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

const ipoStockList = computed(() => store.state.ipoStockList || [])

const loading = ref(false)
const finish = ref(false)
const page = ref(0)

// 初始化
const init = (reset) => {
  if (token.value) {
    if (reset) {
      store.commit('setIpoStockList', [])
    }
    loading.value = false
    finish.value = false
    page.value = 0
    getData()
  }
}
// 获取数据
const getData = () => {
  if (loading.value || finish.value) return
  loading.value = true
  page.value++
  _orderList({
    status:ipoActive.value,
    page: page.value
  }).then(res => {
    if (res.data && res.data.length) {
      res.data = res.data.map(item => {
        return item
      })
      if (page.value == 1) {
        store.commit('setIpoStockList', res.data)
      } else {
        store.commit('setIpoStockList', [...ipoStockList.value, ...res.data])
      }
    } else {
      finish.value = true
    }
  }).finally(() => {
    loading.value = false
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
onMounted(() => {
  setTimeout(() => {
    loadingMore = document.querySelector('.loading_more')
    try {
      document.querySelector(props.scrollDom).addEventListener('scroll', scrollHandler)
    } catch { }
  }, 500)
})
onBeforeUnmount(() => {
  try {
    document.querySelector('.page').removeEventListener('scroll', scrollHandler)
  } catch { }
})

defineExpose({
  init
})

// 订单详情
const ipoOrderDetail = (item)=>{
    router.push('/ipo/orderDetail?order_no='+item.order_no)
}

// 详情
const showPopupInfo = ref(false)
const currDetail = ref({})
const openDetail = (val) => {
  currDetail.value = val
  showPopupInfo.value = true
  _orderGet({
    order_no: currDetail.value.order_no
  }).then(res => {
    if (res.data) {
      currDetail.value = {
        ...currDetail.value,
        ...res.data
      }
    }
  })
}


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
.page_ipo_stock {
  padding: 0.28rem 0.32rem 0 0.32rem;

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
          .item_winning{
            color: #8F92A1;
            font-size: 0.28rem;
            font-weight: 400;
            line-height: 0.36rem;
            strong{
              color:#014CFA;
              margin-left: 0.18rem;
            }
          }
          .item_box {
              padding: 0.24rem 0.32rem ;
              position: relative;
              
          }
          .status_box{
            width: 1.26738rem;
            height: 1.17056rem;
            position: absolute;
            right:-0.14rem;
            top:-0.02rem;
            background-repeat: no-repeat;
            background-size: 100% 100%;
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
              border-bottom: 0px;
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
              .info_lever{
                border-radius: 0.32rem;
                height: 0.44rem;
                line-height: 0.44rem;
                color:#014CFA;
                font-size: 0.28rem;
                padding: 0 0.12rem;
                background: rgba(1, 76, 250, 0.08);
                margin-left: 0.12rem;
              }
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


.ipo_stock_detail {
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
      background-color: #C5C5C5;
      color: #333;
      font-size: 0.24rem;
      padding: 0 0.32rem;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 0.08rem;
      white-space: nowrap;
    }

    .status_lock {
      background-color: #ffe3ac;
      color: #FFA800;
    }

    .status_success {
      color: #0953FA;
      background-color: #8BB2FC
    }

    .val {
      color: #121826;
      font-weight: 500
    }
  }
}
</style>
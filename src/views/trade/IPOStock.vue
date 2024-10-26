<!-- 中签 -->
<template>
  <div class="page_ipo_stock">

    <div class="list">
      <div class="item" v-for="(item, i) in ipoStockList" :key="i" @click="openDetail(item)">
        <div class="item_top">
          <div class="item_top_box">
            <div class="name">{{ item.company_name }}</div>
            <div class="item_top_info">
              <div>
                <span class="info_name">发行价格</span>
                <span class="info_val">{{ item.issue_price || '--' }}</span>
              </div>
              <div>
                <span class="info_name">认购数量</span>
                <span class="info_val">{{ item.volume || '--' }}</span>
              </div>
              <div v-if="item.winning">
                <span class="info_name">中签数量</span>
                <span class="info_price">{{ item.winning || '--' }}股</span>
              </div>
              <div>
                <span class="info_name">认购日期</span>
                <span class="info_val">{{ item.created || '--' }}</span>
              </div>
              <div v-if="item.listing_date">
                <span class="info_name">上市日期</span>
                <span class="info_val">{{ item.listing_date || '--' }}</span>
              </div>
              <div v-if="item.listed_price">
                <span class="info_name">上市价格</span>
                <span class="info_val">{{ item.listed_price || '--' }}</span>
              </div>
            </div>
          </div>
          <div class="control_box">
            <div class="status_box" :class="['status_box_' + item.status]">
              <div class="status_box_inner">
                <div class="status_text">{{ statusMap[item.status] || '--' }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <LoadingMore v-if="!(finish && ipoStockList.length == 0)" :loading="loading" :finish="finish" />
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
</template>

<script setup>
import LoadingMore from "@/components/LoadingMore.vue"
import NoData from "@/components/NoData.vue"
import { ref, computed, onMounted, onBeforeUnmount } from "vue"
import store from "@/store"
import { _orderList, _orderGet } from "@/api/api";
import { Popup } from "vant"
import router from "@/router"

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
  if (reset) {
    store.commit('setIpoStockList', [])
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
  _orderList({
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
onMounted(() => {
  setTimeout(() => {
    loadingMore = document.querySelector('.loading_more')
    try {
      document.querySelector(props.scrollDom).addEventListener('scroll', scrollHandler)
    } catch {}
  }, 500)
})
onBeforeUnmount(() => {
  try {
    document.querySelector('.page').removeEventListener('scroll', scrollHandler)
  } catch {}
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
  padding: 0 0.32rem;

  .list {
    margin-top: 0.2rem;
    border-top: 1px solid #EAEAEA;

    .item {
      border-bottom: 1px solid #EAEAEA;
      padding: 0 0 0.1rem 0;
      position: relative;

      .item_top {
        display: flex;
        align-items: stretch;
        justify-content: space-between;
        padding: 0.28rem 0;

        .name {
          font-size: 0.28rem;
          font-weight: 600;
          color: #0D0D12;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          flex: 1;
          margin-right: 0.4rem;
          line-height: 0.48rem;
          margin-bottom: 0.2rem;
          white-space: wrap;
          word-break: keep-all;
        }

        .item_top_box {
          .item_top_info {
            color: #818898;
            font-size: 0.24rem;
            line-height: 0.48rem;
            font-weight: 400;

            .info_val {
              color: #000000;
              margin-left: 0.24rem;
            }

            .info_price {
              color: #0953FA;
              font-size: 0.24rem;
              margin-left: 0.24rem;
            }
          }
        }

        .control_box {
          flex-shrink: 0;

          .status_box {
            width: 1.8rem;
            height: 1.8rem;
            border-radius: 50%;
            border: 1px solid #C5C5C5;
            right: 0.2rem;
            padding: 0.1rem;

            .status_box_inner {
              border: 1px solid #C5C5C5;
              width: 100%;
              height: 100%;
              border-radius: 50%;
              display: flex;
              align-items: center;
              justify-content: center;

              .status_text {
                height: 0.6rem;
                padding: 0 0.1rem;
                display: flex;
                align-items: center;
                justify-content: center;
                line-height: 0;
                color: #333;
                font-size: 0.4rem;
                font-weight: 600;
                border-top: 1px dashed #C5C5C5;
                border-bottom: 1px dashed #C5C5C5;
                transform: rotate(-30deg);
                white-space: nowrap;
              }
            }
          }

          .status_box_lock {
            border: 1px solid #FFA800;

            .status_box_inner {
              border: 1px solid #ffe3ac;

              .status_text {
                color: #FFA800;
                border-top: 1px dashed #ffe3ac;
                border-bottom: 1px dashed #ffe3ac;
              }
            }
          }

          .status_box_success {
            border: 1px solid #0953FA;

            .status_box_inner {
              border: 1px solid #8BB2FC;

              .status_text {
                color: #0953FA;
                border-top: 1px dashed #8BB2FC;
                border-bottom: 1px dashed #8BB2FC;
              }
            }
          }
        }
      }

    }
  }

}
</style>
<style lang="less">
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
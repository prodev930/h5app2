<template>
    <div class="ipo_stock_detail">
        <Top title="IPO订单详情"></Top>
        <div class="scroller loading_box" v-if="loading">
            <Loading color="#014CFA" />
            <div class="loading_text">加载中...</div>
        </div>
        <div class="scroller" v-else>
            
            <div class="status_box" v-if="currDetail.status == 'success'">
                <svg xmlns="http://www.w3.org/2000/svg" width="60" height="60" viewBox="0 0 60 60" fill="none">
                    <rect width="60" height="60" rx="16" fill="#18B762" fill-opacity="0.1"/>
                    <path d="M30.59 18.1062L36.3146 12.3869C32.0366 10.705 27.3098 10.548 22.9297 11.9424C18.5495 13.3368 14.7834 16.1975 12.2651 20.043C9.74675 23.8885 8.62996 28.4842 9.10263 33.0565C9.5753 37.6289 11.6086 41.8989 14.8603 45.148C18.1121 48.397 22.3837 50.4268 26.9565 50.8956C31.5293 51.3645 36.124 50.2439 39.9674 47.7224C43.8109 45.2009 46.6684 41.4324 48.0592 37.0511C49.45 32.6698 49.2891 27.9432 47.6036 23.6666L41.8884 29.3818C42.2273 32.0698 41.718 34.7966 40.4317 37.1811C39.1453 39.5655 37.1462 41.4885 34.7136 42.6814C32.2811 43.8743 29.5366 44.2774 26.8638 43.8344C24.1909 43.3914 21.7233 42.1245 19.8056 40.2107C17.8879 38.2968 16.616 35.8317 16.1676 33.1598C15.7193 30.4878 16.1169 27.7426 17.3049 25.3076C18.4929 22.8726 20.4119 20.8696 22.7937 19.5785C25.1756 18.2874 27.9013 17.7726 30.59 18.1062Z" fill="#18B762"/>
                    <path d="M27.2445 26.2222C26.7845 26.6444 26.4147 27.1553 26.1573 27.7242C25.9 28.2931 25.7605 28.9082 25.7471 29.5325C25.7337 30.1567 25.8468 30.7772 26.0796 31.3566C26.3123 31.936 26.6599 32.4623 27.1015 32.9038C27.543 33.3453 28.0693 33.6929 28.6486 33.9257C29.228 34.1584 29.8485 34.2715 30.4728 34.2581C31.097 34.2448 31.7121 34.1052 32.281 33.8479C32.8499 33.5906 33.3608 33.2208 33.783 32.7608L37.7128 28.831C38.1876 30.7408 38.0232 32.7536 37.2447 34.561C36.4663 36.3684 35.1168 37.8708 33.4029 38.838C31.689 39.8052 29.7053 40.1838 27.7557 39.9158C25.806 39.6479 23.998 38.7482 22.6086 37.3545C21.2192 35.9608 20.325 34.15 20.063 32.1996C19.801 30.2492 20.1857 28.2666 21.1581 26.5557C22.1305 24.8448 23.637 23.4999 25.4468 22.727C27.2566 21.954 29.2699 21.7958 31.1783 22.2764L27.2445 26.2222Z" fill="#18B762"/>
                    <path d="M47.2579 18.3584L48.9512 16.6838C48.9727 16.6616 48.9871 16.6336 48.9928 16.6033C48.9985 16.5731 48.9951 16.5418 48.9832 16.5134C48.9713 16.4849 48.9512 16.4607 48.9256 16.4435C48.9 16.4264 48.87 16.4171 48.8391 16.4169H43.7284C43.6873 16.4169 43.648 16.4006 43.6189 16.3715C43.5899 16.3425 43.5736 16.3031 43.5736 16.2621V11.1553C43.5746 11.124 43.5659 11.0931 43.5488 11.0668C43.5317 11.0405 43.5069 11.0201 43.4778 11.0083C43.4487 10.9965 43.4168 10.9939 43.3862 11.0009C43.3556 11.0079 43.3278 11.024 43.3067 11.0472L35.7941 18.6346L34.0593 20.4361C33.9462 20.5533 33.8826 20.7096 33.8819 20.8724V24.1764C33.8818 24.258 33.8655 24.3387 33.8338 24.4139L29.944 28.301C29.7124 28.5332 29.5823 28.8478 29.5823 29.1757C29.5823 29.5037 29.7124 29.8183 29.944 30.0504C30.0586 30.1654 30.1947 30.2566 30.3446 30.3188C30.4945 30.381 30.6551 30.4131 30.8174 30.4131C30.9797 30.4131 31.1404 30.381 31.2902 30.3188C31.4401 30.2566 31.5762 30.1654 31.6908 30.0504L34.6411 27.0987C34.6656 27.0925 34.6906 27.0889 34.7159 27.0881L35.4498 26.3541C35.5656 26.2385 35.7224 26.1732 35.8861 26.1727H39.1914C39.2723 26.1735 39.3525 26.1582 39.4274 26.1278C39.5024 26.0973 39.5705 26.0522 39.6278 25.9952L47.2152 18.4839C47.2319 18.4676 47.2446 18.4477 47.2522 18.4257C47.2599 18.4037 47.2623 18.3802 47.2592 18.3571L47.2579 18.3584Z" fill="#18B762"/>
                </svg>
                <div class="status_text" style="color:#18B762;">
                    恭喜你，已中签
                </div>
            </div>
             <div class="status_box" v-else-if="currDetail.status == 'failure'">
                <div class="status_fail">
                    <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 40 40" fill="none">
                        <g clip-path="url(#clip0_382_8469)">
                            <path d="M34.0977 5.88269C26.2802 -1.93486 13.4727 -1.93486 5.65514 5.88269C-1.99608 13.8666 -1.82975 26.5077 6.15413 34.3253C13.9717 41.8101 26.2802 41.8101 34.0977 34.3253C41.9153 26.5077 41.9153 13.8666 34.0977 5.88269ZM28.6088 28.8363C27.9435 29.5017 26.9455 29.5017 26.2802 28.8363L19.9596 22.5158L13.639 28.8363C12.9737 29.5017 11.8094 29.5017 11.3104 28.8363C10.8114 28.171 10.6451 27.173 11.3104 26.5077L17.631 20.1871L11.3104 13.8666C10.6451 13.2012 10.6451 12.2033 11.3104 11.5379C11.9757 10.8726 12.9737 10.8726 13.639 11.5379L19.9596 17.8585L26.2802 11.5379C26.9455 10.8726 28.1098 10.8726 28.6088 11.5379C29.1078 12.2033 29.2741 13.2012 28.6088 13.8666L22.2882 20.1871L28.6088 26.5077C29.2741 27.173 29.2741 28.171 28.6088 28.8363Z" fill="#8F92A1"/>
                        </g>
                        <defs>
                            <clipPath id="clip0_382_8469">
                            <rect width="40" height="40" fill="white"/>
                            </clipPath>
                        </defs>
                    </svg>
                </div>
                <div class="status_text" style="color:#666D80;">
                    很可惜，未中签
                </div>
            </div>
             <div class="status_box" v-else>
                <svg xmlns="http://www.w3.org/2000/svg" width="60" height="60" viewBox="0 0 60 60" fill="none">
                    <rect width="60" height="60" rx="16" fill="#014CFA" fill-opacity="0.1"/>
                    <path d="M30.3335 11.333C41.3795 11.333 50.3335 20.287 50.3335 31.333C50.3335 42.379 41.3795 51.333 30.3335 51.333C19.2875 51.333 10.3335 42.379 10.3335 31.333C10.3335 20.287 19.2875 11.333 30.3335 11.333ZM28.3335 20.309C27.8031 20.309 27.2944 20.5197 26.9193 20.8948C26.5442 21.2699 26.3335 21.7786 26.3335 22.309V33.333L26.3475 33.567C26.4048 34.0535 26.6387 34.5021 27.0047 34.8276C27.3708 35.1531 27.8436 35.3329 28.3335 35.333H39.3935L39.6255 35.319C40.1124 35.2621 40.5614 35.0285 40.8873 34.6624C41.2132 34.2962 41.3934 33.8232 41.3935 33.333L41.3815 33.099C41.3241 32.6122 41.09 32.1633 40.7235 31.8378C40.357 31.5122 39.8837 31.3326 39.3935 31.333H30.3335V22.309C30.3335 21.205 29.3595 20.309 28.3335 20.309Z" fill="#014CFA"/>
                </svg>
                <div class="status_text">
                    已认购，等待中签中
                </div>
            </div>

            <div class="main_item">
                <div class="item_box">
                    <div class="name_box">
                        <div class="name">{{ currDetail.company_name }}</div>
                        <img  v-if="currDetail.lever > 1" src="/static/img/trade/level.png"/>
                    </div>
                    <div class="item_order_no">
                        <span>订单号 {{ currDetail.order_no || '--' }}</span>
                        <div class="item_copy_icon" @click="copy(currDetail.order_no)">
                            <img src="/static/img/trade/copy.png" alt="copy">
                        </div>
                    </div>
                    
                </div>

                <div class="info_boxs">
                
                    <div class="info_box">
                        <div>中签数量</div>
                        <div class="amount blue">
                           {{ currDetail.winning || '--' }}
                        </div>
                    </div>
                    <div class="info_box info_box--line">
                        <div>认购数量</div>
                        <div class="amount">
                           {{ currDetail.volume || '--' }}
                        </div>
                    </div>
                    <div class="split-line"></div>
                    <div class="info_box ">
                        <div>冻结金额</div>
                        <div class="amount blue">
                            {{ '--' }}
                        </div>
                    </div>
                    <div class="info_box info_box--line">
                        <div>认购金额</div>
                        <div class="amount">
                            {{ currDetail.issue_price || '--' }}
                        </div>
                    </div>
                </div>

            </div>

            <div class="detail_item_list">
                <div class="detail_item">
                    <div>利息</div>
                    <div class="val">{{ currDetail.fee || '--' }} <span>USDT</span></div>
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
                    <div>认购价格</div>
                    <div class="val">{{ currDetail.issue_price || '--' }}</div>
                </div>
                <div class="detail_item">
                    <div>认购杠杆</div>
                    <div class="val">{{ currDetail.lever ? currDetail.lever + 'X' : '--' }}</div>
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
                    <div>订单时间</div>
                    <div class="val">{{ currDetail.created }}</div>
                </div>
                
                
                
            </div>
        </div>
    </div>
</template>


<script setup>
import { ref } from 'vue'
import { _ipoGet } from "@/api/api";
import Top from "@/components/Top.vue"
import { useRoute } from "vue-router"
import { _orderGet } from "@/api/api";
import { _copyTxt } from "@/utils/index"
import { Loading } from "vant"
const route = useRoute()
const currDetail = ref({})

const loading = ref(true)
const openDetail = () => {
  _orderGet({
    order_no: route.query.order_no
  }).then(res => {
    if (res.data) {
      currDetail.value = {
        ...currDetail.value,
        ...res.data
      }
    }
  }).finally(()=>{
    loading.value = false
  })
}
openDetail()

//  复制
const copy = text => {
    _copyTxt(text)
    showToast('已复制')
}

</script>

<style lang="less" scoped>
.ipo_stock_detail {
  padding-top: 1.12rem;
 

  .scroller{
    height: calc(100vh - 1.12rem);
    overflow-y: auto;
    box-sizing: border-box;
    padding:0.28rem 0.32rem 0.32rem 0.32rem;
  }
  
   .main_item {
        border-radius: 0.32rem;
        border: 1px solid #EFF3F8;
        background: #F5F7FC;
        margin-top:0.4rem;
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

        .item_order_no{
            display: flex;
            align-items: center;
            color:#8F92A1;
            margin-top: 0.12rem;
            span{
                font-size: 0.28rem;
            }
        }

        .item_copy_icon {
            width: 0.24rem;
            height: 0.24rem;
            margin-left: 0.12rem;
            img{
                width: 100%;
                height: 100%;
            }
        }

    }

    .status_box{
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;
    }
    .status_text{
        color: #014CFA;
        text-align: center;
        font-size: 0.3rem;
        font-style: normal;
        font-weight: 400;
        line-height: 0.44rem; 
        margin-top:0.24rem;
    }
    .status_fail{
        width:60px;
        height:60px;
        background-color: #EFF3F8;
        border-radius: 0.32rem;
        display: flex;
        align-items: center;
        justify-content: center
    }
    .split-line{
        clear: both;
        height: 0.62rem;
        position: relative;
        margin:0 0.42rem;
        &::after{
            content: '';
            width: 100%;
            position: absolute;
            left:0;
            top:50%;
            height: 1px;
            background-color: #EFF3F8;
        }
    }
    .info_boxs {
        padding: 0.3rem 0;
        position: relative;
        border: 1px solid #EFF3F8;
        border-bottom: 0px;
        border-radius: 0.32rem;
        background-color: #fff;
        width: calc(100% + 2px);
        left:-1px;
        z-index: 1;
        &::after{
            content: '';
            display: block;
            clear: both;
        }
        .info_box {
            width: 50%;
            float: left;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            color: #8F92A1;
            font-size: 0.28rem;
            line-height: 0.44rem;
            position: relative;
            .amount {
                flex: 1;
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                line-height: 0.44rem;
                margin-top: 0.12rem;
                font-weight: 600;
                color: #061023;
                font-size: 0.36rem;
            }
            .blue{
                color:#014CFA;
            }
        }
        .info_box--line::after{
            content: '';
            width: 1px;
            height: 0.9rem;
            background-color: #EFF3F8;
            position: absolute;
            left:0;
            top:50%;
            margin-top:-0.45rem;
        }
    }

    .detail_item_list{
        padding: 0.08rem 0.32rem 0 0.32rem;
    }
    .detail_item {
        display: flex;
        align-items: center;
        justify-content: space-between;
        line-height: 0.44rem;
        padding: 0.32rem 0 0.2rem 0;
        border-bottom: 1px solid #F5F7FC;
        color: #8F92A1;
        font-size: 0.28rem;
        font-weight: 400;

        .name {
            color: #8F92A1;
            font-weight: 600;
            font-size: 0.28rem;
        }

        .val {
            color: #061023;
            font-size: 0.3rem;
        }
    }
    .detail_item:last-child{
        border-bottom: 0px;
    }
  
}
.loading_box{
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
}
.loading_text{
    color:#8F92A1;
    margin-top: 0.4rem;
    font-size: 0.28rem;
}
</style>
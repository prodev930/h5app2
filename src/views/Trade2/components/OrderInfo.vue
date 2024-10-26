<template>
    <div>
        <Top title="股票订单" :backFunc="backFunc" v-if="type == 'stock'" />
        <Top title="合约订单" :backFunc="backFunc" v-else-if="type == 'contract'" />
        
        <div class="scroller">
            <div class="stock-info">
                <div class="stock-info__head">
                    <div class="stock-info__hl">
                        <span class="stock-info__symbol">{{ currStock.symbol || '--' }}</span>
                        <span class="stock-info__status">{{ statusMap[currStock.status] || '--' }}</span>
                    </div>
                    <div class="stock-info__trend" @click="openStockModel(currStock)">
                        <img src="/static/img/trade/blue-stock.png" />
                    </div>
                </div>
                <div class="stock-info__order_no">
                    <span>{{ currStock.order_no || '--' }}</span>
                    <div class="stock-info__copy_icon" @click="copy(currStock.order_no)">
                        <img src="/static/img/trade/copy.png" alt="copy">
                    </div>
                </div>
            </div>
            <div class="info_boxs">
                <div class="info_box">
                    <div>可售{{type == 'stock' && '股票' || type == 'contract' && '合约' || ''}}</div>
                    <div class="amount">{{ currStock.unsold_volume || '--' }}</div>
                </div>
                <div class="info_box">
                    <div>盈亏</div>
                    <div class="amount" :class="!currStock.profit ? '' : (currStock.profit > 0 ? 'up' : 'down')">
                        <div>{{ currStock.profit || '--' }}</div>
                    </div>
                </div>
                <div class="info_box">
                    <div>盈亏比</div>
                    <div class="amount" :class="!currStock.profit ? '' : (currStock.profit > 0 ? 'up' : 'down')">
                        <div style="font-size: 0.32rem;">{{ getRatio(currStock.ratio) }}</div>
                    </div>
                </div>
            </div>
            
            <div class="order_info_box">
                

                <div class="info_item">
                    <div class="name">开仓</div>
                    <div class="val_box">
                        <div class="tag" :class="'tag_' + currStock.offset">{{ offsetMap[currStock.offset] || '--' }}
                        </div>
                        <div class="tag">{{ leverTypeap[currStock.lever_type] || '--' }}</div>
                        <div class="text">{{ currStock.lever || '1' }}X</div>
                    </div>
                </div>
                <div class="info_item">
                    <div class="name">价格</div>
                    <div class="val_box">
                        <div class="tag">{{ priceTypeMap[currStock.price_type] || '--' }}</div>
                        <div class="text">{{ currStock.settled_price || '--' }}</div>
                    </div>
                </div>
                <div class="info_item">
                    <div class="name">开仓数量</div>
                    <div class="val_box">
                        <div class="text">{{ currStock.open_volume || '--' }}</div>
                    </div>
                </div>
                <div class="info_item">
                    <div class="name">手续费</div>
                    <div class="val_box">
                        <div class="text">{{ currStock.fee || '0' }}</div>
                    </div>
                </div>
                <div class="info_item">
                    <div class="name">止盈/止损</div>
                    <div>
                        <div class="val_box" style="margin-bottom:0.1rem" v-if="currStock.stop_profit">
                            <div class="tag red_tag">止盈({{ stopMap[currStock.stop_profit_type] }})</div>
                            <div class="text">{{ currStock.stop_profit_price }}{{ currStock.stop_profit_type == 'ratio'
                                ? '%' :
                                '' }}</div>
                        </div>
                        <div class="val_box" v-if="currStock.stop_loss">
                            <div class="tag green_tag">止损({{ stopMap[currStock.stop_loss_type] }})</div>
                            <div class="text">{{ currStock.stop_loss_price }}{{ currStock.stop_loss_type == 'ratio' ?
                                '%' : '' }}
                            </div>
                        </div>
                        <div class="val_box" v-if="!currStock.stop_profit && !currStock.stop_loss">
                            <div class="tag">无</div>
                        </div>
                    </div>

                </div>
                <div class="info_item">
                    <div class="name">订单价值</div>
                    <div class="val_box">
                        <div class="text">{{ currStock.settled_price || '--' }}</div>
                    </div>
                </div>
                <div class="info_item">
                    <div class="name">保证金</div>
                    <div class="val_box">
                        <div class="text">{{ currStock.margin || '0' }}</div>
                    </div>
                </div>
                <div class="info_item">
                    <div class="name">持仓利息</div>
                    <div class="val_box">
                        <div class="text">0</div>
                    </div>
                </div>
            </div>

        </div>

        <div class="btns"  v-if="currStock.status != 'done'">
        
            <div class="btn btn2" @click="emit('update',currStock)"
                v-if="currStock.status != 'done'"
                :class="{ 'disabled_btn': !['none', 'lock', 'open'].includes(currStock.status) }">
                <div class="btn_icon">
                    <img src="/static/img/trade/update.png" alt="img">
                </div>
                <div>更新</div>
            </div>
            <div class="btn btn3" @click="emit('sell',currStock)"
               
                :class="{ 'disabled_btn': !['none', 'lock', 'open'].includes(currStock.status) }">
                <div class="btn_icon">
                    <img src="/static/img/trade/close.png" alt="img">
                </div>
                <div>平仓</div>
            </div>
            <div class="btn btn4" @click="emit('cancel',currStock)"
                :class="{ 'disabled_btn': !['none'].includes(currStock.status) }">
                <div class="btn_icon">
                    <img src="/static/img/trade/cancel.png" alt="img">
                </div>
                <div>撤单</div>
            </div>
        </div>

        <!-- 行情弹窗 -->
        <Popup teleport="body" v-model:show="showStockModel" position="bottom" round closeable>
            <StockPopup style="height:90vh" />
        </Popup>
    </div>
</template>

<script setup>
import { ref } from 'vue'
import { _copyTxt } from "@/utils/index"
import { showToast,Popup } from 'vant';
import store from "@/store";
import Top from "@/components/Top.vue"
import Decimal from 'decimal.js';
import StockPopup from "../../trade/StockPopup.vue"
const emit = defineEmits(['update','sell','cancel','back'])
const props = defineProps({
    type:{
        type:String,
        default:'stock' //stock 股票 contract 合约
    },
    currStock:{
        type:Object,
        default(){
            return {}
        }
    }
})
const backFunc = ()=>{
    emit('back')
}
const getRatio = (num) => {
    if (!num) return '--'
    return new Decimal(num).mul(100) + '%'
}


const showStockModel = ref(false)
const openStockModel = (currStock)=>{
    store.commit('setCurrStock', currStock)
    showStockModel.value = true
}
const statusMap = ref({ // 仓位状态
    'none': '开仓',
    'lock': '锁定',
    'open': '持仓',
    'done': '平仓',
    'fail': '失败',
    'cancel': '已取消'
})
const stopMap = ref({ // 止损类型
    'price': '价格',
    'amount': '金额',
    'ratio': '百分比'
})

const offsetMap = ref({ // 涨跌状态
    'long': '买涨',
    'short': '买跌'
})

const leverTypeap = ref({ // 仓位
    'cross': '全仓',
    'isolated': '逐仓'
})
const priceTypeMap = ref({ // 价格类型
    'market': '市价',
    'limit': '限价'
})

//  复制
const copy = text => {
    _copyTxt(text)
    showToast('已复制')
}
</script>

<style lang="less" scoped>
.scroller{
    height:calc(100vh - 3.2rem);
    overflow-y: auto;
    margin-top: 1.12rem;
}

.stock-info{
    background-color: #F5F7FC;
    border-radius: 0.32rem;
    margin:0.2rem 0.32rem 0 0.32rem;
    padding: 0.2rem 0.32rem 0.6rem 0.32rem;
    &__head{
        display: flex;
        height: 0.4rem;
        justify-content: space-between;
    }
    &__hl{
        display: flex;
        align-items: center;
    }
    &__symbol{
        font-size: 0.3rem;
        font-weight: 600;
    }
    &__status{
        border: 1px solid #7E99D6;
        color:#7E99D6;
        padding: 0.04rem 0.08rem;
        height: 0.3rem;
        line-height: 100%;
        font-size: 0.22rem;
        margin-left: 0.08rem;
        border-radius: 0.6rem;
        box-sizing: border-box;
        display: flex;
        align-items: center;
    }
    &__trend{
        width: 0.4rem;
        height: 0.4rem;
        img{
            width: 100%;
            height: 100%;
        }
    }
    &__order_no{
        display: flex;
        align-items: center;
        color:#8F92A1;
        span{
            font-size: 0.28rem;
        }
    }

    &__copy_icon {
        width: 0.24rem;
        height: 0.24rem;
        margin-left: 0.12rem;
        img{
            width: 100%;
            height: 100%;
        }
    }

}


.info_boxs {
    display: flex;
    align-items: stretch;
    padding: 0.3rem 0;
    position: relative;
    border: 1px solid #EFF3F8;
    border-radius: 0.32rem;
    background-color: #fff;
    margin: -0.5rem 0.32rem 0 0.32rem;
    z-index: 1;
    .info_box {
        flex: 1;
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
            color: #014CFA;
            font-size: 0.36rem;
        }
    }
    .info_box + .info_box::after{
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
.order_info_box {
    padding:0.16rem 0.64rem 0.32rem 0.64rem;

    .title {
        text-align: center;
        font-size: 0.28rem;
        color: #121826;
        font-weight: bold;
    }
    

    .info_item {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 0.32rem 0 0.18rem 0;
        border-bottom: 1px solid #F5F5F5;

        .name {
            color: #8F92A1;
            font-size: 0.28rem;
            font-weight: 400;
        }

        .val_box {
            display: flex;
            align-items: center;
            justify-content: flex-end;
            font-size: 0.28rem;
            color: #121826;

            
            .tag {
                color: #014CFA;
                font-size: 0.24rem;
                background-color: rgba(1, 76, 250, 0.08);
                height: 0.44rem;
                display: flex;
                align-items: center;
                justify-content: center;
                padding: 0 0.24rem;
                border-radius: 0.28rem;
                margin-right: 0.1rem;
            }

            .red_tag,
            .tag_long {
                color: #E8503A;
                background-color: rgba(232, 80, 58, 0.08);
            }

            .green_tag,
            .tag_short {
                color: #18B762;
                background-color: rgba(24, 183, 98, 0.08);
            }

            .text {
                min-width: 0.5rem;
                text-align: right;
                font-weight: bold;
            }
        }
    }

    
}

.btns {
   
    display: flex;
    align-content: center;
    justify-content: center;
    padding-top: 0.32rem;
    .btn {
        width: 2.1532rem;
        height: 1.4rem;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        background-color: #014CFA;
        color: #fff;
        font-size: 0.32rem;
        font-weight: 400;
        line-height: 100%;
        border-radius: 0.32rem;
        margin: 0 0.1rem;
        .btn_icon {
            width: 0.4rem;
            height: 0.4rem;
            margin-bottom: 0.16rem;
        }
    }

    .btn3 {
        background-color: #7E99D6;
    }

    .btn4 {
        background-color: #B2BBD1;
    }

    .disabled_btn {
        opacity: 0.6;
    }
}

</style>
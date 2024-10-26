<!-- 提现详情 -->
<template>
    <div class="withdraw_record_info">
        <Top :title="'提现详情'">
            <!-- <template #right>
                <div class="top-record" @click="goRecord">
                    <img src="/static/img/user/withdraw_record_icon.png" alt="img">
                </div>
            </template> -->
        </Top>

        <div class="top_info">
            <div class="num">210 USDT</div>
            <div class="status">
                <div class="status_icon">
                    <img src="/static/img/assets/status_success.png" alt="img">
                </div>
                <span>完成</span>
            </div>
            <div class="tip">请联系平台索取您的交易数据</div>
            <div class="link">为什么我的提现未到账？</div>
        </div>
        <div class="bottom_info">
            <div class="bottom_item">
                <div class="name">转账网络</div>
                <div class="value">TRC20</div>
            </div>
            <div class="bottom_item">
                <div class="name">地址</div>
                <div class="value">TRCsdasdsdasd23sdf20</div>
            </div>
            <div class="bottom_item">
                <div class="name">交易哈希</div>
                <div class="value">sd98s9f7sd897f9ds7f9s7d9f7s9d8f79sd79f87s</div>
            </div>
            <div class="bottom_item">
                <div class="name">提现数量</div>
                <div class="value">210 USDT</div>
            </div>
            <div class="bottom_item">
                <div class="name">手续费</div>
                <div class="value">210 USDT</div>
            </div>
            <div class="bottom_item">
                <div class="name">提现账户</div>
                <div class="value">USDT账户</div>
            </div>
            <div class="bottom_item">
                <div class="name">日期</div>
                <div class="value">2024-04-22 22:22:22</div>
            </div>
        </div>
    </div>
</template>

<script setup>
import Top from "@/components/Top.vue"

</script>

<style lang="less" scoped>
.withdraw_record_info {
    padding: 1.4rem 0.32rem 1.5rem 0.32rem;

    .top_info {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        padding-bottom: 0.6rem;
        border-bottom: 1px solid #F1F3F7;

        .num {
            font-size: 0.52rem;
            font-weight: 600;
            color: #000000;
            margin-bottom: 0.2rem;
        }

        .status {
            display: flex;
            align-items: center;
            color: #014CFA;
            font-weight: 600;
            font-size: 0.28rem;
            margin-bottom: 0.4rem;

            .status_icon {
                width: 0.36rem;
                height: 0.36rem;
                margin-right: 0.2rem;
            }
        }

        .tip {
            font-size: 0.24rem;
            font-weight: 400;
            line-height: 0.36rem;
        }

        .link {
            color: #014CFA;
            font-size: 0.24rem;
            font-weight: 400;
            line-height: 0.36rem;
        }
    }

    .bottom_info {
        padding: 0.8rem 0 0 0;

        .bottom_item {
            margin-bottom: 0.4rem;
            display: flex;
            align-items: flex-start;
            justify-content: space-between;
            font-size: 0.28rem;
            color: #8F92A1;
            line-height: 0.44rem;
            font-weight: 400;

            .value {
                max-width: 60%;
                word-break: break-all;
                color: #000000;
                text-align: right;
            }
        }
    }
}
</style>
<!-- 最新待处理数据 -->
<template>
    <Teleport to="body">
        <div class="wait_order" @click="jump">
            <div class="wo_icon">
                <img src="/static/img/user/card_type_c.png" alt="img">
            </div>
            <div class="wo_content">
                <div class="name">USDT TRC20</div>
                <div class="info">**** **** 231</div>
            </div>
            <div class="wo_info">
                <div class="amount">12313</div>
                <div class="status">失败</div>
            </div>
            <div class="wo_more">
                <img src="/static/img/assets/more_icon.svg" alt=">">
            </div>
        </div>
    </Teleport>
</template>

<script setup>
import router from "@/router"

const jump = () => {
    router.push({
        name: 'recordList',
        query: {
            tab: 0
        }
    })
}
</script>

<style lang="less">
.wait_order {
    position: fixed;
    z-index: 9;
    left: 0.16rem;
    bottom: 1.4rem;
    width: calc(100% - 0.32rem);
    height: 0.92rem;
    background: rgba(232, 232, 232, 0.92);
    border: 1px solid;
    border-radius: 0.2rem;
    border-image-source: linear-gradient(8.52deg, rgba(255, 255, 255, 0.25) -14.37%, rgba(255, 255, 255, 0.03) 113.95%);
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 0.24rem;

    .wo_icon {
        background-color: #D8E4FF;
        width: 0.5rem;
        height: 0.5rem;
        border-radius: 0.12rem;
        padding: 0.08rem;
    }

    .wo_content {
        flex: 1;
        margin-left: 0.24rem;
        font-size: 0.24rem;
        line-height: 0.34rem;

        .name {
            font-weight: bold;
        }
    }

    .wo_info {
        font-size: 0.24rem;
        line-height: 0.34rem;
        text-align: center;
        margin: 0 0.24rem;

        .amount {
            font-weight: bold;
        }

        .status {
            background-color: #F2F1F9;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 0.02rem 0.2rem;
            border-radius: 0.04rem;
            color: #999;
        }
    }

    .wo_more {
        width: 0.24rem;
        height: 0.24rem;
    }
}
</style>
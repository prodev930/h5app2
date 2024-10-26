<!-- 股票列表-元素 -->
<template>
    <div class="stock_list_item">
        <div class="item item12">
            <div class="name">HADCRXO</div>
            <div>10X</div>
        </div>
        <div class="item">
            <div class="status">买涨</div>
            <div>1000</div>
        </div>
        <div class="item">
            <div style="margin-bottom: 0.12rem;">1000</div>
            <div>1000</div>
        </div>
        <div class="item item_end">
            <div class="num up">1000</div>
            <div class="num up">-10.00%</div>
        </div>
    </div>
</template>

<style lang="less" scoped>
.stock_list_item {
    display: flex;
    align-items: baseline;
    justify-content: space-between;
    height: 1.28rem;
    border-bottom: 1px solid #EAEAEA;

    .item {
        flex: 10;
        font-size: 0.28rem;
        color: #000;
        font-weight: 400;
        line-height: 0.3rem;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        height: 100%;

        >div {
            width: 100%;
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
            text-align: center;
        }

        .name {
            font-size: 0.28rem;
            font-weight: 500;
            color: #061023;
            line-height: 0.44rem;
            margin-bottom: 0.08rem;
        }

        .num {
            color: #6C7B90;
            font-weight: 600;
            font-size: 0.28rem;
            line-height: 0.44rem;
        }

        .status {
            height: 0.46rem;
            margin-bottom: 0.1rem;
            padding: 0 0.3rem;
            color: #E8503A;
            background-color: rgba(232, 80, 58, 0.08);
            display: flex;
            align-items: center;
            justify-content: center;
        }
    }

    .item12 {
        flex: 12;

        >div {
            text-align: left;
        }
    }

    .item_end {
        >div {
            text-align: right;
        }
    }
}
</style>
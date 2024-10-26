<!-- 外汇 -->
<template>
    <div class="page_foreign">
        <!-- 搜索 -->
        <div class="search_block item">
            <div class="search_icon">
                <img src="/static/img/common/search.png" alt="🔍">
            </div>
            <input type="text" placeholder="搜索" class="ipt">
        </div>

        <div class="line"></div>

        <div class="list">
            <div class="item" v-for="i in 20" :key="i">

                <div class="left">
                    <div><span>-94</span> <span class="down">-0.15%</span></div>
                    <div class="name">AUDCHF</div>
                    <div><span>09</span> <span>44:57</span></div>
                </div>
                <div class="right">
                    <div class="amount">
                        <span>0.98</span>
                        <span class="big">63</span>
                        <span class="sm">7</span>
                    </div>
                    <div>LOW: 0.99347</div>
                </div>
                <div class="right">
                    <div class="amount">
                        <span>0.98</span>
                        <span class="big">63</span>
                        <span class="sm">7</span>
                    </div>
                    <div>LOW: 0.99347</div>
                </div>
            </div>
        </div>
    </div>
</template>

<style lang="less" scoped>
.page_foreign {
    padding-bottom: 2rem;

    .search_block {
        background-color: #F4F5F7;
        height: 0.8rem;
        border-radius: 0.2rem;
        display: flex;
        align-items: center;
        justify-content: flex-start;
        padding: 0 0.32rem;
        font-size: 0.28rem;
        color: #9EA3AE;
        margin: 0 0.32rem 0.32rem 0.32rem;

        .search_icon {
            width: 0.4rem;
            height: 0.4rem;
            margin-right: 0.2rem;
        }
    }

    .line {
        border-bottom: 1px solid #E8E8E8;
    }

    .list {
        padding: 0 0.32rem;
        font-size: 0.24rem;
        line-height: 0.36rem;

        .item {
            display: flex;
            align-items: stretch;
            padding: 0.12rem 0;
            border-bottom: 1px solid #EAEAEA;

            .left {
                flex: 1;
                text-align: left;

                .name {
                    font-size: 0.32rem;
                    font-weight: bold;
                    color: #000;
                    line-height: 0.5rem;
                }
            }

            .right {
                flex: 1;
                text-align: right;

                display: flex;
                flex-direction: column;
                align-items: flex-end;
                justify-content: flex-end;
                color: #8F92A1;

                .amount {
                    color: #014CFA;
                    vertical-align: baseline;

                    .big {
                        font-size: 0.38rem;
                        margin: 0 0 0 0.04rem;
                    }

                    .sm {
                        position: relative;
                        top: -0.12rem;
                    }
                }
            }

        }
    }
}
</style>
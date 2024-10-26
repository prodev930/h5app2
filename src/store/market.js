// 市场
import { useSocket } from '@/utils/ws'
import { _getSnapshotLine } from "@/utils/index"
import router from "@/router"
const { startSocket } = useSocket()

// 不同页面对应的监听列表 key
const pageKeys = {
    'home': ['marketRecommndList', 'marketRecommndContractList', 'marketRecommndStockList'],
    'market': ['marketWatchList', 'marketVolumeList', 'marketUpList', 'marketDownList', 'marketSrockRecommendList', 'marketContractRecommendList', 'contractList', 'marketAiList', 'marketAiHisList', 'marketAi24List', 'marketAiGridList'],
    'trade': ['marketWatchList', 'marketSearchList', 'futuresSearchList', 'aiquantSearchList', 'forexSearchList', 'marketAiList']
}

export default {
    state: {
        checkState: true,
        checkStockList: [],
        checkCryptoList: [],
        marketType: "all",
        currStock: {}, // 当前股票的数据
        marketSearchStr: '', // 当前搜索的文本
        marketSearchTextList: [],
        marketSearchList: [], // 当前搜索的结果-股票
        futuresSearchList: [], // 当前搜索的结果-合约
        aiquantSearchList: [], // 当前搜索的结果-ai
        forexSearchList: [], // 当前搜索的结果-外汇

        marketWatchList: [], // 当前订阅的列表数据
        marketVolumeList: [], // 首页活跃列表
        marketUpList: [], // 首页涨幅列表
        marketDownList: [], // 首页跌幅列表
        marketRecommndList: [], // 首页推荐列表
        marketRecommndContractList: [], // 首页合约列表
        marketRecommndStockList: [], // 首页股票列表
        marketStockList: [], // 股票页列表
        marketSrockRecommendList: [], // 推荐股票列表
        marketContractRecommendList: [], // 推荐合约列表
        marketRankList: [], // 排行列表

        marketWatchKeys: [], // 除了主列表，还需要额外监听的股票 symbol数组

        currConstact: {}, // 当前合约的数据
        contractList: [], // 合约列表

        currAi: {}, // 当前ai量化数据
        marketAiList: [], // ai量化默认列表
        marketAiHisList: [], // ai量化历史收益率列表
        marketAi24List: [], // ai量化24小时收益率列表
        marketAiGridList: [], // ai量化最大网格(杠杆)列表
        currentRecommendData: {}, //当前选择的股票推荐区域

    },
    mutations: {
        setCurrentRecommenData(state, data) {
            state.currentRecommendData = data
        },
        setCheckState(state,data) {
            state.checkState = data;
        },
        setCheckStockState(state,data) {
            state.checkStockList = data;
        },
        setCheckCryptoState(state,data) {
            state.checkCryptoList = data;
        },
        setMarketType(state,data) {
            state.marketType = data;
        },
        setMarketWatchList(state, data) {
            state.marketWatchList = data;
        },
        setMarketVolumeList(state, data) {
            state.marketVolumeList = data;
        },
        setMarketUpList(state, data) {
            state.marketUpList = data;
        },
        setMarketDownList(state, data) {
            state.marketDownList = data;
        },
        setMarketRecommndList(state, data) {
            state.marketRecommndList = data;
        },
        setMarketRecommndStockList(state, data) {
            state.marketRecommndStockList = data;
        },
        setMarketRecommndContractList(state, data) {
            state.marketRecommndContractList = data;
        },
        setMarketStockList(state, data) {
            state.marketStockList = data;
        },
        setMarketSrockRecommendList(state, data) {
            state.marketSrockRecommendList = data;
        },
        setMarketContractRecommendList(state, data) {
            state.marketContractRecommendList = data;
        },
        setContractList(state, data) {
            state.contractList = data
        },
        setMarketWatchKeys(state, data) {
            state.marketWatchKeys = data;
        },
        setMarketRankList(state, data) {
            state.marketRankList = data;
            const arr = Array.from(new Set(data.map(item => item.symbol)))
            // 设置keys
            state.marketWatchKeys = Array.from(new Set(state.marketWatchKeys.concat(arr)))
        },
        setMarketSearchTextList(state, data) {
            state.marketSearchTextList = data;
        },
        setMarketSearch(state, data) {
            state.marketSearchStr = data.search;
            state.marketSearchList = (data.list || []).map(item => {
                return item;
            });

        },
        setMarketSearchList(state, data) {
            state.marketSearchList = data;
        },
        setFuturesSearchList(state, data) {
            state.futuresSearchList = data;
        },
        setAiquantSearchList(state, data) {
            state.aiquantSearchList = data;
        },
        setForexSearchList(state, data) {
            state.forexSearchList = data;
        },
        setMarketAiList(state, data) {
            state.marketAiList = data || [];
        },
        setMarketAiHisList(state, data) {
            state.marketAiHisList = data || [];
        },
        setMarketAi24List(state, data) {
            state.marketAi24List = data || [];
        },
        setMarketAiGridList(state, data) {
            state.marketAiGridList = data || [];
        },
        setCurrStock(state, data) {
            if (!data.symbol) { // 只更新部分数据
                for (let key in data) {
                    if (data[key] === null) delete data[key]
                }
                state.currStock = {
                    ...state.currStock,
                    ...data
                }
                return
            }
            // 兼容后端的symbols 和 symbol
            // data.symbol = data.symbols || data.symbol
            state.currStock = data;
            // 当前股票有更新，则同步到列表里去
            setTimeout(() => {
                (pageKeys[router.currentRoute?.value?.name] || []).forEach(ck => {
                    const index = state[ck].findIndex(item => item.symbol == data.symbol)
                    if (index >= 0) {
                        state[ck][index] = data
                    }
                })
            }, 300)
        },
        setCurrConstract(state, data) {
            if (!data.symbol) { // 只更新部分数据
                for (let key in data) {
                    if (data[key] === null) delete data[key]
                }
                state.currConstact = {
                    ...state.currConstact,
                    ...data
                }
                return
            }
            // 兼容后端的symbols 和 symbol
            // data.symbol = data.symbols || data.symbol
            state.currConstact = Object.assign({}, state.currConstact, data);
            // 当前股票有更新，则同步到列表里去
            setTimeout(() => {
                (pageKeys[router.currentRoute?.value?.name] || []).forEach(ck => {
                    const index = state[ck].findIndex(item => item.symbol == data.symbol)
                    if (index >= 0) {
                        state[ck][index] = Object.assign({}, state[ck][index], data);
                    }
                })
            }, 300)
        },
        setCurrAi(state, data) {
            if (!data.symbol) { // 只更新部分数据
                for (let key in data) {
                    if (data[key] === null) delete data[key]
                }
                state.currAi = {
                    ...state.currAi,
                    ...data
                }
                return
            }
            // 兼容后端的symbols 和 symbol
            // data.symbol = data.symbols || data.symbol
            state.currAi = Object.assign({}, state.currAi, data);
            // 当前股票有更新，则同步到列表里去
            setTimeout(() => {
                (pageKeys[router.currentRoute?.value?.name] || []).forEach(ck => {
                    const index = state[ck].findIndex(item => item.symbol == data.symbol)
                    if (index >= 0) {
                        state[ck][index] = Object.assign({}, state[ck][index], data);
                    }
                })
            }, 300)
        },
    },
    actions: {
        subList({ commit, state }, { commitKey, listKey }) {
            let proxyKeys = []
            if (listKey) {
                const proxyListValue = state[listKey]
                if (proxyListValue) {
                    proxyKeys = proxyListValue.map(item => item.symbol)
                }
            }
            const socket = startSocket(() => {
                const keys = Array.from(new Set([
                    ...proxyKeys,
                    ...state.marketWatchKeys,
                ]))
                // console.error('订阅', keys)
                socket && socket.off('realtime')
                socket && socket.emit('realtime', keys.join(',')) // 价格变化
                socket && socket.on('realtime', res => {
                    if (res.code == 200) {
                        // 根据不同页面，同步页面内模块的数据
                        (pageKeys[router.currentRoute?.value?.name] || []).forEach(ck => {
                            const arr = state[ck].map(item => { // 数据和观察列表里的数据融合
                                const target = res.data.find(a => a.symbols == item.symbol || a.symbol == item.symbol)
                                if (target) {
                                    return {
                                        ...item,
                                        ...target,
                                        name: item.name || target.name
                                    }
                                }
                                return item
                            })
                            state[ck] = arr
                        })
                    }
                })

                socket && socket.off('snapshot')
                socket && socket.emit('snapshot', keys.join(',')) // 快照数据
                socket && socket.on('snapshot', res => {
                    if (res.code == 200) {
                        // 根据不同页面，同步页面内模块的数据
                        (pageKeys[router.currentRoute?.value?.name] || []).forEach(ck => {
                            const target = state[ck].find(item => item.symbols == res.symbol || item.symbol == res.symbol)
                            if (target) {
                                target.points = _getSnapshotLine(res.data)
                            }
                        })
                    }
                })
            })
        },
        setMarketType({commit, state}) {
            commit("setMarketType", state)
        }
    },
    getters: {
        getMarketType(state) {
            return state.marketType;
        }
    }
}
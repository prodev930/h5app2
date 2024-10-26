// 交易
export default {
  state: {
    positionsList: [], // 持仓列表
    contractPositionsList: [], // 合约持仓列表
    aiPositionsList: [], // ai持仓列表
    ipoDataList: [], // ipo列表
    ipoStockList: [], // ipo股票列表
    inquireList: [], // 股票列表
    contractInquireList: [], // 合约历史列表
    aiInquireList: [], // ai历史列表

    c2cList: [], // c2c订单列表
    c2cUnread: {}, // 未读消息
    c2cUnreadTotal: 0, // 总未读消息
    c2cLasttime: {}, // 列表已读时间记录   { order_no: lasttime }
  },
  mutations: {
    setPositionsList(state, data) {
      state.positionsList = data
    },
    setContractPositionsList(state, data) {
      state.contractPositionsList = data
    },
    setAiPositionsList(state, data) {
      state.aiPositionsList = data
    },
    setIpoDataList(state, data) {
      state.ipoDataList = data
    },
    setIpoStockList(state, data) {
      state.ipoStockList = data
    },
    setInquireList(state, data) {
      state.inquireList = data
    },
    setContractInquireList(state, data) {
      state.contractInquireList = data
    },
    setAiInquireList(state, data) {
      state.aiInquireList = data
    },
    setC2cList(state, data) {
      state.c2cList = data
      const obj = {};
      let total = 0;
      (data || []).forEach(item => {
        obj[item.order_no] = item.unread
        total += item.unread
      })
      state.c2cUnread = obj
      state.c2cUnreadTotal = total
    },
    setC2cLasttime(state, data) {
      state.c2cLasttime = data
    },
  },
}
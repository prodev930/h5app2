// 一些公共的数据配置


// 账户类型
export const _accountMap = {
  "money": "现金账户",
  "stock": "股票账户",
  "futures": "合约账户",
  "forex": "外汇账户",
};
export const _accountMapList = [
  { key: "money", value: "现金账户" },
  { key: "stock", value: "股票账户" },
  { key: "futures", value: "合约账户" },
  { key: "forex", value: "外汇账户" },
]


// 借贷状态
export const _loanStatusMap = {
  "open": "借贷中",
  "done": "已还款"
}

// 提现状态
export const _withdrawStatusMap = {
  "review": "审核中",
  "success": "成功",
  "failed": "失败"
}

// 提现状态
export const _topUpStatusMap = {
  "review": "审核中",
  "success": "成功",
  "failed": "失败"
}

// 加密币种
export const _currencyMapList = ['USDT', 'USD', 'BTC', 'ETH']

// 加密网络
export const _networkMapList = {
  USDT: ['Trc20', 'Erc20'],
  ETH: ['Ethereum'],
  BTC: ['Legacy', 'SegWit']
}


// 时间单位
export const _dateUnitMap = {
  s: 's',
  m: 'min',
  h: 'h',
  d: 'day'
}
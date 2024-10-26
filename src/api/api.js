import http from "./request";
import axios from "axios";
import { BASE_ADDRESS } from "@/config"

// const baseURL = process.env.NODE_ENV === 'development' ? "/api" : BASE_ADDRESS
const baseURL = BASE_ADDRESS
// 上传文件
// export const _upload = (file, successFunc, errorFunc, finishFunc) => {
//   const form = new FormData()
//   form.append("file", file)
//   return http.post("/file/upload", form, {
//     custom: { toast: true, auth: false, "Content-Type": "multipart/form-data"},
//   }).then(res => {
//     if (successFunc) successFunc(res)
//   }).catch(err => {
//     if (errorFunc) errorFunc(err)
//   }).finally(() => {
//     if (finishFunc) finishFunc()
//   });
// };

// 获取验证码
export const _verifcode = () => {
  return axios.get(baseURL + "/anon/v1/comm/verifcode?t=" + Date.now(), { responseType: 'blob' }, {
    custom: { auth: false, toast: false, retry: true },
  })
};

// 登录
export const _login = (data = {}) => {
  return http.post(`/anon/v1/user/login`, data, {
    custom: { auth: false, toast: false, retry: false },
  });
};
// 退出登录
export const _logout = (data = {}) => {
  return http.post(`/authc/v1/user/logout`, data, {
    custom: { auth: true, toast: false, retry: true },
  });
};

// 获取用户信息
export const _userinfo = (data = {}) => {
  return http.post(`/authc/v1/user/get`, data, {
    custom: { auth: true, toast: false, retry: true },
  });
};
// 谷歌验证器状态
export const _google = (data = {}) => {
  return http.post(`/authc/v1/user/google/get`, data, {
    custom: { auth: true, toast: true, retry: true },
  });
};
// 绑定谷歌验证器
export const _googleBind = (data = {}) => {
  return http.post(`/authc/v1/user/google/bind`, data, {
    custom: { auth: true, toast: false, retry: false },
  });
};

// 自选列表
export const _watchlist = (data = {}) => {
  return http.post(`/authc/v1/item/watchlist/list`, data, {
    custom: { auth: true, toast: true, retry: true },
  });
};

// 搜索股票
export const _search = (data = {}) => {
  return http.post(`/anon/v1/item/search`, data, {
    custom: { auth: false, toast: true, retry: true },
  });
};

// 获取股票基本信息
export const _basic = (data = {}) => {
  return http.post(`/anon/v1/item/basic`, data, {
    custom: { auth: false, toast: true, retry: true },
  });
};

// 获取股票详情
export const _profile = (data = {}) => {
  return http.post(`/anon/v1/item/stock/profile`, data, {
    custom: { auth: false, toast: true, retry: true },
  });
};

// 获取 K 线历史数据
export const _kline = (data = {}) => {
  return http.get(`/anon/v1/ticker/kline?symbol=${data.symbol}&period=${data.period}&page=${data.page}`, data, {
    custom: { auth: false, toast: true, retry: true },
  });
};

// 获取分时图历史数据
export const _time = (data = {}) => {
  return http.get(`/anon/v1/ticker/time?symbol=${data.symbol}`, data, {
    custom: { auth: false, toast: true, retry: true },
  });
};

// 获取市场排序数据
export const _sort = (data = {}) => {
  return http.post(`/anon/v1/market/rankinglist`, data, {
    custom: { auth: false, toast: true, retry: true },
  });
};

// 订单列表
export const _stocksList = (data = {}) => {
  return http.post(`/authc/v1/stock/list`, data, {
    custom: { auth: true, toast: true, retry: true },
  })
};

// 添加自选
export const _add = (data = {}) => {
  return http.post(`/authc/v1/item/watchlist/add`, data, {
    custom: { auth: true, toast: true, retry: false },
  });
};

//交易参数
export const _stocksPara = (data = {}) => {
  return http.post(`/anon/v1/stock/para`, data, {
    custom: { auth: false, toast: true, retry: true },
  });
};

// 移除自选
export const _del = (data = {}) => {
  return http.post(`/authc/v1/item/watchlist/del`, data, {
    custom: { auth: true, toast: true, retry: false },
  });
};

//钱包余额
export const _walletBalance = (data = {}) => {
  return http.post(`authc/v1/wallet/balance`, data, {
    custom: { auth: true, toast: true, retry: true },
  });
}

// 修改密码
export const _updatepw = (data = {}) => {
  return http.post(`/authc/v1/user/password`, data, {
    custom: { auth: true, toast: true, retry: false },
  });
};
// 修改交易密码
export const _safeword = (data = {}) => {
  return http.post(`/authc/v1/user/safeword`, data, {
    custom: { auth: true, toast: true, retry: false },
  });
};

//开仓
export const _stocksBuy = (data = {}) => {
  return http.post(`authc/v1/stock/buy`, data, {
    custom: { auth: true, toast: true, retry: false },
  });
};

//SessionToken
export const _commToken = (data = {}) => {
  return http.post(`/anon/v1/comm/token`, data, {
    custom: { auth: false, toast: true, retry: true },
  });
};

// 忘记密码
export const _forgetpw = (data = {}) => {
  return http.post(`/anon/v1/user/forget`, data, {
    custom: { auth: false, toast: true, retry: false },
  });
};

//订单详情
export const _stocksGet = (data = {}) => {
  return http.post(`authc/v1/stock/get`, data, {
    custom: { auth: true, toast: true, retry: true },
  });
};

//平仓
export const _stocksSell = (data = {}) => {
  return http.post(`authc/v1/stock/sell`, data, {
    custom: { auth: true, toast: true, retry: false },
  });
};

// KYC 状态查询
export const _kycGet = (data = {}) => {
  return http.post(`/authc/v1/user/kyc/get`, data, {
    custom: { auth: true, toast: true, retry: true },
  });
};
// KYC L1 提交
export const _kyc1 = (data = {}) => {
  return http.post(`/authc/v1/user/kyc/l1/set`, data, {
    custom: { auth: true, toast: true, retry: false },
  });
};
// KYC L2 提交
export const _kyc2 = (data = {}) => {
  return http.post(`/authc/v1/user/kyc/l2/set`, data, {
    custom: { auth: true, toast: true, retry: false },
  });
};

// SessionToken
export const _sessionToken = (data = {}) => {
  return http.post(`/anon/v1/comm/token`, data, {
    custom: { auth: false, toast: false, retry: true },
  });
};
// 用户注册
export const _register = (data = {}) => {
  return http.post(`/anon/v1/user/register`, data, {
    custom: { auth: false, toast: false, retry: false },
  });
};

// 新闻列表
export const _news = (data = {}) => {
  return http.post(`/anon/v1/market/news`, data, {
    custom: { auth: false, toast: false, retry: true },
  });
};

// 新增支付方式 
export const _addAccount = (data = {}) => {
  return http.post(`/authc/v1/withdraw/account/add`, data, {
    custom: { auth: true, toast: true, retry: false },
  });
};
// 收款账户列表 
export const _listAccount = (data = {}) => {
  return http.post(`/authc/v1/withdraw/account/list`, data, {
    custom: { auth: true, toast: true, retry: true },
  });
};

// 订单更新
export const _stocksUpdate = (data = {}) => {
  return http.post(`/authc/v1/stock/update`, data, {
    custom: { auth: true, toast: true, retry: false },
  });
};
// 撤销订单
export const _stocksCancel = (data = {}) => {
  return http.post(`/authc/v1/stock/cancel`, data, {
    custom: { auth: true, toast: true, retry: false },
  });
};


// 总资产
export const _assets = (data = {}) => {
  return http.post(`/authc/v1/account/assets`, data, {
    custom: { auth: true, toast: true, retry: true },
  });
};
// 现金账户
export const _balance = (data = {}) => {
  return http.post(`/authc/v1/wallet/balance`, data, {
    custom: { auth: true, toast: true, retry: true },
  });
};
// 充值记录
export const _depositList = (data = {}) => {
  return http.post(`/authc/v1/wallet/deposit/list`, data, {
    custom: { auth: true, toast: true, retry: true },
  });
};
// 划转
export const _transfer = (data = {}) => {
  return http.post(`/authc/v1/account/transfer`, data, {
    custom: { auth: true, toast: true, retry: false },
  });
};
// 划转记录
export const _transferLog = (data = {}) => {
  return http.post(`/authc/v1/account/transfer/log`, data, {
    custom: { auth: true, toast: true, retry: true },
  });
};
// 兑换汇率
export const _swapRate = (data = {}) => {
  return http.post(`/anon/v1/wallet/swap/query`, data, {
    custom: { auth: false, toast: true, retry: true },
  });
};
// 兑换
export const _converter = (data = {}) => {
  return http.post(`/authc/v1/wallet/swap/converter`, data, {
    custom: { auth: true, toast: true, retry: false },
  });
};
// 兑换记录
export const _converterLog = (data = {}) => {
  return http.post(`/authc/v1/wallet/swap/log`, data, {
    custom: { auth: true, toast: true, retry: true },
  });
};
// 借贷参数
export const _loanPara = (data = {}) => {
  return http.post(`/anon/v1/account/loan/config`, data, {
    custom: { auth: false, toast: true, retry: true },
  });
};
// 借贷手续费
export const _loanRate = (data = {}) => {
  return http.post(`/anon/v1/account/loan/config/get`, data, {
    custom: { auth: false, toast: true, retry: true },
  });
};
// 借贷
export const _loan = (data = {}) => {
  return http.post(`/authc/v1/account/loan`, data, {
    custom: { auth: true, toast: true, retry: false },
  });
};
// 借贷记录
export const _loanLog = (data = {}) => {
  return http.post(`/authc/v1/account/loan/log`, data, {
    custom: { auth: true, toast: true, retry: true },
  });
};
// IPO 列表
export const _ipoList = (data = {}) => {
  return http.post(`/anon/v1/ipo/list`, data, {
    custom: { auth: false, toast: true, retry: true },
  });
};
// IPO 记录详情
export const _ipoGet = (data = {}) => {
  return http.post(`/anon/v1/ipo/get`, data, {
    custom: { auth: false, toast: true, retry: true },
  });
};
// 认购参数
export const _orderPara = (data = {}) => {
  return http.post(`/anon/v1/ipo/order/para`, data, {
    custom: { auth: false, toast: true, retry: true },
  });
};
// 认购
export const _orderBuy = (data = {}) => {
  return http.post(`/authc/v1/ipo/order/buy`, data, {
    custom: { auth: true, toast: true, retry: false },
  });
};
// 我的订单
export const _orderList = (data = {}) => {
  return http.post(`/authc/v1/ipo/order/list`, data, {
    custom: { auth: true, toast: true, retry: true },
  });
};
// 订单详情
export const _orderGet = (data = {}) => {
  return http.post(`/authc/v1/ipo/order/get`, data, {
    custom: { auth: true, toast: true, retry: true },
  });
};
// 提现手续费
export const _withdrawFee = (data = {}) => {
  return http.post(`/authc/v1/wallet/withdraw/fee`, data, {
    custom: { auth: true, toast: true, retry: true },
  });
};
// 提现
export const _withdraw = (data = {}) => {
  return http.post(`/authc/v1/wallet/withdraw`, data, {
    custom: { auth: true, toast: true, retry: false },
  });
};
// 提现记录
export const _withdrawList = (data = {}) => {
  return http.post(`/authc/v1/wallet/withdraw/list`, data, {
    custom: { auth: true, toast: true, retry: true },
  });
};
// 获取充值 币种
export const _cryptoCoin = (data = {}) => {
  return http.post(`/anon/v1/wallet/currency`, data, {
    custom: { auth: false, toast: true, retry: true },
  });
};
// 现金账户支持的货币
export const _currency = (data = {}) => {
  return http.post(`/authc/v1/account/balance`, data, {
    custom: { auth: true, toast: false, retry: true },
  });
};
// 其他账户支持的货币
export const accountCurrency = (data = {}) => {
  return http.post(`/anon/v1/account/currency`, data, {
    custom: { auth: false, toast: false, retry: true },
  });
};
// 获取充值地址
export const _paycode = (data = {}) => {
  return http.post(`/authc/v1/wallet/crypto/paycode`, data, {
    custom: { auth: true, toast: true, retry: true },
  });
};
// 充值1
export const _deposit1 = (data = {}) => {
  return http.post(`/authc/v1/wallet/crypto/deposit`, data, {
    custom: { auth: true, toast: true, retry: true },
  });
};
// 查询/刷新超时
export const _depositGet = (data = {}) => {
  return http.post(`/authc/v1/wallet/crypto/get`, data, {
    custom: { auth: true, toast: true, retry: true },
  });
};
// 充值
export const _deposit = (data = {}) => {
  return http.post(`/authc/v1/wallet/deposit`, data, {
    custom: { auth: true, toast: true, retry: false },
  });
};
// 充值单详情
export const _depositInfo = (data = {}) => {
  return http.post(`/authc/v1/wallet/deposit/get`, data, {
    custom: { auth: true, toast: true, retry: true },
  });
};
// 自选推荐
export const _watchlistDefault = (data = {}) => {
  return http.post(`/anon/v1/item/watchlist/default`, data, {
    custom: { auth: false, toast: true, retry: true },
  });
};
// 正在充值和提现的订单笔数
export const _accountHint = (data = {}) => {
  return http.post(`/authc/v1/account/hint`, data, {
    custom: { auth: true, toast: true, retry: true },
  });
};
// 市场总览
export const _marketOverview = (data = {}) => {
  return http.post(`/anon/v1/market/overview`, data, {
    custom: { auth: false, toast: true, retry: true },
  });
};
// 股票交易所支持列表
export const _exchange = (data = {}) => {
  return http.post(`/anon/v1/market/stock/exchange`, data, {
    custom: { auth: false, toast: true, retry: true },
  });
};

// 股票推荐列表
export const _recommend = (data = {}) => {
  return http.post(`anon/v1/market/stock/recommend`, data, {
    custom: { auth: false, toast: true, retry: true },
  });
};

// 账号检测
export const _userExist = (data = {}) => {
  return http.post(`/anon/v1/user/exist`, data, {
    custom: { auth: false, toast: false, retry: true },
  });
};

// 合约列表
export const _futures = (data = {}) => {
  return http.post(`/anon/v1/item/futures`, data, {
    custom: { auth: false, toast: false, retry: true },
  });
};
// 合约参数
export const _futuresPara = (data = {}) => {
  return http.post(`/anon/v1/futures/para`, data, {
    custom: { auth: false, toast: false, retry: true },
  });
};
// 订单列表
export const _futuresList = (data = {}) => {
  return http.post(`/authc/v1/futures/list`, data, {
    custom: { auth: true, toast: true, retry: true },
  });
};
// 合约开仓
export const _futuresBuy = (data = {}) => {
  return http.post(`/authc/v1/futures/buy`, data, {
    custom: { auth: true, toast: true, retry: true },
  });
};
// 合约平仓
export const _futuresSell = (data = {}) => {
  return http.post(`/authc/v1/futures/sell`, data, {
    custom: { auth: true, toast: true, retry: true },
  });
};
// 合约撤单
export const _futuresCancel = (data = {}) => {
  return http.post(`/authc/v1/stocks/cancel`, data, {
    custom: { auth: true, toast: true, retry: true },
  });
};
// 合约更新
export const _futuresUpdate = (data = {}) => {
  return http.post(`/authc/v1/futures/update`, data, {
    custom: { auth: true, toast: true, retry: true },
  });
};
// ai列表
export const _aiquant = (data = {}) => {
  return http.post(`/anon/v1/item/aiquant`, data, {
    custom: { auth: false, toast: false, retry: true },
  });
};
// ai交易参数
export const _aipara = (data = {}) => {
  return http.post(`/anon/v1/aiquant/para`, data, {
    custom: { auth: false, toast: false, retry: true },
  });
};
// ai开仓
export const _aibuy = (data = {}) => {
  return http.post(`/authc/v1/aiquant/buy`, data, {
    custom: { auth: true, toast: true, retry: true },
  });
};
// 订单列表
export const _ailist = (data = {}) => {
  return http.post(`/authc/v1/aiquant/list`, data, {
    custom: { auth: true, toast: false, retry: true },
  });
};
// 订单详情
export const _aiget = (data = {}) => {
  return http.post(`/authc/v1/aiquant/get`, data, {
    custom: { auth: true, toast: false, retry: true },
  });
};
// 快捷买入或卖出
export const _orderFast = (data = {}) => {
  return http.post(`/authc/v1/c2c/order/fast`, data, {
    custom: { auth: true, toast: false, retry: false },
  });
};
// 自选列表
export const _adList = (data = {}) => {
  return http.post(`/anon/v1/c2c/ad/list`, data, {
    custom: { auth: false, toast: false, retry: true },
  });
};
// 自选交易
export const _buysell = (data = {}) => {
  return http.post(`/authc/v1/c2c/order/buysell`, data, {
    custom: { auth: true, toast: false, retry: false },
  });
};
// c2c订单详情
export const _c2cOrderInfo = (data = {}) => {
  return http.post(`/authc/v1/c2c/order/get`, data, {
    custom: { auth: true, toast: false, retry: true },
  });
};
// c2c订单设置状态
export const _c2cOrderStatus = (data = {}) => {
  return http.post(`/authc/v1/c2c/order/status`, data, {
    custom: { auth: true, toast: false, retry: false },
  });
};
// c2c历史订单
export const _c2cOrderList = (data = {}) => {
  return http.post(`/authc/v1/c2c/order/list`, data, {
    custom: { auth: true, toast: false, retry: true },
  });
};
// c2c已读回执
export const _c2cRead = (data = {}) => {
  return http.post(`/authc/v1/c2c/msg/read`, data, {
    custom: { auth: true, toast: false, retry: true },
  });
};

export const memberInfo = () => { }
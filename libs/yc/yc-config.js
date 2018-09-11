// Author: 张凯

const debug = false
const host = {
  dev: "https://cj.197854.com",  //测试服务器
  pro: "https://cj.197854.com"   //正式服务器
}

function getBaseUrl() {
  return (debug ? host.dev : host.pro) + '/api'
}

function getUrl(str) {
  return getBaseUrl() + str
}

// 全局参数配置
var global = {
  token: '',   //服务端返回的token
  userInfo: {}, //用户信息   
}

// 状态配置
const status = {
  authStatus: {
    authOK: 10000,     //授权成功
    authFail: -10000  //授权失败
  },
  stateStatus: {
      LOADING: 0,
      NODATA: 1,
      NORMAL: 2
  }
}

// 网络参数配置
const net = {
  defaultParams: {
    app_type: 'wx',
    app_id: 37
  }
}

module.exports = {
  global: global,
  status: status,
  net: net,
  issign: true,

  loginUrl: getUrl("/v1.user/login"),
  getUserInfoUrl: getUrl("/v1.game/getUserInfo"),
  appInfoUrl: getUrl("/v1.game/getAppInfo"),

  setScoreUrl: getUrl("/v1.test/setScore"),
  waterInitUrl: getUrl("/water/init"),
  waterRengeUrl: getUrl("/water/renge"),
  starIndexUrl: getUrl("/star/index"),
  testTypeInfoListUrl: getUrl("/test/testTypeInfoList")
}


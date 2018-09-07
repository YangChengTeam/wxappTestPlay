// Author: 张凯

const regeneratorRuntime = global.regeneratorRuntime = require('../../libs/runtime')
const co = require('../../libs/co')
const kkconfig = require('yc-config')
const kkpromise = require('yc-promise')
const kknet = require('yc-net')

function authPermission(scope) {
  return co.wrap(function* () {
    let res = yield kkpromise.getSetting()
    if (res && res.authSetting[scope]) {
      return kkconfig.status.authStatus.authOK  //已授权
    }
    return kkconfig.status.authStatus.authFail  //未授权
  })()
}

function reLogin() {
  return co.wrap(function* () {
    if (kkconfig.global.token.length > 0) {
      return true
    }
    let status = yield authPermission("scope.userInfo")
    if (status == kkconfig.status.authStatus.authFail) {
      let res = yield kkpromise.openSetting()
      if (!res || !res.authSetting["scope.userInfo"]) {
        return kkconfig.global.status.authFail
      }
    }
    return yield login()
  })()
}

function login() {
  return co.wrap(function* () {
    let res = yield kkpromise.login()
    if (!res || !res.code) {
      return false
    }
    let userInfo = yield kkpromise.getUserInfo()
    if (userInfo) {
      if (typeof userInfo.rawData === 'string') {
        userInfo.rawData = JSON.parse(userInfo.rawData)
      }
      kkconfig.global.userInfo = userInfo.rawData
    }

    let loginData = yield kknet.post(kkconfig.loginUrl, {
      encryptedData: userInfo.encryptedData,
      code: res.code,
      iv: userInfo.iv
    })
    if (loginData.data.code == 1) {
      kkconfig.global.token = loginData.data.data.token.token || ''
      kkconfig.global.session_key = loginData.data.data.session_key
      return true
    }
    return false
  })()
}

function getUserInfo() {
  return co.wrap(function* () {
    return yield kknet.post(kkconfig.getUserInfoUrl)
  })()
}




module.exports = {
  authPermission: authPermission,
  login: login,
  reLogin: reLogin,
  getUserInfo: getUserInfo
}
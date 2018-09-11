// Author: 张凯

const regeneratorRuntime = global.regeneratorRuntime = require('../../libs/runtime')
const co = require('../../libs/co')
const kkconfig = require('yc-config')
const kkpromise = require('yc-promise')
const kknet = require('yc-net')

function authPermission(scope) {
  return co.wrap(function*() {
    let res = yield kkpromise.getSetting()
    if (res && res.authSetting[scope]) {
      return kkconfig.status.authStatus.authOK //已授权
    }
    return kkconfig.status.authStatus.authFail //未授权
  })()
}

function reLogin() {
  return co.wrap(function*() {
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
  return co.wrap(function*() {
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
  return co.wrap(function*() {
    return yield kknet.post(kkconfig.getUserInfoUrl)
  })()
}

function getAppInfo() {
  return co.wrap(function*() {
    return yield kknet.post(kkconfig.appInfoUrl)
  })()
}

function testTypeInfoList(type_id) {
  return co.wrap(function*() {
    return yield kknet.post(kkconfig.testTypeInfoListUrl, {
      type_id: type_id
    })
  })()
}




function setScore(sex, username) {
  return co.wrap(function*() {
    return yield kknet.post(kkconfig.setScoreUrl, {
      sex: sex,
      username: username
    })
  })()
}

function waterInit(xing, headimg) {
  return co.wrap(function*() {
    return yield kknet.post(kkconfig.waterInitUrl, {
      xing: xing,
      headimg: headimg
    })
  })()
}

function waterRenge(headimg, username) {
  return co.wrap(function*() {
    return yield kknet.post(kkconfig.waterRengeUrl, {
      headimg: headimg,
      username: username
    })
  })()
}

function starIndex(star, day, sex) {
  return co.wrap(function*() {
    return yield kknet.post(kkconfig.starIndexUrl, {
      star: star,
      day: day,
      sex: sex
    })
  })()
}

function testTypeInfoView(id, test_type) {
  return co.wrap(function*() {
    return yield kknet.post(kkconfig.testTypeInfoViewUrl, {
      id: id,
      test_type: test_type
    })
  })()
}

function testTextResult(id, test_type, result_id, nickname, headimg) {
  return co.wrap(function*() {
    return yield kknet.post(kkconfig.testTextResultUrl, {
      id: id,
      test_type: test_type,
      result_id: result_id,
      nickname: nickname,
      headimg: headimg
    })
  })()
}

module.exports = {
  authPermission: authPermission,
  login: login,
  reLogin: reLogin,
  getUserInfo: getUserInfo,
  setScore: setScore,
  waterInit: waterInit,
  waterRenge: waterRenge,
  starIndex: starIndex,
  getAppInfo: getAppInfo,
  testTypeInfoList: testTypeInfoList,
  testTypeInfoView: testTypeInfoView,
  testTextResult: testTextResult
}
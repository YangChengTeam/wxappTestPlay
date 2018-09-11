//app.js
const regeneratorRuntime = global.regeneratorRuntime = require('/libs/runtime')

const co = require('/libs/co')
const kkservice = require("/libs/yc/yc-service.js")

App({
  onLaunch: function () {
    this.tabIndex = 0
  },
  nav2test(item) {
    this.testInfo = item
    if (item.test_type == 1) {
      wx.navigateTo({
        url: '/pages/testplay/testplay',
      })
    } else if (item.test_type == 2) {
      wx.navigateTo({
        url: '/pages/testplay2/testplay2',
      })
    }
  },
  compareVersion(v1, v2) {
    v1 = v1.split('.')
    v2 = v2.split('.')

    var len = Math.max(v1.length, v2.length)

    while (v1.length < len) {
      v1.push('0')
    }

    while (v2.length < len) {
      v2.push('0')
    }

    for (var i = 0; i < len; i++) {
      var num1 = parseInt(v1[i])
      var num2 = parseInt(v2[i])

      if (num1 > num2) {
        return 1
      } else if (num1 < num2) {
        return -1
      }
    }
    return 0
  },
  canUseNavigator() {
    let mini = -1
    try {
      let res = wx.getSystemInfoSync()
      mini = this.compareVersion(res.SDKVersion, '2.0.7')
    } catch (e) {

    }
    return mini > -1
  },
  login(url, callback) {
    let thiz = this
    if (thiz.isLogin) {
      if (url) {
        wx.navigateTo({
          url: url,
        })
      }
      return
    }
    wx.showLoading({
      title: '正在登录...',
      icon: 'none'
    })
    co(function*() {
      if (yield kkservice.login()) {
        thiz.isLogin = true
        let res = yield kkservice.getUserInfo()
        wx.hideLoading()
        thiz.userInfo = res.data.data
        if (url) {
          wx.navigateTo({
            url: url,
          })
        }
        if (callback) {
          callback()
        }
      }
    })
  }
})
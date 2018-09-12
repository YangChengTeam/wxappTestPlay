//index.js
//获取应用实例
const app = getApp()

const regeneratorRuntime = global.regeneratorRuntime = require('../../libs/runtime')
const co = require('../../libs/co')
const kkservice = require("../../libs/yc/yc-service.js")
const kkconfig = require("../../libs/yc/yc-config.js")
const kkcommon = require("../../libs/yc/yc-common.js")

Page({
  data: {
    navopacity: 0,
    state: 0,

    index: 0,
    tabInfos: [{
        text: '精选',
        iconPath: '../../assets/images/tab-index.png',
        selectedIconPath: '../../assets/images/tab-index-selected.png'
      },
      {
        text: '我的',
        iconPath: '../../assets/images/tab-my.png',
        selectedIconPath: '../../assets/images/tab-my-selected.png',
      }
    ],
    isswitch: false,

    topItemInfos: [{
      animation: {},
      zindex: 2
    }, {
      animation: {},
      zindex: 1
    }, {
      animation: {},
      zindex: 0
    }],
    animationInfos: [{
        duration: 150,
        left: "0rpx",
        top: "0rpx",
        height: "120rpx",
        index: 2
      },
      {
        duration: 250,
        left: "20rpx",
        top: "10rpx",
        height: "100rpx",
        index: 1
      },
      {
        duration: 350,
        left: "35rpx",
        top: "20rpx",
        height: "80rpx",
        index: 0
      }
    ],
    zindex1: 2,
    zindex2: 1,
    zindex3: 0,

    appInfo: {},

    iscanusenavigator: false
  },
  onLoad: function() {
    let thiz = this
    app.index = this
    co(function*() {
      let value = wx.getStorageSync("constellation")
      thiz.data.starInfo = value
      console.log(value)
      thiz.setData({
        iscanusenavigator: getApp().canUseNavigator(),
        isswitch: value ? true : false,
        starInfo: value
      })
      let res = yield kkservice.getAppInfo()
      if (res && res.data && res.data.code == 1) {
        let appInfo = res.data.data
        appInfo.day_commend_list.forEach((v, k) => {
          thiz.data.topItemInfos[k] = { ...thiz.data.topItemInfos[k],
            ...v
          }
        })
        let starLuckInfo = {}
        if (thiz.data.starInfo) {
          let sex = wx.getStorageSync("sex")
          res = yield kkservice.starIndex(thiz.data.starInfo.name, "today", sex == 1 ? "boy" : "girl")
          starLuckInfo = res.data.data
          if (starLuckInfo && starLuckInfo.intro) {
            starLuckInfo.intro.forEach((v, k) => {
              starLuckInfo.intro[k] = v.split("：")[1]
            })
          }
        }
        thiz.setData({
          state: kkconfig.status.stateStatus.NORMAL,
          appInfo: appInfo,
          topItemInfos: appInfo.day_commend_list,
          starLuckInfo: starLuckInfo
        })
      } else {
        thiz.setData({
          state: kkconfig.status.stateStatus.NODATA
        })
      }
    })
  },
  switchConstellation(obj) {
    let thiz = this
    let starLuckInfo = {}
    thiz.data.starInfo = obj
    co(function*() {
      if (thiz.data.starInfo) {
        let sex = wx.getStorageSync("sex")
        let res = yield kkservice.starIndex(thiz.data.starInfo.name, "today", sex == 1 ? "boy" : "girl")
        starLuckInfo = res.data.data
        if (starLuckInfo && starLuckInfo.intro) {
          starLuckInfo.intro.forEach((v, k) => {
            starLuckInfo.intro[k] = v.split("：")[1]
          })
        }
      }
      thiz.setData({
        isswitch: true,
        starInfo: obj,
        starLuckInfo: starLuckInfo
      })
    })
  },
  onShow(e) {
    this.startAnimation()
  },
  nav2category(e) {
    let id = e.currentTarget.dataset.index
    let title = e.currentTarget.dataset.title
    wx.navigateTo({
      url: '/pages/category/category?id=' + id + "&title=" + title,
    })
  },
  tab(e) {
    let index = e.currentTarget.dataset.index
    if (index == app.tabIndex) return
    app.tabIndex = index
    this.setData({
      index: index,
      tabInfos: this.data.tabInfos
    })
  },
  scroll(e) {
    let top = (e.detail.scrollTop)
    this.setData({
      navopacity: top / app.titleBarHeight
    })
  },
  touchmove(e) {
    if (!this.moving) {
      this.moving = true
    }
    this.epageX = e.touches[0].pageX
  },
  touchstart(e) {
    this.spageX = e.touches[0].pageX
  },
  touchend(e) {
    if (this.moving && Math.abs(this.spageX - this.epageX) > 20) {
      if (this.clear) {
        clearTimeout(this.clear)
      }
      this.clearAnimation()
      this.topAnimate()
      this.moving = false
      this.clear = setTimeout(() => {
        this.startAnimation()
      }, 500)
    }
  },
  startAnimation() {
    if (!this.animationTimer) {
      this.animationTimer = setInterval(() => {
        this.topAnimate()
      }, 3000)
    }
  },
  clearAnimation() {
    if (this.animationTimer) {
      clearInterval(this.animationTimer)
      this.animationTimer = undefined
    }
  },
  onHide() {
    this.clearAnimation()
  },
  topAnimate() {
    this.animations = []
    let animationInfos = this.data.animationInfos
    animationInfos.forEach(v => {
      var animation = wx.createAnimation({
        duration: v.duration,
        timingFunction: 'ease',
      })
      animation.height(v.height).top(v.top).left(v.left).step()
      this.animations.push(animation.export())
    })
    let topItemInfos = this.data.topItemInfos
    topItemInfos.forEach((v, k) => {
      if (k == 0) {
        if (this.data.zindex1 == 2) {
          this.data.zindex1 = 0
          v.animation = this.animations[2]
        } else if (this.data.zindex1 == 1) {
          this.data.zindex1 = 2
          v.animation = this.animations[0]
        } else if (this.data.zindex1 == 0) {
          this.data.zindex1 = 1
          v.animation = this.animations[1]
        }
      } else if (k == 1) {
        if (this.data.zindex2 == 2) {
          this.data.zindex2 = 0
          v.animation = this.animations[2]
        } else if (this.data.zindex2 == 1) {
          this.data.zindex2 = 2
          v.animation = this.animations[0]
        } else if (this.data.zindex2 == 0) {
          this.data.zindex2 = 1
          v.animation = this.animations[1]
        }
      } else if (k == 2) {
        if (this.data.zindex3 == 2) {
          this.data.zindex3 = 0
          v.animation = this.animations[2]
        } else if (this.data.zindex3 == 1) {
          this.data.zindex3 = 2
          v.animation = this.animations[0]
        } else if (this.data.zindex3 == 0) {
          this.data.zindex3 = 1
          v.animation = this.animations[1]
        }
      }
    })
    this.setData({
      zindex1: this.data.zindex1,
      zindex2: this.data.zindex2,
      zindex3: this.data.zindex3
    })
    setTimeout(() => {
      this.setData({
        topItemInfos: topItemInfos
      })
    }, 20)
  },
  previewImg(e) {
    wx.previewImage({
      urls: [e.currentTarget.dataset.img],
    })
  },
  natiageToMiniProgram(e) {
    console.log(e.currentTarget.dataset.appid)
    wx.navigateToMiniProgram({
      appId: e.currentTarget.dataset.appid,
    })
  },
  nav2like(e) {
    
  },
  nav2top(e) {
    wx.navigateTo({
      url: "/pages/category/category?status=2&title=每日推荐"
    })
  },
  nav2more(e) {
    wx.navigateTo({
      url: "/pages/category/category?status=1&title=精选热门"
    })
  },
  nav2test(e) {
    let item = e.currentTarget.dataset.obj
    app.nav2test(item)
  },
  nav2constellation(res) {
    if (res.detail && res.detail.userInfo) {
      wx.setStorageSync("sex", res.detail.userInfo.gender)
    }
    wx.navigateTo({
      url: "/pages/constellation/constellation"
    })
  },
  nav2constellationdetail(e) {
    wx.navigateTo({
      url: '/pages/constellationdetail/constellationdetail',
    })
  }
})
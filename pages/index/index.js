//index.js
//获取应用实例
const app = getApp()

const regeneratorRuntime = global.regeneratorRuntime = require('../../libs/runtime')
const co = require('../../libs/co')
const kkservice = require("../../libs/yc/yc-service.js")
const kkconfig = require("../../libs/yc/yc-config.js")
const kkcommon = require("../../libs/yc/yc-common.js")
const kkpromise = require("../../libs/yc/yc-promise.js")

Page({
  data: {
    isshow: false,
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

    menuInfo: [{
        text: '趣味测试',
        iconPath: '../../assets/images/menu1.png'
      },
      {
        text: '智商测试',
        iconPath: '../../assets/images/menu2.png'
      },
      {
        text: '心理测试',
        iconPath: '../../assets/images/menu3.png'
      },
      {
        text: '脱单测试',
        iconPath: '../../assets/images/menu4.png'
      },
    ],
    isswitch: false,
    navopacity: 0,
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
        duration: 400,
        left: "20rpx",
        top: "10rpx",
        height: "100rpx",
        index: 1
      },
      {
        duration: 500,
        left: "35rpx",
        top: "20rpx",
        height: "80rpx",
        index: 0
      }
    ],
    zindex1: 2,
    zindex2: 1,
    zindex3: 0
  },
  onLoad: function() {
      
  },
  onShow(e){
    this.startAnimation()
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
      navopacity: top / app.totalTopHeight
    })
  },
  touchmove(e) {
     if(!this.moving){
       this.moving = true
     }
  },
  touchstart(e) {
    console.log(e)
  },
  touchend(e) {
    if (this.moving){
      if (this.clear){
        clearTimeout(this.clear)
      }
      this.clearAnimation()
      this.topAnimate()
      this.moving = false
      this.clear = setTimeout(()=>{
        this.startAnimation()
      }, 500)
    }
  },
  startAnimation(){
    if (!this.animationTimer) {
      this.animationTimer = setInterval(() => {
        this.topAnimate()
      }, 3000)
    }
  },
  clearAnimation(){
    if (this.animationTimer) {
      clearInterval(this.animationTimer)
      this.animationTimer = undefined
    }
  },
  onHide(){
    this.clearAnimation()
  },
  topAnimate(){
    this.animations = []
    this.animations2 = []

    let animationInfos = this.data.animationInfos
    animationInfos.forEach(v => {
      var animation = wx.createAnimation({
        duration: v.duration,
        timingFunction: 'ease',
      })
      var animation2 = wx.createAnimation({
        duration: v.duration,
        timingFunction: 'ease',
      })
      animation.height(v.height).top(v.top).left(v.left).step()
      animation2.opacity(v.opacity).step()
      this.animations.push(animation.export())
      this.animations2.push(animation2.export())
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
  }
})
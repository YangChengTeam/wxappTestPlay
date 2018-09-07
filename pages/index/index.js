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
    ]
  },
  onLoad: function () {
     
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
  scroll(e){
    console.log(e)
  },
  scrolltolower(e){
    console.log(e)
  }
})

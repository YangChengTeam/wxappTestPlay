// pages/category/category.js
const app = getApp()

const regeneratorRuntime = global.regeneratorRuntime = require('../../libs/runtime')
const co = require('../../libs/co')
const kkservice = require("../../libs/yc/yc-service.js")
const kkconfig = require("../../libs/yc/yc-config.js")
const kkcommon = require("../../libs/yc/yc-common.js")
const kkpromise = require("../../libs/yc/yc-promise.js")

Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let thiz = this
    thiz.setData({
      title: options.title
    })
    co(function*() {
      let res = yield kkservice.testTypeInfoList(options.id)
      if (res && res.data && res.data.code == 1) {
        let list = res.data.data 
        thiz.setData({
          state: kkconfig.status.stateStatus.NORMAL,
          list: list
        })
      } else {
        thiz.setData({
          state: kkconfig.status.stateStatus.NODATA
        })
      }
    })
  },
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})
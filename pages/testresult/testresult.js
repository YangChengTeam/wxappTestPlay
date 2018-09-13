// pages/test_result/test_result.js
const app = getApp()

const regeneratorRuntime = global.regeneratorRuntime = require('../../libs/runtime')
const co = require('../../libs/co')
const kkservice = require("../../libs/yc/yc-service.js")
const kkconfig = require("../../libs/yc/yc-config.js")
const kkcommon = require("../../libs/yc/yc-common.js")

var resultSavePath
var resultImgUrl
Page({

  /**
   * 页面的初始数据
   */
  data: {
    state:2,
    result_img: '',//https://cj.197854.com/uploads/Testing/5b99b30788441.png
    appInfo: {},
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    resultImgUrl = options.img_url
    resultSavePath = options.save_img_url
    console.log('save path--->' + resultSavePath)
    console.log(app.index.data.appInfo)
    this.setData({
      result_img: resultImgUrl,
      appInfo: app.index.data.appInfo
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },
  
  testAgain:function(){
    wx.redirectTo({
      url: '/pages/testplay/testplay',
    })
  },

  preimage: function (e) {
    wx.previewImage({
      urls: [resultImgUrl],
      current: resultImgUrl
    })
  },

  saveImg: function () {
    var that = this;
    wx.getSetting({
      success(res) {
        console.log(res)
        if (!res.authSetting['scope.writePhotosAlbum']) {
          wx.authorize({
            scope:
              'scope.writePhotosAlbum',
            success() {
              that.downimage();
            }
          })
        } else {
          that.downimage();
        }
      },
      fail(err) {
        console.log(err)
        if (err.errMsg === "saveImageToPhotosAlbum:fail auth deny") {
          console.log("用户一开始拒绝了，我们想再次发起授权")
          console.log('打开设置窗口')
          wx.openSetting({
            success(settingdata) {
              console.log(settingdata)
              if (settingdata.authSetting['scope.writePhotosAlbum']) {
                console.log('获取权限成功，给出再次点击图片保存到相册的提示。')
                that.downimage();
              }
              else {
                console.log('获取权限失败，给出不给权限就无法正常使用的提示')
              }
            }
          })
        }
      }
    })
  },
  downimage: function () {

    if (resultSavePath) {
      wx.showLoading({
        title: '文件下载中',
      })
      //文件下载
      wx.downloadFile({
        url: resultSavePath,
        success:
          function (res) {
            console.log(res);
            //图片保存到本地
            wx.saveImageToPhotosAlbum({
              filePath: res.tempFilePath,
              success: function (data) {
                wx.hideLoading()
                console.log("save success--->" + data);
                wx.showToast({
                  title: '图片已保存',
                })
              },
              fail: function (err) {
                wx.hideLoading()
                console.log(err);
                if (err.errMsg === "saveImageToPhotosAlbum:fail auth deny") {
                  console.log("用户一开始拒绝了，我们想再次发起授权")
                  console.log('打开设置窗口')
                  wx.openSetting({
                    success(settingdata) {
                      console.log(settingdata)
                      if (settingdata.authSetting['scope.writePhotosAlbum']) {
                        console.log('获取权限成功，给出再次点击图片保存到相册的提示。')
                      }
                      else {
                        console.log('获取权限失败，给出不给权限就无法正常使用的提示')
                      }
                    }
                  })
                }
              }
            })
          }
      })
    } else {
      wx.showToast({
        title: '保存失败，请稍后再试',
      })
    }
  },
  
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    
    return {
      title: app.testplay.data.share_title,
      path: '/pages/testplay/testplay',
      imageUrl: app.testplay.data.share_img
    }
  },
})
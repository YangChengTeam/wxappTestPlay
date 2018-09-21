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
    state: 0,
    result_img: '', //https://cj.197854.com/uploads/Testing/5b99b30788441.png
    appInfo: {},
    share_title: '',
    share_img: '',
    test_type: '',
    tid: '',
    is_share: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    console.log(kkconfig.global.userInfo)
    resultImgUrl = options.img_url
    var that = this
    this.setData({
      share_title: options.share_title,
      share_img: options.share_img,
      test_type: options.test_type,
      tid: options.tid,
    })

    co(function*() {
      let res = yield kkservice.getAppInfo()
      if (res && res.data && res.data.code == 1) {
        that.setData({
          result_img: resultImgUrl,
          appInfo: res.data.data,
          is_share: false
        })
      }
    })
  },
  
  loadresult(e) {
    if (this.data.test_type == 1) {
      let w = e.detail.width
      let h = e.detail.height

      let rw = 712
      let rh = parseInt(rw / 750 * h)

      this.setData({
        w: rw,
        h: rh,
        state: 2
      })

    } else {
      let w = e.detail.width
      let h = e.detail.height

      let rh = 750
      let rw = w * 750 / h
      this.setData({
        w: rw,
        h: rh,
        state: 2
      })
    }
  },

  nav2more(e) {
    wx.reLaunch({
      url: "/pages/index/index"
    })
  },

  testAgain: function(e) {
    var isagain = e.currentTarget.dataset.isagain
    console.log('isagain--->' + isagain + '---tid--->' + this.data.tid + '---test_type--->' + this.data.test_type)

    if (isagain == 0) {
      app.navRedirectTest(app.testInfo)
    } else {
      if (this.data.test_type == 1) {
        wx.redirectTo({
          url: '/pages/testplay/testplay?tid=' + this.data.tid + '&test_type=' + this.data.test_type +
            '&share_title=' + this.data.share_title + '&share_img=' + this.data.share_img + '&is_share=1'
        })
      } else {
        wx.redirectTo({
          url: '/pages/testplay2/testplay2?tid=' + this.data.tid + '&test_type=' + this.data.test_type +
            '&share_title=' + this.data.share_title + '&share_img=' + this.data.share_img + '&is_share=1'
        })
      }
    }
  },

  preimage: function(e) {
    wx.previewImage({
      urls: [resultImgUrl],
      current: resultImgUrl
    })
  },

  saveImg: function() {
    var that = this;
    wx.getSetting({
      success(res) {
        console.log(res)
        if (!res.authSetting['scope.writePhotosAlbum']) {
          wx.authorize({
            scope: 'scope.writePhotosAlbum',
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
              } else {
                console.log('获取权限失败，给出不给权限就无法正常使用的提示')
              }
            }
          })
        }
      }
    })
  },
  downimage: function() {

    if (resultSavePath) {
      wx.showLoading({
        title: '文件下载中',
      })
      //文件下载
      wx.downloadFile({
        url: resultSavePath,
        success: function(res) {
          console.log(res);
          //图片保存到本地
          wx.saveImageToPhotosAlbum({
            filePath: res.tempFilePath,
            success: function(data) {
              wx.hideLoading()
              console.log("save success--->" + data);
              wx.showToast({
                title: '图片已保存',
              })
            },
            fail: function(err) {
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
                    } else {
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
  onShareAppMessage: function() {

    var temp_title = this.data.share_title

    if (temp_title.indexOf('#!') > -1) {
      if (kkconfig.global && kkconfig.global.userInfo) {
        temp_title = temp_title.replace('#!', kkconfig.global.userInfo.nickName)
      }
    }

    console.log('处理后sharetitle--->' + temp_title + '---tid-->' + this.data.tid)

    var temp_path
    if (this.data.test_type == 1) {
      temp_path = '/pages/testplay/testplay?tid=' + this.data.tid + '&test_type=' + this.data.test_type +
        '&share_title=' + temp_title + '&share_img=' + this.data.share_img + '&is_share=1'
    } else {
      temp_path = '/pages/testplay2/testplay2?tid=' + this.data.tid + '&test_type=' + this.data.test_type +
        '&share_title=' + temp_title + '&share_img=' + this.data.share_img + '&is_share=1'
    }

    var that = this
    return {
      title: temp_title,
      path: temp_path,
      imageUrl: that.data.share_img
    }
  },
})
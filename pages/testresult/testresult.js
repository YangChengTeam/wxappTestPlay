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
    share_title:'',
    share_img:'',
    test_type:'',
    tid:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(kkconfig.global.userInfo)

    resultImgUrl = options.img_url
    console.log('result tid --->' + options.tid)
    var that = this
    var is_share = options.is_share
    if(is_share && is_share == 1){
      this.setData({
        share_title: options.share_title,
        share_img: options.share_img,
        test_type: options.test_type,
        tid: options.tid,
      })

      co(function* () {
        let res = yield kkservice.getAppInfo()
        if (res && res.data && res.data.code == 1) {
          that.setData({
            result_img: resultImgUrl,
            appInfo: res.data.data,
            is_share:true
          })
        }
      })
    }else{
      resultSavePath = options.save_img_url
      console.log('save path--->' + resultSavePath)
      this.setData({
        share_title: app.testplay.data.share_title,
        share_img: app.testplay.data.share_img,
        test_type: app.testInfo.test_type,
        tid: app.testInfo.id,
        is_share:false,
        result_img: resultImgUrl,
        appInfo: app.index.data.appInfo
      })
    }
  },

  loadresult(e){
      let w = e.detail.width
      let h = e.detail.height
      let margin = 80
      let border = 15
      if( w > 750 - 190 ){
         w = 560
         h = parseInt(560/750 * h)
      }
      this.setData({
         w: w,
         h: h
      })
  },

  testAgain:function(e){
    var isagain = e.currentTarget.dataset.isagain
    console.log('isagain--->' + isagain + '---tid--->' + this.data.tid)

    if (isagain == 0){
        app.navRedirectTest(app.testInfo)
    }else{
      if(this.data.test_type == 1){
        wx.redirectTo({
          url: '/pages/testplay/testplay?tid=' + this.data.tid+ '&test_type=' + this.data.test_type
        })
      }else{
        
        wx.redirectTo({
          url: '/pages/testplay2/testplay2?tid=' + this.data.tid + '&test_type=' + this.data.test_type
        })
      }
    }
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

    var temp_title = this.data.share_title
   
    if(temp_title.indexOf('#!') > -1){
      if (kkconfig.global && kkconfig.global.userInfo){
        temp_title = temp_title.replace('#!', kkconfig.global.userInfo.nickName)
      }
    }

    console.log('处理后sharetitle--->' + temp_title + '---tid-->' + this.data.tid)

    var that = this
    return {
      title: temp_title,
      path: '/pages/testresult/testresult?img_url=' + resultImgUrl + '&save_img_url=' + resultSavePath + '&is_share=1&share_title=' + temp_title + '&share_img=' + that.data.share_img + '&test_type=' + that.data.test_type + '&tid=' + that.data.tid,
      imageUrl: that.data.share_img
    }
  },
})
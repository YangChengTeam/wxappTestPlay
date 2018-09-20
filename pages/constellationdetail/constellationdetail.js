// pages/constellation_detail/constellation_detail.js
const app = getApp()

const regeneratorRuntime = global.regeneratorRuntime = require('../../libs/runtime')
const co = require('../../libs/co')
const kkservice = require("../../libs/yc/yc-service.js")
const kkconfig = require("../../libs/yc/yc-config.js")
const kkcommon = require("../../libs/yc/yc-common.js")
var starLuckInfo
var week_starLuckInfo
var month_starLuckInfo

Page({

  /**
   * 页面的初始数据
   */
  data: {
    state: 0,
    comp_starts: ['1', '2', '3', '4', '5'],
    star_normal: '../../assets/images/star_normal.png',
    star_current: '../../assets/images/star_current_num.png',
    type_img: ['t0.png','t1.png', 't2.png', 't3.png', 't4.png', 't5.png'],
    type_name: ['今日提醒','综合评语', '爱情运势', '事业运势', '财富运势', '健康运势'],
    type_color: ['#ff6562', '#7234e1', '#f7709d', '#0494e2', '#ffcc00', '#4ccb52'],
    currentData: 0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this
    starLuckInfo = app.index.data.starLuckInfo

    let temp_list = starLuckInfo.list
    for (let i = 0; i < temp_list.length; i++) {
      temp_list[i]['type_img'] = '../../assets/images/' + this.data.type_img[i]
      temp_list[i]['type_name'] = this.data.type_name[i]
      temp_list[i]['type_color'] = this.data.type_color[i]
    }

    var mtop = app.totalTopHeight * 750 / app.systemInfo.windowWidth + 100
    
    setTimeout(function(){
      that.setData({
        state:2
      })
    },500)

    this.setData({
      starLuckInfo: starLuckInfo,
      totalTopHeight: app.totalTopHeight,
      starInfo: app.index.data.starInfo,
      comp_index: starLuckInfo.hui.zhzs / 20,
      love_index: starLuckInfo.hui.aqzs / 20,
      career_index: starLuckInfo.hui.syzs / 20,
      money_index: starLuckInfo.hui.cfzs / 20,
      fortune_list: temp_list,
      margin_top: mtop
    })
    this.loadWeekStarData()
    this.loadMonthStarData()
  },

  loadWeekStarData: function() {
    var that = this
    co(function*() {
      let userInfo = kkconfig.global.userInfo
      let res = yield kkservice.starIndex(app.index.data.starInfo.name, "week", userInfo && userInfo.gender == 1 ? "boy" : "girl")
      week_starLuckInfo = res.data.data
      if (week_starLuckInfo && week_starLuckInfo.intro) {
        week_starLuckInfo.intro.forEach((v, k) => {
          week_starLuckInfo.intro[k] = v.split("：")[1]
        })
      }

      let temp_list = week_starLuckInfo.list
      
      for (let i = 0; i < temp_list.length; i++) {
        if(i==0){
          that.data.type_name[i] = '温馨短评'
        }
        temp_list[i]['type_img'] = '../../assets/images/' + that.data.type_img[i]
        temp_list[i]['type_name'] = that.data.type_name[i]
        temp_list[i]['type_color'] = that.data.type_color[i]
      }

      that.setData({
        week_starLuckInfo: week_starLuckInfo,
        week_comp_index: week_starLuckInfo.hui.zhzs / 20,
        week_love_index: week_starLuckInfo.hui.aqzs / 20,
        week_career_index: week_starLuckInfo.hui.syzs / 20,
        week_money_index: week_starLuckInfo.hui.cfzs / 20,
        week_fortune_list: temp_list,
      })
    })
  },

  loadMonthStarData: function () {
    var that = this
    co(function* () {
      let userInfo = kkconfig.global.userInfo
      let res = yield kkservice.starIndex(app.index.data.starInfo.name, "month", userInfo && userInfo.gender == 1 ? "boy" : "girl")
      month_starLuckInfo = res.data.data
      if (month_starLuckInfo && month_starLuckInfo.intro) {
        month_starLuckInfo.intro.forEach((v, k) => {
          month_starLuckInfo.intro[k] = v.split("：")[1]
        })
      }

      let temp_list = month_starLuckInfo.list
      if (temp_list.length>5){
        temp_list = temp_list.splice(0,5)
      }
      
      for (let i = 0; i < temp_list.length; i++) {
        if (i == 0) {
          that.data.type_name[i] = '温馨短评'
        }
        temp_list[i]['type_img'] = '../../assets/images/' + that.data.type_img[i]
        temp_list[i]['type_name'] = that.data.type_name[i]
        temp_list[i]['type_color'] = that.data.type_color[i]
      }

      that.setData({
        month_starLuckInfo: month_starLuckInfo,
        month_comp_index: month_starLuckInfo.hui.zhzs / 20,
        month_love_index: month_starLuckInfo.hui.aqzs / 20,
        month_career_index: month_starLuckInfo.hui.syzs / 20,
        month_money_index: month_starLuckInfo.hui.cfzs / 20,
        month_fortune_list: temp_list,
      })
    })
  },

  //点击切换，滑块index赋值
  checkCurrent: function(e) {
    
    let index = e.currentTarget.dataset.current
    if (this.data.currentData === index) {
      return false;
    }

    this.setData({
      currentData: index,
    })
    
  },
  /*** 滑动切换tab***/
  bindChange: function(e) {
    var that = this;
    that.setData({
      currentData: e.detail.current
    });
  }
  
})
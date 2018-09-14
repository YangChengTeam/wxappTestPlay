//chat.js
//获取应用实例
const app = getApp()

const regeneratorRuntime = global.regeneratorRuntime = require('../../libs/runtime')
const co = require('../../libs/co')
const kkservice = require("../../libs/yc/yc-service.js")
const kkconfig = require("../../libs/yc/yc-config.js")
const kkcommon = require("../../libs/yc/yc-common.js")

const msgs = require('./subjects.js');
var is_send = false
var current_index = 0
var is_over = false
var user_head_url
var user_name
var result_path
var result_save_path
var is_start = false

var subject_title
var subject_img
var jump_type

var select_sex = -1
var test_info

Page({
  data: {
    messages: [], // 聊天记录
    msg: '', // 当前输入
    scrollTop: 0, // 页面的滚动值
    lastId: '', // 最后一条消息的ID
    totalTopHeight: 0,
    test_state: 0,
    share_title: '',
    share_img: '',
    sexs: [{
      name: '男',
      value: '0'
    }, {
      name: '女',
      value: '1'
    }],
    tid: '',
    test_type: ''
  },
  onLoad(option) {
    current_index = 0
    is_over = false
    is_send = false
    is_start = false
    result_path = ''
    result_save_path = ''
    wx.setNavigationBarTitle({
      title: '你的荣格心理原型'
    });
  },
  //事件处理函数
  onReady() {

    this.setData({
      totalTopHeight: app.totalTopHeight
    })

    test_info = app.testInfo
    if (test_info) {
      this.data.tid = test_info.id
      this.data.test_type = test_info.test_type
    } else {
      this.data.tid = options.tid
      this.data.test_type = options.test_type
    }

    var that = this
    co(function*() {
      let res = yield kkservice.testTypeInfoView(that.data.tid, that.data.test_type)
      console.log(res)
      if (res && res.data && res.data.code == 1) {
        subject_title = res.data.data.desc
        subject_img = res.data.data.image
        if (res.data.sex == 0) {
          current_index = 1
        } else {
          current_index = 0
        }
        that.setData({
          share_title: res.data.data.share_title[0],
          share_img: res.data.data.share_ico[0]
        })

        that.guide();
      }
    })

  },

  //引导语
  guide: function() {
    let messages = this.data.messages;

    let options = []
    let option_item1 = {
      sub_type: 0,
      sub_value: subject_title
    }
    let option_item2 = {
      sub_type: 1,
      sub_value: subject_img
    }
    let option_item3 = {
      sub_type: 0,
      sub_value: '开始测试'
    }
    options.push(option_item1)
    options.push(option_item2)
    options.push(option_item3)

    const add_data = {
      id: `msg${messages.length}`,
      sub_title: '',
      messageType: 2,
      url: '../../assets/images/logo.png',
      options: options
    };

    messages.push(add_data);
    let temp_lastId = messages[messages.length - 1].id;
    this.setData({
      messages,
      temp_lastId
    });
    // 延迟页面向顶部滑动
    this.delayPageScroll();
  },

  start: function() {
    let messages = this.data.messages;
    let add_start_data = {
      id: `msg${messages.length}`,
      sub_title: '开始测试',
      messageType: 0,
      url: '../../assets/images/logo.png'
    };

    messages.push(add_start_data);

    let temp_lastId = messages[messages.length - 1].id;
    this.setData({
      messages,
      temp_lastId,
      user_head_url,
      test_state: 1
    });

    is_send = true

    // 延迟页面向顶部滑动
    this.delayPageScroll();
  },

  // 延迟页面向顶部滑动
  delayPageScroll() {
    this.data.msg = ''
    const messages = this.data.messages;
    const lastId = messages[messages.length - 1].id;

    setTimeout(() => {
      this.setData({
        lastId
      });
      if (is_send) {
        this.receive();
      }
    }, 500);

    if (is_over) {
      this.createResult();
    }
  },

  // 输入
  onInput(event) {
    const value = event.detail.value;
    user_name = value
    this.setData({
      msg: value
    });
  },
  // 聚焦
  onFocus() {
    this.setData({
      scrollTop: 9999999
    });
  },
  // 发送消息
  send: function() {
    let messages = this.data.messages;
    let nums = messages.length;
    let msg = this.data.msg;

    if(select_sex > -1){
      this.setData({
        test_state: 2
      })
    }else{
      wx.showToast({
        title: '请选择性别',
        icon: 'none'
      })
      return false;
    }

    if (msg === '') {
      wx.showToast({
        title: '请输入姓名',
        icon: 'none'
      })
      return false;
    }

    const add_data = {
      id: `msg${++nums}`,
      sub_title: msg,
      messageType: 0,
      url: '../../assets/images/5.png'
    };

    messages.push(add_data);
    const length = messages.length;
    let temp_lastId = messages[length - 1].id;
    this.setData({
      messages,
      temp_lastId
    });
    is_send = true

    current_index++

    // 延迟页面向顶部滑动
    this.delayPageScroll();
  },
  receive() {
    let messages = this.data.messages;
    let nums = messages.length;

    if (current_index > 1) {
      this.setData({
        test_state: 3
      });
    }
    var add_data = ''
    if (this.data.test_state < 3) {
      add_data = msgs[current_index]
    } else if (this.data.test_state == 3) {
      is_send = false;
      add_data = {
        id: `msg${++nums}`,
        sub_title: '正在为您分析结果，请耐心等待几秒...',
        messageType: 1,
        url: '../../assets/images/logo.png'
      };
      is_over = true
    }

    messages.push(add_data);
    const length = messages.length;
    let temp_lastId = messages[length - 1].id;
    this.setData({
      messages,
      temp_lastId
    });
    is_send = false
    // 延迟页面向顶部滑动
    this.delayPageScroll();
  },

  radioChange: function(e) {
    console.log(e.detail.value)
    select_sex = e.detail.value
    this.data.msg = e.detail.value == 0 ? '男' : '女'
    
    //this.send()
  },

  onGotUserInfo: function(res) {
    if (is_start) {
      return
    }

    is_start = true
    var that = this
    console.log(res.detail)
    user_head_url = res.detail.userInfo.avatarUrl
    user_name = res.detail.userInfo.nickName
    if (app.isLogin) {
      that.start();
    } else {
      app.login(res.detail, "", function() {
        that.start();
      });
    }
  },

  createResult: function() {

    wx.showLoading({
      title: '正在测试',
    })
    var that = this
    co(function*() {
      let res = yield kkservice.testTextResult(that.data.tid, that.data.test_type, '', user_name, user_head_url, select_sex)
      console.log(res)
      if (res && res.data && res.data.code == 1) {
        wx.hideLoading()

        let messages = that.data.messages;
        let nums = messages.length;
        result_path = res.data.data.image_nocode
        result_save_path = res.data.data.image
        const result_data = {
          id: `msg100`,
          sub_title: '',
          messageType: 3,
          result_path: result_path,
          url: '../../assets/images/logo.png'
        };

        messages.push(result_data);
        let temp_lastId = messages[messages.length - 1].id;

        setTimeout(() => {
          that.setData({
            messages,
            lastId: temp_lastId,
            test_state: 4
          });
        }, 500);

      } else {
        wx.hideLoading()
        wx.showToast({
          title: '测试结果失败，请重试',
          icon: 'none'
        })
      }
    })

  },

  toResult: function() {
    wx.navigateTo({
      url: '/pages/testresult/testresult?img_url=' + result_path + '&save_img_url=' + result_save_path,
    })
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {
    var that = this
    return {
      title: that.data.share_title,
      path: '/pages/testplay2/testplay2?tid=' + that.data.tid + '&test_type=' + that.data.test_type,
      imageUrl: that.data.share_img
    }
  },
})
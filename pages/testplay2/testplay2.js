//chat.js
//获取应用实例
const app = getApp()

const regeneratorRuntime = global.regeneratorRuntime = require('../../libs/runtime')
const co = require('../../libs/co')
const kkservice = require("../../libs/yc/yc-service.js")
const kkconfig = require("../../libs/yc/yc-config.js")
const kkcommon = require("../../libs/yc/yc-common.js")

var msgs = require('./subjects.js');
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
var show_sex = true
var is_share
Page({
  data: {
    kbHeight: 0,
    state: 0,
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
    test_type: '',
    radio: [{
        'index_num': 0,
        'value': '男'
      },
      {
        'index_num': 1,
        'value': '女'
      }
    ],
    sex_normal: '../../assets/images/sex_normal.png',
    sex_checked: '../../assets/images/sex_checked.png'
  },

  onLoad(options) {
    current_index = 0
    is_over = false
    is_send = false
    is_start = false
    result_path = ''
    result_save_path = ''

    app.testplay = this
    if (!app.totalTopHeight) {
      let thiz = this
      wx.getSystemInfo({
        success: function (res) {
          let totalTopHeight = 68
          if (res.model.indexOf('iPhone X') !== -1) {
            totalTopHeight = 88
          } else if (res.model.indexOf('iPhone') !== -1) {
            totalTopHeight = 64
          }
          app.systemInfo = res
          app.totalTopHeight = totalTopHeight
          app.statusBarHeight = res.statusBarHeight
          app.titleBarHeight = totalTopHeight - res.statusBarHeight
          thiz.setData({
            totalTopHeight: app.totalTopHeight,
            statusBarHeight: app.statusBarHeight,
            titleBarHeight: app.titleBarHeight,
          })
        }
      })
    }else{
      this.setData({
        totalTopHeight: app.totalTopHeight
      })
    }

    if (options.is_share) {
      console.log('test play2 options info ---->')
      is_share = options.is_share
      this.setData({
        tid: options.tid,
        test_type: options.test_type,
        share_img: options.share_img || '',
        share_title: options.share_title || '',
      })
    } else {
      console.log('test play2 app testinfo ---->')
      test_info = app.testInfo
      this.setData({
        tid: test_info.id,
        test_type: test_info.test_type
      })
    }

    var that = this
    co(function*() {
      let res = yield kkservice.testTypeInfoView(that.data.tid, that.data.test_type)
      console.log(res)
      if (res && res.data && res.data.code == 1) {
        subject_title = res.data.data.desc
        subject_img = res.data.data.image
        if (res.data.data.sex == 0) {
          current_index = 1
          show_sex = false
        } else {
          current_index = 0
          show_sex = true
        }
        that.setData({
          state: kkconfig.status.stateStatus.NORMAL,
          share_title: res.data.data.share_title[0],
          share_img: res.data.data.share_ico[0]
        })

        that.guide();
      } else {
        that.setData({
          state: kkconfig.status.stateStatus.NODATA
        })
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

    let add_data = {
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
      user_head_url
    });

    is_send = true
    // 延迟页面向顶部滑动
    this.delayPageScroll();
  },

  // 延迟页面向顶部滑动
  delayPageScroll() {
    this.data.msg = ''
    this.setData({
      msg: ''
    })
    let messages = this.data.messages;
    let lastId = messages[messages.length - 1].id;
    var that = this
    setTimeout(() => {
      that.totop(current_index)
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
    let value = event.detail.value;
    user_name = value
    this.setData({
      msg: value
    });
  },
  // 聚焦
  onFocus(e) {
    let height = e.detail.height
    this.setData({
      kbHeight: height
    })
  },
  blur(e) {
    this.setData({
      kbHeight: 0
    })
  },
  totop(index) {
    wx.pageScrollTo({
      scrollTop: 400 * index,
      duration: 0
    })
  },

  // 发送消息
  send: function() {
    let messages = this.data.messages;
    let nums = messages.length;
    let msg = this.data.msg;

    if (select_sex > -1) {
      this.setData({
        test_state: 2
      })
    } else {
      if (show_sex) {
        wx.showToast({
          title: '请选择性别',
          icon: 'none'
        })
        return false;
      }
    }

    if (msg === '') {
      wx.showToast({
        title: '请输入姓名',
        icon: 'none'
      })
      return false;
    }

    let add_data = {
      id: `msg${++nums}`,
      sub_title: msg,
      messageType: 0,
      url: '../../assets/images/5.png'
    };

    messages.push(add_data);
    let length = messages.length;
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
      this.setData({
        test_state: show_sex && this.data.test_state < 2 ? 1 : 2
      })
      console.log('state--->' + this.data.test_state)
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
    let length = messages.length;
    let temp_lastId = messages[length - 1].id;
    this.setData({
      messages,
      temp_lastId,
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
      app.login("", function() {
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
        let result_data = {
          id: `msg100`,
          sub_title: '',
          messageType: 3,
          result_path: result_path,
          url: '../../assets/images/logo.png'
        };

        let look_result_data = {
          id: `msg101`,
          sub_title: '点击图片查看结果',
          messageType: 1,
          url: '../../assets/images/logo.png'
        }

        messages.push(result_data)
        messages.push(look_result_data)

        let temp_lastId = messages[messages.length - 1].id;

        setTimeout(() => {
          that.setData({
            messages,
            lastId: temp_lastId,
            test_state: 4,
            is_over: is_over
          });
          that.totop(current_index)
        }, 500);

      } else if (res && res.data && res.data.code == -1) {
        console.log('code--->' + res.data.code)
        wx.hideLoading()
        wx.showToast({
          title: '输入内容含有敏感词，请重新输入',
          icon: 'none'
        })
      
        let messages = that.data.messages;
        let nums = messages.length;

        var add_data = {
            id: `msg${++nums}`,
            sub_title: '输入内容含有敏感词，请重新输入',
            messageType: 1,
            url: '../../assets/images/logo.png'
        };
        
        messages.push(add_data);
        current_index++
        is_over = false
        setTimeout(() => {
          that.setData({
            messages,
            test_state: 2,
            is_over: is_over
          });
          that.totop(current_index)
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
    wx.redirectTo({
      url: '/pages/testresult/testresult?tid=' + this.data.tid + '&test_type=' + this.data.test_type + '&img_url=' + result_path + '&save_img_url=' + result_save_path + '&share_title=' + this.data.share_title + '&share_img=' + this.data.share_img,
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
  //单选
  getradio: function(e) {
    let index = e.currentTarget.dataset.id;
    let radio = this.data.radio;
    for (let i = 0; i < radio.length; i++) {
      this.data.radio[i].checked = false;
    }
    if (radio[index].checked) {
      this.data.radio[index].checked = false;
    } else {
      this.data.radio[index].checked = true;
    }
    // let userRadio = radio.filter((item, index) => {
    //   return item.checked == true;
    // })
    this.setData({
      radio: this.data.radio
    })
    //console.log(userRadio)

    let index_num = this.data.radio[index].index_num
    console.log(index_num)

    select_sex = index_num
    this.data.msg = index_num == 0 ? '男' : '女'
  }
})
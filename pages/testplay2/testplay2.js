//chat.js
//获取应用实例
const app = getApp()
const msgs = require('./subjects.js');
var is_send = false
var current_index = 0
var is_over = false
var user_head_url
var result_path
var result_save_path
var is_start = false
Page({
  data: {
    messages: [], // 聊天记录
    msg: '', // 当前输入
    scrollTop: 0, // 页面的滚动值
    socketOpen: false, // websocket是否打开
    lastId: '', // 最后一条消息的ID
    isFirstSend: true, // 是否第一次发送消息(区分历史和新加),
    is_input_name: false,
    left_btn_name: '日出',
    right_btn_name: '日落',
    totalTopHeight:0,
    test_state:0,
    sexs:[
      {
        name:'男',
        value:'0'
      },
      {
        name: '女',
        value: '1'
      }
    ]
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
    this.connect();
    this.setData({
      totalTopHeight: app.totalTopHeight
    })
  },

  start: function () {
    current_index++
    let lastId = msgs[current_index].id;
    let messages = this.data.messages;
    messages.push(msgs[current_index])

    console.log('head url --->' + user_head_url)
    this.setData({
      messages,
      user_head_url,
      test_state:1
    });

    // 延迟页面向顶部滑动
    this.delayPageScroll();
  },
  connect: function () {
    const isFirstSend = this.data.isFirstSend;

    let messages = this.data.messages;
    let lastId = '';

    if (isFirstSend) {
      console.log('is first--->')
      //messages = msgs;
      console.log(messages[current_index])

      lastId = msgs[current_index].id;
      messages.push(msgs[current_index])
      this.setData({
        messages,
        isFirstSend: false
      });
      // 延迟页面向顶部滑动
      this.delayPageScroll();
    } else {
      messages.push(msgs[current_index]);
      const length = messages.length;
      lastId = messages[length - 1].id;
      this.setData({
        messages,
        lastId
      });
    }
  },
  // 延迟页面向顶部滑动
  delayPageScroll() {
    console.log('delayPageScroll--->' + current_index)
    this.data.msg = ''
    const messages = this.data.messages;
    const length = messages.length;
    const lastId = messages[length - 1].id;
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
  send() {

    let messages = this.data.messages;
    let nums = messages.length;
    let msg = this.data.msg;

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

    console.log('before current_index --->' + current_index)
    current_index++

    // 延迟页面向顶部滑动
    this.delayPageScroll();
  },
  receive() {
    let messages = this.data.messages;
    let nums = messages.length;

    var add_data = ''

    if (current_index < 3) {
      add_data = msgs[current_index]
    } else if (current_index == 3) {
      is_send = false;
      add_data = {
        id: `msg${++nums}`,
        sub_title: '正在为您分析结果，请耐心等待几秒...',
        messageType: 1,
        url: '../../assets/images/logo.png'
      };
      this.setData({
        msg: '',
        test_state: 3
      });
    } else {
      add_data = {
        id: `msg${++nums}`,
        sub_title: 'OK',
        sub_title1: '正在分析你的人格原型',
        messageType: 1,
        url: '../../assets/images/logo.png'
      };
      console.log('current-index--->' + current_index)
      is_over = true
      this.setData({
        is_input_name: false
      });
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

  radioChange:function(e){
    console.log(e.detail.value)
    this.data.msg = e.detail.value == 0 ? '男':'女'
    this.setData({
      test_state:2
    })
    this.send()
  },

  choose: function (e) {
    var snum = e.currentTarget.dataset.snum

    console.log(e.currentTarget.dataset.options_item)
    var cindex = e.currentTarget.dataset.options_item

    if (snum != (current_index + 1)) {
      return
    }

    var temp_str
    switch (cindex) {
      case 1:
        temp_str = '你选择了：日出'
        break;
      case 2:
        temp_str = '你选择了：日落'
        break;
      case 3:
        temp_str = '你选择了：女孩'
        break;
      case 4:
        temp_str = '你选择了：狼'
        break;
      case 5:
        temp_str = '你选择了：自由歌唱'
        break;
      case 6:
        temp_str = '你选择了：唱你爱听的'
        break;
    }
    this.data.msg = temp_str
    this.send()
  },

  onGotUserInfo: function (e) {

    if (is_start) {
      return
    }

    is_start = true

    var that = this

    wx.getStorage({
      key: 'user_info',
      success: function (res) {
        var userInfo = res.data
        user_head_url = userInfo.avatarUrl
        that.start();
      },
      fail: function (res) {

        wx.login({
          success: function (res) {
            wx.getUserInfo({
              lang: "zh_CN",
              success: function (userRes) {
                console.log("用户已授权")
                console.log(userRes.userInfo)
                if (null != userRes && null != userRes.userInfo) {
                  user_head_url = userRes.userInfo.avatarUrl
                  wx.setStorage({
                    key: 'user_info',
                    data: userRes.userInfo
                  })

                  that.start();
                }
              }
            })
          }
        })
      }
    })
  },

  createResult: function () {
    var that = this;
    console.log(that.data.msg + '---' + user_head_url)
    wx.request({
      url: 'https://cj.198254.com/api/water/renge',
      method: 'POST',
      data: {
        'app_id': 36,
        'username': that.data.msg,
        'headimg': user_head_url
      },
      success: function (res) {
        console.log(res.data)

        if (res.data.code == 1) {

          let messages = that.data.messages;
          let nums = messages.length;
          result_path = res.data.image_s
          result_save_path = res.data.image
          const result_data = {
            id: `msg${++nums}`,
            sub_title: '',
            messageType: 3,
            result_path: result_path,
            url: '../../assets/images/5.png'
          };
          //console.log('nums' + nums)
          messages.push(result_data);
          const length = messages.length;
          let temp_lastId = messages[length - 1].id;
          that.setData({
            messages,
            temp_lastId
          });
          that.toResult();
        } else if (res.data.code == -1) {
          wx.showToast({
            title: '含有敏感词，请重新输入',
            icon: 'none'
          })
          that.setData({
            is_input_name: true
          });
        } else {
          wx.showToast({
            title: '性格分析失败，请重试',
            icon: 'none'
          })
          that.setData({
            is_input_name: true
          });
        }

      }
    })
  },

  toResult: function () {
    wx.navigateTo({
      url: '/pages/result/result?result_path=' + result_path + '&save_path=' + result_save_path
    })
  }

})
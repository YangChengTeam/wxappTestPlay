//chat.js
//获取应用实例
const app = getApp()
const msgs = [];
var is_send = false
var current_index = 0
var is_over = false
var user_head_url
var user_name
var result_path
var result_save_path
var is_start = false

const regeneratorRuntime = global.regeneratorRuntime = require('../../libs/runtime')
const co = require('../../libs/co')
const kkservice = require("../../libs/yc/yc-service.js")
const kkconfig = require("../../libs/yc/yc-config.js")
const kkcommon = require("../../libs/yc/yc-common.js")

var subject_title
var subject_img
var jump_type
var result_id

var test_info

Page({
  data: {
    messages: [], // 聊天记录
    msg: '', // 当前输入
    scrollTop: 0, // 页面的滚动值
    socketOpen: false, // websocket是否打开
    lastId: '', // 最后一条消息的ID
    isFirstSend: true, // 是否第一次发送消息(区分历史和新加),
    is_input_name: false,
    totalTopHeight: 0,
    test_state: 0,
    share_title:'',
    share_img:'',
    tid:'',
    test_type:''
  },
  onLoad(option) {
    current_index = 0
    is_over = false
    is_send = false
    is_start = false
    result_path = ''
    result_save_path = ''
    wx.setNavigationBarTitle({
      title: '心理测试库'
    });

    app.testplay = this
  },

  //事件处理函数
  onReady:function(options) {
    
    this.setData({
      totalTopHeight: app.totalTopHeight
    })
    
    test_info = app.testInfo
    if(test_info){
      this.data.tid = test_info.id
      this.data.test_type = test_info.test_type
    }else{
      this.data.tid = options.tid
      this.data.test_type = options.test_type
    }

    var that = this
    co(function* () {
      let res = yield kkservice.testTypeInfoView(that.data.tid, that.data.test_type)
      console.log(res)
      if (res && res.data && res.data.code == 1) {
        subject_title = res.data.data.desc
        subject_img = res.data.data.image
        that.setData({
          share_title: res.data.data.share_title[0],
          share_img: res.data.data.share_ico[0]
        })
        that.recombineData(res.data.data.list)
        that.guide();
      }
    })
  },

  //重新封装结果数据
  recombineData: function (result) {
    let questions = result.question
    console.log(questions)
    let answers = result.answer
    let jumps = result.jump

    for (let i = 0; i < questions.length; i++) {

      var temp_answers = answers[i]
      var temp_jump = jumps[i].jump_question
      var choose_answers = jumps[i].jump_answer

      var options = []

      for (let m = 0; m < temp_answers.length; m++) {
        var temp_option_item = {
          option_value: temp_answers[m],
          option_jump_num: temp_jump[m],
          result_answer_id: choose_answers[m],
        }
        options.push(temp_option_item)
      }

      let subject_item_data = {
        id: `msg${(i + 1) * 2 + 1}`,
        sub_title: questions[i],
        messageType: 1,
        url: '../../assets/images/logo.png',
        jump_type: jumps[i].jump_type,
        current_select_index: -1,
        options: options
      }

      msgs.push(subject_item_data)
    }
    console.log(msgs)
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
      test_state:1
    });

    is_send = true

    // 延迟页面向顶部滑动
    this.delayPageScroll();
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
      id: `msgmsg${messages.length}`,
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

  // 延迟页面向顶部滑动
  delayPageScroll() {

    console.log('delayPageScroll--->' + current_index)

    const messages = this.data.messages;
    const length = messages.length;
    const lastId = messages[length - 1].id;
    var that = this 
    setTimeout(() => {
      that.setData({
        lastId
      });
      if (is_send) {
        that.receive();
      }
    }, 500);
    
    if (is_over) {
      //this.createResult();
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
  send:function() {

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
      id: `msg${++nums }`,
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
    // 延迟页面向顶部滑动
    this.delayPageScroll();
  },

  receive() {
    let messages = this.data.messages;
    let nums = messages.length;

    var add_data = ''
    if (current_index < msgs.length) {
      add_data = msgs[current_index]
      jump_type = add_data.jump_type
      console.log(add_data)
    } else if (current_index == msgs.length) {
      is_send = false;
      add_data = {
        id: `msg10000`,
        sub_title: '好啦~题目已答完，请点击提交',
        messageType: 1,
        url: '../../assets/images/logo.png'
      };
      is_over = true
      this.setData({
        msg: '',
        test_state: 2,
        is_over:true
      });
    } else {
      add_data = {
        id: `msg${++nums}`,
        sub_title: 'OK',
        sub_title1: '正在分析你的人格原型',
        messageType: 1,
        url: '../../assets/images/logo.png'
      };
      
      is_over = true
      this.setData({
        is_input_name: false
      });
    }

    messages.push(add_data);
    let temp_lastId = messages[messages.length - 1].id;
    this.setData({
      messages,
      temp_lastId
    });
    is_send = false
    // 延迟页面向顶部滑动
    this.delayPageScroll();
  },

  choose: function(e) {
    let item = e.currentTarget.dataset.item
    console.log('i--->' + e.currentTarget.dataset.i)
    this.data.msg = e.currentTarget.dataset.selectvalue
    var i = e.currentTarget.dataset.i
    
    if(this.data.messages){
      var temp_item = this.data.messages[this.data.messages.length-1]
      console.log(temp_item)
      temp_item.current_select_index = i
      
      this.setData({
        messages: this.data.messages
      })
    }

    if (item.option_jump_num){
      let temp_index = parseInt(item.option_jump_num)
      current_index = temp_index - 1
    }

    if (jump_type == 2 && !item.option_jump_num) {
      result_id = item.result_answer_id
      current_index = msgs.length
      this.setData({
        test_state: 2
      });
    }

    this.send()
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
    if(app.isLogin){
      that.start();
    } else {
      app.login(res.detail, "", function () {
          that.start();
      });
    }
  },

  createResult: function() {
    wx.showLoading({
      title: '正在测试',
    })
    var that = this
    co(function* () {
      let res = yield kkservice.testTextResult(that.data.tid, that.data.test_type,result_id,user_name,user_head_url,0)
      console.log(res)
      if (res && res.data && res.data.code == 1) {
        wx.hideLoading()
        wx.navigateTo({
          url: '/pages/testresult/testresult?img_url=' + res.data.data.image_nocode + '&save_img_url=' + res.data.data.image,
        })
      }else{
        wx.hideLoading()
        wx.showToast({
          title: '测试结果失败，请重试',
          icon:'none'
        })
      }
    })
  },

  toResult: function() {
    wx.navigateTo({
      url: '/pages/result/result?result_path=' + result_path + '&save_path=' + result_save_path
    })
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    var that = this
    return {
      title: that.data.share_title,
      path: '/pages/testplay/testplay?tid='+that.data.tid + '&test_type='+ that.data.test_type,
      imageUrl: that.data.share_img
    }
  },
})
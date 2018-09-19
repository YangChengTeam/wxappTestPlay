// components/nav/nav.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    is_back: {
      type: Boolean,
      value: false
    },
    back_icon_path: {
      type: String,
      value: 'back.png'
    },
    title: {
      type: String,
      value: ''
    },
    color: {
      type: String,
      value: '#000'
    },
    background: {
      type: String,
      value: '#fff'
    },
    path: {
      type: String,
      value: ''
    },
    ishidenod: {
      type: Number,
      value: 1
    }
  },
  ready() {
    let thiz = this
    setTimeout(function(){
      thiz.setData({
        ...thiz.properties.title,
        hidden: false
      })
    }, 20)
  },
  data: {
    hidden: true
  },
  /**
   * 组件的方法列表
   */
  methods: {
    navigateBack(e) {
      if (this.properties.path) {
        wx.redirectTo({
          url: this.properties.path,
        })
      } else {
        wx.navigateBack({

        })
      }
    }
  }
})

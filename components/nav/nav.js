// components/nav/nav.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    is_back: {
      type: Boolean,
      value: false,
      observer: function (newVal, oldVal, changedPath) {

      }
    },
    back_icon_path: {
      type: String,
      value: 'back.png',
      observer: function (newVal, oldVal, changedPath) {

      }
    },
    title: {
      type: String,
      value: '',
      observer: function (newVal, oldVal, changedPath) {

      }
    },
    color: {
      type: String,
      value: '#000',
      observer: function (newVal, oldVal, changedPath) {

      }
    },
    background: {
      type: String,
      value: '#fff',
      observer: function (newVal, oldVal, changedPath) {

      }
    },
    path: {
      type: String,
      value: '',
      observer: function (newVal, oldVal, changedPath) {

      }
    }
  },
  ready() {
    console.log(this.properties)
    this.setData({
      ...this.properties.title
    })
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

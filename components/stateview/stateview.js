// components/stateview/stateview.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    state: {
      type: Number,
      value: 0,
      observer: function (newVal, oldVal, changedPath) {
        this.setData({
          state: newVal
        })
        if (newVal == 2){
          if (this.loading_timer) {
            clearInterval(this.loading_timer)
          }
        }
      }
    },
    title: {
      type: String,
      value: ""
    }
  },
  /**
   * 组件的初始数据
   */
  data: {
    loading_img: "../../assets/images/frame-0.png"
  },
  ready() {
    this.setData({
       ...this.properties
    })
    if (this.properties.state == 0) {
      this.loading()
    }
  },
  detached() {
    if (this.loading_timer) {
      clearInterval(this.loading_timer)
    }
  },
  /**
   * 组件的方法列表
   */
  methods: {
    loading() {
      let n = 0
      this.loading_timer = setInterval(() => {
        n = n > 29 ? 1 : n
        this.setData({
          loading_img: `../../assets/images/frame-${n++}.png`
        })
      }, 1000/30)
    }
  }
})
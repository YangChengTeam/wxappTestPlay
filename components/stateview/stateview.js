// components/stateview/stateview.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    state: {
      type: Number,
      value: 0
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
    loading_img: "../../assets/images/loading1.png"
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
      let n = 1
      this.loading_timer = setInterval(() => {
        n = n > 8 ? 1 : n
        this.setData({
          loading_img: `../../assets/images/loading${n++}.png`
        })
      }, 300)
    }
  }
})
// components/nav/nav.js
const app = getApp()

Component({
  /**
   * 组件的属性列表
   */
  properties: { 
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
    }
  },
  ready(){
    if (app.totalTopHeight && app.statusBarHeight && app.titleBarHeight){
      this.setData({
        totalTopHeight: totalTopHeight,
        statusBarHeight: app.statusBarHeight,
        titleBarHeight: app.titleBarHeight,
        ...this.properties
      })
      return
    }
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
          totalTopHeight: totalTopHeight,
          statusBarHeight: app.statusBarHeight,
          titleBarHeight: app.titleBarHeight
        })
      }
    })
  }
})

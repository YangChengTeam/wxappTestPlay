// components/testplayitem/testplayitem.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
     info: {
        type: Object,
        value: {},
     },
    islast: {
       type: Boolean,
       value: false
    }
  },
  data: {
    iscanusenavigator: false
  },
  ready(e){
    this.setData({
        iscanusenavigator: getApp().canUseNavigator(),
        ...this.properties
    })
  },
  /**
   * 组件的方法列表
   */
  methods: {
    nav2test(e) {
      getApp().nav2test(this.data.info)
    },
    natiageToMiniProgram(e) {
      wx.navigateToMiniProgram({
        appId: e.currentTarget.dataset.appid,
      })
    }
  }
})

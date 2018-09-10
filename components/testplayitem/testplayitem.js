// components/testplayitem/testplayitem.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
     info: {
        type: Object,
        value: {},
     }
  },
  ready(e){
    this.setData({
        ...this.properties
    })
  }
})

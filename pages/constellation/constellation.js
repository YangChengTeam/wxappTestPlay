// pages/constellation.js

Page({

  /**
   * 页面的初始数据
   */
  data: {
    starInfos: [{
      name: "白羊座",
      date: "3.21-4.19",
      date2: "3月21日-4月19日",
      img: "../../assets/images/star1.png"
    }, {
      name: "金牛座",
      date: "4.20-5.20",
      date2: "4月20日-5月20日",
      img: "../../assets/images/star2.png"
    }, {
      name: "双子座",
      date: "5.21-6.21",
      date2: "5月21日-6月21日",
      img: "../../assets/images/star3.png"
    }, {
      name: "巨蟹座",
      date: "6.22-7.22",
      date2: "6月22日-7月22日",
      img: "../../assets/images/star4.png"
    }, {
      name: "狮子座",
      date: "7.23-8.22",
      date2: "7月日23-8月22日",
      img: "../../assets/images/star5.png"
    }, {
      name: "处女座",
      date: "8.23-9.22",
      date2: "8月23日-9月22日",
      img: "../../assets/images/star6.png"
    }, {
      name: "天秤座",
      date: "9.23-10.23",
      date2: "9月23日-10月23日",
      img: "../../assets/images/star7.png"
    }, {
      name: "天蝎座",
      date: "10.24-11.22",
      date2: "10月24日-11月22日",
      img: "../../assets/images/star8.png"
    }, {
      name: "射手座",
      date: "11.23-12.21",
      date2: "11月23日-12月21日",
      img: "../../assets/images/star9.png"
    }, {
      name: "摩羯座",
      date: "12.22-1.19",
      date2: "12月22日-1月19日",
      img: "../../assets/images/star10.png"
    }, {
      name: "水瓶座",
      date: "1.20-2.18",
      date2: "1月20日-2月18日",
      img: "../../assets/images/star11.png"
    }, {
      name: "双鱼座",
      date: "2.19-3.20",
      date2: "2月19日-3月20日",
      img: "../../assets/images/star12.png"
    }]
  },
  selectConstellation(e) {
    let obj = e.currentTarget.dataset.obj
    wx.setStorageSync("constellation", obj)
    getApp().index.switchConstellation(obj)
    wx.showLoading({
      title: '切换中...',
    })
    setTimeout(() => {
      wx.hideLoading()
      wx.navigateBack({

      })
    }, 1000)
  },
  onLoad(e){
     setTimeout(()=>{
       this.setData({
          state: 2
       })
     }, 200)
  }
})
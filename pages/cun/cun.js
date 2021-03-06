// pages/index/index.js
var app = getApp();
var _self;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgUrls: [
      'https://gw.alicdn.com/tfs/TB13kEnx21TBuNjy0FjXXajyXXa-2224-1018.png',
      'https://www.songyanbin.com/public/images/uploadcache/songyanbin/1515591459218.png'
    ],
    indicatorDots: true,
    autoplay: true,
    circular: true,
    interval: 5000,
    duration: 1000,

    category:"",
    orgId:'',
    type:0,
    text: '村务公开',
    src:'../../images/cunw.png'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    _self = this;
    console.log('pppp', options)
    this.setData({
      orgId: options.orgId
    })
    if(options.type == 1) {
      this.setData({
        text: "政务公开",
        src: "../../images/zw.png"
      })
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },
  goList: function (e) {
    this.setData({
      category: e.currentTarget.dataset.category
    })
    wx.navigateTo({
      url: '../list/list?category=' + _self.data.category + '&orgId=' + _self.data.orgId
    })
  },
  goMessage: function () {
    wx.navigateTo({
      url: '../messageList/messageList'
    })
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})